/**
 * Preserves institutional aggregates while distinguishing absent practice from zero accuracy.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InstitutionalIndicators, InstitutionalIndicatorsDto } from '@/types/institutionalIndicators'

/** Maps explicit inactivity to missing practice measurements without inventing generation counts. */
export function mapInstitutionalIndicators(dto: InstitutionalIndicatorsDto): InstitutionalIndicators {
  return {
    totals: { ...dto.totals,
      groupAccuracy: dto.totals.totalSolved ? dto.totals.groupAccuracy : null,
      groupDeltaPoints: dto.totals.totalSolved ? dto.totals.groupDeltaPoints : null,
    },
    courses: dto.courses.map((course) => ({ ...course,
      groupAccuracy: course.hasActivity === false || !course.totalSolved ? null : course.groupAccuracy,
      groupDeltaPoints: course.hasActivity === false || !course.totalSolved ? null : course.groupDeltaPoints,
    })),
  }
}
