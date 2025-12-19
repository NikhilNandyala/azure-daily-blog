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
      className="text-body hover:text-inverse mr-2 mb-2 inline-block rounded-full bg-[#1F2937] px-3 py-1 text-sm transition-colors hover:bg-[#38BDF8]"
    >
      {text} {count !== undefined && `(${count})`}
    </Link>
  )
}

export default TagChip
