import * as pdfjs from 'pdfjs-dist';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

export interface ExtractedText {
  text: string;
  metadata: {
    numPages: number;
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export interface TextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  page: number;
}

export interface LayoutInfo {
  blocks: TextBlock[];
  sections: SectionInfo[];
  fontSizes: number[];
  commonFonts: string[];
}

export interface SectionInfo {
  heading: string;
  content: string[];
  startY: number;
  endY: number;
  page: number;
  confidence: number;
}

interface PDFMetadata {
  pages: number;
  fileSize: number;
  info: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  };
  encrypted: boolean;
  version: string;
}

interface ParsedPDFStructure {
  sections: Array<{
    heading: string;
    content: string;
    page: number;
    confidence: number;
  }>;
  fontSizes: number[];
  textItems: Array<{
    text: string;
    fontSize: number;
    fontName: string;
    x: number;
    y: number;
    page: number;
  }>;
}

// Main export for components
export async function extractPDFContent(file: File): Promise<{
  text: string;
  metadata: PDFMetadata;
  structure: ParsedPDFStructure;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  const result = await extractTextFromPDF(file);
  return {
    text: result.text,
    metadata: {
      pages: result.metadata.numPages,
      fileSize: uint8Array.length,
      info: {
        title: result.metadata.title,
        author: result.metadata.author,
        subject: result.metadata.subject,
        creator: result.metadata.creator,
        producer: result.metadata.producer,
        creationDate: result.metadata.creationDate?.toString(),
        modificationDate: result.metadata.modificationDate?.toString(),
      },
      encrypted: false,
      version: '1.0'
    },
    structure: {
      sections: [],
      fontSizes: [],
      textItems: []
    }
  };
}

// Core PDF extraction function
export async function extractTextFromPDF(file: File): Promise<ExtractedText> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const metadata = await pdf.getMetadata();
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return {
      text: fullText.trim(),
      metadata: {
        numPages: pdf.numPages,
        title: (metadata.info as any)?.Title,
        author: (metadata.info as any)?.Author,
        subject: (metadata.info as any)?.Subject,
        creator: (metadata.info as any)?.Creator,
        producer: (metadata.info as any)?.Producer,
        creationDate: (metadata.info as any)?.CreationDate,
        modificationDate: (metadata.info as any)?.ModDate,
      }
    };
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced extraction with layout information
export async function extractLayoutFromPDF(file: File): Promise<LayoutInfo> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    const blocks: TextBlock[] = [];
    const fontSizes: number[] = [];
    const fontNames: string[] = [];
    
    // Extract layout information from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });
      
      textContent.items.forEach((item) => {
        if ('str' in item && item.str.trim()) {
          const textItem = item as TextItem;
          
          blocks.push({
            text: textItem.str,
            x: textItem.transform[4],
            y: viewport.height - textItem.transform[5], // Convert to top-down coordinates
            width: textItem.width,
            height: textItem.height,
            fontSize: Math.round(textItem.transform[0]),
            fontName: textItem.fontName,
            page: pageNum,
          });
          
          fontSizes.push(Math.round(textItem.transform[0]));
          fontNames.push(textItem.fontName);
        }
      });
    }
    
    // Analyze common font characteristics
    const uniqueFontSizes = Array.from(new Set(fontSizes)).sort((a, b) => b - a);
    const fontFrequency = fontNames.reduce((acc, font) => {
      acc[font] = (acc[font] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonFonts = Object.entries(fontFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([font]) => font);
    
    // Detect sections based on font size and positioning
    const sections = detectSections(blocks, uniqueFontSizes);
    
    return {
      blocks,
      sections,
      fontSizes: uniqueFontSizes,
      commonFonts,
    };
  } catch (error) {
    throw new Error(`Failed to extract layout from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Section detection based on font size and positioning
function detectSections(blocks: TextBlock[], fontSizes: number[]): SectionInfo[] {
  const sections: SectionInfo[] = [];
  const headingFontSize = fontSizes[0]; // Largest font size
  const secondaryFontSize = fontSizes[1] || headingFontSize;
  
  // Group blocks by potential headings
  const headingBlocks = blocks.filter(block => 
    block.fontSize >= secondaryFontSize && 
    block.text.length > 2 &&
    block.text.length < 50 &&
    isLikelyHeading(block.text)
  );
  
  headingBlocks.forEach((heading, index) => {
    const nextHeading = headingBlocks[index + 1];
    const endY = nextHeading ? nextHeading.y : Infinity;
    
    // Find content blocks between this heading and the next
    const contentBlocks = blocks.filter(block =>
      block.page === heading.page &&
      block.y > heading.y &&
      block.y < endY &&
      block.fontSize < heading.fontSize
    );
    
    if (contentBlocks.length > 0) {
      sections.push({
        heading: heading.text.trim(),
        content: contentBlocks.map(block => block.text.trim()),
        startY: heading.y,
        endY: Math.max(...contentBlocks.map(block => block.y)),
        page: heading.page,
        confidence: calculateSectionConfidence(heading, contentBlocks),
      });
    }
  });
  
  return sections.sort((a, b) => a.page - b.page || a.startY - b.startY);
}

// Check if text is likely a section heading
function isLikelyHeading(text: string): boolean {
  const headingPatterns = [
    /^(experience|work experience|employment|professional experience)$/i,
    /^(education|academic background|academic qualifications)$/i,
    /^(skills|technical skills|core competencies|expertise)$/i,
    /^(projects|key projects|notable projects)$/i,
    /^(certifications|certificates|professional certifications)$/i,
    /^(achievements|accomplishments|awards)$/i,
    /^(summary|professional summary|profile|objective)$/i,
    /^(contact|contact information)$/i,
    /^(languages|language proficiency)$/i,
    /^(publications|research|papers)$/i,
    /^(volunteer|volunteer experience|community involvement)$/i,
  ];
  
  return headingPatterns.some(pattern => pattern.test(text.trim()));
}

// Calculate confidence score for section detection
function calculateSectionConfidence(heading: TextBlock, content: TextBlock[]): number {
  let confidence = 0.5; // Base confidence
  
  // Higher confidence for recognized headings
  if (isLikelyHeading(heading.text)) {
    confidence += 0.3;
  }
  
  // Higher confidence for larger font size difference
  if (content.length > 0) {
    const avgContentFontSize = content.reduce((sum, block) => sum + block.fontSize, 0) / content.length;
    const sizeDifference = heading.fontSize - avgContentFontSize;
    if (sizeDifference >= 2) confidence += 0.2;
  }
  
  // Higher confidence for appropriate content amount
  if (content.length >= 2 && content.length <= 20) {
    confidence += 0.1;
  }
  
  // Cap at 1.0
  return Math.min(confidence, 1.0);
}

// Convert layout info to structured text for AI processing
export function layoutToStructuredText(layout: LayoutInfo): string {
  const sections = layout.sections
    .sort((a, b) => a.page - b.page || a.startY - b.startY)
    .filter(section => section.confidence > 0.6); // Only include confident sections
  
  if (sections.length === 0) {
    // Fallback to simple text extraction
    return layout.blocks
      .sort((a, b) => a.page - b.page || a.y - b.y)
      .map(block => block.text)
      .join(' ');
  }
  
  let structuredText = '';
  
  sections.forEach(section => {
    structuredText += `\n\n## ${section.heading}\n\n`;
    structuredText += section.content.join(' ');
  });
  
  return structuredText.trim();
}

// Validate PDF file
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  return { valid: true };
}

// Extract metadata for analysis
export function extractPDFMetadata(extracted: ExtractedText): {
  wordCount: number;
  pageCount: number;
  hasImages: boolean;
  language: string;
  complexity: 'simple' | 'moderate' | 'complex';
} {
  const wordCount = extracted.text.split(/\s+/).length;
  const pageCount = extracted.metadata.numPages;
  
  // Simple heuristics for complexity
  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  if (wordCount > 500 || pageCount > 2) complexity = 'moderate';
  if (wordCount > 1000 || pageCount > 3) complexity = 'complex';
  
  return {
    wordCount,
    pageCount,
    hasImages: false, // Would need additional PDF analysis
    language: 'en', // Would need language detection
    complexity,
  };
}
