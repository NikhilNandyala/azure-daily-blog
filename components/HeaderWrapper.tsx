import { getAllPosts } from '@/lib/content'
import Header from './Header'

export function HeaderWrapper() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    date: p.date,
    title: p.title,
    summary: p.summary,
    tags: p.tags ?? [],
    featured: p.featured ?? false,
    membersOnly: p.membersOnly ?? false,
  }))
  return <Header posts={posts} />
}
