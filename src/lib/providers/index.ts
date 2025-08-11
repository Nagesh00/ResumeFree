import { 
  AIProvider, 
  AIMessage, 
  AIResponse, 
  AIProviderError,
  AISettings 
} from '../ai/types';

// OpenAI Provider
export const openAIProvider: AIProvider = {
  name: 'openai',
  models: ['gpt-4o-mini', 'gpt-4o', 'o3-mini', 'gpt-3.5-turbo'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 2048, signal }) {
    try {
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
          response_format: { type: 'json_object' }
        }),
        signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AIProviderError(
          error.error?.message || `OpenAI API error: ${response.status}`,
          'openai',
          response.status
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice) {
        throw new AIProviderError('No response from OpenAI', 'openai');
      }

      return {
        text: choice.message?.content || '',
        usage: {
          input: data.usage?.prompt_tokens || 0,
          output: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        model: data.model,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `OpenAI provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'openai'
      );
    }
  },
};

// Anthropic Provider
export const anthropicProvider: AIProvider = {
  name: 'anthropic',
  models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 2048, signal }) {
    try {
      // Convert messages format for Anthropic
      const systemMessage = messages.find(m => m.role === 'system');
      const chatMessages = messages.filter(m => m.role !== 'system');

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
          messages: chatMessages,
        }),
        signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AIProviderError(
          error.error?.message || `Anthropic API error: ${response.status}`,
          'anthropic',
          response.status
        );
      }

      const data = await response.json();
      const content = data.content?.[0];
      
      if (!content || content.type !== 'text') {
        throw new AIProviderError('Invalid response from Anthropic', 'anthropic');
      }

      return {
        text: content.text,
        usage: {
          input: data.usage?.input_tokens || 0,
          output: data.usage?.output_tokens || 0,
        },
        model: data.model,
        finishReason: data.stop_reason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Anthropic provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'anthropic'
      );
    }
  },
};

// Google Provider
export const googleProvider: AIProvider = {
  name: 'google',
  models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 2048, signal }) {
    try {
      // Convert messages to Google format
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
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
        throw new AIProviderError(
          error.error?.message || `Google API error: ${response.status}`,
          'google',
          response.status
        );
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      
      if (!candidate || !candidate.content) {
        throw new AIProviderError('No response from Google', 'google');
      }

      return {
        text: candidate.content.parts?.[0]?.text || '',
        usage: {
          input: data.usageMetadata?.promptTokenCount || 0,
          output: data.usageMetadata?.candidatesTokenCount || 0,
          total: data.usageMetadata?.totalTokenCount || 0,
        },
        model,
        finishReason: candidate.finishReason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Google provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'google'
      );
    }
  },
};

// Azure OpenAI Provider
export const azureProvider: AIProvider = {
  name: 'azure',
  models: ['gpt-4o', 'gpt-4o-mini', 'gpt-35-turbo'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 2048, signal }) {
    // This would need the Azure endpoint from settings
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    const apiVersion = '2024-02-15-preview';
    
    try {
      const response = await fetch(
        `${endpoint}/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          signal,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AIProviderError(
          error.error?.message || `Azure OpenAI API error: ${response.status}`,
          'azure',
          response.status
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice) {
        throw new AIProviderError('No response from Azure OpenAI', 'azure');
      }

      return {
        text: choice.message?.content || '',
        usage: {
          input: data.usage?.prompt_tokens || 0,
          output: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        model: data.model,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Azure provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'azure'
      );
    }
  },
};

// Ollama Provider (Local)
export const ollamaProvider: AIProvider = {
  name: 'ollama',
  models: ['llama3.1', 'llama3.2', 'mixtral', 'codellama', 'phi3'],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 2048, signal }) {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
        signal,
      });

      if (!response.ok) {
        throw new AIProviderError(
          `Ollama API error: ${response.status}`,
          'ollama',
          response.status
        );
      }

      const data = await response.json();
      
      if (!data.message) {
        throw new AIProviderError('No response from Ollama', 'ollama');
      }

      return {
        text: data.message.content || '',
        usage: {
          input: data.prompt_eval_count || 0,
          output: data.eval_count || 0,
        },
        model: data.model,
        finishReason: data.done ? 'stop' : 'length',
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Ollama provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ollama'
      );
    }
  },
};

// Perplexity Provider
export const perplexityProvider: AIProvider = {
  name: 'perplexity',
  models: [
    'llama-3.1-sonar-small-128k-online',
    'llama-3.1-sonar-large-128k-online', 
    'llama-3.1-sonar-huge-128k-online',
    'llama-3.1-8b-instruct',
    'llama-3.1-70b-instruct'
  ],
  
  async run({ apiKey, model, messages, temperature = 0.2, maxTokens = 2048, signal }) {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'llama-3.1-sonar-small-128k-online',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature,
          max_tokens: maxTokens,
          stream: false
        }),
        signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AIProviderError(
          error.error?.message || `Perplexity API error: ${response.status}`,
          'perplexity',
          response.status
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice) {
        throw new AIProviderError('No response from Perplexity', 'perplexity');
      }

      return {
        text: choice.message?.content || '',
        usage: {
          input: data.usage?.prompt_tokens || 0,
          output: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        finishReason: choice.finish_reason === 'stop' ? 'stop' as const : 'length' as const,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Perplexity request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'perplexity'
      );
    }
  },

  async runStream({ 
    apiKey, 
    model, 
    messages, 
    temperature = 0.2, 
    maxTokens = 2048, 
    signal, 
    onChunk 
  }: {
    apiKey: string;
    model: string;
    messages: AIMessage[];
    temperature?: number;
    maxTokens?: number;
    signal?: AbortSignal;
    onChunk: (chunk: string) => void;
  }) {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'llama-3.1-sonar-small-128k-online',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature,
          max_tokens: maxTokens,
          stream: true
        }),
        signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AIProviderError(
          error.error?.message || `Perplexity API error: ${response.status}`,
          'perplexity',
          response.status
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new AIProviderError('No response stream from Perplexity', 'perplexity');
      }

      const decoder = new TextDecoder();
      let fullText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullText += content;
                  onChunk?.(content);
                }
              } catch (parseError) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        text: fullText,
        usage: { input: 0, output: 0, total: 0 },
        finishReason: 'stop' as const,
      };
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Perplexity stream failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'perplexity'
      );
    }
  }
};

// Provider registry
export const providers: Record<string, AIProvider> = {
  openai: openAIProvider,
  anthropic: anthropicProvider,
  google: googleProvider,
  azure: azureProvider,
  ollama: ollamaProvider,
  perplexity: perplexityProvider,
};

// Get available providers
export const getAvailableProviders = (): AIProvider[] => {
  return Object.values(providers);
};

// Get provider by name
export const getProvider = (name: string): AIProvider | undefined => {
  return providers[name];
};
