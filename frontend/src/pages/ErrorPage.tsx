import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Button from '../components/ui/Button'
import { ROUTES } from '../constants'

export default function ErrorPage() {
  const error = useRouteError()
  let title = 'Something went wrong'
  let message = 'An unexpected error occurred. Please try again.'
  let status = 500

  if (isRouteErrorResponse(error)) {
    status = error.status
    if (error.status === 404) {
      title = 'Page not found'
      message = 'The page you\'re looking for doesn\'t exist or has been moved.'
    } else if (error.status === 403) {
      title = 'Access denied'
      message = 'You don\'t have permission to access this resource.'
    } else {
      title = `${error.status} — Server error`
      message = error.statusText || message
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4 select-none">
        {status}
      </div>
      <AlertTriangle className="h-10 w-10 text-amber-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        {message}
      </p>
      <div className="flex gap-3">
        <Link to={ROUTES.home}>
          <Button icon={<Home className="h-4 w-4" />}>Go Home</Button>
        </Link>
        <Button
          variant="outline"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    </div>
  )
}
