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
        <div className="mb-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
            aria-label="Back to home page"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
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
