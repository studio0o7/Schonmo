import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if this is an API route or asset request (which we should skip)
  const { pathname } = new URL(request.url);
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files like images, etc.
  ) {
    return NextResponse.next();
  }

  // Get country from request headers (supplied by Netlify or Vercel)
  const country = (request as any).geo?.country || 'US'; // Default to US if not available
  
  // For testing: Allow URL parameter to override the country
  const { searchParams } = new URL(request.url);
  const countryOverride = searchParams.get('country');
  const detectedCountry = countryOverride || country;
  
  console.log('[Middleware] Running for URL:', request.url);
  console.log('[Middleware] Country detection:', { 
    geoCountry: country,
    countryOverride,
    finalCountry: detectedCountry
  });
  
  // Create a response object from the incoming request
  const response = NextResponse.next();
  
  // Set a cookie with the country for client-side access
  response.cookies.set('country', detectedCountry, {
    maxAge: 3600, // 1 hour
    path: '/',
    // Make sure cookies work in development
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  
  // Debug output
  console.log('[Middleware] Setting cookie:', {
    name: 'country',
    value: detectedCountry,
    cookieCount: response.cookies.getAll().length
  });
  
  return response;
}

// Run middleware on all pages
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 