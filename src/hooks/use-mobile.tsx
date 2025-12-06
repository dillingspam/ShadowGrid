/**
 * @file This file defines a custom React hook, `useIsMobile`, to determine if the
 * application is being viewed on a mobile-sized screen.
 */

import * as React from "react"

// Defines the breakpoint for mobile devices.
const MOBILE_BREAKPOINT = 768

/**
 * A custom hook that returns `true` if the window width is less than the mobile breakpoint.
 * It listens for window resize events to provide a reactive boolean value.
 *
 * @returns {boolean} `true` if the screen is considered mobile, otherwise `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query to check for the mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler to update the state when the media query match changes.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add listener and set initial state.
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup function to remove the listener.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
