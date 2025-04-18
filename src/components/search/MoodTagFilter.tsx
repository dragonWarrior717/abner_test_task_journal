import { useState } from 'react';
import { Smile, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface MoodTagFilterProps {
  moods: string[];
  tags: string[];
  selectedMoods: string[];
  selectedTags: string[];
  onMoodChange: (moods: string[]) => void;
  onTagChange: (tags: string[]) => void;
}

export function MoodTagFilter({
  moods,
  tags,
  selectedMoods,
  selectedTags,
  onMoodChange,
  onTagChange,
}: MoodTagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Smile className="h-4 w-4" />
          <Tag className="h-4 w-4" />
          <span className="text-sm">
            {selectedMoods.length + selectedTags.length > 0
              ? `${selectedMoods.length} moods, ${selectedTags.length} tags`
              : "Filter by mood & tags"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Moods</h4>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Badge
                  key={mood}
                  variant={selectedMoods.includes(mood) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedMoods.includes(mood)) {
                      onMoodChange(selectedMoods.filter((m) => m !== mood));
                    } else {
                      onMoodChange([...selectedMoods, mood]);
                    }
                  }}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      onTagChange(selectedTags.filter((t) => t !== tag));
                    } else {
                      onTagChange([...selectedTags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 