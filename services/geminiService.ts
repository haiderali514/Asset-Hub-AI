import { GoogleGenAI } from "@google/genai";
import type { Asset, AspectRatio } from "../types";

const API_KEY = process.env.API_KEY;

// Initialize AI client only if API_KEY is available
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("Gemini API key is missing. AI generation will not work.");
}

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<Asset[]> => {
  if (!ai) {
    throw new Error("Gemini API key is missing. AI generation functionality is disabled.");
  }

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages.map((img, index) => {
            const base64ImageBytes: string = img.image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            return {
                id: `ai-${Date.now()}-${index}`,
                type: 'photo',
                previewURL: imageUrl,
                largeImageURL: imageUrl,
                author: 'Gemini AI',
                source: 'AI',
                license: 'Generated Content',
                tags: [prompt.substring(0, 50)],
                downloadURL: imageUrl,
            };
        });
    } else {
        throw new Error("No images were generated.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
};