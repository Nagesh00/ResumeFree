import { jsPDF } from 'jspdf';
import { Resume } from '../schema/resume';

export async function exportToPDF(resume: Resume): Promise<Blob> {
  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number = 170) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Helper function to check if we need a new page
  const checkNewPage = (nextContentHeight: number = 20) => {
    if (yPosition + nextContentHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header - Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  yPosition = addText(resume.name, margin, yPosition);
  yPosition += 5;

  // Contact Information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactInfo = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.linkedin,
    resume.contact.github,
    resume.contact.website,
    resume.contact.location
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    yPosition = addText(contactInfo, margin, yPosition);
    yPosition += 10;
  }

  // Professional Summary
  if (resume.summary) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('PROFESSIONAL SUMMARY', margin, yPosition);
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(resume.summary, margin, yPosition);
    yPosition += 10;
  }

  // Experience
  if (resume.experiences && resume.experiences.length > 0) {
    checkNewPage(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('PROFESSIONAL EXPERIENCE', margin, yPosition);
    yPosition += 5;

    resume.experiences.forEach((exp) => {
      checkNewPage(30);
      
      // Job title and company
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${exp.title} - ${exp.company}`, margin, yPosition);
      
      // Date and location
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const dateStr = exp.startDate ? 
        `${exp.startDate.month || ''} ${exp.startDate.year} - ${exp.current ? 'Present' : 
          (exp.endDate ? `${exp.endDate.month || ''} ${exp.endDate.year}` : 'Present')}` : 
        '';
      const locationDate = [dateStr, exp.location].filter(Boolean).join(' | ');
      yPosition = addText(locationDate, margin, yPosition);
      yPosition += 3;

      // Description
      if (exp.description) {
        yPosition = addText(exp.description, margin, yPosition);
        yPosition += 2;
      }

      // Bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet) => {
          checkNewPage(15);
          yPosition = addText(`• ${bullet.text}`, margin + 5, yPosition);
          yPosition += 2;
        });
      }

      // Technologies
      if (exp.technologies && exp.technologies.length > 0) {
        yPosition = addText(`Technologies: ${exp.technologies.join(', ')}`, margin, yPosition);
      }
      
      yPosition += 8;
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('EDUCATION', margin, yPosition);
    yPosition += 5;

    resume.education.forEach((edu) => {
      checkNewPage(20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, margin, yPosition);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const eduInfo = [edu.institution, edu.location].filter(Boolean).join(' | ');
      yPosition = addText(eduInfo, margin, yPosition);
      
      if (edu.gpa) {
        yPosition = addText(`GPA: ${edu.gpa}`, margin, yPosition);
      }
      
      yPosition += 8;
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('TECHNICAL SKILLS', margin, yPosition);
    yPosition += 5;

    resume.skills.forEach((skillCategory) => {
      checkNewPage(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${skillCategory.category}:`, margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      yPosition = addText(skillCategory.items.join(', '), margin + 30, yPosition - lineHeight);
      yPosition += 5;
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('PROJECTS', margin, yPosition);
    yPosition += 5;

    resume.projects.forEach((project) => {
      checkNewPage(25);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(project.name, margin, yPosition);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(project.description, margin, yPosition);
      
      if (project.technologies && project.technologies.length > 0) {
        yPosition = addText(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition);
      }
      
      yPosition += 8;
    });
  }

  // Convert to blob
  const pdfBlob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
  return pdfBlob;
}
