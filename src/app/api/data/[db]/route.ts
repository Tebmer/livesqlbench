import { NextResponse } from 'next/server';
import { readDataFile } from '@/utils/fileUtils';

export async function GET(
  request: Request,
  context: { params: Promise<{ db: string }> }
) {
  try {
    const { db: dbName } = await context.params;
    const data = readDataFile(dbName);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get data' }, { status: 500 });
  }
} 