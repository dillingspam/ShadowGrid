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

interface TokenEditDialogProps {
  token: TokenData | null;
  onUpdate: (updatedToken: TokenData) => void;
  onDelete: (tokenId: string) => void;
  onClose: () => void;
}

const colors = [
  { name: 'Accent', value: 'hsl(var(--accent))' },
  { name: 'Destructive', value: 'hsl(var(--destructive))' },
  { name: 'Primary', value: 'hsl(var(--primary))' },
  { name: 'Player Blue', value: 'hsl(207, 98%, 48%)' },
  { name: 'Monster Red', value: 'hsl(0, 84%, 60%)' },
  { name: 'Item Purple', value: 'hsl(277, 79%, 31%)' },
];

export function TokenEditDialog({
  token,
  onUpdate,
  onDelete,
  onClose,
}: TokenEditDialogProps) {
  const [name, setName] = useState('');
  const [size, setSize] = useState(1);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (token) {
      setName(token.name);
      setSize(token.size);
      setColor(token.color);
    }
  }, [token]);

  if (!token) {
    return null;
  }

  const handleSave = () => {
    onUpdate({ ...token, name, size, color });
    onClose();
  };

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
