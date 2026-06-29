interface TechChipProps {
  tech: string
  size?: 'sm' | 'md'
}

/**
 * TechChip - Displays technology/skill chip with dark theme styling
 */
export function TechChip({ tech, size = 'sm' }: TechChipProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-3 py-1' : 'text-sm px-3 py-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${sizeClasses}`}
      style={{ border: '1px solid rgba(200,134,10,0.35)', background: 'rgba(200,134,10,0.08)', color: '#d4a843' }}
    >
      {tech}
    </span>
  )
}
