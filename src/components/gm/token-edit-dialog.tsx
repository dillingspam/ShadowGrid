/**
 * @file This file defines a dialog component for editing the properties of an individual token
 * that has been placed on the map grid.
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
import { Slider } from '@/components/ui/slider';
import { Trash2, Save } from 'lucide-react';
import type { TokenData } from './token';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Props for the TokenEditDialog component.
 */
interface TokenEditDialogProps {
  /** The token data to be edited. If null, the dialog is not shown. */
  token: TokenData | null;
  /** Callback function to update the token's data. */
  onUpdate: (updatedToken: TokenData) => void;
  /** Callback function to delete the token. */
  onDelete: (tokenId: string) => void;
  /** Callback function to close the dialog. */
  onClose: () => void;
}

// Pre-defined color options for tokens.
const colors = [
  { name: 'Accent', value: 'hsl(var(--accent))' },
  { name: 'Destructive', value: 'hsl(var(--destructive))' },
  { name: 'Primary', value: 'hsl(var(--primary))' },
  { name: 'Player Blue', value: 'hsl(207, 98%, 48%)' },
  { name: 'Monster Red', value: 'hsl(0, 84%, 60%)' },
  { name: 'Item Purple', value: 'hsl(277, 79%, 31%)' },
];

/**
 * A dialog for editing a token's properties, such as its name, size, and color.
 *
 * @param {TokenEditDialogProps} props The component props.
 * @returns {JSX.Element | null} The rendered dialog or null if not open.
 */
export function TokenEditDialog({
  token,
  onUpdate,
  onDelete,
  onClose,
}: TokenEditDialogProps) {
  const [name, setName] = useState('');
  const [size, setSize] = useState(1);
  const [color, setColor] = useState('');

  // Effect to populate the dialog's state when the token prop changes.
  useEffect(() => {
    if (token) {
      setName(token.name);
      setSize(token.size);
      setColor(token.color);
    }
  }, [token]);

  // If no token is provided, don't render the dialog.
  if (!token) {
    return null;
  }

  // Calls the onUpdate callback with the modified token data.
  const handleSave = () => {
    onUpdate({ ...token, name, size, color });
    onClose();
  };

  // Calls the onDelete callback.
  const handleDelete = () => {
    onDelete(token.id);
    onClose();
  };

  return (
    <Dialog open={!!token} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Token: {token.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Input for token name */}
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
          {/* Slider for token size */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Size
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Slider
                id="size"
                min={1}
                max={5}
                step={1}
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
              />
              <span className="w-8 text-center font-mono">{size}</span>
            </div>
          </div>
          {/* Select dropdown for token color */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: c.value }}
                      />
                      <span>{c.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="destructive" onClick={handleDelete} className='mb-2 sm:mb-0'>
            <Trash2 className="mr-2 h-4 w-4" /> Delete Token
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
