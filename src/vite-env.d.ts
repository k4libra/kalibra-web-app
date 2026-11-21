/**
 * Declares public build-time configuration.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Public API prefix; defaults to the same-origin Vite proxy. */
  readonly VITE_API_BASE_URL?: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
