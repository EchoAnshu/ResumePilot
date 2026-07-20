import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lightbulb, Target, Users, Briefcase, Sparkles, AlertCircle, HelpCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton'
import { triggerAiTask } from '../services/ai'
import type { AiInterviewResult, AiInterviewQuestion } from '../types'

const categoryConfig: Record<string, { icon: typeof HelpCircle; label: string; color: string }> = {
  general: { icon: HelpCircle, label: 'General Questions', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900' },
  technical: { icon: Target, label: 'Technical Questions', color: 'text-green-600 bg-green-100 dark:bg-green-900' },
  behavioral: { icon: Users, label: 'Behavioral Questions', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900' },
  experienceBased: { icon: Briefcase, label: 'Experience-Based Questions', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900' },
}

export default function InterviewPrep() {
  const { id } = useParams<{ id: string }>()
  const [result, setResult] = useState<AiInterviewResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    loadExisting(id)
  }, [id])

  async function loadExisting(resumeId: string) {
    setLoading(true)
    try {
      const res = await triggerAiTask(resumeId, 'interview')
      if (res.data?.result) {
        setResult(res.data.result as unknown as AiInterviewResult)
      }
    } catch {
      // no existing result
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (!id) return
    setGenerating(true)
    setError(null)
    try {
      const res = await triggerAiTask(id, 'interview')
      if (res.data?.result) {
        setResult(res.data.result as unknown as AiInterviewResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions')
    } finally {
      setGenerating(false)
    }
  }

  function renderCategory(key: string, questions: AiInterviewQuestion[]) {
    const config = categoryConfig[key] || categoryConfig.general
    const Icon = config.icon

    return (
      <Card key={key} padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{config.label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{questions.length} questions</p>
          </div>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {i + 1}. {q.question}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Lightbulb className="h-3 w-3 shrink-0" />
                {q.focus}
              </p>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link
          to={`/analysis/${id}`}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Interview Preparation</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-generated interview questions based on your resume
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          loading={generating}
          icon={<Sparkles className="h-4 w-4" />}
        >
          {result ? 'Regenerate' : 'Generate Questions'}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!result && !loading && !generating && (
        <Card padding="lg">
          <div className="text-center py-16">
            <HelpCircle className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No questions yet</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-6 max-w-md mx-auto">
              Generate personalized interview questions based on your skills, experience, and projects.
            </p>
            <Button onClick={handleGenerate} loading={generating} icon={<Sparkles className="h-4 w-4" />}>
              Generate Questions
            </Button>
          </div>
        </Card>
      )}

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(result).map(([key, questions]) =>
            renderCategory(key, questions as AiInterviewQuestion[])
          )}
        </div>
      )}
    </div>
  )
}
