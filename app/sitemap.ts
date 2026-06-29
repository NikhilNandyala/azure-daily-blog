import { MetadataRoute } from 'next'
import { slug as slugify } from 'github-slugger'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azurefixes.com'

interface BlogPost {
  slug: string
  date: string
  lastmod?: string
  draft?: boolean
  featured?: boolean
  tags?: string[]
}

interface Project {
  slug: string
  date?: string
  featured?: boolean
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl,               lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/blog`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/tags`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${siteUrl}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/privacy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  let postRoutes: MetadataRoute.Sitemap = []
  let tagRoutes: MetadataRoute.Sitemap = []
  let projectRoutes: MetadataRoute.Sitemap = []

  try {
    const contentlayer = await import('contentlayer/generated')
    const allBlogs = contentlayer.allBlogs as unknown as BlogPost[]
    const allProjects = contentlayer.allProjects as unknown as Project[]

    postRoutes = allBlogs
      .filter((p) => !p.draft && new Date(p.date) <= new Date())
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.lastmod ?? post.date),
        changeFrequency: 'monthly' as const,
        priority: post.featured ? 0.85 : 0.7,
      }))

    const allTagNames = [
      ...new Set(allBlogs.flatMap((p) => p.tags ?? [])),
    ]
    tagRoutes = allTagNames.map((tag) => ({
      url: `${siteUrl}/tags/${slugify(tag)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    projectRoutes = allProjects.map((proj) => ({
      url: `${siteUrl}/projects/${proj.slug}`,
      lastModified: new Date(proj.date ?? new Date()),
      changeFrequency: 'monthly' as const,
      priority: proj.featured ? 0.75 : 0.6,
    }))
  } catch (err) {
    console.error('Sitemap: failed to load Contentlayer data', err)
  }

  return [...staticRoutes, ...postRoutes, ...tagRoutes, ...projectRoutes]
}
