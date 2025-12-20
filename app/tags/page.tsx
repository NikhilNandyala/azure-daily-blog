import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { getTagsWithCounts } from '@/lib/sanity/queries'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

// Revalidate every hour
export const revalidate = 3600

export default async function Page() {
  const tagsWithCounts = await getTagsWithCounts()

  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-white/6 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-body text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagsWithCounts.length === 0 && (
            <p className="text-muted">No tags found. Add tags in Sanity to see them here.</p>
          )}
          {tagsWithCounts.map(({ tag, count }) => {
            return (
              <div key={tag._id} className="mt-2 mr-5 mb-2">
                <Link
                  href={`/tags/${tag.slug.current}`}
                  className="text-accent hover:text-primary-300 mr-3 text-sm font-medium uppercase"
                >
                  {tag.title}
                </Link>
                <Link
                  href={`/tags/${tag.slug.current}`}
                  className="text-muted -ml-2 text-sm font-semibold uppercase"
                  aria-label={`View posts tagged ${tag.title}`}
                >
                  {` (${count})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
