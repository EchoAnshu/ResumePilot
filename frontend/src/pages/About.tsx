import { Shield, Cpu, Database, Globe } from 'lucide-react'
import Card from '../components/ui/Card'
import { APP_NAME } from '../constants'

const highlights = [
  {
    icon: Cpu,
    title: '100% Local',
    description: 'All processing happens on your machine. No data leaves your computer.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Zero cloud dependency. Your resume never uploads to any external server.',
  },
  {
    icon: Database,
    title: 'SQLite Storage',
    description: 'All data stored locally using SQLite. Full control over your information.',
  },
  {
    icon: Globe,
    title: 'Offline Ready',
    description: 'Works without internet. Use it anywhere, anytime.',
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{APP_NAME}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Version 1.0.0 — Local AI Resume Analyzer
        </p>
      </div>

      <Card padding="lg">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {APP_NAME} is a fully local AI-powered resume analyzer that helps you evaluate
          and improve your resumes using a locally running Large Language Model (LLM).
        </p>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {highlights.map((item) => (
          <Card key={item.title} padding="md" hover>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg shrink-0">
                <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
