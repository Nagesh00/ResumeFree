/**
 * Client-side Job Extraction Utility
 * Replaces the server-side API route for GitHub Pages deployment
 */

import { runAI } from '../../lib/ai/run';

export async function extractJobFromUrl(url: string, apiKey: string, provider: 'openai' | 'anthropic' | 'google' = 'openai') {
  try {
    // Note: This will be limited by CORS policies
    // For production, consider using a CORS proxy service
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic text extraction (simplified)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || '';
    
    // Use AI to extract structured data
    const extractionPrompt = [
      {
        role: 'system' as const,
        content: `Extract job information from webpage content and return JSON with:
        - jobTitle: string
        - companyName: string  
        - jobDescription: string
        - requirements: string[]
        - location: string`
      },
      {
        role: 'user' as const,
        content: `Extract job info from: ${textContent.slice(0, 4000)}`
      }
    ];

    const aiResponse = await runAI({
      provider,
      model: 'gpt-3.5-turbo',
      messages: extractionPrompt,
      apiKey,
      temperature: 0.3,
      maxTokens: 1000,
    });

    return JSON.parse(aiResponse.text);
  } catch (error) {
    console.error('Job extraction error:', error);
    throw new Error('Failed to extract job information');
  }
}
