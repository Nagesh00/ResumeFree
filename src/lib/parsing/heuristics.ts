import { Resume, Experience, Education, Project, SkillsCategory, createDefaultResume } from '../schema/resume';
import { ExtractedText, LayoutInfo, SectionInfo } from './pdf-extract';

export interface ParseResult {
  resume: Resume;
  confidence: number;
  sections: ParsedSection[];
  warnings: string[];
}

export interface ParsedSection {
  type: string;
  heading: string;
  content: string;
  parsed: boolean;
  confidence: number;
}

// Main heuristic parser
export function parseResumeHeuristically(
  extracted: ExtractedText,
  layout?: LayoutInfo
): ParseResult {
  const resume = createDefaultResume();
  const warnings: string[] = [];
  const sections: ParsedSection[] = [];
  
  try {
    // Use layout information if available, otherwise fall back to text parsing
    const textSections = layout?.sections || extractSectionsFromText(extracted.text);
    
    // Parse each section
    textSections.forEach(section => {
      const sectionType = classifySection(section.heading || (Array.isArray(section.content) ? section.content.join(' ').slice(0, 50) : section.content.slice(0, 50)));
      const parsedSection: ParsedSection = {
        type: sectionType,
        heading: section.heading || 'Unknown',
        content: Array.isArray(section.content) ? section.content.join('\n') : section.content,
        parsed: false,
        confidence: section.confidence || 0.7,
      };
      
      try {
        switch (sectionType) {
          case 'personal':
            parsePersonalInfo(resume, parsedSection.content);
            parsedSection.parsed = true;
            break;
          case 'summary':
            resume.summary = parsedSection.content.trim();
            parsedSection.parsed = true;
            break;
          case 'experience':
            const experiences = parseExperience(parsedSection.content);
            resume.experiences.push(...experiences);
            parsedSection.parsed = experiences.length > 0;
            break;
          case 'education':
            const education = parseEducation(parsedSection.content);
            resume.education.push(...education);
            parsedSection.parsed = education.length > 0;
            break;
          case 'skills':
            const skills = parseSkills(parsedSection.content);
            resume.skills.push(...skills);
            parsedSection.parsed = skills.length > 0;
            break;
          case 'projects':
            const projects = parseProjects(parsedSection.content);
            resume.projects.push(...projects);
            parsedSection.parsed = projects.length > 0;
            break;
          default:
            // Custom section
            resume.customSections.push({
              id: crypto.randomUUID(),
              title: parsedSection.heading,
              content: parsedSection.content,
              bullets: [],
            });
            parsedSection.parsed = true;
        }
      } catch (error) {
        warnings.push(`Failed to parse ${sectionType} section: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      sections.push(parsedSection);
    });
    
    // Calculate overall confidence
    const confidence = calculateOverallConfidence(sections);
    
    // Update metadata
    resume.metadata.updatedAt = new Date().toISOString();
    
    return {
      resume,
      confidence,
      sections,
      warnings,
    };
  } catch (error) {
    warnings.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      resume,
      confidence: 0.1,
      sections,
      warnings,
    };
  }
}

// Extract sections from plain text when layout info is not available
function extractSectionsFromText(text: string): Array<{ heading: string; content: string; confidence: number }> {
  const sections: Array<{ heading: string; content: string; confidence: number }> = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentSection = { heading: 'Header', content: '', confidence: 0.7 };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (isHeadingLine(line)) {
      // Save previous section
      if (currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        heading: line,
        content: '',
        confidence: calculateHeadingConfidence(line),
      };
    } else {
      currentSection.content += line + '\n';
    }
  }
  
  // Add final section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Check if a line is likely a heading
function isHeadingLine(line: string): boolean {
  // All caps (but not too long)
  if (line === line.toUpperCase() && line.length < 30 && line.length > 2) {
    return true;
  }
  
  // Known heading patterns
  const headingPatterns = [
    /^(professional\s+)?(summary|profile|objective)$/i,
    /^(work\s+|professional\s+)?experience$/i,
    /^employment(\s+history)?$/i,
    /^(academic\s+)?(education|qualifications)$/i,
    /^(technical\s+|core\s+)?(skills|competencies|expertise)$/i,
    /^projects?$/i,
    /^certifications?$/i,
    /^achievements?$/i,
    /^awards?$/i,
    /^contact(\s+information)?$/i,
    /^languages?$/i,
    /^publications?$/i,
    /^volunteer(\s+experience)?$/i,
  ];
  
  return headingPatterns.some(pattern => pattern.test(line.trim()));
}

// Calculate heading confidence
function calculateHeadingConfidence(heading: string): number {
  let confidence = 0.5;
  
  if (isHeadingLine(heading)) confidence += 0.3;
  if (heading.length < 30) confidence += 0.1;
  if (heading === heading.toUpperCase()) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}

// Classify section type
function classifySection(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (/\b(email|phone|address|linkedin|github)\b/.test(lowerText)) return 'personal';
  if (/\b(summary|profile|objective)\b/.test(lowerText)) return 'summary';
  if (/\b(experience|employment|work|professional)\b/.test(lowerText)) return 'experience';
  if (/\b(education|academic|degree|university|college)\b/.test(lowerText)) return 'education';
  if (/\b(skills|technical|competencies|expertise)\b/.test(lowerText)) return 'skills';
  if (/\b(projects?|portfolio)\b/.test(lowerText)) return 'projects';
  if (/\b(certifications?|certificates?)\b/.test(lowerText)) return 'certifications';
  if (/\b(achievements?|awards?|honors?)\b/.test(lowerText)) return 'achievements';
  
  return 'other';
}

// Parse personal information
function parsePersonalInfo(resume: Resume, content: string): void {
  const lines = content.split('\n');
  
  // Look for name (usually first non-empty line or largest text)
  const namePattern = /^[A-Z][a-z]+\s+[A-Z][a-z]+/;
  const nameLine = lines.find(line => namePattern.test(line.trim()));
  if (nameLine) {
    resume.name = nameLine.trim();
  }
  
  // Extract contact information
  const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) resume.contact.email = emailMatch[0];
  
  const phoneMatch = content.match(/\b(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/);
  if (phoneMatch) resume.contact.phone = phoneMatch[0];
  
  const linkedinMatch = content.match(/(linkedin\.com\/in\/[\w-]+)/i);
  if (linkedinMatch) resume.contact.linkedin = 'https://' + linkedinMatch[0];
  
  const githubMatch = content.match(/(github\.com\/[\w-]+)/i);
  if (githubMatch) resume.contact.github = 'https://' + githubMatch[0];
  
  // Extract location
  const locationPattern = /\b([A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+\s*,\s*[A-Z][a-z]+)/;
  const locationMatch = content.match(locationPattern);
  if (locationMatch) resume.contact.location = locationMatch[0];
}

// Parse work experience
function parseExperience(content: string): Experience[] {
  const experiences: Experience[] = [];
  const blocks = splitIntoBlocks(content);
  
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;
    
    // Parse job title and company
    const titleCompanyLine = lines[0];
    const dateLocationLine = lines[1];
    
    // Extract title and company
    let title = '', company = '';
    if (titleCompanyLine.includes(' at ')) {
      [title, company] = titleCompanyLine.split(' at ');
    } else if (titleCompanyLine.includes(' - ')) {
      [title, company] = titleCompanyLine.split(' - ');
    } else {
      title = titleCompanyLine;
      company = lines[1] || '';
    }
    
    // Extract dates
    const dateMatch = dateLocationLine.match(/(\w+\s+\d{4}|\d{4})\s*[-–]\s*(\w+\s+\d{4}|\d{4}|present)/i);
    let startDate = { year: '' }, endDate = { year: '' };
    let current = false;
    
    if (dateMatch) {
      startDate = parseDateString(dateMatch[1]);
      if (dateMatch[2].toLowerCase() === 'present') {
        current = true;
      } else {
        endDate = parseDateString(dateMatch[2]);
      }
    }
    
    // Extract bullets
    const bullets = lines.slice(2)
      .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
      .map(line => ({
        id: crypto.randomUUID(),
        text: line.replace(/^[•\-*]\s*/, ''),
        keywords: [],
        metrics: { hasMetrics: /\d+/.test(line), values: [] },
      }));
    
    experiences.push({
      id: crypto.randomUUID(),
      company: company.trim(),
      title: title.trim(),
      location: '',
      startDate,
      endDate: current ? undefined : endDate,
      current,
      bullets,
      technologies: [],
    });
  });
  
  return experiences;
}

// Parse education
function parseEducation(content: string): Education[] {
  const education: Education[] = [];
  const blocks = splitIntoBlocks(content);
  
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;
    
    const institutionLine = lines[0];
    const degreeLine = lines[1];
    
    // Extract graduation year
    const yearMatch = block.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : '';
    
    education.push({
      id: crypto.randomUUID(),
      institution: institutionLine,
      degree: degreeLine,
      location: '',
      endDate: year ? { year } : undefined,
      coursework: [],
      achievements: [],
    });
  });
  
  return education;
}

// Parse skills
function parseSkills(content: string): SkillsCategory[] {
  const skills: SkillsCategory[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  let currentCategory = 'Technical Skills';
  let currentItems: string[] = [];
  
  lines.forEach(line => {
    if (line.includes(':')) {
      // Save previous category
      if (currentItems.length > 0) {
        skills.push({
          id: crypto.randomUUID(),
          category: currentCategory,
          items: currentItems,
        });
      }
      
      // Start new category
      const [category, items] = line.split(':');
      currentCategory = category.trim();
      currentItems = items ? parseSkillsList(items) : [];
    } else {
      // Add to current category
      currentItems.push(...parseSkillsList(line));
    }
  });
  
  // Add final category
  if (currentItems.length > 0) {
    skills.push({
      id: crypto.randomUUID(),
      category: currentCategory,
      items: currentItems,
    });
  }
  
  return skills;
}

// Parse projects
function parseProjects(content: string): Project[] {
  const projects: Project[] = [];
  const blocks = splitIntoBlocks(content);
  
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 1) return;
    
    const nameDescLine = lines[0];
    let name = nameDescLine;
    let description = '';
    
    if (nameDescLine.includes(' - ')) {
      [name, description] = nameDescLine.split(' - ');
    }
    
    // Extract bullets
    const bullets = lines.slice(1)
      .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
      .map(line => ({
        id: crypto.randomUUID(),
        text: line.replace(/^[•\-*]\s*/, ''),
        keywords: [],
      }));
    
    projects.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      bullets,
      technologies: [],
    });
  });
  
  return projects;
}

// Helper functions
function splitIntoBlocks(content: string): string[] {
  return content.split(/\n\s*\n/).filter(block => block.trim());
}

function parseSkillsList(text: string): string[] {
  return text.split(/[,;|]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}

function parseDateString(dateStr: string): { month?: string; year: string } {
  const monthYear = dateStr.match(/(\w+)\s+(\d{4})/);
  if (monthYear) {
    return { month: monthYear[1], year: monthYear[2] };
  }
  
  const year = dateStr.match(/\d{4}/);
  return { year: year ? year[0] : dateStr };
}

function calculateOverallConfidence(sections: ParsedSection[]): number {
  if (sections.length === 0) return 0.1;
  
  const parsedSections = sections.filter(s => s.parsed);
  const baseConfidence = parsedSections.length / sections.length;
  
  // Boost confidence if key sections are present
  const hasPersonal = sections.some(s => s.type === 'personal' && s.parsed);
  const hasExperience = sections.some(s => s.type === 'experience' && s.parsed);
  const hasEducation = sections.some(s => s.type === 'education' && s.parsed);
  
  let bonus = 0;
  if (hasPersonal) bonus += 0.1;
  if (hasExperience) bonus += 0.15;
  if (hasEducation) bonus += 0.1;
  
  return Math.min(baseConfidence + bonus, 1.0);
}
