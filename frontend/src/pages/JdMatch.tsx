import { useParams, Link } from 'react-router-dom'
import { Briefcase, ArrowLeft } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function JdMatch() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/analysis/${id}`}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Job Description Match</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Resume ID: {id}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Paste Job Description" padding="lg">
          <textarea
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Paste the job description here..."
            disabled
          />
          <Button className="mt-3" disabled icon={<Briefcase className="h-4 w-4" />}>
            Match Resume
          </Button>
        </Card>

        <div className="flex flex-col items-center justify-center text-center py-16">
          <Briefcase className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Paste a job description to compare.
          </p>
        </div>
      </div>
    </div>
  )
}
