/**
 * @file This file defines UI controls for the map grid, allowing users to zoom and reset the view.
 */

'use client';

import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Props for the MapControls component.
 */
interface MapControlsProps {
  /** The current zoom level of the map. */
  scale: number;
  /** Callback function to set the zoom level. */
  setScale: (scale: number) => void;
  /** Callback function to reset the view (zoom and pan). */
  resetView: () => void;
}

/**
 * A component that provides zoom in, zoom out, and reset view controls for the map.
 * @param {MapControlsProps} props The component props.
 * @returns {JSX.Element} The rendered map controls.
 */
export function MapControls({ scale, setScale, resetView }: MapControlsProps) {
  const handleZoomIn = () => setScale(scale * 1.2);
  const handleZoomOut = () => setScale(scale / 1.2);

  return (
    <TooltipProvider>
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-background/80 p-1 border border-border shadow-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
                <div 
                    className="text-sm font-mono w-16 text-center text-muted-foreground cursor-pointer"
                    onClick={resetView}
                >
                    {Math.round(scale * 100)}%
                </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center rounded-lg bg-background/80 p-1 border border-border shadow-md">
            <Tooltip>
                <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={resetView} className="h-8 w-8">
                    <Maximize className="h-4 w-4" />
                </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                <p>Reset View</p>
                </TooltipContent>
            </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
