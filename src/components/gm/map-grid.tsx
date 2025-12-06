'use client';

import { useState, useRef, DragEvent, MouseEvent, FC } from 'react';
import { Token, GRID_CELL_SIZE } from './token';
import type { TokenData } from './token';
import { cn } from '@/lib/utils';
import { FogOfWar, generateInitialFog } from './fog-of-war';
import Image from 'next/image';

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
  fogOpacity?: number;
  isFogBrushActive?: boolean;
  brushSize?: number;
  mapImage?: string | null;
}

export const MapGrid: FC<MapGridProps> = ({ 
  isPlayerView = false, 
  fogOpacity = 80, 
  isFogBrushActive = false,
  brushSize = 3,
  mapImage = null
}) => {
  const [tokens, setTokens] = useState(initialTokens);
  const [fog, setFog] = useState(() => generateInitialFog(GRID_WIDTH, GRID_HEIGHT, isPlayerView));
  const gridRef = useRef<HTMLDivElement>(null);
  const fogInteractionState = useRef<'revealing' | 'hiding' | null>(null);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
     if (e.dataTransfer.types.includes('application/json')) {
      e.dataTransfer.dropEffect = 'copy';
    } else {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (isPlayerView || !gridRef.current) return;

    const gridBounds = gridRef.current.getBoundingClientRect();
    const x = e.clientX - gridBounds.left;
    const y = e.clientY - gridBounds.top;
    const newX = Math.floor(x / GRID_CELL_SIZE);
    const newY = Math.floor(y / GRID_CELL_SIZE);

    // Check for new token drop
    const newTokeDataString = e.dataTransfer.getData("application/json");
    if (newTokeDataString) {
      const { tokenType, icon, name } = JSON.parse(newTokeDataString);
      const color = tokenType === 'player' ? 'hsl(var(--accent))' : tokenType === 'monster' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
      
      const newToken: TokenData = {
        id: `token-${Date.now()}-${Math.random()}`,
        x: newX,
        y: newY,
        color,
        icon,
        size: 1,
        name: `${name} ${tokens.filter(t => t.name.startsWith(name)).length + 1}`
      };

      setTokens(prev => [...prev, newToken]);
      return;
    }
    
    // Handle existing token move
    const tokenId = e.dataTransfer.getData("application/reactflow");
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return;

    setTokens((prevTokens) =>
      prevTokens.map((t) =>
        t.id === tokenId ? { ...t, x: newX, y: newY } : t
      )
    );
  };
  
  const handleFogInteraction = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || !gridRef.current || !fogInteractionState.current) return;
    
    const gridBounds = gridRef.current.getBoundingClientRect();
    const centerX = Math.floor((e.clientX - gridBounds.left) / GRID_CELL_SIZE);
    const centerY = Math.floor((e.clientY - gridBounds.top) / GRID_CELL_SIZE);
    
    const shouldReveal = fogInteractionState.current === 'revealing';
    const radius = brushSize - 1;

    setFog(prevFog => {
      let hasChanged = false;
      const newFog = prevFog.map((row, y) => 
        row.map((isFogged, x) => {
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          if (distance <= radius) {
            const newFogState = !shouldReveal;
            if (isFogged !== newFogState) {
              hasChanged = true;
              return newFogState;
            }
          }
          return isFogged;
        })
      );
      
      return hasChanged ? newFog : prevFog;
    });
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || !isFogBrushActive) return;
    if (e.button === 0) { // Left-click
      fogInteractionState.current = 'revealing';
    } else if (e.button === 2) { // Right-click
      e.preventDefault(); // Prevent context menu
      fogInteractionState.current = 'hiding';
    }
    handleFogInteraction(e);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!fogInteractionState.current || !isFogBrushActive) return;
    handleFogInteraction(e);
  };
  
  const onMouseUp = () => {
    fogInteractionState.current = null;
  };

  const onMouseLeave = () => {
    fogInteractionState.current = null;
  };
  
  const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPlayerView && isFogBrushActive) {
      e.preventDefault();
    }
  }

  return (
    <div 
      ref={gridRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
      className={cn(
        "relative w-full h-full min-h-[500px] bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/10",
        !isPlayerView && isFogBrushActive && "cursor-crosshair"
      )}
      style={{
        width: `${GRID_WIDTH * GRID_CELL_SIZE}px`,
        height: `${GRID_HEIGHT * GRID_CELL_SIZE}px`,
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid-bg" />
        {mapImage && (
          <Image 
            src={mapImage}
            alt="Game Map"
            fill
            style={{objectFit: "cover"}}
            className="absolute inset-0 opacity-75"
          />
        )}
      </div>

      <div className="relative w-full h-full z-[2]">
        <FogOfWar fog={fog} isPlayerView={isPlayerView} fogOpacity={fogOpacity} />
        {tokens.map(token => (
          <Token key={token.id} {...token} />
        ))}
      </div>

      {!isPlayerView && (
        <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-xs text-muted-foreground z-10">
          Grid: {GRID_WIDTH}x{GRID_HEIGHT} | Tokens: {tokens.length}
        </div>
      )}
    </div>
  );
};
