interface StatusBadgeProps {
  status: 'active' | 'paused' | 'archived'
  size?: 'sm' | 'md'
}

/**
 * StatusBadge - Displays project status with appropriate styling
 */
export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  const statusConfig = {
    active: {
      label: 'Active',
      classes: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
    paused: {
      label: 'Paused',
      classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ),
    },
    archived: {
      label: 'Archived',
      classes: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      icon: (
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />
        </svg>
      ),
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.classes} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  )
}
