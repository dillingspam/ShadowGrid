/**
 * @file This file processes the raw icon data from @iconify-json/game-icons
 * to create a categorized and memoized list for use in the icon picker UI.
 */
import memoize from 'lodash/memoize';
import icons from '@iconify-json/game-icons/icons.json';

export type CategorizedIcons = Record<string, string[]>;

/**
 * A keyword-based mapping to categorize icons. This "AI-powered" approach uses
 * semantic groupings to create a more intuitive icon picker experience.
 * The keys are the category names that will be displayed in the UI.
 * The values are arrays of keywords that are matched against icon names.
 */
const categoryKeywords: Record<string, string[]> = {
  'Characters & Classes': ['person', 'character', 'player', 'npc', 'barbarian', 'knight', 'archer', 'wizard', 'rogue', 'cleric', 'paladin', 'fighter', 'mage', 'ninja', 'pirate', 'king', 'queen', 'soldier', 'guard', 'woman', 'man', 'face', 'elf', 'dwarf'],
  'Creatures & Monsters': ['monster', 'creature', 'animal', 'dragon', 'goblin', 'orc', 'slime', 'bat', 'wolf', 'spider', 'golem', 'beast', 'undead', 'ghost', 'zombie', 'skeleton', 'troll', 'drake', 'wyvern', 'hydra', 'beholder', 'serpent', 'insect'],
  'Weapons': ['weapon', 'sword', 'axe', 'mace', 'spear', 'bow', 'arrow', 'dagger', 'halberd', 'gun', 'pistol', 'rifle', 'cannon', 'blade', 'throwing', 'shuriken', 'sai', 'glaive', 'scythe'],
  'Armor & Shields': ['armor', 'shield', 'helmet', 'gauntlet', 'bracers', 'chestplate', 'boots', 'greaves', 'mail', 'plate', 'pauldron'],
  'Magic & Spells': ['magic', 'spell', 'book', 'scroll', 'wand', 'staff', 'rune', 'potion', 'flask', 'cauldron', 'spellbook', 'circle', 'symbol', 'arcane', 'enchant', 'summon', 'aura', 'blast'],
  'Items & Loot': ['item', 'loot', 'treasure', 'chest', 'key', 'gem', 'coin', 'gold', 'ring', 'amulet', 'relic', 'artifact', 'gear', 'bag', 'pouch', 'backpack'],
  'Nature & Environment': ['nature', 'environment', 'tree', 'forest', 'mountain', 'cave', 'river', 'plant', 'flower', 'rock', 'stone', 'cloud', 'sun', 'moon', 'star', 'crystal', 'volcano', 'wave', 'vine'],
  'Buildings & Structures': ['building', 'structure', 'castle', 'tower', 'fort', 'wall', 'gate', 'house', 'tent', 'camp', 'bridge', 'ruins', 'dungeon', 'temple', 'village', 'graveyard'],
  'Body & Anatomy': ['body', 'health', 'heart', 'skull', 'bone', 'eye', 'hand', 'fist', 'head', 'brain', 'wing', 'foot', 'anatomy', 'organ'],
  'Food & Drink': ['food', 'drink', 'meat', 'apple', 'bread', 'bottle', 'cup', 'mug', 'cheese', 'fish', 'fruit', 'beer', 'wine'],
  'Tools & Crafting': ['tool', 'craft', 'hammer', 'anvil', 'pickaxe', 'shovel', 'rope', 'torch', 'compass', 'map', 'spyglass', 'trowel'],
  'UI & Symbols': ['ui', 'symbol', 'icon', 'arrow', 'target', 'crosshair', 'pointer', 'cursor', 'checkbox', 'gears', 'lock', 'unlock', 'plus', 'minus', 'check', 'cross', 'action', 'button'],
  'Miscellaneous': [], // A catch-all for icons that don't match other categories
};

/**
 * Processes the flat list of icons from the game-icons set into a categorized object.
 * It iterates through each icon, checks its name against the keywords for each category,
 * and assigns it to the first matching category.
 * 
 * The function is memoized to ensure this expensive computation runs only once.
 */
export const getCategorizedIcons = memoize((): CategorizedIcons => {
  const categorized: CategorizedIcons = {};
  const iconNames = Object.keys(icons.icons);
  const categoryNames = Object.keys(categoryKeywords);

  // Initialize the categorized object with all category keys.
  for (const cat of categoryNames) {
    categorized[cat] = [];
  }

  // Categorize each icon based on the keyword mapping.
  iconNames.forEach(name => {
    const parts = name.split('-');
    let assignedCategory: string | null = null;

    for (const category of categoryNames) {
      if (category === 'Miscellaneous') continue; // Handle the catch-all category last.

      const keywords = categoryKeywords[category];
      // Use .some() for efficiency, breaking the loop as soon as a match is found.
      if (parts.some(part => keywords.includes(part))) {
        assignedCategory = category;
        break; // Icon is categorized, move to the next one.
      }
    }

    // Assign the icon to its category or to 'Miscellaneous' if no match was found.
    const finalCategory = assignedCategory || 'Miscellaneous';
    categorized[finalCategory].push(`game-icons:${name}`);
  });

  // Clean up the final object.
  for (const category in categorized) {
    // Sort icons within each category alphabetically for a consistent UI.
    categorized[category].sort();

    // Remove any categories that ended up with no icons (except Miscellaneous).
    if (category !== 'Miscellaneous' && categorized[category].length === 0) {
      delete categorized[category];
    }
  }

  // If the Miscellaneous category is empty, remove it as well.
  if (categorized['Miscellaneous'] && categorized['Miscellaneous'].length === 0) {
    delete categorized['Miscellaneous'];
  }

  return categorized;
});
