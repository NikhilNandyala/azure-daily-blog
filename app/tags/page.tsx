import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { getAllTags } from '@/lib/content'
import { slug as slugify } from 'github-slugger'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export const revalidate = 3600

export default function Page() {
  const tags = getAllTags()

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 pt-4">
        <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
          <li>
            <Link href="/" style={{ color: 'var(--muted)' }} className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden="true" style={{ color: 'var(--border-bright)' }}>/</li>
          <li style={{ color: 'var(--text)' }} aria-current="page">Tags</li>
        </ol>
      </nav>
      <div className="flex flex-col items-start justify-start divide-y divide-white/6 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-body text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tags.length === 0 && (
            <p className="text-muted">No tags found. Add tags in MDX frontmatter to see them here.</p>
          )}
          {tags.map(({ name, slug, count }) => (
            <div key={slug} className="mt-2 mr-5 mb-2">
              <Link
                href={`/tags/${slug}`}
                className="text-accent hover:text-primary-300 mr-3 text-sm font-medium uppercase"
              >
                {name}
              </Link>
              <Link
                href={`/tags/${slug}`}
                className="text-muted -ml-2 text-sm font-semibold uppercase"
                aria-label={`View posts tagged ${name}`}
              >
                {` (${count})`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
