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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  // State to hold the dimensions of the uploaded map image.
  const [mapDimensions, setMapDimensions] = useState<{ width: number, height: number } | null>(null);
  
  const gmControlsPanel = (
    <>
      <IconLibrary />
      <Separator />
      <ScrollArea className="flex-1">
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
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="GM Screen" />
      {/* Main layout grid: map on the left, controls on the right (on medium screens and up) */}
      <div className="grid md:grid-cols-[1fr_350px] flex-1 overflow-hidden">
        <main className="flex items-center justify-center overflow-auto p-4 relative">
          {/* The main map grid where tokens and fog are displayed */}
          <MapGrid 
            fogOpacity={fogOpacity} 
            isFogBrushActive={isFogBrushActive} 
            brushSize={brushSize}
            mapImage={mapImage}
            mapDimensions={mapDimensions}
          />
          {/* Mobile-only button to open the controls sheet */}
          <div className="absolute bottom-4 left-4 z-10 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-background/80">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[350px] flex flex-col p-0">
                  <SheetHeader className="p-4 border-b">
                     <SheetTitle>GM Controls</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    {gmControlsPanel}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </main>
        {/* Sidebar for GM controls and token library */}
        <aside className="hidden md:flex flex-col bg-card border-l border-border">
          {gmControlsPanel}
        </aside>
      </div>
    </div>
  );
}
