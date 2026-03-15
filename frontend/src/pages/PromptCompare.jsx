import React, { useState } from 'react';
import { Loader2, GitCompare, Trophy } from 'lucide-react';
import api from '../utils/api';

const PromptCompare = () => {
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompare = async () => {
    if (!promptA.trim() || !promptB.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/compare', { promptA, promptB });
      setResult(response.data.result);
    } catch (error) {
      console.error("Comparison failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const MetricRow = ({ label, scoreA, scoreB, isWinnerA, isWinnerB }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors px-2 rounded-lg">
      <div className={`w-1/3 text-center font-bold text-xl ${isWinnerA ? 'text-green-500' : 'text-slate-600 dark:text-slate-400'}`}>
        {scoreA}/10
      </div>
      <div className="w-1/3 text-center text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={`w-1/3 text-center font-bold text-xl ${isWinnerB ? 'text-green-500' : 'text-slate-600 dark:text-slate-400'}`}>
        {scoreB}/10
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <GitCompare className="w-10 h-10 text-primary-500" />
          Prompt Battle
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-3">Compare two prompts head-to-head and see which one performs better.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 glass-panel p-6 border-t-4 border-t-primary-500">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">A</span>
            Prompt A
          </h2>
          <textarea
            value={promptA}
            onChange={(e) => setPromptA(e.target.value)}
            placeholder="Enter the first prompt here..."
            className="w-full h-40 glass-input p-4 rounded-xl resize-none font-medium text-slate-700 dark:text-slate-300"
          />
        </div>

        <div className="flex items-center justify-center md:px-4 py-4 md:py-0 font-bold text-slate-300 dark:text-slate-600 italic text-2xl">
          VS
        </div>

        <div className="flex-1 glass-panel p-6 border-t-4 border-t-blue-500">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">B</span>
            Prompt B
          </h2>
          <textarea
            value={promptB}
            onChange={(e) => setPromptB(e.target.value)}
            placeholder="Enter the second prompt here..."
            className="w-full h-40 glass-input p-4 rounded-xl resize-none font-medium text-slate-700 dark:text-slate-300"
          />
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={handleCompare}
          disabled={!promptA.trim() || !promptB.trim() || loading}
          className="px-10 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white rounded-full font-bold shadow-xl shadow-primary-500/20 active:scale-95 transition-all text-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <GitCompare className="w-6 h-6" />}
          {loading ? 'Evaluating Battle...' : 'Start Battle'}
        </button>
      </div>

      {result && (
        <div className="glass-panel p-8 max-w-4xl mx-auto animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-500 mb-4 shadow-inner shadow-amber-200/50">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Winner: <span className="text-amber-500">{result.winner}</span>
            </h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 shadow-inner border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between mb-6 px-4 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
              <div className="w-1/3 text-center font-bold text-primary-600 dark:text-primary-400 text-lg">PROMPT A</div>
              <div className="w-1/3"></div>
              <div className="w-1/3 text-center font-bold text-blue-600 dark:text-blue-400 text-lg">PROMPT B</div>
            </div>

            <MetricRow 
              label="Clarity" 
              scoreA={result.promptA.clarity} 
              scoreB={result.promptB.clarity} 
              isWinnerA={result.promptA.clarity > result.promptB.clarity}
              isWinnerB={result.promptB.clarity > result.promptA.clarity}
            />
            <MetricRow 
              label="Detail" 
              scoreA={result.promptA.detail} 
              scoreB={result.promptB.detail}
              isWinnerA={result.promptA.detail > result.promptB.detail}
              isWinnerB={result.promptB.detail > result.promptA.detail}
            />
            <MetricRow 
              label="Context" 
              scoreA={result.promptA.context} 
              scoreB={result.promptB.context}
              isWinnerA={result.promptA.context > result.promptB.context}
              isWinnerB={result.promptB.context > result.promptA.context}
            />
            
            <div className="flex justify-between mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-700 px-4">
              <div className="w-1/3 text-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {((result.promptA.clarity + result.promptA.detail + result.promptA.context) / 3).toFixed(1)}
              </div>
              <div className="w-1/3 text-center font-bold uppercase text-slate-400 pt-2 tracking-widest">
                Overall Average
              </div>
              <div className="w-1/3 text-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {((result.promptB.clarity + result.promptB.detail + result.promptB.context) / 3).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptCompare;
