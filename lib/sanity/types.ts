/**
 * TypeScript types for Sanity content
 * Matches schema structure from sanity/schemaTypes
 */

export interface Author {
  _id: string
  name: string
  image: SanityImage
  bio: string
}

export interface Tag {
  _id: string
  title: string
  slug: {
    current: string
  }
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _id: string
    url: string
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface Block {
  _type: 'block'
  style?: string
  children?: Array<{
    _type: 'span'
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextContent = any

export interface Post {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  body: PortableTextContent[]
  markdownBody?: string
  coverImage?: SanityImage
  tags?: Tag[]
  author: Author
  publishedAt?: string
  status: 'draft' | 'published'
  featured?: boolean
  membersOnly?: boolean
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  views?: number
}

export type PostListItem = Omit<Post, 'body'>

export interface Project {
  _id: string
  _createdAt: string
  _updatedAt?: string
  title: string
  slug: {
    current: string
  }
  shortDescription: string
  body?: PortableTextContent[]
  heroImage?: SanityImage & { alt?: string }
  gallery?: Array<SanityImage & { alt?: string; caption?: string }>
  techStack?: string[]
  category?: string
  status: 'active' | 'paused' | 'archived'
  repoUrl?: string
  liveUrl?: string
  docsUrl?: string
  featured?: boolean
  publishedAt?: string
}

export type ProjectListItem = Omit<Project, 'body' | 'gallery'>

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  defaultSeoTitle: string
  defaultSeoDescription: string
  ogImage: SanityImage
}
