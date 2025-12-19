import { Metadata } from 'next'
import { urlForSocial } from './imageUrl'
import { Post, SiteSettings } from './types'

/**
 * Build comprehensive SEO metadata for a blog post
 * Falls back to site settings for missing values
 */
export function buildPostMetadata(post: Post, siteSettings?: SiteSettings | null): Metadata {
  const siteTitle = siteSettings?.siteTitle || 'Azure Daily Blog'
  const siteDescription = siteSettings?.siteDescription || 'Azure insights and technical guides'

  // Use post SEO fields or fall back to post data
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt || siteDescription
  const canonical = formatCanonicalUrl(post.canonicalUrl)
  const ogImage = post.coverImage ? urlForSocial(post.coverImage) : getDefaultOgImage(siteSettings)

  return {
    title: `${title} | ${siteTitle}`,
    description,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical || undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
              type: 'image/jpeg',
            },
          ]
        : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags?.map((tag) => tag.title),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: post.author?.name,
    },
    robots: {
      index: post.status === 'published',
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  }
}

/**
 * Get default Open Graph image from site settings or return null
 */
export function getDefaultOgImage(siteSettings?: SiteSettings | null): string | null {
  if (!siteSettings?.ogImage?.asset?.url) {
    return null
  }
  return urlForSocial(siteSettings.ogImage)
}

/**
 * Format and validate canonical URL
 * Returns absolute URL or null if invalid
 */
export function formatCanonicalUrl(url?: string | null): string | null {
  if (!url) return null

  // If already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If relative, construct absolute URL
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://azuredailyblog.com'
  const cleanDomain = domain.replace(/\/$/, '')
  const cleanPath = url.startsWith('/') ? url : `/${url}`

  return `${cleanDomain}${cleanPath}`
}

/**
 * Generate JSON-LD structured data for blog post
 * Used in script tags for search engine understanding
 */
export function generateBlogPostSchema(post: Post, siteSettings?: SiteSettings | null) {
  const siteTitle = siteSettings?.siteTitle || 'Azure Daily Blog'
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://azuredailyblog.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ? urlForSocial(post.coverImage) : undefined,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          image: post.author.image?.asset?.url,
          url: `${domain}#author-${post.author._id}`,
        }
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    isAccessibleForFree: !post.membersOnly,
    keywords: post.tags?.map((tag) => tag.title).join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': formatCanonicalUrl(post.canonicalUrl) || domain,
    },
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      url: domain,
    },
  }
}

/**
 * Generate JSON-LD organization schema
 * Usually placed in layout for whole site
 */
export function generateOrganizationSchema(siteSettings?: SiteSettings | null) {
  const siteTitle = siteSettings?.siteTitle || 'Azure Daily Blog'
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://azuredailyblog.com'
  const ogImage = getDefaultOgImage(siteSettings)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    description: siteSettings?.siteDescription || 'Azure insights and technical guides',
    url: domain,
    image: ogImage,
    sameAs: [
      'https://twitter.com/azuredailyblog',
      'https://linkedin.com/company/azuredailyblog',
    ].filter(Boolean),
  }
}

/**
 * Merge multiple metadata objects (useful for layouts)
 */
export function mergeMetadata(...metadataList: (Metadata | undefined)[]): Metadata {
  const merged: Metadata = {}

  for (const metadata of metadataList) {
    if (!metadata) continue

    // Merge root level properties
    Object.assign(merged, metadata)

    // Merge nested objects
    if (metadata.openGraph) {
      merged.openGraph = {
        ...merged.openGraph,
        ...metadata.openGraph,
      }
    }

    if (metadata.twitter) {
      merged.twitter = {
        ...merged.twitter,
        ...metadata.twitter,
      }
    }
  }

  return merged
}
