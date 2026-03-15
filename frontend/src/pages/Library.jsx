import React, { useState, useEffect } from 'react';
import { Library as LibraryIcon, Trash2, Copy, Check } from 'lucide-react';

const Library = () => {
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('promptcraft_library');
        if (stored) {
            try {
                setSavedPrompts(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse library data");
            }
        }
    }, []);

    const deletePrompt = (index) => {
        const updated = savedPrompts.filter((_, i) => i !== index);
        setSavedPrompts(updated);
        localStorage.setItem('promptcraft_library', JSON.stringify(updated));
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

  return (
    <div className="max-w-6xl mx-auto py-8">
       <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
             <LibraryIcon className="text-primary-500 h-10 w-10" />
             Prompt Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and revisit your favorite saved AI interactions.</p>
       </div>

       {savedPrompts.length === 0 ? (
           <div className="glass-panel py-24 text-slate-400 dark:text-slate-600 flex flex-col items-center justify-center border-dashed border-2">
               <LibraryIcon className="h-16 w-16 mb-4 opacity-50" />
               <p className="text-xl font-medium">Your library is currently empty.</p>
               <p className="mt-2 text-sm">Use the "Save to Library" button on any tool to keep your favorites here!</p>
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              {savedPrompts.map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 flex flex-col relative group border-t-4 border-t-primary-500">
                      <div className="flex justify-between items-start mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary-500 bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-full">
                             {item.tool}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mb-4">
                          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Original Input:</h4>
                          <p className="text-sm italic text-slate-600 dark:text-slate-300 line-clamp-2">{item.input}</p>
                      </div>

                      <div className="flex-grow mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex flex-col">
                          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">AI Result:</h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap flex-grow">{item.result}</p>
                      </div>

                      <div className="flex justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                           <button 
                               onClick={() => deletePrompt(idx)}
                               className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm font-medium"
                           >
                               <Trash2 className="h-4 w-4"/> Delete
                           </button>
                           <button 
                               onClick={() => copyToClipboard(item.result, idx)}
                               className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                           >
                               {copiedIndex === idx ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                               {copiedIndex === idx ? 'Copied!' : 'Copy'}
                           </button>
                      </div>
                  </div>
              ))}
           </div>
       )}
    </div>
  );
};
export default Library
