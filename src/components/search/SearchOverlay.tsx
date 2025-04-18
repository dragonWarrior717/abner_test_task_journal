import { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SearchSuggestions } from './SearchSuggestions';
import { DateRangeFilter } from './DateRangeFilter';
import { MoodTagFilter } from './MoodTagFilter';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Array<{
    title: string;
    content: string;
    mood: string;
    tags: string[];
    createdAt: string;
  }>;
  onSearch: (searchTerm: string) => void;
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onMoodChange: (moods: string[]) => void;
  onTagChange: (tags: string[]) => void;
  selectedMoods: string[];
  selectedTags: string[];
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export function SearchOverlay({
  isOpen,
  onClose,
  entries,
  onSearch,
  onDateRangeChange,
  onMoodChange,
  onTagChange,
  selectedMoods,
  selectedTags,
  dateRange,
}: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const uniqueMoods = Array.from(new Set(entries.map(entry => entry.mood)));
  const uniqueTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  return (
    <div className={cn(
      "fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all duration-500 ease-in-out",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="container max-w-2xl mx-auto p-4">
        <div className={cn(
          "bg-white rounded-lg shadow-lg p-4 space-y-4 transition-all duration-500 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Search Journal</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search entries..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onSearch(e.target.value);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>
            {showSuggestions && (
              <SearchSuggestions
                searchTerm={searchTerm}
                onSelect={(suggestion) => {
                  setSearchTerm(suggestion);
                  onSearch(suggestion);
                  setShowSuggestions(false);
                }}
                entries={entries}
              />
            )}
          </div>

          <div className="flex gap-2">
            <DateRangeFilter
              onDateRangeChange={onDateRangeChange}
            />
            <MoodTagFilter
              moods={uniqueMoods}
              tags={uniqueTags}
              selectedMoods={selectedMoods}
              selectedTags={selectedTags}
              onMoodChange={onMoodChange}
              onTagChange={onTagChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 