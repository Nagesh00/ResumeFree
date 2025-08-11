'use client';

import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateResume } from '../../lib/store/slices/resumeSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Download, ArrowRight } from 'lucide-react';
import { extractPDFContent } from '../../lib/parsing/pdf-extract';
import { parseResumeContent } from '../../lib/parsing/postprocess';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ParsedResult {
  resume: any;
  confidence: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
  };
  raw: string;
}

export default function ResumeParserClient() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [aiProvider, setAiProvider] = useState('perplexity');
  const [processingMode, setProcessingMode] = useState('enhanced');
  const [redactPII, setRedactPII] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const parseResume = async () => {
    if (!file) return;

    setParsing(true);
    setProgress(0);

    try {
      // Step 1: Extract text content (20%)
      setProgress(20);
      let textContent = '';

      if (file.type === 'application/pdf') {
        const pdfResult = await extractPDFContent(file);
        textContent = pdfResult.text;
      } else if (file.type === 'text/plain') {
        textContent = await file.text();
      } else {
        // For DOCX, we'd need a library like mammoth.js
        throw new Error('DOCX parsing not implemented yet');
      }

      // Step 2: Basic parsing (40%)
      setProgress(40);
      
      if (processingMode === 'privacy') {
        // Local-only parsing without AI
        const basicResult = parseResumeBasic(textContent);
        setResult({
          resume: basicResult,
          confidence: { personalInfo: 70, experience: 60, education: 60, skills: 70 },
          raw: textContent
        });
        setProgress(100);
        toast.success('Resume parsed successfully (Privacy mode)');
        return;
      }

      // Step 3: AI enhancement (60-80%)
      setProgress(60);
      
      if (processingMode === 'enhanced') {
        const aiResult = await parseWithAI(textContent, aiProvider, redactPII);
        setProgress(80);
        
        setResult({
          resume: aiResult.resume,
          confidence: aiResult.confidence,
          raw: textContent
        });
      }

      // Step 4: Complete (100%)
      setProgress(100);
      toast.success('Resume parsed successfully with AI enhancement!');

    } catch (error) {
      console.error('Parsing error:', error);
      toast.error(`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setParsing(false);
    }
  };

  const parseResumeBasic = (text: string) => {
    // Basic regex-based parsing
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    
    const email = text.match(emailRegex)?.[0] || '';
    const phone = text.match(phoneRegex)?.[0] || '';
    
    // Extract name (first few lines, excluding email/phone)
    const lines = text.split('\n').filter(line => line.trim());
    const nameCandidate = lines.find(line => 
      !emailRegex.test(line) && 
      !phoneRegex.test(line) && 
      line.length > 2 && 
      line.length < 50
    ) || '';

    return {
      personalInfo: {
        fullName: nameCandidate,
        email: email,
        phone: phone,
        location: '',
        summary: ''
      },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    };
  };

  const parseWithAI = async (text: string, provider: string, redact: boolean) => {
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        provider,
        redactPII: redact
      })
    });

    if (!response.ok) {
      throw new Error(`AI parsing failed: ${response.statusText}`);
    }

    return await response.json();
  };

  const importToBuilder = () => {
    if (result) {
      dispatch(updateResume(result.resume));
      toast.success('Resume imported to builder!');
      router.push('/resume-builder');
    }
  };

  const downloadJSON = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result.resume, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parsed-resume-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Resume Parser</h1>
          <p className="text-xl text-muted-foreground">
            Upload your existing resume and let AI extract and structure your information
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, TXT (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    {file ? (
                      <FileText className="w-8 h-8 text-primary" />
                    ) : (
                      <Upload className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    {file ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{file.name}</h3>
                        <p className="text-muted-foreground mb-4">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button onClick={parseResume} disabled={parsing} size="lg">
                          {parsing ? 'Parsing...' : 'Parse Resume'}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Drop your resume here</h3>
                        <p className="text-muted-foreground mb-4">
                          or click to browse files
                        </p>
                        <Button size="lg">Choose File</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">AI Provider</label>
                  <select 
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    disabled={parsing}
                  >
                    <option value="">No AI Processing</option>
                    <option value="perplexity">Perplexity</option>
                    <option value="google">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Processing Mode</label>
                  <select 
                    value={processingMode}
                    onChange={(e) => setProcessingMode(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    disabled={parsing}
                  >
                    <option value="standard">Standard Parsing</option>
                    <option value="enhanced">Enhanced AI Processing</option>
                    <option value="privacy">Privacy Mode (Local Only)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={redactPII}
                    onChange={(e) => setRedactPII(e.target.checked)}
                    disabled={parsing}
                  />
                  <span className="text-sm">Redact personally identifiable information (PII)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Processing Status */}
          {parsing && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">File uploaded successfully</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {progress >= 20 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                      )}
                      <span className="text-sm">Extracting text content...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {progress >= 60 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : progress >= 40 ? (
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-300 rounded-full" />
                      )}
                      <span className="text-sm">AI processing sections...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {progress >= 100 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : progress >= 80 ? (
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-300 rounded-full" />
                      )}
                      <span className="text-sm">Structuring data...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Parsed Resume Data</CardTitle>
                <CardDescription>Review the extracted information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Extracted Information</h3>
                    <div className="bg-muted p-4 rounded text-sm space-y-2">
                      <div><strong>Name:</strong> {result.resume.personalInfo.fullName || 'Not found'}</div>
                      <div><strong>Email:</strong> {result.resume.personalInfo.email || 'Not found'}</div>
                      <div><strong>Phone:</strong> {result.resume.personalInfo.phone || 'Not found'}</div>
                      <div><strong>Experience:</strong> {result.resume.experiences.length} positions</div>
                      <div><strong>Education:</strong> {result.resume.education.length} entries</div>
                      <div><strong>Skills:</strong> {result.resume.skills.length} skills</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Confidence Scores</h3>
                    <div className="space-y-3">
                      {Object.entries(result.confidence).map(([section, score]) => (
                        <div key={section} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{section.replace(/([A-Z])/g, ' $1')}</span>
                            <span className={score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                              {score}%
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button onClick={importToBuilder} className="flex-1 sm:flex-none">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Import to Builder
                  </Button>
                  <Button onClick={downloadJSON} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
