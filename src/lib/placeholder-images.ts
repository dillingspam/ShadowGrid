/**
 * @file This file exports placeholder image data sourced from a JSON file.
 * It defines the TypeScript type for placeholder images and exports the data
 * as a typed array.
 */

import data from './placeholder-images.json';

/**
 * Defines the structure for a placeholder image object.
 */
export type ImagePlaceholder = {
  id: string; // A unique identifier for the image.
  description: string; // A text description of the image.
  imageUrl: string; // The URL where the image is hosted.
  imageHint: string; // Keywords to help with AI-powered image searching.
};

/**
 * An array of placeholder image data, typed and exported for use in the application.
 */
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
