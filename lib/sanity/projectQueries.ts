import { getPublicClient, sanityConfigured } from './client'
import { Project, ProjectListItem } from './types'

/**
 * GROQ Queries for fetching Project content from Sanity
 */

const PROJECT_LIST_FIELDS = `
  _id,
  _createdAt,
  title,
  slug,
  shortDescription,
  heroImage {
    asset -> { url },
    alt,
    hotspot
  },
  techStack,
  category,
  status,
  repoUrl,
  liveUrl,
  docsUrl,
  featured,
  publishedAt
`

const PROJECT_DETAIL_FIELDS = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  shortDescription,
  body,
  heroImage {
    asset -> { url },
    alt,
    hotspot,
    crop
  },
  gallery[] {
    asset -> { url },
    alt,
    caption,
    hotspot,
    crop
  },
  techStack,
  category,
  status,
  repoUrl,
  liveUrl,
  docsUrl,
  featured,
  publishedAt
`

/**
 * Get all projects sorted by publishedAt (or _createdAt fallback)
 */
export async function getAllProjects(
  limit: number = 100,
  offset: number = 0
): Promise<ProjectListItem[]> {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const query = `*[_type == "project"] | order(publishedAt desc, _createdAt desc)[${offset}...${offset + limit}] { ${PROJECT_LIST_FIELDS} }`
    const projects = await client.fetch<ProjectListItem[]>(query)
    return projects || []
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return []
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(limit: number = 6): Promise<ProjectListItem[]> {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const query = `*[_type == "project" && featured == true] | order(publishedAt desc, _createdAt desc)[0...${limit}] { ${PROJECT_LIST_FIELDS} }`
    const projects = await client.fetch<ProjectListItem[]>(query)
    return projects || []
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!sanityConfigured) return null

  const client = getPublicClient()
  if (!client) return null

  try {
    const query = `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_DETAIL_FIELDS} }`
    const project = await client.fetch<Project | null>(query, { slug })
    return project
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<{ slug: { current: string } }[]> {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const query = `*[_type == "project"] { slug }`
    const slugs = await client.fetch<{ slug: { current: string } }[]>(query)
    return slugs || []
  } catch (error) {
    console.error('Error fetching project slugs:', error)
    return []
  }
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(
  status: 'active' | 'paused' | 'archived',
  limit: number = 100
): Promise<ProjectListItem[]> {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const query = `*[_type == "project" && status == $status] | order(publishedAt desc, _createdAt desc)[0...${limit}] { ${PROJECT_LIST_FIELDS} }`
    const projects = await client.fetch<ProjectListItem[]>(query, { status })
    return projects || []
  } catch (error) {
    console.error(`Error fetching ${status} projects:`, error)
    return []
  }
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(
  category: string,
  limit: number = 100
): Promise<ProjectListItem[]> {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const query = `*[_type == "project" && category == $category] | order(publishedAt desc, _createdAt desc)[0...${limit}] { ${PROJECT_LIST_FIELDS} }`
    const projects = await client.fetch<ProjectListItem[]>(query, { category })
    return projects || []
  } catch (error) {
    console.error(`Error fetching projects by category ${category}:`, error)
    return []
  }
}

/**
 * Get unique categories from all projects
 */
export async function getProjectCategories(): Promise<string[]> {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const query = `array::unique(*[_type == "project" && defined(category)].category)`
    const categories = await client.fetch<string[]>(query)
    return categories || []
  } catch (error) {
    console.error('Error fetching project categories:', error)
    return []
  }
}
