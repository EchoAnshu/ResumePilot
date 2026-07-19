import { memo } from 'react'
import { Lightbulb, Sparkles, AlertTriangle } from 'lucide-react'
import type { AtsScore } from '../../types'
import Card from '../ui/Card'

interface AtsInsightsProps {
  score: AtsScore
}

const AtsInsights = memo(function AtsInsights({ score }: AtsInsightsProps) {
  return (
    <div className="space-y-6">
      <Card title="Strong Areas" padding="lg">
        {score.strongAreas.length > 0 ? (
          <ul className="space-y-2">
            {score.strongAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No strong areas identified yet.</p>
        )}
      </Card>

      <Card title="Areas to Improve" padding="lg">
        {score.weakAreas.length > 0 ? (
          <ul className="space-y-2">
            {score.weakAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No weak areas identified.</p>
        )}
      </Card>

      <Card title="Recommendations" padding="lg">
        {score.recommendations.length > 0 ? (
          <ul className="space-y-2">
            {score.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No recommendations yet.</p>
        )}
      </Card>
    </div>
  )
})

export default AtsInsights
