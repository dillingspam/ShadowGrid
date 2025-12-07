/**
 * @file This file defines the main page for the Player View.
 * It displays the map grid from a player's perspective, respecting fog of war.
 */
'use client';
import { useState } from 'react';
import { MapGrid, initialTokens } from '@/components/gm/map-grid';
import type { TokenData } from '@/components/gm/token';
import { Header } from '@/components/shared/header';

/**
 * The main component for the Player View page.
 * It renders the map grid in a view-only mode for players.
 *
 * @returns {JSX.Element} The rendered Player View page.
 */
export default function PlayerPage() {
  // NOTE: In a real app, this state would be synced from the GM via Firebase.
  // For now, we are just using local state for demonstration.
  const [tokens, setTokens] = useState<TokenData[]>(initialTokens);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="Player View" />
      <main className="flex-1 flex items-center justify-center p-4">
        {/* 
          The MapGrid component is reused here, but with `isPlayerView` set to true.
          This tells the component to hide certain elements and behaviors, like token editing
          and fog of war controls, and to render the fog differently.
        */}
        <MapGrid 
          isPlayerView={true} 
          tokens={tokens}
          onTokensChange={setTokens}
        />
      </main>
    </div>
  );
}
