import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import Sidebar from '../components/ui/Sidebar'
import ToastContainer from '../components/ui/Toast'

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
