import { NextResponse } from "next/server";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { z } from "zod";
import { INITIAL_ACTION_SYSTEM_PROMPT } from "../../../../lib/prompt";
import { RunnableSequence } from "@langchain/core/runnables";
import { auth } from "@/server/auth";
import { modelPicker, modelSchema } from "@/lib/modelPickerForWebAgent";
import { initialActionSchema } from "../../../../lib/schema";
import { storeAction } from "@/lib/actionStorage";

const reqBodyValidator = z.object({
  model: modelSchema,
  objective: z.string().min(1, "Request must contain a prompt"),
  objectiveId: z.string(),
});

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session) return new Response("Unauthorized", { status: 401 });

  const requestBody = await req.json();
  let parsedData: z.infer<typeof reqBodyValidator>;
  try {
    parsedData = await reqBodyValidator.parseAsync(requestBody);
  } catch (e) {
    return new Response("Unprocessable Data", { status: 422 });
  }
  console.log(parsedData);

  const model = modelPicker(parsedData.model);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", INITIAL_ACTION_SYSTEM_PROMPT],
    ["user", "Objective: {objective}"],
  ]);

  const parser = StructuredOutputParser.fromZodSchema(initialActionSchema);

  const chain = RunnableSequence.from([prompt, model, parser]);

  const output = await chain.invoke({ objective: parsedData.objective });
  console.log(output);
  const history = {
    actions: [],
    summary: "",
    information: [],
  };
  await storeAction(parsedData.objectiveId, [output], history);
  return NextResponse.json(output);
});
