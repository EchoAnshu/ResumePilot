import { useEffect, useState } from 'react'
import { Moon, Sun, Info, Trash2, Cpu, Server, HardDrive } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAppStore } from '../store/index'
import { useToastStore } from '../store/toastStore'
import { fetchSettings, updateSetting, clearCache } from '../services/settings'
import type { AppSettings } from '../types'
import { APP_NAME } from '../constants'

export default function Settings() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const addToast = useToastStore((s) => s.addToast)
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [aiModel, setAiModel] = useState('')
  const [ollamaHost, setOllamaHost] = useState('')
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    fetchSettings().then((res) => {
      if (res.data) {
        setSettings(res.data)
        setAiModel(res.data.aiModel)
        setOllamaHost(res.data.ollamaHost)
      }
    }).catch(() => {})
  }, [])

  async function handleSaveAiModel() {
    try {
      const res = await updateSetting('aiModel', aiModel)
      if (res.data) setSettings(res.data)
      addToast({ message: 'AI model updated.', type: 'success' })
    } catch {
      addToast({ message: 'Failed to update AI model.', type: 'error' })
    }
  }

  async function handleSaveOllamaHost() {
    try {
      const res = await updateSetting('ollamaHost', ollamaHost)
      if (res.data) setSettings(res.data)
      addToast({ message: 'Ollama host updated.', type: 'success' })
    } catch {
      addToast({ message: 'Failed to update Ollama host.', type: 'error' })
    }
  }

  async function handleClearCache() {
    setClearing(true)
    try {
      const res = await clearCache()
      addToast({ message: `Cache cleared: ${((res.data?.freedBytes ?? 0) / 1024).toFixed(1)} KB freed.`, type: 'success' })
    } catch {
      addToast({ message: 'Failed to clear cache.', type: 'error' })
    } finally {
      setClearing(false)
    }
  }

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

      <Card title="AI Model" padding="lg" icon={<Cpu className="h-5 w-5 text-indigo-500" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model Name
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="qwen2.5:7b"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Ollama model name (e.g., qwen2.5:7b, llama3.2:3b, mistral:7b)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ollama Host
            </label>
            <input
              type="text"
              value={ollamaHost}
              onChange={(e) => setOllamaHost(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="http://localhost:11434"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Ollama API endpoint URL
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveAiModel}>
              Save Model
            </Button>
            <Button size="sm" variant="outline" onClick={handleSaveOllamaHost}>
              Save Host
            </Button>
          </div>
        </div>
      </Card>

      <Card padding="lg" icon={<HardDrive className="h-5 w-5 text-indigo-500" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Storage</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Storage path: {settings?.storagePath || 'default'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Clear Cache</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remove temporary reports and export files
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="h-4 w-4 text-red-500" />}
              onClick={handleClearCache}
              loading={clearing}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <Card padding="lg" icon={<Server className="h-5 w-5 text-indigo-500" />}>
        <div className="space-y-2">
          <p className="font-medium text-gray-900 dark:text-gray-100">Analysis Settings</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Auto-analyze after upload</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically run ATS analysis when a resume is uploaded
              </p>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.autoAnalyze === 'true' ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.autoAnalyze === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
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
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Built with Express, React, Prisma, SQLite, Ollama
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
