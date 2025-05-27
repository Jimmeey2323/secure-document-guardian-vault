
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Monitor } from 'lucide-react';

export function Navbar() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' }
  ] as const;

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">SecureDoc</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {themes.map(({ name, icon: Icon, label }) => (
                <button
                  key={name}
                  onClick={() => setTheme(name)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    theme === name 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={label}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
