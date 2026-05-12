import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sport from '@/models/Sport';
import GenericActivity from '@/models/GenericActivity';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const sport = await Sport.findByIdAndDelete(id);
    if (!sport) return NextResponse.json({ error: 'Sport non trouvé' }, { status: 404 });
    // Also delete all activities for this sport
    await GenericActivity.deleteMany({ sportSlug: sport.slug });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
