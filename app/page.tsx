import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const session = await getServerSession(authOptions)
  return <Main posts={posts} isAuthenticated={Boolean(session)} />
}
