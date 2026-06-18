import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const files = await fs.readdir(PRODUCTS_DIR);
    const images = files
      .filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
      .map(f => ({
        name: f,
        path: `/products/${f}`,
        url: `/products/${f}`,
      }));
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name || name.includes('..') || name.includes('/')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const filePath = path.join(PRODUCTS_DIR, name);
  try {
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
