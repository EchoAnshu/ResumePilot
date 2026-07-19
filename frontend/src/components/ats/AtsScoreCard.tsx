import { memo } from 'react'
import Card from '../ui/Card'

interface AtsScoreCardProps {
  overall: number
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500'
  if (score >= 60) return 'text-amber-500'
  return 'text-red-500'
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return 'stroke-emerald-500'
  if (score >= 60) return 'stroke-amber-500'
  return 'stroke-red-500'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Needs Improvement'
  return 'Poor'
}

const AtsScoreCard = memo(function AtsScoreCard({ overall }: AtsScoreCardProps) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (overall / 100) * circumference

  return (
    <Card title="ATS Score" padding="lg">
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={getScoreRingColor(overall)}
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(overall)}`}>
              {overall}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">/ 100</span>
          </div>
        </div>
        <span className={`mt-3 text-sm font-medium ${getScoreColor(overall)}`}>
          {getScoreLabel(overall)}
        </span>
      </div>
    </Card>
  )
})

export default AtsScoreCard
