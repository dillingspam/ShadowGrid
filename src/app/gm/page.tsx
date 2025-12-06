/**
 * @file This file defines the main page for the Game Master (GM) screen.
 * It brings together the map grid, the icon library, and the GM controls into a single, cohesive layout.
 */

'use client';
import { useState } from 'react';
import { GmControls } from '@/components/gm/gm-controls';
import { IconLibrary } from '@/components/gm/icon-library';
import { MapGrid } from '@/components/gm/map-grid';
import { Header } from '@/components/shared/header';
import { Separator } from '@/components/ui/separator';

/**
 * The main component for the GM screen.
 * It manages the state for fog of war opacity, brush settings, and the currently loaded map image.
 * This state is passed down to the relevant child components.
 *
 * @returns {JSX.Element} The rendered GM screen page.
 */
export default function GMPage() {
  // State for controlling the opacity of the GM's view of the fog of war.
  const [fogOpacity, setFogOpacity] = useState(80);
  // State to toggle the fog of war brush on and off.
  const [isFogBrushActive, setIsFogBrushActive] = useState(false);
  // State for the size of the fog of war brush.
  const [brushSize, setBrushSize] = useState(3);
  // State to hold the data URL of the uploaded map image.
  const [mapImage, setMapImage] = useState<string | null>(null);
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="GM Screen" />
      {/* Main layout grid: map on the left, controls on the right (on medium screens and up) */}
      <div className="grid md:grid-cols-[1fr_350px] flex-1 overflow-hidden">
        <main className="p-4 overflow-auto flex items-center justify-center">
          {/* The main map grid where tokens and fog are displayed */}
          <MapGrid 
            fogOpacity={fogOpacity} 
            isFogBrushActive={isFogBrushActive} 
            brushSize={brushSize}
            mapImage={mapImage}
          />
        </main>
        {/* Sidebar for GM controls and token library */}
        <aside className="hidden md:flex flex-col bg-card border-l border-border">
          <IconLibrary />
          <Separator />
          <div className="flex-1 overflow-y-auto">
            <GmControls 
              fogOpacity={fogOpacity} 
              onFogOpacityChange={setFogOpacity}
              isFogBrushActive={isFogBrushActive}
              onFogBrushToggle={setIsFogBrushActive}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              onMapImageChange={setMapImage}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
