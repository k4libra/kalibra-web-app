/**
 * Class name helper for Tailwind utilities.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Joins the truthy class names into a single `className` string.
 *
 * @remarks
 * It does not resolve conflicting utilities: primitives only accept layout classes from the parent.
 *
 * @param classes - Class names; `false`, `null`, `undefined` and empty strings are skipped.
 * @returns The class names separated by a single space.
 *
 * @example
 * ```ts
 * cn('flex', isActive && 'bg-primary-container'); // 'flex bg-primary-container'
 * ```
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
