/**
 * Multi-Format Export System
 * DOCX, JSON Resume, Markdown exporters as specified
 */

import { Resume } from '../schema/resume';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';

/**
 * DOCX Export Implementation
 */
export async function exportToDocx(resume: Resume, templateId?: string): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header with name and contact
        new Paragraph({
          children: [
            new TextRun({
              text: resume.name || 'Your Name',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        
        // Contact information
        new Paragraph({
          children: [
            new TextRun({
              text: [
                resume.contact.email,
                resume.contact.phone,
                resume.contact.location,
              ].filter(Boolean).join(' • '),
              size: 22,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        // Professional Summary
        ...(resume.summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resume.summary,
                size: 22,
              }),
            ],
            spacing: { after: 300 },
          }),
        ] : []),
        
        // Experience Section
        ...(resume.experiences.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          ...resume.experiences.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.title,
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: ` | ${exp.company}`,
                  size: 22,
                }),
                new TextRun({
                  text: ` | ${exp.startDate?.year || ''} - ${exp.current ? 'Present' : exp.endDate?.year || ''}`,
                  size: 20,
                  italics: true,
                }),
              ],
              spacing: { before: 150, after: 50 },
            }),
            ...exp.bullets.map(bullet => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${bullet.text}`,
                    size: 20,
                  }),
                ],
                indent: { left: 360 },
                spacing: { after: 50 },
              })
            ),
          ]),
        ] : []),
        
        // Education Section
        ...(resume.education.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          ...resume.education.map(edu => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree} in ${edu.field}`,
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: ` | ${edu.institution}`,
                  size: 22,
                }),
                new TextRun({
                  text: ` | ${edu.endDate?.year || ''}`,
                  size: 20,
                  italics: true,
                }),
              ],
              spacing: { after: 100 },
            })
          ),
        ] : []),
        
        // Skills Section
        ...(resume.skills.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'TECHNICAL SKILLS',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          ...resume.skills.map(skillGroup => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${skillGroup.category}: `,
                  bold: true,
                  size: 20,
                }),
                new TextRun({
                  text: skillGroup.items.join(', '),
                  size: 20,
                }),
              ],
              spacing: { after: 50 },
            })
          ),
        ] : []),
      ],
    }],
  });
  
  return await Packer.toBlob(doc);
}

/**
 * Markdown Export Implementation
 */
export function exportToMarkdown(resume: Resume): string {
  let markdown = '';
  
  // Header
  markdown += `# ${resume.name || 'Your Name'}\n\n`;
  
  // Contact
  const contactInfo = [
    resume.contact.email && `📧 ${resume.contact.email}`,
    resume.contact.phone && `📱 ${resume.contact.phone}`,
    resume.contact.location && `📍 ${resume.contact.location}`,
    resume.contact.linkedin && `🔗 [LinkedIn](${resume.contact.linkedin})`,
    resume.contact.github && `💻 [GitHub](${resume.contact.github})`,
    resume.contact.website && `🌐 [Website](${resume.contact.website})`,
  ].filter(Boolean);
  
  if (contactInfo.length > 0) {
    markdown += contactInfo.join(' | ') + '\n\n';
  }
  
  // Summary
  if (resume.summary) {
    markdown += `## 📋 Professional Summary\n\n${resume.summary}\n\n`;
  }
  
  // Experience
  if (resume.experiences.length > 0) {
    markdown += `## 💼 Professional Experience\n\n`;
    
    resume.experiences.forEach(exp => {
      markdown += `### ${exp.title} | ${exp.company}\n`;
      markdown += `*${exp.startDate?.year || ''} - ${exp.current ? 'Present' : exp.endDate?.year || ''}*\n\n`;
      
      if (exp.description) {
        markdown += `${exp.description}\n\n`;
      }
      
      if (exp.bullets.length > 0) {
        exp.bullets.forEach(bullet => {
          markdown += `- ${bullet.text}\n`;
        });
        markdown += '\n';
      }
    });
  }
  
  // Projects
  if (resume.projects.length > 0) {
    markdown += `## 🚀 Projects\n\n`;
    
    resume.projects.forEach(project => {
      markdown += `### ${project.name}\n`;
      if (project.link) {
        markdown += `🔗 [View Project](${project.link})\n\n`;
      }
      
      if (project.description) {
        markdown += `${project.description}\n\n`;
      }
      
      if (project.bullets.length > 0) {
        project.bullets.forEach(bullet => {
          markdown += `- ${bullet.text}\n`;
        });
        markdown += '\n';
      }
      
      if (project.technologies.length > 0) {
        markdown += `**Technologies:** ${project.technologies.join(', ')}\n\n`;
      }
    });
  }
  
  // Education
  if (resume.education.length > 0) {
    markdown += `## 🎓 Education\n\n`;
    
    resume.education.forEach(edu => {
      markdown += `### ${edu.degree} in ${edu.field}\n`;
      markdown += `**${edu.institution}** | ${edu.endDate?.year || ''}\n`;
      
      if (edu.gpa) {
        markdown += `GPA: ${edu.gpa}\n`;
      }
      
      markdown += '\n';
    });
  }
  
  // Skills
  if (resume.skills.length > 0) {
    markdown += `## 🛠️ Technical Skills\n\n`;
    
    resume.skills.forEach(skillGroup => {
      markdown += `**${skillGroup.category}:** ${skillGroup.items.join(', ')}\n\n`;
    });
  }
  
  // Certifications
  if (resume.certifications.length > 0) {
    markdown += `## 📜 Certifications\n\n`;
    
    resume.certifications.forEach(cert => {
      markdown += `- **${cert.name}** - ${cert.issuer}`;
      if (cert.date) {
        markdown += ` (${cert.date.year})`;
      }
      if (cert.url) {
        markdown += ` | [View Certificate](${cert.url})`;
      }
      markdown += '\n';
    });
    markdown += '\n';
  }
  
  return markdown;
}

/**
 * LinkedIn-Ready Text Blocks Export
 */
export function exportToLinkedInBlocks(resume: Resume): {
  headline: string;
  summary: string;
  experience: string[];
  skills: string[];
} {
  // Generate LinkedIn headline
  const headline = `${resume.title || 'Professional'} at ${resume.experiences[0]?.company || 'Company'} | ${resume.skills.slice(0, 3).flatMap(s => s.items).slice(0, 5).join(' • ')}`;
  
  // Format summary for LinkedIn
  const summary = resume.summary || `Experienced ${resume.title || 'professional'} with expertise in ${resume.skills.flatMap(s => s.items).slice(0, 8).join(', ')}.`;
  
  // Format experience for LinkedIn
  const experience = resume.experiences.map(exp => {
    let block = `${exp.title} at ${exp.company}\n`;
    block += `${exp.startDate?.year || ''} - ${exp.current ? 'Present' : exp.endDate?.year || ''}\n\n`;
    
    if (exp.description) {
      block += `${exp.description}\n\n`;
    }
    
    if (exp.bullets.length > 0) {
      block += 'Key Achievements:\n';
      exp.bullets.forEach(bullet => {
        block += `• ${bullet.text}\n`;
      });
    }
    
    return block;
  });
  
  // Extract skills for LinkedIn
  const skills = resume.skills.flatMap(skillGroup => skillGroup.items);
  
  return {
    headline: headline.slice(0, 220), // LinkedIn headline limit
    summary: summary.slice(0, 2600), // LinkedIn summary limit
    experience,
    skills: skills.slice(0, 50), // LinkedIn skills limit
  };
}

/**
 * Export utility functions
 */
export async function downloadResume(
  resume: Resume, 
  format: 'pdf' | 'docx' | 'json' | 'markdown' | 'linkedin',
  templateId?: string
): Promise<void> {
  const filename = `${resume.name?.replace(/\s+/g, '-').toLowerCase() || 'resume'}`;
  
  switch (format) {
    case 'docx':
      const docxBlob = await exportToDocx(resume, templateId);
      saveAs(docxBlob, `${filename}.docx`);
      break;
      
    case 'json':
      const { exportToJSONBlob } = await import('./jsonResume');
      const jsonBlob = exportToJSONBlob(resume);
      saveAs(jsonBlob, `${filename}.json`);
      break;
      
    case 'markdown':
      const markdown = exportToMarkdown(resume);
      const mdBlob = new Blob([markdown], { type: 'text/markdown' });
      saveAs(mdBlob, `${filename}.md`);
      break;
      
    case 'linkedin':
      const linkedinBlocks = exportToLinkedInBlocks(resume);
      const linkedinText = `LINKEDIN PROFILE CONTENT\n\n` +
        `HEADLINE:\n${linkedinBlocks.headline}\n\n` +
        `SUMMARY:\n${linkedinBlocks.summary}\n\n` +
        `EXPERIENCE:\n${linkedinBlocks.experience.join('\n---\n')}\n\n` +
        `SKILLS:\n${linkedinBlocks.skills.join(', ')}`;
      
      const linkedinBlob = new Blob([linkedinText], { type: 'text/plain' });
      saveAs(linkedinBlob, `${filename}-linkedin.txt`);
      break;
      
    case 'pdf':
      // PDF export handled by separate pdf exporter
      const { exportToPDF } = await import('./pdf');
      const pdfBlob = await exportToPDF(resume, templateId);
      saveAs(pdfBlob, `${filename}.pdf`);
      break;
      
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Batch export all formats
 */
export async function exportAllFormats(resume: Resume, templateId?: string): Promise<void> {
  const formats: Array<'pdf' | 'docx' | 'json' | 'markdown' | 'linkedin'> = 
    ['pdf', 'docx', 'json', 'markdown', 'linkedin'];
  
  const promises = formats.map(format => 
    downloadResume(resume, format, templateId)
  );
  
  await Promise.all(promises);
}

/**
 * Export with custom template
 */
export async function exportWithTemplate(
  resume: Resume, 
  templateConfig: any, 
  format: string
): Promise<Blob> {
  // Apply template styling and then export
  switch (format) {
    case 'docx':
      return await exportToDocx(resume, templateConfig.id);
    case 'markdown':
      const markdown = exportToMarkdown(resume);
      return new Blob([markdown], { type: 'text/markdown' });
    default:
      throw new Error(`Template export not supported for format: ${format}`);
  }
}
