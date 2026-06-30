import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from '@/components/Link'
import { getAllProjects, getProjectBySlug } from '@/lib/content'
import { StatusBadge } from '@/components/StatusBadge'
import { TechChip } from '@/components/TechChip'
import { MDXRenderer } from '@/components/MDXRenderer'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  const getCategoryName = (category?: string) => {
    const categoryMap: Record<string, string> = {
      'web-app': 'Web Application',
      'mobile-app': 'Mobile App',
      'cli-tool': 'CLI Tool',
      library: 'Library/Package',
      infrastructure: 'Infrastructure',
      api: 'API/Backend',
      devops: 'DevOps',
      networking: 'Networking',
      'data-science': 'Data Science',
      ml: 'Machine Learning',
      other: 'Other',
    }
    return category ? (categoryMap[category] || category) : null
  }

  const hasExternalLinks = project.githubUrl || project.demoUrl

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px', boxSizing: 'border-box' }}>
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#8a7a5a] transition-colors hover:text-[#f0a500]"
          aria-label="Back to projects"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
      </div>

      {/* Hero Image */}
      {project.coverImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-[#ffeaa0] md:text-5xl">{project.title}</h1>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status as 'active' | 'paused' | 'archived'} />
          {project.category && (
            <span className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-400">
              {getCategoryName(project.category)}
            </span>
          )}
        </div>

        <p className="text-lg text-gray-400">{project.description}</p>

        {hasExternalLinks && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#d4a843] transition-colors"
                style={{ border: '1px solid rgba(200,134,10,0.4)', background: 'rgba(200,134,10,0.08)' }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
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
          </div>
        )}
      </header>

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-[#ffeaa0]">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechChip key={tech} tech={tech} />
            ))}
          </div>
        </section>
      )}

      {/* Project Body — blog-style article container */}
      <article
        style={{
          position: 'relative',
          background: 'rgba(5, 13, 26, 0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          border: '0.5px solid rgba(200, 134, 10, 0.1)',
          borderRadius: '16px',
          padding: '40px 48px',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          marginBottom: '32px',
        }}
      >
        {/* Gold top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #c8860a, #f0a500, #ffd166, transparent)',
            borderRadius: '16px 16px 0 0',
            opacity: 0.7,
          }}
        />
        <div className="prose dark:prose-invert max-w-none" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
          <MDXRenderer code={project.body.code} />
        </div>
      </article>

      {/* Back to Projects Link */}
      <div className="mt-8 border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#8a7a5a] transition-colors hover:text-[#f0a500]"
          aria-label="Back to projects"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to all projects
        </Link>
      </div>
    </div>
  )
}
