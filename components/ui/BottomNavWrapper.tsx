'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

/**
 * Wrapper that conditionally renders BottomNav only on protected app routes.
 * 
 * BottomNav should NOT appear on:
 * - /sign-in/* (auth)
 * - /sign-up/* (auth)
 * - /onboarding (pre-app)
 * 
 * BottomNav SHOULD appear on:
 * - / (home)
 * - /exercise/* (protected app)
 * - /routine/* (protected app)
 * - /settings/* (protected app)
 * - /account (protected app)
 */
export function BottomNavWrapper() {
  const pathname = usePathname();

  // Routes where BottomNav should NOT appear
  const hideNavRoutes = ['/sign-in', '/sign-up', '/onboarding'];
  const shouldHideNav = hideNavRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideNav) {
    return null;
  }

  return <BottomNav />;
}