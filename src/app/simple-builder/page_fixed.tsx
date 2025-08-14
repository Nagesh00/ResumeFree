'use client';

import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Settings, Download, Eye, Plus, 
  Trash2, Save, Share2, Moon, Sun, Bot, Sparkles, Wand2, Target, Lightbulb,
  FolderOpen, Palette, Zap, BarChart3, Rocket
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SimpleBuilder() {
  const [resumeData, setResumeData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@openai.com',
    phone: '+1 (555) 123-4567',
    website: 'linkedin.com/in/alexjohnson',
    location: 'San Francisco, CA',
    objective: 'Innovative AI Engineer with 8+ years of experience developing cutting-edge machine learning systems and leading cross-functional teams. Proven track record of implementing scalable AI solutions that drive business impact and enhance user experiences.',
    experience: [
      {
        company: 'OpenAI',
        jobTitle: 'Senior AI Engineer',
        date: '2022 - Present',
        description: [
          '• Led development of GPT-4 optimization techniques, improving inference speed by 40%',
          '• Architected distributed training systems for large language models using PyTorch and Ray',
          '• Collaborated with product teams to integrate AI capabilities into consumer applications',
          '• Mentored junior engineers and established ML engineering best practices'
        ]
      },
      {
        company: 'Meta (Facebook)',
        jobTitle: 'Machine Learning Engineer',
        date: '2019 - 2022',
        description: [
          '• Built recommendation systems serving 2B+ users with sub-100ms latency requirements',
          '• Implemented A/B testing frameworks for ML model evaluation and deployment',
          '• Optimized deep learning pipelines reducing training time by 60% using distributed computing'
        ]
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Master of Science in Computer Science',
        date: '2017 - 2019',
        details: 'Specialization in Artificial Intelligence and Machine Learning'
      },
      {
        school: 'MIT (Online)',
        degree: 'Certificate in Deep Learning',
        date: '2020',
        details: 'Advanced neural networks, computer vision, and natural language processing'
      }
    ],
    projects: [
      {
        name: 'Neural Code Generation',
        description: [
          '• Developed transformer-based model for automated code generation with 85% accuracy',
          '• Implemented multi-provider AI system (OpenAI, Anthropic, Google) for content generation',
          '• Created real-time collaboration features with WebSocket integration',
          '• Built responsive React interface with TypeScript and Tailwind CSS'
        ],
        technologies: 'Python, PyTorch, React, TypeScript, Docker, AWS'
      }
    ],
    skills: {
      'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'C++', 'SQL', 'R'],
      'AI/ML Frameworks': ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'OpenAI API'],
      'Cloud & DevOps': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      'Web Development': ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB'],
      'Data Science': ['Pandas', 'NumPy', 'Scikit-learn', 'Jupyter', 'MLflow']
    }
  });

  const [theme, setTheme] = useState({
    color: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 11,
    spacing: 'Standard'
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  // Professional Templates
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for tech and corporate roles',
      theme: { color: '#3b82f6', fontFamily: 'Inter', fontSize: 11, spacing: 'Standard' },
      preview: '🎨 Clean lines, modern typography'
    },
    {
      id: 'executive',
      name: 'Executive Elite',
      description: 'Sophisticated layout ideal for senior management positions',
      theme: { color: '#1f2937', fontFamily: 'Times New Roman', fontSize: 12, spacing: 'Spacious' },
      preview: '👔 Elegant, professional excellence'
    },
    {
      id: 'creative',
      name: 'Creative Edge',
      description: 'Bold and innovative design for creative professionals',
      theme: { color: '#8b5cf6', fontFamily: 'Inter', fontSize: 11, spacing: 'Standard' },
      preview: '🎭 Artistic flair, creative expression'
    },
    {
      id: 'academic',
      name: 'Academic Scholar',
      description: 'Traditional format perfect for academic and research positions',
      theme: { color: '#059669', fontFamily: 'Times New Roman', fontSize: 11, spacing: 'Compact' },
      preview: '🎓 Scholarly, research-focused'
    },
    {
      id: 'startup',
      name: 'Startup Dynamic',
      description: 'Fresh and energetic design for startup environments',
      theme: { color: '#f59e0b', fontFamily: 'Inter', fontSize: 11, spacing: 'Standard' },
      preview: '🚀 Innovative, startup energy'
    }
  ];

  // AI Enhancement functions
  const enhanceWithAI = async (section: string, type: string) => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`AI enhanced your ${section} section!`);
    } catch (error) {
      toast.error('AI enhancement failed. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAISuggestions = async () => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('AI generated personalized suggestions!');
    } catch (error) {
      toast.error('Failed to generate AI suggestions.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User, title: 'Personal Information', count: null },
    { id: 'experience', name: 'Experience', icon: Briefcase, title: 'Work Experience', count: resumeData.experience.length },
    { id: 'education', name: 'Education', icon: GraduationCap, title: 'Education', count: resumeData.education.length },
    { id: 'projects', name: 'Projects', icon: FolderOpen, title: 'Projects', count: resumeData.projects.length },
    { id: 'skills', name: 'Skills', icon: Award, title: 'Skills', count: Object.keys(resumeData.skills).length },
    { id: 'templates', name: 'Templates', icon: Palette, title: 'Templates', count: null },
    { id: 'settings', name: 'Settings', icon: Settings, title: 'Settings', count: null }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Enhanced Header */}
      <div className={`shadow-lg border-b transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Resume Builder
                  </h1>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Professional resumes powered by artificial intelligence
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* AI Assistant Toggle */}
              <button
                onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isAIAssistantOpen 
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bot className="w-4 h-4" />
                AI Assistant
                {isGeneratingAI && <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
              </button>

              {/* Preview Mode Toggle */}
              <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                {['desktop', 'tablet', 'mobile'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      previewMode === mode
                        ? 'bg-blue-600 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400' 
                    : 'bg-gray-700 text-yellow-500 hover:bg-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Action Buttons */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* AI Assistant Panel */}
          {isAIAssistantOpen && (
            <div className={`mt-6 p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-purple-500 text-gray-200' 
                : 'bg-purple-50 border-purple-300 text-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Writing Assistant</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={generateAISuggestions}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className="w-4 h-4" />
                    Generate Suggestions
                  </button>
                  <button
                    onClick={() => enhanceWithAI('current', 'content')}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    Enhance Content
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Job Tailoring</span>
                  </div>
                  <p className="text-sm opacity-75">Optimize your resume for specific job postings using AI analysis</p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">ATS Scoring</span>
                  </div>
                  <p className="text-sm opacity-75">Real-time compatibility analysis with Applicant Tracking Systems</p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Smart Enhancement</span>
                  </div>
                  <p className="text-sm opacity-75">AI-powered content improvement and professional writing assistance</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Analytics & Navigation */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Analytics */}
            <div className={`p-6 rounded-xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Resume Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">92%</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ATS Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{Object.keys(resumeData.skills).length}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Skills Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{resumeData.experience.length}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Work Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{resumeData.projects.length}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projects</div>
                </div>
              </div>
            </div>

            {/* Section Navigation */}
            <div className={`p-6 rounded-xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Sections</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{section.title}</span>
                    {section.count && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white'
                          : isDarkMode
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {section.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Enhancement Panel */}
            <div className={`p-6 rounded-xl shadow-sm border-2 border-dashed ${isDarkMode ? 'bg-gray-800 border-purple-500' : 'bg-purple-50 border-purple-300'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Enhancements</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => enhanceWithAI('content', 'professional')}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md"
                >
                  <Wand2 className="w-4 h-4" />
                  Enhance Content
                </button>
                <button 
                  onClick={() => enhanceWithAI('keywords', 'ats')}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-md"
                >
                  <Target className="w-4 h-4" />
                  Optimize for ATS
                </button>
                <button 
                  onClick={generateAISuggestions}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md"
                >
                  <Lightbulb className="w-4 h-4" />
                  Get Suggestions
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Form Panel */}
              <div className="space-y-6">
                
                {/* Navigation Tabs */}
                <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex overflow-x-auto">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            activeSection === section.id
                              ? isDarkMode
                                ? 'bg-blue-900 text-blue-200 border-b-2 border-blue-400'
                                : 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                              : isDarkMode
                                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {section.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Area */}
                <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  
                  {/* Personal Information */}
                  {activeSection === 'personal' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your basic contact details and professional summary</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                          <input
                            type="text"
                            value={resumeData.name}
                            onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                            } focus:outline-none focus:ring-2 focus:border-transparent`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                          <input
                            type="email"
                            value={resumeData.email}
                            onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                            } focus:outline-none focus:ring-2 focus:border-transparent`}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Professional Summary</label>
                        <textarea
                          value={resumeData.objective}
                          onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:border-transparent`}
                          placeholder="Write a compelling professional summary..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Templates Section */}
                  {activeSection === 'templates' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Professional Templates</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose from AI-optimized resume designs</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setTheme(template.theme);
                              toast.success(`Applied ${template.name} template!`);
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              selectedTemplate === template.id
                                ? isDarkMode
                                  ? 'border-blue-400 bg-blue-900/20'
                                  : 'border-blue-500 bg-blue-50'
                                : isDarkMode
                                  ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {template.name}
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                  {template.description}
                                </p>
                                <div className="text-xs font-medium" style={{ color: template.theme.color }}>
                                  {template.preview}
                                </div>
                              </div>
                              {selectedTemplate === template.id && (
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.theme.color }}></div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {template.theme.fontFamily} • {template.theme.spacing}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>

              {/* Preview Panel */}
              <div className="sticky top-8">
                <div className={`rounded-xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {/* Preview Header */}
                  <div className={`px-6 py-4 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Live Preview</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time resume preview</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.print()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          Export PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Resume Preview */}
                  <div className={`p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ fontFamily: theme.fontFamily }}>
                    <div 
                      className={`max-w-none mx-auto bg-white shadow-xl border border-gray-200 ${
                        theme.spacing === 'Compact' ? 'p-6' : 
                        theme.spacing === 'Spacious' ? 'p-10' : 'p-8'
                      }`}
                      style={{ 
                        fontSize: `${theme.fontSize}pt`,
                        minHeight: '800px',
                        width: '8.5in',
                        transform: 'scale(0.75)',
                        transformOrigin: 'top left',
                        margin: '0 auto'
                      }}
                    >
                      
                      {/* Header */}
                      <div className="text-center border-b-3 pb-6 mb-6" style={{ borderColor: theme.color }}>
                        <h1 
                          className="text-4xl font-bold mb-3" 
                          style={{ color: theme.color, fontSize: `${theme.fontSize * 2.5}pt` }}
                        >
                          {resumeData.name || 'Your Name'}
                        </h1>
                        <div className="text-gray-600 space-y-2">
                          <div className="flex justify-center items-center gap-4 flex-wrap">
                            {resumeData.email && (
                              <span className="flex items-center gap-1">
                                <span>📧</span> {resumeData.email}
                              </span>
                            )}
                            {resumeData.phone && (
                              <span className="flex items-center gap-1">
                                <span>📞</span> {resumeData.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Professional Summary */}
                      {resumeData.objective && (
                        <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                          <h2 
                            className="text-xl font-bold mb-3 pb-1 border-b-2" 
                            style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                          >
                            PROFESSIONAL SUMMARY
                          </h2>
                          <p className="text-gray-700 leading-relaxed text-justify">
                            {resumeData.objective}
                          </p>
                        </div>
                      )}

                      {/* Work Experience */}
                      {resumeData.experience.length > 0 && (
                        <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                          <h2 
                            className="text-xl font-bold mb-4 pb-1 border-b-2" 
                            style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                          >
                            WORK EXPERIENCE
                          </h2>
                          {resumeData.experience.map((exp, index) => (
                            <div key={index} className={theme.spacing === 'Compact' ? 'mb-3' : theme.spacing === 'Spacious' ? 'mb-6' : 'mb-4'}>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg" style={{ color: theme.color }}>
                                    {exp.jobTitle || 'Job Title'}
                                  </h3>
                                  <p className="font-semibold text-gray-800">
                                    {exp.company || 'Company Name'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span 
                                    className="font-medium px-3 py-1 rounded-full text-sm"
                                    style={{ backgroundColor: theme.color + '20', color: theme.color }}
                                  >
                                    {exp.date || 'Date'}
                                  </span>
                                </div>
                              </div>
                              <ul className="list-none space-y-1.5 ml-0">
                                {exp.description.filter(desc => desc.trim()).map((desc, i) => (
                                  <li key={i} className="text-gray-700 leading-relaxed flex items-start">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.color }}></span>
                                    <span>{desc.replace(/^•\s*/, '')}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      {Object.keys(resumeData.skills).length > 0 && (
                        <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                          <h2 
                            className="text-xl font-bold mb-4 pb-1 border-b-2" 
                            style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                          >
                            TECHNICAL SKILLS
                          </h2>
                          <div className="space-y-3">
                            {Object.entries(resumeData.skills).map(([category, skillsList], index) => (
                              <div key={index}>
                                <h3 className="font-semibold text-gray-800 mb-2">{category}:</h3>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(skillsList) ? skillsList.map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="px-3 py-1.5 rounded-full font-medium text-sm"
                                      style={{ 
                                        backgroundColor: theme.color + '15', 
                                        color: theme.color,
                                        border: `1px solid ${theme.color}30`
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  )) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
