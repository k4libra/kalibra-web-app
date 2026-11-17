/** Behavior of the shared UI v2 controls.
 * @author Not specified
 * @packageDocumentation
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AlertBanner, CodeBlock, CountBadge, CourseFilter, CourseGroup, Icon, ListRow, StatItem, StatStrip, Switch } from './index'
import { COURSES } from '@/test/uiFixtures'
describe('UI v2', () => {
  it('renders accessible Lucide SVGs with a 2px stroke and hides decorative icons', () => {
    const {container}=render(<><Icon name="school" label="Curso" /><Icon name="mail" /></>)
    expect(screen.getByRole('img',{name:'Curso'})).toHaveAttribute('stroke-width','2')
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument()
    expect(container.textContent).not.toContain('school')
  })
  it('emits a controlled switch change and prevents disabled changes', async () => {
    const onChange=vi.fn();const {rerender}=render(<Switch checked label="Recordatorio" onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'));expect(onChange).toHaveBeenCalledExactlyOnceWith(false)
    rerender(<Switch checked label="Recordatorio" disabled onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'));expect(onChange).toHaveBeenCalledTimes(1)
  })
  it('dismisses error notices through an explicitly named button', async () => {
    const dismiss=vi.fn();render(<AlertBanner title="No se pudo completar" onDismiss={dismiss}>Puedes intentarlo más tarde.</AlertBanner>)
    expect(screen.getByRole('alert')).toHaveTextContent('Puedes intentarlo más tarde.')
    await userEvent.click(screen.getByRole('button',{name:'Descartar aviso'}));expect(dismiss).toHaveBeenCalledOnce()
  })
  it('uses counts rather than a notification dot and preserves a true zero', () => {
    render(<CountBadge count={0} label="Invitaciones pendientes" />)
    expect(screen.getByLabelText('Invitaciones pendientes')).toHaveTextContent('0')
  })
  it('exposes the actual course counts and emits the chosen filter', async () => {
    const onChange=vi.fn();render(<CourseFilter value="" onChange={onChange} courses={[{id:'a',name:'Álgebra',count:3},{id:'b',name:'Algoritmos',count:0}]} />)
    expect(screen.getByRole('button',{name:'Todos los cursos 3'})).toHaveAttribute('aria-pressed','true')
    await userEvent.click(screen.getByRole('button',{name:'Algoritmos 0'}));expect(onChange).toHaveBeenCalledWith('b')
  })
  it('collapses course content while preserving its metadata and count', async () => {
    render(<CourseGroup course={COURSES[0]} countLabel="2 ejercicios"><p>Exercise rows</p></CourseGroup>)
    await userEvent.click(screen.getByRole('button',{name:`Contraer ${COURSES[0].name}`}))
    expect(screen.queryByText('Exercise rows')).not.toBeInTheDocument();expect(screen.getByText('2 ejercicios')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button',{name:`Expandir ${COURSES[0].name}`}));expect(screen.getByText('Exercise rows')).toBeInTheDocument()
  })
  it('renders code as escaped text with a header and numbered lines', () => {
    const {container}=render(<CodeBlock code={'<script>unsafe()</script>\nreturn 4'} language="python" fileName="función.py" />)
    expect(screen.getByText('función.py')).toBeInTheDocument();expect(screen.getByText('python')).toBeInTheDocument()
    expect(container.querySelector('script')).toBeNull();expect(container.textContent).toContain('<script>unsafe()</script>')
    expect(container.querySelectorAll('pre [aria-hidden]')).toHaveLength(2)
  })
  it('composes resource-backed metrics and actionable rows', async () => {
    const click=vi.fn();render(<><StatStrip><StatItem icon="group" value="3" label="Estudiantes" /></StatStrip><ListRow icon="school" title="Curso" description="Administrar" onClick={click} /></>)
    expect(within(screen.getByRole('region',{name:'Resumen'})).getByText('3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button',{name:'Curso Administrar'}));expect(click).toHaveBeenCalledOnce()
  })
})
