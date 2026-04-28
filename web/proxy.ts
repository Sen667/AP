import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { envConfig } from './app/config/env.config'

const PUBLIC_PATHS = ['/', '/login', '/register']

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: envConfig.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  const isAuthPage = PUBLIC_PATHS.includes(pathname)
  const isProtected = pathname.startsWith('/espace')
  const backendExpired = !token?.backendExpiresAt || Date.now() > token.backendExpiresAt

  if (isAuthPage && backendExpired) return NextResponse.next()

  if (isAuthPage && token && !backendExpired) {
    const redirectPath = token.role === 'ADMIN' ? '/espace/admin' : '/espace'
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  if (pathname === '/espace' && token && !backendExpired && token.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/espace/admin', req.url))
  }

  if (pathname.startsWith('/espace/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/espace', req.url))
  }

  if (isProtected && backendExpired) return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
}

export const config = { matcher: ['/espace/:path*', '/login', '/register'] }
