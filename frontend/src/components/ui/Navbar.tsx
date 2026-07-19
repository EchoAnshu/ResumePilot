import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { ROUTES, APP_NAME } from '../../constants'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  onSidebarToggle: () => void
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onSidebarToggle}
            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg lg:hidden transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to={ROUTES.home} className="text-xl font-bold text-indigo-600">
            {APP_NAME}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
