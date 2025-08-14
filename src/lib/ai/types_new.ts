// AI Provider types and interfaces
export type AIProviderType = 
  | 'openai' 
  | 'anthropic' 
  | 'azure' 
  | 'google' 
  | 'ollama'
  | 'perplexity';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text: string;
  usage: {
    input: number;
    output: number;
    total?: number;
  };
  finishReason: 'stop' | 'length' | 'error';
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
  runStream?: (opts: {
    apiKey: string;
    model: string;
    messages: AIMessage[];
    temperature?: number;
    maxTokens?: number;
    signal?: AbortSignal;
    onChunk: (chunk: string) => void;
  }) => Promise<AIResponse>;
}

export interface AISettings {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  redactPII: boolean;
  offlineOnly: boolean;
  customEndpoint?: string;
}

// AI operation types
export type AIOperation = 
  | 'parse-resume'
  | 'tailor-resume' 
  | 'generate-summary'
  | 'quantify-bullets'
  | 'generate-cover-letter'
  | 'extract-keywords'
  | 'score-ats'
  | 'suggest-improvements';

export interface AICallOptions {
  messages: AIMessage[];
  operation?: AIOperation;
  settings?: Partial<AISettings>;
  signal?: AbortSignal;
  provider?: string;
}

// Supported AI providers
export const AI_PROVIDERS: Record<AIProviderType, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  azure: 'Azure OpenAI',
  google: 'Google',
  ollama: 'Ollama',
  perplexity: 'Perplexity'
};

// AI provider configurations
export interface AIProviderConfig {
  name: string;
  baseURL?: string;
  defaultModel: string;
  models: string[];
}

// AI suggestion types
export interface AISuggestion {
  id: string;
  type: AIOperation;
  section: string;
  currentText: string;
  proposedText: string;
  rationale: string;
  keywordHits?: string[];
  confidence: number;
  accepted?: boolean;
  timestamp: string;
}

// Job description analysis
export interface JobAnalysis {
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experience: {
    level: string;
    years?: number;
  };
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  benefits?: string[];
  company: {
    name: string;
    industry?: string;
    size?: string;
  };
}

// Resume analysis results
export interface ResumeAnalysis {
  score: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: AISuggestion[];
  sections: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
    overall: number;
  };
  recommendations: string[];
}

// Content enhancement options
export interface ContentEnhancementOptions {
  tone: 'professional' | 'casual' | 'technical';
  style: 'concise' | 'detailed' | 'action-oriented';
  targetRole?: string;
  targetIndustry?: string;
  keywords?: string[];
}

// Resume generation options
export interface ResumeGenerationOptions {
  section: 'summary' | 'experience' | 'skills' | 'education' | 'projects';
  context?: string;
  targetRole?: string;
  keywords?: string[];
  tone?: ContentEnhancementOptions['tone'];
  length?: 'short' | 'medium' | 'long';
}
