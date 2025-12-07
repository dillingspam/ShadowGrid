/**
 * @file This file defines the Token component and related constants and types.
 * The Token component is the visual representation of a character or item on the map grid.
 */

import type { FC, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Shield, HelpCircle, User, Swords, Skull, Gem, Box, Ghost, Flame, VenetianMask, ShoppingBag, Users, PlusCircle, FolderPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon as Iconify } from '@iconify/react';
import { getIconData } from '@/lib/game-icons';


/** The size of one grid cell in pixels. */
export const GRID_CELL_SIZE = 40;

/**
 * Interface defining the data structure for a single token.
 */
export interface TokenData {
  id: string;
  x: number; // The x-coordinate on the grid (0-indexed).
  y: number; // The y-coordinate on the grid (0-indexed).
  color: string; // The background color of the token (CSS color value).
  icon: string; // The key for the icon to display (e.g., 'Shield' or 'game-icons:dragon-head').
  size: number; // The size of the token in grid cells (e.g., 1 for 1x1, 2 for 2x2).
  name: string; // The name of the token, displayed in a tooltip.
}

/**
 * Props for the Token component.
 */
interface TokenProps extends TokenData {
  /** Callback for when the token is right-clicked. */
  onContextMenu: (e: MouseEvent, token: TokenData) => void;
  /** If true, disables dragging and context menu for the player view. */
  isPlayerView: boolean;
}

/**
 * A mapping of string keys to icon components.
 * This allows for dynamically selecting icons based on token data.
 * Used for Lucide icons, which are still used for category icons.
 */
export const iconMap: { [key: string]: React.ComponentType<{ className?: string, size?: number }> } = {
  // Lucide icons
  User,
  Shield,
  Swords,
  Skull,
  Gem,
  Box,
  Ghost,
  Flame,
  VenetianMask,
  ShoppingBag,
  Users,
  PlusCircle,
  FolderPlus,
  // Fallback icon
  default: HelpCircle,
};

/**
 * The Token component, representing a single entity on the map.
 * It's draggable, customizable, and displays an icon and a tooltip.
 *
 * @param {TokenProps} props The component props.
 * @returns {JSX.Element} The rendered token.
 */
export const Token: FC<TokenProps> = (props) => {
  const { id, x, y, color, icon, size, name, onContextMenu, isPlayerView } = props;

  const iconData = getIconData(icon);

  // Handler for starting a drag operation.
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
     if(isPlayerView) {
      e.preventDefault();
      return;
    }
    // Set data to identify which token is being moved.
    e.dataTransfer.setData("application/reactflow", id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Passes the context menu event up to the parent.
  const handleContextMenu = (e: MouseEvent) => {
    onContextMenu(e, props);
  }

  // Dynamically calculate the token's style based on its properties.
  const tokenStyle: React.CSSProperties = {
    left: `${x * GRID_CELL_SIZE}px`,
    top: `${y * GRID_CELL_SIZE}px`,
    width: `${size * GRID_CELL_SIZE}px`,
    height: `${size * GRID_CELL_SIZE}px`,
    backgroundColor: color,
    color: 'hsl(var(--primary-foreground))',
    boxShadow: `0 0 10px ${color}, 0 0 2px black`,
    border: `2px solid hsla(var(--primary-foreground), 0.5)`,
  };
  
  const isLargeToken = size > 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable={!isPlayerView}
            onDragStart={onDragStart}
            onContextMenu={handleContextMenu}
            className={cn(
              "absolute flex items-center justify-center transition-all duration-100",
              !isPlayerView && "cursor-grab active:cursor-grabbing hover:scale-105 hover:z-10",
              isLargeToken ? 'rounded-lg' : 'rounded-full'
            )}
            style={tokenStyle}
          >
            {iconData ? (
               <Iconify icon={iconData} className="w-[75%] h-[75%]" />
            ) : (
                <HelpCircle className="w-[75%] h-[75%]" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
