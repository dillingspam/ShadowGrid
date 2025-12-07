/**
 * @file This file defines the core MapGrid component, which serves as the interactive
 * virtual tabletop. It manages the state and rendering of tokens, the map background,
 * and the fog of war.
 */

'use client';

import { useState, useRef, DragEvent, MouseEvent, FC, useMemo, WheelEvent, useEffect } from 'react';
import { Token, GRID_CELL_SIZE } from './token';
import type { TokenData } from './token';
import { cn } from '@/lib/utils';
import { FogOfWar, generateInitialFog } from './fog-of-war';
import Image from 'next/image';
import { TokenEditDialog } from './token-edit-dialog';
import { MapControls } from './map-controls';

// Initial set of tokens for demonstration purposes.
export const initialTokens: TokenData[] = [
  { id: 'player1', x: 3, y: 4, color: 'hsl(var(--accent))', icon: 'User', size: 1, name: 'Cyber-Ronin' },
  { id: 'player2', x: 5, y: 5, color: 'hsl(var(--accent))', icon: 'Shield', size: 1, name: 'Net-Witch' },
  { id: 'monster1', x: 10, y: 8, color: 'hsl(var(--destructive))', icon: 'Skull', size: 2, name: 'Security Drone' },
  { id: 'boss', x: 12, y: 2, color: 'hsl(var(--destructive))', icon: 'Ghost', size: 3, name: 'Alpha Construct' },
  { id: 'item1', x: 15, y: 12, color: 'hsl(var(--primary))', icon: 'Gem', size: 1, name: 'Data-Spike' },
];

// Constants for the default grid dimensions if no map is loaded.
const DEFAULT_GRID_WIDTH = 48;
const DEFAULT_GRID_HEIGHT = 27;

// Constants for zoom limits.
const MIN_SCALE = 0.2;
const MAX_SCALE = 3;

/**
 * Props for the MapGrid component.
 */
interface MapGridProps {
  /** If true, enables player view mode (e.g., hides controls, renders fog differently). */
  isPlayerView?: boolean;
  /** Opacity of the fog for the GM's view. */
  fogOpacity?: number;
  /** If true, allows the GM to paint/unpaint fog. */
  isFogBrushActive?: boolean;
  /** The size of the fog brush. */
  brushSize?: number;
  /** The data URL of the background map image. */
  mapImage?: string | null;
  /** The dimensions of the background map image. */
  mapDimensions?: { width: number; height: number } | null;
  /** The current state of the tokens on the map */
  tokens: TokenData[];
  /** Callback to update the tokens state */
  onTokensChange: (tokens: TokenData[]) => void;
  /** If true, the grid overlay is visible. */
  isGridVisible?: boolean;
}

/**
 * The main interactive map grid component.
 *
 * @param {MapGridProps} props The component props.
 * @returns {JSX.Element} The rendered map grid.
 */
export const MapGrid: FC<MapGridProps> = ({ 
  isPlayerView = false, 
  fogOpacity = 80, 
  isFogBrushActive = false,
  brushSize = 3,
  mapImage = null,
  mapDimensions = null,
  tokens,
  onTokensChange,
  isGridVisible = true,
}) => {
  // Calculate grid dimensions based on map image or use defaults.
  const gridWidth = mapDimensions ? Math.ceil(mapDimensions.width / GRID_CELL_SIZE) : DEFAULT_GRID_WIDTH;
  const gridHeight = mapDimensions ? Math.ceil(mapDimensions.height / GRID_CELL_SIZE) : DEFAULT_GRID_HEIGHT;
  const containerWidth = gridWidth * GRID_CELL_SIZE;
  const containerHeight = gridHeight * GRID_CELL_SIZE;
  
  const [fog, setFog] = useState(() => generateInitialFog(gridWidth, gridHeight, isPlayerView));
  const [editingToken, setEditingToken] = useState<TokenData | null>(null);
  
  // State for panning and zooming
  const [scale, setScale] = useState(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const gridRef = useRef<HTMLDivElement>(null);
  const transformContainerRef = useRef<HTMLDivElement>(null);
  const fogInteractionState = useRef<'revealing' | 'hiding' | null>(null);

  // Effect to re-initialize fog when the grid dimensions change.
  useEffect(() => {
    setFog(generateInitialFog(gridWidth, gridHeight, isPlayerView));
  }, [gridWidth, gridHeight, isPlayerView]);

  // Memoize visible tokens to prevent re-calculation unless dependencies change.
  // In player view, it filters out tokens that are under the fog.
  const visibleTokens = useMemo(() => {
    if (!isPlayerView) {
      return tokens;
    }
    return tokens.filter(token => {
      // A token is visible if its grid cell (top-left corner) is not fogged.
      const isVisible = fog[token.y]?.[token.x] === false;
      return isVisible;
    });
  }, [tokens, fog, isPlayerView]);


  /**
   * Converts screen coordinates (e.g., from a mouse event) to grid coordinates,
   * taking into account the current pan and zoom state.
   * @param {number} screenX The x-coordinate on the screen.
   * @param {number} screenY The y-coordinate on the screen.
   * @returns {{x: number, y: number}} The corresponding grid coordinates.
   */
  const screenToGridCoords = (screenX: number, screenY: number) => {
    if (!transformContainerRef.current) return { x: 0, y: 0 };
    const gridBounds = transformContainerRef.current.getBoundingClientRect();
    const gridX = (screenX - gridBounds.left);
    const gridY = (screenY - gridBounds.top);
    return { x: gridX, y: gridY };
  };
  
  // Handles when an item is dragged over the grid.
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    // Set drop effect based on the type of data being dragged.
     if (e.dataTransfer.types.includes('application/json')) {
      e.dataTransfer.dropEffect = 'copy'; // New token from library
    } else {
      e.dataTransfer.dropEffect = 'move'; // Existing token on grid
    }
  };

  // Handles when an item is dropped onto the grid.
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (isPlayerView || !gridRef.current) return;

    const tokenId = e.dataTransfer.getData("application/reactflow"); // For existing tokens
    
    // Calculate drop position relative to the grid, accounting for pan/zoom.
    const { x: gridX, y: gridY } = screenToGridCoords(e.clientX, e.clientY);
    
    let dropX = gridX;
    let dropY = gridY;

    const token = tokens.find((t) => t.id === tokenId);
    // If moving an existing token, offset the drop point by half the token's size
    // to center the token on the cursor.
    if (token) {
      const offset = (token.size * GRID_CELL_SIZE * scale) / 2;
      dropX -= offset;
      dropY -= offset;
    }

    let newX = Math.floor(dropX / (GRID_CELL_SIZE * scale));
    let newY = Math.floor(dropY / (GRID_CELL_SIZE * scale));

    // Clamp coordinates to be within the grid bounds.
    newX = Math.max(0, Math.min(newX, gridWidth - (token?.size || 1)));
    newY = Math.max(0, Math.min(newY, gridHeight - (token?.size || 1)));
    
    // Handle drop for new tokens from the library.
    const newTokeDataString = e.dataTransfer.getData("application/json");
    if (newTokeDataString) {
      const { tokenType, icon, name } = JSON.parse(newTokeDataString);
      const color = tokenType === 'player' ? 'hsl(var(--accent))' : tokenType === 'monster' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
      
      const newToken: TokenData = {
        id: `token-${Date.now()}-${Math.random()}`,
        x: newX,
        y: newY,
        color,
        icon,
        size: 1,
        name: `${name} ${tokens.filter(t => t.name.startsWith(name)).length + 1}`
      };

      onTokensChange([...tokens, newToken]);
      return;
    }
    
    // If it was an existing token, update its position.
    if (!token) return;
    onTokensChange(
      tokens.map((t) =>
        t.id === tokenId ? { ...t, x: newX, y: newY } : t
      )
    );
  };
  
  // Handles mouse movement over the grid to paint/unpaint fog.
  const handleFogInteraction = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || !gridRef.current || !fogInteractionState.current) return;
    
    const { x: gridX, y: gridY } = screenToGridCoords(e.clientX, e.clientY);

    const centerX = Math.floor(gridX / (GRID_CELL_SIZE * scale));
    const centerY = Math.floor(gridY / (GRID_CELL_SIZE * scale));
    
    const shouldReveal = fogInteractionState.current === 'revealing';
    const radius = brushSize! - 1;

    setFog(prevFog => {
      let hasChanged = false;
      const newFog = prevFog.map((row, y) => 
        row.map((isFogged, x) => {
          // Check if the cell is within the brush radius.
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          if (distance <= radius) {
            const newFogState = !shouldReveal;
            if (isFogged !== newFogState) {
              hasChanged = true;
              return newFogState;
            }
          }
          return isFogged;
        })
      );
      // Only update state if something actually changed to prevent unnecessary re-renders.
      return hasChanged ? newFog : prevFog;
    });
  };

  // Callback to update a token's data from the edit dialog.
  const handleTokenUpdate = (updatedToken: TokenData) => {
    onTokensChange(tokens.map(t => t.id === updatedToken.id ? updatedToken : t));
  };
  
  // Callback to delete a token.
  const handleTokenDelete = (tokenId: string) => {
    onTokensChange(tokens.filter(t => t.id !== tokenId));
  };
  
  // Opens the token edit dialog on right-click.
  const handleTokenContextMenu = (e: MouseEvent, token: TokenData) => {
    if (isPlayerView) return;
    e.preventDefault();
    setEditingToken(token);
  };

  // Sets the interaction mode (panning or fog) on mouse down.
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView) return;
    
    // Pan with middle mouse button
    if (e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewPosition.x, y: e.clientY - viewPosition.y });
        (e.target as HTMLElement).style.cursor = 'grabbing';
        return;
    }
    
    if (isFogBrushActive) {
      if (e.button === 0) { // Left click
        fogInteractionState.current = 'revealing';
      } else if (e.button === 2) { // Right click
        e.preventDefault();
        fogInteractionState.current = 'hiding';
      }
      handleFogInteraction(e);
    }
  };

  // Continues the interaction on mouse move.
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
     if (isPanning) {
        const newX = e.clientX - panStart.x;
        const newY = e.clientY - panStart.y;
        setViewPosition({ x: newX, y: newY });
        return;
     }

    if (!fogInteractionState.current || !isFogBrushActive) return;
    handleFogInteraction(e);
  };
  
  // Resets the interaction mode on mouse up.
  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
        setIsPanning(false);
        (e.target as HTMLElement).style.cursor = isFogBrushActive ? 'crosshair' : 'default';
    }
    fogInteractionState.current = null;
  };
  
  // Handles zooming with the mouse wheel.
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    e.preventDefault();
    
    const rect = gridRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale - e.deltaY * 0.001));

    // The point in the content that was under the mouse
    const mousePointX = (mouseX - viewPosition.x) / scale;
    const mousePointY = (mouseY - viewPosition.y) / scale;

    // The new view position is calculated so the mouse point stays at the same screen position
    const newViewPosX = mouseX - mousePointX * newScale;
    const newViewPosY = mouseY - mousePointY * newScale;

    setViewPosition({ x: newViewPosX, y: newViewPosY });
    setScale(newScale);
  };
  
  const resetView = () => {
    setScale(1);
    setViewPosition({ x: 0, y: 0 });
  }

  // Also reset on mouse leave to prevent getting "stuck" in a mode.
  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
        setIsPanning(false);
        (e.target as HTMLElement).style.cursor = isFogBrushActive ? 'crosshair' : 'default';
    }
    fogInteractionState.current = null;
  };
  
  // Prevents the browser's context menu when using the fog brush or panning.
  const onGridContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    if (isFogBrushActive || e.button === 1) {
      e.preventDefault();
    }
  }

  return (
    <>
      <div 
        ref={gridRef}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onContextMenu={onGridContextMenu}
        onWheel={handleWheel}
        className={cn(
          "relative bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/10",
          !isPlayerView && isFogBrushActive && "cursor-crosshair",
           !isPlayerView && !isPanning && !isFogBrushActive && "cursor-grab"
        )}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Layer 1: Static Grid Lines. This is always visible and doesn't transform. */}
        {isGridVisible && (
            <div 
                className="absolute inset-0 grid-bg z-[1] pointer-events-none"
                style={{
                    backgroundSize: `${GRID_CELL_SIZE * scale}px ${GRID_CELL_SIZE * scale}px`,
                    backgroundPosition: `${viewPosition.x}px ${viewPosition.y}px`,
                }}
            />
        )}

        <div 
            ref={transformContainerRef}
            className="absolute"
            style={{
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
                transform: `translate(${viewPosition.x}px, ${viewPosition.y}px) scale(${scale})`,
                transformOrigin: '0 0',
            }}
        >
            {/* Layer 2: Map Image */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
            {mapImage && (
                <Image 
                src={mapImage}
                alt="Game Map"
                fill
                style={{objectFit: "cover"}}
                />
            )}
            </div>

            {/* Layer 3: Tokens */}
            <div className="relative w-full h-full z-[3]">
            {visibleTokens.map(token => (
                <Token key={token.id} onContextMenu={handleTokenContextMenu} isPlayerView={isPlayerView} {...token} />
            ))}
            </div>
            
            {/* Layer 4: Fog of War */}
            <FogOfWar fog={fog} isPlayerView={isPlayerView} fogOpacity={fogOpacity!} />
        </div>


        {/* GM-only overlay with grid info */}
        {!isPlayerView && (
            <>
                <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-xs text-muted-foreground z-10">
                    Grid: {gridWidth}x{gridHeight} | Tokens: {tokens.length}
                </div>
                <MapControls scale={scale} setScale={setScale} resetView={resetView} />
            </>
        )}
      </div>

      {/* The token edit dialog, only rendered for GMs */}
      {!isPlayerView && (
         <TokenEditDialog 
            token={editingToken}
            onUpdate={handleTokenUpdate}
            onDelete={handleTokenDelete}
            onClose={() => setEditingToken(null)}
         />
      )}
    </>
  );
};
