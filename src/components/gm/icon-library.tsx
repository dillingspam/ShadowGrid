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
  User,
  Shield,
  Swords,
  Skull,
  Gem,
  Box,
  Ghost,
  Flame,
  Users,
  VenetianMask,
  ShoppingBag,
  MoreVertical,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconEditDialog } from './icon-edit-dialog';
import { iconMap } from './token';

export interface TemplateToken {
  id: string;
  name: string;
  tokenType: 'player' | 'monster' | 'item';
  iconName: string;
}

const initialPlayers: TemplateToken[] = [
  { id: 'player-template-1', name: 'Player', tokenType: 'player', iconName: 'User' },
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

  const IconComponent = iconMap[token.iconName] || User;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          className="p-3 flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]"
        >
          <IconComponent size={28} />
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
  onTokenUpdate,
  onTokenDelete,
}: {
  title: string;
  icon: React.ReactNode;
  tokens: TemplateToken[];
  onTokenUpdate: (token: TemplateToken) => void;
  onTokenDelete: (id: string) => void;
}) => {
  const [editingToken, setEditingToken] = useState<TemplateToken | null>(null);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {icon}
            <span className="ml-2">{title}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" side="right" align="start">
          <div className="grid grid-cols-4 gap-2">
            {tokens.map((token) => (
              <div key={token.id} className="relative group">
                <DraggableToken token={token} />
                <div className="absolute top-0 right-0 hidden group-hover:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setEditingToken(token)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onTokenDelete(token.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <IconEditDialog
        token={editingToken}
        onUpdate={(updatedToken) => {
          onTokenUpdate(updatedToken);
          setEditingToken(null);
        }}
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
              onTokenUpdate={handleUpdate(players, setPlayers)}
              onTokenDelete={handleDelete(players, setPlayers)}
            />
            <IconCategory
              title="Monsters"
              icon={<VenetianMask className="w-4 h-4" />}
              tokens={monsters}
              onTokenUpdate={handleUpdate(monsters, setMonsters)}
              onTokenDelete={handleDelete(monsters, setMonsters)}
            />
            <IconCategory
              title="Items"
              icon={<ShoppingBag className="w-4 h-4" />}
              tokens={items}
              onTokenUpdate={handleUpdate(items, setItems)}
              onTokenDelete={handleDelete(items, setItems)}
            />
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
