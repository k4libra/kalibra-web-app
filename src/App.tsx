/**
 * Root component: global providers and navigation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { ToastProvider } from '@/context/ToastContext'
import { AppRouter } from '@/navigation/AppRouter'

/**
 * Mounts the shared providers and the router.
 */
export default function App() {
  return (
    <ToastProvider>
      <ActiveCourseProvider>
        <AppRouter />
      </ActiveCourseProvider>
    </ToastProvider>
  )
}
