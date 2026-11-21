/** Read-only source and formula renderers; content comes from the exercise response.
 * @author Not specified
 * @packageDocumentation
 */
import fileUrl from '@/assets/code-file-icon.svg'
import type { ReactNode } from 'react'
const TOKEN = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*$|#.*$|\b(?:def|return|if|else|elif|for|while|class|function|const|let|int|void|public|static|new|import|from|None|True|False|null)\b|\b\d+(?:\.\d+)?\b)/g
function syntax(line: string): ReactNode[] {
  return line.split(TOKEN).map((part, i) => <span key={i} className={/^(\/\/|#)/.test(part) ? 'text-code-comment' : /^("|')/.test(part) ? 'text-secondary-container' : /^\d/.test(part) ? 'text-tertiary-container' : /^(def|return|if|else|elif|for|while|class|function|const|let|int|void|public|static|new|import|from|None|True|False|null)$/.test(part) ? 'text-primary-pale' : undefined}>{part}</span>)
}
/** Shows a filename, language pill and numbered, syntax-colored source lines. */
export function CodeBlock({ code, language, fileName }: { code: string; language?: string; fileName?: string }) {
  return <figure aria-label="Código del ejercicio" className="overflow-hidden rounded-lg bg-surface-code font-mono text-code-text">
    <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><img src={fileUrl} alt="" width={16} height={16} /><span className="flex-1 text-[12px] font-medium">{fileName || 'Código del ejercicio'}</span>{language && <span className="rounded-full bg-primary/35 px-2 py-1 text-[10px] font-bold text-primary-pale">{language}</span>}</figcaption>
    <pre className="overflow-x-auto py-3 text-[12px] leading-5"><code>{code.split('\n').map((line, index) => <span key={index} className="flex min-w-max pr-4"><span aria-hidden className="w-10 shrink-0 select-none pr-3 text-right text-code-comment">{index + 1}</span><span>{syntax(line)}</span>{'\n'}</span>)}</code></pre>
  </figure>
}
/** Displays source-provided mathematical notation using the formula typeface. */
export function FormulaBlock({ formula }: { formula: string }) {
  return <div aria-label="Fórmula del ejercicio" className="overflow-x-auto rounded-lg bg-primary-subtle p-5 text-center font-formula text-[24px] leading-8 whitespace-pre-wrap">{formula}</div>
}
