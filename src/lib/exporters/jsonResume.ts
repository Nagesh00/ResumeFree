import { Resume } from '../schema/resume';
import { JSONResume } from '../schema/resume';

// Convert internal resume format to JSON Resume standard
export function exportToJSONResume(resume: Resume): JSONResume {
  return {
    basics: {
      name: resume.name,
      label: resume.title || undefined,
      email: resume.contact.email || undefined,
      phone: resume.contact.phone || undefined,
      url: resume.contact.website || undefined,
      summary: resume.summary || undefined,
      location: resume.contact.location ? {
        address: resume.contact.location,
      } : undefined,
      profiles: [
        ...(resume.contact.linkedin ? [{
          network: 'LinkedIn',
          username: extractUsernameFromUrl(resume.contact.linkedin, 'linkedin.com/in/'),
          url: resume.contact.linkedin,
        }] : []),
        ...(resume.contact.github ? [{
          network: 'GitHub',
          username: extractUsernameFromUrl(resume.contact.github, 'github.com/'),
          url: resume.contact.github,
        }] : []),
      ],
    },
    
    work: resume.experiences.map(exp => {
      const startDate = formatDateForJSON(exp.startDate);
      return {
        name: exp.company,
        position: exp.title,
        startDate: startDate || '2020-01-01', // Provide default if missing
        endDate: exp.current ? undefined : formatDateForJSON(exp.endDate),
        summary: exp.description,
        highlights: exp.bullets.map(bullet => bullet.text),
      };
    }),
    
    education: resume.education.map(edu => ({
      institution: edu.institution,
      area: edu.field,
      studyType: edu.degree,
      startDate: formatDateForJSON(edu.startDate),
      endDate: formatDateForJSON(edu.endDate),
      gpa: edu.gpa,
      courses: edu.coursework,
    })),
    
    skills: resume.skills.map(skillCategory => ({
      name: skillCategory.category,
      keywords: skillCategory.items,
    })),
    
    projects: resume.projects.map(project => ({
      name: project.name,
      description: project.description,
      highlights: project.bullets.map(bullet => bullet.text),
      keywords: project.technologies,
      startDate: formatDateForJSON(project.startDate),
      endDate: formatDateForJSON(project.endDate),
      url: project.link,
    })),
    
    certificates: resume.certifications.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      date: formatDateForJSON(cert.date),
      url: cert.url,
    })),
    
    awards: resume.achievements.map(achievement => ({
      title: achievement.title,
      date: formatDateForJSON(achievement.date),
      awarder: achievement.organization,
      summary: achievement.description,
    })),
  };
}

// Export as formatted JSON string
export function exportToJSONString(resume: Resume, pretty: boolean = true): string {
  const jsonResume = exportToJSONResume(resume);
  return JSON.stringify(jsonResume, null, pretty ? 2 : 0);
}

// Export as downloadable blob
export function exportToJSONBlob(resume: Resume): Blob {
  const jsonString = exportToJSONString(resume);
  return new Blob([jsonString], { type: 'application/json' });
}

// Import from JSON Resume format
export function importFromJSONResume(jsonResume: JSONResume): Partial<Resume> {
  return {
    name: jsonResume.basics?.name || '',
    title: jsonResume.basics?.label,
    summary: jsonResume.basics?.summary,
    contact: {
      email: jsonResume.basics?.email,
      phone: jsonResume.basics?.phone,
      website: jsonResume.basics?.url,
      location: jsonResume.basics?.location?.address,
      linkedin: jsonResume.basics?.profiles?.find(p => p.network === 'LinkedIn')?.url,
      github: jsonResume.basics?.profiles?.find(p => p.network === 'GitHub')?.url,
    },
    
    experiences: jsonResume.work?.map(work => ({
      id: crypto.randomUUID(),
      company: work.name,
      title: work.position,
      location: '',
      startDate: parseDateFromJSON(work.startDate),
      endDate: work.endDate ? parseDateFromJSON(work.endDate) : undefined,
      current: !work.endDate,
      bullets: work.highlights?.map(highlight => ({
        id: crypto.randomUUID(),
        text: highlight,
        keywords: [],
      })) || [],
      description: work.summary,
      technologies: [],
    })) || [],
    
    education: jsonResume.education?.map(edu => ({
      id: crypto.randomUUID(),
      institution: edu.institution,
      degree: edu.studyType || '',
      field: edu.area,
      location: '',
      startDate: edu.startDate ? parseDateFromJSON(edu.startDate) : undefined,
      endDate: edu.endDate ? parseDateFromJSON(edu.endDate) : undefined,
      gpa: edu.gpa,
      coursework: edu.courses || [],
      achievements: [],
    })) || [],
    
    skills: jsonResume.skills?.map(skill => ({
      id: crypto.randomUUID(),
      category: skill.name,
      items: skill.keywords || [],
    })) || [],
    
    projects: jsonResume.projects?.map(project => ({
      id: crypto.randomUUID(),
      name: project.name,
      description: project.description || '',
      link: project.url,
      bullets: project.highlights?.map(highlight => ({
        id: crypto.randomUUID(),
        text: highlight,
        keywords: [],
      })) || [],
      technologies: project.keywords || [],
      startDate: project.startDate ? parseDateFromJSON(project.startDate) : undefined,
      endDate: project.endDate ? parseDateFromJSON(project.endDate) : undefined,
    })) || [],
    
    certifications: jsonResume.certificates?.map(cert => ({
      id: crypto.randomUUID(),
      name: cert.name,
      issuer: cert.issuer || '',
      date: cert.date ? parseDateFromJSON(cert.date) : undefined,
      url: cert.url,
    })) || [],
    
    achievements: jsonResume.awards?.map(award => ({
      id: crypto.randomUUID(),
      title: award.title,
      description: award.summary || '',
      date: award.date ? parseDateFromJSON(award.date) : undefined,
      organization: award.awarder,
    })) || [],
  };
}

// Helper functions
function formatDateForJSON(date: any): string | undefined {
  if (!date) return undefined;
  
  if (date.month && date.year) {
    // Convert month name to number if needed
    const monthNum = isNaN(Number(date.month)) 
      ? getMonthNumber(date.month) 
      : String(date.month).padStart(2, '0');
    return `${date.year}-${monthNum}-01`;
  }
  
  if (date.year) {
    return `${date.year}-01-01`;
  }
  
  return undefined;
}

function parseDateFromJSON(dateString: string): { month?: string; year: string } {
  if (!dateString) return { year: '' };
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Try to extract year
    const yearMatch = dateString.match(/\b(19|20)\d{2}\b/);
    return { year: yearMatch ? yearMatch[0] : '' };
  }
  
  return {
    month: date.toLocaleString('default', { month: 'long' }),
    year: date.getFullYear().toString(),
  };
}

function extractUsernameFromUrl(url: string, pattern: string): string {
  const index = url.indexOf(pattern);
  if (index !== -1) {
    const username = url.substring(index + pattern.length);
    return username.split('/')[0]; // Take first part before any additional path
  }
  return '';
}

function getMonthNumber(monthName: string): string {
  const months: Record<string, string> = {
    'january': '01', 'jan': '01',
    'february': '02', 'feb': '02',
    'march': '03', 'mar': '03',
    'april': '04', 'apr': '04',
    'may': '05',
    'june': '06', 'jun': '06',
    'july': '07', 'jul': '07',
    'august': '08', 'aug': '08',
    'september': '09', 'sep': '09', 'sept': '09',
    'october': '10', 'oct': '10',
    'november': '11', 'nov': '11',
    'december': '12', 'dec': '12',
  };
  
  return months[monthName.toLowerCase() as keyof typeof months] || '01';
}

// Validate JSON Resume
export function validateJSONResume(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.basics) {
    errors.push('Missing basics section');
  } else {
    if (!data.basics.name) {
      errors.push('Missing name in basics');
    }
  }
  
  // Check date formats
  const checkDateFormat = (date: string, field: string) => {
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Invalid date format in ${field}: ${date}`);
    }
  };
  
  data.work?.forEach((work: any, index: number) => {
    checkDateFormat(work.startDate, `work[${index}].startDate`);
    checkDateFormat(work.endDate, `work[${index}].endDate`);
  });
  
  data.education?.forEach((edu: any, index: number) => {
    checkDateFormat(edu.startDate, `education[${index}].startDate`);
    checkDateFormat(edu.endDate, `education[${index}].endDate`);
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
