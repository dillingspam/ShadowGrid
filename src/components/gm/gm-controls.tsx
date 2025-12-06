/**
 * @file This file defines the GmControls component, which provides the GM with
 * tools to manage the map, fog of war, and other game aspects from the sidebar.
 */

'use client';
import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dices, ShieldQuestion, Brush, Map, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the GmControls component.
 */
interface GmControlsProps {
  /** The current opacity of the fog of war (0-100). */
  fogOpacity: number;
  /** Callback to update the fog opacity. */
  onFogOpacityChange: (value: number) => void;
  /** Whether the fog brush tool is currently active. */
  isFogBrushActive: boolean;
  /** Callback to toggle the fog brush tool. */
  onFogBrushToggle: (active: boolean) => void;
  /** The current size of the fog brush. */
  brushSize: number;
  /** Callback to update the brush size. */
  onBrushSizeChange: (value: number) => void;
  /** Callback to update the map image with a new data URL. */
  onMapImageChange: (url: string | null) => void;
}

/**
 * A component that houses various controls for the Game Master.
 * It includes tabs for managing the map environment, NPCs, and dice rolls.
 *
 * @param {GmControlsProps} props The component props.
 * @returns {JSX.Element} The rendered GM controls panel.
 */
export function GmControls({ 
  fogOpacity, 
  onFogOpacityChange,
  isFogBrushActive,
  onFogBrushToggle,
  brushSize,
  onBrushSizeChange,
  onMapImageChange
}: GmControlsProps) {
  // Ref to the hidden file input element for importing map images.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handles the file selection from the input.
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Once the file is read, its data URL is passed up to the parent.
        onMapImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Programmatically clicks the hidden file input.
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Clears the current map image and resets the file input.
  const handleClearMap = () => {
    onMapImageChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  return (
    <div className="p-4">
      <Tabs defaultValue="environment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="environment">Map</TabsTrigger>
          <TabsTrigger value="npcs">NPCs</TabsTrigger>
          <TabsTrigger value="rolls">Rolls</TabsTrigger>
        </TabsList>
        
        {/* Environment Tab Content */}
        <TabsContent value="environment" className="mt-6 space-y-6">
           <Button 
            variant={isFogBrushActive ? "secondary" : "outline"}
            className={cn("w-full transition-all", isFogBrushActive && "shadow-inner shadow-accent/50 border-accent text-accent")}
            onClick={() => onFogBrushToggle(!isFogBrushActive)}
          >
            <Brush className="mr-2 h-4 w-4" />
            {isFogBrushActive ? 'Fog Brush Active' : 'Activate Fog Brush'}
          </Button>
          <div className="space-y-3">
            <Label htmlFor="brush-size">Brush Size</Label>
            <Slider 
              id="brush-size" 
              value={[brushSize]}
              onValueChange={(value) => onBrushSizeChange(value[0])}
              max={10} 
              min={1}
              step={1} 
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="fog-opacity">Fog of War Opacity</Label>
            <Slider 
              id="fog-opacity" 
              value={[fogOpacity]}
              onValueChange={(value) => onFogOpacityChange(value[0])}
              max={100} 
              step={1} 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="grid-overlay" className="flex-grow">Show Grid Overlay</Label>
            <Switch id="grid-overlay" defaultChecked />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="player-vision" className="flex-grow">Player Vision Lines</Label>
            <Switch id="player-vision" />
          </div>
          <div className='space-y-2'>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button variant="outline" className="w-full" onClick={handleImportClick}>
              <Map className="mr-2 h-4 w-4" />
              Import Map
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleClearMap}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Map
            </Button>
          </div>
        </TabsContent>
        
        {/* NPCs Tab Content (Placeholder) */}
        <TabsContent value="npcs" className="mt-6 text-center text-muted-foreground">
          <p className="text-sm">NPC management coming soon.</p>
        </TabsContent>

        {/* Rolls Tab Content (Placeholder) */}
        <TabsContent value="rolls" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">Make a secret roll.</p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="justify-start">
              <Dices className="mr-2 h-4 w-4 text-accent" />
              Roll d20
            </Button>
            <Button variant="secondary" className="justify-start">
              <Dices className="mr-2 h-4 w-4 text-accent" />
              Roll d100
            </Button>
            <Button variant="secondary" className="justify-start">
              <ShieldQuestion className="mr-2 h-4 w-4 text-accent" />
              Custom Roll
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
