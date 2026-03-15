// Force v1 API endpoint to resolve the v1beta 404 error
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;

const getClient = () => {
    if (aiClient) return aiClient;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing.");
    }
    // Explicitly force the v1 API to avoid v1beta 404 errors
    aiClient = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { apiVersion: 'v1' }
    });
    return aiClient;
};

export const generateContent = async (prompt, systemInstruction = null) => {
    const ai = getClient();
    try {
        console.log('--- GEMINI CALL (forced v1) ---');
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: systemInstruction ? { systemInstruction } : undefined,
        });
        console.log('--- GEMINI SUCCESS ---');
        return response.text;
    } catch (error) {
        console.error("--- GEMINI ERROR ---", error.message);
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
