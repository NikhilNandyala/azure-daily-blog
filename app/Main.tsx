import FeaturedPosts from '@/components/FeaturedPosts'
import LatestPosts from '@/components/LatestPosts'
import PopularTags from '@/components/PopularTags'
import MostRead from '@/components/MostRead'
import SidebarCard from '@/components/SidebarCard'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Header from '@/components/Header'
import tagData from './tag-data.json' with { type: 'json' }

const DEBUG_LAYOUT = false

interface MainProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
    featured?: boolean
    pinned?: boolean
    membersOnly?: boolean
  }>
  isAuthenticated?: boolean
}

export default function Home({ posts, isAuthenticated = false }: MainProps) {
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Select featured posts (up to 3, newest first)
  const featuredPosts = sortedPosts.filter((post) => post.featured === true).slice(0, 3)

  // If fewer than 3 featured posts, fill with pinned posts
  let selectedPosts = [...featuredPosts]
  if (selectedPosts.length < 3) {
    const pinnedPosts = sortedPosts
      .filter((post) => post.pinned === true && !selectedPosts.some((fp) => fp.slug === post.slug))
      .slice(0, 3 - selectedPosts.length)
    selectedPosts = [...selectedPosts, ...pinnedPosts]
  }

  // If still fewer than 3, fill with newest posts
  if (selectedPosts.length < 3) {
    const remainingPosts = sortedPosts
      .filter((post) => !selectedPosts.some((sp) => sp.slug === post.slug))
      .slice(0, 3 - selectedPosts.length)
    selectedPosts = [...selectedPosts, ...remainingPosts]
  }

  // Get remaining posts for latest section
  const remainingPosts = sortedPosts.filter(
    (post) => !selectedPosts.some((sp) => sp.slug === post.slug)
  )

  return (
    <>
      <Header posts={posts} />
      <div
        className={`grid grid-cols-1 items-start gap-8 lg:grid-cols-12 ${DEBUG_LAYOUT ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className={`col-span-1 lg:col-span-8 ${DEBUG_LAYOUT ? 'ring-2 ring-green-500' : ''}`}>
          <FeaturedPosts posts={selectedPosts} isAuthenticated={isAuthenticated} />
          <LatestPosts posts={remainingPosts} isAuthenticated={isAuthenticated} />
        </div>
        <div
          className={`col-span-1 space-y-6 lg:col-span-4 ${DEBUG_LAYOUT ? 'ring-2 ring-yellow-500' : ''}`}
        >
          <SidebarCard title="Newsletter">
            <NewsletterForm />
          </SidebarCard>
          <PopularTags tags={tagData} />
          <MostRead posts={sortedPosts} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </>
  )
}
