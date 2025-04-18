import React from 'react';
import { Filter, SortAsc, SortDesc, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
    filterMood: string;
    setFilterMood: (mood: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
}

export function FilterBar({ filterMood, setFilterMood, sortOption, setSortOption }: FilterBarProps) {
  const moodOptions = [
    { label: 'All Moods', value: 'All' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Sad', value: 'Sad' },
    { label: 'Anxious', value: 'Anxious' },
    { label: 'Productive', value: 'Productive' },
    { label: 'Neutral', value: 'Neutral' },
    { label: 'Calm', value: 'Calm' },
    { label: 'Energetic', value: 'Energetic' },
    { label: 'Reflective', value: 'Reflective' }
  ];

  const sortOptions = [
    { label: 'Latest', value: 'date_desc' },
    { label: 'Oldest', value: 'date_asc' },
    { label: 'Title A-Z', value: 'title_asc' },
    { label: 'Title Z-A', value: 'title_desc' },
  ];

  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap"> {/* Allow wrapping */}
          {/* Mood Select */}
          <Select value={filterMood} onValueChange={setFilterMood}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by mood" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {moodOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Potential future "More Filters" button */}
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            More Filters
          </Button>
        </div> */}
      </div>
    </div>
  );
} 