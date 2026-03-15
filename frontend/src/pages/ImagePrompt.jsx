import React, { useState } from 'react';
import { generateImagePrompt } from '../utils/api';
import { Loader2, Copy, Check, Image as ImageIcon, Sparkles, BookmarkPlus, BookmarkCheck } from 'lucide-react';

const ImagePrompt = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const resp = await generateImagePrompt(topic);
      setResult(resp);
    } catch (error) {
      setResult("Error generating image prompt.");
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
      tool: 'Image Builder',
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
          <ImageIcon className="text-blue-500 h-10 w-10" />
          Image Prompt Builder
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Build highly detailed Midjourney or DALL-E prompts from a basic concept.</p>
      </div>

      <div className="glass-panel p-8 mb-8 border-l-4 border-l-blue-500">
        <form onSubmit={handleGenerate}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 opacity-80">What image do you want to create?</label>
            <textarea 
              className="w-full glass-input p-4 rounded-xl resize-none h-32 text-lg"
              placeholder="e.g. A futuristic city bathed in neon lights during a rainstorm..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              {loading ? 'Building...' : 'Build Image Prompt'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="glass-panel p-8 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Image Generation Prompt</h3>
            <div className="flex gap-2">
              <button 
                onClick={saveToLibrary}
                className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md transition-colors"
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
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl font-mono text-sm leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePrompt;
