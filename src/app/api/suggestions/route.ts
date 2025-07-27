import { NextRequest, NextResponse } from 'next/server';
import { AIModel, generateProductivitySuggestion, UserProfile } from '@/lib/aiModels';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userProfile: UserProfile = body.userProfile;
    if (!userProfile) {
      return NextResponse.json({ error: 'Missing userProfile in request body' }, { status: 400 });
    }
    const suggestion = await generateProductivitySuggestion(userProfile,AIModel.GEMINI);
    return NextResponse.json(suggestion);
  } catch (error: unknown) {
    console.error('Error in /api/suggestions:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate suggestion';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 