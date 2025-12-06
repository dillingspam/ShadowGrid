'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dices, ShieldQuestion, Brush } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GmControlsProps {
  fogOpacity: number;
  onFogOpacityChange: (value: number) => void;
  isFogBrushActive: boolean;
  onFogBrushToggle: (active: boolean) => void;
  brushSize: number;
  onBrushSizeChange: (value: number) => void;
}

export function GmControls({ 
  fogOpacity, 
  onFogOpacityChange,
  isFogBrushActive,
  onFogBrushToggle,
  brushSize,
  onBrushSizeChange
}: GmControlsProps) {
  return (
    <div className="p-4">
      <Tabs defaultValue="environment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="environment">Map</TabsTrigger>
          <TabsTrigger value="npcs">NPCs</TabsTrigger>
          <TabsTrigger value="rolls">Rolls</TabsTrigger>
        </TabsList>
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
        </TabsContent>
        <TabsContent value="npcs" className="mt-6 text-center text-muted-foreground">
          <p className="text-sm">NPC management coming soon.</p>
        </TabsContent>
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
