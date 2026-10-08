/**
 * Placeholder for screens that another branch implements.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { EmptyState, PageHeader } from '@/components/ui'

/**
 * Props accepted by {@link PlaceholderPage}.
 */
export interface PlaceholderPageProps {
  /** Name of the screen that will live on this route. */
  title: string
  /** Branch that implements the screen, for example `feature/auth`. */
  branch: string
}

/**
 * Shows which branch owns a route that is not implemented on the current branch.
 */
export function PlaceholderPage({ title, branch }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader eyebrow="EN CONSTRUCCIÓN" title={title} />
      <EmptyState icon="info" title="Pantalla pendiente" description={`Esta pantalla se implementa en la rama ${branch}.`} />
    </>
  )
}
