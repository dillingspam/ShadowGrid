'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Shield, Swords, Skull, Gem, Box, Ghost, Flame } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const IconWrapper = ({ children, tooltip, tokenType, iconName }: { children: React.ReactNode; tooltip: string; tokenType: string; iconName: string }) => {
  
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const dragData = {
      type: 'new-token',
      tokenType,
      icon: iconName,
      name: tooltip,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          draggable
          onDragStart={onDragStart}
          className="p-3 flex aspect-square items-center justify-center rounded-lg bg-background hover:bg-secondary cursor-grab active:cursor-grabbing transition-all text-muted-foreground hover:text-accent hover:drop-shadow-[0_0_5px_hsl(var(--accent))]">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Drag to add {tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export function IconLibrary() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="p-4 flex flex-col h-[55%]">
        <h3 className="text-lg font-semibold mb-4 font-headline text-primary" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
          Token Library
        </h3>
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <Accordion type="multiple" defaultValue={['players-npcs']} className="w-full space-y-2">
            <AccordionItem value="players-npcs" className="border-b-0">
              <AccordionTrigger className="py-2 px-2 rounded-md hover:no-underline bg-secondary/50 hover:bg-secondary transition-colors">
                <p className="text-sm font-medium text-muted-foreground">Players & NPCs</p>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="grid grid-cols-4 gap-2">
                  <IconWrapper tooltip="Player" tokenType="player" iconName="player"><User size={28} /></IconWrapper>
                  <IconWrapper tooltip="Guardian" tokenType="player" iconName="player"><Shield size={28} /></IconWrapper>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="monsters" className="border-b-0">
              <AccordionTrigger className="py-2 px-2 rounded-md hover:no-underline bg-secondary/50 hover:bg-secondary transition-colors">
                 <p className="text-sm font-medium text-muted-foreground">Monsters</p>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="grid grid-cols-4 gap-2">
                  <IconWrapper tooltip="Undead" tokenType="monster" iconName="monster"><Skull size={28} /></IconWrapper>
                  <IconWrapper tooltip="Spirit" tokenType="monster" iconName="monster"><Ghost size={28} /></IconWrapper>
                  <IconWrapper tooltip="Beast" tokenType="monster" iconName="monster"><Flame size={28} /></IconWrapper>
                  <IconWrapper tooltip="Melee" tokenType="monster" iconName="monster"><Swords size={28} /></IconWrapper>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="items" className="border-b-0">
              <AccordionTrigger className="py-2 px-2 rounded-md hover:no-underline bg-secondary/50 hover:bg-secondary transition-colors">
                 <p className="text-sm font-medium text-muted-foreground">Items</p>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="grid grid-cols-4 gap-2">
                  <IconWrapper tooltip="Treasure" tokenType="item" iconName="item"><Box size={28} /></IconWrapper>
                  <IconWrapper tooltip="Objective" tokenType="item" iconName="item"><Gem size={28} /></IconWrapper>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
