'use client';

import { useState, useRef, DragEvent, MouseEvent, useMemo } from 'react';
import type { FC } from 'react';
import { Token, GRID_CELL_SIZE } from './token';
import type { TokenData } from './token';
import { cn } from '@/lib/utils';
import { FogOfWar, generateInitialFog } from './fog-of-war';

const initialTokens: TokenData[] = [
  { id: 'player1', x: 3, y: 4, color: 'hsl(var(--accent))', icon: 'player', size: 1, name: 'Cyber-Ronin' },
  { id: 'player2', x: 5, y: 5, color: 'hsl(var(--accent))', icon: 'player', size: 1, name: 'Net-Witch' },
  { id: 'monster1', x: 10, y: 8, color: 'hsl(var(--destructive))', icon: 'monster', size: 2, name: 'Security Drone' },
  { id: 'boss', x: 12, y: 2, color: 'hsl(var(--destructive))', icon: 'monster', size: 3, name: 'Alpha Construct' },
  { id: 'item1', x: 15, y: 12, color: 'hsl(var(--primary))', icon: 'item', size: 1, name: 'Data-Spike' },
];

const GRID_WIDTH = 40;
const GRID_HEIGHT = 25;

interface MapGridProps {
  isPlayerView?: boolean;
}

export const MapGrid: FC<MapGridProps> = ({ isPlayerView = false }) => {
  const [tokens, setTokens] = useState(initialTokens);
  const [fog, setFog] = useState(() => generateInitialFog(GRID_WIDTH, GRID_HEIGHT, !isPlayerView));
  const [fogOpacity, setFogOpacity] = useState(80);
  const gridRef = useRef<HTMLDivElement>(null);
  const isRevealingFog = useRef(false);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (isPlayerView) return;
    if (!gridRef.current) return;
    
    const tokenId = e.dataTransfer.getData("application/reactflow");
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return;

    const gridBounds = gridRef.current.getBoundingClientRect();
    const x = e.clientX - gridBounds.left;
    const y = e.clientY - gridBounds.top;

    const newX = Math.floor(x / GRID_CELL_SIZE);
    const newY = Math.floor(y / GRID_CELL_SIZE);

    setTokens((prevTokens) =>
      prevTokens.map((t) =>
        t.id === tokenId ? { ...t, x: newX, y: newY } : t
      )
    );
  };
  
  const handleFogInteraction = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || !gridRef.current) return;
    
    const gridBounds = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - gridBounds.left) / GRID_CELL_SIZE);
    const y = Math.floor((e.clientY - gridBounds.top) / GRID_CELL_SIZE);
    
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return;

    setFog(prevFog => {
      const newFog = prevFog.map(row => [...row]);
      if (newFog[y][x]) {
        newFog[y][x] = false;
        return newFog;
      }
      return prevFog;
    });
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || e.button !== 0) return;
    isRevealingFog.current = true;
    handleFogInteraction(e);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isRevealingFog.current) return;
    handleFogInteraction(e);
  };
  
  const onMouseUp = () => {
    isRevealingFog.current = false;
  };

  const onMouseLeave = () => {
    isRevealingFog.current = false;
  };

  return (
    <div 
      ref={gridRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative w-full h-full min-h-[500px] bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/10",
        !isPlayerView && "cursor-crosshair"
      )}
      style={{
        width: `${GRID_WIDTH * GRID_CELL_SIZE}px`,
        height: `${GRID_HEIGHT * GRID_CELL_SIZE}px`,
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <div className="absolute inset-0 grid-bg" />
      <div className="relative w-full h-full">
        <FogOfWar fog={fog} isPlayerView={isPlayerView} fogOpacity={fogOpacity} />
        {tokens.map(token => (
          <Token key={token.id} {...token} />
        ))}
      </div>
      {!isPlayerView && (
        <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-xs text-muted-foreground">
          Grid: {GRID_WIDTH}x{GRID_HEIGHT} | Tokens: {tokens.length}
        </div>
      )}
    </div>
  );
};
