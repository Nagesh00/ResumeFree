import { getProvider } from '../providers';
import { 
  AIMessage, 
  AIResponse, 
  AIProviderError, 
  AISettings,
  AIOperation 
} from './types';

// Main AI runner function - provider-agnostic
export async function runAI(options: {
  messages: AIMessage[];
  operation?: AIOperation;
  settings?: Partial<AISettings>;
  signal?: AbortSignal;
  provider?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<AIResponse> {
  const { messages, operation, settings = {}, signal, provider: providerName, apiKey, model, temperature, maxTokens } = options;
  
  // Get settings from localStorage or use defaults
  const defaultSettings: AISettings = {
    provider: providerName || 'perplexity',
    model: model || 'llama-3.1-sonar-small-128k-online',
    apiKey: apiKey || '',
    temperature: temperature || 0.2,
    maxTokens: maxTokens || 2048,
    redactPII: false,
    offlineOnly: false,
  };

  const mergedSettings = { ...defaultSettings, ...getStoredSettings(), ...settings };
  
  // Validate settings
  if (!mergedSettings.apiKey && mergedSettings.provider !== 'ollama') {
    throw new AIProviderError(
      'API key is required for this provider',
      mergedSettings.provider
    );
  }

  if (mergedSettings.offlineOnly && mergedSettings.provider !== 'ollama') {
    throw new AIProviderError(
      'Offline mode only supports local providers',
      mergedSettings.provider
    );
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
