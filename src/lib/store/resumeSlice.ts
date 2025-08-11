import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume, createDefaultResume } from '../schema/resume';

export interface ResumeState {
  current: Resume;
  originalResume?: Resume; // For comparison/changes tracking
  isDirty: boolean;
  lastSaved?: string;
  currentSnapshotId?: string;
  isLoading: boolean;
  error?: string;
}

const initialState: ResumeState = {
  current: createDefaultResume(),
  isDirty: false,
  isLoading: false,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Load resume
    loadResume: (state, action: PayloadAction<Resume>) => {
      state.current = action.payload;
      state.originalResume = JSON.parse(JSON.stringify(action.payload));
      state.isDirty = false;
      state.error = undefined;
      state.lastSaved = new Date().toISOString();
    },
    
    // Update basic info
    updateBasicInfo: (state, action: PayloadAction<{
      name?: string;
      title?: string;
      summary?: string;
    }>) => {
      Object.assign(state.current, action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Update contact info
    updateContact: (state, action: PayloadAction<Partial<Resume['contact']>>) => {
      Object.assign(state.current.contact, action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Experience actions
    addExperience: (state, action: PayloadAction<Resume['experiences'][0]>) => {
      state.current.experiences.unshift(action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    updateExperience: (state, action: PayloadAction<{
      id: string;
      updates: Partial<Resume['experiences'][0]>;
    }>) => {
      const index = state.current.experiences.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.current.experiences[index], action.payload.updates);
        state.current.metadata.updatedAt = new Date().toISOString();
        state.isDirty = true;
      }
    },
    
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.current.experiences = state.current.experiences.filter(
        exp => exp.id !== action.payload
      );
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    reorderExperiences: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.current.experiences.splice(fromIndex, 1);
      state.current.experiences.splice(toIndex, 0, removed);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Education actions
    addEducation: (state, action: PayloadAction<Resume['education'][0]>) => {
      state.current.education.push(action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    updateEducation: (state, action: PayloadAction<{
      id: string;
      updates: Partial<Resume['education'][0]>;
    }>) => {
      const index = state.current.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.current.education[index], action.payload.updates);
        state.current.metadata.updatedAt = new Date().toISOString();
        state.isDirty = true;
      }
    },
    
    deleteEducation: (state, action: PayloadAction<string>) => {
      state.current.education = state.current.education.filter(
        edu => edu.id !== action.payload
      );
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Projects actions
    addProject: (state, action: PayloadAction<Resume['projects'][0]>) => {
      state.current.projects.push(action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    updateProject: (state, action: PayloadAction<{
      id: string;
      updates: Partial<Resume['projects'][0]>;
    }>) => {
      const index = state.current.projects.findIndex(proj => proj.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.current.projects[index], action.payload.updates);
        state.current.metadata.updatedAt = new Date().toISOString();
        state.isDirty = true;
      }
    },
    
    deleteProject: (state, action: PayloadAction<string>) => {
      state.current.projects = state.current.projects.filter(
        proj => proj.id !== action.payload
      );
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Skills actions
    addSkillsCategory: (state, action: PayloadAction<Resume['skills'][0]>) => {
      state.current.skills.push(action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    updateSkillsCategory: (state, action: PayloadAction<{
      id: string;
      updates: Partial<Resume['skills'][0]>;
    }>) => {
      const index = state.current.skills.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.current.skills[index], action.payload.updates);
        state.current.metadata.updatedAt = new Date().toISOString();
        state.isDirty = true;
      }
    },
    
    deleteSkillsCategory: (state, action: PayloadAction<string>) => {
      state.current.skills = state.current.skills.filter(
        cat => cat.id !== action.payload
      );
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Bullet point actions
    addBulletPoint: (state, action: PayloadAction<{
      sectionType: 'experiences' | 'projects';
      sectionId: string;
      bullet: Resume['experiences'][0]['bullets'][0];
    }>) => {
      const { sectionType, sectionId, bullet } = action.payload;
      const section = state.current[sectionType].find(item => item.id === sectionId);
      if (section) {
        section.bullets.push(bullet);
        state.current.metadata.updatedAt = new Date().toISOString();
        state.isDirty = true;
      }
    },
    
    updateBulletPoint: (state, action: PayloadAction<{
      sectionType: 'experiences' | 'projects';
      sectionId: string;
      bulletId: string;
      updates: Partial<Resume['experiences'][0]['bullets'][0]>;
    }>) => {
      const { sectionType, sectionId, bulletId, updates } = action.payload;
      const section = state.current[sectionType].find(item => item.id === sectionId);
      if (section) {
        const bulletIndex = section.bullets.findIndex(b => b.id === bulletId);
        if (bulletIndex !== -1) {
          Object.assign(section.bullets[bulletIndex], updates);
          state.current.metadata.updatedAt = new Date().toISOString();
          state.isDirty = true;
        }
      }
    },
    
    deleteBulletPoint: (state, action: PayloadAction<{
      sectionType: 'experiences' | 'projects';
      sectionId: string;
      bulletId: string;
    }>) => {
      const { sectionType, sectionId, bulletId } = action.payload;
      const section = state.current[sectionType].find(item => item.id === sectionId);
      if (section) {
        section.bullets = section.bullets.filter(b => b.id !== bulletId);
        state.current.metadata.updatedAt = new Date().toISOString();
        state.isDirty = true;
      }
    },
    
    // Template and theme
    updateTemplate: (state, action: PayloadAction<string>) => {
      state.current.metadata.template = action.payload;
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    updateTheme: (state, action: PayloadAction<string>) => {
      state.current.metadata.theme = action.payload;
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
    
    // Save state management
    setSaved: (state, action: PayloadAction<{ snapshotId?: string }>) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
      if (action.payload.snapshotId) {
        state.currentSnapshotId = action.payload.snapshotId;
      }
      state.originalResume = JSON.parse(JSON.stringify(state.current));
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    
    // Reset to clean state
    resetResume: (state) => {
      const newResume = createDefaultResume();
      state.current = newResume;
      state.originalResume = JSON.parse(JSON.stringify(newResume));
      state.isDirty = false;
      state.lastSaved = undefined;
      state.currentSnapshotId = undefined;
      state.error = undefined;
    },
    
    // Bulk update for AI suggestions
    applyBulkUpdates: (state, action: PayloadAction<Partial<Resume>>) => {
      Object.assign(state.current, action.payload);
      state.current.metadata.updatedAt = new Date().toISOString();
      state.isDirty = true;
    },
  },
});

export const {
  loadResume,
  updateBasicInfo,
  updateContact,
  addExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  addSkillsCategory,
  updateSkillsCategory,
  deleteSkillsCategory,
  addBulletPoint,
  updateBulletPoint,
  deleteBulletPoint,
  updateTemplate,
  updateTheme,
  setSaved,
  setLoading,
  setError,
  resetResume,
  applyBulkUpdates,
} = resumeSlice.actions;

export default resumeSlice.reducer;

// Selectors
export const selectResume = (state: { resume: ResumeState }) => state.resume.current;
export const selectIsDirty = (state: { resume: ResumeState }) => state.resume.isDirty;
export const selectIsLoading = (state: { resume: ResumeState }) => state.resume.isLoading;
export const selectError = (state: { resume: ResumeState }) => state.resume.error;
export const selectLastSaved = (state: { resume: ResumeState }) => state.resume.lastSaved;
export const selectCurrentSnapshotId = (state: { resume: ResumeState }) => state.resume.currentSnapshotId;
