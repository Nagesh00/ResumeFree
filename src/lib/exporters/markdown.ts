import { Resume } from '../schema/resume';

export interface MarkdownExportOptions {
  includeMetadata: boolean;
  format: 'github' | 'standard' | 'gitlab';
  includeTOC: boolean;
  compactMode: boolean;
}

const defaultOptions: MarkdownExportOptions = {
  includeMetadata: true,
  format: 'github',
  includeTOC: false,
  compactMode: false,
};

export function exportToMarkdown(
  resume: Resume,
  options: Partial<MarkdownExportOptions> = {}
): string {
  const opts = { ...defaultOptions, ...options };
  const sections: string[] = [];
  
  // Metadata (YAML frontmatter)
  if (opts.includeMetadata) {
    sections.push('---');
    sections.push(`name: "${resume.name}"`);
    if (resume.title) sections.push(`title: "${resume.title}"`);
    if (resume.contact.email) sections.push(`email: "${resume.contact.email}"`);
    if (resume.contact.phone) sections.push(`phone: "${resume.contact.phone}"`);
    if (resume.contact.location) sections.push(`location: "${resume.contact.location}"`);
    sections.push(`updated: "${new Date().toISOString()}"`);
    sections.push('---');
    sections.push('');
  }
  
  // Main heading
  sections.push(`# ${resume.name}`);
  if (resume.title) {
    sections.push(`*${resume.title}*`);
  }
  sections.push('');
  
  // Contact information
  const contactInfo = buildContactInfo(resume.contact, opts.format);
  if (contactInfo.length > 0) {
    if (opts.compactMode) {
      sections.push(contactInfo.join(' • '));
    } else {
      sections.push('## Contact');
      sections.push('');
      contactInfo.forEach(info => sections.push(`- ${info}`));
    }
    sections.push('');
  }
  
  // Table of Contents
  if (opts.includeTOC) {
    sections.push('## Table of Contents');
    sections.push('');
    
    const tocItems: string[] = [];
    if (resume.summary) tocItems.push('- [Professional Summary](#professional-summary)');
    if (resume.experiences.length > 0) tocItems.push('- [Experience](#experience)');
    if (resume.projects.length > 0) tocItems.push('- [Projects](#projects)');
    if (resume.education.length > 0) tocItems.push('- [Education](#education)');
    if (resume.skills.length > 0) tocItems.push('- [Skills](#skills)');
    if (resume.certifications.length > 0) tocItems.push('- [Certifications](#certifications)');
    if (resume.achievements.length > 0) tocItems.push('- [Achievements](#achievements)');
    
    sections.push(...tocItems);
    sections.push('');
  }
  
  // Professional Summary
  if (resume.summary) {
    sections.push('## Professional Summary');
    sections.push('');
    sections.push(resume.summary);
    sections.push('');
  }
  
  // Experience
  if (resume.experiences.length > 0) {
    sections.push('## Experience');
    sections.push('');
    
    resume.experiences.forEach((exp, index) => {
      const title = opts.compactMode ? `### ${exp.title}` : `### ${exp.title} - ${exp.company}`;
      sections.push(title);
      
      if (!opts.compactMode && exp.company) {
        sections.push(`**${exp.company}**`);
      }
      
      const details: string[] = [];
      if (exp.location) details.push(exp.location);
      
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current);
      if (dateRange) details.push(dateRange);
      
      if (details.length > 0) {
        sections.push(`*${details.join(' • ')}*`);
      }
      
      sections.push('');
      
      if (exp.description) {
        sections.push(exp.description);
        sections.push('');
      }
      
      if (exp.bullets.length > 0) {
        exp.bullets.forEach(bullet => {
          sections.push(`- ${bullet.text}`);
        });
        sections.push('');
      }
      
      if (exp.technologies.length > 0) {
        sections.push(`**Technologies:** ${exp.technologies.join(', ')}`);
        sections.push('');
      }
      
      if (index < resume.experiences.length - 1) {
        sections.push('---');
        sections.push('');
      }
    });
  }
  
  // Projects
  if (resume.projects.length > 0) {
    sections.push('## Projects');
    sections.push('');
    
    resume.projects.forEach((project, index) => {
      let title = `### ${project.name}`;
      if (project.link) {
        title = `### [${project.name}](${project.link})`;
      }
      sections.push(title);
      
      if (project.github && project.github !== project.link) {
        sections.push(`[GitHub Repository](${project.github})`);
      }
      
      sections.push('');
      
      if (project.description) {
        sections.push(project.description);
        sections.push('');
      }
      
      if (project.bullets.length > 0) {
        project.bullets.forEach(bullet => {
          sections.push(`- ${bullet.text}`);
        });
        sections.push('');
      }
      
      if (project.technologies.length > 0) {
        sections.push(`**Technologies:** ${project.technologies.join(', ')}`);
        sections.push('');
      }
      
      if (index < resume.projects.length - 1) {
        sections.push('---');
        sections.push('');
      }
    });
  }
  
  // Education
  if (resume.education.length > 0) {
    sections.push('## Education');
    sections.push('');
    
    resume.education.forEach(edu => {
      const degree = [edu.degree, edu.field].filter(Boolean).join(' in ');
      sections.push(`### ${degree}`);
      sections.push(`**${edu.institution}**`);
      
      const details: string[] = [];
      if (edu.location) details.push(edu.location);
      if (edu.endDate) details.push(formatDate(edu.endDate));
      if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
      
      if (details.length > 0) {
        sections.push(`*${details.join(' • ')}*`);
      }
      
      sections.push('');
      
      if (edu.coursework.length > 0) {
        sections.push('**Relevant Coursework:**');
        sections.push(edu.coursework.join(', '));
        sections.push('');
      }
      
      if (edu.achievements.length > 0) {
        sections.push('**Achievements:**');
        edu.achievements.forEach(achievement => {
          sections.push(`- ${achievement}`);
        });
        sections.push('');
      }
    });
  }
  
  // Skills
  if (resume.skills.length > 0) {
    sections.push('## Skills');
    sections.push('');
    
    if (opts.compactMode) {
      // Compact table format
      sections.push('| Category | Skills |');
      sections.push('|----------|--------|');
      resume.skills.forEach(skillCategory => {
        sections.push(`| ${skillCategory.category} | ${skillCategory.items.join(', ')} |`);
      });
    } else {
      // List format
      resume.skills.forEach(skillCategory => {
        sections.push(`**${skillCategory.category}:**`);
        sections.push(skillCategory.items.join(', '));
        sections.push('');
      });
    }
    sections.push('');
  }
  
  // Certifications
  if (resume.certifications.length > 0) {
    sections.push('## Certifications');
    sections.push('');
    
    resume.certifications.forEach(cert => {
      let certLine = `- **${cert.name}**`;
      
      const details: string[] = [];
      if (cert.issuer) details.push(cert.issuer);
      if (cert.date) details.push(formatDate(cert.date));
      
      if (details.length > 0) {
        certLine += ` - ${details.join(', ')}`;
      }
      
      sections.push(certLine);
      
      if (cert.url) {
        sections.push(`  - [Verify Credential](${cert.url})`);
      }
    });
    sections.push('');
  }
  
  // Achievements
  if (resume.achievements.length > 0) {
    sections.push('## Achievements');
    sections.push('');
    
    resume.achievements.forEach(achievement => {
      sections.push(`### ${achievement.title}`);
      
      const details: string[] = [];
      if (achievement.organization) details.push(achievement.organization);
      if (achievement.date) details.push(formatDate(achievement.date));
      
      if (details.length > 0) {
        sections.push(`*${details.join(' • ')}*`);
      }
      
      sections.push('');
      sections.push(achievement.description);
      sections.push('');
    });
  }
  
  // Custom sections
  if (resume.customSections.length > 0) {
    resume.customSections.forEach(section => {
      sections.push(`## ${section.title}`);
      sections.push('');
      sections.push(section.content);
      
      if (section.bullets.length > 0) {
        section.bullets.forEach(bullet => {
          sections.push(`- ${bullet.text}`);
        });
      }
      
      sections.push('');
    });
  }
  
  // Footer
  if (opts.includeMetadata) {
    sections.push('---');
    sections.push(`*Last updated: ${new Date().toLocaleDateString()}*`);
  }
  
  return sections.join('\n');
}

// Export as blob for download
export function exportToMarkdownBlob(
  resume: Resume,
  options?: Partial<MarkdownExportOptions>
): Blob {
  const markdown = exportToMarkdown(resume, options);
  return new Blob([markdown], { type: 'text/markdown' });
}

// Helper functions
function buildContactInfo(contact: any, format: string): string[] {
  const info: string[] = [];
  
  if (contact.email) {
    info.push(format === 'github' ? `📧 [${contact.email}](mailto:${contact.email})` : contact.email);
  }
  
  if (contact.phone) {
    info.push(format === 'github' ? `📞 ${contact.phone}` : contact.phone);
  }
  
  if (contact.linkedin) {
    const text = format === 'github' ? '💼 LinkedIn' : 'LinkedIn';
    info.push(`[${text}](${contact.linkedin})`);
  }
  
  if (contact.github) {
    const text = format === 'github' ? '🐙 GitHub' : 'GitHub';
    info.push(`[${text}](${contact.github})`);
  }
  
  if (contact.website) {
    const text = format === 'github' ? '🌐 Website' : 'Website';
    info.push(`[${text}](${contact.website})`);
  }
  
  if (contact.location) {
    info.push(format === 'github' ? `📍 ${contact.location}` : contact.location);
  }
  
  return info;
}

function formatDate(date: any): string {
  if (!date) return '';
  
  if (date.month && date.year) {
    return `${date.month} ${date.year}`;
  }
  
  return date.year || '';
}

function formatDateRange(
  startDate: any,
  endDate: any,
  current: boolean
): string {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  
  if (start && end) {
    return `${start} - ${end}`;
  }
  
  return start || end || '';
}
