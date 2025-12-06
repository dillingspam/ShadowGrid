/**
 * @file This file is responsible for initializing and configuring the Genkit AI instance.
 * It sets up the necessary plugins (like Google AI) and defines the default model
 * to be used for generative tasks throughout the application.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * The global Genkit AI instance.
 * This instance is configured with the Google AI plugin and sets a default
 * model to be used for generation tasks.
 *
 * @property {Array} plugins - The list of plugins to use with Genkit.
 * @property {string} model - The default generative model to use.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
