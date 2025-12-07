/**
 * @file This file defines a universal Icon component that can render icons
 * from both the Lucide library and the Iconify library.
 */
import { Icon as IconifyIcon } from '@iconify/react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.HTMLAttributes<SVGElement> {
  name: string;
  size?: number;
}

// A type-safe mapping of Lucide icon names to their components.
const lucideIconMap = LucideIcons as unknown as { [key: string]: React.ComponentType<any> };

/**
 * Renders an icon dynamically based on its name.
 * - If the name contains a colon (':'), it's treated as an Iconify icon (e.g., 'game-icons:swords').
 * - Otherwise, it's treated as a Lucide icon (e.g., 'User').
 * 
 * This provides a single, consistent way to handle icons across the application.
 * @param {IconProps} { name, ...props }
 * @returns {JSX.Element | null} The rendered icon component or null if not found.
 */
export function Icon({ name, ...props }: IconProps) {
  // Render Iconify icon if the name is in the format 'prefix:name'.
  if (name.includes(':')) {
    return <IconifyIcon icon={name} {...props} />;
  }

  // Otherwise, look for a matching component in the Lucide icon map.
  const LucideIcon = lucideIconMap[name];
  if (LucideIcon) {
    return <LucideIcon {...props} />;
  }
  
  // As a fallback, render the 'HelpCircle' icon if the specified name is not found.
  const FallbackIcon = lucideIconMap['HelpCircle'];
  return FallbackIcon ? <FallbackIcon {...props} /> : null;
}