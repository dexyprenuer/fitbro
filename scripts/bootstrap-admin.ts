// scripts/bootstrap-admin.ts
// One-off script to promote a user to SUPER_ADMIN in both Postgres and Clerk.
// Usage: npx tsx scripts/bootstrap-admin.ts <clerkUserId>
// Delete this file after running once.
import 'dotenv/config';
import { createClerkClient } from '@clerk/backend';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const clerkUserId = process.argv[2];
  if (!clerkUserId) {
    console.error('Usage: npx tsx scripts/bootstrap-admin.ts <clerkUserId>');
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  console.log(`Promoting ${clerkUserId} to SUPER_ADMIN...`);

  // 1. Update Postgres
  const profile = await prisma.profile.update({
    where: { clerkUserId },
    data: { role: 'SUPER_ADMIN' },
  });
  console.log('✅ Postgres role updated:', profile.role);

  // 2. Update Clerk publicMetadata (merge, don't overwrite onboarded flag)
  const user = await clerk.users.getUser(clerkUserId);
  await clerk.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Clerk publicMetadata updated');

  await prisma.$disconnect();
  console.log('Done. Sign out and back in (or refresh session) to pick up the new claim.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});