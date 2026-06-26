interface ReadingTimeBadgeProps {
  minutes: number
}

export function ReadingTimeBadge({ minutes }: ReadingTimeBadgeProps) {
  return (
    <span className="text-muted inline-flex items-center gap-1.5 text-sm">
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
      {minutes} min read
    </span>
  )
}
