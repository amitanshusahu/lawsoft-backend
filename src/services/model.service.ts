import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
// import { ChatCompletionRequest } from "../schema/modelSchema";
import config from '../config/index.js';

const token = config.aiModels.githubToken;
const endpoint = config.aiModels.inferenceEndpoint || "https://models.github.ai/inference";
const modelName = config.aiModels.modelName || "xai/grok-3";
if (!token) {
  throw new Error("GITHUB_TOKEN is required in environment variables");
}

const client = ModelClient(endpoint, new AzureKeyCredential(token));

export async function getChatCompletion(
  payload:any
): Promise<string> {
  const response = await client.path("/chat/completions").post({
    body: {
      ...payload,
      model: modelName,
    },
  });

  if (isUnexpected(response)) {
    const error = response.body?.error;
    throw new Error(error?.message || "Failed to get response from AI model");
  }

  const content = response.body.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from the model");
  }

  return content.trim();
}