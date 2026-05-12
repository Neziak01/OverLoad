import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GenericActivity from '@/models/GenericActivity';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const activity = await GenericActivity.findByIdAndDelete(id);
    if (!activity) return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
