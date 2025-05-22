import { NextResponse } from 'next/server';
import { readDataFile } from '@/utils/fileUtils';

export async function GET(
  request: Request,
  { params }: { params: { db: string } }
) {
  try {
    const data = readDataFile(params.db);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get data' }, { status: 500 });
  }
} 