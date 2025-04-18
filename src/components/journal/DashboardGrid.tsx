import React from 'react';
import { EntryCard } from './EntryCard';
import { FilterBar } from './FilterBar';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
  lastEdited: string;
  favorite?: boolean;
}

interface DashboardGridProps {
    entries: JournalEntry[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    onSelect: (entry: JournalEntry) => void;
    filterMood: string;
    setFilterMood: (mood: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
}

export function DashboardGrid({
    entries,
    onEdit,
    onDelete,
    onToggleFavorite,
    onSelect,
    filterMood,
    setFilterMood,
    sortOption,
    setSortOption
}: DashboardGridProps) {
  return (
    <div className="space-y-6">
      <FilterBar
          filterMood={filterMood}
          setFilterMood={setFilterMood}
          sortOption={sortOption}
          setSortOption={setSortOption}
      />
      {entries.length > 0 ? (
        <div className="bento-grid">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            No journal entries found matching your criteria.
            <br />
            Try adjusting filters or creating a new entry!
        </div>
      )}
    </div>
  );
} 