import { Link } from 'react-router-dom'
import { Upload, BarChart3, LayoutDashboard } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ROUTES, APP_NAME } from '../constants'

const features = [
  {
    icon: Upload,
    title: 'Resume Upload',
    description: 'Upload PDF or DOCX resumes with drag & drop support.',
  },
  {
    icon: BarChart3,
    title: 'ATS Scoring',
    description: 'Get detailed ATS compatibility scores with category breakdown.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'View statistics, score history, and manage all your resumes.',
  },
]

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-indigo-600">{APP_NAME}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Your local AI-powered resume analyzer. Upload, analyze, and improve your resume
          — all offline with zero cloud dependency.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={ROUTES.upload}>
            <Button size="lg" icon={<Upload className="h-5 w-5" />}>
              Upload Resume
            </Button>
          </Link>
          <Link to={ROUTES.dashboard}>
            <Button size="lg" variant="outline" icon={<LayoutDashboard className="h-5 w-5" />}>
              Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature) => (
          <Card key={feature.title} padding="lg" hover>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
