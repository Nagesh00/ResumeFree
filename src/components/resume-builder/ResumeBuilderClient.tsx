'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { updateResume, saveResume } from '../../lib/store/slices/resumeSlice';
import { Resume, Experience, Education, Skill, Contact } from '../../lib/schema/resume';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Plus, Trash2, Download, Save, Sparkles, Eye } from 'lucide-react';
import { generateResumeContent } from '../../lib/ai/resume-generator';
import { exportToPDF } from '../../lib/exporters/pdf';
import { exportToDocx } from '../../lib/exporters/docx';
import { toast } from 'react-hot-toast';

export default function ResumeBuilderClient() {
  const dispatch = useDispatch();
  const resume = useSelector((state: RootState) => state.resume.currentResume);
  const [loading, setLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState('perplexity');
  const [showPreview, setShowPreview] = useState(true);

  // Personal Info handlers
  const updatePersonalInfo = (field: string, value: string) => {
    if (field === 'fullName') {
      dispatch(updateResume({ name: value }));
    } else if (field === 'title') {
      dispatch(updateResume({ title: value }));
    } else if (field === 'summary') {
      dispatch(updateResume({ summary: value }));
    } else {
      // Handle contact fields
      const updatedResume = {
        ...resume,
        contact: { ...resume.contact, [field]: value }
      };
      dispatch(updateResume(updatedResume));
    }
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp_${Date.now()}`,
      company: '',
      title: '',
      location: '',
      startDate: { year: '', month: '' },
      endDate: { year: '', month: '' },
      current: false,
      description: '',
      bullets: [],
      technologies: []
    };
    
    const updatedResume = {
      ...resume,
      experiences: [...resume.experiences, newExperience]
    };
    dispatch(updateResume(updatedResume));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.map((exp: Experience) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    };
    dispatch(updateResume(updatedResume));
  };

  const removeExperience = (id: string) => {
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.filter((exp: Experience) => exp.id !== id)
    };
    dispatch(updateResume(updatedResume));
  };  // Education handlers
  const addEducation = () => {
    const newEducation: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: { year: '', month: '' },
      endDate: { year: '', month: '' },
      gpa: '',
      coursework: [],
      achievements: []
    };
    
    const updatedResume = {
      ...resume,
      education: [...resume.education, newEducation]
    };
    dispatch(updateResume(updatedResume));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updatedResume = {
      ...resume,
      education: resume.education.map((edu: Education) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    };
    dispatch(updateResume(updatedResume));
  };

  const removeEducation = (id: string) => {
    const updatedResume = {
      ...resume,
      education: resume.education.filter((edu: Education) => edu.id !== id)
    };
    dispatch(updateResume(updatedResume));
  };  // Skills handlers
  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      category: 'Technical',
      items: []
    };
    
    const updatedResume = {
      ...resume,
      skills: [...resume.skills, newSkill]
    };
    dispatch(updateResume(updatedResume));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    const updatedResume = {
      ...resume,
      skills: resume.skills.map((skill: Skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    };
    dispatch(updateResume(updatedResume));
  };

  const removeSkill = (id: string) => {
    const updatedResume = {
      ...resume,
      skills: resume.skills.filter((skill: Skill) => skill.id !== id)
    };
    dispatch(updateResume(updatedResume));
  };

  // AI Content Generation
  const generateAIContent = async (section: string, context?: string) => {
    setLoading(true);
    try {
      const result = await generateResumeContent({
        section: section as any,
        context: context || '',
        existingResume: resume,
        provider: aiProvider as any
      });

      if (section === 'summary') {
        updatePersonalInfo('summary', result.content);
      }
      
      toast.success('AI content generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate AI content. Please check your API keys.');
    } finally {
      setLoading(false);
    }
  };

  // Export functions
  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const pdfBlob = await exportToPDF(resume);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.name || 'resume'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleExportDOCX = async () => {
    setLoading(true);
    try {
      const docxBlob = await exportToDocx(resume);
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.name || 'resume'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('DOCX exported successfully!');
    } catch (error) {
      console.error('DOCX export error:', error);
      toast.error('Failed to export DOCX');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    dispatch(saveResume());
    toast.success('Resume saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Resume Builder</h1>
            <p className="text-xl text-muted-foreground">
              Create your professional resume with AI assistance
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            
            <select 
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="perplexity">Perplexity</option>
              <option value="google">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
            
            <Button onClick={handleSave} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={resume.name}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={resume.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resume.contact.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resume.contact.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resume.contact.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIContent('summary')}
                      disabled={loading}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="summary"
                    value={resume.summary || ''}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="Write a brief summary of your professional background..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Your professional work history</CardDescription>
                  </div>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.experiences.map((exp: Experience, index: number) => (
                  <div key={exp.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Experience #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                          placeholder="Job Title"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate ? `${exp.startDate.year}-${(exp.startDate.month || '01').padStart(2, '0')}` : ''}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate ? `${exp.endDate.year}-${(exp.endDate.month || '01').padStart(2, '0')}` : ''}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          />
                          <span className="text-sm">Current</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Description</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIContent('experience', `${exp.title} at ${exp.company}`)}
                          disabled={loading}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          AI Improve
                        </Button>
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                
                {resume.experiences.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No work experience added yet. Click "Add Experience" to get started.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Your technical and soft skills</CardDescription>
                  </div>
                  <Button onClick={addSkill} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.skills.map((skill: Skill, index: number) => (
                  <div key={skill.id} className="flex items-center space-x-4">
                    <Input
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Soft">Soft Skills</option>
                      <option value="Language">Language</option>
                      <option value="Certification">Certification</option>
                    </select>
                    <select
                      value={skill.items.join(', ')}
                      onChange={(e) => updateSkill(skill.id, 'items', e.target.value.split(', ').filter(Boolean))}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {resume.skills.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No skills added yet. Click "Add Skill" to get started.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Export Resume</CardTitle>
                <CardDescription>Download your resume in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button onClick={handleExportPDF} disabled={loading} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button onClick={handleExportDOCX} disabled={loading} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export DOCX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See how your resume will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-8 rounded border shadow-lg resume-preview min-h-[800px]">
                    {/* Preview content */}
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {resume.name || 'Your Name'}
                      </h1>
                      {resume.title && (
                        <p className="text-xl text-gray-600 mb-3">{resume.title}</p>
                      )}
                      <div className="text-sm text-gray-600 space-x-2">
                        {resume.contact.email && <span>{resume.contact.email}</span>}
                        {resume.contact.phone && <span>• {resume.contact.phone}</span>}
                        {resume.contact.location && <span>• {resume.contact.location}</span>}
                      </div>
                    </div>

                    {resume.summary && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
                          Professional Summary
                        </h2>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {resume.summary}
                        </p>
                      </div>
                    )}

                    {resume.experiences.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
                          Work Experience
                        </h2>
                        {resume.experiences.map((exp: Experience) => (
                          <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-gray-800">
                                {exp.title} {exp.company && `• ${exp.company}`}
                              </h3>
                              <span className="text-sm text-gray-600">
                                {exp.startDate ? `${exp.startDate.month || ''} ${exp.startDate.year}` : ''} - {exp.current ? 'Present' : (exp.endDate ? `${exp.endDate.month || ''} ${exp.endDate.year}` : '')}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {resume.skills.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {resume.skills.map((skill: Skill) => (
                            <span
                              key={skill.id}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                            >
                              {skill.category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
