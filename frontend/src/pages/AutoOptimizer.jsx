import React, { useState } from 'react';
import { optimizePrompt } from '../utils/api';
import { Loader2, Copy, Check, Zap, Award, Star, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import clsx from 'clsx';

const AutoOptimizer = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedIndex, setSavedIndex] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const resp = await optimizePrompt(topic);
      // Ensure backend returns valid JSON format matching schema
      if (resp && resp.versions) {
        // Sort by overall score descending
        resp.versions.sort((a, b) => b.overall - a.overall);
        setResult(resp);
      } else {
         setResult(null);
         alert("Received unexpected format from optimizer.");
      }
    } catch (error) {
      console.error(error);
      alert("Error optimizing prompt. Make sure Gemini API returns valid JSON.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const saveToLibrary = (ver, score, index) => {
    const newEntry = {
      tool: 'Auto-Optimizer',
      input: topic,
      result: `Optimized Score: ${score}/10\n\n${ver.text}`,
      date: new Date().toISOString()
    };
    const stored = localStorage.getItem('promptcraft_library');
    const library = stored ? JSON.parse(stored) : [];
    localStorage.setItem('promptcraft_library', JSON.stringify([newEntry, ...library]));
    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Zap className="text-purple-500 h-10 w-10" />
          Prompt Auto-Optimizer
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Provide a basic prompt. We will generate 3 highly optimized versions, scored by AI.</p>
      </div>

      <div className="glass-panel p-8 mb-10 max-w-4xl mx-auto border-t-4 border-t-purple-500">
        <form onSubmit={handleOptimize}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 opacity-80">Enter your basic prompt</label>
            <textarea 
              className="w-full glass-input p-4 rounded-xl resize-none h-24 text-lg"
              placeholder="e.g. Help me write a python script for scraping..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Zap className="h-5 w-5" />}
              {loading ? 'Optimizing (Takes 5-10s)...' : 'Auto-Optimize'}
            </button>
          </div>
        </form>
      </div>

      {result && result.versions && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up relative">
          {result.versions.map((ver, idx) => {
            const isBest = idx === 0;
            return (
              <div 
                key={idx} 
                className={clsx(
                  "glass-panel p-6 flex flex-col relative transition-transform hover:-translate-y-2 duration-300",
                  isBest 
                    ? "border-2 border-yellow-400 dark:border-yellow-500 shadow-yellow-500/20 shadow-2xl scale-105 z-10" 
                    : "border-slate-200 dark:border-slate-700/50"
                )}
              >
                {isBest && (
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                    <Award className="h-4 w-4" /> Best Version
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    Version {idx + 1}
                  </h3>
                  <div className="flex items-center gap-1 font-bold text-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    {ver.overall}/10
                  </div>
                </div>
                
                {/* Scoring Breakdown */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {Object.entries(ver.scores).map(([key, score]) => (
                    <div key={key} className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-sm flex justify-between items-center border border-slate-100 dark:border-slate-800">
                      <span className="capitalize text-slate-500 dark:text-slate-400">{key}</span>
                      <span className={clsx("font-bold", score >= 8 ? "text-green-500" : score >= 6 ? "text-yellow-500" : "text-red-500")}>
                        {score}/10
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex-grow mb-6 relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 dark:to-slate-900/90 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-sm font-medium p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg max-h-64 overflow-y-auto w-full leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    {ver.text}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => saveToLibrary(ver, ver.overall, idx)}
                      className={clsx(
                        "py-3 px-4 rounded-lg font-medium shadow-md transition-all flex items-center justify-center text-sm",
                        isBest 
                          ? "bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900/40 dark:hover:bg-yellow-800/60 text-yellow-900 dark:text-yellow-100" 
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                      )}
                      title="Save to Library"
                    >
                      {savedIndex === idx ? <BookmarkCheck className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(ver.text, idx)}
                      className={clsx(
                        "flex-grow py-3 rounded-lg font-medium shadow-md transition-all flex items-center justify-center gap-2",
                        isBest 
                          ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-950" 
                          : "bg-primary-600 hover:bg-primary-700 text-white"
                      )}
                    >
                      {copiedIndex === idx ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      {copiedIndex === idx ? 'Copied to Clipboard!' : 'Use This Prompt'}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoOptimizer;
