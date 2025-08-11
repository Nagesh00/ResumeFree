/**
 * Ollama Provider Implementation
 * Local AI models via Ollama
 */

import { AIProvider } from '../ai/run';

export const ollamaProvider: AIProvider = {
  name: 'ollama',
  models: ['llama3', 'llama3:8b', 'llama3:70b', 'codellama', 'mistral', 'phi3'],
  
  async run({ model, messages, temperature = 0.2, maxTokens = 1000, signal }) {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        options: {
          temperature,
          num_predict: maxTokens,
        },
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      text: data.message?.content || '',
      usage: {
        input: data.prompt_eval_count || 0,
        output: data.eval_count || 0,
      },
    };
  },
};
