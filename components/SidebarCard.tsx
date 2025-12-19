import { ReactNode } from 'react'

interface SidebarCardProps {
  title: string
  children: ReactNode
  className?: string
}

const SidebarCard = ({ title, children, className = '' }: SidebarCardProps) => {
  const DEBUG_LAYOUT = false
  return (
    <div
      className={`w-full rounded-lg border border-white/6 bg-[#111827] p-6 ${DEBUG_LAYOUT ? 'ring-2 ring-purple-500' : ''} ${className}`}
    >
      <h3 className="text-body mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}

export default SidebarCard
