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
import { Save } from 'lucide-react';
import type { TemplateToken } from './icon-library';

interface IconEditDialogProps {
  token: TemplateToken | null;
  onUpdate: (updatedToken: TemplateToken) => void;
  onClose: () => void;
}

export function IconEditDialog({ token, onUpdate, onClose }: IconEditDialogProps) {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('');

  useEffect(() => {
    if (token) {
      setName(token.name);
      setIconName(token.iconName);
    }
  }, [token]);

  if (!token) {
    return null;
  }

  const handleSave = () => {
    onUpdate({ ...token, name, iconName });
    onClose();
  };

  return (
    <Dialog open={!!token} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Template: {token.name}</DialogTitle>
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
            <Label htmlFor="iconName" className="text-right">
              Icon Name
            </Label>
            <Input
              id="iconName"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., User, Skull, Gem"
            />
          </div>
           <p className="text-xs text-muted-foreground col-span-4 px-4">
              Enter a valid icon name from{' '}
              <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="underline">
                lucide.dev
              </a>.
            </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
