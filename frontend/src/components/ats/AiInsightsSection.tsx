import { useState, memo } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { triggerAiTask } from '../../services/ai'
import type { AiTaskType, AiTaskResponse } from '../../types'
import { AI_TASK_LABELS } from '../../types'

interface AiInsightsSectionProps {
  resumeId: string
}

const TASKS: AiTaskType[] = [
  'summary', 'grammar', 'bullets', 'projects',
  'experience', 'verbs', 'tone', 'career', 'rewrite',
]

const AiInsightsSection = memo(function AiInsightsSection({ resumeId }: AiInsightsSectionProps) {
  const [activeTask, setActiveTask] = useState<AiTaskType | null>(null)
  const [result, setResult] = useState<AiTaskResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRunTask(task: AiTaskType) {
    setActiveTask(task)
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await triggerAiTask(resumeId, task)
      if (res.data) {
        setResult(res.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI analysis failed')
    } finally {
      setLoading(false)
    }
  }

  function renderResultContent() {
    if (!result || !result.result) return null

    const data = result.result as Record<string, unknown>

    return (
      <div className="space-y-4 text-sm">
        {Object.entries(data).map(([key, value]) => {
          if (Array.isArray(value)) {
            return (
              <div key={key}>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <ul className="space-y-1.5">
                  {value.map((item, i) => {
                    if (typeof item === 'string') {
                      return (
                        <li key={i} className="text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      )
                    }
                    if (typeof item === 'object' && item !== null) {
                      const obj = item as Record<string, unknown>
                      return (
                        <li key={i} className="text-gray-600 dark:text-gray-400 space-y-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                          {Object.entries(obj).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-gray-500 dark:text-gray-500 text-xs capitalize">{k}: </span>
                              <span>{String(v)}</span>
                            </div>
                          ))}
                        </li>
                      )
                    }
                    return null
                  })}
                </ul>
              </div>
            )
          }
          if (typeof value === 'string' && value.length > 0) {
            return (
              <div key={key}>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 capitalize mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">{value}</p>
              </div>
            )
          }
          return null
        })}
      </div>
    )
  }

  return (
    <Card title="AI Insights" padding="lg">
      <div className="flex flex-wrap gap-2 mb-4">
        {TASKS.map((task) => (
          <Button
            key={task}
            variant={activeTask === task ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleRunTask(task)}
            loading={loading && activeTask === task}
            disabled={loading}
          >
            {AI_TASK_LABELS[task]}
          </Button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && activeTask && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mr-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Running {AI_TASK_LABELS[activeTask]}...
          </span>
        </div>
      )}

      {!loading && result && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {AI_TASK_LABELS[result.task as AiTaskType] || result.task}
          </h3>
          {renderResultContent()}
        </div>
      )}

      {!loading && !result && !error && (
        <div className="text-center py-6">
          <Sparkles className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click a button above to run AI analysis on your resume.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Requires Ollama running locally with a model installed.
          </p>
        </div>
      )}
    </Card>
  )
})

export default AiInsightsSection
