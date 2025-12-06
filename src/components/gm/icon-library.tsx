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
  Edit,
  Trash2,
  MoreVertical,
  PlusCircle,
  FolderPlus,
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
import { CategoryEditDialog } from './category-edit-dialog';
import { Separator } from '../ui/separator';

export interface TemplateToken {
  id: string;
  name: string;
  tokenType: string;
  iconName: string;
}

export interface TokenCategory {
  id: string;
  title: string;
  iconName: string;
  tokens: TemplateToken[];
}

const initialCategories: TokenCategory[] = [
  {
    id: 'cat-player',
    title: 'Players & NPCs',
    iconName: 'Users',
    tokens: [
      { id: 'player-template-1', name: 'Player', tokenType: 'player', iconName: 'Shield' },
      { id: 'player-template-2', name: 'Guardian', tokenType: 'player', iconName: 'Shield' },
    ],
  },
  {
    id: 'cat-monster',
    title: 'Monsters',
    iconName: 'VenetianMask',
    tokens: [
      { id: 'monster-template-1', name: 'Undead', tokenType: 'monster', iconName: 'Skull' },
      { id: 'monster-template-2', name: 'Spirit', tokenType: 'monster', iconName: 'Ghost' },
      { id: 'monster-template-3', name: 'Beast', tokenType: 'monster', iconName: 'Flame' },
      { id: 'monster-template-4', name: 'Melee', tokenType: 'monster', iconName: 'Swords' },
    ],
  },
  {
    id: 'cat-item',
    title: 'Items',
    iconName: 'ShoppingBag',
    tokens: [
      { id: 'item-template-1', name: 'Treasure', tokenType: 'item', iconName: 'Box' },
      { id: 'item-template-2', name: 'Objective', tokenType: 'item', iconName: 'Gem' },
    ],
  },
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
  category,
  onTokenUpdate,
  onTokenDelete,
  onTokenAdd,
  onCategoryUpdate,
  onCategoryDelete,
}: {
  category: TokenCategory;
  onTokenUpdate: (categoryId: string, updatedToken: TemplateToken) => void;
  onTokenDelete: (categoryId: string, tokenId: string) => void;
  onTokenAdd: (categoryId: string, newToken: Omit<TemplateToken, 'id'>) => void;
  onCategoryUpdate: (updatedCategory: TokenCategory) => void;
  onCategoryDelete: (categoryId: string) => void;
}) => {
  const [editingToken, setEditingToken] = useState<TemplateToken | null>(null);
  const [editingCategory, setEditingCategory] = useState<TokenCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (newTokenData: Omit<TemplateToken, 'id'>) => {
    onTokenAdd(category.id, newTokenData);
  }

  const CategoryIcon = iconMap[category.iconName] || iconMap.default;

  return (
    <>
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CategoryIcon className="w-4 h-4" />
              <span className="ml-2 flex-1 text-left">{category.title}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid grid-cols-4 gap-4">
              {category.tokens.map((token) => (
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
                          onClick={() => onTokenDelete(category.id, token.id)}
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
                        setEditingToken({id: '', name: 'New Preset', iconName: 'HelpCircle', tokenType: 'item' });
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 ml-1 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEditingCategory(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCategoryDelete(category.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <IconEditDialog
        token={editingToken}
        isCreating={isCreating}
        onUpdate={(updatedToken) => {
          onTokenUpdate(category.id, updatedToken);
          setEditingToken(null);
        }}
        onCreate={handleCreate}
        onClose={() => setEditingToken(null)}
      />

      {editingCategory && !isCreating && (
        <CategoryEditDialog
          category={editingCategory}
          isCreating={false}
          onUpdate={onCategoryUpdate}
          onClose={() => setEditingCategory(null)}
          onCreate={() => {}}
        />
      )}
    </>
  );
};

export function IconLibrary() {
  const [categories, setCategories] = useState<TokenCategory[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Omit<TokenCategory, 'tokens'> | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleTokenUpdate = (categoryId: string, updatedToken: TemplateToken) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tokens: cat.tokens.map(t => t.id === updatedToken.id ? updatedToken : t) }
        : cat
    ));
  };

  const handleTokenDelete = (categoryId: string, tokenId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tokens: cat.tokens.filter(t => t.id !== tokenId) }
        : cat
    ));
  };

  const handleTokenAdd = (categoryId: string, newTokenData: Omit<TemplateToken, 'id'>) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newId = `template-${newTokenData.tokenType}-${Date.now()}`;
        return { ...cat, tokens: [...cat.tokens, { ...newTokenData, id: newId }] };
      }
      return cat;
    }));
  };

  const handleCategoryAdd = (newCategoryData: Omit<TokenCategory, 'id' | 'tokens'>) => {
    const newCategory: TokenCategory = {
      ...newCategoryData,
      id: `cat-${Date.now()}`,
      tokens: [],
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleCategoryUpdate = (updatedCategory: TokenCategory) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const handleCategoryDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 font-headline text-primary" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
          Token Library
        </h3>
        <ScrollArea className="max-h-[400px] -mr-4 pr-4">
          <div className="space-y-2">
            {categories.map(category => (
               <IconCategory
                key={category.id}
                category={category}
                onTokenUpdate={handleTokenUpdate}
                onTokenDelete={handleTokenDelete}
                onTokenAdd={handleTokenAdd}
                onCategoryUpdate={handleCategoryUpdate}
                onCategoryDelete={handleCategoryDelete}
              />
            ))}
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setIsCreatingCategory(true);
            setEditingCategory({ id: '', title: 'New Category', iconName: 'FolderPlus'});
          }}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

       {editingCategory && isCreatingCategory && (
         <CategoryEditDialog
            category={editingCategory}
            isCreating={isCreatingCategory}
            onUpdate={() => {}}
            onCreate={(catData) => {
              handleCategoryAdd(catData)
              setIsCreatingCategory(false);
              setEditingCategory(null);
            }}
            onClose={() => {
              setIsCreatingCategory(false);
              setEditingCategory(null);
            }}
          />
       )}
    </TooltipProvider>
  );
}
