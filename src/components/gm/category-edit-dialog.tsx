/**
 * @file This file defines a dialog component for creating and editing token categories.
 * It allows the user to change a category's name.
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
import { Save, PlusCircle } from 'lucide-react';
import type { TokenCategory } from './icon-library';

/**
 * Props for the CategoryEditDialog component.
 */
interface CategoryEditDialogProps {
  /** The category object to edit. If null, the dialog is closed. If `isCreating` is true, this is a template. */
  category: Omit<TokenCategory, 'tokens'> | null;
  /** True if creating a new category, false if editing an existing one. */
  isCreating: boolean;
  /** Callback function when an existing category is updated. */
  onUpdate: (updatedCategory: Omit<TokenCategory, 'tokens'>) => void;
  /** Callback function when a new category is created. */
  onCreate: (newCategory: { title: string }) => void;
  /** Callback function to close the dialog. */
  onClose: () => void;
}

/**
 * A dialog for creating or editing a token category's properties.
 *
 * @param {CategoryEditDialogProps} props The component props.
 * @returns {JSX.Element | null} The rendered dialog or null if not open.
 */
export function CategoryEditDialog({ category, isCreating, onUpdate, onCreate, onClose }: CategoryEditDialogProps) {
  const [title, setTitle] = useState('');

  // Effect to populate the dialog's state when the category prop changes.
  useEffect(() => {
    if (category) {
      setTitle(isCreating ? 'New Category' : category.title);
    }
  }, [category, isCreating]);

  if (!category) {
    return null;
  }

  // Handles the save action for both creating and updating.
  const handleSave = () => {
    if (isCreating) {
      onCreate({ title });
    } else {
      onUpdate({ id: category.id, title });
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
