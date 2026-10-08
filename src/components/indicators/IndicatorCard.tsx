/**
 * Frame shared by the four course indicators.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { Callout, Card, Chip, IconBox, type ChipProps } from '@/components/ui'
import type { IconName, Tone } from '@/types/ui'

/**
 * Props accepted by {@link IndicatorCard}.
 */
export interface IndicatorCardProps {
  /** Icon of the indicator. */
  icon: IconName
  /** Color family of the icon box. */
  tone: Tone
  /** Question the indicator answers. */
  title: string
  /** What is measured. */
  subtitle: string
  /** Summary chip at the end of the header. */
  chip: ChipProps
  /** Headline value, for example `70%`. */
  kpi: string
  /** Sentence that explains the headline value. */
  kpiLabel: string
  /** Supporting detail under the headline. */
  kpiDetail: string
  /** Chart or table of the indicator. */
  children: ReactNode
  /** Plain-language explanation shown at the bottom. */
  howToRead: string
}

/**
 * Renders an indicator as a card with header, headline value, chart and a plain-language explanation.
 */
export function IndicatorCard({ icon, tone, title, subtitle, chip, kpi, kpiLabel, kpiDetail, children, howToRead }: IndicatorCardProps) {
  return (
    <Card as="section" padding="lg" className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center gap-4">
        <IconBox icon={icon} tone={tone} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="text-headline-m text-content-primary">{title}</h2>
          <p className="text-body-m text-content-secondary">{subtitle}</p>
        </div>
        <Chip {...chip} />
      </header>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-1 lg:w-64 lg:shrink-0">
          <span className="text-display text-content-primary">{kpi}</span>
          <span className="text-body-l text-content-secondary">{kpiLabel}</span>
          <span className="text-body-m text-content-secondary">{kpiDetail}</span>
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <Callout icon="lightbulb">
        <strong className="font-semibold">Cómo leerlo:</strong> {howToRead}
      </Callout>
    </Card>
  )
}
