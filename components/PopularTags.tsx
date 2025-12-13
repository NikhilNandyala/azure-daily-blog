import Link from '@/components/Link'

export default function PopularTags({ tags }) {
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            {tag} ({count})
          </Link>
        ))}
      </div>
    </div>
  )
}