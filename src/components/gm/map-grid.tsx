/**
 * @file This file defines the core MapGrid component, which serves as the interactive
 * virtual tabletop. It manages the state and rendering of tokens, the map background,
 * and the fog of war.
 */

'use client';

import { useState, useRef, DragEvent, MouseEvent, FC, useMemo } from 'react';
import { Token, GRID_CELL_SIZE } from './token';
import type { TokenData } from './token';
import { cn } from '@/lib/utils';
import { FogOfWar, generateInitialFog } from './fog-of-war';
import Image from 'next/image';
import { TokenEditDialog } from './token-edit-dialog';

// Initial set of tokens for demonstration purposes.
const initialTokens: TokenData[] = [
  { id: 'player1', x: 3, y: 4, color: 'hsl(var(--accent))', icon: 'User', size: 1, name: 'Cyber-Ronin' },
  { id: 'player2', x: 5, y: 5, color: 'hsl(var(--accent))', icon: 'Shield', size: 1, name: 'Net-Witch' },
  { id: 'monster1', x: 10, y: 8, color: 'hsl(var(--destructive))', icon: 'Skull', size: 2, name: 'Security Drone' },
  { id: 'boss', x: 12, y: 2, color: 'hsl(var(--destructive))', icon: 'Ghost', size: 3, name: 'Alpha Construct' },
  { id: 'item1', x: 15, y: 12, color: 'hsl(var(--primary))', icon: 'Gem', size: 1, name: 'Data-Spike' },
];

// Constants for the grid dimensions.
const GRID_WIDTH = 40;
const GRID_HEIGHT = 25;

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
  mapImage = null
}) => {
  const [tokens, setTokens] = useState(initialTokens);
  const [fog, setFog] = useState(() => generateInitialFog(GRID_WIDTH, GRID_HEIGHT, isPlayerView));
  const [editingToken, setEditingToken] = useState<TokenData | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fogInteractionState = useRef<'revealing' | 'hiding' | null>(null);

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

    const gridBounds = gridRef.current.getBoundingClientRect();
    
    const tokenId = e.dataTransfer.getData("application/reactflow"); // For existing tokens
    const token = tokens.find((t) => t.id === tokenId);
    
    // Calculate drop position relative to the grid.
    let dropX = e.clientX - gridBounds.left;
    let dropY = e.clientY - gridBounds.top;

    // If moving an existing token, offset the drop point by half the token's size
    // to center the token on the cursor.
    if (token) {
      const offset = (token.size * GRID_CELL_SIZE) / 2;
      dropX -= offset;
      dropY -= offset;
    }

    const newX = Math.floor(dropX / GRID_CELL_SIZE);
    const newY = Math.floor(dropY / GRID_CELL_SIZE);
    
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

      setTokens(prev => [...prev, newToken]);
      return;
    }
    
    // If it was an existing token, update its position.
    if (!token) return;
    setTokens((prevTokens) =>
      prevTokens.map((t) =>
        t.id === tokenId ? { ...t, x: newX, y: newY } : t
      )
    );
  };
  
  // Handles mouse movement over the grid to paint/unpaint fog.
  const handleFogInteraction = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || !gridRef.current || !fogInteractionState.current) return;
    
    const gridBounds = gridRef.current.getBoundingClientRect();
    const centerX = Math.floor((e.clientX - gridBounds.left) / GRID_CELL_SIZE);
    const centerY = Math.floor((e.clientY - gridBounds.top) / GRID_CELL_SIZE);
    
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
    setTokens(tokens.map(t => t.id === updatedToken.id ? updatedToken : t));
  };
  
  // Callback to delete a token.
  const handleTokenDelete = (tokenId: string) => {
    setTokens(tokens.filter(t => t.id !== tokenId));
  };
  
  // Opens the token edit dialog on right-click.
  const handleTokenContextMenu = (e: MouseEvent, token: TokenData) => {
    if (isPlayerView) return;
    e.preventDefault();
    setEditingToken(token);
  };

  // Sets the fog interaction mode on mouse down.
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isPlayerView || !isFogBrushActive) return;
    if (e.button === 0) { // Left click
      fogInteractionState.current = 'revealing';
    } else if (e.button === 2) { // Right click
      e.preventDefault();
      fogInteractionState.current = 'hiding';
    }
    handleFogInteraction(e);
  };

  // Continues the fog interaction on mouse move.
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!fogInteractionState.current || !isFogBrushActive) return;
    handleFogInteraction(e);
  };
  
  // Resets the fog interaction mode on mouse up.
  const onMouseUp = () => {
    fogInteractionState.current = null;
  };

  // Also reset on mouse leave to prevent getting "stuck" in a mode.
  const onMouseLeave = () => {
    fogInteractionState.current = null;
  };
  
  // Prevents the browser's context menu when using the fog brush.
  const onGridContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    if (isFogBrushActive) {
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
        className={cn(
          "relative bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-primary/10",
          !isPlayerView && isFogBrushActive && "cursor-crosshair"
        )}
        style={{
          width: `${GRID_WIDTH * GRID_CELL_SIZE}px`,
          height: `${GRID_HEIGHT * GRID_CELL_SIZE}px`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {/* Layer 1: Map Image */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {mapImage && (
            <Image 
              src={mapImage}
              alt="Game Map"
              fill
              style={{objectFit: "cover"}}
            />
          )}
        </div>
        {/* Layer 2: Grid Lines */}
        <div className="absolute inset-0 grid-bg z-[2] pointer-events-none" />
        
        {/* Layer 3: Tokens */}
        <div className="relative w-full h-full z-[3]">
          {visibleTokens.map(token => (
            <Token key={token.id} onContextMenu={handleTokenContextMenu} isPlayerView={isPlayerView} {...token} />
          ))}
        </div>
        
        {/* Layer 4: Fog of War */}
        <FogOfWar fog={fog} isPlayerView={isPlayerView} fogOpacity={fogOpacity!} />

        {/* GM-only overlay with grid info */}
        {!isPlayerView && (
          <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-xs text-muted-foreground z-10">
            Grid: {GRID_WIDTH}x{GRID_HEIGHT} | Tokens: {tokens.length}
          </div>
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
