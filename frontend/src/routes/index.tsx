import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '../constants'
import RootLayout from '../layouts/RootLayout'

const Home = lazy(() => import('../pages/Home'))
const ResumeUpload = lazy(() => import('../pages/ResumeUpload'))
const ResumeAnalysis = lazy(() => import('../pages/ResumeAnalysis'))
const Settings = lazy(() => import('../pages/Settings'))
const About = lazy(() => import('../pages/About'))
const NotFound = lazy(() => import('../pages/NotFound'))

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-skeleton bg-gray-200 dark:bg-gray-700 rounded-lg h-8 w-48" />
      </div>
    }>
      {children}
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <Lazy><Home /></Lazy> },
      { path: ROUTES.upload, element: <Lazy><ResumeUpload /></Lazy> },
      { path: ROUTES.analysis, element: <Lazy><ResumeAnalysis /></Lazy> },
      { path: ROUTES.settings, element: <Lazy><Settings /></Lazy> },
      { path: ROUTES.about, element: <Lazy><About /></Lazy> },
      { path: '*', element: <Lazy><NotFound /></Lazy> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
