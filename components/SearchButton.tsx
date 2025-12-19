'use client'

import { useState } from 'react'
import SearchModal from './SearchModal'

interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
  featured?: boolean
  pinned?: boolean
  membersOnly?: boolean
}

interface SearchButtonProps {
  posts: Post[]
}

const SearchButton = ({ posts }: SearchButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Search"
        className="hover:text-accent text-body h-6 w-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
      <SearchModal posts={posts} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default SearchButton
