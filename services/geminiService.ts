import type { Asset, AspectRatio } from "../types";

const API_BASE_URL = '/api';

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<Asset[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Use the default Gemini provider configured on the backend
      body: JSON.stringify({ prompt, aspectRatio, providerId: 'gemini-default' }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate image.");
    }
    
    return data;
  } catch (error) {
    console.error("Error generating image via backend:", error);
    throw error;
  }
};