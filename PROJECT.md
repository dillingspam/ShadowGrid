# ShadowGrid Project Overview

## 1. Introduction

ShadowGrid is a web-based, tactical command center for tabletop role-playing games (TTRPGs). It provides Game Masters (GMs) and players with a shared, real-time virtual tabletop to visualize battlefields, manage tokens, and track encounters. The application is built with a modern web stack designed for performance, scalability, and a rich user experience.

## 2. Core Features

### For Game Masters (GMs)

- **Map Management**: Import custom map images to serve as the battlefield backdrop.
- **Token Library**: A streamlined, customizable library for managing token presets. Recent updates have simplified the interface by removing category icons and focusing on a clean, text-based list. Categories are now collapsed by default for a more organized view, and a dynamic scrollbar ensures all content is accessible, even with many expanded categories. GMs can still create, edit, and delete both categories and the tokens within them.
- **Dynamic Token Placement**: Drag-and-drop tokens from the library onto the grid. Edit token properties like name, color, and size on the fly.
- **Fog of War**: Dynamically reveal or hide areas of the map using a brush tool to maintain suspense and control player visibility.
- **Grid System**: A clear grid overlay to facilitate measurement and tactical movement.

### For Players

- **Real-time Player View**: A dedicated view that displays the map and tokens as updated by the GM in real-time.
- **Controlled Visibility**: The player view respects the Fog of War, ensuring players only see what the GM has revealed.

*(Note: Real-time synchronization is a future feature that will be implemented using Firebase.)*

## 3. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router) - A React framework for building server-rendered and statically generated web applications.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For type safety and improved developer experience.
- **UI Components**: [ShadCN/UI](httpss://ui.shadcn.com/) - A collection of beautifully designed, accessible, and composable components.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- **Icons**: [Lucide React](https://lucide.dev/) - A clean and consistent icon library.
- **State Management**: React Hooks (`useState`, `useRef`, `useEffect`) for local component state.
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) - Integrated for potential future AI-powered features like content generation or NPC management.

## 4. Project Structure

The project follows a standard Next.js App Router structure.

```
/
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── app/                # Main application routes
│   │   ├── gm/             # GM screen route and components
│   │   ├── player/         # Player view route
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout for the entire application
│   │   └── page.tsx        # Application landing page
│   │
│   ├── components/         # Reusable React components
│   │   ├── gm/             # Components specific to the GM screen
│   │   ├── shared/         # Components shared across different pages
│   │   └── ui/             # ShadCN UI components
│   │
│   ├── lib/                # Utility functions and libraries
│   │   └── utils.ts        # General utility functions (e.g., `cn` for classnames)
│   │
│   └── ai/                 # Genkit configuration and flows
│       ├── genkit.ts       # Genkit initialization
│       └── dev.ts          # Genkit development server entry point
│
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 5. Getting Started

### Running the Development Server

1.  Install dependencies: `npm install`
2.  Run the Next.js development server: `npm run dev`
3.  Open [http://localhost:9002](http://localhost:9002) to view the application.

### Key Pages

- **Landing Page**: `http://localhost:9002/`
- **GM Screen**: `http://localhost:9002/gm`
- **Player View**: `http://localhost:9002/player`

## 6. Future Development (Roadmap)

- **Real-time State Sync**: Implement Firebase (Firestore) to synchronize map state (tokens, fog of war) between the GM and all players in real-time.
- **Player-Specific Vision**: Allow GMs to assign vision to specific player tokens, automatically revealing the map based on their position.
- **Initiative Tracker**: A tool for GMs to manage combat turn order.
- **AI-Powered NPC/Encounter Generation**: Use Genkit to generate ideas for NPCs, random encounters, or loot.
- **Authentication**: Add Firebase Authentication to allow users to save their sessions, maps, and token libraries.
