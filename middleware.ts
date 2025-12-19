import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { allBlogs } from 'contentlayer/generated'

const membersOnlySlugs = new Set(
  allBlogs.filter((post) => post.membersOnly).map((post) => post.slug)
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/blog')) {
    return NextResponse.next()
  }

  const rawSlug = pathname.replace(/^\/blog\/?/, '').replace(/\/$/, '')
  if (!rawSlug) {
    return NextResponse.next()
  }

  const decodedSlug = decodeURIComponent(rawSlug)
  if (!membersOnlySlugs.has(decodedSlug)) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (token) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/login', req.nextUrl.origin)
  const callbackUrl = req.nextUrl.pathname + req.nextUrl.search
  loginUrl.searchParams.set('callbackUrl', callbackUrl)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/blog/:path*'],
}
