import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return request.nextUrl.pathname === '/login' ? supabaseResponse : NextResponse.redirect(new URL('/login', request.url))
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect CMS routes
  if (request.nextUrl.pathname.startsWith('/cms')) {
    if (!user || user.app_metadata?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login' && user?.app_metadata?.role === 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/cms';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (!(path === '/login' || path === '/cms' || path.startsWith('/cms/'))) return NextResponse.next()

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};