import React from 'react';
import { Button } from '../ui/button';
import { Home, Calendar, BarChart2, Settings, PenSquare, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    onNewEntry: () => void;
    onSetView: (view: string) => void;
    currentView: string;
    onSearch: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: Home },
    { view: 'calendar', label: 'Calendar', icon: Calendar },
    { view: 'analytics', label: 'Analytics', icon: BarChart2 },
    { view: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ onNewEntry, onSetView, currentView, onSearch, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-card-border bg-card-bg p-4 flex-col gap-4 hidden lg:flex h-screen fixed left-0">
        <div 
          className="flex items-center gap-3 px-2 py-4 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onSetView('list')}
        >
          <span className="text-xl font-semibold">JournalApp</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Button
              key={item.view}
              variant={currentView === item.view ? "secondary" : "ghost"}
              size="sm"
              className={`group justify-start gap-3 w-full ${
                currentView === item.view 
                  ? 'bg-gray-200 text-primary' 
                  : 'hover:bg-gray-200 hover:text-primary hover:scale-[1.02]'
              } transition-all duration-200`}
              onClick={() => onSetView(item.view)}
            >
              <item.icon 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-200" 
              />
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {item.label}
              </span>
            </Button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <Button 
            variant="outline"
            size="sm"
            className="group w-full gap-2 hover:bg-gray-200 hover:text-primary hover:scale-[1.02] transition-all duration-200"
            onClick={onSearch}
          >
            <Search 
              size={20} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              Search
            </span>
          </Button>

          <Button 
            variant="default"
            size="sm"
            className="group w-full gap-2 bg-primary hover:bg-gray-200 hover:text-primary hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={onNewEntry}
          >
            <PenSquare 
              size={20} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              New Entry
            </span>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar with Animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sliding Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-card-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">JournalApp</h2>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                  <Button
                    key={item.view}
                    variant={currentView === item.view ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      onSetView(item.view);
                      onClose(); // Close mobile menu after selection
                    }}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Button>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-card-border space-y-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    onSearch();
                    onClose();
                  }}
                >
                  <Search size={20} />
                  Search
                </Button>

                <Button 
                  variant="default"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    onNewEntry();
                    onClose();
                  }}
                >
                  <PenSquare size={20} />
                  New Entry
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 