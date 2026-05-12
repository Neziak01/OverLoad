import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sport from '@/models/Sport';

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  try {
    await connectDB();
    const sports = await Sport.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json(sports);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, color, emoji } = await request.json();
    if (!name || !color || !emoji) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }
    const slug = slugify(name);
    const count = await Sport.countDocuments();
    const sport = await Sport.create({ name, slug, color, emoji, order: count });
    return NextResponse.json(sport, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('duplicate key') || msg.includes('E11000')) {
      return NextResponse.json({ error: 'Un sport avec ce nom existe déjà' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
