import { Moon, Sun, Info } from 'lucide-react'
import Card from '../components/ui/Card'
import { useAppStore } from '../store/index'
import { APP_NAME } from '../constants'

export default function Settings() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customize your experience.
        </p>
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {theme === 'light' ? 'Light' : 'Dark'} mode
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">About</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {APP_NAME} v1.0.0 &mdash; A local AI-powered resume analyzer.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All data stays on your machine. No internet required.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
