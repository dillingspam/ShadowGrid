import type { FC, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { PlayerTokenIcon, MonsterTokenIcon } from '@/components/icons';
import { Shield, HelpCircle, User, Swords, Skull, Gem, Box, Ghost, Flame, VenetianMask, ShoppingBag, Users, PlusCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const GRID_CELL_SIZE = 40; // in px

export interface TokenData {
  id: string;
  x: number;
  y: number;
  color: string;
  icon: string;
  size: number; // 1 = 1x1, etc.
  name: string;
}

interface TokenProps extends TokenData {
  onContextMenu: (e: MouseEvent, token: TokenData) => void;
  isPlayerView: boolean;
}


export const iconMap: { [key: string]: React.ComponentType<{ className?: string, size?: number }> } = {
  Player: PlayerTokenIcon,
  Monster: MonsterTokenIcon,
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
  default: HelpCircle,
};

export const Token: FC<TokenProps> = (props) => {
  const { id, x, y, color, icon, size, name, onContextMenu, isPlayerView } = props;
  const IconComponent = iconMap[icon] || iconMap.default;

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
     if(isPlayerView) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/reactflow", id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleContextMenu = (e: MouseEvent) => {
    onContextMenu(e, props);
  }

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
  
  const iconContainerStyle: React.CSSProperties = {
    width: `${size > 1 ? 60 : 75}%`,
    height: `${size > 1 ? 60 : 75}%`
  }

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
            <div style={iconContainerStyle} className="transition-transform">
              <IconComponent />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
