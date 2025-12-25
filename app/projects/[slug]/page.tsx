import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from '@/components/Link'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/sanity/projectQueries'
import { StatusBadge } from '@/components/StatusBadge'
import { TechChip } from '@/components/TechChip'
import { SanityPortableText } from '@/components/SanityPortableText'
import { urlForImage } from '@/lib/sanity/imageUrl'

// ISR - Revalidate every 1 hour
export const revalidate = 3600

// Generate static params for all projects
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const ogImage = project.heroImage
    ? urlForImage(project.heroImage).width(1200).height(630).url()
    : undefined

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: 'article',
      publishedTime: project.publishedAt,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  // Get category display name
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'web-app': 'Web Application',
      'mobile-app': 'Mobile App',
      'cli-tool': 'CLI Tool',
      library: 'Library/Package',
      infrastructure: 'Infrastructure',
      api: 'API/Backend',
      devops: 'DevOps',
      'data-science': 'Data Science',
      ml: 'Machine Learning',
      other: 'Other',
    }
    return categoryMap[category] || category
  }

  // Check if any external links exist
  const hasExternalLinks = project.repoUrl || project.liveUrl || project.docsUrl

  return (
    <article className="mx-auto max-w-4xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
          aria-label="Back to projects"
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
          Back to Projects
        </Link>
      </div>

      {/* Hero Image */}
      {project.heroImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={urlForImage(project.heroImage).width(1200).height(675).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{project.title}</h1>

        {/* Status and Category */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.category && (
            <span className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-400">
              {getCategoryName(project.category)}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-lg text-gray-400">{project.shortDescription}</p>

        {/* External Links */}
        {hasExternalLinks && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:border-blue-500 hover:bg-blue-500/20"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-700"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Source Code
              </a>
            )}
            {project.docsUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-700"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Documentation
              </a>
            )}
          </div>
        )}
      </header>

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechChip key={tech} tech={tech} />
            ))}
          </div>
        </section>
      )}

      {/* Project Body */}
      {project.body && (
        <section className="prose prose-invert mb-12 max-w-none">
          <SanityPortableText value={project.body} />
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-white">Gallery</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.gallery.map((image, index) => (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={urlForImage(image).width(800).height(450).url()}
                  alt={`${project.title} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back to Projects Link */}
      <div className="mt-12 border-t border-gray-800 pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
          aria-label="Back to projects"
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
          Back to all projects
        </Link>
      </div>
    </article>
  )
}
