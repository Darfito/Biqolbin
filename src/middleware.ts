import { updateSession } from '@/libs/supabase/middleware'
import { type NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
  // update user's auth session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - authentication/* (exclude all authentication pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|authentication/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}