/**
 * @file This file defines the Game Master (GM) screen, which is the main interface
 * for controlling the virtual tabletop. It integrates all the GM-specific components.
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/header';
import { MapGrid } from '@/components/gm/map-grid';
import { GmControls } from '@/components/gm/gm-controls';
import { IconLibrary } from '@/components/gm/icon-library';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

/**
 * The main component for the Game Master screen.
 * It lays out the interface with a map grid, GM controls, and a token library.
 *
 * @returns {JSX.Element} The rendered GM screen.
 */
export default function GmScreen() {
  // State for managing the fog of war controls
  const [fogOpacity, setFogOpacity] = useState(80);
  const [isFogBrushActive, setIsFogBrushActive] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  
  // State for the map background
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapDimensions, setMapDimensions] = useState<{ width: number, height: number } | null>(null);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        
        {/* Main Content: Map Grid */}
        <ResizablePanel defaultSize={75} className="flex-grow flex items-center justify-center p-4">
           <MapGrid 
            fogOpacity={fogOpacity}
            isFogBrushActive={isFogBrushActive}
            brushSize={brushSize}
            mapImage={mapImage}
            mapDimensions={mapDimensions}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Sidebar */}
        <ResizablePanel defaultSize={25} maxSize={40} minSize={20} className="w-[380px] flex flex-col border-l bg-card">
           {/* Top part of sidebar: GM Controls */}
           <ScrollArea className="flex-grow">
             <GmControls 
              fogOpacity={fogOpacity}
              onFogOpacityChange={setFogOpacity}
              isFogBrushActive={isFogBrushActive}
              onFogBrushToggle={setIsFogBrushActive}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              onMapChange={(url, dimensions) => {
                setMapImage(url);
                setMapDimensions(dimensions);
              }}
            />
           </ScrollArea>
           
           {/* Bottom part of sidebar: Token Library */}
           <div className="border-t">
            <IconLibrary />
           </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}
