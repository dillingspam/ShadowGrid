/**
 * @file This file defines the IconLibrary component, which serves as a repository
 * for token presets. It allows the GM to manage categories and token templates,
 * and to drag-and-drop new tokens onto the map.
 */

'use client';
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Edit, Trash2, MoreVertical, PlusCircle, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconEditDialog } from './icon-edit-dialog';
import { Icon } from '@/components/shared/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryEditDialog } from './category-edit-dialog';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

/**
 * Interface for a single token template/preset in the library.
 */
export interface TemplateToken {
  id: string;
  name: string;
  tokenType: string; // e.g., 'player', 'monster', 'item'
  iconName: string;
}

/**
 * Interface for a category of token templates.
 */
export interface TokenCategory {
  id: string;
  title: string;
  tokens: TemplateToken[];
}

// Initial data for the token library. This serves as the default set of categories and presets.
const initialCategories: TokenCategory[] = [
  {
    id: 'cat-player',
    title: 'Players & NPCs',
    tokens: [
      { id: 'player-template-1', name: 'Barbarian', tokenType: 'player', iconName: 'game-icons:barbarian' },
      { id: 'player-template-2', name: 'Knight', tokenType: 'player', iconName: 'game-icons:knight-helmet' },
      { id: 'player-template-3', name: 'Archer', tokenType: 'player', iconName: 'game-icons:archer' },
      { id: 'player-template-4', name: 'Wizard', tokenType: 'player', iconName: 'game-icons:wizard-face' },
    ],
  },
  {
    id: 'cat-monster',
    title: 'Monsters',
    tokens: [
      { id: 'monster-template-1', name: 'Dragon', tokenType: 'monster', iconName: 'game-icons:dragon-head' },
      { id: 'monster-template-2', name: 'Goblin', tokenType: 'monster', iconName: 'game-icons:goblin-head' },
      { id: 'monster-template-3', name: 'Orc', tokenType: 'monster', iconName: 'game-icons:orc-head' },
      { id: 'monster-template-4', name: 'Slime', tokenType: 'monster', iconName: 'game-icons:jelly-ooze' },
    ],
  },
  {
    id: 'cat-item',
    title: 'Items',
    tokens: [
      { id: 'item-template-1', name: 'Sword', tokenType: 'item', iconName: 'game-icons:sword-hilt' },
      { id: 'item-template-2', name: 'Shield', tokenType: 'item', iconName: 'game-icons:round-shield' },
      { id: 'item-template-3', name: 'Potion', tokenType: 'item', iconName: 'game-icons:health-potion' },
      { id: 'item-template-4', name: 'Key', tokenType: 'item', iconName: 'game-icons:key-basic' },
    ],
  },
];

/**
 * A draggable token preset from the library.
 * @param {{ token: TemplateToken }} props The component props.
 * @returns {JSX.Element} A draggable div containing the token icon.
 */
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          className="flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_5px_hsl(var(--primary))]"
        >
          <Icon name={token.iconName} className="w-3/4 h-3/4" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Drag to add {token.name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

/**
 * A collapsible component representing a single category in the token library.
 * @param {object} props The component props.
 * @returns {JSX.Element} A collapsible section for a category.
 */
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
  const [isCreatingToken, setIsCreatingToken] = useState(false);

  const handleCreateToken = (newTokenData: Omit<TemplateToken, 'id'>) => {
    onTokenAdd(category.id, newTokenData);
  };

  return (
    <>
      <Collapsible>
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start pl-2">
              <span className="flex-1 text-left font-semibold">{category.title}</span>
            </Button>
          </CollapsibleTrigger>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 ml-1 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onCategoryUpdate(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryDelete(category.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CollapsibleContent className="p-2">
          <div className="grid grid-cols-4 gap-4">
            {category.tokens.map((token) => (
              <div key={token.id} className="relative group">
                <DraggableToken token={token} />
                <div className="absolute top-0 right-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { setIsCreatingToken(false); setEditingToken(token); }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTokenDelete(category.id, token.id)} className="text-destructive focus:text-destructive">
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
                <button
                  onClick={() => {
                    setIsCreatingToken(true);
                    setEditingToken({
                      id: '',
                      name: 'New Preset',
                      iconName: 'game-icons:add',
                      tokenType: category.id.startsWith('cat-player') ? 'player' : category.id.startsWith('cat-monster') ? 'monster' : 'item',
                    });
                  }}
                  className="flex aspect-square items-center justify-center rounded-lg bg-transparent hover:bg-secondary cursor-pointer transition-all text-muted-foreground hover:text-primary"
                >
                  <PlusCircle className="w-8 h-8" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Add new preset</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <IconEditDialog
        token={editingToken}
        isCreating={isCreatingToken}
        onUpdate={(updatedToken) => {
          onTokenUpdate(category.id, updatedToken);
          setEditingToken(null);
        }}
        onCreate={(newToken) => {
          handleCreateToken(newToken);
          setEditingToken(null);
        }}
        onClose={() => setEditingToken(null)}
      />
    </>
  );
};

/**
 * The main component for the token library sidebar.
 * It manages the state for all categories and their presets.
 *
 * @returns {JSX.Element} The rendered token library panel.
 */
export function IconLibrary() {
  const [categories, setCategories] = useState<TokenCategory[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Omit<TokenCategory, 'tokens'> | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleTokenUpdate = (categoryId: string, updatedToken: TemplateToken) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tokens: cat.tokens.map((t) => (t.id === updatedToken.id ? updatedToken : t)) }
          : cat
      )
    );
  };

  const handleTokenDelete = (categoryId: string, tokenId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tokens: cat.tokens.filter((t) => t.id !== tokenId) }
          : cat
      )
    );
  };

  const handleTokenAdd = (categoryId: string, newTokenData: Omit<TemplateToken, 'id'>) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const newId = `template-${newTokenData.tokenType}-${Date.now()}`;
          return { ...cat, tokens: [...cat.tokens, { ...newTokenData, id: newId }] };
        }
        return cat;
      })
    );
  };

  const handleCategoryAdd = (newCategoryData: Omit<TokenCategory, 'id' | 'tokens'>) => {
    const newCategory: TokenCategory = {
      ...newCategoryData,
      id: `cat-${Date.now()}`,
      tokens: [],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleCategoryUpdate = (updatedCategory: TokenCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? { ...c, ...updatedCategory } : c))
    );
  };

  const handleCategoryDelete = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4 flex flex-col h-full">
        <h3
          className="text-lg font-semibold font-headline text-primary mb-4 shrink-0"
          style={{ textShadow: '0 0 5px hsl(var(--primary))' }}
        >
          Token Library
        </h3>
        <ScrollArea className="flex-grow -mr-4 pr-4">
          <div className="space-y-1">
            {categories.map((category) => (
              <IconCategory
                key={category.id}
                category={category}
                onTokenUpdate={handleTokenUpdate}
                onTokenDelete={handleTokenDelete}
                onTokenAdd={handleTokenAdd}
                onCategoryUpdate={(cat) => {
                  setEditingCategory(cat);
                  setIsCreatingCategory(false);
                }}
                onCategoryDelete={handleCategoryDelete}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="shrink-0">
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsCreatingCategory(true);
              setEditingCategory({ id: '', title: 'New Category' });
            }}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          isCreating={isCreatingCategory}
          onUpdate={(catData) => {
            const fullCategory = categories.find(c => c.id === catData.id);
            if (fullCategory) {
              handleCategoryUpdate({ ...fullCategory, ...catData });
            }
            setIsCreatingCategory(false);
            setEditingCategory(null);
          }}
          onCreate={(catData) => {
            handleCategoryAdd(catData);
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
