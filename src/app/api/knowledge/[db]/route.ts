import { NextResponse } from 'next/server';
import { readKnowledgeFile } from '@/utils/fileUtils';

export async function GET(
  request: Request,
  context: { params: Promise<{ db: string }> }
) {
  try {
    const { db: dbName } = await context.params;
    const knowledge = readKnowledgeFile(dbName);
    return NextResponse.json(knowledge);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get knowledge base' }, { status: 500 });
  }
} 