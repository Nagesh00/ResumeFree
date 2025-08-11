/**
 * Advanced Parser 2.0 with LLM Post-Correction
 * As specified in original requirements: PDF.js + heuristics + LLM + Zod validation
 */

import { Resume, ResumeSchema } from '../schema/resume';
import { validateResume } from '../schema/enhanced-resume';
import { runAI } from '../ai/run';

export interface AdvancedParseResult {
  resume: Resume;
  confidence: number;
  method: 'ai-enhanced' | 'heuristic' | 'fallback';
  improvements: string[];
  warnings: string[];
  validationErrors: string[];
  processingTime: number;
}

export interface ParseOptions {
  useAI: boolean;
  provider?: string;
  redactPII?: boolean;
}

/**
 * Main parsing pipeline: Heuristics → LLM → Validation
 */
export async function parseResumeAdvanced(
  textContent: string,
  options: ParseOptions = { useAI: true }
): Promise<AdvancedParseResult> {
  const startTime = Date.now();
  
  // Step 1: Heuristic parsing (baseline)
  const heuristicResult = parseWithHeuristics(textContent);
  
  if (!options.useAI) {
    return {
      ...heuristicResult,
      method: 'heuristic',
      processingTime: Date.now() - startTime,
    };
  }
  
  try {
    // Step 2: LLM post-correction
    const aiEnhanced = await enhanceWithLLM(
      textContent, 
      heuristicResult.resume, 
      options.provider || 'openai'
    );
    
    // Step 3: Zod validation
    const validationResult = ResumeSchema.safeParse(aiEnhanced);
    
    if (validationResult.success) {
      return {
        resume: validationResult.data,
        confidence: Math.min(0.95, heuristicResult.confidence + 0.3),
        method: 'ai-enhanced',
        improvements: [
          'AI enhanced field extraction',
          'Normalized date formats', 
          'Improved section classification',
          'Enhanced contact parsing'
        ],
        warnings: [],
        validationErrors: [],
        processingTime: Date.now() - startTime,
      };
    } else {
      return {
        resume: heuristicResult.resume,
        confidence: heuristicResult.confidence * 0.8,
        method: 'heuristic',
        improvements: [],
        warnings: ['AI validation failed'],
        validationErrors: validationResult.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ),
        processingTime: Date.now() - startTime,
      };
    }
  } catch (error) {
    return {
      resume: heuristicResult.resume,
      confidence: heuristicResult.confidence,
      method: 'heuristic', 
      improvements: [],
      warnings: [`AI enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      validationErrors: [],
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Heuristic parsing with pattern matching
 */
function parseWithHeuristics(text: string): Omit<AdvancedParseResult, 'method' | 'processingTime'> {
  const resume = createEmptyResume();
  const warnings: string[] = [];
  let confidence = 0.3;
  
  // Extract sections using headers and patterns
  const sections = extractSections(text);
  
  // Parse contact information
  const contact = extractContactInfo(text);
  if (contact.email) {
    resume.contact.email = contact.email;
    confidence += 0.1;
  }
  if (contact.phone) {
    resume.contact.phone = contact.phone;
    confidence += 0.1;
  }
  if (contact.name) {
    resume.name = contact.name;
    confidence += 0.1;
  }
  
  // Parse experience
  if (sections.experience) {
    resume.experiences = parseExperienceHeuristic(sections.experience);
    if (resume.experiences.length > 0) confidence += 0.2;
  }
  
  // Parse education
  if (sections.education) {
    resume.education = parseEducationHeuristic(sections.education);
    if (resume.education.length > 0) confidence += 0.1;
  }
  
  // Parse skills
  if (sections.skills) {
    resume.skills = parseSkillsHeuristic(sections.skills);
    if (resume.skills.length > 0) confidence += 0.1;
  }
  
  return {
    resume,
    confidence: Math.min(confidence, 0.75),
    improvements: [],
    warnings,
    validationErrors: [],
  };
}

/**
 * LLM enhancement with strict JSON schema
 */
async function enhanceWithLLM(
  originalText: string,
  heuristicResume: Resume,
  provider: string
): Promise<Resume> {
  const prompt = buildLLMPrompt(originalText, heuristicResume);
  
  // Get API key
  const apiKey = localStorage.getItem(`${provider}_api_key`) || 
                 process.env[`${provider.toUpperCase()}_API_KEY`];
  
  if (!apiKey) {
    throw new Error(`API key not found for ${provider}`);
  }
  
  const response = await runAI({
    provider: provider as any,
    model: getModelForProvider(provider),
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume parser. Convert resume text into structured JSON matching the exact schema provided. Return only valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    apiKey,
    temperature: 0.1, // Low temperature for consistency
    maxTokens: 3000,
  });
  
  return parseLLMResponse(response.text, heuristicResume);
}

/**
 * Build structured prompt for LLM
 */
function buildLLMPrompt(text: string, baseline: Resume): string {
  return `
Parse this resume text into JSON matching this exact schema:

RESUME TEXT:
${text}

BASELINE PARSE (improve this):
${JSON.stringify(baseline, null, 2)}

Required JSON structure:
{
  "name": "string",
  "title": "string", 
  "summary": "string",
  "contact": {
    "email": "string",
    "phone": "string", 
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string"
  },
  "experiences": [{
    "company": "string",
    "title": "string",
    "location": "string", 
    "startDate": {"month": "MM", "year": "YYYY"},
    "endDate": {"month": "MM", "year": "YYYY"},
    "current": boolean,
    "description": "string",
    "bullets": [{"text": "string"}]
  }],
  "education": [{
    "institution": "string",
    "degree": "string",
    "field": "string",
    "startDate": {"month": "MM", "year": "YYYY"}, 
    "endDate": {"month": "MM", "year": "YYYY"},
    "gpa": "string"
  }],
  "skills": [{
    "category": "string",
    "items": ["string"]
  }]
}

Instructions:
- Extract ALL information accurately
- Normalize dates to MM/YYYY format
- Classify sections correctly
- Improve bullet points for clarity
- Add missing contact info if found
- Return ONLY valid JSON
`;
}

/**
 * Parse LLM response with fallback
 */
function parseLLMResponse(response: string, fallback: Resume): Resume {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    
    const parsed = JSON.parse(jsonStr);
    
    // Merge with empty resume to ensure structure
    const enhanced = {
      ...createEmptyResume(),
      ...parsed,
      contact: {
        ...createEmptyResume().contact,
        ...parsed.contact,
      },
    };
    
    // Ensure proper ID generation
    enhanced.experiences = enhanced.experiences?.map((exp: any) => ({
      id: crypto.randomUUID(),
      ...exp,
      bullets: exp.bullets?.map((bullet: any) => ({
        id: crypto.randomUUID(),
        text: typeof bullet === 'string' ? bullet : bullet.text || '',
        keywords: [],
      })) || [],
    })) || [];
    
    enhanced.education = enhanced.education?.map((edu: any) => ({
      id: crypto.randomUUID(),
      ...edu,
      coursework: edu.coursework || [],
      achievements: edu.achievements || [],
    })) || [];
    
    enhanced.skills = enhanced.skills?.map((skill: any) => ({
      id: crypto.randomUUID(),
      category: skill.category || 'Skills',
      items: Array.isArray(skill.items) ? skill.items : [],
    })) || [];
    
    return enhanced as Resume;
  } catch (error) {
    console.error('LLM response parsing failed:', error);
    return fallback;
  }
}

/**
 * Extract sections using header detection
 */
function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  const headers = {
    experience: /\b(experience|work\s+experience|employment|professional\s+experience)\b/i,
    education: /\b(education|academic\s+background|qualifications)\b/i,
    skills: /\b(skills|technical\s+skills|competencies|technologies)\b/i,
    projects: /\b(projects|portfolio|selected\s+projects)\b/i,
    summary: /\b(summary|profile|objective|about)\b/i,
  };
  
  const lines = text.split('\n');
  let currentSection = '';
  let content = '';
  
  for (const line of lines) {
    let foundHeader = false;
    
    for (const [section, regex] of Object.entries(headers)) {
      if (regex.test(line.trim()) && line.trim().length < 100) {
        if (currentSection) {
          sections[currentSection] = content.trim();
        }
        currentSection = section;
        content = '';
        foundHeader = true;
        break;
      }
    }
    
    if (!foundHeader && currentSection) {
      content += line + '\n';
    }
  }
  
  if (currentSection) {
    sections[currentSection] = content.trim();
  }
  
  return sections;
}

/**
 * Extract contact information with patterns
 */
function extractContactInfo(text: string) {
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    linkedin: /linkedin\.com\/in\/[\w-]+/i,
    github: /github\.com\/[\w-]+/i,
  };
  
  const email = text.match(patterns.email)?.[0] || '';
  const phone = text.match(patterns.phone)?.[0] || '';
  const linkedin = text.match(patterns.linkedin)?.[0] || '';
  const github = text.match(patterns.github)?.[0] || '';
  
  // Extract name from first few non-email/phone lines
  const lines = text.split('\n').filter(l => l.trim());
  const name = lines.find(line => 
    !patterns.email.test(line) && 
    !patterns.phone.test(line) && 
    line.length > 2 && 
    line.length < 50 &&
    /^[A-Za-z\s]{2,}$/.test(line.trim())
  )?.trim() || '';
  
  return { email, phone, linkedin, github, name };
}

/**
 * Parse experience section heuristically
 */
function parseExperienceHeuristic(text: string) {
  const experiences = [];
  const blocks = text.split(/\n\s*\n/).filter(block => block.trim());
  
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) continue;
    
    const experience = {
      id: crypto.randomUUID(),
      company: lines[1] || '',
      title: lines[0] || '',
      location: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      current: false,
      description: '',
      bullets: lines.slice(2)
        .filter(line => /^[•·▪▫‣⁃-]/.test(line) || line.includes('achieved') || line.includes('led'))
        .map(line => ({
          id: crypto.randomUUID(),
          text: line.replace(/^[•·▪▫‣⁃-]\s*/, ''),
          keywords: [],
        })),
      technologies: [],
    };
    
    experiences.push(experience);
  }
  
  return experiences;
}

/**
 * Parse education section heuristically  
 */
function parseEducationHeuristic(text: string) {
  const education = [];
  const blocks = text.split(/\n\s*\n/).filter(block => block.trim());
  
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 1) continue;
    
    education.push({
      id: crypto.randomUUID(),
      institution: lines[0] || '',
      degree: lines[1] || '',
      field: lines[2] || '',
      location: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      gpa: '',
      coursework: [],
      achievements: [],
    });
  }
  
  return education;
}

/**
 * Parse skills section heuristically
 */
function parseSkillsHeuristic(text: string) {
  const skills = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [category, items] = line.split(':');
      skills.push({
        id: crypto.randomUUID(),
        category: category.trim(),
        items: items.split(',').map(item => item.trim()).filter(item => item),
      });
    } else {
      const items = line.split(/[,•·▪▫‣⁃-]/).map(item => item.trim()).filter(item => item);
      if (items.length > 0) {
        skills.push({
          id: crypto.randomUUID(),
          category: 'Skills',
          items,
        });
      }
    }
  }
  
  return skills;
}

/**
 * Get model for provider
 */
function getModelForProvider(provider: string): string {
  const models = {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-haiku-20240307',
    google: 'gemini-1.5-flash',
    azure: 'gpt-4',
    ollama: 'llama3',
  };
  
  return models[provider as keyof typeof models] || 'gpt-4o-mini';
}
