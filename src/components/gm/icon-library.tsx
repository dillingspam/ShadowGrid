import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Shield, Swords, Skull, Gem, Box, Ghost, Dragon } from 'lucide-react';

const IconWrapper = ({ children, tooltip }: { children: React.ReactNode; tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="p-3 flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-pointer transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]">
        {children}
      </div>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export function IconLibrary() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4 flex flex-col h-[55%]">
        <h3 className="text-lg font-semibold mb-4 font-headline text-primary" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
          Token Library
        </h3>
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2 px-1">Players & NPCs</p>
              <div className="grid grid-cols-4 gap-2">
                <IconWrapper tooltip="Player"><User size={28} /></IconWrapper>
                <IconWrapper tooltip="Guardian"><Shield size={28} /></IconWrapper>
              </div>
            </div>
            <Separator className="my-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2 px-1">Monsters</p>
              <div className="grid grid-cols-4 gap-2">
                <IconWrapper tooltip="Undead"><Skull size={28} /></IconWrapper>
                <IconWrapper tooltip="Spirit"><Ghost size={28} /></IconWrapper>
                <IconWrapper tooltip="Beast"><Dragon size={28} /></IconWrapper>
                <IconWrapper tooltip="Melee"><Swords size={28} /></IconWrapper>
              </div>
            </div>
            <Separator className="my-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2 px-1">Items</p>
              <div className="grid grid-cols-4 gap-2">
                <IconWrapper tooltip="Treasure"><Box size={28} /></IconWrapper>
                <IconWrapper tooltip="Objective"><Gem size={28} /></IconWrapper>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
