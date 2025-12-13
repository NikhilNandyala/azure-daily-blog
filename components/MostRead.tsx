import Link from '@/components/Link'

const mockMostRead = [
  { title: 'Azure Firewall SNAT Diagnosis', slug: 'Azure-firewall-snat-diagnosis' },
  { title: 'Fix Azure VNG CPU Issues', slug: '2025-07-22-fix-azure-vng-cpu' },
  { title: 'Azure Firewall Troubleshooting', slug: 'azure-firewall-troubleshooting' },
  { title: 'ExpressRoute Design Changes', slug: 'ExpressRoute-Design-Changes' },
]

export default function MostRead() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Most Read</h3>
      <ul className="space-y-3">
        {mockMostRead.map((post, index) => (
          <li key={post.slug} className="flex items-start">
            <span className="text-primary-500 font-bold mr-3 text-sm">{index + 1}</span>
            <Link
              href={`/blog/${post.slug}`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 text-sm leading-tight"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}