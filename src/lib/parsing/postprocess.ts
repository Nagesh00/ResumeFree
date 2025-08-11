import { runAI } from '../ai/run';
import { buildResumeParsePrompt } from '../ai/prompt-templates';
import { Resume, ResumeSchema, validateResume, createDefaultResume } from '../schema/resume';
import { ParseResult } from './heuristics';
import { ExtractedText, LayoutInfo } from './pdf-extract';

export interface PostProcessResult {
  resume: Resume;
  confidence: number;
  improvements: string[];
  warnings: string[];
  validationErrors: string[];
}

// AI-enhanced post-processing of heuristic parse results
export async function postProcessWithAI(
  heuristicResult: ParseResult,
  extractedText: ExtractedText,
  layout?: LayoutInfo,
  signal?: AbortSignal
): Promise<PostProcessResult> {
  const improvements: string[] = [];
  const warnings: string[] = [...heuristicResult.warnings];
  const validationErrors: string[] = [];
  
  try {
    // Build AI prompt with extracted text and layout info
    const prompt = buildResumeParsePrompt(
      extractedText.text,
      layout ? { sections: layout.sections, fontSizes: layout.fontSizes } : undefined
    );
    
    // Run AI processing
    const aiResponse = await runAI({
      messages: prompt,
      operation: 'parse-resume',
      signal,
    });
    
    // Parse AI response
    let aiResume: Resume;
    try {
      const parsed = JSON.parse(aiResponse.text);
      aiResume = validateResume(parsed);
      improvements.push('AI successfully enhanced resume structure');
    } catch (error) {
      warnings.push('AI response parsing failed, using heuristic result');
      return {
        resume: heuristicResult.resume,
        confidence: heuristicResult.confidence * 0.8, // Reduce confidence
        improvements,
        warnings,
        validationErrors: error instanceof Error ? [error.message] : ['Unknown validation error'],
      };
    }
    
    // Merge heuristic and AI results intelligently
    const mergedResume = mergeResumeResults(heuristicResult.resume, aiResume, improvements);
    
    // Validate final result
    const validation = ResumeSchema.safeParse(mergedResume);
    if (!validation.success) {
      validation.error.errors.forEach(err => {
        validationErrors.push(`${err.path.join('.')}: ${err.message}`);
      });
    }
    
    // Calculate final confidence
    const confidence = calculatePostProcessConfidence(
      heuristicResult.confidence,
      aiResponse,
      validationErrors.length,
      improvements.length
    );
    
    return {
      resume: mergedResume,
      confidence,
      improvements,
      warnings,
      validationErrors,
    };
    
  } catch (error) {
    warnings.push(`AI post-processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      resume: heuristicResult.resume,
      confidence: heuristicResult.confidence * 0.9,
      improvements,
      warnings,
      validationErrors,
    };
  }
}

// Intelligent merging of heuristic and AI results
function mergeResumeResults(
  heuristicResume: Resume,
  aiResume: Resume,
  improvements: string[]
): Resume {
  const merged = { ...heuristicResume };
  
  // Name: Prefer AI if it looks more complete
  if (aiResume.name && aiResume.name.split(' ').length >= 2 && 
      (!heuristicResume.name || heuristicResume.name.split(' ').length < 2)) {
    merged.name = aiResume.name;
    improvements.push('Improved name extraction');
  }
  
  // Title: Prefer AI if present and reasonable
  if (aiResume.title && aiResume.title.length > 0 && aiResume.title.length < 100) {
    merged.title = aiResume.title;
    improvements.push('Added professional title');
  }
  
  // Summary: Prefer AI if more comprehensive
  if (aiResume.summary && aiResume.summary.length > (heuristicResume.summary?.length || 0)) {
    merged.summary = aiResume.summary;
    improvements.push('Enhanced professional summary');
  }
  
  // Contact: Merge with preference for completeness
  merged.contact = mergeContactInfo(heuristicResume.contact, aiResume.contact, improvements);
  
  // Experience: Use AI if significantly better structured
  if (aiResume.experiences.length > 0 && 
      (heuristicResume.experiences.length === 0 || 
       aiResume.experiences.every(exp => exp.company && exp.title))) {
    merged.experiences = aiResume.experiences;
    improvements.push('Improved work experience parsing');
  } else if (heuristicResume.experiences.length > 0) {
    // Merge experience details
    merged.experiences = mergeExperiences(heuristicResume.experiences, aiResume.experiences, improvements);
  }
  
  // Education: Similar logic
  if (aiResume.education.length > 0 && 
      (heuristicResume.education.length === 0 || 
       aiResume.education.every(edu => edu.institution && edu.degree))) {
    merged.education = aiResume.education;
    improvements.push('Improved education parsing');
  }
  
  // Skills: Merge categories intelligently
  if (aiResume.skills.length > 0) {
    merged.skills = mergeSkills(heuristicResume.skills, aiResume.skills, improvements);
  }
  
  // Projects: Use AI if better structured
  if (aiResume.projects.length > 0 && 
      aiResume.projects.every(proj => proj.name && proj.description)) {
    merged.projects = aiResume.projects;
    improvements.push('Improved projects parsing');
  }
  
  // Certifications and achievements: Prefer AI if present
  if (aiResume.certifications.length > 0) {
    merged.certifications = aiResume.certifications;
    improvements.push('Added certifications');
  }
  
  if (aiResume.achievements.length > 0) {
    merged.achievements = aiResume.achievements;
    improvements.push('Added achievements');
  }
  
  return merged;
}

// Merge contact information
function mergeContactInfo(heuristic: any, ai: any, improvements: string[]): any {
  const merged = { ...heuristic };
  
  // Email: Prefer valid format
  if (ai.email && isValidEmail(ai.email) && !merged.email) {
    merged.email = ai.email;
    improvements.push('Added email address');
  }
  
  // Phone: Prefer formatted version
  if (ai.phone && !merged.phone) {
    merged.phone = ai.phone;
    improvements.push('Added phone number');
  }
  
  // LinkedIn: Prefer valid URL
  if (ai.linkedin && isValidUrl(ai.linkedin) && !merged.linkedin) {
    merged.linkedin = ai.linkedin;
    improvements.push('Added LinkedIn profile');
  }
  
  // GitHub: Prefer valid URL
  if (ai.github && isValidUrl(ai.github) && !merged.github) {
    merged.github = ai.github;
    improvements.push('Added GitHub profile');
  }
  
  // Location: Prefer more specific
  if (ai.location && ai.location.length > (merged.location?.length || 0)) {
    merged.location = ai.location;
    improvements.push('Improved location information');
  }
  
  return merged;
}

// Merge experience arrays
function mergeExperiences(heuristicExp: any[], aiExp: any[], improvements: string[]): any[] {
  if (aiExp.length === 0) return heuristicExp;
  if (heuristicExp.length === 0) return aiExp;
  
  // Try to match experiences by company/title similarity
  const merged = [...heuristicExp];
  
  aiExp.forEach(aiExperience => {
    const matching = merged.find(hExp => 
      (aiExperience.company && hExp.company && 
       similarity(aiExperience.company.toLowerCase(), hExp.company.toLowerCase()) > 0.8) ||
      (aiExperience.title && hExp.title && 
       similarity(aiExperience.title.toLowerCase(), hExp.title.toLowerCase()) > 0.8)
    );
    
    if (matching) {
      // Merge details
      if (aiExperience.bullets && aiExperience.bullets.length > matching.bullets.length) {
        matching.bullets = aiExperience.bullets;
        improvements.push('Enhanced experience bullets');
      }
    } else {
      // Add new experience
      merged.push(aiExperience);
      improvements.push('Added missing work experience');
    }
  });
  
  return merged;
}

// Merge skills categories
function mergeSkills(heuristicSkills: any[], aiSkills: any[], improvements: string[]): any[] {
  const merged = [...heuristicSkills];
  
  aiSkills.forEach(aiCategory => {
    const existingCategory = merged.find(hCat => 
      similarity(aiCategory.category.toLowerCase(), hCat.category.toLowerCase()) > 0.7
    );
    
    if (existingCategory) {
      // Merge items, avoiding duplicates
      const newItems = aiCategory.items.filter((item: string) => 
        !existingCategory.items.some((existing: string) => 
          similarity(item.toLowerCase(), existing.toLowerCase()) > 0.9
        )
      );
      
      if (newItems.length > 0) {
        existingCategory.items.push(...newItems);
        improvements.push(`Added skills to ${aiCategory.category}`);
      }
    } else {
      // Add new category
      merged.push(aiCategory);
      improvements.push(`Added ${aiCategory.category} skills category`);
    }
  });
  
  return merged;
}

// Calculate post-processing confidence
function calculatePostProcessConfidence(
  heuristicConfidence: number,
  aiResponse: any,
  validationErrors: number,
  improvements: number
): number {
  let confidence = heuristicConfidence;
  
  // Boost for successful AI processing
  if (aiResponse.text && improvements > 0) {
    confidence += 0.2;
  }
  
  // Reduce for validation errors
  confidence -= validationErrors * 0.05;
  
  // Boost for improvements
  confidence += improvements * 0.02;
  
  return Math.min(Math.max(confidence, 0.1), 1.0);
}

// Utility functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function similarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(0).map(() => Array(str1.length + 1).fill(0));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1, // deletion
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Fallback parsing for when AI fails
export function createFallbackResume(extractedText: ExtractedText): Resume {
  const resume = createDefaultResume();
  
  // Basic text analysis
  const lines = extractedText.text.split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length > 0) {
    // First non-empty line might be name
    resume.name = lines[0];
  }
  
  // Look for email
  const emailMatch = extractedText.text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    resume.contact.email = emailMatch[0];
  }
  
  // Basic sections
  if (extractedText.text.toLowerCase().includes('experience')) {
    resume.customSections.push({
      id: crypto.randomUUID(),
      title: 'Experience',
      content: 'Experience section detected but could not be parsed automatically.',
      bullets: [],
    });
  }
  
  return resume;
}

// Main parsing function for API
export async function parseResumeContent(options: {
  text: string;
  provider: string;
  apiKey: string;
  redactPII: boolean;
}): Promise<{
  resume: any;
  confidence: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
  };
}> {
  const { text, provider, apiKey, redactPII } = options;
  
  if (provider === 'basic' || !provider) {
    // Basic parsing without AI
    const basicResume = parseBasicResume(text);
    return {
      resume: basicResume,
      confidence: {
        personalInfo: 70,
        experience: 50,
        education: 50,
        skills: 60
      }
    };
  }

  try {
    // AI-enhanced parsing
    const prompt = `
Parse this resume text and extract structured information. Return a JSON object with the following structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "summary": "string"
  },
  "experiences": [
    {
      "id": "string",
      "company": "string",
      "position": "string", 
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or current",
      "current": boolean,
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "id": "string",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "location": "string", 
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string",
      "honors": ["string"]
    }
  ],
  "skills": [
    {
      "id": "string",
      "name": "string",
      "category": "Technical|Soft|Language|Certification",
      "level": "Beginner|Intermediate|Advanced|Expert",
      "keywords": ["string"]
    }
  ]
}

Resume text to parse:
${redactPII ? text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') : text}

Respond with valid JSON only.
`;

    const result = await runAI({
      provider: provider as any,
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      maxTokens: 2000,
    });

    try {
      const parsed = JSON.parse(result.text);
      
      // Add unique IDs if missing
      if (parsed.experiences) {
        parsed.experiences = parsed.experiences.map((exp: any) => ({
          ...exp,
          id: exp.id || `exp_${Date.now()}_${Math.random()}`
        }));
      }
      
      if (parsed.education) {
        parsed.education = parsed.education.map((edu: any) => ({
          ...edu,
          id: edu.id || `edu_${Date.now()}_${Math.random()}`
        }));
      }
      
      if (parsed.skills) {
        parsed.skills = parsed.skills.map((skill: any) => ({
          ...skill,
          id: skill.id || `skill_${Date.now()}_${Math.random()}`
        }));
      }

      // Calculate confidence scores based on completeness
      const confidence = {
        personalInfo: calculateConfidence(parsed.personalInfo, ['fullName', 'email']),
        experience: parsed.experiences?.length > 0 ? 90 : 20,
        education: parsed.education?.length > 0 ? 85 : 30,
        skills: parsed.skills?.length > 0 ? 90 : 25
      };

      return { resume: parsed, confidence };

    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      // Fallback to basic parsing
      const basicResume = parseBasicResume(text);
      return {
        resume: basicResume,
        confidence: {
          personalInfo: 60,
          experience: 40,
          education: 40,
          skills: 50
        }
      };
    }

  } catch (error) {
    console.error('AI parsing failed:', error);
    // Fallback to basic parsing
    const basicResume = parseBasicResume(text);
    return {
      resume: basicResume,
      confidence: {
        personalInfo: 50,
        experience: 30,
        education: 30,
        skills: 40
      }
    };
  }
}

function parseBasicResume(text: string) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  
  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';
  
  // Extract name (first few lines, excluding email/phone)
  const lines = text.split('\n').filter(line => line.trim());
  const nameCandidate = lines.find(line => 
    !emailRegex.test(line) && 
    !phoneRegex.test(line) && 
    line.length > 2 && 
    line.length < 50 &&
    !/\d/.test(line) // Avoid lines with numbers
  ) || '';

  return {
    personalInfo: {
      fullName: nameCandidate,
      email: email,
      phone: phone,
      location: '',
      summary: ''
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };
}

function calculateConfidence(obj: any, requiredFields: string[]): number {
  if (!obj) return 0;
  
  const totalFields = Object.keys(obj).length;
  const filledRequired = requiredFields.filter(field => obj[field] && obj[field].trim()).length;
  const filledTotal = Object.values(obj).filter(val => val && typeof val === 'string' && val.trim()).length;
  
  const requiredScore = (filledRequired / requiredFields.length) * 70;
  const completenessScore = (filledTotal / totalFields) * 30;
  
  return Math.round(requiredScore + completenessScore);
}
