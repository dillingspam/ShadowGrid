import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Grid3x3, Home } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center h-16 px-4 md:px-6 border-b border-border bg-card shrink-0 z-20">
      <Link href="/" className="flex items-center gap-3 text-lg font-semibold md:text-base">
        <div className="p-2 rounded-md bg-primary text-primary-foreground shadow-md shadow-primary/50">
          <Grid3x3 className="h-5 w-5" />
        </div>
        <span className="hidden sm:inline-block font-headline text-lg">ShadowGrid</span>
      </Link>
      <div className="flex items-center w-full gap-4">
        <h1 className="flex-1 text-xl font-semibold text-center text-muted-foreground">{title}</h1>
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
