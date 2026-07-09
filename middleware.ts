import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId, sessionClaims } = auth();
  auth().protect();

  // Onboarding gate — reads `onboarded` directly from the session token's
  // public metadata claim (no DB/API round-trip, no navigation delay).
  // Requires the "metadata" claim configured in Clerk Dashboard → Sessions.
  if (userId && !isOnboardingRoute(req) && !isApiRoute(req)) {
    const onboarded = (sessionClaims?.metadata as { onboarded?: boolean } | undefined)?.onboarded;

    if (!onboarded) {
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