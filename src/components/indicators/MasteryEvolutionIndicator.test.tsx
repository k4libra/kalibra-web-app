/** Regression coverage for API floating point measurements in the indicator UI.
 * @author Not specified
 * @packageDocumentation
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MasteryEvolutionIndicator } from './MasteryEvolutionIndicator'
import type { IndicatorSummary } from '@/types/indicators'
describe('mastery evolution presentation', () => {
  it('rounds API summary, percentages and subtopic deltas and exposes the current level', () => {
    const summary: IndicatorSummary = {groupAccuracy:50, groupInitial:65,groupCurrent:67.4999999999999,groupDeltaPoints:2.499999999999999,totalSolved:2,averagePerActiveStudent:2,activeStudents:1,approvalRate:100,approved:1,discarded:0}
    const {container}=render(<MasteryEvolutionIndicator summary={summary} subtopics={[{subtopicId:'one',subtopicName:'Tema',solvedCount:2,initialMastery:65,currentMastery:67.4999999999999,deltaPoints:2.499999999999999,generatedCount:1,approvedCount:1}]} />)
    expect(screen.getAllByText('+2 pts')).toHaveLength(2)
    expect(screen.getByText('65% → 67%')).toBeInTheDocument()
    expect(screen.getByText('Medio')).toBeInTheDocument()
    expect(container.textContent).not.toContain('999999')
  })
  it('keeps an unpracticed subtopic distinct from a zero change', () => {
    render(<MasteryEvolutionIndicator subtopics={[{subtopicId:'one',subtopicName:'Tema',solvedCount:0,initialMastery:null,currentMastery:null,deltaPoints:null,generatedCount:0,approvedCount:0}]} />)
    expect(screen.getByText('Sin práctica aún')).toBeInTheDocument()
    expect(screen.queryByText('0% → 0%')).not.toBeInTheDocument()
  })
})
