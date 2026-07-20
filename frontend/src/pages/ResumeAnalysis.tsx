import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BarChart3, RefreshCw, Briefcase, Download, FileJson, FileText, File as FilePdf, AlertCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton'
import AtsScoreCard from '../components/ats/AtsScoreCard'
import AtsCategoryBreakdown from '../components/ats/AtsCategoryBreakdown'
import AtsInsights from '../components/ats/AtsInsights'
import AiInsightsSection from '../components/ats/AiInsightsSection'
import { fetchAnalysis, triggerAnalysis } from '../services/analysis'
import { fetchResume } from '../services/resume'
import { downloadExport } from '../services/export'
import type { AtsScore, ParsedResume } from '../types'

export default function ResumeAnalysis() {
  const { id } = useParams<{ id: string }>()
  const [atsScore, setAtsScore] = useState<AtsScore | null>(null)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    loadAnalysis(id)
  }, [id])

  async function loadAnalysis(resumeId: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAnalysis(resumeId)
      if (res.data?.atsScore) {
        setAtsScore(res.data.atsScore)
      }

      const resumeRes = await fetchResume(resumeId)
      if (resumeRes.data?.parsedData) {
        setParsedResume(JSON.parse(resumeRes.data.parsedData) as ParsedResume)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis')
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyze() {
    if (!id) return
    setAnalyzing(true)
    setError(null)
    try {
      const res = await triggerAnalysis(id)
      if (res.data?.atsScore) {
        setAtsScore(res.data.atsScore)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  if (error && !atsScore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-500 mb-2 font-medium">Failed to load analysis</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <Button onClick={() => id && loadAnalysis(id)}>Retry</Button>
      </div>
    )
  }

  if (!atsScore) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Analysis ID: {id}
          </p>
        </div>
        <Card title="No Analysis Yet" padding="lg">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Run ATS analysis to evaluate your resume
            </p>
            <Button onClick={handleAnalyze} loading={analyzing} icon={<RefreshCw className="h-4 w-4" />}>
              Analyze Resume
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {parsedResume?.name ? `${parsedResume.name} — ` : ''}ATS Score: {atsScore.overall}/100
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          loading={analyzing}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Re-analyze
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <AtsScoreCard overall={atsScore.overall} />
            <AtsCategoryBreakdown score={atsScore} />
          </div>

          {parsedResume && (
            <Card title="Parsed Resume" padding="lg">
              <div className="space-y-4 text-sm">
                {parsedResume.name && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Name: </span>
                    <span className="text-gray-900 dark:text-gray-100">{parsedResume.name}</span>
                  </div>
                )}
                {parsedResume.email && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email: </span>
                    <span className="text-gray-900 dark:text-gray-100">{parsedResume.email}</span>
                  </div>
                )}
                {parsedResume.phone && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Phone: </span>
                    <span className="text-gray-900 dark:text-gray-100">{parsedResume.phone}</span>
                  </div>
                )}
                {parsedResume.skills.length > 0 && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Skills: </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {parsedResume.skills.slice(0, 10).join(', ')}
                      {parsedResume.skills.length > 10 && ` +${parsedResume.skills.length - 10} more`}
                    </span>
                  </div>
                )}
                <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>Experience: {parsedResume.experience.length} entries</span>
                  <span>Education: {parsedResume.education.length} entries</span>
                  <span>Projects: {parsedResume.projects.length} entries</span>
                  <span>Certifications: {parsedResume.certifications.length}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <AtsInsights score={atsScore} />
          {id && <AiInsightsSection resumeId={id} />}
          {id && (
            <Card title="Quick Actions" padding="lg">
              <div className="space-y-3">
              <Link
                to={`/analysis/${id}/jd-match`}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-sm"
              >
                <Briefcase className="h-5 w-5 text-indigo-500 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Job Description Match</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Compare your resume with a job description</p>
                </div>
              </Link>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1" id="export-label">
                  <Download className="h-3 w-3" /> Export Report
                </p>
                <div className="flex gap-2" role="group" aria-labelledby="export-label">
                  <button
                    onClick={() => downloadExport(id!, 'json')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    aria-label="Export as JSON"
                  >
                    <FileJson className="h-3.5 w-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => downloadExport(id!, 'markdown')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    aria-label="Export as Markdown"
                  >
                    <FileText className="h-3.5 w-3.5" /> MD
                  </button>
                  <button
                    onClick={() => downloadExport(id!, 'pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    aria-label="Export as PDF"
                  >
                    <FilePdf className="h-3.5 w-3.5" /> PDF
                  </button>
                </div>
              </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
