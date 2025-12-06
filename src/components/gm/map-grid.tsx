'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { Token } from './token';
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
  // In a real app, this state would be managed globally (e.g., Zustand, Jotai) and synced with a backend.

  return (
    <div className="relative w-full h-full min-h-[500px] bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
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
