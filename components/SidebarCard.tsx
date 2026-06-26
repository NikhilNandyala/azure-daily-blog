import { ReactNode } from 'react'

interface SidebarCardProps {
  title: string
  children: ReactNode
  className?: string
}

const SidebarCard = ({ title, children, className = '' }: SidebarCardProps) => {
  return (
    <div
      className={`top-gradient-line relative w-full overflow-hidden rounded-xl p-6 ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <h3 className="text-body mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}

export default SidebarCard
