import { allBlogs, allProjects } from 'contentlayer/generated'
import type { Blog, Project } from 'contentlayer/generated'
import { slug as slugify } from 'github-slugger'

export type { Blog, Project }

// ── Posts ─────────────────────────────────────────────────────────────────────

export function getAllPosts(): Blog[] {
  return allBlogs
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(postSlug: string): Blog | undefined {
  return allBlogs.find((p) => p.slug === postSlug)
}

export function getFeaturedPosts(limit = 5): Blog[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .slice(0, limit)
}

export function getPostsByTag(tagSlug: string): Blog[] {
  return getAllPosts().filter((p) =>
    p.tags?.some((t) => slugify(t) === tagSlug)
  )
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): Blog[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.tags?.some((t) => tags.includes(t)))
    .slice(0, limit)
}

export function getMostVisitedPosts(limit = 5): Blog[] {
  return getAllPosts()
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, limit)
}

export function getPaginatedPosts(page: number, limit = 10) {
  const posts = getAllPosts()
  const total = posts.length
  const totalPages = Math.ceil(total / limit)
  const items = posts.slice((page - 1) * limit, page * limit)
  return { posts: items, total, totalPages, page }
}

// ── Tags ──────────────────────────────────────────────────────────────────────

export interface TagInfo {
  name: string
  slug: string
  count: number
}

export function getAllTags(): TagInfo[] {
  const tagMap = new Map<string, { name: string; count: number }>()
  getAllPosts().forEach((post) => {
    post.tags?.forEach((tag) => {
      const s = slugify(tag)
      const existing = tagMap.get(s)
      if (existing) {
        existing.count++
      } else {
        tagMap.set(s, { name: tag, count: 1 })
      }
    })
  })
  return Array.from(tagMap.entries())
    .map(([s, { name, count }]) => ({ name, slug: s, count }))
    .sort((a, b) => b.count - a.count)
}

// ── Projects ──────────────────────────────────────────────────────────────────

export function getAllProjects(): Project[] {
  return allProjects.sort((a, b) =>
    (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  )
}

export function getProjectBySlug(projectSlug: string): Project | undefined {
  return allProjects.find((p) => p.slug === projectSlug)
}

export function getFeaturedProjects(limit = 6): Project[] {
  return getAllProjects().filter((p) => p.featured).slice(0, limit)
}

export function getAllProjectCategories(): string[] {
  return [...new Set(allProjects.map((p) => p.category).filter(Boolean))] as string[]
}
