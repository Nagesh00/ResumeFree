/**
 * OpenAI Provider Implementation
 * Client-side API calls for OpenAI GPT models
 */

import { AIProvider, AIResponse } from '../ai/run';

export const openAIProvider: AIProvider = {
  name: 'openai',
  models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 1000, signal }) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      text: data.choices?.[0]?.message?.content || '',
      usage: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
      },
    };
  },
};
