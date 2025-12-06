import { MapGrid } from '@/components/gm/map-grid';
import { Header } from '@/components/shared/header';

export default function PlayerPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="Player View" />
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <MapGrid isPlayerView={true} />
      </main>
    </div>
  );
}
