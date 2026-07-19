import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '../constants'
import RootLayout from '../layouts/RootLayout'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import ResumeUpload from '../pages/ResumeUpload'
import ResumeAnalysis from '../pages/ResumeAnalysis'
import JdMatch from '../pages/JdMatch'
import Settings from '../pages/Settings'
import About from '../pages/About'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <Home /> },
      { path: ROUTES.dashboard, element: <Dashboard /> },
      { path: ROUTES.upload, element: <ResumeUpload /> },
      { path: ROUTES.analysis, element: <ResumeAnalysis /> },
      { path: ROUTES.jdMatch, element: <JdMatch /> },
      { path: ROUTES.settings, element: <Settings /> },
      { path: ROUTES.about, element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
