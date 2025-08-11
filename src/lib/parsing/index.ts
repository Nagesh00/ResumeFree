import { extractTextFromPDF, extractLayoutFromPDF, validatePDFFile } from './pdf-extract';
import { parseResumeHeuristically } from './heuristics';
import { postProcessWithAI, createFallbackResume } from './postprocess';
import { Resume } from '../schema/resume';

export interface ParseOptions {
  useAI: boolean;
  aiEnabled: boolean;
  signal?: AbortSignal;
}

export interface ParseResumeResult {
  resume: Resume;
  confidence: number;
  method: 'heuristic' | 'ai-enhanced' | 'fallback';
  processingTime: number;
  improvements: string[];
  warnings: string[];
  validationErrors: string[];
  metadata: {
    fileSize: number;
    pageCount: number;
    wordCount: number;
  };
}

// Main resume parsing function
export async function parseResumeFromPDF(
  file: File,
  options: ParseOptions = { useAI: true, aiEnabled: true }
): Promise<ParseResumeResult> {
  const startTime = Date.now();
  let method: 'heuristic' | 'ai-enhanced' | 'fallback' = 'heuristic';
  let improvements: string[] = [];
  let warnings: string[] = [];
  let validationErrors: string[] = [];
  
  try {
    // Validate file
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Extract text and layout from PDF
    const [extractedText, layout] = await Promise.all([
      extractTextFromPDF(file),
      extractLayoutFromPDF(file).catch(error => {
        warnings.push(`Layout extraction failed: ${error.message}`);
        return undefined;
      })
    ]);
    
    // Basic metadata
    const metadata = {
      fileSize: file.size,
      pageCount: extractedText.metadata.numPages,
      wordCount: extractedText.text.split(/\s+/).length,
    };
    
    // Check if we have enough content
    if (extractedText.text.trim().length < 100) {
      warnings.push('Very little text extracted from PDF');
    }
    
    // Parse with heuristics first
    const heuristicResult = parseResumeHeuristically(extractedText, layout);
    warnings.push(...heuristicResult.warnings);
    
    // Try AI enhancement if enabled and available
    if (options.useAI && options.aiEnabled && heuristicResult.confidence > 0.3) {
      try {
        const aiResult = await postProcessWithAI(
          heuristicResult,
          extractedText,
          layout,
          options.signal
        );
        
        method = 'ai-enhanced';
        improvements = aiResult.improvements;
        warnings.push(...aiResult.warnings);
        validationErrors = aiResult.validationErrors;
        
        return {
          resume: aiResult.resume,
          confidence: aiResult.confidence,
          method,
          processingTime: Date.now() - startTime,
          improvements,
          warnings,
          validationErrors,
          metadata,
        };
      } catch (error) {
        warnings.push(`AI enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Fall back to heuristic result
      }
    }
    
    // Return heuristic result
    return {
      resume: heuristicResult.resume,
      confidence: heuristicResult.confidence,
      method,
      processingTime: Date.now() - startTime,
      improvements,
      warnings,
      validationErrors,
      metadata,
    };
    
  } catch (error) {
    warnings.push(`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Return fallback result
    try {
      const extractedText = await extractTextFromPDF(file);
      const fallbackResume = createFallbackResume(extractedText);
      
      return {
        resume: fallbackResume,
        confidence: 0.2,
        method: 'fallback',
        processingTime: Date.now() - startTime,
        improvements: [],
        warnings,
        validationErrors: ['Failed to parse resume structure'],
        metadata: {
          fileSize: file.size,
          pageCount: extractedText.metadata.numPages,
          wordCount: extractedText.text.split(/\s+/).length,
        },
      };
    } catch (fallbackError) {
      throw new Error(`Complete parsing failure: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
    }
  }
}

// Parse resume from text input
export async function parseResumeFromText(
  text: string,
  options: ParseOptions = { useAI: true, aiEnabled: true }
): Promise<ParseResumeResult> {
  const startTime = Date.now();
  
  const extractedText = {
    text: text.trim(),
    metadata: {
      numPages: 1,
      wordCount: text.split(/\s+/).length,
    }
  };
  
  const metadata = {
    fileSize: text.length,
    pageCount: 1,
    wordCount: extractedText.metadata.wordCount,
  };
  
  try {
    // Parse with heuristics
    const heuristicResult = parseResumeHeuristically(extractedText);
    
    // Try AI enhancement if enabled
    if (options.useAI && options.aiEnabled) {
      try {
        const aiResult = await postProcessWithAI(
          heuristicResult,
          extractedText,
          undefined,
          options.signal
        );
        
        return {
          resume: aiResult.resume,
          confidence: aiResult.confidence,
          method: 'ai-enhanced',
          processingTime: Date.now() - startTime,
          improvements: aiResult.improvements,
          warnings: aiResult.warnings,
          validationErrors: aiResult.validationErrors,
          metadata,
        };
      } catch (error) {
        // Fall back to heuristic
      }
    }
    
    return {
      resume: heuristicResult.resume,
      confidence: heuristicResult.confidence,
      method: 'heuristic',
      processingTime: Date.now() - startTime,
      improvements: [],
      warnings: heuristicResult.warnings,
      validationErrors: [],
      metadata,
    };
    
  } catch (error) {
    // Fallback to basic resume
    const fallbackResume = createFallbackResume(extractedText);
    
    return {
      resume: fallbackResume,
      confidence: 0.1,
      method: 'fallback',
      processingTime: Date.now() - startTime,
      improvements: [],
      warnings: [`Text parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      validationErrors: ['Failed to parse resume structure'],
      metadata,
    };
  }
}

// Validate parsing result
export function validateParseResult(result: ParseResumeResult): {
  isValid: boolean;
  criticalIssues: string[];
  suggestions: string[];
} {
  const criticalIssues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for critical missing information
  if (!result.resume.name || result.resume.name.trim().length < 2) {
    criticalIssues.push('Name is missing or incomplete');
  }
  
  if (!result.resume.contact.email && !result.resume.contact.phone) {
    criticalIssues.push('No contact information found');
  }
  
  if (result.resume.experiences.length === 0 && result.resume.education.length === 0) {
    criticalIssues.push('No work experience or education found');
  }
  
  // Suggestions for improvement
  if (result.confidence < 0.7) {
    suggestions.push('Consider manually reviewing and correcting parsed information');
  }
  
  if (result.resume.summary === '') {
    suggestions.push('Add a professional summary');
  }
  
  if (result.resume.skills.length === 0) {
    suggestions.push('Add skills section');
  }
  
  if (result.warnings.length > 0) {
    suggestions.push('Review parsing warnings for potential issues');
  }
  
  return {
    isValid: criticalIssues.length === 0,
    criticalIssues,
    suggestions,
  };
}

// Get parsing statistics for analytics
export function getParsingStats(results: ParseResumeResult[]): {
  totalParsed: number;
  averageConfidence: number;
  methodBreakdown: Record<string, number>;
  averageProcessingTime: number;
  commonWarnings: Array<{ warning: string; count: number }>;
} {
  if (results.length === 0) {
    return {
      totalParsed: 0,
      averageConfidence: 0,
      methodBreakdown: {},
      averageProcessingTime: 0,
      commonWarnings: [],
    };
  }
  
  const totalParsed = results.length;
  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalParsed;
  const averageProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / totalParsed;
  
  const methodBreakdown = results.reduce((acc, r) => {
    acc[r.method] = (acc[r.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count warnings
  const warningCounts = new Map<string, number>();
  results.forEach(r => {
    r.warnings.forEach(warning => {
      warningCounts.set(warning, (warningCounts.get(warning) || 0) + 1);
    });
  });
  
  const commonWarnings = Array.from(warningCounts.entries())
    .map(([warning, count]) => ({ warning, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    totalParsed,
    averageConfidence,
    methodBreakdown,
    averageProcessingTime,
    commonWarnings,
  };
}
