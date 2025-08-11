import { z } from 'zod';

// Date schema with flexible input formats
export const DateSchema = z.object({
  month: z.string().optional(),
  year: z.string(),
});

// Contact information schema
export const ContactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  location: z.string().optional(),
});

// Experience bullet point schema
export const BulletPointSchema = z.object({
  id: z.string(),
  text: z.string(),
  keywords: z.array(z.string()).default([]),
  metrics: z.object({
    hasMetrics: z.boolean().default(false),
    values: z.array(z.string()).default([]),
  }).optional(),
});

// Work experience schema
export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  startDate: DateSchema,
  endDate: DateSchema.optional(),
  current: z.boolean().default(false),
  bullets: z.array(BulletPointSchema).default([]),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
});

// Project schema
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string().url().optional(),
  github: z.string().url().optional(),
  description: z.string(),
  bullets: z.array(BulletPointSchema).default([]),
  technologies: z.array(z.string()).default([]),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
});

// Education schema
export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
  gpa: z.string().optional(),
  coursework: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});

// Skills category schema
export const SkillsCategorySchema = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(z.string()),
});

// Certification schema
export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: DateSchema.optional(),
  expiryDate: DateSchema.optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
});

// Achievement schema
export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: DateSchema.optional(),
  organization: z.string().optional(),
});

// Main resume schema
export const ResumeSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
  summary: z.string().optional(),
  contact: ContactSchema,
  experiences: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillsCategorySchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  languages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    proficiency: z.string(),
  })).default([]),
  interests: z.array(z.string()).default([]),
  customSections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    bullets: z.array(BulletPointSchema).default([]),
  })).default([]),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string().default('2.0'),
    template: z.string().default('modern-ats'),
    theme: z.string().default('default'),
  }),
});

// Type exports
export type Resume = z.infer<typeof ResumeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SkillsCategory = z.infer<typeof SkillsCategorySchema>;
export type Skill = SkillsCategory; // Alias for backward compatibility  
export type Certification = z.infer<typeof CertificationSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type BulletPoint = z.infer<typeof BulletPointSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type ResumeDate = z.infer<typeof DateSchema>;
export type DateInfo = ResumeDate; // Alias for backward compatibility
export type PersonalInfo = Contact; // Alias for backward compatibility

// Validation helpers
export const validateResume = (data: unknown): Resume => {
  return ResumeSchema.parse(data);
};

export const validatePartialResume = (data: unknown) => {
  return ResumeSchema.partial().safeParse(data);
};

// Default resume template
export const createDefaultResume = (): Resume => ({
  id: crypto.randomUUID(),
  name: 'John Doe',
  title: '',
  summary: '',
  contact: {
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    location: '',
  },
  experiences: [],
  projects: [],
  education: [],
  skills: [],
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
  },
});

// JSON Resume compatibility schema
export const JSONResumeSchema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string().optional(),
    image: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional(),
    summary: z.string().optional(),
    location: z.object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional(),
    }).optional(),
    profiles: z.array(z.object({
      network: z.string(),
      username: z.string(),
      url: z.string().url(),
    })).optional(),
  }),
  work: z.array(z.object({
    name: z.string(),
    position: z.string(),
    url: z.string().url().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
  volunteer: z.array(z.object({
    organization: z.string(),
    position: z.string(),
    url: z.string().url().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string(),
    area: z.string().optional(),
    studyType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    courses: z.array(z.string()).optional(),
  })).optional(),
  awards: z.array(z.object({
    title: z.string(),
    date: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().optional(),
  })).optional(),
  certificates: z.array(z.object({
    name: z.string(),
    date: z.string().optional(),
    issuer: z.string().optional(),
    url: z.string().url().optional(),
  })).optional(),
  publications: z.array(z.object({
    name: z.string(),
    publisher: z.string().optional(),
    releaseDate: z.string().optional(),
    url: z.string().url().optional(),
    summary: z.string().optional(),
  })).optional(),
  skills: z.array(z.object({
    name: z.string(),
    level: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })).optional(),
  languages: z.array(z.object({
    language: z.string(),
    fluency: z.string().optional(),
  })).optional(),
  interests: z.array(z.object({
    name: z.string(),
    keywords: z.array(z.string()).optional(),
  })).optional(),
  references: z.array(z.object({
    name: z.string(),
    reference: z.string(),
  })).optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    url: z.string().url().optional(),
    roles: z.array(z.string()).optional(),
    entity: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
});

export type JSONResume = z.infer<typeof JSONResumeSchema>;
