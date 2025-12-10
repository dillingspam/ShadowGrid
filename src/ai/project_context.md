# Project Context: ShadowGrid

## 1. Project Overview
ShadowGrid is a web-based Virtual Tabletop (VTT) designed for Tabletop Role-Playing Games (TTRPGs). It provides a shared, interactive interface for Game Masters (GMs) and players to visualize combat, manage tokens, and explore maps with Fog of War mechanics.

The project is currently a local-state prototype with plans to integrate Firebase for real-time synchronization.

## 2. Tech Stack (Strict)
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN/UI (Radix Primitives)
*   **Icons:** Lucide React & Iconify (@iconify-json/game-icons)
*   **AI:** Genkit (Google AI Plugin, Gemini 1.5 Flash)
*   **State Management:** React Hooks (Local State) -> *Planned: Firebase Firestore*
*   **Deployment:** Firebase App Hosting (implied by `apphosting.yaml`)

## 3. Core Architecture
### Routing (`src/app`)
*   `/gm`: The Game Master's command center. Contains the map, token library, and controls.
*   `/player`: The Player's view. Read-only (mostly) view of the map, respecting Fog of War.

### Key Components
*   **MapGrid (`src/components/gm/map-grid.tsx`):** The core interactive canvas. Handles:
    *   Rendering the map image.
    *   Grid overlay.
    *   Token placement and movement (Drag & Drop).
    *   Fog of War rendering and interaction (Brush tool).
    *   Pan and Zoom (CSS Transforms).
*   **Token (`src/components/gm/token.tsx`):** Represents entities on the grid.
*   **GmScreen (`src/app/gm/page.tsx`):** The top-level container for the GM view. Manages the "Source of Truth" state for the session.

### Data Flow
1.  **State Ownership:** `GmScreen` holds the master state (`tokens`, `fog`, `mapImage`).
2.  **Updates:** State is passed down to `MapGrid` via props.
3.  **Interactions:** User actions in `MapGrid` (e.g., moving a token) trigger callbacks passed from `GmScreen` to update the state.

## 4. Future Roadmap
1.  **Real-time Sync:** Implement Firebase Firestore to sync state between GM and Player views.
2.  **Authentication:** Add Firebase Auth for user sessions.
3.  **AI Features:** Use Genkit for NPC generation and encounter planning.

## 5. File Tree
src/
├── ai
│   ├── activeContext.md
│   ├── dev.ts
│   ├── genkit.ts
│   ├── project_context.md
│   └── systemPatterns.md
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── gm
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── player
│       └── page.tsx
├── components
│   ├── gm
│   │   ├── category-edit-dialog.tsx
│   │   ├── editor
│   │   │   └── forms
│   │   ├── fog-of-war.tsx
│   │   ├── gm-controls.tsx
│   │   ├── icon-edit-dialog.tsx
│   │   ├── icon-library.tsx
│   │   ├── icon-picker-dialog.tsx
│   │   ├── map-controls.tsx
│   │   ├── map-grid.tsx
│   │   ├── token-edit-dialog.tsx
│   │   └── token.tsx
│   ├── shared
│   │   ├── header.tsx
│   │   └── icon.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toaster.tsx
│       ├── toast.tsx
│       └── tooltip.tsx
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── game-icons.json
│   ├── game-icons.ts
│   ├── placeholder-images.json
│   ├── placeholder-images.ts
│   └── utils.ts
└── store