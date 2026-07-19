interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: 'indigo' | 'green' | 'red' | 'amber'
  size?: 'sm' | 'md'
  className?: string
}

const colorStyles = {
  indigo: 'bg-indigo-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
  amber: 'bg-amber-600',
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'indigo',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`space-y-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-700 dark:text-gray-300">{label}</span>}
          {showValue && (
            <span className="text-gray-500 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        <div
          className={`rounded-full transition-all duration-500 ease-out ${colorStyles[color]} ${sizeStyles[size]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
