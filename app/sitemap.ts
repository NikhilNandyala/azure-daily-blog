import { MetadataRoute } from 'next'
import { allBlogs, allProjects } from 'contentlayer/generated'
import { slug as slugify } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const postRoutes: MetadataRoute.Sitemap = allBlogs
    .filter((post) => !post.draft && new Date(post.date) <= new Date())
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.85 : 0.7,
    }))

  const allTags = [...new Set(allBlogs.flatMap((post) => post.tags ?? []))]
  const tagRoutes: MetadataRoute.Sitemap = allTags.map((tag) => ({
    url: `${siteUrl}/tags/${slugify(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.date ? new Date(project.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.75 : 0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...tagRoutes, ...projectRoutes]
}
