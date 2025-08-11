/**
 * Azure OpenAI Provider Implementation
 * Client-side API calls for Azure OpenAI Service
 */

import { AIProvider } from '../ai/run';

export const azureProvider: AIProvider = {
  name: 'azure',
  models: ['gpt-4o', 'gpt-4', 'gpt-35-turbo'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 1000, signal }) {
    // Azure endpoint should be provided via environment variable
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    if (!endpoint) {
      throw new Error('Azure OpenAI endpoint not configured');
    }

    const apiVersion = '2024-02-15-preview';
    const url = `${endpoint}/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Azure OpenAI API error: ${response.status} - ${error.error?.message || response.statusText}`);
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
