'use client'; // Needed for useState, useEffect, localStorage

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Remove dynamic import and Quill CSS
// import dynamic from 'next/dynamic';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// import 'react-quill/dist/quill.snow.css';

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from '@/components/layout/MainLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardGrid } from '@/components/journal/DashboardGrid';
import { EntryForm } from '@/components/journal/EntryForm';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { MoodInsights } from '@/components/journal/MoodInsights';
import { AnalyticsDashboard } from '@/components/journal/AnalyticsDashboard';
import { CalendarView } from '@/components/journal/CalendarView';
import { TagManager } from '@/components/journal/TagManager';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { EntryListSkeleton } from "@/components/journal/EntryListSkeleton";

// --- Type Definitions ---
// Define the structure of a Journal Entry
interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: Mood; // Use specific Mood type
  tags: string[];
  createdAt: string; // ISO date string
  lastEdited: string; // ISO date string
  favorite?: boolean;
}

// Define Mood type if stricter checking is desired
type Mood = 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral' | 'Calm' | 'Energetic' | 'Reflective';

// --- Constants ---
const LOCAL_STORAGE_KEY = 'journal-entries';
// Use the Mood type for MOODS array
const MOODS: Mood[] = ['Happy', 'Sad', 'Anxious', 'Productive', 'Neutral', 'Calm', 'Energetic', 'Reflective'];
const PREVIEW_LENGTH = 90; // Slightly shorter preview

// --- Helper Functions ---
// Add type annotations to helpers

const parseTags = (tagString: string): string[] => {
    if (!tagString) return [];
    return tagString.split(',').map(tag => tag.trim()).filter(Boolean);
};

const formatTags = (tagsArray: string[] | undefined): string => {
    return (tagsArray || []).join(', ');
};

const createPreview = (text: string): string => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > PREVIEW_LENGTH ? plainText.substring(0, PREVIEW_LENGTH) + '…' : plainText;
};

// --- Reusable Components ---

/**
 * Component for the entry creation/editing form.
 * Uses shadcn/ui components for inputs, labels, buttons, etc.
 */

/**
 * Component to display the full details of a selected entry.
 * Uses shadcn/ui Card and Badge components.
 */
interface EntryDetailProps {
    entry: JournalEntry;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onEdit, onDelete, onBack }) => {
  if (!entry) return null;

  const timeSince = useMemo(() => Math.floor((new Date().getTime() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60 * 24)), [entry.createdAt]);
  const wordCount = useMemo(() => entry.content.split(/\s+/).filter(Boolean).length, [entry.content]);
  const charCount = useMemo(() => entry.content.length, [entry.content]);

  return (
    <Card className="">
      <CardHeader className="">
         <div className="flex justify-between items-center mb-4">
             <Button className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground" variant="link" size="default" onClick={onBack}>
                 &larr; Back to List
             </Button>
              <div className="flex space-x-2">
                <Button className="" variant="outline" size="sm" onClick={() => onEdit(entry)}>Edit</Button>
                <Button className="" variant="destructive" size="sm" onClick={() => onDelete(entry.id)}>Delete</Button>
              </div>
         </div>
        <CardTitle className="text-2xl md:text-3xl">{entry.title || "(Untitled)"}</CardTitle>
        <div className="text-sm text-muted-foreground pt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Mood: <Badge className="" variant="default">{entry.mood}</Badge></span>
            <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
             {entry.tags && entry.tags.length > 0 && (
                 <div className="flex items-center gap-1.5 flex-wrap"> {/* Increased gap slightly */} 
                     <span className="text-xs">Tags:</span>
                     {entry.tags.map((tag: string) => <Badge className="" key={tag} variant="outline">{tag}</Badge>)}
                 </div>
              )}
        </div>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none whitespace-pre-wrap pt-6">
          {entry.content}
      </CardContent>
      <Separator className="my-6" /> {/* Increased margin */} 
      <CardFooter className="text-xs text-muted-foreground">
          Word Count: {wordCount} | Character Count: {charCount} | Last Edited: {new Date(entry.lastEdited).toLocaleString()}
      </CardFooter>
    </Card>
  );
};

/**
 * Component representing a single item in the journal entry list.
 * Displays title, preview, metadata, and action buttons.
 */
interface EntryListItemProps {
    entry: JournalEntry;
    onSelect: (entry: JournalEntry) => void;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: number) => void;
}

const EntryListItem: React.FC<EntryListItemProps> = ({ entry, onSelect, onEdit, onDelete }) => (
  // Remove Card wrapper, use border and hover state directly on li
  <li className="border-b hover:bg-muted/50 transition-colors duration-150 flex flex-col sm:flex-row justify-between items-start gap-3 px-2 py-4">
        <div onClick={() => onSelect(entry)} className="cursor-pointer flex-grow w-full sm:w-auto space-y-1.5"> {/* Increased space */} 
            <h3 className="text-lg font-semibold leading-tight hover:text-primary transition-colors">{entry.title || '(Untitled Entry)'}</h3>
            <p className="text-sm text-muted-foreground italic">{createPreview(entry.content)}</p>
            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                <span>Mood: <Badge className="px-1.5 py-0 font-normal" variant="default">{entry.mood}</Badge></span> {/* Make badge font normal */} 
                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                {entry.tags && entry.tags.length > 0 && (
                    <span className="flex items-center gap-1 flex-wrap">
                         {entry.tags.slice(0, 3).map((tag: string) => (
                             <Badge className="px-1.5 py-0 font-normal" key={tag} variant="outline">{tag}</Badge>
                         ))}
                         {entry.tags.length > 3 && <span className="text-xs text-muted-foreground">...</span>}
                    </span>
                )}
            </div>
        </div>
        <div className="space-x-2 flex-shrink-0 self-end sm:self-center">
            {/* Use ghost variant for less clutter */} 
            <Button className="" variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(entry); }}>Edit</Button>
            <Button className="text-destructive hover:text-destructive hover:bg-destructive/10" variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(entry.id); }}>Delete</Button>
        </div>
  </li>
);

/**
 * Component containing filter and sort controls for the entry list.
 * Uses shadcn/ui Input, Select components.
 */
interface ControlBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterMood: string;
    setFilterMood: (value: string) => void;
    filterTag: string;
    setFilterTag: (value: string) => void;
    sortKey: string;
    setSortKey: (value: string) => void;
    sortOrder: 'asc' | 'desc'; // Use specific type
    setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

const ControlBar: React.FC<ControlBarProps> = ({ searchTerm, setSearchTerm, filterMood, setFilterMood, filterTag, setFilterTag, sortKey, setSortKey, sortOrder, setSortOrder }) => (
  // Use grid for potentially better alignment if needed, reduce overall spacing
  <div className="grid gap-4">
    <div className="grid gap-1.5">
      <Label htmlFor="search-input" className="text-xs font-medium">Search Term</Label>
      <Input className="" type="text" id="search-input" placeholder="Search..." value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="tag-filter-input" className="text-xs font-medium">Filter by Tag</Label>
      <Input className="" type="text" id="tag-filter-input" placeholder="Enter tag..." value={filterTag} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterTag(e.target.value)} />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="filter-mood" className="text-xs font-medium">Filter by Mood</Label>
       <Select value={filterMood} onValueChange={setFilterMood}>
        <SelectTrigger id="filter-mood" className=""><SelectValue placeholder="Select Mood" /></SelectTrigger>
        <SelectContent className="">
          <SelectItem className="" value="All">All Moods</SelectItem>
          {MOODS.map(m => <SelectItem className="" key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium">Sort By</Label>
      <div className="flex space-x-2">
        <Select value={sortKey} onValueChange={setSortKey}>
            <SelectTrigger className="flex-grow"><SelectValue placeholder="Sort Key" /></SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="createdAt">Date</SelectItem>
              <SelectItem className="" value="title">Title</SelectItem>
              <SelectItem className="" value="mood">Mood</SelectItem>
            </SelectContent>
        </Select>
        {/* Tooltip might be nice here in a real app */}
        <Button className="" variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}> {/* Icon size */} 
          {sortOrder === 'asc' ? <span className="h-4 w-4">⬆</span> : <span className="h-4 w-4">⬇</span>} {/* Simpler icons */} 
        </Button>
      </div>
    </div>
  </div>
);

/**
 * Component displaying overall statistics about the journal entries.
 * Uses shadcn/ui Badge and Separator.
 */
interface StatsDisplayProps {
    entries: JournalEntry[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ entries }) => {
  const stats = useMemo(() => {
    const total = entries.length;
    // Ensure moodCounts keys match Mood type
    const moodCounts = MOODS.reduce((acc, mood) => ({ ...acc, [mood]: 0 }), {} as Record<Mood, number>);
    entries.forEach(entry => {
      // Type guard for mood
      const moodKey = entry.mood as Mood;
      if (moodKey && moodCounts.hasOwnProperty(moodKey)) {
          moodCounts[moodKey]++;
      }
    });
    return { total, moodCounts };
  }, [entries]);

  // Only show moods with counts > 0 for less clutter
  const activeMoods = MOODS.filter(mood => stats.moodCounts[mood] > 0);

  return (
    <div className="space-y-4">
        {/* Make total entries more prominent */}
        <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Entries</p>
            <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <Separator className="" />
        {activeMoods.length > 0 && (
             <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mood Breakdown:</p>
                <div className="flex flex-wrap gap-2">
                   {activeMoods.map(mood => (
                       <Badge className="" key={mood} variant="secondary">{mood}: {stats.moodCounts[mood]}</Badge>
                   ))}
                </div>
            </div>
        )}
    </div>
  );
};

// --- Main Page Component ---
/**
 * This is the primary component that orchestrates the entire Journal Dashboard application.
 * It manages the main application state, handles data fetching/saving, 
 * manages view transitions, and renders the overall layout and child components.
 */
export default function JournalPage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list');
  const [previousView, setPreviousView] = useState('list');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('All');
  const [filterTag, setFilterTag] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(term) || 
        entry.content.toLowerCase().includes(term)
      );
    }
    
    // Apply mood filter
    if (filterMood !== 'All') {
      filtered = filtered.filter(entry => entry.mood === filterMood);
    }
    
    // Apply tag filter
    if (filterTag) {
      const tag = filterTag.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.tags.some(t => t.toLowerCase().includes(tag))
      );
    }
    
    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= dateRange.from! && entryDate <= dateRange.to!;
      });
    }
    
    // Apply mood selection filter
    if (selectedMoods.length > 0) {
      filtered = filtered.filter(entry => selectedMoods.includes(entry.mood));
    }
    
    // Apply tag selection filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry => 
        selectedTags.some(tag => entry.tags.includes(tag))
      );
    }
    
    // Sort entries
    filtered.sort((a, b) => {
      const aValue = sortKey === 'createdAt' ? new Date(a[sortKey]) : a[sortKey];
      const bValue = sortKey === 'createdAt' ? new Date(b[sortKey]) : b[sortKey];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [entries, searchTerm, filterMood, filterTag, dateRange, selectedMoods, selectedTags, sortKey, sortOrder]);

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const loadedEntries = JSON.parse(stored);
        loadedEntries.forEach((entry: JournalEntry) => {
          if (!entry.createdAt) entry.createdAt = new Date().toISOString();
        });
        setEntries(loadedEntries);
      }
    } catch (error) {
      console.error("Failed load:", error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error("Failed save:", error);
      }
    }
  }, [entries, isLoading]);

  const handleAddEntry = async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'lastEdited'>) => {
    try {
      const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastEdited: new Date().toISOString(),
      };
      setEntries(prev => [...prev, newEntry]);
      toast({
        title: "Success",
        description: "Entry created successfully",
      });
      goBackToList();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create entry",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEntry = async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'lastEdited'>) => {
    try {
      const updatedEntry: JournalEntry = {
        ...entryData,
        id: selectedEntry!.id,
        createdAt: entries.find(e => e.id === selectedEntry!.id)?.createdAt || new Date().toISOString(),
        lastEdited: new Date().toISOString(),
      };
      setEntries(prev => prev.map(entry => 
        entry.id === selectedEntry!.id ? updatedEntry : entry
      ));
      toast({
        title: "Success",
        description: "Entry updated successfully",
      });
      goBackToList();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
      goBackToList();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = useCallback((id: number) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    ));
  }, []);

  const openCreateView = () => {
    setIsCreating(true);
    setCurrentView('create');
  };

  const openEditView = (entryOrId: JournalEntry | number) => {
    const entry = typeof entryOrId === 'number' 
      ? entries.find(e => e.id === entryOrId)
      : entryOrId;
    
    if (entry) {
      setSelectedEntry(entry);
      setIsEditing(true);
      setCurrentView('edit');
    }
  };

  const openDetailView = (entry: JournalEntry) => {
    setPreviousView(currentView);
    setSelectedEntry(entry);
    setCurrentView('detail');
  };

  const goBackToList = () => {
    setSelectedEntry(null);
    setIsEditing(false);
    setIsCreating(false);
    setCurrentView(previousView);
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };

  const handleMoodChange = (moods: string[]) => {
    setSelectedMoods(moods);
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleViewChange = (view: string) => {
    setPreviousView(currentView);
    setCurrentView(view);
    // Clear search term when switching views
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <div className="space-y-6">
            {entries.length > 0 ? (
              <div className="space-y-4">
                {filteredEntries.map(entry => (
                  <EntryListItem
                    key={entry.id}
                    entry={entry}
                    onSelect={openDetailView}
                    onEdit={openEditView}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                No journal entries found.
              </div>
            )}
          </div>
        );
      case 'dashboard':
        return (
          <DashboardGrid
            entries={filteredEntries}
            onEdit={openEditView}
            onDelete={handleDeleteEntry}
            onToggleFavorite={handleToggleFavorite}
            onSelect={openDetailView}
            filterMood={filterMood}
            setFilterMood={setFilterMood}
            sortOption={sortKey}
            setSortOption={setSortKey}
          />
        );
      case 'detail':
        return selectedEntry ? (
          <EntryDetail
            entry={selectedEntry}
            onEdit={openEditView}
            onDelete={handleDeleteEntry}
            onBack={goBackToList}
          />
        ) : null;
      case 'edit':
        return selectedEntry ? (
          <EntryForm
            entry={selectedEntry}
            onSubmit={handleUpdateEntry}
            onCancel={goBackToList}
          />
        ) : null;
      case 'create':
        return (
          <EntryForm
            onSubmit={handleAddEntry}
            onCancel={goBackToList}
          />
        );
      case 'calendar':
        return <CalendarView entries={entries} />;
      case 'analytics':
        return <AnalyticsDashboard entries={entries} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        onNewEntry={openCreateView}
        onSetView={handleViewChange}
        currentView={currentView}
        onSearch={handleSearch}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 lg:pl-64">
        <div className="flex-1 flex flex-col relative">
          <Header
            onShowSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onMobileMenuToggle={() => setIsSidebarOpen(true)}
          />
          <main className="flex-1 p-6">
            {renderMainContent()}
          </main>
        </div>
      </div>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        entries={entries}
        onSearch={handleSearchSubmit}
        onDateRangeChange={handleDateRangeChange}
        onMoodChange={handleMoodChange}
        onTagChange={handleTagChange}
        selectedMoods={selectedMoods}
        selectedTags={selectedTags}
        dateRange={dateRange}
      />
      <Toaster />
    </div>
  );
}
