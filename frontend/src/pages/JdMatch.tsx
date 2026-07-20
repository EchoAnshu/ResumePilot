import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Briefcase, ArrowLeft, CheckCircle2, XCircle, Lightbulb,
  AlertCircle, Loader2, Search,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton'
import { matchJd, fetchJdMatch } from '../services/jd'
import type { JdMatchResult } from '../types'

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function JdMatch() {
  const { id } = useParams<{ id: string }>()
  const [jdText, setJdText] = useState('')
  const [result, setResult] = useState<JdMatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    loadExisting(id)
  }, [id])

  async function loadExisting(resumeId: string) {
    setLoading(true)
    try {
      const res = await fetchJdMatch(resumeId)
      if (res.data) {
        setResult(res.data)
        setJdText(res.data.jdText)
      }
    } catch {
      // no existing match
    } finally {
      setLoading(false)
    }
  }

  async function handleMatch() {
    if (!id || !jdText.trim()) return
    setMatching(true)
    setError(null)
    try {
      const res = await matchJd(id, jdText)
      if (res.data) {
        setResult(res.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JD match failed')
    } finally {
      setMatching(false)
    }
  }

  const isValid = jdText.trim().length >= 10

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid lg:grid-cols-2 gap-6">
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
        <div>
          <h1 className="text-2xl font-bold">Job Description Match</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Compare your resume against a job description
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Paste Job Description" padding="lg">
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            placeholder="Paste the full job description here..."
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {jdText.length} characters {!isValid && jdText.length > 0 && '(min 10 required)'}
            </span>
            <Button
              onClick={handleMatch}
              loading={matching}
              disabled={!isValid}
              icon={<Search className="h-4 w-4" />}
            >
              Match Resume
            </Button>
          </div>
        </Card>

        {!result && !loading && (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Briefcase className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Paste a job description and click "Match Resume" to see how your resume compares.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <Card title="Match Score" padding="lg">
              <div className="text-center py-4">
                <div className={classNames(
                  'text-5xl font-bold mb-2',
                  result.matchPercentage >= 70 ? 'text-green-500' :
                  result.matchPercentage >= 40 ? 'text-yellow-500' : 'text-red-500',
                )}>
                  {result.matchPercentage}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Overall Match
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {result.matchingSkills.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Skills Matched</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {result.missingSkills.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Skills Missing</p>
                </div>
              </div>
            </Card>

            {result.suggestions.length > 0 && (
              <Card title="Suggestions" padding="lg">
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Lightbulb className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card title="Matching Skills" padding="lg">
            {result.matchingSkills.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No matching skills found.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <Card title="Missing Skills" padding="lg">
            {result.missingSkills.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No missing skills — great match!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                  >
                    <XCircle className="h-3 w-3" />
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
