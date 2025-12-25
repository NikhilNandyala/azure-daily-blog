'use client'

import { useState, useMemo } from 'react'
import { ProjectListItem } from '@/lib/sanity/types'
import { ProjectCard } from '@/components/ProjectCard'

interface ProjectsClientProps {
  projects: ProjectListItem[]
  featuredProjects: ProjectListItem[]
  categories: string[]
}

/**
 * ProjectsClient - Client-side filtering and display for projects
 */
export function ProjectsClient({ projects, featuredProjects, categories }: ProjectsClientProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status filter
      if (statusFilter !== 'all' && project.status !== statusFilter) {
        return false
      }

      // Category filter
      if (categoryFilter !== 'all' && project.category !== categoryFilter) {
        return false
      }

      // Search filter (title + tech stack)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const titleMatch = project.title.toLowerCase().includes(query)
        const techMatch = project.techStack?.some((tech) => tech.toLowerCase().includes(query))
        if (!titleMatch && !techMatch) {
          return false
        }
      }

      return true
    })
  }, [projects, statusFilter, categoryFilter, searchQuery])

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

  return (
    <div className="space-y-8">
      {/* Featured Projects Section - Only show if any exist */}
      {featuredProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Featured Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h3 className="text-sm font-semibold text-gray-400">Filter Projects</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-400">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-400">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-400">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400"
              >
                Status: {statusFilter}
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            {categoryFilter !== 'all' && (
              <button
                onClick={() => setCategoryFilter('all')}
                className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400"
              >
                {getCategoryName(categoryFilter)}
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400"
              >
                &quot;{searchQuery}&quot;
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-500">No projects match your filters.</p>
          <button
            onClick={() => {
              setStatusFilter('all')
              setCategoryFilter('all')
              setSearchQuery('')
            }}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
