import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

const SECRET = process.env.ADMIN_SECRET ?? 'office-labs-admin-secret';
const ENV_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ENV_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';

async function getCredentials(): Promise<{ username: string; passwordHash: string; usesHash: boolean }> {
  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: ['adminUsername', 'adminPasswordHash'] } },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    if (map.adminPasswordHash) {
      return {
        username: map.adminUsername ?? ENV_USERNAME,
        passwordHash: map.adminPasswordHash,
        usesHash: true,
      };
    }
  } catch {}
  return {
    username: ENV_USERNAME,
    passwordHash: createHash('sha256').update(ENV_PASSWORD).digest('hex'),
    usesHash: false,
  };
}

function makeToken(username: string, passwordHash: string): string {
  return createHash('sha256').update(`${username}:${passwordHash}:${SECRET}`).digest('hex');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  const creds = await getCredentials();
  return token === makeToken(creds.username, creds.passwordHash);
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const creds = await getCredentials();
  const inputHash = createHash('sha256').update(password).digest('hex');
  return username === creds.username && inputHash === creds.passwordHash;
}

export async function getAdminToken(): Promise<string> {
  const creds = await getCredentials();
  return makeToken(creds.username, creds.passwordHash);
}
