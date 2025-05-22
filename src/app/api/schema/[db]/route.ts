import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  context: { params: Promise<{ db: string }> }
) {
  const { db: dbName } = await context.params;
  
  try {
    const dotPath = path.join(process.cwd(), 'data', dbName, `public.dot`);
    
    if (!fs.existsSync(dotPath)) {
      return NextResponse.json(
        { error: 'Schema file not found' },
        { status: 404 }
      );
    }

    const dotContent = fs.readFileSync(dotPath, 'utf-8');
    return NextResponse.json({ dotContent });
  } catch (error) {
    console.error('Error reading schema file:', error);
    return NextResponse.json(
      { error: 'Failed to read schema file' },
      { status: 500 }
    );
  }
} 