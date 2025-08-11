/**
 * Job Tailoring Redux Slice
 * Manages job descriptions, AI suggestions, and tailoring state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Resume } from '../../schema/resume';
import { runAI } from '../../ai/run';

export interface TailoringSuggestion {
  id: string;
  section: string;
  currentText: string;
  proposedText: string;
  rationale: string;
  keywordHits: string[];
  confidence: number;
  applied: boolean;
}

interface TailoringState {
  jobDescription: string;
  suggestions: TailoringSuggestion[];
  isGenerating: boolean;
  history: Array<{
    id: string;
    timestamp: string;
    action: 'apply' | 'revert';
    suggestion: TailoringSuggestion;
  }>;
  error: string | null;
}

const initialState: TailoringState = {
  jobDescription: '',
  suggestions: [],
  isGenerating: false,
  history: [],
  error: null,
};

// Async thunk for generating AI suggestions
export const generateSuggestions = createAsyncThunk(
  'tailoring/generateSuggestions',
  async ({ 
    resume, 
    jobDescription, 
    provider = 'openai' 
  }: { 
    resume: Resume; 
    jobDescription: string; 
    provider?: string;
  }) => {
    const prompt = buildTailoringPrompt(resume, jobDescription);
    
    // Get API key from localStorage or environment
    const apiKey = localStorage.getItem(`${provider}_api_key`) || 
                   process.env[`${provider.toUpperCase()}_API_KEY`];
    
    if (!apiKey) {
      throw new Error(`API key not found for ${provider}`);
    }
    
    const response = await runAI({
      provider: provider as any,
      model: getDefaultModel(provider),
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and ATS optimization specialist. Analyze the resume and job description to provide specific, actionable suggestions for improvement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      apiKey,
      temperature: 0.3,
      maxTokens: 2000,
    });
    
    return parseSuggestionsResponse(response.text);
  }
);

const tailoringSlice = createSlice({
  name: 'tailoring',
  initialState,
  reducers: {
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload;
      state.suggestions = []; // Clear suggestions when JD changes
    },
    
    applySuggestion: (state, action: PayloadAction<string>) => {
      const suggestion = state.suggestions.find(s => s.id === action.payload);
      if (suggestion) {
        suggestion.applied = true;
        state.history.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          action: 'apply',
          suggestion: { ...suggestion },
        });
      }
    },
    
    revertChange: (state, action: PayloadAction<string>) => {
      const suggestion = state.suggestions.find(s => s.id === action.payload);
      if (suggestion) {
        suggestion.applied = false;
        state.history.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          action: 'revert',
          suggestion: { ...suggestion },
        });
      }
    },
    
    clearSuggestions: (state) => {
      state.suggestions = [];
      state.error = null;
    },
    
    clearHistory: (state) => {
      state.history = [];
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(generateSuggestions.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateSuggestions.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.suggestions = action.payload;
      })
      .addCase(generateSuggestions.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Failed to generate suggestions';
      });
  },
});

// Helper functions
function buildTailoringPrompt(resume: Resume, jobDescription: string): string {
  const resumeText = `
Resume Summary: ${resume.summary || 'No summary provided'}

Experience:
${resume.experiences.map(exp => `
${exp.title} at ${exp.company} (${exp.startDate?.year}-${exp.current ? 'Present' : exp.endDate?.year})
${exp.description}
Achievements:
${exp.bullets.map(bullet => `• ${bullet.text}`).join('\n')}
`).join('\n')}

Skills: ${resume.skills.map(skill => `${skill.category}: ${skill.items.join(', ')}`).join('; ')}

Education: ${resume.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join('; ')}
`;

  return `
Given this resume and job description, provide specific suggestions to improve ATS compatibility and relevance.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please analyze and provide suggestions in the following JSON format:
{
  "suggestions": [
    {
      "id": "unique-id",
      "section": "summary|experience|skills|education",
      "currentText": "exact current text to be replaced",
      "proposedText": "improved version with relevant keywords",
      "rationale": "explanation of why this change improves ATS score",
      "keywordHits": ["keyword1", "keyword2"],
      "confidence": 85
    }
  ]
}

Focus on:
1. Adding relevant keywords from the job description
2. Quantifying achievements where possible
3. Using action verbs that match the job requirements
4. Ensuring technical skills alignment
5. Improving readability and ATS scanning

Return only valid JSON, no additional text.
`;
}

function getDefaultModel(provider: string): string {
  const models = {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-haiku-20240307',
    google: 'gemini-1.5-flash',
    azure: 'gpt-4',
    ollama: 'llama3',
  };
  
  return models[provider as keyof typeof models] || 'gpt-4o-mini';
}

function parseSuggestionsResponse(response: string): TailoringSuggestion[] {
  try {
    // Clean up response if it contains markdown or extra text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    
    const parsed = JSON.parse(jsonStr);
    
    if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions.map((suggestion: any) => ({
        ...suggestion,
        id: suggestion.id || crypto.randomUUID(),
        applied: false,
      }));
    }
    
    // Fallback: try to parse as array directly
    if (Array.isArray(parsed)) {
      return parsed.map((suggestion: any) => ({
        ...suggestion,
        id: suggestion.id || crypto.randomUUID(),
        applied: false,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to parse suggestions response:', error);
    return [];
  }
}

export const {
  setJobDescription,
  applySuggestion,
  revertChange,
  clearSuggestions,
  clearHistory,
} = tailoringSlice.actions;

export default tailoringSlice.reducer;
