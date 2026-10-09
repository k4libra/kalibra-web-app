
/**
 * Badge for estimated student mastery levels.
 *
 * @remarks
 * Displays high, medium, low and unavailable mastery
 * states using the visual language of Kalibra.
 *
 * @packageDocumentation
 */

import type { MasteryLevel } from '@/types/studentMonitoring'

export interface MasteryBadgeProps {
    mastery: number | null
    showPercentage?: boolean
    className?: string
}

/**
 * Determines the mastery level from a percentage.
 *
 * @remarks
 * Thresholds:
 * - High: 70% or more.
 * - Medium: 40% to 69%.
 * - Low: below 40%.
 * - No data: null.
 */
export function getMasteryLevel(
    mastery: number | null,
): MasteryLevel {
    if (mastery === null) {
        return 'no-data'
    }

    if (mastery >= 70) {
        return 'high'
    }

    if (mastery >= 40) {
        return 'medium'
    }

    return 'low'
}

const MASTERY_STYLES: Record<
    MasteryLevel,
    { label: string; className: string }
> = {
    high: {
        label: 'Dominio alto',
        className: 'bg-emerald-100 text-emerald-800',
    },
    medium: {
        label: 'Dominio medio',
        className: 'bg-amber-100 text-amber-800',
    },
    low: {
        label: 'Dominio bajo',
        className: 'bg-red-100 text-red-800',
    },
    'no-data': {
        label: 'Sin datos',
        className: 'bg-slate-100 text-slate-600',
    },
}

/**
 * Renders the estimated mastery status.
 */
export function MasteryBadge({
                                 mastery,
                                 showPercentage = false,
                                 className = '',
                             }: MasteryBadgeProps) {
    const level = getMasteryLevel(mastery)
    const config = MASTERY_STYLES[level]

    const label =
        showPercentage && mastery !== null
            ? `${config.label} · ${Math.round(mastery)}%`
            : config.label

    return (
        <span
            className={[
                'inline-flex items-center rounded-md px-2.5 py-1',
                'text-xs font-semibold whitespace-nowrap',
                config.className,
                className,
            ].join(' ')}
        >
      {label}
    </span>
    )
}
