import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

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
          <li style={{ color: 'var(--text)' }} aria-current="page">About</li>
        </ol>
      </nav>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
