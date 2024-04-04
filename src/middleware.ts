import { NextRequest, NextResponse } from 'next/server';
// const isPasswordEnabled = Boolean(process.env.NEXT_PUBLIC_APP_PASSWORD);
const isPasswordEnabled = false;

export async function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.has('login');
  const isPathPasswordProtect = req.nextUrl.pathname.startsWith('/verify');
  console.log(
    'detailss',
    process.env.NEXT_PUBLIC_APP_PASSWORD,
    !isLoggedIn,
    isPasswordEnabled,
    !isPathPasswordProtect
  );
  if (!isLoggedIn && isPasswordEnabled && !isPathPasswordProtect) {
    return NextResponse.redirect(new URL('/verify', req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api|_next/static|favicon.ico|under-development.svg).*)',
  ],
};
