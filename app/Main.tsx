import FeaturedPosts from '@/components/FeaturedPosts'
import LatestPosts from '@/components/LatestPosts'
import PopularTags from '@/components/PopularTags'
import MostRead from '@/components/MostRead'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import tagData from './tag-data.json' with { type: 'json' }

export default function Home({ posts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <FeaturedPosts posts={posts.slice(0, 3)} />
        <LatestPosts posts={posts.slice(3)} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <NewsletterForm />
        </div>
        <PopularTags tags={tagData} />
        <MostRead />
      </div>
    </div>
  )
}
