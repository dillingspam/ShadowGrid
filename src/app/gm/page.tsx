import { GmControls } from '@/components/gm/gm-controls';
import { IconLibrary } from '@/components/gm/icon-library';
import { MapGrid } from '@/components/gm/map-grid';
import { Header } from '@/components/shared/header';
import { Separator } from '@/components/ui/separator';

export default function GMPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="GM Screen" />
      <div className="grid md:grid-cols-[1fr_350px] flex-1 overflow-hidden">
        <main className="p-4 overflow-auto">
          <MapGrid />
        </main>
        <aside className="hidden md:flex flex-col bg-card border-l border-border">
          <IconLibrary />
          <Separator />
          <div className="flex-1 overflow-y-auto">
            <GmControls />
          </div>
        </aside>
      </div>
    </div>
  );
}
