import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Gemini client.
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const generateContent = async (prompt, systemInstruction = null) => {
    if (!genAI) throw new Error("GEMINI_API_KEY is missing. Please add it to your backend/.env file.");
    
    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const generateJSONContent = async (prompt, systemInstruction = null) => {
    if (!genAI) throw new Error("GEMINI_API_KEY is missing. Please add it to your backend/.env file.");
    
    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
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
