import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Improver from './pages/Improver';
import Analyzer from './pages/Analyzer';
import ImagePrompt from './pages/ImagePrompt';
import Library from './pages/Library';
import Chat from './pages/Chat';
import AutoOptimizer from './pages/AutoOptimizer';
import Contact from './pages/Contact';
import PromptHistory from './pages/PromptHistory';
import TemplateLibrary from './pages/TemplateLibrary';
import PromptCompare from './pages/PromptCompare';
import PromptPlayground from './pages/PromptPlayground';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
      }
    } catch (e) {
      console.warn('Theme preference detection failed', e);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className="h-screen flex flex-col font-sans overflow-hidden">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          
          <main className="flex-grow overflow-y-auto w-full relative z-10 bg-slate-50 dark:bg-slate-950">
            {/* Subtle background effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[100px]" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generator" element={<Generator />} />
                <Route path="/improver" element={<Improver />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/image" element={<ImagePrompt />} />
                <Route path="/library" element={<Library />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/optimizer" element={<AutoOptimizer />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/history" element={<PromptHistory />} />
                <Route path="/templates" element={<TemplateLibrary />} />
                <Route path="/compare" element={<PromptCompare />} />
                <Route path="/playground" element={<PromptPlayground />} />
              </Routes>
            </div>
            
            {/* Global Footer */}
            <footer className="w-full py-6 mt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 static bottom-0">
              <p className="font-medium">PromptCraft AI Lab by Tony Francis</p>
              <p className="text-sm mt-1">Contact: <a href="mailto:tony28252@gmail.com" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">tony28252@gmail.com</a></p>
            </footer>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

