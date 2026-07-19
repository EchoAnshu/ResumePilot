import { FileText, TrendingUp, Award, Clock } from 'lucide-react'
import Card from '../components/ui/Card'

const stats = [
  { label: 'Total Resumes', value: '--', icon: FileText, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900' },
  { label: 'Analyses', value: '--', icon: TrendingUp, color: 'text-green-600 bg-green-100 dark:bg-green-900' },
  { label: 'Avg ATS Score', value: '--', icon: Award, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900' },
  { label: 'Last Activity', value: '--', icon: Clock, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      <Card title="Recent Resumes" padding="lg">
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">
          Upload a resume to see it here.
        </p>
      </Card>
    </div>
  )
}
