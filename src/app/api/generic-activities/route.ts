import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GenericActivity from '@/models/GenericActivity';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sportSlug = searchParams.get('sportSlug');
    const query = sportSlug ? { sportSlug } : {};
    const activities = await GenericActivity.find(query).sort({ date: -1 });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const activity = await GenericActivity.create(data);
    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
