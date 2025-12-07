/**
 * @file This file defines the main page for the Player View.
 * It displays the map grid from a player's perspective, respecting fog of war.
 */
'use client';
import { MapGrid } from '@/components/gm/map-grid';
import { Header } from '@/components/shared/header';

/**
 * The main component for the Player View page.
 * It renders the map grid in a view-only mode for players.
 *
 * @returns {JSX.Element} The rendered Player View page.
 */
export default function PlayerPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="Player View" />
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* 
          The MapGrid component is reused here, but with `isPlayerView` set to true.
          This tells the component to hide certain elements and behaviors, like token editing
          and fog of war controls, and to render the fog differently.
        */}
        <MapGrid isPlayerView={true} />
      </main>
    </div>
  );
}
