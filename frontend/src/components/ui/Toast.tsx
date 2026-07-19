import { useToastStore, type ToastType } from '../../store/toastStore'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styleMap: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-950 dark:border-green-600 dark:text-green-200',
  error: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-950 dark:border-red-600 dark:text-red-200',
  warning: 'bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-950 dark:border-amber-600 dark:text-amber-200',
  info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-950 dark:border-blue-600 dark:text-blue-200',
}

function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type]
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg ${styleMap[toast.type]}`}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
