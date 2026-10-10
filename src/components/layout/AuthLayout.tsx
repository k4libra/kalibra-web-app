/**
 * Responsive branding and form frame for authentication.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import type { IconName } from '@/types/ui'
import { Icon } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'

/** Props accepted by {@link AuthLayout}. */
export interface AuthLayoutProps {
  /** Form content rendered in the right panel. */
  children: ReactNode
  /** Headline introducing the current authentication flow. */
  title: string
  /** Supporting text under the headline. */
  description: string
}

const FEATURES: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'upload_file',
    title: 'Material curricular por subtema',
    description: 'Kalibra extrae el contenido y te avisa cuando está listo.',
  },
  {
    icon: 'verified',
    title: 'Ejercicios verificados',
    description: 'Todo ejercicio pasa la capa de verificación antes de publicarse.',
  },
  {
    icon: 'insights',
    title: 'Mapa de brechas del grupo',
    description: 'Prioriza qué reforzar según el dominio real por subtema.',
  },
]

/**
 * Renders the responsive authentication frame with shared branding and a form slot.
 *
 * @remarks
 * The intrinsic desktop ratio is 560/720 and the form column is 400 px at the 1280 px reference.
 *
 * @example
 * ```tsx
 * <AuthLayout title="Welcome" description="Manage your courses."><SignInForm /></AuthLayout>
 * ```
 */
export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-surface-background lg:grid lg:grid-cols-[7fr_9fr]">
      <aside className="flex flex-col gap-10 bg-linear-to-br from-primary to-primary-strong px-6 py-8 text-content-on-primary sm:px-14 lg:min-h-dvh lg:py-12">
        <Logo tone="inverse" />
        <div className="flex flex-1 flex-col justify-center gap-6 lg:py-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-content-on-primary/15 px-2.5 py-1 text-label-m">
              <Icon name="badge" size="sm" />
              PORTAL DOCENTE
            </span>
            <h1 className="text-display">{title}</h1>
            <p className="text-body-l text-content-on-primary/80">{description}</p>
          </div>
          <div className="flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 rounded-md bg-content-on-primary/10 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-content-on-primary/15">
                  <Icon name={feature.icon} />
                </span>
                <div>
                  <p className="text-title">{feature.title}</p>
                  <p className="text-body-m text-content-on-primary/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-label-m text-content-on-primary/80">
          <Icon name="lock" size="sm" />
          Tus datos académicos están protegidos
        </p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  )
}
