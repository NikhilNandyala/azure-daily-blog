import Link from 'next/link'
import SidebarCard from '@/components/SidebarCard'
import type { TagInfo } from '@/lib/content'

interface SanityPopularTagsProps {
  tags: TagInfo[]
  limit?: number
}

export default function SanityPopularTags({ tags, limit = 10 }: SanityPopularTagsProps) {
  const displayTags = tags.slice(0, limit)

  if (displayTags.length === 0) {
    return (
      <SidebarCard title="Popular Tags">
        <p className="text-muted text-sm">No tags available yet.</p>
      </SidebarCard>
    )
  }

  return (
    <SidebarCard title="Popular Tags">
      <div className="flex w-full min-w-0 flex-wrap gap-2 overflow-hidden">
        {displayTags.map(({ name, slug, count }) => {
          const isAzureTag = name.toLowerCase().includes('azure')
          return (
            <Link
              key={slug}
              href={`/tags/${slug}`}
              className={`tag-pill${isAzureTag ? ' tag-pill--azure' : ''}`}
            >
              {name} ({count})
            </Link>
          )
        })}
      </div>
    </SidebarCard>
  )
}
