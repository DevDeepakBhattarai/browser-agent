import { modelPicker, modelSchema } from "@/lib/modelPickerForWebAgent";
import { auth } from "@/server/auth";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { INFO_GATHERER_SYSTEM_PROMPT } from "../../../../lib/prompt";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { type gatherInfoSchema } from "@/lib/schema";
import { redis } from "@/lib/redis";
import { getActionHistory } from "@/lib/actionStorage";

const reqDataValidator = z.object({
  instruction: z.string().min(1),
  page_content: z.string().min(1),
  model: modelSchema,
  objectiveId: z.string(),
});

const outputSchema = z.object({
  page_data: z
    .any()
    .describe("Data extracted form the page based on user's request"),
  is_data_available: z
    .boolean()
    .describe(
      "Boolean indicating weather or not the data is available in the page",
    ),
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
    ["system", INFO_GATHERER_SYSTEM_PROMPT],
    [
      "user",
      `# TEXT CONTENT OF THE PAGE \n """{page_content}""" \n\n # INSTRUCTION \n """{instruction}"""`,
    ],
  ]);

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);

  const chain = RunnableSequence.from([prompt, model, parser]);

  const response = await chain.invoke({
    page_content: parsedData.page_content,
    instruction: parsedData.instruction,
  });
  const history = await getActionHistory(parsedData.objectiveId);
  let lastContentWritingActionIndex = -1;
  const actions = history.actions;

  for (let i = actions.length - 1; i >= 0; i--) {
    if (actions[i]?.operation === "gather_information_from_page") {
      lastContentWritingActionIndex = i;
      break;
    }
  }
  (
    actions[lastContentWritingActionIndex] as z.infer<typeof gatherInfoSchema>
  ).result = response.page_data;

  await redis.set(`objective:${parsedData.objectiveId}`, history);
  console.log(response);
  return Response.json(response);
});
