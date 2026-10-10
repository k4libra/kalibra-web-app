/**
 * Selects the mock implementation behind the material service contract.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { curricularMaterialMock } from '@/mocks/curricularMaterial.mock'
import type { CurricularMaterialServiceContract } from '@/services/curricularMaterial.contract'

/**
 * Provides material reads and uploads; swap the implementation here when HTTP is available.
 */
export const curricularMaterialService: CurricularMaterialServiceContract = curricularMaterialMock
