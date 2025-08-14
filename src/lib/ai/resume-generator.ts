import { runAI } from './run';
import { Resume } from '../schema/resume';
import { AIProviderType } from './types';

// Default models for each provider
const getDefaultModel = (provider: AIProviderType): string => {
  switch (provider) {
    case 'openai':
      return 'gpt-3.5-turbo';
    case 'anthropic':
      return 'claude-3-haiku-20240307';
    case 'google':
      return 'gemini-pro';
    case 'azure':
      return 'gpt-35-turbo';
    case 'ollama':
      return 'llama2';
    case 'perplexity':
      return 'llama-3-sonar-small-32k-online';
    default:
      return 'gpt-3.5-turbo';
  }
};

export interface ResumeGenerationOptions {
  section: 'summary' | 'experience' | 'skills' | 'education';
  context: string;
  existingResume: Resume;
  provider: AIProviderType;
  jobDescription?: string;
}

export interface ResumeGenerationResult {
  content: string;
  suggestions?: string[];
  keywords?: string[];
}

const RESUME_PROMPTS = {
  summary: (context: string, resume: Resume) => `
You are a professional resume writer. Write a compelling professional summary for a resume.

Context: ${context}
Current Role/Title: ${resume.name || 'Professional'}
Experience: ${resume.experiences.length} positions
Skills: ${resume.skills.map(s => s.category + ': ' + s.items.join(', ')).join('; ')}

Write a 2-3 sentence professional summary that:
- Highlights key strengths and expertise
- Mentions years of experience if applicable
- Includes relevant keywords
- Is ATS-friendly and compelling

Return only the summary text, no additional formatting.
`,

  experience: (context: string, resume: Resume) => `
You are a professional resume writer. Improve this work experience description to make it more impactful and ATS-friendly.

Position Context: ${context}
Current Description: [Current experience description if any]

Create bullet points that:
- Start with strong action verbs
- Include quantifiable achievements where possible
- Use relevant industry keywords
- Follow the STAR method (Situation, Task, Action, Result)
- Are ATS-optimized

Return 3-5 bullet points, each starting with a dash (-).
`,

  skills: (context: string, resume: Resume) => `
You are a professional resume writer. Suggest relevant skills for this professional.

Context: ${context}
Current Skills: ${resume.skills.map(s => s.category + ': ' + s.items.join(', ')).join('; ')}
Experience: ${resume.experiences.map(e => e.title).join(', ')}

Suggest 5-10 additional relevant skills that would enhance this resume:
- Technical skills relevant to the role
- Industry-specific tools and technologies
- Soft skills that complement the technical abilities
- Certifications or frameworks

Return only a comma-separated list of skills.
`,

  education: (context: string, resume: Resume) => `
You are a professional resume writer. Suggest relevant education or certifications for this professional.

Context: ${context}
Current Education: ${resume.education.map(e => `${e.degree} in ${e.field}`).join(', ')}
Skills: ${resume.skills.map(s => s.category + ': ' + s.items.join(', ')).join('; ')}

Suggest relevant:
- Industry certifications
- Online courses
- Professional development
- Additional degrees that would be valuable

Return suggestions as a bulleted list.
`
};

export async function generateResumeContent(
  options: ResumeGenerationOptions
): Promise<ResumeGenerationResult> {
  const { section, context, existingResume, provider, jobDescription } = options;

  // Get the appropriate prompt for the section
  const prompt = RESUME_PROMPTS[section](context, existingResume);
  
  // Add job description context if provided
  const enhancedPrompt = jobDescription 
    ? `${prompt}\n\nJob Description for reference:\n${jobDescription}\n\nTailor the content to match the job requirements.`
    : prompt;

  try {
    // Get API keys from environment
    const apiKeys = {
      perplexity: process.env.PERPLEXITY_API_KEY,
      google: process.env.GEMINI_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      azure: process.env.AZURE_OPENAI_API_KEY,
      ollama: undefined, // Local model
    };

    const apiKey = apiKeys[provider];
    
    if (!apiKey && provider !== 'ollama') {
      throw new Error(`API key not configured for provider: ${provider}`);
    }

    // Generate content using AI
    const result = await runAI({
      provider,
      model: getDefaultModel(provider),
      apiKey: apiKey || '',
      messages: [{ role: 'user', content: enhancedPrompt }],
      temperature: 0.3, // Slightly creative but professional
      maxTokens: 500,
    });

    // Extract keywords for ATS optimization
    const keywords = extractKeywords(result.text, section);

    return {
      content: result.text.trim(),
      keywords,
      suggestions: generateSuggestions(section, result.text)
    };

  } catch (error) {
    console.error('Resume generation error:', error);
    throw new Error(`Failed to generate ${section} content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractKeywords(content: string, section: string): string[] {
  // Simple keyword extraction logic
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'
  ]);

  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Return top keywords
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function generateSuggestions(section: string, content: string): string[] {
  const suggestions: string[] = [];

  switch (section) {
    case 'summary':
      if (!content.includes('years')) {
        suggestions.push('Consider adding years of experience');
      }
      if (content.length < 100) {
        suggestions.push('Summary could be more detailed');
      }
      break;
      
    case 'experience':
      if (!content.includes('%') && !content.includes('$') && !content.includes('increased')) {
        suggestions.push('Add quantifiable achievements (numbers, percentages, dollar amounts)');
      }
      if (!content.includes('led') && !content.includes('managed') && !content.includes('developed')) {
        suggestions.push('Use stronger action verbs');
      }
      break;
      
    case 'skills':
      suggestions.push('Group skills by category (Technical, Leadership, etc.)');
      suggestions.push('Include skill proficiency levels');
      break;
      
    default:
      break;
  }

  return suggestions;
}

// Job-specific content generation
export async function generateJobTailoredContent(
  resume: Resume,
  jobDescription: string,
  provider: AIProviderType
): Promise<{
  tailoredSummary: string;
  keywordMatches: string[];
  missingKeywords: string[];
  atsScore: number;
}> {
  const prompt = `
Analyze this job description and tailor the resume content accordingly:

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME SUMMARY:
${resume.summary || 'No summary provided'}

CURRENT SKILLS:
${resume.skills.map(s => s.category + ': ' + s.items.join(', ')).join('; ')}

CURRENT EXPERIENCE:
${resume.experiences.map(e => `${e.title} at ${e.company}: ${e.description || e.bullets.map(b => b.text).join('. ')}`).join('\n')}

Please provide:
1. A tailored professional summary that matches the job requirements
2. List of keywords from the job description that are already in the resume
3. List of important keywords missing from the resume
4. An ATS compatibility score (0-100)

Format your response as JSON:
{
  "tailoredSummary": "...",
  "keywordMatches": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "atsScore": 85
}
`;

  try {
    const apiKeys = {
      perplexity: process.env.PERPLEXITY_API_KEY,
      google: process.env.GEMINI_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      azure: process.env.AZURE_OPENAI_API_KEY,
      ollama: undefined,
    };

    const apiKey = apiKeys[provider];
    
    if (!apiKey && provider !== 'ollama') {
      throw new Error(`API key not configured for provider: ${provider}`);
    }

    const result = await runAI({
      provider,
      model: getDefaultModel(provider),
      apiKey: apiKey || '',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1, // More deterministic for structured output
      maxTokens: 800,
    });

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(result.text);
      return parsed;
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        tailoredSummary: result.text,
        keywordMatches: [],
        missingKeywords: [],
        atsScore: 0
      };
    }

  } catch (error) {
    console.error('Job tailoring error:', error);
    throw new Error(`Failed to generate job-tailored content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
