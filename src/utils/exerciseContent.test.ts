/** Structured statement parsing without invented content.
 * @author Not specified
 * @packageDocumentation
 */
import { describe, expect, it } from 'vitest'
import { splitExerciseContent } from './exerciseContent'
describe('exercise content', () => {
  it('preserves prose, code and formulas in source order', () => {
    expect(splitExerciseContent('Resuelve:\n```python\ndef f(n):\n  return n + 1\n```\nLuego $$x² + 1$$')).toEqual([
      {kind:'text',value:'Resuelve:'},{kind:'code',language:'python',value:'def f(n):\n  return n + 1'},
      {kind:'text',value:'Luego'},{kind:'formula',value:'x² + 1'},
    ])
  })
  it('does not create code or formulas from an ordinary question', () => {
    expect(splitExerciseContent('¿Cuál es el recorrido de un árbol?')).toEqual([{kind:'text',value:'¿Cuál es el recorrido de un árbol?'}])
  })
  it('supports bracketed formulas, unlabelled code and incomplete fences as literal text', () => {
    expect(splitExerciseContent('\\[a+b\\]')[0]).toEqual({kind:'formula',value:'a+b'})
    expect(splitExerciseContent('```\nx < 3\n```')[0]).toEqual({kind:'code',language:undefined,value:'x < 3'})
    expect(splitExerciseContent('```python\nx')).toEqual([{kind:'text',value:'```python\nx'}])
  })
})
