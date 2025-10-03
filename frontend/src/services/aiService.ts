import type { Asset, AspectRatio, AIProviderAccount } from "../types";

// --- IN-MEMORY DATABASE ---
let linkedAccounts: AIProviderAccount[] = [
    { id: 'gemini-default', name: 'Gemini AI', apiKey: null, isDefault: true, description: 'Google\'s powerful AI model.' },
    { id: 'dalle-mock', name: 'DALL-E (Mock)', apiKey: 'mock-key', isDefault: false, description: 'A mock provider simulating DALL-E.' },
    { id: 'stable-diffusion-mock', name: 'Stable Diffusion (Mock)', apiKey: 'mock-key', isDefault: false, description: 'A mock provider simulating Stable Diffusion.' },
];


export const generateImage = async (prompt: string, aspectRatio: AspectRatio, providerId: string): Promise<Asset[]> => {
  const provider = linkedAccounts.find(p => p.id === providerId);
  console.log(`[MOCK] Generating image with ${provider?.name || 'Unknown Provider'} for prompt: "${prompt}"`);
  
  return new Promise(resolve => {
    setTimeout(() => {
        const mockAsset: Asset = {
            id: `ai-mock-${Date.now()}`,
            type: 'photo',
            previewURL: `https://source.unsplash.com/random/400x300?${encodeURIComponent(prompt)}`,
            largeImageURL: `https://source.unsplash.com/random/800x600?${encodeURIComponent(prompt)}`,
            author: provider?.name || 'Mock AI',
            source: 'AI',
            license: 'Generated Content (Mock)',
            tags: [prompt.substring(0, 50)],
            downloadURL: `https://source.unsplash.com/random/800x600?${encodeURIComponent(prompt)}`,
        };
        resolve([mockAsset]);
    }, 1500);
  });
};


export const getLinkedAccounts = async (): Promise<AIProviderAccount[]> => {
    console.log('[MOCK] Getting linked accounts');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...linkedAccounts]);
        }, 300);
    });
}

export const addAiProvider = async (accountData: { name: string; apiKey?: string; description?: string }): Promise<AIProviderAccount> => {
    console.log('[MOCK] Adding AI provider:', accountData);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!accountData.name.trim()) {
                reject(new Error("Provider name is required."));
                return;
            }
            const newAccount: AIProviderAccount = {
                id: `${accountData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                name: accountData.name,
                apiKey: accountData.apiKey || null,
                description: accountData.description,
                isDefault: false,
            };
            linkedAccounts.push(newAccount);
            resolve(newAccount);
        }, 500);
    });
}

export const removeAiProvider = async (id: string): Promise<void> => {
    console.log('[MOCK] Removing AI provider:', id);
    return new Promise(resolve => {
        setTimeout(() => {
            linkedAccounts = linkedAccounts.filter(acc => acc.id !== id);
            resolve();
        }, 500);
    });
}
