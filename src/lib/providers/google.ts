/**
 * Google AI (Gemini) Provider Implementation
 * Client-side API calls for Gemini models
 */

import { AIProvider } from '../ai/run';

export const googleProvider: AIProvider = {
  name: 'google',
  models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 1000, signal }) {
    // Convert OpenAI format to Google format
    const contents = messages.map(message => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
        signal,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Google AI API error: ${response.status} - ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return {
      text,
      usage: {
        input: data.usageMetadata?.promptTokenCount || 0,
        output: data.usageMetadata?.candidatesTokenCount || 0,
      },
    };
  },
};
