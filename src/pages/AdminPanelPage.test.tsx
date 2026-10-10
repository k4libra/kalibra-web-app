/**
 * Tests institutional analytics, critical ranking, CSV downloads and recoverable errors.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdminPanelPage } from '@/pages/AdminPanelPage'
import { CriticalSubtopicsPage } from '@/pages/CriticalSubtopicsPage'
import { apiStub, institutionalDto } from '@/test/apiStub'

const panelPath = '/institutional-indicators'
const rankingPath = '/institutional-indicators/critical-subtopics'

describe('administrator analytics pages', () => {
  it('shows real institutional totals and per-course comparisons', async () => {
    render(<AdminPanelPage />)
    expect(screen.getByText('Cargando indicadores institucionales…')).toBeInTheDocument()
    const totals = await screen.findByRole('region', { name: 'Totales institucionales' })
    expect(within(totals).getByText('69')).toBeInTheDocument()
    expect(within(totals).getByText('+12 pp')).toBeInTheDocument()
    expect(within(totals).getByText('70%')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Indicadores por curso' })
    expect(within(table).getByText('Profesor Test 1', { exact: false })).toBeInTheDocument()
    expect(within(table).getByRole('img', { name: /frente al promedio institucional/ })).toBeInTheDocument()
  })
  it('exports the server CSV with credentials and an explicit text/csv Accept header', async () => {
    render(<AdminPanelPage />)
    await screen.findByRole('table', { name: 'Indicadores por curso' })
    await userEvent.click(screen.getByRole('button', { name: 'Exportar CSV' }))
    const request = vi.mocked(fetch).mock.calls.find(([path, init]) => String(path).endsWith(panelPath) && new Headers(init?.headers).get('Accept') === 'text/csv')!
    expect(request[1]).toMatchObject({ credentials: 'include' })
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob
    expect(await blob.text()).toContain('TEST,69')
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
  })
  it('renders an empty institution and keeps unavailable percentages as missing data', async () => {
    apiStub.respond(panelPath, 200, { totals: { ...institutionalDto.totals, courses: 0, teachers: 0, enrolledStudents: 0, activeStudents: 0, totalSolved: 0, groupAccuracy: null, groupDeltaPoints: null, verificationApprovalRate: null }, courses: [] })
    render(<AdminPanelPage />)
    await screen.findByText('Aún no hay cursos en la institución')
    expect(screen.getAllByText('—')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDisabled()
  })
  it.each([403, 503])('shows an explicit %s state and recovers through retry', async (status) => {
    apiStub.respond(panelPath, status)
    render(<AdminPanelPage />)
    expect(await screen.findByRole('alert')).toHaveTextContent(status === 503 ? 'Servicio no disponible por el momento' : 'No tienes permiso')
    apiStub.clear(panelPath)
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    await screen.findByRole('table', { name: 'Indicadores por curso' })
  })
  it('shows a CSV failure without losing the report', async () => {
    render(<AdminPanelPage />)
    await screen.findByRole('table', { name: 'Indicadores por curso' })
    apiStub.respond(panelPath, 503)
    await userEvent.click(screen.getByRole('button', { name: 'Exportar CSV' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Servicio no disponible por el momento')
    expect(screen.getByRole('table', { name: 'Indicadores por curso' })).toBeInTheDocument()
  })
  it('shows ranked critical subtopics with mastery chips and complete distributions', async () => {
    render(<CriticalSubtopicsPage />)
    const table = await screen.findByRole('table', { name: 'Ranking de subtemas críticos' })
    expect(within(table).getByText('Programación Dinámica')).toBeInTheDocument()
    expect(within(table).getByText('Dominio bajo')).toBeInTheDocument()
    expect(within(table).getByText('31%')).toBeInTheDocument()
    expect(within(table).getByText('Bajo: 2 · Medio: 0 · Alto: 0 · Sin datos: 1')).toBeInTheDocument()
  })
  it('keeps unmeasured subtopics distinct from low mastery', async () => {
    apiStub.respond(rankingPath, 200, [{ courseId: 'course', courseName: 'Curso', subtopicId: 'topic', subtopicName: 'Tema', groupMastery: 0, lowCount: 0, mediumCount: 0, highCount: 0, noDataCount: 3 }])
    render(<CriticalSubtopicsPage />)
    const table = await screen.findByRole('table', { name: 'Ranking de subtemas críticos' })
    expect(within(table).getByText('Sin datos')).toBeInTheDocument()
    expect(within(table).getByText('—')).toBeInTheDocument()
    expect(within(table).queryByText('Dominio bajo')).not.toBeInTheDocument()
  })
  it('shows an empty ranking', async () => {
    apiStub.respond(rankingPath, 200, [])
    render(<CriticalSubtopicsPage />)
    expect(await screen.findByText('Aún no hay subtemas críticos')).toBeInTheDocument()
  })
  it('shows a failed ranking and recovers through retry', async () => {
    apiStub.respond(rankingPath, 503)
    render(<CriticalSubtopicsPage />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Servicio no disponible por el momento')
    apiStub.clear(rankingPath)
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    await screen.findByRole('table', { name: 'Ranking de subtemas críticos' })
  })
})
