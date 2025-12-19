'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

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

interface HeaderProps {
  posts: Post[]
}

const Header = ({ posts }: HeaderProps) => {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  let headerClass = 'flex items-center w-full bg-[#0B1220] justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Image src="/static/images/logo.png" alt="AzureFixes Logo" width={270} height={270} />
          </div>
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-accent text-body m-1 text-lg font-medium"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton posts={posts} />
        {status === 'loading' ? (
          <div className="h-8 w-20 animate-pulse rounded bg-[#374151]"></div>
        ) : session ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 rounded-full bg-[#1F2937] p-1 hover:bg-[#374151] focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
              aria-label="User menu"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User avatar'}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                  unoptimized
                />
              ) : (
                <div className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
                  <span className="text-sm font-medium">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <svg
                className={`text-muted h-4 w-4 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-white/6 bg-[#111827] py-1 shadow-lg">
                <div className="border-b border-white/6 px-4 py-2">
                  <p className="text-body text-sm font-medium">{session.user?.name || 'User'}</p>
                  <p className="text-muted text-xs">{session.user?.email}</p>
                </div>
                <Link
                  href="/account"
                  className="text-body block px-4 py-2 text-sm hover:bg-[#374151]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-body block w-full px-4 py-2 text-left text-sm hover:bg-[#374151]"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-inverse rounded-md bg-[#38BDF8] px-4 py-2 text-sm font-medium hover:bg-[#60A5FA]"
          >
            Login
          </Link>
        )}
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
