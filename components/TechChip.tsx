interface TechChipProps {
  tech: string
  size?: 'sm' | 'md'
}

/**
 * TechChip - Displays technology/skill chip with dark theme styling
 */
export function TechChip({ tech, size = 'sm' }: TechChipProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-md border border-blue-500/30 bg-blue-500/10 font-medium text-blue-400 ${sizeClasses}`}
    >
      {tech}
    </span>
  )
}
