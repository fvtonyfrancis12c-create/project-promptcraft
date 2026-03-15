import React from 'react';
import { Mail, User } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="text-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-8 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">Contact Information</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Get in touch with the creator of PromptCraft AI Lab.
        </p>
      </div>

      <div className="w-full max-w-md glass-panel p-8 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[50px] pointer-events-none" />
        
        <div className="flex flex-col space-y-8">
          <div className="flex items-start space-x-4 group">
            <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Creator Name</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tony Francis</span>
            </div>
          </div>

          <div className="flex items-start space-x-4 group">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
              <a 
                href="mailto:tony28252@gmail.com" 
                className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all"
              >
                tony28252@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
