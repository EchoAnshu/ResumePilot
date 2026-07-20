import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileText, TrendingUp, Award, Clock, Trash2, Upload, Search, Inbox } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton'
import { useAppStore } from '../store/index'
import { useToastStore } from '../store/toastStore'
import { ROUTES } from '../constants'

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (score >= 60) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    dashboard,
    resumes, isLoading, loadResumes, loadDashboard, deleteResume,
  } = useAppStore()
  const addToast = useToastStore((s) => s.addToast)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadResumes()
    loadDashboard()
  }, [loadResumes, loadDashboard])

  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes
    const q = searchQuery.toLowerCase()
    return resumes.filter((r) => r.originalName.toLowerCase().includes(q))
  }, [resumes, searchQuery])

  const latestResume = dashboard?.latestResume || null

  const statCards = [
    {
      label: 'Total Resumes',
      value: String(dashboard?.totalResumes ?? resumes.length),
      icon: FileText,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Analyses',
      value: String(dashboard?.totalAnalyses ?? 0),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Avg ATS Score',
      value: dashboard?.averageAtsScore != null ? `${dashboard.averageAtsScore}` : '--',
      icon: Award,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900',
    },
    {
      label: 'Last Activity',
      value: latestResume
        ? new Date(latestResume.createdAt).toLocaleDateString()
        : '--',
      icon: Clock,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900',
    },
  ]

  const chartData = useMemo(() => {
    if (!dashboard?.scoreHistory?.length) return []
    return [...dashboard.scoreHistory].reverse().map((s) => ({
      name: s.resumeName.length > 15 ? s.resumeName.slice(0, 15) + '...' : s.resumeName,
      score: s.score,
      fullName: s.resumeName,
    }))
  }, [dashboard])

  const handleDelete = useCallback(async (id: string, name: string) => {
    try {
      await deleteResume(id)
      addToast({ message: `"${name}" deleted.`, type: 'success' })
    } catch {
      addToast({ message: 'Failed to delete resume.', type: 'error' })
    }
  }, [deleteResume, addToast])

  const isLoadingInitial = isLoading && resumes.length === 0

  if (isLoadingInitial) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card title="ATS Score History" subtitle="Latest resume ATS scores" padding="lg">
          <div className="h-64" role="img" aria-label="Bar chart showing ATS score history">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}/100`, 'ATS Score']}
                  labelFormatter={(label) => {
                    const item = chartData.find((d) => d.name === label)
                    return item?.fullName || label
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {resumes.length > 0 ? (
        <Card title="Recent Resumes" padding="none">
          <div className="px-6 pt-4 pb-2">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2" role="status">
              {filteredResumes.length} resume{filteredResumes.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search resumes"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredResumes.length > 0 ? (
              filteredResumes.map((resume) => {
                const resumeWithScore = dashboard?.recentResumes?.find((r) => r.id === resume.id)
                return (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {resumeWithScore?.parsedName || resume.originalName}
                          </p>
                          {resumeWithScore?.atsScore != null && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getScoreBg(resumeWithScore.atsScore)}`}>
                              {resumeWithScore.atsScore}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {resume.originalName} &middot; {formatSize(resume.size)} &middot; {new Date(resume.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/analysis/${resume.id}`)}
                        aria-label={`View analysis for ${resume.originalName}`}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4 text-red-500" />}
                        onClick={() => handleDelete(resume.id, resume.originalName)}
                        aria-label={`Delete ${resume.originalName}`}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center" role="status">
                <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No resumes match <strong>"{searchQuery}"</strong>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try a different search term.
                </p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card padding="lg">
          <div className="text-center py-12 animate-fade-in">
            <Inbox className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No resumes yet</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-6 max-w-sm mx-auto">
              Upload your first resume to get started with ATS analysis and AI-powered suggestions.
            </p>
            <Link to={ROUTES.upload}>
              <Button icon={<Upload className="h-4 w-4" />}>Upload Resume</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
