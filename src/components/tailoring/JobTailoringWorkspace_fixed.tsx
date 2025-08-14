/**
 * Job Tailoring Workspace
 * Left: JD input, Center: Diff view, Right: ATS keyword analysis
 */

'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../lib/store';
import { updateResume } from '../../lib/store/resumeSlice';
import { 
  setJobDescription, 
  generateSuggestions, 
  applySuggestion, 
  revertChange,
  fetchJobFromUrl,
  clearAnalysis,
  applyAllSuggestions,
  rejectAllSuggestions,
  rejectSuggestion,
  revertSuggestion
} from '../../lib/store/jobTailoringSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Link, 
  Sparkles, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  RotateCcw,
  Tags,
  BarChart3,
  Settings,
  Check,
  X,
  Download,
  Trash2,
  CheckSquare
} from 'lucide-react';
import { DiffView } from './DiffView';
import { KeywordCloud } from './KeywordCloud';
import { runAI } from '../../lib/ai/run';
import { extractJobKeywords, calculateATSScore, generateATSSuggestions } from '../../lib/ats/keyword-extract';
import { toast } from 'react-hot-toast';

export default function JobTailoringWorkspace() {
  const dispatch = useDispatch();
  const currentResume = useSelector((state: RootState) => state.resume.resume);
  const { 
    jobDescription, 
    jobUrl: stateJobUrl,
    suggestions, 
    isAnalyzing,
    isFetchingJob,
    atsScore,
    keywords,
    error 
  } = useSelector((state: RootState) => state.jobTailoring);
  
  const [jobUrl, setJobUrl] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('openai');

  // Derived state
  const isExtracting = isFetchingJob;
  const isGenerating = isAnalyzing;

  // Extract job description from URL
  const extractFromUrl = async () => {
    if (!jobUrl) {
      toast.error('Please enter a job URL');
      return;
    }

    try {
      await dispatch(fetchJobFromUrl(jobUrl));
    } catch (error) {
      toast.error('Failed to extract job description from URL');
    }
  };

  // Generate AI suggestions
  const handleGenerateSuggestions = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    
    if (!currentResume) {
      toast.error('No resume found. Please create or upload a resume first.');
      return;
    }

    try {
      await dispatch(generateSuggestions({ 
        resume: currentResume, 
        jobDescription,
        provider: selectedProvider
      }));
    } catch (error) {
      toast.error('Failed to generate suggestions');
    }
  };

  // Handle suggestion actions
  const handleApplySuggestion = (suggestionId: string) => {
    dispatch(applySuggestion(suggestionId));
    toast.success('Suggestion applied!');
  };

  const handleRevertSuggestion = (suggestionId: string) => {
    dispatch(revertChange(suggestionId));
    toast.success('Change reverted!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Job Tailoring Workspace</h1>
          <p className="text-xl text-muted-foreground">
            Customize your resume for specific job opportunities with AI-powered analysis
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Job Description Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Job URL Extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste job posting URL..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={extractFromUrl}
                    disabled={isExtracting || !jobUrl}
                    variant="outline"
                  >
                    {isExtracting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Extract job description from LinkedIn, Indeed, or other job sites
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste or type the job description here..."
                  value={jobDescription}
                  onChange={(e) => dispatch(setJobDescription(e.target.value))}
                  className="min-h-[300px] resize-y"
                />
                <div className="flex gap-2">
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="google">Google</option>
                  </select>
                  <Button 
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating || !jobDescription}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Suggestions
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => dispatch(applyAllSuggestions())}
                  disabled={suggestions.length === 0}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Apply All Suggestions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => dispatch(rejectAllSuggestions())}
                  disabled={suggestions.length === 0}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject All
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => dispatch(clearAnalysis())}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel: AI Suggestions & Diff View */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  AI Suggestions ({suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Generate suggestions to see AI-powered improvements
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{suggestion.section}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {suggestion.confidence}%
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {suggestion.accepted === true ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRevertSuggestion(suggestion.id)}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Revert
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => handleApplySuggestion(suggestion.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Apply
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3">{suggestion.rationale}</p>
                        
                        <DiffView
                          before={suggestion.currentText}
                          after={suggestion.proposedText}
                        />
                        
                        {suggestion.keywordHits && suggestion.keywordHits.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {suggestion.keywordHits.map((keyword: string) => (
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
                    {atsScore ? Math.round(atsScore.score || 0) : 0}%
                  </div>
                  <Progress value={atsScore ? Math.round(atsScore.score || 0) : 0} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Applicant Tracking System Compatibility
                  </p>
                </div>

                {keywords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Key Terms</h4>
                    <div className="flex flex-wrap gap-1">
                      {keywords.slice(0, 20).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {atsScore?.missingKeywords && atsScore.missingKeywords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-red-600">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {atsScore.missingKeywords.slice(0, 10).map((keyword: string) => (
                        <Badge key={keyword} variant="destructive" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {atsScore?.recommendations && (
                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <ul className="space-y-1 text-sm">
                      {atsScore.recommendations.slice(0, 5).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Keyword Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordCloud 
                  keywords={keywords}
                  missingKeywords={atsScore?.missingKeywords || []}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
