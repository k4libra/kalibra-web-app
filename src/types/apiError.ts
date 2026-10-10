/**
 * Defines typed HTTP failures for services and consumers.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/** Recovery categories of an HTTP or transport failure. */
export type ApiErrorCode = 'invalid-input' | 'unauthorized' | 'forbidden' | 'not-found' | 'conflict' | 'unprocessable' | 'unavailable' | 'network' | 'unexpected'
/** Describes an RFC 7807 response, retained for diagnostics without exposing it as UI copy. */
export interface ProblemDetail {
  /** HTTP status from the server. */
  status?: number
  /** Short server explanation. */
  title?: string
  /** Server explanation, potentially in English. */
  detail?: string
}
/** Carries a stable recovery code and Spanish message. */
export class ApiError extends Error {
  /** Recovery category. */
  readonly code: ApiErrorCode
  /** HTTP status, or zero for a transport failure. */
  readonly status: number
  /** Original server problem. */
  readonly problem?: ProblemDetail
  /** Creates a failure with its HTTP status and original problem. */
  constructor(code: ApiErrorCode, message: string, status: number, problem?: ProblemDetail) {
    super(message); this.name = 'ApiError'; this.code = code; this.status = status; this.problem = problem
  }
}
