/**
 * Reads administrator-only institutional indicators and anonymized CSV.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { InstitutionalIndicatorsContract } from '@/services/institutionalIndicators.contract'
import { apiClient } from '@/services/http/apiClient'
import { downloadCsv } from '@/services/http/download'
import { mapInstitutionalIndicators } from '@/services/mappers/institutional.mapper'
import type { CriticalSubtopic, InstitutionalIndicatorsDto } from '@/types/institutionalIndicators'
/** Reads only administrator endpoints; never requests teacher-owned resources. */
export const institutionalIndicatorsService: InstitutionalIndicatorsContract = {
  getIndicators: async (signal) => mapInstitutionalIndicators(await apiClient.get<InstitutionalIndicatorsDto>('/institutional-indicators', { signal })),
  getCriticalSubtopics: (signal) => apiClient.get<CriticalSubtopic[]>('/institutional-indicators/critical-subtopics', { signal }),
  exportIndicators: (signal) => downloadCsv('/institutional-indicators', 'indicadores-institucionales.csv', signal),
}
