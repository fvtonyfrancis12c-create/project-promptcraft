import React, { useState } from 'react';
import { improvePrompt } from '../utils/api';
import { Loader2, Copy, Check, Zap, BookmarkPlus, BookmarkCheck } from 'lucide-react';

const Improver = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleImprove = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const resp = await improvePrompt(topic);
      setResult(resp);
    } catch (error) {
      setResult("Error improving prompt. Backend might be unreachable or missing API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToLibrary = () => {
    const newEntry = {
      tool: 'Improver',
      input: topic,
      result: result,
      date: new Date().toISOString()
    };
    const stored = localStorage.getItem('promptcraft_library');
    const library = stored ? JSON.parse(stored) : [];
    localStorage.setItem('promptcraft_library', JSON.stringify([newEntry, ...library]));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Zap className="text-primary-500 h-10 w-10" />
          Prompt Improver
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Paste your basic prompt and let our AI enhance it for better results.</p>
      </div>

      <div className="glass-panel p-8 mb-8">
        <form onSubmit={handleImprove}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 opacity-80">Your existing prompt</label>
            <textarea 
              className="w-full glass-input p-4 rounded-xl resize-none h-32 text-lg"
              placeholder="Enter the prompt you want to improve..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Zap className="h-5 w-5" />}
              {loading ? 'Enhancing...' : 'Enhance Prompt'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="glass-panel p-8 animate-fade-in-up bg-gradient-to-br from-primary-50/50 to-transparent border-primary-200/50 dark:border-primary-900/50">
          <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">✨ Enhanced Result</h3>
            <div className="flex gap-2">
              <button 
                onClick={saveToLibrary}
                className="flex items-center gap-2 text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/60 px-3 py-1.5 rounded-md transition-colors"
                title="Save to Library"
              >
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                <span className="hidden sm:inline">{saved ? 'Saved!' : 'Save'}</span>
              </button>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default Improver;
