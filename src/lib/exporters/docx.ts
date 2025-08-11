import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { Resume } from '../schema/resume';

export interface DocxExportOptions {
  fontSize: number;
  fontFamily: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  spacing: {
    line: number;
    after: number;
  };
}

const defaultOptions: DocxExportOptions = {
  fontSize: 11,
  fontFamily: 'Calibri',
  margins: {
    top: 720, // 0.5 inch
    right: 720,
    bottom: 720,
    left: 720,
  },
  spacing: {
    line: 240, // 1.0 line spacing
    after: 120, // 6pt after
  },
};

export async function exportToDocx(
  resume: Resume,
  options: Partial<DocxExportOptions> = {}
): Promise<Blob> {
  const opts = { ...defaultOptions, ...options };
  
  const children: Paragraph[] = [];
  
  // Header with name and contact
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resume.name,
          bold: true,
          size: (opts.fontSize + 4) * 2, // Larger for name
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: opts.spacing.after },
    })
  );
  
  if (resume.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.title,
            size: opts.fontSize * 2,
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: opts.spacing.after * 2 },
      })
    );
  }
  
  // Contact information
  const contactInfo = buildContactLine(resume.contact);
  if (contactInfo) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo,
            size: opts.fontSize * 2,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: opts.spacing.after * 2 },
      })
    );
  }
  
  // Professional Summary
  if (resume.summary) {
    children.push(createSectionHeading('PROFESSIONAL SUMMARY', opts));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.summary,
            size: opts.fontSize * 2,
          }),
        ],
        spacing: { after: opts.spacing.after * 2 },
      })
    );
  }
  
  // Work Experience
  if (resume.experiences.length > 0) {
    children.push(createSectionHeading('PROFESSIONAL EXPERIENCE', opts));
    
    resume.experiences.forEach((exp, index) => {
      // Company and title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.title} | ${exp.company}`,
              bold: true,
              size: opts.fontSize * 2,
            }),
          ],
          spacing: { after: opts.spacing.after / 2 },
        })
      );
      
      // Date and location
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current);
      const locationDate = [exp.location, dateRange].filter(Boolean).join(' | ');
      
      if (locationDate) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: locationDate,
                size: opts.fontSize * 2,
                italics: true,
              }),
            ],
            spacing: { after: opts.spacing.after },
          })
        );
      }
      
      // Bullets
      exp.bullets.forEach(bullet => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet.text}`,
                size: opts.fontSize * 2,
              }),
            ],
            spacing: { after: opts.spacing.after / 2 },
          })
        );
      });
      
      // Add space between experiences
      if (index < resume.experiences.length - 1) {
        children.push(new Paragraph({ spacing: { after: opts.spacing.after } }));
      }
    });
  }
  
  // Projects
  if (resume.projects.length > 0) {
    children.push(createSectionHeading('PROJECTS', opts));
    
    resume.projects.forEach((project, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: opts.fontSize * 2,
            }),
            ...(project.link ? [
              new TextRun({
                text: ` | ${project.link}`,
                size: opts.fontSize * 2,
              }),
            ] : []),
          ],
          spacing: { after: opts.spacing.after / 2 },
        })
      );
      
      if (project.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.description,
                size: opts.fontSize * 2,
              }),
            ],
            spacing: { after: opts.spacing.after / 2 },
          })
        );
      }
      
      project.bullets.forEach(bullet => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet.text}`,
                size: opts.fontSize * 2,
              }),
            ],
            spacing: { after: opts.spacing.after / 2 },
          })
        );
      });
      
      if (index < resume.projects.length - 1) {
        children.push(new Paragraph({ spacing: { after: opts.spacing.after } }));
      }
    });
  }
  
  // Education
  if (resume.education.length > 0) {
    children.push(createSectionHeading('EDUCATION', opts));
    
    resume.education.forEach((edu, index) => {
      const degreeLine = [edu.degree, edu.field].filter(Boolean).join(' in ');
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${degreeLine} | ${edu.institution}`,
              bold: true,
              size: opts.fontSize * 2,
            }),
          ],
          spacing: { after: opts.spacing.after / 2 },
        })
      );
      
      const details = [
        edu.location,
        edu.endDate ? formatDate(edu.endDate) : undefined,
        edu.gpa ? `GPA: ${edu.gpa}` : undefined,
      ].filter(Boolean).join(' | ');
      
      if (details) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: details,
                size: opts.fontSize * 2,
                italics: true,
              }),
            ],
            spacing: { after: opts.spacing.after },
          })
        );
      }
      
      if (index < resume.education.length - 1) {
        children.push(new Paragraph({ spacing: { after: opts.spacing.after } }));
      }
    });
  }
  
  // Skills
  if (resume.skills.length > 0) {
    children.push(createSectionHeading('TECHNICAL SKILLS', opts));
    
    resume.skills.forEach(skillCategory => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${skillCategory.category}: `,
              bold: true,
              size: opts.fontSize * 2,
            }),
            new TextRun({
              text: skillCategory.items.join(', '),
              size: opts.fontSize * 2,
            }),
          ],
          spacing: { after: opts.spacing.after },
        })
      );
    });
  }
  
  // Certifications
  if (resume.certifications.length > 0) {
    children.push(createSectionHeading('CERTIFICATIONS', opts));
    
    resume.certifications.forEach(cert => {
      const certLine = [
        cert.name,
        cert.issuer,
        cert.date ? formatDate(cert.date) : undefined,
      ].filter(Boolean).join(' | ');
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${certLine}`,
              size: opts.fontSize * 2,
            }),
          ],
          spacing: { after: opts.spacing.after / 2 },
        })
      );
    });
  }
  
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: opts.margins,
          },
        },
        children,
      },
    ],
  });
  
  // Generate blob
  const buffer = await Packer.toBuffer(doc);
  return new Blob([Uint8Array.from(buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

// Helper functions
function createSectionHeading(text: string, opts: DocxExportOptions): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: (opts.fontSize + 1) * 2,
        allCaps: true,
      }),
    ],
    spacing: { 
      before: opts.spacing.after * 2,
      after: opts.spacing.after,
    },
  });
}

function buildContactLine(contact: any): string {
  const parts = [
    contact.email,
    contact.phone,
    contact.linkedin,
    contact.location,
  ].filter(Boolean);
  
  return parts.join(' | ');
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
