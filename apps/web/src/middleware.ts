import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: { path?: string; maxAge?: number; secure?: boolean; httpOnly?: boolean; sameSite?: 'strict' | 'lax' | 'none' }) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string) {
          request.cookies.delete(name);
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.delete(name);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect CMS routes
  if (request.nextUrl.pathname.startsWith('/cms')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/cms';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};