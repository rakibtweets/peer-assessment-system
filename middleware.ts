import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

// Types
type User = {
  email: string;
  isAdmin: boolean;
  exp: number;
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    try {
      const decoded = jwtDecode(token) as unknown as User;

      // Token expiry check is handled by jwt.verify, but doing extra check if needed
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }

      if (!decoded.isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.log(' middleware error:', error);
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
