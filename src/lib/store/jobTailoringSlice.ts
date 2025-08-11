import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AISuggestion, JobAnalysis, ATSScore } from '../ai/types';
import { runAI } from '../ai/run';
import { buildTailorPrompt, buildATSScorePrompt, buildKeywordExtractionPrompt } from '../ai/prompt-templates';
import { Resume } from '../schema/resume';

export interface JobTailoringState {
  jobDescription: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  
  // Analysis results
  analysis?: JobAnalysis;
  suggestions: AISuggestion[];
  atsScore?: ATSScore;
  keywords: string[];
  
  // UI state
  isAnalyzing: boolean;
  isFetchingJob: boolean;
  error?: string;
  
  // Suggestion management
  appliedSuggestions: Set<string>;
  rejectedSuggestions: Set<string>;
  
  // History
  analysisHistory: Array<{
    id: string;
    timestamp: string;
    jobDescription: string;
    companyName: string;
    suggestions: AISuggestion[];
    atsScore?: ATSScore;
  }>;
}

const initialState: JobTailoringState = {
  jobDescription: '',
  companyName: '',
  jobTitle: '',
  suggestions: [],
  keywords: [],
  isAnalyzing: false,
  isFetchingJob: false,
  appliedSuggestions: new Set(),
  rejectedSuggestions: new Set(),
  analysisHistory: [],
};

// Async thunks
export const analyzeJobDescription = createAsyncThunk(
  'jobTailoring/analyzeJobDescription',
  async (
    { resume, jobDescription }: { resume: Resume; jobDescription: string },
    { signal, rejectWithValue }
  ) => {
    try {
      // Extract keywords
      const keywordPrompt = buildKeywordExtractionPrompt(jobDescription);
      const keywordResponse = await runAI({
        messages: keywordPrompt,
        operation: 'extract-keywords',
        signal,
      });
      
      const keywordData = JSON.parse(keywordResponse.text);
      
      // Generate tailoring suggestions
      const tailorPrompt = buildTailorPrompt(resume, jobDescription);
      const tailorResponse = await runAI({
        messages: tailorPrompt,
        operation: 'tailor-resume',
        signal,
      });
      
      const tailorData = JSON.parse(tailorResponse.text);
      
      // Calculate ATS score
      const atsPrompt = buildATSScorePrompt(resume, jobDescription);
      const atsResponse = await runAI({
        messages: atsPrompt,
        operation: 'score-ats',
        signal,
      });
      
      const atsData = JSON.parse(atsResponse.text);
      
      return {
        keywords: keywordData.keywords,
        analysis: keywordData.analysis,
        suggestions: tailorData.suggestions,
        atsScore: atsData,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Analysis failed');
    }
  }
);

export const fetchJobFromUrl = createAsyncThunk(
  'jobTailoring/fetchJobFromUrl',
  async (url: string, { rejectWithValue }) => {
    try {
      // This would need a backend service or browser extension
      // For now, we'll return a placeholder
      return {
        jobDescription: 'Job description fetched from URL would go here',
        companyName: 'Company Name',
        jobTitle: 'Job Title',
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch job description');
    }
  }
);

const jobTailoringSlice = createSlice({
  name: 'jobTailoring',
  initialState,
  reducers: {
    // Job description management
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload;
      state.error = undefined;
    },
    
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.companyName = action.payload;
    },
    
    setJobTitle: (state, action: PayloadAction<string>) => {
      state.jobTitle = action.payload;
    },
    
    setJobUrl: (state, action: PayloadAction<string>) => {
      state.jobUrl = action.payload;
    },
    
    // Suggestion management
    applySuggestion: (state, action: PayloadAction<string>) => {
      const suggestionId = action.payload;
      state.appliedSuggestions.add(suggestionId);
      state.rejectedSuggestions.delete(suggestionId);
      
      // Update suggestion status
      const suggestion = state.suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        suggestion.accepted = true;
      }
    },
    
    rejectSuggestion: (state, action: PayloadAction<string>) => {
      const suggestionId = action.payload;
      state.rejectedSuggestions.add(suggestionId);
      state.appliedSuggestions.delete(suggestionId);
      
      // Update suggestion status
      const suggestion = state.suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        suggestion.accepted = false;
      }
    },
    
    revertSuggestion: (state, action: PayloadAction<string>) => {
      const suggestionId = action.payload;
      state.appliedSuggestions.delete(suggestionId);
      state.rejectedSuggestions.delete(suggestionId);
      
      // Update suggestion status
      const suggestion = state.suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        suggestion.accepted = undefined;
      }
    },
    
    // Bulk suggestion actions
    applyAllSuggestions: (state) => {
      state.suggestions.forEach(suggestion => {
        if (suggestion.accepted === undefined) {
          state.appliedSuggestions.add(suggestion.id);
          suggestion.accepted = true;
        }
      });
    },
    
    rejectAllSuggestions: (state) => {
      state.suggestions.forEach(suggestion => {
        if (suggestion.accepted === undefined) {
          state.rejectedSuggestions.add(suggestion.id);
          suggestion.accepted = false;
        }
      });
    },
    
    // History management
    saveToHistory: (state) => {
      if (state.jobDescription && state.suggestions.length > 0) {
        const historyEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          jobDescription: state.jobDescription,
          companyName: state.companyName,
          suggestions: [...state.suggestions],
          atsScore: state.atsScore,
        };
        
        state.analysisHistory.unshift(historyEntry);
        
        // Keep only last 20 entries
        if (state.analysisHistory.length > 20) {
          state.analysisHistory = state.analysisHistory.slice(0, 20);
        }
      }
    },
    
    loadFromHistory: (state, action: PayloadAction<string>) => {
      const historyEntry = state.analysisHistory.find(entry => entry.id === action.payload);
      if (historyEntry) {
        state.jobDescription = historyEntry.jobDescription;
        state.companyName = historyEntry.companyName;
        state.suggestions = historyEntry.suggestions;
        state.atsScore = historyEntry.atsScore;
        
        // Reset suggestion states
        state.appliedSuggestions.clear();
        state.rejectedSuggestions.clear();
      }
    },
    
    deleteFromHistory: (state, action: PayloadAction<string>) => {
      state.analysisHistory = state.analysisHistory.filter(
        entry => entry.id !== action.payload
      );
    },
    
    // Clear state
    clearAnalysis: (state) => {
      state.suggestions = [];
      state.analysis = undefined;
      state.atsScore = undefined;
      state.keywords = [];
      state.appliedSuggestions.clear();
      state.rejectedSuggestions.clear();
      state.error = undefined;
    },
    
    clearAll: (state) => {
      Object.assign(state, {
        ...initialState,
        analysisHistory: state.analysisHistory, // Keep history
      });
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAnalyzing = false;
      state.isFetchingJob = false;
    },
    
    clearError: (state) => {
      state.error = undefined;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Analyze job description
      .addCase(analyzeJobDescription.pending, (state) => {
        state.isAnalyzing = true;
        state.error = undefined;
      })
      .addCase(analyzeJobDescription.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.analysis = action.payload.analysis;
        state.suggestions = action.payload.suggestions;
        state.atsScore = action.payload.atsScore;
        state.keywords = action.payload.keywords.required || [];
        
        // Reset suggestion states
        state.appliedSuggestions.clear();
        state.rejectedSuggestions.clear();
      })
      .addCase(analyzeJobDescription.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload as string;
      })
      
      // Fetch job from URL
      .addCase(fetchJobFromUrl.pending, (state) => {
        state.isFetchingJob = true;
        state.error = undefined;
      })
      .addCase(fetchJobFromUrl.fulfilled, (state, action) => {
        state.isFetchingJob = false;
        state.jobDescription = action.payload.jobDescription;
        state.companyName = action.payload.companyName;
        state.jobTitle = action.payload.jobTitle;
      })
      .addCase(fetchJobFromUrl.rejected, (state, action) => {
        state.isFetchingJob = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setJobDescription,
  setCompanyName,
  setJobTitle,
  setJobUrl,
  applySuggestion,
  rejectSuggestion,
  revertSuggestion,
  applyAllSuggestions,
  rejectAllSuggestions,
  saveToHistory,
  loadFromHistory,
  deleteFromHistory,
  clearAnalysis,
  clearAll,
  setError,
  clearError,
} = jobTailoringSlice.actions;

export default jobTailoringSlice.reducer;

// Selectors
export const selectJobDescription = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.jobDescription;

export const selectCompanyName = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.companyName;

export const selectSuggestions = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.suggestions;

export const selectPendingSuggestions = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.suggestions.filter(s => s.accepted === undefined);

export const selectAppliedSuggestions = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.suggestions.filter(s => s.accepted === true);

export const selectATSScore = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.atsScore;

export const selectKeywords = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.keywords;

export const selectIsAnalyzing = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.isAnalyzing;

export const selectAnalysisHistory = (state: { jobTailoring: JobTailoringState }) => 
  state.jobTailoring.analysisHistory;
