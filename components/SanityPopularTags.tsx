import Link from 'next/link'
import SidebarCard from '@/components/SidebarCard'
import type { Tag } from '@/lib/sanity/types'

interface SanityPopularTagsProps {
  tags: Array<{ tag: Tag; count: number }>
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
        {displayTags.map(({ tag, count }) => {
          const isAzureTag = tag.title.toLowerCase().includes('azure')
          return (
            <Link
              key={tag._id}
              href={`/tags/${tag.slug.current}`}
              className={`tag-pill${isAzureTag ? ' tag-pill--azure' : ''}`}
            >
              {tag.title} ({count})
            </Link>
          )
        })}
      </div>
    </SidebarCard>
  )
}
