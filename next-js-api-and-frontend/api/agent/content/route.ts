import { modelPicker, modelSchema } from "@/lib/modelPickerForWebAgent";
import { auth } from "@/server/auth";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { CONTENT_WRITER_SYSTEM_PROMPT } from "../../../../lib/prompt";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { getActionHistory } from "@/lib/actionStorage";
import { type contentWritingSchema } from "@/lib/schema";
import { redis } from "@/lib/redis";

const reqDataValidator = z.object({
  prompt: z.string().min(1),
  model: modelSchema,
  objectiveId: z.string(),
});
const contentSchema = z.object({
  content: z.string().describe("Content based on the user request"),
});

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session) return new Response("Unauthorized", { status: 401 });
  const reqData = await req.json();

  let parsedData: z.infer<typeof reqDataValidator>;
  try {
    parsedData = await reqDataValidator.parseAsync(reqData);
  } catch (e) {
    return new Response("Unprocessable Data", { status: 422 });
  }
  console.log(parsedData);
  const model = modelPicker(parsedData.model);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", CONTENT_WRITER_SYSTEM_PROMPT],
    ["user", `#PROMPT """{prompt}"""`],
  ]);

  const parser = StructuredOutputParser.fromZodSchema(contentSchema);

  const chain = RunnableSequence.from([prompt, model, parser]);

  const response = await chain.invoke({
    prompt: parsedData.prompt,
  });

  const history = await getActionHistory(parsedData.objectiveId);
  let lastContentWritingActionIndex = -1;
  const actions = history.actions;

  for (let i = actions.length - 1; i >= 0; i--) {
    if (actions[i]?.operation === "content_writing") {
      lastContentWritingActionIndex = i;
      break;
    }
  }
  (
    actions[lastContentWritingActionIndex] as z.infer<
      typeof contentWritingSchema
    >
  ).result = response.content;
  const updatedHistory = {
    actions,
    summary: history.summary,
    information: history.information,
  };
  console.log(updatedHistory);
  await redis.set(`objective:${parsedData.objectiveId}`, updatedHistory);
  console.log(response);
  return Response.json(response);
});
