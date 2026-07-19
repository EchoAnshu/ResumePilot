import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { ROUTES } from '../constants'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4 select-none">
        404
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Page not found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to={ROUTES.home}>
          <Button icon={<Home className="h-4 w-4" />}>Go Home</Button>
        </Link>
        <Button
          variant="ghost"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}
