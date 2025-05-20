import { auth } from "@/server/auth";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { File } from "buffer";
import { modelPicker, modelSchema } from "@/lib/modelPickerForWebAgent";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { actionSchema } from "@/lib/schema";
import { ACTION_SYSTEM_PROMPT } from "@/lib/prompt";
import { convertImagesToBase64 } from "@/lib/utils";
import {
  storeAction,
  getActionHistory,
  type ActionHistory,
  storeInformation,
} from "@/lib/actionStorage";

const formValidator = zfd.formData({
  image: z.union([z.instanceof(File), z.array(z.instanceof(File))]),
  html: zfd.text(),
  objective: zfd.text(),
  model: modelSchema,
  objectiveId: zfd.text(),
});

function formatActionHistory(history: ActionHistory): string {
  const formattedActions = history.actions
    .map(
      (action) =>
        `- Operation: ${action.operation} Reason:${action.thought} ${action.operation === "content_writing" || action.operation === "gather_information_from_page" ? `Result ${action.result}` : ""}`,
    )
    .join("\n");

  return `${history.summary ? `- ${history.summary}` : ""}\n ${formattedActions}`;
}

function formatInformation(history: ActionHistory): string {
  const formattedInformation = history.information
    .map((info) => "- " + info)
    .join("\n");
  return formattedInformation;
}
export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  let parsedData: z.infer<typeof formValidator>;

  try {
    parsedData = await formValidator.parseAsync(formData);
  } catch (e) {
    console.error(e);
    return new Response("Unprocessable Data", { status: 422 });
  }

  const base64Images = await convertImagesToBase64(parsedData.image);
  const model = modelPicker(parsedData.model);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", ACTION_SYSTEM_PROMPT],
    [
      "user",
      [
        {
          type: "text",
          text: `#HTML """{html}"""`,
        },
        ...base64Images.map((image) => ({
          type: "image_url",
          image_url: image,
        })),
      ],
    ],
  ]);
  const history = await getActionHistory(parsedData.objectiveId);
  const formattedHistory = formatActionHistory(history);
  const formattedInformation = formatInformation(history);
  const parser = StructuredOutputParser.fromZodSchema(z.array(actionSchema));

  const chain = RunnableSequence.from([prompt, model, parser]);

  const response = await chain.invoke({
    objective: parsedData.objective,
    html: parsedData.html,
    actions_completed: formattedHistory,
    information: formattedInformation
      ? `And here is all the information that you have gathered for yourself overtime : \n ${formattedInformation}`
      : "",
  });

  await storeAction(parsedData.objectiveId, response, history);

  for (const action of response) {
    if (action.operation === "store_information") {
      await storeInformation(parsedData.objectiveId, action.content, history);
    }
  }

  return Response.json(response);
});
