import type { Asset, AspectRatio, AIProviderAccount } from "../types";

const API_BASE_URL = '/api';

export const generateImage = async (prompt: string, aspectRatio: AspectRatio, providerId: string): Promise<Asset[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, aspectRatio, providerId }),
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


export const getLinkedAccounts = async (): Promise<AIProviderAccount[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/linked-accounts`);
        if (!response.ok) {
            throw new Error('Failed to fetch AI accounts.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching linked accounts:", error);
        throw error;
    }
}

export const addAiProvider = async (accountData: { name: string; apiKey?: string; description?: string }): Promise<AIProviderAccount> => {
    try {
        const response = await fetch(`${API_BASE_URL}/add-ai-provider`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accountData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add provider.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error adding AI provider:", error);
        throw error;
    }
}

export const removeAiProvider = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/remove-linked-account/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove provider.');
        }
    } catch (error) {
        console.error("Error removing AI provider:", error);
        throw error;
    }
}
