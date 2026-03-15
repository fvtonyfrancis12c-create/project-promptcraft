import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Search, ChevronRight, XCircle } from 'lucide-react';
import api from '../utils/api';

const PromptHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/history/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const loadPrompt = (promptText) => {
    // Basic navigation or copy to clipboard for now
    navigator.clipboard.writeText(promptText);
    alert('Prompt copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">Prompt History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">View and manage your previous prompts and responses.</p>
        </div>
        <button onClick={fetchHistory} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <RefreshCw className={`w-5 h-5 text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && history.length === 0 ? (
        <div className="text-center py-12 text-slate-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500">
          No history found. Try generating some prompts!
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item._id} className="glass-panel p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full capitalize">
                  {item.toolUsed}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Prompt</h3>
                <p className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {item.promptText}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">AI Response</h3>
                <div className="text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 whitespace-pre-wrap">
                  {item.aiResponse}
                </div>
              </div>

              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => loadPrompt(item.promptText)} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:text-primary-500 transition-colors" title="Copy Prompt">
                  Copy
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:text-red-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptHistory;
