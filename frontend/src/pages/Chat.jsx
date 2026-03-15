import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { chatWithAI } from '../utils/api';
import api from '../utils/api';
import { Send, Loader2, Copy, Check, Bot, User } from 'lucide-react';
import clsx from 'clsx';

const TypingAnimation = () => (
  <div className="flex space-x-1 items-center h-6 px-2">
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am PromptCraft AI. How can I assist you with your prompts today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.initialPrompt) {
      setInput(location.state.initialPrompt);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    // Insert user message with null suggestions
    setMessages((prev) => [...prev, { role: 'user', content: userMessage, suggestions: null }]);
    setLoading(true);

    try {
      // 1. Get Chat Response
      const response = await chatWithAI(userMessage, messages);
      const aiResponse = response.result;

      // 2. Poll for suggestions in parallel (non-blocking) using 'api' utility
      api.post('/suggest', { prompt: userMessage }).then(suggestionRes => {
        const textSuggestions = suggestionRes.data.result;
        const suggestions = textSuggestions.split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim()))
          .map(l => l.replace(/^[*\-+\d.]+\s*/, '').trim())
          .filter(Boolean);
        
        setMessages((prev) => 
          prev.map((msg, idx) => (msg.role === 'user' && msg.content === userMessage) ? { ...msg, suggestions } : msg)
        );
      }).catch(err => console.warn("Suggestions error:", err));

      setMessages((prev) => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, I encountered an error communicating with the server." }]);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
    setInput((prev) => prev ? `${prev} [${suggestion}]` : `[${suggestion}] `);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col pt-4">
      <div className="text-center mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Bot className="text-green-500 h-8 w-8" />
          AI Prompt Engineer Chat
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">WhatsApp-style interaction with our specialized Prompt AI.</p>
      </div>

      <div className="glass-panel flex-grow flex flex-col mb-4 overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10 scroll-smooth">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={clsx(
                "flex max-w-[85%] sm:max-w-[75%] animate-fade-in-up",
                msg.role === 'user' ? "ml-auto justify-end" : "mr-auto justify-start"
              )}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 flex-shrink-0 mt-auto mb-1">
                  <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              )}
              
              <div className="flex flex-col gap-2 items-end">
                <div 
                  className={clsx(
                    "p-4 rounded-2xl relative shadow-md",
                    msg.role === 'user' 
                      ? "bg-green-500 text-white rounded-br-sm" 
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap font-medium leading-relaxed">{msg.content}</div>
                  
                  {msg.role === 'ai' && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="absolute -right-10 bottom-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>

                {msg.role === 'user' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end mt-1 max-w-full">
                    {msg.suggestions.map((sug, i) => (
                      <button 
                        key={i} 
                        onClick={() => applySuggestion(sug)}
                        className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors shadow-sm"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex max-w-[85%] mr-auto justify-start animate-fade-in-up">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 flex-shrink-0 mt-auto mb-1">
                <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-bl-sm shadow-md">
                <TypingAnimation />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 relative z-10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for prompt advice..."
              className="flex-grow glass-input px-4 py-3 rounded-full outline-none leading-relaxed"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-3 md:px-6 md:py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
