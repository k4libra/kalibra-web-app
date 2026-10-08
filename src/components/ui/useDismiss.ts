/**
 * Keyboard and scroll behavior shared by overlay primitives.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect } from 'react'

/**
 * Closes an overlay with Escape and locks the page scroll while it is open.
 *
 * @param isOpen - Whether the overlay is visible.
 * @param onClose - Called when the user presses Escape.
 * @returns Nothing; the effect is cleaned up when the overlay closes or unmounts.
 *
 * @example
 * ```tsx
 * useDismiss(isOpen, onClose);
 * ```
 */
export function useDismiss(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
}
