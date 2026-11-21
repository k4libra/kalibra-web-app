/**
 * Parses only code and formula blocks explicitly present in an API statement.
 * @author Not specified
 * @packageDocumentation
 */
/** A literal block from an exercise statement. */
export interface ExerciseContentBlock { kind: 'text' | 'code' | 'formula'; value: string; language?: string }
/** Preserves source order, leaving unmarked prose untouched. */
export function splitExerciseContent(statement: string): ExerciseContentBlock[] {
  const pattern = /```([^\n`]*)\n([\s\S]*?)```|\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g
  const blocks: ExerciseContentBlock[] = []
  let end = 0
  for (const match of statement.matchAll(pattern)) {
    if (match.index > end) blocks.push({ kind: 'text', value: statement.slice(end, match.index).trim() })
    blocks.push(match[2] !== undefined ? { kind: 'code', language: match[1].trim() || undefined, value: match[2].trimEnd() } : { kind: 'formula', value: (match[3] ?? match[4]).trim() })
    end = match.index + match[0].length
  }
  if (end < statement.length) blocks.push({ kind: 'text', value: statement.slice(end).trim() })
  return blocks.filter((block) => block.value.length > 0)
}
