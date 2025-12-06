'use client';
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Users,
  VenetianMask,
  ShoppingBag,
  Edit,
  Trash2,
  MoreVertical,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconEditDialog } from './icon-edit-dialog';
import { iconMap } from './token';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '../ui/separator';

export interface TemplateToken {
  id: string;
  name: string;
  tokenType: 'player' | 'monster' | 'item';
  iconName: string;
}

const initialPlayers: TemplateToken[] = [
  { id: 'player-template-1', name: 'Player', tokenType: 'player', iconName: 'Shield' },
  { id: 'player-template-2', name: 'Guardian', tokenType: 'player', iconName: 'Shield' },
];

const initialMonsters: TemplateToken[] = [
  { id: 'monster-template-1', name: 'Undead', tokenType: 'monster', iconName: 'Skull' },
  { id: 'monster-template-2', name: 'Spirit', tokenType: 'monster', iconName: 'Ghost' },
  { id: 'monster-template-3', name: 'Beast', tokenType: 'monster', iconName: 'Flame' },
  { id: 'monster-template-4', name: 'Melee', tokenType: 'monster', iconName: 'Swords' },
];

const initialItems: TemplateToken[] = [
  { id: 'item-template-1', name: 'Treasure', tokenType: 'item', iconName: 'Box' },
  { id: 'item-template-2', name: 'Objective', tokenType: 'item', iconName: 'Gem' },
];

const DraggableToken = ({ token }: { token: TemplateToken }) => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const dragData = {
      type: 'new-token',
      tokenType: token.tokenType,
      icon: token.iconName,
      name: token.name,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const IconComponent = iconMap[token.iconName] || iconMap.default;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          className="p-3 flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]"
        >
          <IconComponent size={32} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Drag to add {token.name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const IconCategory = ({
  title,
  icon,
  tokens,
  tokenType,
  onTokenUpdate,
  onTokenDelete,
  onTokenAdd,
}: {
  title: string;
  icon: React.ReactNode;
  tokens: TemplateToken[];
  tokenType: 'player' | 'monster' | 'item';
  onTokenUpdate: (token: TemplateToken) => void;
  onTokenDelete: (id: string) => void;
  onTokenAdd: (token: Omit<TemplateToken, 'id'>) => void;
}) => {
  const [editingToken, setEditingToken] = useState<TemplateToken | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (newTokenData: Omit<TemplateToken, 'id'>) => {
    onTokenAdd(newTokenData);
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {icon}
            <span className="ml-2">{title}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid grid-cols-4 gap-4">
            {tokens.map((token) => (
              <div key={token.id} className="relative group">
                <DraggableToken token={token} />
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setIsCreating(false);
                        setEditingToken(token);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onTokenDelete(token.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
             <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={() => {
                      setIsCreating(true);
                      setEditingToken({id: '', name: 'New Preset', iconName: 'HelpCircle', tokenType});
                    }} className="p-3 flex aspect-square items-center justify-center rounded-lg bg-transparent hover:bg-secondary cursor-pointer transition-all text-muted-foreground hover:text-primary">
                        <PlusCircle size={32} />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Add new preset</p>
                </TooltipContent>
            </Tooltip>
          </div>
        </PopoverContent>
      </Popover>

      <IconEditDialog
        token={editingToken}
        isCreating={isCreating}
        onUpdate={(updatedToken) => {
          onTokenUpdate(updatedToken);
          setEditingToken(null);
        }}
        onCreate={handleCreate}
        onClose={() => setEditingToken(null)}
      />
    </>
  );
};

export function IconLibrary() {
  const [players, setPlayers] = useState<TemplateToken[]>(initialPlayers);
  const [monsters, setMonsters] = useState<TemplateToken[]>(initialMonsters);
  const [items, setItems] = useState<TemplateToken[]>(initialItems);

  const handleUpdate = (
    list: TemplateToken[],
    setter: React.Dispatch<React.SetStateAction<TemplateToken[]>>
  ) => (updatedToken: TemplateToken) => {
    setter(list.map((t) => (t.id === updatedToken.id ? updatedToken : t)));
  };

  const handleDelete = (
    list: TemplateToken[],
    setter: React.Dispatch<React.SetStateAction<TemplateToken[]>>
  ) => (id: string) => {
    setter(list.filter((t) => t.id !== id));
  };

  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<TemplateToken[]>>
  ) => (newTokenData: Omit<TemplateToken, 'id'>) => {
    const newId = `template-${newTokenData.tokenType}-${Date.now()}`;
    setter(prev => [...prev, { ...newTokenData, id: newId }]);
  };


  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4 flex flex-col h-[55%]">
        <h3 className="text-lg font-semibold mb-4 font-headline text-primary" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
          Token Library
        </h3>
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-2">
            <IconCategory
              title="Players & NPCs"
              icon={<Users className="w-4 h-4" />}
              tokens={players}
              tokenType="player"
              onTokenUpdate={handleUpdate(players, setPlayers)}
              onTokenDelete={handleDelete(players, setPlayers)}
              onTokenAdd={handleAdd(setPlayers)}
            />
            <IconCategory
              title="Monsters"
              icon={<VenetianMask className="w-4 h-4" />}
              tokens={monsters}
              tokenType="monster"
              onTokenUpdate={handleUpdate(monsters, setMonsters)}
              onTokenDelete={handleDelete(monsters, setMonsters)}
              onTokenAdd={handleAdd(setMonsters)}
            />
            <IconCategory
              title="Items"
              icon={<ShoppingBag className="w-4 h-4" />}
              tokens={items}
              tokenType="item"
              onTokenUpdate={handleUpdate(items, setItems)}
              onTokenDelete={handleDelete(items, setItems)}
              onTokenAdd={handleAdd(setItems)}
            />
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
