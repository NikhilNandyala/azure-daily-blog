import FeaturedPosts from '@/components/FeaturedPosts'
import LatestPosts from '@/components/LatestPosts'
import PopularTags from '@/components/PopularTags'
import MostRead from '@/components/MostRead'
import SidebarCard from '@/components/SidebarCard'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import tagData from './tag-data.json' with { type: 'json' }

interface MainProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary: string
    tags: string[]
  }>
}

export default function Home({ posts }: MainProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <FeaturedPosts posts={posts.slice(0, 3)} />
        <LatestPosts posts={posts.slice(3)} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <SidebarCard title="Newsletter">
          <NewsletterForm />
        </SidebarCard>
        <PopularTags tags={tagData} />
        <MostRead />
      </div>
    </div>
  )
}
