import { ReactNode } from 'react'

interface SidebarCardProps {
  title: string
  children: ReactNode
  className?: string
}

const SidebarCard = ({ title, children, className = '' }: SidebarCardProps) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      {children}
    </div>
  )
}

export default SidebarCard