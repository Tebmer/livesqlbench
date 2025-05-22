import { NextResponse } from 'next/server';
import { readKnowledgeFile } from '@/utils/fileUtils';

export async function GET(
  request: Request,
  { params }: { params: { db: string } }
) {
  try {
    const knowledge = readKnowledgeFile(params.db);
    return NextResponse.json(knowledge);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get knowledge base' }, { status: 500 });
  }
} 