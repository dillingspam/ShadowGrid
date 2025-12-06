import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function PlayerTokenIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function MonsterTokenIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M10 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
            <path d="M15 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
            <path d="M4 16.5c.63 2.18 2.44 4.5 8 4.5s7.37-2.32 8-4.5" />
            <path d="M2 12c0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 7-8 7-8-3.1-8-7" />
            <path d="m5 12 1-2" />
            <path d="m19 12-1-2" />
        </svg>
    );
}
