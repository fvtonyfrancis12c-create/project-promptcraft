import React, { useState } from 'react';
import { Play, Loader2, Sparkles, Box, Chrome } from 'lucide-react';
import api from '../utils/api';

const PromptPlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    gemini: '',
    chatgpt: '',
    claude: ''
  });

  const handleRunAll = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    // Clear previous results while loading
    setResults({ gemini: '', chatgpt: '', claude: '' });

    try {
      // 1. Gemini (Real API Integration via backend /api/generate)
      const resGemini = await api.post('/generate', { prompt: `Execute this prompt directly: ${prompt}` });
      const dataGemini = resGemini.data;
      
      // 2. ChatGPT (Mock API structure)
      const mockChatGPTResponse = await new Promise(resolve => 
        setTimeout(() => resolve(`[Mock ChatGPT Response]\n\nAs an AI language model, here is my response to your prompt:\n\n${prompt} is an excellent topic. I would structure it by providing a detailed list of points and ensuring the tone matches your request precisely.`), 1500)
      );

      // 3. Claude (Mock API structure)
      const mockClaudeResponse = await new Promise(resolve => 
        setTimeout(() => resolve(`[Mock Claude Response]\n\nBased on your prompt, here is a thoughtful analysis. I've focused on nuance and safety while directly answering your query: ${prompt}. Let me know if you need further refinement.`), 1800)
      );

      setResults({
        gemini: dataGemini.result,
        chatgpt: mockChatGPTResponse,
        claude: mockClaudeResponse
      });

    } catch (error) {
      console.error("Playground test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const ModelPanel = ({ name, icon: Icon, colorClass, data, isLoading }) => (
    <div className={`flex-1 flex flex-col glass-panel overflow-hidden border-t-4 ${colorClass}`}>
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50">
        <Icon className={`w-5 h-5 ${colorClass.replace('border-t-', 'text-')}`} />
        <h3 className="font-bold text-slate-800 dark:text-slate-200">{name}</h3>
      </div>
      <div className="p-4 flex-grow overflow-y-auto h-80 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            Generating response...
          </div>
        ) : data ? (
          data
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            Waiting for prompt...
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Play className="w-8 h-8 text-primary-500" />
          Multi-Model Playground
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Test your prompt simultaneously across different AI models.</p>
      </div>

      <div className="glass-panel p-6 mb-8 max-w-4xl mx-auto">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the prompt you want to test across all models..."
          className="w-full h-32 glass-input p-4 rounded-xl resize-none font-medium text-slate-700 dark:text-slate-300 mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleRunAll}
            disabled={!prompt.trim() || loading}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-lg shadow-primary-500/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Run Across All Models
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ModelPanel 
          name="Gemini 2.5 Flash" 
          icon={Sparkles} 
          colorClass="border-t-blue-500" 
          data={results.gemini} 
          isLoading={loading} 
        />
        <ModelPanel 
          name="ChatGPT (Mock)" 
          icon={Box} 
          colorClass="border-t-green-500" 
          data={results.chatgpt} 
          isLoading={loading} 
        />
        <ModelPanel 
          name="Claude (Mock)" 
          icon={Chrome} 
          colorClass="border-t-purple-500" 
          data={results.claude} 
          isLoading={loading} 
        />
      </div>
    </div>
  );
};

export default PromptPlayground;
