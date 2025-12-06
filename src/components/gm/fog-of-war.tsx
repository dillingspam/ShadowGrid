'use client';

import { GRID_CELL_SIZE } from './token';
import { useMemo } from 'react';

interface FogOfWarProps {
  fog: boolean[][];
  isPlayerView: boolean;
  fogOpacity: number;
}

export function generateInitialFog(width: number, height: number, revealed: boolean): boolean[][] {
  return Array.from({ length: height }, () => Array(width).fill(!revealed));
}

export function FogOfWar({ fog, isPlayerView, fogOpacity }: FogOfWarProps) {
  const fogStyle: React.CSSProperties = isPlayerView
    ? { backgroundColor: 'hsl(var(--background))' }
    : {
        backgroundColor: `hsla(0, 0%, 13%, ${fogOpacity / 100})`,
      };

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
              ...fogStyle
            }}
          />
        ) : null
      )
    );
  }, [fog, fogStyle]);

  return <div className="absolute inset-0 pointer-events-none z-[5]">{fogCells}</div>;
}
