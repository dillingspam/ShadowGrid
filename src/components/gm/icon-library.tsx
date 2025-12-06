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
import { CategoryEditDialog } from './category-edit-dialog';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '@/lib/utils';

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
  iconName: string;
  tokens: TemplateToken[];
}

// Initial data for the token library. This serves as the default set of categories and presets.
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

/**
 * A draggable token preset from the library.
 * @param {{ token: TemplateToken }} props The component props.
 * @returns {JSX.Element} A draggable div containing the token icon.
 */
const DraggableToken = ({ token }: { token: TemplateToken }) => {
  // Sets the data to be transferred during a drag-and-drop operation.
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
          className="flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]"
        >
          <IconComponent className="w-3/4 h-3/4" />
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

  const CategoryIcon = iconMap[category.iconName] || iconMap.default;

  return (
    <>
      <Collapsible>
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <CategoryIcon className="w-4 h-4" />
              <span className="ml-2 flex-1 text-left">{category.title}</span>
            </Button>
          </CollapsibleTrigger>

          {/* Dropdown menu for editing or deleting the category itself */}
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
              {/* Renders each token preset within the category */}
              {category.tokens.map((token) => (
                <div key={token.id} className="relative group">
                  <DraggableToken token={token} />
                  {/* Dropdown for editing or deleting a specific token preset */}
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
              {/* Button to add a new preset to this category */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setIsCreatingToken(true);
                      setEditingToken({
                        id: '',
                        name: 'New Preset',
                        iconName: 'HelpCircle',
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

      {/* Dialog for editing or creating a token preset */}
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

  // Handler to update a specific token preset within a category.
  const handleTokenUpdate = (categoryId: string, updatedToken: TemplateToken) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tokens: cat.tokens.map((t) => (t.id === updatedToken.id ? updatedToken : t)) }
          : cat
      )
    );
  };

  // Handler to delete a specific token preset from a category.
  const handleTokenDelete = (categoryId: string, tokenId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tokens: cat.tokens.filter((t) => t.id !== tokenId) }
          : cat
      )
    );
  };

  // Handler to add a new token preset to a category.
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

  // Handler to add a new category.
  const handleCategoryAdd = (newCategoryData: Omit<TokenCategory, 'id' | 'tokens'>) => {
    const newCategory: TokenCategory = {
      ...newCategoryData,
      id: `cat-${Date.now()}`,
      tokens: [],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  // Handler to update an existing category's properties (name, icon).
  const handleCategoryUpdate = (updatedCategory: TokenCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    );
    setEditingCategory(updatedCategory as Omit<TokenCategory, 'tokens'>);
    setIsCreatingCategory(false);
  };

  // Handler to delete an entire category.
  const handleCategoryDelete = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4">
        <h3
          className="text-lg font-semibold font-headline text-primary mb-4"
          style={{ textShadow: '0 0 5px hsl(var(--primary))' }}
        >
          Token Library
        </h3>
        <ScrollArea className="max-h-[250px] -mr-4 pr-4">
          <div className="space-y-2">
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
        <div>
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsCreatingCategory(true);
              setEditingCategory({
                id: '',
                title: 'New Category',
                iconName: 'FolderPlus',
              });
            }}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Dialog for editing or creating a category */}
      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          isCreating={isCreatingCategory}
          onUpdate={(cat) => {
            const fullCategory = categories.find(c => c.id === cat.id);
            if (fullCategory) {
              handleCategoryUpdate({...fullCategory, ...cat});
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
