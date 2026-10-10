
/**
 * Layout route that wraps the pages of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AppShell, CourseSwitcherDialog } from '@/components/layout'
import { useShellNavigation } from '@/hooks/useShellNavigation'

// feature/auth
import { LogoutConfirmModal } from '@/components/auth'
import { useLogout } from '@/hooks/useLogout'
import { ROUTES } from './routes'

/**
 * Renders the panel frame around the current page, using {@link useShellNavigation} for its data.
 */
export function ShellRoute() {
    const shell = useShellNavigation()

    // feature/auth: logout confirmation
    const navigate = useNavigate()
    const [isLogoutOpen, setIsLogoutOpen] = useState(false)
    const { logout, loading, error, clearError } = useLogout()

    const openLogoutModal = () => {
        clearError()
        setIsLogoutOpen(true)
    }

    const closeLogoutModal = () => {
        if (loading) return

        clearError()
        setIsLogoutOpen(false)
    }

    const confirmLogout = async () => {
        const success = await logout()

        if (success) {
            setIsLogoutOpen(false)
            navigate(ROUTES.signIn, { replace: true })
        }
    }

    return (
        <AppShell
            sidebar={{
                generalLinks: shell.generalLinks,
                courseLinks: shell.courseLinks,
                activeCourse: shell.activeCourse,
                teacher: shell.teacher,
                onSwitchCourse: shell.openSwitcher,
                onSignOut: openLogoutModal,
            }}
        >
            <Outlet />
            <CourseSwitcherDialog
                isOpen={shell.isSwitcherOpen}
                courses={shell.courses}
                activeCourseId={shell.activeCourse?.id ?? null}
                onSelect={shell.selectCourse}
                onClose={shell.closeSwitcher}
            />

            {/* feature/auth: logout confirmation modal */}
            <LogoutConfirmModal
                isOpen={isLogoutOpen}
                loading={loading}
                onConfirm={confirmLogout}
                onCancel={closeLogoutModal}
            />

            {/* feature/auth: logout error */}
            {isLogoutOpen && error && (
                <p role="alert" className="mt-2 text-center text-sm text-red-600">
                    {error}
                </p>
            )}
        </AppShell>
    )
}


//Codigo original

// /**
//  * Layout route that wraps the pages of the teacher panel.
//  *
//  * @author G0nz4loQu3dena
//  * @packageDocumentation
//  */
//
// import { Outlet } from 'react-router'
// import { AppShell, CourseSwitcherDialog } from '@/components/layout'
// import { useShellNavigation } from '@/hooks/useShellNavigation'
//
// /**
//  * Renders the panel frame around the current page, using {@link useShellNavigation} for its data.
//  */
// export function ShellRoute() {
//     const shell = useShellNavigation()
//     return (
//         <AppShell
//             sidebar={{
//                 generalLinks: shell.generalLinks,
//                 courseLinks: shell.courseLinks,
//                 activeCourse: shell.activeCourse,
//                 teacher: shell.teacher,
//                 onSwitchCourse: shell.openSwitcher,
//                 onSignOut: shell.signOut,
//             }}
//         >
//             <Outlet />
//             <CourseSwitcherDialog
//                 isOpen={shell.isSwitcherOpen}
//                 courses={shell.courses}
//                 activeCourseId={shell.activeCourse?.id ?? null}
//                 onSelect={shell.selectCourse}
//                 onClose={shell.closeSwitcher}
//             />
//         </AppShell>
//     )
// }