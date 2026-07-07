import { prisma } from '@/lib/prisma';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1 ambiguity

function randomSuffix(length = 4): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
}

/**
 * Generates a unique username like "user#A7K2".
 * Retries on collision (checked against Profile.username).
 */
export async function generateUniqueUsername(maxAttempts = 10): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = `user#${randomSuffix()}`;
    const existing = await prisma.profile.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  // Extremely unlikely fallback: widen suffix length to cut collision odds further
  const fallback = `user#${randomSuffix(6)}`;
  const existing = await prisma.profile.findUnique({
    where: { username: fallback },
    select: { id: true },
  });
  if (existing) {
    throw new Error('Could not generate a unique username after multiple attempts.');
  }
  return fallback;
}