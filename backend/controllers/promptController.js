import { generateContent, generateJSONContent } from '../services/gemini.js';
import PromptHistory from '../models/PromptHistory.js';
import mongoose from 'mongoose';

const saveToHistory = async (promptText, aiResponse, toolUsed) => {
    try {
        // If mongoose isn't connected, this might hang. 
        // We'll check the connection state first.
        if (mongoose.connection.readyState !== 1) {
            console.warn("MongoDB not connected. Skipping history save.");
            return;
        }
        const historyItem = new PromptHistory({ 
            promptText, 
            aiResponse: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse), 
            toolUsed 
        });
        await historyItem.save();
    } catch (error) {
        console.error("Failed to save history:", error);
    }
};

const systemInstructions = "You are a helpful AI prompt engineer. Deliver all your answers in plain, directly readable English. Write naturally like a human. DO NOT use any markdown formatting symbols such as hashtags (#), asterisks (*), or dollar signs ($). Make the results simple, accurate, and easy for a normal human to understand.";

export const handleGenerate = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });
        const result = await generateContent(`Generate a detailed and creative prompt based on this topic: ${prompt}`, systemInstructions);
        saveToHistory(prompt, result, 'generator'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleImprove = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });
        const result = await generateContent(`Improve this prompt to make it more effective, clear, and detailed for an AI: ${prompt}`, systemInstructions);
        saveToHistory(prompt, result, 'improver'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleAnalyze = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });
        
        const jsonInstruction = `You are an AI Prompt Analyzer. Analyze the provided prompt and provide constructive feedback. Rate it out of 10 on Clarity, Context, Detail, and Effectiveness. Return a JSON object matching this schema exactly: {"feedback": "Your detailed feedback here...", "scores": {"clarity": 8, "context": 7, "detail": 9, "effectiveness": 8}}`;
        const result = await generateJSONContent(prompt, jsonInstruction);
        saveToHistory(prompt, result, 'analyzer'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleImage = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });
        const result = await generateContent(`Create a highly detailed Midjourney/DALL-E style image generation prompt based on this concept: ${prompt}`, systemInstructions);
        saveToHistory(prompt, result, 'image'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleChat = async (req, res, next) => {
    try {
        const { message, history } = req.body;
        let fullPrompt = history && history.length > 0 
            ? history.map(h => `${h.role === 'user' ? 'User:' : 'AI:'} ${h.content}`).join('\n') + `\nUser: ${message}\nAI:`
            : `User: ${message}\nAI:`;
        
        const result = await generateContent(fullPrompt, systemInstructions + " You are an AI assistant specialized in prompt engineering called PromptCraft AI.");
        saveToHistory(message, result, 'chat'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleOptimizer = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });
        
        const jsonInstruction = `You are a Prompt Auto-Optimizer. The user will provide a basic prompt. Generate 3 optimized versions in plain, simple English without using any hashtags, asterisks, or dollar signs. Score each version out of 10 for Clarity, Detail, Context, and Effectiveness. Calculate an overall average score. Return a valid JSON object strictly matching this schema: { "versions": [ { "text": "...", "scores": { "clarity": 8, "detail": 9, "context": 7, "effectiveness": 8 }, "overall": 8.0 } ] }`;
        const result = await generateJSONContent(prompt, jsonInstruction);
        saveToHistory(prompt, result, 'optimizer'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleCompare = async (req, res, next) => {
    try {
        const { promptA, promptB } = req.body;
        if (!promptA || !promptB) return res.status(400).json({ error: "Both promptA and promptB are required" });
        
        const jsonInstruction = `You are an AI Prompt Evaluator. Compare the two provided prompts. Evaluate each on Clarity, Detail, and Context (scores from 1 to 10). Determine which prompt is better overall. Return a valid JSON explicitly matching this structure: {"promptA": {"clarity": 7, "detail": 6, "context": 7}, "promptB": {"clarity": 9, "detail": 8, "context": 9}, "winner": "Prompt B"}`;
        const input = `Prompt A: ${promptA}\n\nPrompt B: ${promptB}`;
        const result = await generateJSONContent(input, jsonInstruction);
        saveToHistory(`Compare:\nA: ${promptA}\nB: ${promptB}`, result, 'compare'); // Don't await
        res.json({ result });
    } catch (error) { next(error); }
};

export const handleSuggest = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });
        const result = await generateContent(`Analyze this prompt's weaknesses and provide a bulleted list of 3-4 short, specific suggestions to improve it (e.g. Add target audience, Specify tone). Format as a plain list: ${prompt}`, systemInstructions);
        // We might not save 'suggestions' to history, but we can save it as 'analyzer' or skip it.
        // Let's not flood history with every short suggestion poll.
        res.json({ result });
    } catch (error) { next(error); }
};
