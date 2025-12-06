/**
 * @file This file defines a shared Header component used across different pages
 * of the application, such as the GM screen and Player View.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Grid3x3, Home } from 'lucide-react';

/**
 * Props for the Header component.
 */
interface HeaderProps {
  /** The title to be displayed in the center of the header. */
  title: string;
}

/**
 * A shared header component that provides consistent branding and navigation.
 *
 * @param {HeaderProps} props The component props.
 * @returns {JSX.Element} The rendered header.
 */
export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center h-16 px-4 md:px-6 border-b border-border bg-card shrink-0 z-20">
      {/* Link to the home page with the app logo and name */}
      <Link href="/" className="flex items-center gap-3 text-lg font-semibold md:text-base">
        <div className="p-2 rounded-md bg-primary text-primary-foreground shadow-md shadow-primary/50">
          <Grid3x3 className="h-5 w-5" />
        </div>
        <span className="hidden sm:inline-block font-headline text-lg">ShadowGrid</span>
      </Link>
      <div className="flex items-center w-full gap-4">
        {/* The title for the current page */}
        <h1 className="flex-1 text-xl font-semibold text-center text-muted-foreground">{title}</h1>
        {/* A button that links back to the home page */}
        <Button variant="ghost" size="icon" className="ml-auto rounded-full" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
