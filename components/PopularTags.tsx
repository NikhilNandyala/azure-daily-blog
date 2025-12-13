import TagChip from '@/components/TagChip'
import SidebarCard from '@/components/SidebarCard'

interface PopularTagsProps {
  tags: Record<string, number>
}

export default function PopularTags({ tags }: PopularTagsProps) {
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <SidebarCard title="Popular Tags">
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(([tag, count]) => (
          <TagChip key={tag} text={tag} count={count} />
        ))}
      </div>
    </SidebarCard>
  )
}