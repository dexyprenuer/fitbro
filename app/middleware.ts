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

  const { userId } = auth();
  auth().protect();

  // Onboarding gate: authenticated users who haven't finished onboarding get
  // redirected there for every route except the onboarding page itself and API routes
  // (API routes handle their own onboarded checks server-side, e.g. the onboard route itself).
  if (userId && !isOnboardingRoute(req) && !isApiRoute(req)) {
    const profileCheckUrl = new URL('/api/profile', req.url);
    const res = await fetch(profileCheckUrl, {
      headers: { cookie: req.headers.get('cookie') ?? '' },
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.onboarded) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};