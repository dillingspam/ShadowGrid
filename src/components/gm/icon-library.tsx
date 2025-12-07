/**
 * @file This file defines the IconLibrary component, which serves as a repository
 * for token presets. It allows the GM to manage categories and token templates,
 * and to drag-and-drop new tokens onto the map.
 */

'use client';
import React, { useState, useMemo } from 'react';
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
  Search,
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
import { getIconData, gameIconCategories } from '@/lib/game-icons';
import { Icon } from '@iconify/react';
import { Input } from '../ui/input';

/**
 * Interface for a single token template/preset in the library.
 */
export interface TemplateToken {
  id: string;
  name: string;
  tokenType: string; // e.g., 'player', 'monster', 'item'
  iconName: string; // e.g., 'game-icons:dragon-head'
}

/**
 * Interface for a category of token templates.
 */
export interface TokenCategory {
  id: string;
  title: string;
  iconName: string; // e.g., 'Users' (Lucide) or 'game-icons:dragon-head' (Iconify)
  tokens: TemplateToken[];
}

// Initial data for the token library. This serves as the default set of categories and presets.
const initialCategories: TokenCategory[] = [
  {
    id: 'cat-player',
    title: 'Players & NPCs',
    iconName: 'Users',
    tokens: [
      { id: 'player-template-1', name: 'Player', tokenType: 'player', iconName: 'game-icons:person' },
      { id: 'player-template-2', name: 'Guardian', tokenType: 'player', iconName: 'game-icons:shield' },
    ],
  },
  {
    id: 'cat-monster',
    title: 'Monsters',
    iconName: 'game-icons:monster-grasp',
    tokens: [
      { id: 'monster-template-1', name: 'Undead', tokenType: 'monster', iconName: 'game-icons:skull-trophy' },
      { id: 'monster-template-2', name: 'Spirit', tokenType: 'monster', iconName: 'game-icons:ghost' },
      { id: 'monster-template-3', name: 'Beast', tokenType: 'monster', iconName: 'game-icons:wolf-head' },
      { id: 'monster-template-4', name: 'Melee', tokenType: 'monster', iconName: 'game-icons:sword-in-stone' },
    ],
  },
  {
    id: 'cat-item',
    title: 'Items',
    iconName: 'ShoppingBag',
    tokens: [
      { id: 'item-template-1', name: 'Treasure', tokenType: 'item', iconName: 'game-icons:treasure-chest' },
      { id: 'item-template-2', name: 'Objective', tokenType: 'item', iconName: 'game-icons:crystal-ball' },
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
  
  const iconData = getIconData(token.iconName);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          className="flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]"
        >
          {iconData ? (
             <Icon icon={iconData} className="w-3/4 h-3/4" />
          ) : (
             <div className="w-3/4 h-3/4 bg-red-500" /> // Error state
          )}
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

  const isIconify = category.iconName.includes(':');
  const CategoryIcon = isIconify ? () => <Icon icon={category.iconName} className="w-4 h-4" /> : iconMap[category.iconName] || iconMap.default;


  return (
    <>
      <Collapsible defaultOpen>
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <CategoryIcon />
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
                        iconName: 'game-icons:help',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('presets');

  const filteredGameIconCategories = useMemo(() => {
    if (!searchTerm) {
      return gameIconCategories;
    }
    return gameIconCategories.map(category => {
      const filteredIcons = category.icons.filter(icon => icon.name.includes(searchTerm.toLowerCase()));
      return { ...category, icons: filteredIcons };
    }).filter(category => category.icons.length > 0);
  }, [searchTerm]);

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
  
  const DraggableGameIcon = ({ iconName }: { iconName: string }) => {
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      const dragData = {
        type: 'new-token',
        tokenType: 'item', // Default type, can be changed later
        icon: iconName,
        name: iconName.split(':')[1].replace(/-/g, ' '),
      };
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'copy';
    };
  
    const iconData = getIconData(iconName);
  
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable
            onDragStart={onDragStart}
            className="flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]"
          >
            {iconData ? (
               <Icon icon={iconData} className="w-3/4 h-3/4" />
            ) : null}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Drag to add {iconName.split(':')[1]}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
           <h3
            className="text-lg font-semibold font-headline text-primary"
            style={{ textShadow: '0 0 5px hsl(var(--primary))' }}
          >
            Token Library
          </h3>
        </div>

        <div className='flex gap-2 mb-2'>
            <Button variant={activeTab === 'presets' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('presets')} className="flex-1">Presets</Button>
            <Button variant={activeTab === 'all' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('all')} className="flex-1">All Icons</Button>
        </div>


        {activeTab === 'presets' ? (
          <>
            <ScrollArea className="flex-grow -mr-4 pr-4">
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
             <div className="pt-4 mt-auto border-t">
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
          </>
        ) : (
          <div className="flex flex-col flex-grow min-h-0">
             <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all icons..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="flex-grow -mr-4 pr-4">
                {filteredGameIconCategories.map(category => (
                    <Collapsible defaultOpen key={category.name} className="mb-2">
                        <CollapsibleTrigger className="w-full text-left font-semibold text-sm text-muted-foreground mb-2">{category.name}</CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="grid grid-cols-4 gap-4">
                                {category.icons.map(icon => (
                                    <DraggableGameIcon key={icon.fullName} iconName={icon.fullName} />
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </ScrollArea>
          </div>
        )}
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
