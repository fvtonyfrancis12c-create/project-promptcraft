import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Clock, LayoutTemplate, GitCompare, MonitorPlay } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/chat' },
    { name: 'Prompt History', icon: <Clock className="w-5 h-5" />, path: '/history' },
    { name: 'Templates', icon: <LayoutTemplate className="w-5 h-5" />, path: '/templates' },
    { name: 'Prompt Battle', icon: <GitCompare className="w-5 h-5" />, path: '/compare' },
    { name: 'Playground', icon: <MonitorPlay className="w-5 h-5" />, path: '/playground' },
  ];

  return (
    <div className="w-64 glass border-r border-y-0 border-l-0 border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 z-20">
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-3">Advanced Tools</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
