/**
 * @file This file defines the root layout for the entire application.
 * It wraps all pages with common HTML structure, including setting the language,
 * loading global stylesheets, and applying fonts. It also includes the Toaster component
 * for displaying notifications.
 */

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

/**
 * Metadata for the application, used for SEO and browser tab information.
 */
export const metadata: Metadata = {
  title: 'ShadowGrid',
  description: 'Tactical command center for next-generation TTRPGs.',
};

/**
 * The root layout component for the application.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root HTML structure for the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Sets the language to English and applies the dark theme by default.
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Import the Space Grotesk font */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {/* Renders the active page content */}
        {children}
        {/* Renders the Toaster component to show toast notifications */}
        <Toaster />
      </body>
    </html>
  );
}
