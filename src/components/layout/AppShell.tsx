/**
 * Responsive frame of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState, type ReactNode } from 'react'
import { IconButton } from '@/components/ui'
import { Logo } from './Logo'
import { Sidebar, type SidebarProps } from './Sidebar'

/**
 * Props accepted by {@link AppShell}.
 */
export interface AppShellProps {
  /** Props forwarded to the {@link Sidebar}. */
  sidebar: Omit<SidebarProps, 'onNavigate'>
  /** Content of the current page. */
  children: ReactNode
}

/**
 * Renders the sidebar and the page content.
 *
 * @remarks
 * Below `lg` the sidebar becomes a drawer opened from a top bar; from `lg` it is fixed on the left.
 *
 * @example
 * ```tsx
 * <AppShell sidebar={sidebarProps}><Outlet /></AppShell>
 * ```
 */
export function AppShell({ sidebar, children }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-surface-background lg:pl-66">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-2 bg-surface-background/90 px-2 shadow-subtle backdrop-blur lg:hidden">
        <IconButton icon="menu" label="Abrir menú" onClick={() => setIsMenuOpen(true)} />
        <Logo />
      </header>

      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar {...sidebar} />
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div className="absolute inset-0 bg-content-primary/40" onClick={() => setIsMenuOpen(false)} aria-hidden />
          <div className="relative h-full max-w-[85vw]">
            <Sidebar {...sidebar} onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-[1016px] flex-col gap-6 px-4 pt-6 pb-10 md:px-8 lg:px-10 lg:pt-8">{children}</main>
    </div>
  )
}
