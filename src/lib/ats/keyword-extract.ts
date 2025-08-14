/**
 * ATS Keyword Extraction and Scoring
 * Extract relevant keywords from job descriptions and score resume compatibility
 */

import { Resume } from '../schema/resume';

export interface ATSScore {
  score: number;
  breakdown: {
    keywordMatch: number;
    formatCompliance: number;
    contentQuality: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

// Common technical keywords and skills
const TECHNICAL_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'aws', 'docker',
  'kubernetes', 'sql', 'mongodb', 'git', 'agile', 'scrum', 'api', 'microservices',
  'ci/cd', 'devops', 'machine learning', 'ai', 'data science', 'analytics',
  'html', 'css', 'angular', 'vue', 'express', 'spring', 'django', 'flask',
  'postgresql', 'mysql', 'redis', 'elasticsearch', 'graphql', 'rest',
  'terraform', 'jenkins', 'github', 'jira', 'confluence', 'slack'
];

// Job level indicators
const SENIORITY_KEYWORDS = {
  junior: ['junior', 'entry', 'associate', 'graduate', 'trainee'],
  mid: ['mid', 'intermediate', 'experienced', 'professional'],
  senior: ['senior', 'lead', 'principal', 'staff', 'architect'],
  management: ['manager', 'director', 'vp', 'head', 'chief', 'cto', 'ceo']
};

/**
 * Extract keywords from job description
 */
export function extractJobKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const words = text.split(/\W+/).filter(word => word.length > 2);
  
  // Extract technical keywords
  const technicalMatches = TECHNICAL_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  // Extract requirements/qualifications keywords
  const requirementsSections = text.split(/requirements|qualifications|skills|experience/i);
  const requirementsText = requirementsSections.slice(1).join(' ');
  
  // Find common patterns
  const patterns = [
    /\b(\d+)\+?\s*years?\s*(?:of\s+)?(?:experience|exp)\b/gi,
    /\b(bachelor|master|phd|degree)\b/gi,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:certification|certified)\b/gi,
  ];
  
  const extractedKeywords = new Set<string>();
  
  // Add technical keywords
  technicalMatches.forEach(keyword => extractedKeywords.add(keyword));
  
  // Extract years of experience
  const yearMatches = text.match(/\b(\d+)\+?\s*years?\s*(?:of\s+)?(?:experience|exp)\b/gi);
  if (yearMatches) {
    yearMatches.forEach(match => extractedKeywords.add(match.toLowerCase()));
  }
  
  // Extract degree requirements
  const degreeMatches = text.match(/\b(bachelor|master|phd|degree|bs|ms|ba|ma)\b/gi);
  if (degreeMatches) {
    degreeMatches.forEach(match => extractedKeywords.add(match.toLowerCase()));
  }
  
  // Extract company/industry-specific terms
  const industryTerms = extractIndustryTerms(text);
  industryTerms.forEach(term => extractedKeywords.add(term));
  
  // Extract action verbs and responsibilities
  const actionVerbs = extractActionVerbs(text);
  actionVerbs.forEach(verb => extractedKeywords.add(verb));
  
  return Array.from(extractedKeywords);
}

/**
 * Calculate ATS compatibility score
 */
export function calculateATSScore(resume: Resume, jobKeywords: string[]): ATSScore {
  const resumeText = getResumeText(resume).toLowerCase();
  const resumeWords = new Set(resumeText.split(/\W+/).map(w => w.toLowerCase()));
  
  // Keyword matching score
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeText.includes(keyword.toLowerCase())
  );
  const keywordMatchScore = jobKeywords.length > 0 
    ? (matchedKeywords.length / jobKeywords.length) * 100 
    : 0;
  
  // Format compliance score
  const formatScore = calculateFormatScore(resume);
  
  // Content quality score
  const contentScore = calculateContentScore(resume);
  
  // Overall score (weighted average)
  const overallScore = Math.round(
    (keywordMatchScore * 0.5) + 
    (formatScore * 0.3) + 
    (contentScore * 0.2)
  );
  
  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeText.includes(keyword.toLowerCase())
  );
  
  const recommendations = generateRecommendations(resume, missingKeywords);
  
  return {
    score: overallScore,
    breakdown: {
      keywordMatch: Math.round(keywordMatchScore),
      formatCompliance: Math.round(formatScore),
      contentQuality: Math.round(contentScore),
    },
    matchedKeywords,
    missingKeywords,
    recommendations,
  };
}

/**
 * Extract industry-specific terms
 */
function extractIndustryTerms(text: string): string[] {
  const industryPatterns = [
    /\b(fintech|healthcare|e-commerce|saas|b2b|b2c|startup|enterprise)\b/gi,
    /\b(frontend|backend|fullstack|full-stack|devops|qa|testing)\b/gi,
    /\b(mobile|web|desktop|cloud|on-premise|hybrid)\b/gi,
  ];
  
  const terms = new Set<string>();
  
  industryPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => terms.add(match.toLowerCase()));
    }
  });
  
  return Array.from(terms);
}

/**
 * Extract action verbs and key responsibilities
 */
function extractActionVerbs(text: string): string[] {
  const actionVerbs = [
    'develop', 'build', 'create', 'design', 'implement', 'maintain', 'optimize',
    'lead', 'manage', 'coordinate', 'collaborate', 'mentor', 'train',
    'analyze', 'research', 'evaluate', 'assess', 'improve', 'enhance',
    'deploy', 'monitor', 'troubleshoot', 'debug', 'test', 'validate'
  ];
  
  return actionVerbs.filter(verb => 
    text.toLowerCase().includes(verb)
  );
}

/**
 * Get all text content from resume
 */
function getResumeText(resume: Resume): string {
  const sections = [
    resume.summary || '',
    resume.experiences.map(exp => 
      `${exp.title} ${exp.company} ${exp.description} ${exp.bullets.map(b => b.text).join(' ')}`
    ).join(' '),
    resume.education.map(edu => 
      `${edu.degree} ${edu.field} ${edu.institution}`
    ).join(' '),
    resume.skills.map(skill => 
      `${skill.category} ${skill.items.join(' ')}`
    ).join(' '),
    resume.projects.map(project => 
      `${project.name} ${project.description} ${project.bullets.map(b => b.text).join(' ')}`
    ).join(' '),
  ];
  
  return sections.join(' ');
}

/**
 * Calculate format compliance score
 */
function calculateFormatScore(resume: Resume): number {
  let score = 0;
  const checks = [
    { condition: resume.name && resume.name.length > 0, weight: 10 },
    { condition: resume.contact.email && resume.contact.email.includes('@'), weight: 10 },
    { condition: resume.contact.phone && resume.contact.phone.length > 0, weight: 10 },
    { condition: resume.summary && resume.summary.length > 50, weight: 15 },
    { condition: resume.experiences.length > 0, weight: 20 },
    { condition: resume.education.length > 0, weight: 15 },
    { condition: resume.skills.length > 0, weight: 10 },
    { condition: resume.experiences.some(exp => exp.bullets.length > 0), weight: 10 },
  ];
  
  checks.forEach(check => {
    if (check.condition) {
      score += check.weight;
    }
  });
  
  return score;
}

/**
 * Calculate content quality score
 */
function calculateContentScore(resume: Resume): number {
  let score = 0;
  
  // Check for quantified achievements
  const allBullets = [
    ...resume.experiences.flatMap(exp => exp.bullets.map(b => b.text)),
    ...resume.projects.flatMap(proj => proj.bullets.map(b => b.text)),
  ];
  
  const quantifiedBullets = allBullets.filter(bullet => 
    /\d+/.test(bullet) && /%|\$|k|million|thousand|increase|decrease|improve/.test(bullet.toLowerCase())
  );
  
  if (quantifiedBullets.length > 0) {
    score += Math.min(40, quantifiedBullets.length * 10);
  }
  
  // Check for action verbs
  const actionVerbCount = allBullets.filter(bullet => 
    /^(led|managed|developed|created|implemented|optimized|improved|increased|decreased|built|designed)/i.test(bullet.trim())
  ).length;
  
  score += Math.min(30, actionVerbCount * 5);
  
  // Check for relevant keywords
  const resumeText = getResumeText(resume).toLowerCase();
  const techKeywordCount = TECHNICAL_KEYWORDS.filter(keyword => 
    resumeText.includes(keyword)
  ).length;
  
  score += Math.min(30, techKeywordCount * 2);
  
  return score;
}

/**
 * Generate recommendations for improvement
 */
function generateRecommendations(resume: Resume, missingKeywords: string[]): string[] {
  const recommendations: string[] = [];
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider adding these relevant keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  
  if (!resume.summary || resume.summary.length < 50) {
    recommendations.push('Add a professional summary to introduce your key qualifications');
  }
  
  const allBullets = [
    ...resume.experiences.flatMap(exp => exp.bullets.map(b => b.text)),
    ...resume.projects.flatMap(proj => proj.bullets.map(b => b.text)),
  ];
  
  const quantifiedBullets = allBullets.filter(bullet => /\d+/.test(bullet));
  if (quantifiedBullets.length < allBullets.length * 0.3) {
    recommendations.push('Add more quantified achievements with specific numbers and metrics');
  }
  
  if (resume.skills.length === 0) {
    recommendations.push('Add a skills section with relevant technical and soft skills');
  }
  
  return recommendations;
}

/**
 * Generate ATS improvement suggestions
 */
export function generateATSSuggestions(resume: Resume, jobDescription: string): string[] {
  const jobKeywords = extractJobKeywords(jobDescription);
  const atsScore = calculateATSScore(resume, jobKeywords);
  
  const suggestions: string[] = [];
  
  // Keyword suggestions
  if (atsScore.missingKeywords.length > 0) {
    suggestions.push(`Add missing keywords: ${atsScore.missingKeywords.slice(0, 3).join(', ')}`);
  }
  
  // Format suggestions
  if (atsScore.breakdown.formatCompliance < 80) {
    suggestions.push('Improve format compliance: use standard headings and bullet points');
  }
  
  // Content suggestions
  if (atsScore.breakdown.contentQuality < 70) {
    suggestions.push('Enhance content quality with more quantified achievements');
  }
  
  return [...suggestions, ...atsScore.recommendations];
}
