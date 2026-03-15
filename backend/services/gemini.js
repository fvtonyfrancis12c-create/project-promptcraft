// @google/genai SDK with v1 API forced — fixed systemInstruction field
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;

const getClient = () => {
    if (aiClient) return aiClient;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing.");
    }
    aiClient = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { apiVersion: 'v1' }
    });
    return aiClient;
};

// Build contents array with optional system instruction prepended as a user message
const buildContents = (prompt, systemInstruction) => {
    if (!systemInstruction) {
        return prompt;
    }
    // For v1 API: pass system instruction as a separate system_instruction field
    return prompt;
};

export const generateContent = async (prompt, systemInstruction = null) => {
    const ai = getClient();
    try {
        console.log('--- GEMINI CALL (v1 forced) ---');
        const requestConfig = {};
        if (systemInstruction) {
            requestConfig.systemInstruction = {
                role: 'system',
                parts: [{ text: systemInstruction }]
            };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: Object.keys(requestConfig).length > 0 ? requestConfig : undefined,
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
        const requestConfig = { responseMimeType: 'application/json' };
        if (systemInstruction) {
            requestConfig.systemInstruction = {
                role: 'system',
                parts: [{ text: systemInstruction }]
            };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: requestConfig,
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("--- GEMINI JSON ERROR ---", error.message);
        throw new Error(`Gemini JSON Failure: ${error.message}`);
    }
};

export default { generateContent, generateJSONContent };
