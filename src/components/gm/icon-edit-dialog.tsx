/**
 * @file This file defines a dialog component for creating and editing individual token presets.
 * It allows the user to change a preset's name and select a new icon.
 */

'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Save, PlusCircle, Search } from 'lucide-react';
import type { TemplateToken } from './icon-library';
import { getIconData, allGameIcons } from '@/lib/game-icons';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Icon } from '@iconify/react';


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
  const [iconName, setIconName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
      if (!searchTerm) {
          return allGameIcons;
      }
      return allGameIcons.filter(icon => icon.name.includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

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
      <DialogContent className="sm:max-w-xl">
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
          {/* Scrollable grid for selecting an icon */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Icon</Label>
            <div className="col-span-3">
              <div className="relative mb-2">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                 />
              </div>
              <ScrollArea className="h-64 w-full rounded-md border p-2">
                <TooltipProvider>
                  <div className="grid grid-cols-6 gap-1">
                    {filteredIcons.map((icon) => {
                      const iconData = getIconData(icon.fullName);
                      if (!iconData) return null;

                      return (
                        <Tooltip key={icon.fullName}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                'h-12 w-12',
                                iconName === icon.fullName && 'bg-accent text-accent-foreground'
                              )}
                              onClick={() => setIconName(icon.fullName)}
                            >
                              <Icon icon={iconData} className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{icon.name}</p>
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
