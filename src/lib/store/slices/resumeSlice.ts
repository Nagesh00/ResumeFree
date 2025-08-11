import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume } from '../../schema/resume';

export interface ResumeState {
  currentResume: Resume;
  history: Resume[];
  savedResumes: Array<{
    id: string;
    name: string;
    data: Resume;
    lastModified: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

const initialResume: Resume = {
  id: '',
  name: '',
  contact: {
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    location: ''
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: [],
  customSections: [],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '2.0',
    template: 'modern-ats',
    theme: 'default',
  }
};

const initialState: ResumeState = {
  currentResume: initialResume,
  history: [],
  savedResumes: [],
  isLoading: false,
  error: null
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateResume: (state, action: PayloadAction<Partial<Resume>>) => {
      state.currentResume = { ...state.currentResume, ...action.payload };
    },
    setResume: (state, action: PayloadAction<Resume>) => {
      state.currentResume = action.payload;
    },
    saveResume: (state) => {
      const resumeToSave = {
        id: state.currentResume.id || Date.now().toString(),
        name: state.currentResume.name || 'Untitled Resume',
        data: state.currentResume,
        lastModified: new Date().toISOString()
      };
      
      const existingIndex = state.savedResumes.findIndex(r => r.id === resumeToSave.id);
      if (existingIndex >= 0) {
        state.savedResumes[existingIndex] = resumeToSave;
      } else {
        state.savedResumes.push(resumeToSave);
      }
    },
    loadResume: (state, action: PayloadAction<string>) => {
      const saved = state.savedResumes.find(r => r.id === action.payload);
      if (saved) {
        state.currentResume = saved.data;
      }
    },
    deleteResume: (state, action: PayloadAction<string>) => {
      state.savedResumes = state.savedResumes.filter(r => r.id !== action.payload);
    },
    addToHistory: (state) => {
      state.history.push({ ...state.currentResume });
      if (state.history.length > 50) {
        state.history.shift();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  updateResume,
  setResume,
  saveResume,
  loadResume,
  deleteResume,
  addToHistory,
  setLoading,
  setError
} = resumeSlice.actions;

export default resumeSlice.reducer;
