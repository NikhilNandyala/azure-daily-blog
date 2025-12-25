import Link from '@/components/Link'
import Image from 'next/image'
import { ProjectListItem } from '@/lib/sanity/types'
import { StatusBadge } from '@/components/StatusBadge'
import { TechChip } from '@/components/TechChip'

interface ProjectCardProps {
  project: ProjectListItem
}

/**
 * ProjectCard - Displays project information in a card format
 *
 * Features:
 * - Hero image (only if present, no placeholder)
 * - Title and short description
 * - Tech stack chips
 * - Status badge
 * - Category label
 * - Links to project detail page
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const projectUrl = `/projects/${project.slug.current}`

  // Get category display name
  const getCategoryName = (category?: string) => {
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
    return category ? categoryMap[category] || category : null
  }

  const categoryName = getCategoryName(project.category)

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
      {/* Hero Image - Only render if present */}
      {project.heroImage?.asset?.url && (
        <Link href={projectUrl} className="relative block aspect-video w-full overflow-hidden">
          <Image
            src={project.heroImage.asset.url}
            alt={project.heroImage.alt || project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Header: Status + Category */}
        <div className="mb-3 flex items-center gap-2">
          <StatusBadge status={project.status} />
          {categoryName && (
            <span className="text-xs font-medium text-gray-500">{categoryName}</span>
          )}
        </div>

        {/* Title */}
        <Link href={projectUrl}>
          <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
            {project.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="mb-4 flex-1 text-sm text-gray-400">{project.shortDescription}</p>

        {/* Tech Stack - Only render if present */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map((tech, index) => (
              <TechChip key={index} tech={tech} />
            ))}
            {project.techStack.length > 5 && (
              <span className="text-xs text-gray-500">+{project.techStack.length - 5} more</span>
            )}
          </div>
        )}

        {/* Footer: Links */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <Link
            href={projectUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            View project
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* External Links Icons */}
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-blue-400"
                aria-label="Live demo"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-blue-400"
                aria-label="Repository"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
