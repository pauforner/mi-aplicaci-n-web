import OpenAI from "openai";

export const MODEL = "gpt-5-mini";

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Falta la variable de entorno OPENAI_API_KEY");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
