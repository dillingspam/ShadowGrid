'use client';

import { useState, useRef, DragEvent } from 'react';
import type { FC } from 'react';
import { Token, GRID_CELL_SIZE } from './token';
import type { TokenData } from './token';

const initialTokens: TokenData[] = [
  { id: 'player1', x: 3, y: 4, color: 'hsl(var(--accent))', icon: 'player', size: 1, name: 'Cyber-Ronin' },
  { id: 'player2', x: 5, y: 5, color: 'hsl(var(--accent))', icon: 'player', size: 1, name: 'Net-Witch' },
  { id: 'monster1', x: 10, y: 8, color: 'hsl(var(--destructive))', icon: 'monster', size: 2, name: 'Security Drone' },
  { id: 'boss', x: 12, y: 2, color: 'hsl(var(--destructive))', icon: 'monster', size: 3, name: 'Alpha Construct' },
  { id: 'item1', x: 15, y: 12, color: 'hsl(var(--primary))', icon: 'item', size: 1, name: 'Data-Spike' },
];

interface MapGridProps {
  isPlayerView?: boolean;
}

export const MapGrid: FC<MapGridProps> = ({ isPlayerView = false }) => {
  const [tokens, setTokens] = useState(initialTokens);
  const gridRef = useRef<HTMLDivElement>(null);
  // In a real app, this state would be managed globally (e.g., Zustand, Jotai) and synced with a backend.

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


  return (
    <div 
      ref={gridRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative w-full h-full min-h-[500px] bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
      <div className="absolute inset-0 grid-bg" />
      <div className="relative w-full h-full">
        {tokens.map(token => (
          <Token key={token.id} {...token} />
        ))}
      </div>
      {!isPlayerView && (
        <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-xs text-muted-foreground">
          Grid: 40px | Tokens: {tokens.length}
        </div>
      )}
    </div>
  );
};
