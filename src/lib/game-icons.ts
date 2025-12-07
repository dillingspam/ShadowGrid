/**
 * @file This file is responsible for loading and processing icons from the 
 * @iconify-json/game-icons package. It provides functions to access
 * categorized icons and individual icon data.
 */

import icons from '@iconify-json/game-icons/icons.json';
import { getIconData as getIconifyIconData } from '@iconify/utils';
import type { IconifyJSON } from '@iconify/types';

// Cast the imported JSON to the IconifyJSON type
const iconSet = icons as IconifyJSON;

/**
 * Interface for a single game icon reference.
 */
export interface GameIcon {
  name: string;      // e.g., "dragon-head"
  fullName: string;  // e.g., "game-icons:dragon-head"
}

/**
 * Interface for a category of game icons.
 */
export interface GameIconCategory {
  name: string;
  icons: GameIcon[];
}

/**
 * Processes the raw Iconify JSON and organizes icons into categories.
 * @returns {GameIconCategory[]} A list of categorized icons.
 */
function getCategorizedIcons(): GameIconCategory[] {
  const categories: { [key: string]: GameIcon[] } = {};
  const prefix = iconSet.prefix || 'game-icons';

  if (iconSet.categories) {
    for (const [categoryName, iconNames] of Object.entries(iconSet.categories)) {
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      iconNames.forEach(iconName => {
        categories[categoryName].push({
          name: iconName,
          fullName: `${prefix}:${iconName}`,
        });
      });
    }
  }

  // Sort categories and icons alphabetically
  return Object.keys(categories)
    .sort()
    .map(categoryName => ({
      name: categoryName,
      icons: categories[categoryName].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

/**
 * Creates a flat list of all available game icons.
 * @returns {GameIcon[]} A flat list of all icons.
 */
function getAllIcons(): GameIcon[] {
    const all: GameIcon[] = [];
    const prefix = iconSet.prefix || 'game-icons';
    
    Object.keys(iconSet.icons).forEach(iconName => {
        all.push({
            name: iconName,
            fullName: `${prefix}:${iconName}`
        });
    });
    
    return all.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Retrieves the data for a single icon from the loaded Iconify set.
 * @param {string} name - The full name of the icon (e.g., 'game-icons:dragon-head').
 * @returns {IconifyIcon | null} The icon data or null if not found.
 */
export function getIconData(name: string) {
  if (!name || !name.includes(':')) {
    return null;
  }
  const [prefix, iconName] = name.split(':');
  if (prefix !== (iconSet.prefix || 'game-icons')) {
    return null;
  }
  return getIconifyIconData(iconSet, iconName);
}


// Memoized exports to avoid re-computation on every import.
export const gameIconCategories = getCategorizedIcons();
export const allGameIcons = getAllIcons();
