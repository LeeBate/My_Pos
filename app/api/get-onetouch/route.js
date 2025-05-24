// get-onetouch API route
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.POS_APP_DB);
    const data = await db.collection('one-touch').find({}).toArray();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from DB' }, { status: 500 });
  }
}
