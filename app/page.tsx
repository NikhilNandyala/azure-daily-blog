import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllPublishedPosts, getTagsWithCounts } from '@/lib/sanity/queries'
import SanityLatestPosts from '@/components/SanityLatestPosts'
import SanityPopularTags from '@/components/SanityPopularTags'
import SidebarCard from '@/components/SidebarCard'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Header from '@/components/Header'

// Revalidate every hour (3600 seconds)
export const revalidate = 3600

export default async function Page() {
  const session = await getServerSession(authOptions)
  const isAuthenticated = Boolean(session)

  // Fetch all published posts from Sanity
  const posts = await getAllPublishedPosts(100, 0) // Get up to 100 posts
  const tagsWithCounts = await getTagsWithCounts()

  return (
    <>
      <Header posts={[]} />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-8">
          <SanityLatestPosts posts={posts} isAuthenticated={isAuthenticated} limit={0} />
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6 lg:col-span-4">
          <SidebarCard title="Newsletter">
            <NewsletterForm />
          </SidebarCard>
          <SanityPopularTags tags={tagsWithCounts} limit={10} />
        </div>
      </div>
    </>
  )
}
