
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const startChat = (modelName: string, systemInstruction?: string): Chat => {
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
