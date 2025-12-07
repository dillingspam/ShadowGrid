/**
 * @file Defines a dialog for browsing and selecting icons from the categorized game-icons library.
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getCategorizedIcons } from '@/lib/game-icons';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { Input } from '../ui/input';

interface IconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIcon: (iconName: string) => void;
}

export function IconPickerDialog({ open, onOpenChange, onSelectIcon }: IconPickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const categorizedIcons = useMemo(() => getCategorizedIcons(), []);

  // Filter icons based on the search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return categorizedIcons;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: Record<string, string[]> = {};
    for (const category in categorizedIcons) {
      const matchingIcons = categorizedIcons[category].filter(iconName =>
        iconName.toLowerCase().includes(lowercasedFilter)
      );
      if (matchingIcons.length > 0) {
        filtered[category] = matchingIcons;
      }
    }
    return filtered;
  }, [searchTerm, categorizedIcons]);


  const handleSelect = (iconName: string) => {
    onSelectIcon(iconName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
          <DialogDescription>Browse the library to select an icon for your token.</DialogDescription>
        </DialogHeader>
        
        <Input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <ScrollArea className="flex-grow">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(filteredIcons).map(([category, icons]) => (
              <AccordionItem value={category} key={category}>
                <AccordionTrigger>{category.charAt(0).toUpperCase() + category.slice(1)}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                    {icons.map(iconName => (
                      <Button
                        key={iconName}
                        variant="outline"
                        className="w-16 h-16 flex items-center justify-center"
                        onClick={() => handleSelect(iconName)}
                        title={iconName}
                      >
                        <Icon name={iconName} size={32} />
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
