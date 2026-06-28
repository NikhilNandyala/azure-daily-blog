import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectCategories,
} from '@/lib/sanity/projectQueries'
import { ProjectsClient } from '@/components/ProjectsClient'

export const metadata = genPageMetadata({
  title: 'Projects',
  description:
    'Explore my portfolio of projects, from web applications to infrastructure and tools.',
})

// ISR - Revalidate every 1 hour
export const revalidate = 3600

export default async function Projects() {
  // Fetch all projects and featured projects
  const [allProjects, featuredProjects, categories] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(6),
    getProjectCategories(),
  ])

  return (
    <>
      <div className="divide-y divide-white/6">
        <nav aria-label="Breadcrumb" className="mb-4 pt-6">
          <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
            <li>
              <Link href="/" style={{ color: 'var(--muted)' }} className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true" style={{ color: 'var(--border-bright)' }}>/</li>
            <li style={{ color: 'var(--text)' }} aria-current="page">Projects</li>
          </ol>
        </nav>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-body text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-muted text-lg leading-7">
            Explore my portfolio of projects, from web applications to infrastructure and tools.
          </p>
        </div>
        <div className="container py-12">
          {allProjects.length > 0 ? (
            <ProjectsClient
              projects={allProjects}
              featuredProjects={featuredProjects}
              categories={categories}
            />
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted">No projects available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
