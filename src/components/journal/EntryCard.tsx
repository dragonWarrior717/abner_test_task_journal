import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Heart, Star } from 'lucide-react';
import { Button } from '../ui/button';

interface EntryCardProps {
  entry: {
    id: number;
    title: string;
    content: string;
    mood: string;
    tags: string[];
    createdAt: string;
    favorite?: boolean;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onSelect?: (entry: any) => void;
}

const moodColors = {
  Happy: 'bg-yellow-400',
  Sad: 'bg-blue-400',
  Anxious: 'bg-red-400',
  Productive: 'bg-green-400',
  Neutral: 'bg-gray-400',
  Calm: 'bg-indigo-400',
  Energetic: 'bg-orange-400',
  Reflective: 'bg-purple-400',
};

export function EntryCard({ entry, onEdit, onDelete, onToggleFavorite, onSelect }: EntryCardProps) {
  const moodColor = moodColors[entry.mood as keyof typeof moodColors] || 'bg-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative h-full bg-card-bg border border-card-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50 flex flex-col cursor-pointer"
      onClick={() => onSelect?.(entry)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${moodColor} shadow-sm`} />
          <span className="text-sm text-muted-foreground">
            {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(entry.id);
            }}
            className={`group-hover:scale-110 transition-transform duration-200 ${
              entry.favorite ? 'text-ruby' : 'text-muted-foreground'
            }`}
          >
            <Heart size={16} className={entry.favorite ? 'fill-current' : ''} />
          </Button>
        </div>
      </div>

      <h3 className="mt-2 font-semibold text-lg group-hover:text-primary transition-colors duration-200">
        {entry.title}
      </h3>
      <p className="mt-2 text-muted-foreground line-clamp-3 group-hover:text-foreground transition-colors duration-200">
        {entry.content}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-card-border flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(entry.id);
          }}
          className="group-hover:translate-x-1 transition-transform duration-200"
        >
          <Edit2 size={16} className="mr-2" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </motion.div>
  );
} 