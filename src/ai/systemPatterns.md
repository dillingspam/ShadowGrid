# System Patterns

## 1. Coding Standards
*   **Components:** Functional Components with TypeScript interfaces for Props.
*   **Styling:** Tailwind CSS utility classes. Use `cn()` utility for conditional class merging.
*   **State:** Prefer local state (`useState`) for UI interactions (e.g., dialogs) and lifted state for shared data (e.g., tokens).
*   **Icons:** Use `Icon` component wrapper for consistent rendering of Lucide and Iconify icons.

## 2. Core Types & Interfaces

### TokenData
```typescript
interface TokenData {
  id: string;
  x: number;      // Grid coordinate (0-indexed)
  y: number;      // Grid coordinate (0-indexed)
  color: string;  // CSS color string
  icon: string;   // Icon name (e.g., "User", "game-icons:dragon")
  size: number;   // Size in grid cells (1 = 1x1)
  name: string;   // Display name
}
```

### Grid System
*   **Cell Size:** Constant `GRID_CELL_SIZE = 40` (pixels).
*   **Coordinates:** 0-indexed integers `(x, y)`.
*   **Conversion:**
    *   `Screen -> Grid`: `(ScreenPx - Offset) / (CellSize * Scale)`
    *   `Grid -> Screen`: `GridCoord * CellSize`

## 3. Recurring Patterns

### Drag and Drop (Native API)
*   **Source:** `draggable={true}` elements (Tokens, Library Icons).
    *   `onDragStart`: Sets `dataTransfer` data.
        *   `application/reactflow`: Token ID (for moving existing tokens).
        *   `application/json`: New token data (for creating from library).
*   **Target:** `MapGrid` container.
    *   `onDragOver`: `e.preventDefault()` and set `dropEffect`.
    *   `onDrop`: Parse data, calculate grid coordinates, and trigger update callback.

### Fog of War
*   **Data Structure:** 2D Array of booleans (`boolean[][]`). `true` = Hidden, `false` = Revealed.
*   **Interaction:** "Brush" tool toggles state within a radius.
*   **Rendering:** SVG or Canvas overlay masking the map.

### Pan & Zoom
*   **Implementation:** CSS Transform on a container `div`.
*   **State:** `viewPosition` ({x, y}) and `scale` (number).
*   **Math:** Zoom focuses on the mouse cursor position by adjusting `viewPosition` to compensate for the `scale` change.

## 4. AI Integration (Genkit)
*   **Location:** `src/ai/`
*   **Usage:** Define flows in `src/ai/` and call them from server actions or API routes.
*   **Model:** Default to `googleai/gemini-2.5-flash`.
