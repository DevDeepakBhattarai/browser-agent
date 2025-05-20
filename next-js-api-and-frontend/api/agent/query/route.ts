import { auth } from "@/server/auth";
import { z } from "zod";
import { LangChainAdapter } from "ai";
import { modelPicker, modelSchema } from "@/lib/modelPickerForWebAgent";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { QUERY_AGENT_SYSTEM_PROMPT } from "@/lib/prompt";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { redis } from "@/lib/redis";
import { env } from "@/env";

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { RPushUpstashChatHistory } from "@/ai/utils/UpstashRedisChatHistory";
const MessageSchema = z.object({
  content: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  createdAt: z.date().optional(),
  data: z
    .object({
      imageURL: z.array(z.string()).optional(),
      model: modelSchema,
      chatId: z.string(),
    })
    .optional(),
});

// Define the request data validator
const reqDataValidator = z.object({
  messages: z.array(MessageSchema),
});

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session) {
    return new Response("You are unauthorized", { status: 401 });
  }

  const reqData = await req.json();
  console.log(reqData);
  let parsedData: z.infer<typeof reqDataValidator>;
  try {
    parsedData = await reqDataValidator.parseAsync(reqData);
  } catch (e) {
    console.log(e);
    return new Response("Unprocessable Data", { status: 422 });
  }

  console.log(parsedData);
  console.log(parsedData.messages.at(-1)?.data);

  const userId = session.user.id;
  const chatId = parsedData.messages.at(-1)!.data!.chatId;
  const model = modelPicker("gpt-4o-mini");
  const images = parsedData.messages.at(-1)?.data?.imageURL ?? [];
  const image_message = images.map((url) => ({
    type: "image_url",
    image_url: url,
  }));

  const MessageHistoryStore = new RPushUpstashChatHistory({
    sessionId: `${userId}-chat-${chatId}`, // Or some other unique identifier for the conversation
    client: redis,
  });

  const memory = new ConversationSummaryBufferMemory({
    memoryKey: "history",
    maxTokenLimit: 300,
    llm: new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      apiKey: env.OPENAI_API_KEY,
    }),
  });

  const existingSummary =
    (await redis.get<string>(`${userId}-summary-${chatId}`)) ?? "";

  await MessageHistoryStore.addUserMessage(parsedData.messages.at(-1)!.content);
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", QUERY_AGENT_SYSTEM_PROMPT],
    ["system", "Current Conversation Summary\n{history}"],
    [
      "user",
      [
        {
          type: "text",
          text: `{query}`,
        },
        ...image_message,
      ],
    ],
  ]);

  const chain = RunnableSequence.from([prompt, model]);
  const stream = await chain.stream({
    query: parsedData.messages.at(-1)?.content,
    history: existingSummary,
  });

  const responseStream = LangChainAdapter.toDataStream(stream, {
    onFinal: async (text) => {
      await MessageHistoryStore.addAIMessage(text);
      const newSummary = await memory.predictNewSummary(
        [
          new HumanMessage(parsedData.messages.at(-1)!.content),
          new AIMessage(text),
        ],
        existingSummary,
      );

      await redis.set(`${userId}-summary-${chatId}`, newSummary);
    },
  });

  return new Response(responseStream);
});
