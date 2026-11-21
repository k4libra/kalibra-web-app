/**
 * Route table of the teacher web app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { APP_ROUTES } from '@/navigation/appRoutes'

const router = createBrowserRouter(APP_ROUTES)

/**
 * Mounts the router of the app.
 */
export function AppRouter() {
  return <RouterProvider router={router} />
}
