import { SanityClient } from '@sanity/client'
import { Post, PostListItem, Tag, Author, SiteSettings } from './types'

/**
 * GROQ Queries for fetching Sanity content
 * Supports both published and draft perspectives based on client passed
 */

const POST_LIST_FIELDS = `
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  coverImage {
    asset -> { url },
    hotspot
  },
  tags[] -> { _id, title, slug },
  author -> { name, image { asset -> { url }, hotspot } },
  publishedAt,
  featured,
  membersOnly,
  status
`

const POST_DETAIL_FIELDS = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  excerpt,
  body,
  coverImage {
    asset -> { url },
    hotspot,
    crop
  },
  tags[] -> { _id, title, slug },
  author -> { _id, name, bio, image { asset -> { url }, hotspot } },
  publishedAt,
  seoTitle,
  seoDescription,
  canonicalUrl,
  featured,
  membersOnly,
  status
`

/**
 * Get latest posts with optional draft support
 */
export async function getLatestPosts(
  client: SanityClient,
  limit: number = 5
): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "published"] | order(publishedAt desc)[0...${limit}] { ${POST_LIST_FIELDS} }`
  return await client.fetch(query)
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(
  client: SanityClient,
  limit: number = 3
): Promise<PostListItem[]> {
  const query = `*[_type == "post" && featured == true && status == "published"] | order(publishedAt desc)[0...${limit}] { ${POST_LIST_FIELDS} }`
  return await client.fetch(query)
}

/**
 * Get all published posts with pagination
 */
export async function getAllPublishedPosts(
  client: SanityClient,
  limit: number = 10,
  offset: number = 0
): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "published"] | order(publishedAt desc)[${offset}...${offset + limit}] { ${POST_LIST_FIELDS} }`
  return await client.fetch(query)
}

/**
 * Get post by slug (includes draft support)
 */
export async function getPostBySlug(client: SanityClient, slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == "${slug}"][0] { ${POST_DETAIL_FIELDS} }`
  return await client.fetch(query)
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(client: SanityClient) {
  const query = `*[_type == "post" && status == "published"] { slug }`
  const slugs = await client.fetch<{ slug: { current: string } }[]>(query)
  return slugs.map((item) => item.slug)
}

/**
 * Get count of published posts
 */
export async function getPublishedPostsCount(client: SanityClient): Promise<number> {
  const query = `count(*[_type == "post" && status == "published"])`
  return await client.fetch(query)
}

/**
 * Get posts by tag with pagination
 */
export async function getPostsByTag(
  client: SanityClient,
  tagSlug: string,
  limit: number = 10,
  offset: number = 0
): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "published" && "${tagSlug}" in tags[]->slug.current] | order(publishedAt desc)[${offset}...${offset + limit}] { ${POST_LIST_FIELDS} }`
  return await client.fetch(query)
}

/**
 * Get count of posts by tag
 */
export async function getPostsByTagCount(client: SanityClient, tagSlug: string): Promise<number> {
  const query = `count(*[_type == "post" && status == "published" && "${tagSlug}" in tags[]->slug.current])`
  return await client.fetch(query)
}

/**
 * Get all tags
 */
export async function getAllTags(client: SanityClient): Promise<Tag[]> {
  const query = `*[_type == "tag"] | order(title) { _id, title, slug }`
  return await client.fetch(query)
}

/**
 * Get author by ID
 */
export async function getAuthorById(
  client: SanityClient,
  authorId: string
): Promise<Author | null> {
  const query = `*[_type == "author" && _id == "${authorId}"][0] { _id, name, bio, image { asset -> { url }, hotspot } }`
  return await client.fetch(query)
}

/**
 * Get site settings
 */
export async function getSiteSettings(client: SanityClient): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings"][0] { siteTitle, siteDescription, defaultSeoTitle, defaultSeoDescription, ogImage { asset -> { url } } }`
  return await client.fetch(query)
}
