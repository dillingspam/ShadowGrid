/**
 * @file This file defines the FogOfWar component, which is responsible for rendering
 * the overlay that obscures parts of the map from the players.
 */

'use client';

import { GRID_CELL_SIZE } from './token';
import { useMemo } from 'react';

/**
 * Props for the FogOfWar component.
 */
interface FogOfWarProps {
  /** A 2D boolean array representing the fog state. `true` means fogged, `false` means revealed. */
  fog: boolean[][];
  /** If true, renders the fog as completely opaque for the player view. */
  isPlayerView: boolean;
  /** The opacity percentage (0-100) for the fog in the GM's view. */
  fogOpacity: number;
}

/**
 * A utility function to generate an initial 2D array for the fog state.
 * @param {number} width The width of the grid in cells.
 * @param {number} height The height of the grid in cells.
 * @param {boolean} revealed If true, the entire grid starts revealed; otherwise, it starts fully fogged.
 * @returns {boolean[][]} The generated 2D fog array.
 */
export function generateInitialFog(width: number, height: number, revealed: boolean): boolean[][] {
  return Array.from({ length: height }, () => Array(width).fill(!revealed));
}

/**
 * Renders the fog of war overlay on the map grid.
 * It memoizes the fog cell elements to optimize performance, preventing re-renders unless the fog state changes.
 *
 * @param {FogOfWarProps} props The component props.
 * @returns {JSX.Element} The rendered fog of war overlay.
 */
export function FogOfWar({ fog, isPlayerView, fogOpacity }: FogOfWarProps) {
  // Determine the style of the fog based on the view type (GM vs Player).
  const fogStyle = isPlayerView
    ? { backgroundColor: 'hsl(var(--background))' } // Opaque for players
    : { backgroundColor: `hsla(0, 0%, 13%, ${fogOpacity / 100})` }; // Translucent for GM

  // Memoize the fog cells to prevent re-rendering on every parent component update.
  const fogCells = useMemo(() => {
    return fog.flatMap((row, y) =>
      row.map((isFogged, x) =>
        isFogged ? (
          <div
            key={`${x}-${y}`}
            className="absolute transition-opacity duration-300"
            style={{
              left: x * GRID_CELL_SIZE,
              top: y * GRID_CELL_SIZE,
              width: GRID_CELL_SIZE,
              height: GRID_CELL_SIZE,
              ...fogStyle,
            }}
          />
        ) : null
      )
    );
  }, [fog, fogStyle]); // Only recompute if fog or fogStyle changes.

  return <div className="absolute inset-0 pointer-events-none z-[5]">{fogCells}</div>;
}
