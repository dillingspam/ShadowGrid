/**
 * @file This file defines a dialog component for creating and editing individual token presets.
 * It allows the user to change a preset's name and select a new icon.
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
import type { TemplateToken } from './icon-library';
import { IconPickerDialog } from './icon-picker-dialog';
import { Icon } from '../shared/icon';

/**
 * Props for the IconEditDialog component.
 */
interface IconEditDialogProps {
  /** The token template object to edit. If null, the dialog is closed. */
  token: TemplateToken | null;
  /** True if creating a new preset, false if editing an existing one. */
  isCreating: boolean;
  /** Callback function when an existing token preset is updated. */
  onUpdate: (updatedToken: TemplateToken) => void;
  /** Callback function when a new token preset is created. */
  onCreate: (newToken: Omit<TemplateToken, 'id'>) => void;
  /** Callback function to close the dialog. */
  onClose: () => void;
}

/**
 * A dialog for creating or editing a token preset's properties (name and icon).
 *
 * @param {IconEditDialogProps} props The component props.
 * @returns {JSX.Element | null} The rendered dialog or null if not open.
 */
export function IconEditDialog({ token, isCreating, onUpdate, onCreate, onClose }: IconEditDialogProps) {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('game-icons:help');
  const [isIconPickerOpen, setIconPickerOpen] = useState(false);

  // Effect to populate the dialog's state when the token prop changes.
  useEffect(() => {
    if (token) {
      setName(isCreating ? 'New Preset' : token.name);
      setIconName(isCreating ? 'game-icons:help' : token.iconName);
    }
  }, [token, isCreating]);

  if (!token) {
    return null;
  }

  // Handles the save action for both creating and updating.
  const handleSave = () => {
    if (isCreating) {
      onCreate({ name, iconName, tokenType: token.tokenType });
    } else {
      onUpdate({ ...token, name, iconName });
    }
    onClose();
  };

  const dialogTitle = isCreating ? "Create New Preset" : `Edit Preset: ${token.name}`;
  const SaveIcon = isCreating ? PlusCircle : Save;

  return (
    <Dialog open={!!token} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Input for the preset name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          {/* Icon Picker Button and Preview */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Icon</Label>
            <div className="col-span-3 flex items-center gap-2">
                <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-gray-100">
                  <Icon name={iconName} size={24} />
                </div>
                <Button variant="outline" onClick={() => setIconPickerOpen(true)}>
                  Choose Icon
                </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            <SaveIcon className="mr-2 h-4 w-4" /> {isCreating ? "Create Preset" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <IconPickerDialog
        open={isIconPickerOpen}
        onOpenChange={setIconPickerOpen}
        onSelectIcon={setIconName}
      />
    </Dialog>
  );
}
