import { NextRequest, NextResponse } from 'next/server';
import { runAI } from '../../../lib/ai/run';

export async function POST(request: NextRequest) {
  try {
    const { provider, prompt } = await request.json();

    if (!provider || !prompt) {
      return NextResponse.json(
        { error: 'Provider and prompt are required' },
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
    
    if (!apiKey) {
      return NextResponse.json(
        { error: `API key not configured for provider: ${provider}` },
        { status: 400 }
      );
    }

    // Test the AI provider
    const result = await runAI({
      provider: provider as any,
      apiKey,
      model: undefined, // Use default model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      maxTokens: 100,
    });

    return NextResponse.json({
      success: true,
      provider,
      response: result.text,
      usage: result.usage,
    });

  } catch (error) {
    console.error('AI test error:', error);
    
    return NextResponse.json(
      { 
        error: 'AI test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
