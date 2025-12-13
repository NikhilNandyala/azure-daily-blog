import Link from 'next/link'
import { slug } from 'github-slugger'

interface TagChipProps {
  text: string
  count?: number
}

const TagChip = ({ text, count }: TagChipProps) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors mr-2 mb-2"
    >
      {text} {count !== undefined && `(${count})`}
    </Link>
  )
}

export default TagChip