/**
 * Confirmation toasts shared by every page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { IconBox, IconButton, Toast, type ToastProps } from '@/components/ui'

/**
 * Content of a toast, without layout props.
 */
export type ToastMessage = Omit<ToastProps, 'className'> & { placement?: 'floating' | 'inline' }

/**
 * Toast actions shared across the app.
 */
export interface ToastState {
  /** Shows a toast in the corner of the screen; it hides itself after 4 seconds. */
  showToast: (message: ToastMessage) => void
  /** Current confirmation, rendered in the matching outlet. */
  message: ToastMessage | null
  /** Dismisses the confirmation. */
  dismissToast: () => void
}

const ToastContext = createContext<ToastState | null>(null)

// Time a toast stays visible, in milliseconds.
const TOAST_DURATION_MS = 4000

/**
 * Provides the toast action and renders the visible toast.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null)

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [message])

  const showToast = useCallback((next: ToastMessage) => setMessage(next), [])
  const dismissToast = useCallback(() => setMessage(null), [])
  const value = useMemo(() => ({ showToast, message, dismissToast }), [showToast, message, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-4 left-4 z-50 sm:left-auto sm:w-96">
        {message && message.placement !== 'inline' && <Toast {...message} />}
      </div>
    </ToastContext.Provider>
  )
}

/**
 * Reads the toast action.
 *
 * @returns The toast state with `showToast`.
 * @throws Error when used outside {@link ToastProvider}.
 */
export function useToast(): ToastState {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}

/** Displays action confirmations within the current page, without covering rows. */
export function InlineToast() {
  const context = useContext(ToastContext)
  const message = context?.message
  if (!message || message.placement !== 'inline') return null
  return <div role="status" className="flex items-center gap-3 rounded-lg bg-secondary-pale p-3.5 text-secondary-strong">
    <IconBox icon={message.icon ?? 'check_circle'} tone="success" size="sm" className="bg-white" />
    <div className="min-w-0 flex-1"><p className="text-label-l">{message.title}</p><p className="text-body-m">{message.message}</p></div>
    <IconButton icon="close" label="Descartar confirmación" onClick={context.dismissToast} className="size-6 bg-transparent text-secondary-strong shadow-none" />
  </div>
}
