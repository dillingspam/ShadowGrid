/**
 * @file This file defines the landing page for the ShadowGrid application.
 * It serves as the main entry point, providing a brief introduction and links
 * to the GM Screen and Player View.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dices, Tv } from 'lucide-react';
import { Grid3x3 } from 'lucide-react';

/**
 * The main component for the application's home page.
 * Features a hero section with the app title, description, and navigation buttons.
 *
 * @returns {JSX.Element} The rendered landing page.
 */
export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      {/* Gradient overlay for visual effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>

      <main className="relative flex min-h-screen flex-col items-center justify-center p-8 z-10">
        <div className="text-center space-y-6">
          {/* App Logo */}
          <div className="inline-block p-4 bg-primary/10 border border-primary/20 rounded-2xl mb-4">
             <Grid3x3 className="h-10 w-10 text-primary animate-glow-primary" />
          </div>
          {/* App Title */}
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-br from-primary-foreground to-muted-foreground">
            ShadowGrid
          </h1>
          {/* App Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your tactical command center for next-generation TTRPGs. Manage encounters, visualize the battlefield, and immerse your players.
          </p>
        </div>

        {/* Call-to-action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <Button size="lg" className="w-64 h-16 text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow duration-300" asChild>
            <Link href="/gm">
              <Dices className="mr-3 h-6 w-6" />
              Launch GM Screen
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-64 h-16 text-lg font-bold border-accent text-accent shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:bg-accent/10 transition-all duration-300" asChild>
            <Link href="/player">
              <Tv className="mr-3 h-6 w-6" />
              Launch Player View
            </Link>
          </Button>
        </div>

        <footer className="absolute bottom-4 text-sm text-muted-foreground">
          Built for the digital age of roleplaying.
        </footer>
      </main>
    </div>
  );
}
