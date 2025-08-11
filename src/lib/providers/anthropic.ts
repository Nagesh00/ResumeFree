/**
 * Anthropic Claude Provider Implementation
 * Client-side API calls for Claude models
 */

import { AIProvider } from '../ai/run';

export const anthropicProvider: AIProvider = {
  name: 'anthropic',
  models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 1000, signal }) {
    // Convert messages format for Anthropic
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemMessage?.content,
        messages: userMessages,
      }),
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.status} - ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      text: data.content?.[0]?.text || '',
      usage: {
        input: data.usage?.input_tokens || 0,
        output: data.usage?.output_tokens || 0,
      },
    };
  },
};
