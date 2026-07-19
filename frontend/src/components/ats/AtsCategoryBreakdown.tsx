import { memo } from 'react'
import type { AtsScore } from '../../types'
import Card from '../ui/Card'

interface AtsCategoryBreakdownProps {
  score: AtsScore
}

interface CategoryBar {
  label: string
  key: keyof AtsScore
  weight: number
}

const categories: CategoryBar[] = [
  { label: 'Contact', key: 'contact', weight: 10 },
  { label: 'Skills', key: 'skills', weight: 20 },
  { label: 'Experience', key: 'experience', weight: 20 },
  { label: 'Projects', key: 'projects', weight: 15 },
  { label: 'Education', key: 'education', weight: 10 },
  { label: 'Keywords', key: 'keywords', weight: 15 },
  { label: 'Formatting', key: 'formatting', weight: 5 },
  { label: 'Readability', key: 'readability', weight: 5 },
]

function getBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

const AtsCategoryBreakdown = memo(function AtsCategoryBreakdown({ score }: AtsCategoryBreakdownProps) {
  return (
    <Card title="Category Breakdown" padding="lg">
      <div className="space-y-4">
        {categories.map((cat) => {
          const value = score[cat.key] as number
          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">{cat.label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {value}/100 &middot; {cat.weight}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
})

export default AtsCategoryBreakdown
