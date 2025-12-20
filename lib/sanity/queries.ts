import { getPublicClient, sanityConfigured } from './client'
import { Post, PostListItem, Tag, Author, SiteSettings } from './types'

/**
 * GROQ Queries for fetching Sanity content
 * All queries fetch only published posts
 * Optimized for performance with CDN
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
  status,
  featured,
  membersOnly,
  seoTitle,
  seoDescription,
  canonicalUrl
`

function getClientOrNull() {
  if (!sanityConfigured) return null
  return getPublicClient()
}

/**
 * Get latest posts with limit
 * Used for homepage, recent posts sidebar, etc.
 */
export async function getLatestPosts(limit: number = 10): Promise<PostListItem[]> {
  const query = `
    *[_type == "post" && status == "published"] 
    | order(publishedAt desc) 
    [0...${limit}] {
      ${POST_LIST_FIELDS}
    }
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const posts = await client.fetch<PostListItem[]>(query)
    return posts || []
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
}

/**
 * Get featured posts
 * Used for homepage featured section
 */
export async function getFeaturedPosts(limit: number = 3): Promise<PostListItem[]> {
  const query = `
    *[_type == "post" && status == "published" && featured == true]
    | order(publishedAt desc)
    [0...${limit}] {
      ${POST_LIST_FIELDS}
    }
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const posts = await client.fetch<PostListItem[]>(query)
    return posts || []
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

/**
 * Get all published posts with pagination
 * Used for blog listing page
 */
export async function getAllPublishedPosts(
  limit: number = 10,
  offset: number = 0
): Promise<PostListItem[]> {
  const query = `
    *[_type == "post" && status == "published"]
    | order(publishedAt desc)
    [${offset}...${offset + limit}] {
      ${POST_LIST_FIELDS}
    }
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const posts = await client.fetch<PostListItem[]>(query)
    return posts || []
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return []
  }
}

/**
 * Get total count of published posts
 * Used for pagination calculations
 */
export async function getPublishedPostsCount(): Promise<number> {
  const query = `count(*[_type == "post" && status == "published"])`

  const client = getClientOrNull()
  if (!client) return 0

  try {
    const count = await client.fetch<number>(query)
    return count || 0
  } catch (error) {
    console.error('Error fetching posts count:', error)
    return 0
  }
}

/**
 * Get single post by slug
 * Used for post detail page
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    *[_type == "post" && slug.current == $slug && status == "published"][0] {
      ${POST_DETAIL_FIELDS}
    }
  `

  const client = getClientOrNull()
  if (!client) return null

  try {
    const post = await client.fetch<Post>(query, { slug })
    return post || null
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error)
    return null
  }
}

/**
 * Get all posts for sitemap/SEO
 */
export async function getAllPostSlugs(): Promise<Array<{ slug: string; publishedAt: string }>> {
  const query = `
    *[_type == "post" && status == "published"] {
      slug,
      publishedAt
    }
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const posts =
      await client.fetch<Array<{ slug: { current: string }; publishedAt: string }>>(query)
    return (
      posts?.map((post) => ({
        slug: post.slug.current,
        publishedAt: post.publishedAt,
      })) || []
    )
  } catch (error) {
    console.error('Error fetching post slugs:', error)
    return []
  }
}

/**
 * Get all tags
 * Used for tags page, tag sidebar
 */
export async function getAllTags(): Promise<Tag[]> {
  const query = `
    *[_type == "tag"]
    | order(title asc) {
      _id,
      title,
      slug
    }
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const tags = await client.fetch<Tag[]>(query)
    return tags || []
  } catch (error) {
    console.error('Error fetching all tags:', error)
    return []
  }
}

/**
 * Get all tags with post counts
 * Used for popular tags sidebar
 */
export async function getTagsWithCounts(): Promise<Array<{ tag: Tag; count: number }>> {
  const query = `
    *[_type == "tag"] {
      "tag": {
        _id,
        title,
        slug
      },
      "count": count(*[_type == "post" && status == "published" && ^._id in tags[]._ref])
    }
    | order(count desc)
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const tags = await client.fetch<Array<{ tag: Tag; count: number }>>(query)
    return tags || []
  } catch (error) {
    console.error('Error fetching tags with counts:', error)
    return []
  }
}

/**
 * Get posts by tag slug
 * Used for tag detail page
 */
export async function getPostsByTag(
  tagSlug: string,
  limit: number = 10,
  offset: number = 0
): Promise<PostListItem[]> {
  const query = `
    *[_type == "post" && status == "published" && $tagSlug in tags[]->.slug.current]
    | order(publishedAt desc)
    [${offset}...${offset + limit}] {
      ${POST_LIST_FIELDS}
    }
  `

  const client = getClientOrNull()
  if (!client) return []

  try {
    const posts = await client.fetch<PostListItem[]>(query, { tagSlug })
    return posts || []
  } catch (error) {
    console.error(`Error fetching posts for tag "${tagSlug}":`, error)
    return []
  }
}

/**
 * Get count of posts by tag
 * Used for tag page pagination
 */
export async function getPostsByTagCount(tagSlug: string): Promise<number> {
  const query = `
    count(*[_type == "post" && status == "published" && $tagSlug in tags[]->.slug.current])
  `

  const client = getClientOrNull()
  if (!client) return 0

  try {
    const count = await client.fetch<number>(query, { tagSlug })
    return count || 0
  } catch (error) {
    console.error(`Error fetching posts count for tag "${tagSlug}":`, error)
    return 0
  }
}

/**
 * Get site settings
 * Used for global SEO, site metadata
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `
    *[_type == "siteSettings"][0] {
      siteTitle,
      siteDescription,
      defaultSeoTitle,
      defaultSeoDescription,
      ogImage {
        asset -> { url },
        hotspot
      }
    }
  `

  const client = getClientOrNull()
  if (!client) return null

  try {
    const settings = await client.fetch<SiteSettings>(query)
    return settings || null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Get author by ID
 * Used for author pages, post sidebar
 */
export async function getAuthorById(authorId: string): Promise<Author | null> {
  const query = `
    *[_type == "author" && _id == $authorId][0] {
      _id,
      name,
      bio,
      image {
        asset -> { url },
        hotspot
      }
    }
  `

  const client = getClientOrNull()
  if (!client) return null

  try {
    const author = await client.fetch<Author>(query, { authorId })
    return author || null
  } catch (error) {
    console.error(`Error fetching author with ID "${authorId}":`, error)
    return null
  }
}
