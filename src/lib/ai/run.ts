/**
 * AI Provider Abstraction Layer
 * Unified interface for multiple AI providers as per original requirements
 */

import { openAIProvider } from '../providers/openai';
import { anthropicProvider } from '../providers/anthropic';
import { googleProvider } from '../providers/google';
import { azureProvider } from '../providers/azure';
import { ollamaProvider } from '../providers/ollama';

export type AIMessage = { 
  role: 'system' | 'user' | 'assistant'; 
  content: string; 
};

export interface AIResponse { 
  text: string; 
  usage?: { 
    input: number; 
    output: number; 
  };
}

export interface AIProvider {
  name: string;
  models: string[];
  run: (opts: {
    apiKey: string;
    model: string;
    messages: AIMessage[];
    temperature?: number;
    maxTokens?: number;
    signal?: AbortSignal;
  }) => Promise<AIResponse>;
}

export interface RunAIOptions {
  provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'ollama';
  model: string;
  messages: AIMessage[];
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

// Provider registry
const providers: Record<string, AIProvider> = {
  openai: openAIProvider,
  anthropic: anthropicProvider,
  google: googleProvider,
  azure: azureProvider,
  ollama: ollamaProvider,
};

/**
 * Unified AI runner - routes to specific provider
 */
export async function runAI(options: RunAIOptions): Promise<AIResponse> {
  const { provider, ...providerOptions } = options;
  
  const aiProvider = providers[provider];
  if (!aiProvider) {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  // Add timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
  try {
    const signal = options.signal || controller.signal;
    const response = await aiProvider.run({
      ...providerOptions,
      signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI request timed out');
    }
    
    throw error;
  }
}

/**
 * Get available models for a provider
 */
export function getProviderModels(provider: string): string[] {
  const aiProvider = providers[provider];
  return aiProvider?.models || [];
}

/**
 * Check if provider is available (has API key)
 */
export function isProviderAvailable(provider: string, apiKey?: string): boolean {
  return Boolean(providers[provider] && (apiKey || provider === 'ollama'));
}

/**
 * Validate AI provider configuration
 */
export function validateProviderConfig(provider: string, apiKey: string, model: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!providers[provider]) {
    errors.push(`Provider '${provider}' is not supported`);
  }
  
  if (!apiKey && provider !== 'ollama') {
    errors.push('API key is required');
  }
  
  const availableModels = getProviderModels(provider);
  if (!availableModels.includes(model)) {
    errors.push(`Model '${model}' is not available for provider '${provider}'`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

  // Get the provider
  const provider = getProvider(mergedSettings.provider);
  if (!provider) {
    throw new AIProviderError(
      `Provider '${mergedSettings.provider}' not found`,
      mergedSettings.provider
    );
  }

  // Validate model
  if (!provider.models.includes(mergedSettings.model)) {
    throw new AIProviderError(
      `Model '${mergedSettings.model}' not available for provider '${mergedSettings.provider}'`,
      mergedSettings.provider
    );
  }

  // Apply PII redaction if enabled
  let processedMessages = messages;
  if (mergedSettings.redactPII) {
    processedMessages = await redactPIIFromMessages(messages);
  }

  try {
    const response = await provider.run({
      apiKey: mergedSettings.apiKey,
      model: mergedSettings.model,
      messages: processedMessages,
      temperature: mergedSettings.temperature,
      maxTokens: mergedSettings.maxTokens,
      signal,
    });

    // Log usage for analytics (optional)
    if (operation) {
      logAIUsage(operation, mergedSettings.provider, response.usage);
    }

    return response;
  } catch (error) {
    // Enhanced error handling
    if (error instanceof AIProviderError) {
      throw error;
    }
    
    throw new AIProviderError(
      `AI execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      mergedSettings.provider
    );
  }
}

// Convenience function for common operations
export async function runAIWithUserSettings(options: {
  messages: AIMessage[];
  operation?: AIOperation;
  signal?: AbortSignal;
}): Promise<AIResponse> {
  return runAI(options);
}

// Get stored AI settings
function getStoredSettings(): Partial<AISettings> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('ai-settings');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Store AI settings
export function storeAISettings(settings: Partial<AISettings>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const currentSettings = getStoredSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem('ai-settings', JSON.stringify(newSettings));
  } catch (error) {
    console.error('Failed to store AI settings:', error);
  }
}

// PII redaction (basic implementation)
async function redactPIIFromMessages(messages: AIMessage[]): Promise<AIMessage[]> {
  // This is a simplified version - you could use a more sophisticated approach
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  
  return messages.map(message => ({
    ...message,
    content: message.content
      .replace(emailRegex, '[EMAIL_REDACTED]')
      .replace(phoneRegex, '[PHONE_REDACTED]')
      .replace(ssnRegex, '[SSN_REDACTED]')
  }));
}

// Usage logging for analytics
function logAIUsage(
  operation: AIOperation, 
  provider: string, 
  usage?: AIResponse['usage']
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation,
      provider,
      usage,
    };
    
    const logs = JSON.parse(localStorage.getItem('ai-usage-logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 entries
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('ai-usage-logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}

// Test provider connection
export async function testProviderConnection(
  provider: string,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; error?: string; latency?: number }> {
  const startTime = Date.now();
  
  try {
    const testMessages: AIMessage[] = [
      {
        role: 'user',
        content: 'Respond with just "OK" to test the connection.'
      }
    ];

    await runAI({
      messages: testMessages,
      settings: {
        provider,
        apiKey,
        model: model || getProvider(provider)?.models[0],
        maxTokens: 10,
      },
      signal: new AbortController().signal,
    });

    return {
      success: true,
      latency: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latency: Date.now() - startTime,
    };
  }
}

// Get AI usage statistics
export function getAIUsageStats(): {
  totalRequests: number;
  requestsByProvider: Record<string, number>;
  requestsByOperation: Record<string, number>;
  totalTokens: number;
} {
  if (typeof window === 'undefined') {
    return {
      totalRequests: 0,
      requestsByProvider: {},
      requestsByOperation: {},
      totalTokens: 0,
    };
  }
  
  try {
    const logs = JSON.parse(localStorage.getItem('ai-usage-logs') || '[]');
    
    const stats = {
      totalRequests: logs.length,
      requestsByProvider: {} as Record<string, number>,
      requestsByOperation: {} as Record<string, number>,
      totalTokens: 0,
    };
    
    logs.forEach((log: any) => {
      stats.requestsByProvider[log.provider] = (stats.requestsByProvider[log.provider] || 0) + 1;
      stats.requestsByOperation[log.operation] = (stats.requestsByOperation[log.operation] || 0) + 1;
      if (log.usage?.total) {
        stats.totalTokens += log.usage.total;
      }
    });
    
    return stats;
  } catch {
    return {
      totalRequests: 0,
      requestsByProvider: {},
      requestsByOperation: {},
      totalTokens: 0,
    };
  }
}
