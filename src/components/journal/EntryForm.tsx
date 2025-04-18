'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Define the Mood type
type Mood = 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral' | 'Calm' | 'Energetic' | 'Reflective';

// Define the JournalEntry interface
interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  createdAt: string;
  lastEdited: string;
  favorite?: boolean;
}

interface EntryFormProps {
  entry?: JournalEntry | null;
  onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'lastEdited'>) => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ entry, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(entry ? entry.title : '');
  const [content, setContent] = useState(entry ? entry.content : '');
  const [mood, setMood] = useState<Mood>(entry ? entry.mood : 'Neutral');
  const [tags, setTags] = useState(entry ? entry.tags.join(', ') : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      mood,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Quill editor formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
      <div className="container max-w-2xl mx-auto h-full py-16">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {entry ? 'Edit Entry' : 'New Entry'}
              </h2>
            </div>

            <div className="p-6 space-y-6 flex-grow overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gray-300 focus:ring-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Mood</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['Happy', 'Sad', 'Anxious', 'Productive', 'Neutral', 'Calm', 'Energetic', 'Reflective'].map((m) => (
                    <Button
                      key={m}
                      type="button"
                      variant={mood === m ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMood(m as Mood)}
                      className={mood === m ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700">Content</Label>
                <div className="h-64">
                  <ReactQuill
                    id="content"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your thoughts..."
                    className="[&_.ql-container]:rounded-b-lg [&_.ql-toolbar]:rounded-none [&_.ql-editor]:min-h-[200px] [&_.ql-container]:border-gray-200 [&_.ql-toolbar]:border-gray-200 [&_.ql-editor]:text-gray-800 [&_.ql-editor]:placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-700">Tags</Label>
                <Input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags separated by commas..."
                  className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gray-300 focus:ring-gray-300"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 mt-auto">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="default"
                size="sm"
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                {entry ? 'Save Changes' : 'Create Entry'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 