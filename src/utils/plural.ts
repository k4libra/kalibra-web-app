/**
 * Count label helper for interface texts.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Builds a label with a count and the singular or plural form of a noun.
 *
 * @param count - Number of items.
 * @param singular - Noun used when `count` is 1.
 * @param plural - Noun used for any other count.
 * @returns The count followed by the matching noun.
 *
 * @example
 * ```ts
 * plural(2, 'curso', 'cursos'); // '2 cursos'
 * ```
 */
export function plural(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}
