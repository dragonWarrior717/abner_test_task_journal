import { useState, useEffect } from 'react';
import { Search, Clock, Tag, Smile } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  searchTerm: string;
  onSelect: (suggestion: string) => void;
  entries: Array<{
    title: string;
    content: string;
    mood: string;
    tags: string[];
    createdAt: string;
  }>;
}

export function SearchSuggestions({ searchTerm, onSelect, entries }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Array<{
    type: 'title' | 'content' | 'mood' | 'tag' | 'date';
    value: string;
    icon: React.ReactNode;
  }>>([]);

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const newSuggestions = [];

    // Title suggestions
    const titleMatches = entries
      .filter(entry => entry.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(entry => ({
        type: 'title' as const,
        value: entry.title,
        icon: <Search className="h-4 w-4" />
      }));

    // Tag suggestions
    const tagMatches = entries
      .flatMap(entry => entry.tags)
      .filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(tag => ({
        type: 'tag' as const,
        value: tag,
        icon: <Tag className="h-4 w-4" />
      }));

    // Mood suggestions
    const moodMatches = entries
      .map(entry => entry.mood)
      .filter(mood => mood.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(mood => ({
        type: 'mood' as const,
        value: mood,
        icon: <Smile className="h-4 w-4" />
      }));

    // Date suggestions (group by month/year)
    const dateMatches = entries
      .map(entry => new Date(entry.createdAt))
      .filter(date => date.toLocaleDateString().includes(searchTerm))
      .map(date => ({
        type: 'date' as const,
        value: date.toLocaleDateString(),
        icon: <Clock className="h-4 w-4" />
      }));

    setSuggestions([
      ...titleMatches,
      ...tagMatches,
      ...moodMatches,
      ...dateMatches
    ].slice(0, 5)); // Limit to 5 suggestions
  }, [searchTerm, entries]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
      {suggestions.map((suggestion, index) => (
        <Button
          key={`${suggestion.type}-${index}`}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2",
            index === 0 && "rounded-t-lg",
            index === suggestions.length - 1 && "rounded-b-lg"
          )}
          onClick={() => onSelect(suggestion.value)}
        >
          {suggestion.icon}
          <span className="truncate">{suggestion.value}</span>
        </Button>
      ))}
    </div>
  );
} 