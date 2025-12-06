/**
 * @file This file defines a dialog component for creating and editing token categories.
 * It allows the user to change a category's name and select a new icon.
 */

'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, PlusCircle, FolderPlus } from 'lucide-react';
import type { TokenCategory } from './icon-library';
import { iconMap } from './token';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

/**
 * Props for the CategoryEditDialog component.
 */
interface CategoryEditDialogProps {
  /** The category object to edit. If null, the dialog is closed. If `isCreating` is true, this is a template. */
  category: Omit<TokenCategory, 'tokens'> | null;
  /** True if creating a new category, false if editing an existing one. */
  isCreating: boolean;
  /** Callback function when an existing category is updated. */
  onUpdate: (updatedCategory: TokenCategory) => void;
  /** Callback function when a new category is created. */
  onCreate: (newCategory: Omit<TokenCategory, 'id' | 'tokens'>) => void;
  /** Callback function to close the dialog. */
  onClose: () => void;
}

// Get the list of available icons from the iconMap, excluding the default icon.
const availableIcons = Object.keys(iconMap).filter(
  (key) => key !== 'default'
);

/**
 * A dialog for creating or editing a token category's properties.
 *
 * @param {CategoryEditDialogProps} props The component props.
 * @returns {JSX.Element | null} The rendered dialog or null if not open.
 */
export function CategoryEditDialog({ category, isCreating, onUpdate, onCreate, onClose }: CategoryEditDialogProps) {
  const [title, setTitle] = useState('');
  const [iconName, setIconName] = useState('');

  // Effect to populate the dialog's state when the category prop changes.
  useEffect(() => {
    if (category) {
      setTitle(isCreating ? 'New Category' : category.title);
      setIconName(isCreating ? 'FolderPlus' : category.iconName);
    }
  }, [category, isCreating]);

  if (!category) {
    return null;
  }

  // Handles the save action for both creating and updating.
  const handleSave = () => {
    if (isCreating) {
      onCreate({ title, iconName });
    } else {
      // For updates, we need to merge the changes with the existing category data.
      // This implementation detail is due to the dialog only managing a subset of category properties.
      const updatedCategory = { ...(category as TokenCategory), title, iconName };
      onUpdate(updatedCategory);
    }
    onClose();
  };

  const dialogTitle = isCreating ? "Create New Category" : `Edit Category: ${category.title}`;
  const SaveIcon = isCreating ? PlusCircle : Save;

  return (
    <Dialog open={!!category} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Input for the category name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          {/* Scrollable grid for selecting an icon */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Icon</Label>
            <div className="col-span-3">
              <ScrollArea className="h-32 w-full rounded-md border p-2">
                <TooltipProvider>
                  <div className="grid grid-cols-5 gap-2">
                    {availableIcons.map((key) => {
                      const IconComponent = iconMap[key];
                      return (
                        <Tooltip key={key}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                'h-12 w-12',
                                iconName === key && 'bg-accent text-accent-foreground'
                              )}
                              onClick={() => setIconName(key)}
                            >
                              <IconComponent className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{key}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </ScrollArea>
               <p className="text-xs text-muted-foreground mt-2">
                Selected Icon: <span className="font-semibold">{iconName}</span>
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            <SaveIcon className="mr-2 h-4 w-4" /> {isCreating ? "Create Category" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
