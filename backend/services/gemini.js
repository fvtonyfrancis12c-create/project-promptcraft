import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let genAICache = null;

const getGenAI = () => {
    if (genAICache) return genAICache;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. Check your environment variables.");
    }
    genAICache = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAICache;
};

export const generateContent = async (prompt, systemInstruction = null) => {
    const ai = getGenAI();
    try {
        console.log('--- INITIATING GEMINI CALL ---', { model: 'gemini-1.5-flash' });
        // Use full model path if necessary, but standard SDK uses short name
        const model = ai.getGenerativeModel({ 
            model: 'gemini-1.5-flash-8b',
            systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined
        });

        const result = await model.generateContent(prompt);
        console.log('--- GEMINI CALL SUCCESS ---');
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("--- GEMINI CRITICAL ERROR ---", error.message);
        throw new Error(`Gemini Failure: ${error.message}`);
    }
};

export const generateJSONContent = async (prompt, systemInstruction = null) => {
    const ai = getGenAI();
    try {
        const model = ai.getGenerativeModel({ 
            model: 'gemini-1.5-flash-8b',
            generationConfig: { responseMimeType: "application/json" },
            systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Gemini API Error (JSON):", error);
        throw error;
    }
};

export default { generateContent, generateJSONContent };
