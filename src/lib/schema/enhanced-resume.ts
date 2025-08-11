/**
 * Enhanced Resume Schema with Extended Features
 * Complete schema supporting all advanced features as specified
 */

import { z } from 'zod';

// Base types
export const DateSchema = z.object({
  year: z.number().min(1900).max(2030),
  month: z.number().min(1).max(12).optional(),
});

export const BulletSchema = z.object({
  id: z.string(),
  text: z.string(),
  keywords: z.array(z.string()).optional(),
  atsScore: z.number().min(0).max(100).optional(),
  aiGenerated: z.boolean().optional(),
});

// Contact Information
export const ContactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
  portfolio: z.string().url().optional(),
});

// Professional Experience
export const ExperienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  url: z.string().url().optional(),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  bullets: z.array(BulletSchema).default([]),
  technologies: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  // Enhanced fields for AI and ATS
  industryKeywords: z.array(z.string()).default([]),
  impactMetrics: z.array(z.string()).default([]),
  atsOptimized: z.boolean().default(false),
  aiEnhanced: z.boolean().default(false),
});

// Education
export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  location: z.string().optional(),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  honors: z.array(z.string()).default([]),
  courses: z.array(z.string()).default([]),
  thesis: z.string().optional(),
  activities: z.array(z.string()).default([]),
});

// Skills with categories and proficiency
export const SkillSchema = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(z.string()),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  yearsOfExperience: z.number().optional(),
  lastUsed: DateSchema.optional(),
  certified: z.boolean().default(false),
  trending: z.boolean().default(false),
});

// Projects
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
  current: z.boolean().default(false),
  link: z.string().url().optional(),
  github: z.string().url().optional(),
  technologies: z.array(z.string()).default([]),
  bullets: z.array(BulletSchema).default([]),
  team: z.array(z.string()).default([]),
  role: z.string().optional(),
  featured: z.boolean().default(false),
});

// Certifications
export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: DateSchema.optional(),
  expiryDate: DateSchema.optional(),
  url: z.string().url().optional(),
  credentialId: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
});

// Awards and Achievements
export const AwardSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: DateSchema.optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  category: z.enum(['Academic', 'Professional', 'Community', 'Technical', 'Leadership']).optional(),
  significance: z.enum(['Local', 'Regional', 'National', 'International']).optional(),
});

// Publications
export const PublicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  publication: z.string(),
  date: DateSchema.optional(),
  url: z.string().url().optional(),
  doi: z.string().optional(),
  abstract: z.string().optional(),
  citations: z.number().optional(),
  type: z.enum(['Journal', 'Conference', 'Book', 'Preprint', 'Patent']).optional(),
});

// Languages
export const LanguageSchema = z.object({
  id: z.string(),
  language: z.string(),
  proficiency: z.enum(['Basic', 'Conversational', 'Fluent', 'Native']),
  certified: z.boolean().default(false),
  certification: z.string().optional(),
});

// Volunteer Experience
export const VolunteerSchema = z.object({
  id: z.string(),
  organization: z.string(),
  role: z.string(),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  bullets: z.array(BulletSchema).default([]),
  hoursPerWeek: z.number().optional(),
  cause: z.string().optional(),
});

// ATS and Job Tailoring
export const ATSAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  keywordMatch: z.number().min(0).max(100),
  formatScore: z.number().min(0).max(100),
  contentScore: z.number().min(0).max(100),
  suggestions: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  overusedKeywords: z.array(z.string()),
  sectionScores: z.record(z.number()),
  lastAnalyzed: z.date(),
});

export const JobTailoringSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  jobDescription: z.string(),
  targetKeywords: z.array(z.string()),
  tailoredSections: z.array(z.string()),
  atsAnalysis: ATSAnalysisSchema.optional(),
  confidenceScore: z.number().min(0).max(100),
  lastUpdated: z.date(),
});

// AI Enhancement Tracking
export const AIEnhancementSchema = z.object({
  sectionId: z.string(),
  sectionType: z.string(),
  originalContent: z.string(),
  enhancedContent: z.string(),
  provider: z.string(),
  model: z.string(),
  timestamp: z.date(),
  confidence: z.number().min(0).max(1),
  feedback: z.enum(['accepted', 'rejected', 'modified']).optional(),
  improvementAreas: z.array(z.string()),
});

// Template and Styling
export const TemplateSettingsSchema = z.object({
  templateId: z.string(),
  colorScheme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    text: z.string(),
    background: z.string(),
  }),
  typography: z.object({
    fontFamily: z.string(),
    fontSize: z.number(),
    lineHeight: z.number(),
    fontWeight: z.string(),
  }),
  layout: z.object({
    columns: z.number().min(1).max(3),
    spacing: z.string(),
    margins: z.string(),
    headerStyle: z.string(),
  }),
  customCSS: z.string().optional(),
});

// Collaboration and Versioning
export const CollaborationSchema = z.object({
  isShared: z.boolean().default(false),
  shareId: z.string().optional(),
  collaborators: z.array(z.object({
    email: z.string().email(),
    role: z.enum(['viewer', 'editor', 'admin']),
    joinedAt: z.date(),
  })).default([]),
  permissions: z.object({
    allowCopy: z.boolean().default(true),
    allowDownload: z.boolean().default(true),
    allowComments: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
  }),
});

export const VersionSchema = z.object({
  id: z.string(),
  version: z.string(),
  timestamp: z.date(),
  author: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  isAutoSave: z.boolean().default(false),
  changes: z.array(z.object({
    section: z.string(),
    type: z.enum(['added', 'modified', 'deleted']),
    description: z.string(),
  })).default([]),
});

// Privacy and Data Settings
export const PrivacySettingsSchema = z.object({
  dataCollection: z.boolean().default(false),
  analytics: z.boolean().default(false),
  aiProcessing: z.boolean().default(true),
  cloudSync: z.boolean().default(false),
  shareAnalytics: z.boolean().default(false),
  retentionPeriod: z.number().default(365), // days
  exportOnDelete: z.boolean().default(true),
});

// Main Resume Schema
export const ResumeSchema = z.object({
  // Basic Information
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  contact: ContactSchema,

  // Core Sections
  experiences: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),

  // Additional Sections
  certifications: z.array(CertificationSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  publications: z.array(PublicationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  volunteer: z.array(VolunteerSchema).default([]),

  // Advanced Features
  jobTailoring: z.array(JobTailoringSchema).default([]),
  aiEnhancements: z.array(AIEnhancementSchema).default([]),
  templateSettings: TemplateSettingsSchema.optional(),
  collaboration: CollaborationSchema.optional(),
  versions: z.array(VersionSchema).default([]),
  privacySettings: PrivacySettingsSchema.default({}),

  // Metadata
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  lastAIAnalysis: z.date().optional(),
  totalWordCount: z.number().optional(),
  readingTime: z.number().optional(), // in minutes
  
  // Feature Flags
  features: z.object({
    aiAssistant: z.boolean().default(true),
    atsOptimization: z.boolean().default(true),
    collaboration: z.boolean().default(false),
    versionControl: z.boolean().default(true),
    exportFormats: z.array(z.string()).default(['pdf', 'docx', 'json']),
  }).default({}),
});

// Type exports
export type Resume = z.infer<typeof ResumeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Award = z.infer<typeof AwardSchema>;
export type Publication = z.infer<typeof PublicationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Volunteer = z.infer<typeof VolunteerSchema>;
export type ATSAnalysis = z.infer<typeof ATSAnalysisSchema>;
export type JobTailoring = z.infer<typeof JobTailoringSchema>;
export type AIEnhancement = z.infer<typeof AIEnhancementSchema>;
export type TemplateSettings = z.infer<typeof TemplateSettingsSchema>;
export type Collaboration = z.infer<typeof CollaborationSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Bullet = z.infer<typeof BulletSchema>;
export type DateType = z.infer<typeof DateSchema>;

// Validation helpers
export const validateResume = (data: unknown): Resume => {
  return ResumeSchema.parse(data);
};

export const validatePartialResume = (data: unknown): Partial<Resume> => {
  return ResumeSchema.partial().parse(data);
};

// Default resume template
export const createEmptyResume = (): Resume => {
  return ResumeSchema.parse({
    contact: {},
  });
};

// Schema version for migration purposes
export const SCHEMA_VERSION = '2.0.0';

// Export validation functions for specific sections
export const validateSection = {
  experience: (data: unknown) => ExperienceSchema.parse(data),
  education: (data: unknown) => EducationSchema.parse(data),
  skill: (data: unknown) => SkillSchema.parse(data),
  project: (data: unknown) => ProjectSchema.parse(data),
  certification: (data: unknown) => CertificationSchema.parse(data),
  award: (data: unknown) => AwardSchema.parse(data),
  publication: (data: unknown) => PublicationSchema.parse(data),
  language: (data: unknown) => LanguageSchema.parse(data),
  volunteer: (data: unknown) => VolunteerSchema.parse(data),
};
