import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
    onShowSearch: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onMobileMenuToggle: () => void;
}

export function Header({ onShowSearch, searchTerm, setSearchTerm, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="border-b border-card-border bg-white p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="search"
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-card-border bg-background"
          />
        </div>
        <div className="hidden lg:block w-10"></div>

        <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
        >
            <Menu size={24} />
        </Button>

        <h1 className="text-lg font-semibold lg:hidden">Journal</h1>
        <div className="hidden lg:block font-semibold text-lg">JournalApp</div>

        <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={onShowSearch}
        >
            <Search size={20} />
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-muted rounded-full lg:hidden"></div>
        </div>
      </div>
    </header>
  );
} 