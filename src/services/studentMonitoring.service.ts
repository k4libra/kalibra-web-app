/**
 * Student monitoring service backed by the simulated endpoints.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { StudentMonitoringServiceContract } from '@/services/studentMonitoring.contract'
import { studentMonitoringMock } from '@/mocks/studentMonitoring.mock'

/** Exposes monitoring through a replaceable contract implemented by the mock endpoints. */
export const studentMonitoringService: StudentMonitoringServiceContract = studentMonitoringMock
