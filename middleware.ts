import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// TEMPORARILY DISABLED — membersOnly blog gating removed to maximise public reach.
// Original middleware (blog slug gating) preserved below for re-enable.
//
// import { getToken } from 'next-auth/jwt'
// import { allBlogs } from 'contentlayer/generated'
// const membersOnlySlugs = new Set(
//   allBlogs.filter((post) => post.membersOnly).map((post) => post.slug)
// )
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl
//   if (!pathname.startsWith('/blog')) return NextResponse.next()
//   const rawSlug = pathname.replace(/^\/blog\/?/, '').replace(/\/$/, '')
//   if (!rawSlug) return NextResponse.next()
//   const decodedSlug = decodeURIComponent(rawSlug)
//   if (!membersOnlySlugs.has(decodedSlug)) return NextResponse.next()
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
//   if (token) return NextResponse.next()
//   const loginUrl = new URL('/login', req.nextUrl.origin)
//   loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search)
//   return NextResponse.redirect(loginUrl)
// }
// export const config = { matcher: ['/blog/:path*'] }

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Only protect /admin — everything else is public
    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Only require auth for /admin routes — all others pass through
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  // Only run middleware on admin routes — NOT on /blog, /login, etc.
  matcher: ['/admin/:path*'],
}
