'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PenSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Home, Calendar, BarChart2, Settings } from 'lucide-react';

interface MobileLayoutProps {
    children: React.ReactNode;
    onNewEntry: () => void;
    onSetView: (view: string) => void;
    currentView: string;
}

const mobileNavItems = [
    { view: 'dashboard', label: 'Dashboard', icon: Home },
    { view: 'calendar', label: 'Calendar', icon: Calendar },
    { view: 'analytics', label: 'Analytics', icon: BarChart2 },
    { view: 'settings', label: 'Settings', icon: Settings },
];

export function MobileLayout({ children, onNewEntry, onSetView, currentView }: MobileLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-card-bg border-b border-card-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-lg font-semibold">Journal</h1>
          <div className="w-10" /> {/* Spacing placeholder */}
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-3/4 max-w-xs bg-card-bg z-50 shadow-lg"
            >
              <div className="p-4 border-b border-card-border flex justify-between items-center">
                <h2 className="font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              <nav className="p-4 flex flex-col gap-2">
                {mobileNavItems.map(item => (
                  <Button
                    key={item.view}
                    variant={currentView === item.view ? "secondary" : "ghost"}
                    className="justify-start gap-3"
                    onClick={() => {
                      onSetView(item.view);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-20">
        {children}
      </main>

      {/* Floating Action Button (FAB) for New Entry */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          size="lg"
          className="rounded-full shadow-lg w-14 h-14 p-0"
          onClick={onNewEntry}
        >
          <PenSquare size={24} />
          <span className="sr-only">New Entry</span>
        </Button>
      </div>
    </div>
  );
} 