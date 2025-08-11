import { NextRequest, NextResponse } from 'next/server';
import { parseResumeContent } from '../../../lib/parsing/postprocess';

export async function POST(request: NextRequest) {
  try {
    const { text, provider, redactPII } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    // Get API keys from environment
    const apiKeys = {
      perplexity: process.env.PERPLEXITY_API_KEY,
      google: process.env.GEMINI_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      azure: process.env.AZURE_OPENAI_API_KEY,
    };

    const apiKey = apiKeys[provider as keyof typeof apiKeys];
    
    if (!apiKey && provider) {
      return NextResponse.json(
        { error: `API key not configured for provider: ${provider}` },
        { status: 400 }
      );
    }

    // Parse the resume content with AI
    const result = await parseResumeContent({
      text,
      provider: provider || 'basic',
      apiKey: apiKey || '',
      redactPII: redactPII || false
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Resume parsing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Resume parsing failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
