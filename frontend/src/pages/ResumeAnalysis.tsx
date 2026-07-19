import { useParams } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function ResumeAnalysis() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resume Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Analysis ID: {id}
        </p>
      </div>

      <Card title="No Analysis Yet" padding="lg">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Run ATS analysis to evaluate your resume
          </p>
          <Button disabled>Analyze Resume</Button>
        </div>
      </Card>
    </div>
  )
}
