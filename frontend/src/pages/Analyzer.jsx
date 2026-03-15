import React, { useState } from 'react';
import { analyzePrompt } from '../utils/api';
import { Loader2, Copy, Check, Target, BookmarkPlus, BookmarkCheck } from 'lucide-react';

const Analyzer = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const resp = await analyzePrompt(topic);
      setResult(resp);
    } catch (error) {
      setResult("Error analyzing prompt.");
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
      tool: 'Analyzer',
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
          <Target className="text-red-500 h-10 w-10" />
          Prompt Analyzer
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Get expert feedback, critique, and structural analysis on your prompts.</p>
      </div>

      <div className="glass-panel p-8 mb-8 border-l-4 border-l-red-500">
        <form onSubmit={handleAnalyze}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 opacity-80">Prompt to Analyze</label>
            <textarea 
              className="w-full glass-input p-4 rounded-xl resize-none h-32 text-lg"
              placeholder="Paste the prompt you want evaluated..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Target className="h-5 w-5" />}
              {loading ? 'Analyzing...' : 'Analyze Prompt'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="glass-panel p-8 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-xl font-bold">Analysis Report</h3>
            <div className="flex gap-2">
              <button 
                onClick={saveToLibrary}
                className="flex items-center gap-2 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md transition-colors"
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
          
          {typeof result === 'object' && result?.scores ? (
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Score Metrics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Clarity', score: result.scores.clarity, color: 'bg-emerald-500' },
                  { name: 'Context', score: result.scores.context, color: 'bg-blue-500' },
                  { name: 'Detail', score: result.scores.detail, color: 'bg-purple-500' },
                  { name: 'Effectiveness', score: result.scores.effectiveness, color: 'bg-primary-500' }
                ].map((metric) => (
                  <div key={metric.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>{metric.name}</span>
                      <span>{metric.score}/10</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} transition-all duration-1000 ease-out`} style={{ width: `${(metric.score / 10) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300">
            {typeof result === 'object' ? result.feedback : result}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
