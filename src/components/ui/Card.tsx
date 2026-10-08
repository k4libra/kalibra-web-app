/**
 * Card primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Inner spacing presets: `none` 0, `md` 20 px and `lg` 24 px.
 */
export type CardPadding = 'none' | 'md' | 'lg'

// Padding of each preset.
const PADDING_CLASS: Record<CardPadding, string> = {
  none: '',
  md: 'p-5',
  lg: 'p-6',
}

/**
 * Props accepted by {@link Card}.
 */
export interface CardProps {
  /** Content of the card. */
  children: ReactNode
  /**
   * Inner spacing.
   *
   * @defaultValue `'md'`
   */
  padding?: CardPadding
  /**
   * HTML element used as container, to keep the document outline semantic.
   *
   * @defaultValue `'div'`
   */
  as?: 'div' | 'section' | 'article'
  /** Layout classes from the parent. */
  className?: string
}

/**
 * Renders a white surface with the card elevation.
 *
 * @example
 * ```tsx
 * <Card as="article" padding="lg">...</Card>
 * ```
 */
export function Card({ children, padding = 'md', as: Element = 'div', className }: CardProps) {
  return <Element className={cn('rounded-lg bg-surface-card shadow-card', PADDING_CLASS[padding], className)}>{children}</Element>
}
