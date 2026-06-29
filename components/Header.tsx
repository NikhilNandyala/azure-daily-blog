'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
  featured?: boolean
  pinned?: boolean
  membersOnly?: boolean
  postType?: string
}

interface HeaderProps {
  posts?: Post[]
}

const Header = ({ posts }: HeaderProps) => {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '0.5px solid rgba(200,134,10,0.15)',
        background: 'rgba(5,13,26,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 36px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Compact logo + wordmark */}
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Image
            src="/static/images/logo.png"
            alt="AzureFixes Logo"
            width={36}
            height={36}
            style={{ borderRadius: '8px', objectFit: 'contain' }}
          />
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#ffeaa0',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              AZUREFIXES
            </div>
            <div
              style={{
                fontSize: '9px',
                color: '#6a5a3a',
                letterSpacing: '0.08em',
                marginTop: '2px',
              }}
            >
              DEBUG FASTER. DEPLOY SMARTER.
            </div>
          </div>
        </Link>

        {/* Right side: nav links + search + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Nav links — desktop only */}
          <nav className="no-scrollbar hidden items-center overflow-x-auto sm:flex" style={{ gap: '24px' }}>
            {headerNavLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isActive ? '#f0a500' : '#8a7a5a',
                    textDecoration: 'none',
                    transition: 'color .15s',
                    borderBottom: isActive ? '1.5px solid #f0a500' : '1.5px solid transparent',
                    paddingBottom: '2px',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#ffeaa0'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#8a7a5a'
                  }}
                >
                  {link.title}
                </Link>
              )
            })}
          </nav>

          {/* Search */}
          <SearchButton posts={posts ?? []} />

          {/* User dropdown — only when signed in */}
          {status !== 'loading' && session && (
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
                  className={`text-muted h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
          )}

          {/* Admin link — dev only; public Login button disabled
              Re-enable: <Link href="/login" className="btn-azure ...">Login</Link> */}
          {status !== 'loading' && !session && process.env.NODE_ENV === 'development' && (
            <Link href="/login" style={{ fontSize: '11px', color: '#6a5a3a' }}>
              Admin
            </Link>
          )}

          {/* Mobile nav */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
