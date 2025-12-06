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
import { iconMap } from './token';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface IconEditDialogProps {
  token: TemplateToken | null;
  isCreating: boolean;
  onUpdate: (updatedToken: TemplateToken) => void;
  onCreate: (newToken: Omit<TemplateToken, 'id'>) => void;
  onClose: () => void;
}

// Get the list of available icons from the iconMap, excluding the default
const availableIcons = Object.keys(iconMap).filter(
  (key) => key !== 'default' && key !== 'Player' && key !== 'Monster'
);

export function IconEditDialog({ token, isCreating, onUpdate, onCreate, onClose }: IconEditDialogProps) {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('');

  useEffect(() => {
    if (token) {
      setName(isCreating ? 'New Preset' : token.name);
      setIconName(isCreating ? 'HelpCircle' : token.iconName);
    }
  }, [token, isCreating]);

  if (!token) {
    return null;
  }

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
            <SaveIcon className="mr-2 h-4 w-4" /> {isCreating ? "Create Preset" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
