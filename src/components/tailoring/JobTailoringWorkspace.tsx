/**
 * Job Tailoring Workspace
 * Left: JD input, Center: Diff view, Right: ATS keyword analysis
 */

'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../lib/store';
import { updateResume } from '../../../lib/store/slices/resumeSlice';
import { 
  setJobDescription, 
  generateSuggestions, 
  applySuggestion, 
  revertChange 
} from '../../../lib/store/slices/tailoringSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Link, 
  Sparkles, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  RotateCcw 
} from 'lucide-react';
import { DiffView } from './DiffView';
import { KeywordCloud } from './KeywordCloud';
import { runAI } from '../../../lib/ai/run';
import { extractJobKeywords, calculateATSScore } from '../../../lib/ats/keyword-extract';
import { toast } from 'react-hot-toast';

interface TailoringSuggestion {
  id: string;
  section: string;
  currentText: string;
  proposedText: string;
  rationale: string;
  keywordHits: string[];
  confidence: number;
  applied: boolean;
}

export default function JobTailoringWorkspace() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state: RootState) => state.resume);
  const { jobDescription, suggestions, isGenerating } = useSelector((state: RootState) => state.tailoring);
  
  const [jobUrl, setJobUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState(0);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  // Extract job description from URL
  const extractFromUrl = async () => {
    if (!jobUrl) return;
    
    setIsExtracting(true);
    try {
      // Fetch webpage content
      const response = await fetch('/api/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl })
      });
      
      if (!response.ok) throw new Error('Failed to extract job description');
      
      const { jobDescription: extractedJD } = await response.json();
      dispatch(setJobDescription(extractedJD));
      toast.success('Job description extracted successfully!');
    } catch (error) {
      toast.error('Failed to extract job description from URL');
    } finally {
      setIsExtracting(false);
    }
  };

  // Analyze job description for keywords
  useEffect(() => {
    if (jobDescription) {
      const extractedKeywords = extractJobKeywords(jobDescription);
      setKeywords(extractedKeywords);
      
      if (currentResume) {
        const score = calculateATSScore(currentResume, extractedKeywords);
        setAtsScore(score.score);
        setMissingKeywords(score.missingKeywords);
      }
    }
  }, [jobDescription, currentResume]);

  // Generate AI suggestions
  const handleGenerateSuggestions = async () => {
    if (!jobDescription || !currentResume) {
      toast.error('Please provide both job description and resume');
      return;
    }

    try {
      dispatch(generateSuggestions({ 
        resume: currentResume, 
        jobDescription,
        provider: 'openai' // TODO: Get from settings
      }));
    } catch (error) {
      toast.error('Failed to generate suggestions');
    }
  };

  // Apply suggestion
  const handleApplySuggestion = (suggestion: TailoringSuggestion) => {
    dispatch(applySuggestion(suggestion.id));
    
    // Update resume with suggestion
    const updatedResume = { ...currentResume };
    // TODO: Apply the specific changes based on section
    
    dispatch(updateResume(updatedResume));
    toast.success('Suggestion applied!');
  };

  // Revert suggestion
  const handleRevertSuggestion = (suggestion: TailoringSuggestion) => {
    dispatch(revertChange(suggestion.id));
    toast.success('Change reverted!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Job Tailoring Workspace</h1>
          <p className="text-xl text-muted-foreground">
            Customize your resume for specific job opportunities
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Job Description Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL Extractor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Extract from URL</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste job posting URL..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                    <Button 
                      onClick={extractFromUrl}
                      disabled={isExtracting || !jobUrl}
                      size="icon"
                    >
                      {isExtracting ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Manual Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Or paste manually</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => dispatch(setJobDescription(e.target.value))}
                    rows={12}
                  />
                </div>

                <Button 
                  onClick={handleGenerateSuggestions}
                  disabled={isGenerating || !jobDescription}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Suggestions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel: Diff View */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Suggested Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generate suggestions to see proposed changes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium capitalize">{suggestion.section}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={suggestion.confidence} className="w-20 h-2" />
                              <span className="text-sm text-muted-foreground">
                                {suggestion.confidence}%
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {suggestion.applied ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRevertSuggestion(suggestion)}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Revert
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => handleApplySuggestion(suggestion)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Apply
                              </Button>
                            )}
                          </div>
                        </div>

                        <DiffView
                          oldText={suggestion.currentText}
                          newText={suggestion.proposedText}
                        />

                        <div className="mt-3 p-2 bg-muted rounded text-sm">
                          <strong>Rationale:</strong> {suggestion.rationale}
                        </div>

                        {suggestion.keywordHits.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {suggestion.keywordHits.map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: ATS Analysis */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  ATS Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {atsScore}%
                  </div>
                  <Progress value={atsScore} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Applicant Tracking System Compatibility
                  </p>
                </div>

                {keywords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Key Terms</h4>
                    <KeywordCloud keywords={keywords} />
                  </div>
                )}

                {missingKeywords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-orange-600">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((keyword) => (
                        <Badge key={keyword} variant="destructive" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Use exact keywords from job description</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Include relevant technical skills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Quantify achievements with numbers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Use industry-standard terminology</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
