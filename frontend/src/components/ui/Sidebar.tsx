import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Upload, FileText, Settings, Info, X } from 'lucide-react'
import { ROUTES, APP_NAME } from '../../constants'
import { useKeyboardShortcut } from '../../hooks/useShortcuts'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const links = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard, shortcut: 'Ctrl+1' },
  { to: '/upload', label: 'Upload Resume', icon: Upload, shortcut: 'Ctrl+2' },
  { to: '/analysis/placeholder', label: 'Analysis', icon: FileText },
  { to: ROUTES.settings, label: 'Settings', icon: Settings, shortcut: 'Ctrl+3' },
  { to: ROUTES.about, label: 'About', icon: Info, shortcut: 'Ctrl+4' },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  useKeyboardShortcut(['Ctrl+1'], () => navigate(ROUTES.dashboard))
  useKeyboardShortcut(['Ctrl+2'], () => navigate(ROUTES.upload))
  useKeyboardShortcut(['Ctrl+3'], () => navigate(ROUTES.settings))
  useKeyboardShortcut(['Ctrl+4'], () => navigate(ROUTES.about))
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-indigo-600">{APP_NAME}</span>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.dashboard}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              <div className="flex-1">{link.label}</div>
              {link.shortcut && (
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden md:inline">
                  {link.shortcut}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
