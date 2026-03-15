// Uses @google/genai (v1 API) instead of @google/generative-ai (v1beta API)
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;

const getClient = () => {
    if (aiClient) return aiClient;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. Check your environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return aiClient;
};

export const generateContent = async (prompt, systemInstruction = null) => {
    const ai = getClient();
    try {
        console.log('--- INITIATING GEMINI CALL (v1 API) ---');
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: systemInstruction ? { systemInstruction } : undefined,
        });
        console.log('--- GEMINI CALL SUCCESS ---');
        return response.text;
    } catch (error) {
        console.error("--- GEMINI CRITICAL ERROR ---", error.message);
        throw new Error(`Gemini Failure: ${error.message}`);
    }
};

export const generateJSONContent = async (prompt, systemInstruction = null) => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                ...(systemInstruction ? { systemInstruction } : {}),
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("--- GEMINI JSON ERROR ---", error.message);
        throw new Error(`Gemini JSON Failure: ${error.message}`);
    }
};

export default { generateContent, generateJSONContent };
