import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface BreadcrumbProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Breadcrumb({ currentView, onNavigate }: BreadcrumbProps) {
  const getViewLabel = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'calendar': return 'Calendar';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      case 'list': return 'All Entries';
      default: return view.charAt(0).toUpperCase() + view.slice(1);
    }
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 hover:bg-primary/10"
        onClick={() => onNavigate('list')}
      >
        <Home size={14} className="mr-1" />
        Home
      </Button>
      <ChevronRight size={14} />
      <span className="text-foreground font-medium">
        {getViewLabel(currentView)}
      </span>
    </nav>
  );
} 