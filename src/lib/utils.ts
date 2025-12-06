/**
 * @file This file contains utility functions used throughout the application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It uses `clsx` to handle conditional classes and `tailwind-merge`
 * to intelligently merge Tailwind CSS classes without conflicts.
 *
 * @param {...ClassValue[]} inputs A list of class names or conditional class objects.
 * @returns {string} The combined and merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
