/**
 * Course indicators service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { indicatorsMock } from '@/mocks/indicators.mock'
import type { IndicatorsContract } from './indicators.contract'

/**
 * Reads and exports the indicators of a course.
 *
 * @remarks
 * Points to the simulated implementation until the backend integration is built.
 */
export const indicatorsService: IndicatorsContract = indicatorsMock
