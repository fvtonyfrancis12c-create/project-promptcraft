import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutTemplate, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const TemplateLibrary = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const categories = ['All', ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const useTemplate = (prompt) => {
    // Navigate to Chat page and pass the prompt in state
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
          <LayoutTemplate className="w-8 h-8 text-primary-500" />
          Template Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Browse expertly crafted prompt templates to kickstart your work.</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="glass-panel p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary-500"></div>
              
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                  {template.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">{template.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-4">
                "{template.prompt}"
              </p>
              
              <button 
                onClick={() => useTemplate(template.prompt)}
                className="flex items-center justify-between w-full px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors font-medium mt-auto group/btn"
              >
                Use this template
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
