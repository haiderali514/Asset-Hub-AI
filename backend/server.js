
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- MOCK DATA ---
const mockAssets = [
    { id: '3139371', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2018/02/08/22/27/fantasy-3139371_1280.jpg', author: 'KELLEPICS', source: 'Pixabay', license: 'Pixabay License', tags: ['fantasy', 'city', 'futuristic', 'synthwave', 'neon'], downloadURL: 'https://pixabay.com/photos/fantasy-3139371/', },
    { id: '5044810', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2020/04/13/20/01/background-5044810_1280.jpg', author: 'u_d83d1162', source: 'Pixabay', license: 'Pixabay License', tags: ['background', 'retro', '80s', 'synthwave'], downloadURL: 'https://pixabay.com/illustrations/background-5044810/', },
    { id: '2675031', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2017/08/20/10/44/volkswagen-2675031_1280.jpg', author: '27707', source: 'Pixabay', license: 'Pixabay License', tags: ['volkswagen', 'car', 'retro', 'vintage'], downloadURL: 'https://pixabay.com/photos/volkswagen-2675031/', },
    { id: '1867616', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg', author: 'Pixabay', source: 'Pixabay', license: 'Pixabay License', tags: ['milky way', 'galaxy', 'space', 'stars'], downloadURL: 'https://pixabay.com/photos/astronomy-1867616/', },
    { id: '4369793', type: 'photo', previewURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_150.jpg', largeImageURL: 'https://cdn.pixabay.com/photo/2019/07/28/21/42/vhs-4369793_1280.jpg', author: 'felix_w', source: 'Pixabay', license: 'Pixabay License', tags: ['vhs', 'retro', '80s', 'cassette'], downloadURL: 'https://pixabay.com/photos/vhs-4369793/', },
];
const mockSuggestions = ['synthwave', 'retro', '80s', 'neon', 'futuristic', 'cyberpunk', 'galaxy', 'nature', 'vintage car', 'abstract', 'landscape'];


// --- IN-MEMORY DATABASE ---
let linkedAccounts = [
    { id: 'gemini-default', name: 'Gemini AI', apiKey: null, isDefault: true, description: 'Google\'s powerful AI model.' },
    { id: 'dalle-mock', name: 'DALL-E (Mock)', apiKey: 'mock-key', isDefault: false, description: 'A mock provider simulating DALL-E.' },
    { id: 'stable-diffusion-mock', name: 'Stable Diffusion (Mock)', apiKey: 'mock-key', isDefault: false, description: 'A mock provider simulating Stable Diffusion.' },
];


// --- API ROUTES ---

// GET /api/search
app.get('/api/search', (req, res) => {
    const { q, type, orientation } = req.query;
    console.log(`Searching for: ${q}`);

    setTimeout(() => { // Simulate network delay
        if (!q) {
            return res.json(mockAssets);
        }
        const lowerCaseQuery = q.toLowerCase();
        const results = mockAssets.filter(a => a.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)));
        res.json(results.length > 0 ? results : mockAssets);
    }, 500);
});

// GET /api/suggestions
app.get('/api/suggestions', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json([]);
    }
    const lowerCaseQuery = q.toLowerCase();
    res.json(mockSuggestions.filter(s => s.toLowerCase().includes(lowerCaseQuery)));
});

// GET /api/linked-accounts
app.get('/api/linked-accounts', (req, res) => {
    res.json(linkedAccounts);
});

// POST /api/add-ai-provider
app.post('/api/add-ai-provider', (req, res) => {
    const { name, apiKey, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Provider name is required.' });
    }
    const newAccount = {
        id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name,
        apiKey,
        description,
        isDefault: false,
    };
    linkedAccounts.push(newAccount);
    res.status(201).json(newAccount);
});

// DELETE /api/remove-linked-account/:id
app.delete('/api/remove-linked-account/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = linkedAccounts.length;
    linkedAccounts = linkedAccounts.filter(acc => acc.id !== id);
    if (linkedAccounts.length < initialLength) {
        res.status(200).json({ message: 'Account removed successfully.' });
    } else {
        res.status(404).json({ message: 'Account not found.' });
    }
});


// POST /api/ai-generate
app.post('/api/ai-generate', async (req, res) => {
    const { prompt, aspectRatio, providerId } = req.body;
    const provider = linkedAccounts.find(p => p.id === providerId);

    if (!provider) {
        return res.status(404).json({ message: 'Selected AI provider not found.' });
    }

    console.log(`Generating image with ${provider.name} for prompt: "${prompt}"`);

    if (provider.name === 'Gemini AI') {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ message: 'Gemini API key is not configured on the server.' });
        }
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: aspectRatio, },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const assets = response.generatedImages.map((img, index) => {
                    const base64ImageBytes = img.image.imageBytes;
                    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                    return {
                        id: `ai-${Date.now()}-${index}`, type: 'photo', previewURL: imageUrl, largeImageURL: imageUrl,
                        author: 'Gemini AI', source: 'AI', license: 'Generated Content',
                        tags: [prompt.substring(0, 50)], downloadURL: imageUrl,
                    };
                });
                return res.json(assets);
            } else {
                throw new Error("No images were generated by Gemini.");
            }
        } catch (error) {
            console.error("Error generating image with Gemini:", error);
            return res.status(500).json({ message: 'Failed to generate image with Gemini.' });
        }
    } else {
        // Mock response for other providers
        setTimeout(() => {
            const mockAsset = {
                id: `ai-mock-${Date.now()}`,
                type: 'photo',
                previewURL: `https://source.unsplash.com/random/400x300?${encodeURIComponent(prompt)}`,
                largeImageURL: `https://source.unsplash.com/random/800x600?${encodeURIComponent(prompt)}`,
                author: provider.name,
                source: 'AI',
                license: 'Generated Content (Mock)',
                tags: [prompt.substring(0, 50)],
                downloadURL: `https://source.unsplash.com/random/800x600?${encodeURIComponent(prompt)}`,
            };
            res.json([mockAsset]);
        }, 1500);
    }
});


// --- Static File Serving ---
// Serve the static files from the React app
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.use('/src', express.static(path.join(frontendPath, 'src')));


// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
