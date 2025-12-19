import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-12-14'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

// ============================================================================
// POST QUERIES
// ============================================================================

export async function getPosts(
  filters: { status?: string; featured?: boolean; membersOnly?: boolean } = {}
) {
  try {
    let query = '*[_type == "post"'
    const conditions: string[] = []

    if (filters.status) {
      conditions.push(`status == "${filters.status}"`)
    }
    if (filters.featured !== undefined) {
      conditions.push(`featured == ${filters.featured}`)
    }
    if (filters.membersOnly !== undefined) {
      conditions.push(`membersOnly == ${filters.membersOnly}`)
    }

    if (conditions.length > 0) {
      query += ' && ' + conditions.join(' && ')
    }
    query +=
      '] | order(publishedAt desc) { _id, title, slug, excerpt, coverImage, tags[]->{ title, slug }, author->{ name, bio, image }, publishedAt, status, featured, membersOnly, seoTitle, seoDescription }'

    const posts = await client.fetch(query)
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPublishedPosts() {
  return getPosts({ status: 'published' })
}

export async function getFeaturedPosts(limit: number = 3) {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && status == "published" && featured == true] | order(publishedAt desc) [0..${limit - 1}] { _id, title, slug, excerpt, coverImage, tags[]->{ title, slug }, author->{ name, bio, image }, publishedAt, featured }`
    )
    return posts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPost(slug: string) {
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] { 
        _id, 
        title, 
        slug, 
        excerpt,
        body,
        coverImage,
        tags[]->{ _id, title, slug },
        author->{ name, bio, image },
        publishedAt,
        status,
        featured,
        membersOnly,
        seoTitle,
        seoDescription,
        canonicalUrl
      }`,
      { slug }
    )
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getPostsByTag(tagSlug: string) {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && status == "published" && $tagSlug in tags[]->.slug.current] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        coverImage,
        tags[]->{ title, slug },
        author->{ name },
        publishedAt
      }`,
      { tagSlug }
    )
    return posts
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    return []
  }
}

export async function getPostsByAuthor(authorId: string) {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && status == "published" && author._ref == $authorId] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        coverImage,
        tags[]->{ title, slug },
        author->{ name },
        publishedAt
      }`,
      { authorId }
    )
    return posts
  } catch (error) {
    console.error('Error fetching posts by author:', error)
    return []
  }
}

// ============================================================================
// TAG QUERIES
// ============================================================================

export async function getTags() {
  try {
    const tags = await client.fetch(`*[_type == "tag"] | order(title asc) { _id, title, slug }`)
    return tags
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function getTag(slug: string) {
  try {
    const tag = await client.fetch(
      `*[_type == "tag" && slug.current == $slug][0] { _id, title, slug }`,
      { slug }
    )
    return tag
  } catch (error) {
    console.error('Error fetching tag:', error)
    return null
  }
}

// ============================================================================
// AUTHOR QUERIES
// ============================================================================

export async function getAuthors() {
  try {
    const authors = await client.fetch(
      `*[_type == "author"] | order(name asc) { _id, name, image, bio }`
    )
    return authors
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

export async function getAuthor(id: string) {
  try {
    const author = await client.fetch(
      `*[_type == "author" && _id == $id][0] { _id, name, image, bio }`,
      { id }
    )
    return author
  } catch (error) {
    console.error('Error fetching author:', error)
    return null
  }
}

// ============================================================================
// SITE SETTINGS QUERIES
// ============================================================================

export async function getSiteSettings() {
  try {
    const settings = await client.fetch(
      `*[_type == "siteSettings"][0] {
        siteTitle,
        siteDescription,
        defaultSeoTitle,
        defaultSeoDescription,
        ogImage
      }`
    )
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
