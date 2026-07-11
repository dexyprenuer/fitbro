import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isApiRoute = createRouteMatcher(['/api(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId, sessionClaims } = auth();
  auth().protect();

  const metadata = sessionClaims?.metadata as
    | { onboarded?: boolean; role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' }
    | undefined;

  // Admin gate — checked before the onboarding gate so admins never get
  // bounced into onboarding if they somehow land here pre-onboard.
  // Returns 404 (not a redirect) so the route's existence isn't revealed.
  if (isAdminRoute(req)) {
    const role = metadata?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
    return;
  }

  // Onboarding gate — reads `onboarded` directly from the session token's
  // public metadata claim (no DB/API round-trip, no navigation delay).
  // Requires the "metadata" claim configured in Clerk Dashboard → Sessions.
  if (userId && !isOnboardingRoute(req) && !isApiRoute(req)) {
    if (!metadata?.onboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};