import React from 'react';
import { motion } from 'framer-motion';
import { Tag, X, Plus } from 'lucide-react';
import { Button } from '../ui/button';

export function TagManager({ tags, onUpdateTags }) {
  const [newTag, setNewTag] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const tagColors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-green-100 text-green-800',
    ideas: 'bg-purple-100 text-purple-800',
    goals: 'bg-yellow-100 text-yellow-800',
    health: 'bg-red-100 text-red-800',
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onUpdateTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tags</h3>
        <Button variant="outline" size="sm">
          <Tag size={16} className="mr-2" />
          Manage Tags
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <motion.div
            key={tag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-3 py-1 rounded-full ${
              tagColors[tag.toLowerCase()] || 'bg-gray-100 text-gray-800'
            } flex items-center gap-2`}
          >
            <span>{tag}</span>
            <button
              onClick={() => onUpdateTags(tags.filter(t => t !== tag))}
              className="hover:bg-black/10 rounded-full p-1"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add new tag..."
          className="flex-1 px-3 py-2 rounded-lg border border-card-border bg-background"
        />
        <Button onClick={handleAddTag}>
          <Plus size={16} className="mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
} 