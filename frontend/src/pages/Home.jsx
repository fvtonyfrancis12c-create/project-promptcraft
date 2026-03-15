import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Zap, Target, Image as ImageIcon, Layout as LibraryIcon } from 'lucide-react';

const features = [
  { name: 'Prompt Generator', icon: <Zap className="h-6 w-6 text-yellow-500" />, path: '/generator', desc: 'Instantly create high-quality AI prompts from simple ideas.' },
  { name: 'Prompt Improver', icon: <Sparkles className="h-6 w-6 text-primary-500" />, path: '/improver', desc: 'Enhance your existing prompts for better AI responses.' },
  { name: 'Prompt Analyzer', icon: <Target className="h-6 w-6 text-red-500" />, path: '/analyzer', desc: 'Get actionable feedback on prompt structure and clarity.' },
  { name: 'Auto-Optimizer', icon: <Zap className="h-6 w-6 text-purple-500" />, path: '/optimizer', desc: 'Generate 3 optimized versions with scores and metrics. (NEW)' },
  { name: 'Image Builder', icon: <ImageIcon className="h-6 w-6 text-blue-500" />, path: '/image', desc: 'Construct detailed Midjourney or DALL-E style visual prompts.' },
  { name: 'Library', icon: <LibraryIcon className="h-6 w-6 text-orange-500" />, path: '/library', desc: 'Browse and discover community prompt templates.' },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto py-12">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">PromptCraft AI Lab</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PromptCraft gives you the ultimate toolset to generate, optimize, and analyze prompts for Large Language Models and Image Generators.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link to="/generator" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1">
            Start Generating
          </Link>
          <Link to="/optimizer" className="px-8 py-4 glass-panel hover:bg-white/60 dark:hover:bg-slate-800/60 font-semibold transition-all hover:-translate-y-1">
            Try Auto-Optimizer ✨
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
        {features.map((item, idx) => (
          <Link key={idx} to={item.path} className="glass-panel p-6 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer block">
            <div className="bg-white/50 dark:bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">{item.name}</h3>
            <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
