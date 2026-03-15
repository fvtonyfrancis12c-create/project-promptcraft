import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
}); // Default to /api for production compatibility via vercel.json

export const generatePrompt = async (prompt) => {
    const res = await api.post('/generate', { prompt });
    return res.data.result;
};

export const improvePrompt = async (prompt) => {
    const res = await api.post('/improve', { prompt });
    return res.data.result;
};

export const analyzePrompt = async (prompt) => {
    const res = await api.post('/analyze', { prompt });
    return res.data.result;
};

export const generateImagePrompt = async (prompt) => {
    const res = await api.post('/image', { prompt });
    return res.data.result;
};

export const chatWithAI = async (message, history) => {
    const res = await api.post('/chat', { message, history });
    return res.data.result;
};

export const optimizePrompt = async (prompt) => {
    const res = await api.post('/optimizer', { prompt });
    return res.data.result; // This returns the JSON object parsed in backend
};

export default api;
