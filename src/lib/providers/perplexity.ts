import { AIProvider, AIProviderConfig, AIResponse } from '../ai/types';

export class PerplexityProvider implements AIProvider {
  name = 'perplexity' as const;
  displayName = 'Perplexity';
  
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generateText(prompt: string, options: any = {}): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.1,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: data.model || options.model,
        finishReason: data.choices[0]?.finish_reason || 'stop',
      };
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw new Error(`Perplexity generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateJson<T>(prompt: string, schema: any, options: any = {}): Promise<T> {
    const jsonPrompt = `${prompt}

Please respond with valid JSON only, following this structure:
${JSON.stringify(schema, null, 2)}

Ensure the response is valid JSON that can be parsed.`;

    const response = await this.generateText(jsonPrompt, {
      ...options,
      temperature: 0.1, // Lower temperature for more consistent JSON
    });

    try {
      return JSON.parse(response.content);
    } catch (parseError) {
      // Try to extract JSON from the response if it's wrapped in markdown or text
      const jsonMatch = response.content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // If still fails, try parsing the entire content
      throw new Error(`Failed to parse JSON response: ${parseError}`);
    }
  }

  async generateStream(prompt: string, options: any = {}): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.1,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    return response.body!;
  }

  getDefaultModel(): string {
    return 'llama-3.1-sonar-small-128k-online';
  }

  getAvailableModels(): string[] {
    return [
      'llama-3.1-sonar-small-128k-online',
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-huge-128k-online',
      'llama-3.1-8b-instruct',
      'llama-3.1-70b-instruct',
    ];
  }

  validateConfig(config: AIProviderConfig): boolean {
    return !!config.apiKey;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateText('Hello, please respond with "OK"', {
        maxTokens: 10,
      });
      return response.content.toLowerCase().includes('ok');
    } catch {
      return false;
    }
  }
}
