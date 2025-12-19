'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from '@/components/Link'
import Image from 'next/image'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/account')}`)
    }
  }, [status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link href="/" className="text-accent hover:text-primary-300">
            ← Back to home
          </Link>
        </div>

        <div className="rounded-lg border border-white/6 bg-[#111827] p-8 shadow-lg">
          <h1 className="text-body mb-6 text-3xl font-bold">Account</h1>

          <div className="mb-8 flex items-center space-x-4">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User avatar'}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full"
                unoptimized
              />
            ) : (
              <div className="bg-primary-500 flex h-16 w-16 items-center justify-center rounded-full text-white">
                <span className="text-xl font-medium">
                  {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-body text-xl font-semibold">{session.user?.name || 'User'}</h2>
              <p className="text-muted">{session.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/6 p-4">
              <h3 className="text-body text-lg font-medium">Account Information</h3>
              <div className="text-muted mt-2 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {session.user?.name || 'Not provided'}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {session.user?.email || 'Not provided'}
                </p>
                <p>
                  <span className="font-medium">Provider:</span> Unknown
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSignOut}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
