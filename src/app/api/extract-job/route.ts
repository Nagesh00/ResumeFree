import { NextRequest, NextResponse } from 'next/server';
import { runAI } from '../../../lib/ai/run';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract text content (simple approach - in production you'd use a proper HTML parser)
    const textContent = html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Use AI to extract job information
    const aiProvider = 'openai'; // or get from user settings
    const apiKey = process.env.OPENAI_API_KEY || 
                   process.env.ANTHROPIC_API_KEY || 
                   process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No AI API key configured' },
        { status: 500 }
      );
    }

    const extractionPrompt = [
      {
        role: 'system' as const,
        content: `You are a job description extractor. Extract structured information from webpage content and return it as JSON.

Return format:
{
  "jobTitle": "extracted job title",
  "companyName": "extracted company name", 
  "jobDescription": "cleaned and formatted job description",
  "requirements": ["list of requirements"],
  "location": "job location if mentioned"
}

If the content doesn't appear to be a job posting, return null for all fields.`
      },
      {
        role: 'user' as const,
        content: `Extract job information from this webpage content:\n\n${textContent.slice(0, 8000)}`
      }
    ];

    const aiResponse = await runAI({
      provider: aiProvider as any,
      model: 'gpt-3.5-turbo',
      messages: extractionPrompt,
      apiKey,
      temperature: 0.3,
      maxTokens: 2000,
    });

    const extractedData = JSON.parse(aiResponse.text);

    return NextResponse.json({
      success: true,
      ...extractedData,
      sourceUrl: url
    });

  } catch (error) {
    console.error('Job extraction error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to extract job information', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
