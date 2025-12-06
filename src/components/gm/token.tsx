import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { PlayerTokenIcon, MonsterTokenIcon } from '@/components/icons';
import { Shield, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GRID_CELL_SIZE = 40; // in px

export interface TokenData {
  id: string;
  x: number;
  y: number;
  color: string;
  icon: 'player' | 'monster' | 'item';
  size: number; // 1 = 1x1, 2 = 2x2, etc.
  name: string;
}

export const Token: FC<TokenData> = ({ x, y, color, icon, size, name }) => {
  const IconComponent = () => {
    switch (icon) {
      case 'player': return <PlayerTokenIcon className="w-full h-full" />;
      case 'monster': return <MonsterTokenIcon className="w-full h-full" />;
      case 'item': return <Shield className="w-3/4 h-3/4" />;
      default: return <HelpCircle className="w-full h-full" />;
    }
  };

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
            className={cn(
              "absolute flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-100 hover:scale-105 hover:z-10",
              isLargeToken ? 'rounded-lg' : 'rounded-full'
            )}
            style={tokenStyle}
          >
            <div className={cn("transition-transform", isLargeToken ? "w-1/2 h-1/2" : "w-3/4 h-3/4")}>
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
