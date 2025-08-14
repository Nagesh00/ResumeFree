'use client';

import { useState } from 'react';
import { Plus, Trash2, Download, Eye, Settings, User, Briefcase, GraduationCap, FolderOpen, Award } from 'lucide-react';

interface ResumeData {
  name: string;
  objective: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  workExperience: Array<{
    company: string;
    jobTitle: string;
    date: string;
    description: string[];
  }>;
  education: Array<{
    school: string;
    date: string;
    degree: string;
    gpa?: string;
    additionalInfo?: string;
  }>;
  projects: Array<{
    name: string;
    date: string;
    description: string[];
  }>;
  skills: {
    skillsList: string[];
    featuredSkills: Array<{
      name: string;
      level: number;
    }>;
  };
}

export default function SimpleBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: 'John Doe',
    objective: 'Software engineer with 3+ years of experience developing scalable web applications',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    website: 'linkedin.com/in/johndoe',
    location: 'San Francisco, CA',
    workExperience: [{
      company: 'Tech Company',
      jobTitle: 'Software Engineer',
      date: '2021 - Present',
      description: ['Developed and maintained web applications using React and Node.js', 'Collaborated with cross-functional teams to deliver features']
    }],
    education: [{
      school: 'University of California',
      date: '2017 - 2021',
      degree: 'Bachelor of Science in Computer Science',
      gpa: '3.8'
    }],
    projects: [{
      name: 'E-commerce Platform',
      date: '2023',
      description: ['Built a full-stack e-commerce platform using Next.js and PostgreSQL', 'Implemented payment processing and inventory management']
    }],
    skills: {
      skillsList: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
      featuredSkills: [
        { name: 'JavaScript', level: 5 },
        { name: 'React', level: 4 },
        { name: 'Node.js', level: 4 }
      ]
    }
  });

  const [theme, setTheme] = useState({
    color: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 11,
    spacing: 'Standard'
  });

  const [activeSection, setActiveSection] = useState('personal');

  const addWorkExperience = () => {
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        company: '',
        jobTitle: '',
        date: '',
        description: ['']
      }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        date: '',
        degree: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        date: '',
        description: ['']
      }]
    }));
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a skill:');
    if (newSkill) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          skillsList: [...prev.skills.skillsList, newSkill]
        }
      }));
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        skillsList: prev.skills.skillsList.filter((_, i) => i !== index)
      }
    }));
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'experience', name: 'Work Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
    { id: 'skills', name: 'Skills', icon: Award },
    { id: 'settings', name: 'Theme Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">Create a professional resume in minutes</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel - Form */}
          <div className="space-y-6">
            
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex overflow-x-auto">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
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
            <div className="bg-white rounded-xl shadow-sm border p-6">
              
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.name}
                        onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website/LinkedIn</label>
                      <input
                        type="text"
                        value={resumeData.website}
                        onChange={(e) => setResumeData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="linkedin.com/in/yourname"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                    <textarea
                      value={resumeData.objective}
                      onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write a brief summary of your professional background and career goals..."
                    />
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {activeSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold">Work Experience</h2>
                    </div>
                    <button
                      onClick={addWorkExperience}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Job
                    </button>
                  </div>
                  
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Job #{index + 1}</h3>
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...resumeData.workExperience];
                              newExp[index].company = e.target.value;
                              setResumeData(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Company name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const newExp = [...resumeData.workExperience];
                              newExp[index].jobTitle = e.target.value;
                              setResumeData(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your job title"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employment Period</label>
                        <input
                          type="text"
                          value={exp.date}
                          onChange={(e) => {
                            const newExp = [...resumeData.workExperience];
                            newExp[index].date = e.target.value;
                            setResumeData(prev => ({ ...prev, workExperience: newExp }));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Jan 2021 - Present"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                        <textarea
                          value={exp.description.join('\n')}
                          onChange={(e) => {
                            const newExp = [...resumeData.workExperience];
                            newExp[index].description = e.target.value.split('\n');
                            setResumeData(prev => ({ ...prev, workExperience: newExp }));
                          }}
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Focus on quantifiable results"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {activeSection === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold">Education</h2>
                    </div>
                    <button
                      onClick={addEducation}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add School
                    </button>
                  </div>
                  
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Education #{index + 1}</h3>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School/University</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].school = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="University name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Degree & Major</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].degree = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Bachelor of Science in Computer Science"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.date}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].date = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="May 2021"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                          <input
                            type="text"
                            value={edu.gpa || ''}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].gpa = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3.8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {activeSection === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold">Projects</h2>
                    </div>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>
                  
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Project #{index + 1}</h3>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              const newProjects = [...resumeData.projects];
                              newProjects[index].name = e.target.value;
                              setResumeData(prev => ({ ...prev, projects: newProjects }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Project name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <input
                            type="text"
                            value={project.date}
                            onChange={(e) => {
                              const newProjects = [...resumeData.projects];
                              newProjects[index].date = e.target.value;
                              setResumeData(prev => ({ ...prev, projects: newProjects }));
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="2023"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={project.description.join('\n')}
                          onChange={(e) => {
                            const newProjects = [...resumeData.projects];
                            newProjects[index].description = e.target.value.split('\n');
                            setResumeData(prev => ({ ...prev, projects: newProjects }));
                          }}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="• Describe what you built and technologies used&#10;• Highlight key features and achievements"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {activeSection === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold">Skills</h2>
                    </div>
                    <button
                      onClick={addSkill}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.skillsList.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Settings */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Theme Settings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Theme Color</label>
                      <div className="flex gap-3">
                        {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setTheme(prev => ({ ...prev, color }))}
                            className={`w-10 h-10 rounded-lg border-2 ${theme.color === color ? 'border-gray-400' : 'border-gray-200'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={theme.color}
                        onChange={(e) => setTheme(prev => ({ ...prev, color: e.target.value }))}
                        className="mt-3 w-full h-12 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Font Family</label>
                      <select
                        value={theme.fontFamily}
                        onChange={(e) => setTheme(prev => ({ ...prev, fontFamily: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Inter">Inter (Modern)</option>
                        <option value="Roboto">Roboto (Clean)</option>
                        <option value="Open Sans">Open Sans (Friendly)</option>
                        <option value="Lato">Lato (Professional)</option>
                        <option value="Montserrat">Montserrat (Elegant)</option>
                        <option value="Source Sans Pro">Source Sans Pro (Technical)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                      <select
                        value={theme.fontSize}
                        onChange={(e) => setTheme(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={10}>Small (10pt)</option>
                        <option value={11}>Medium (11pt)</option>
                        <option value={12}>Large (12pt)</option>
                        <option value={13}>Extra Large (13pt)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Layout Spacing</label>
                      <select
                        value={theme.spacing}
                        onChange={(e) => setTheme(prev => ({ ...prev, spacing: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Compact">Compact</option>
                        <option value="Standard">Standard</option>
                        <option value="Spacious">Spacious</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume Preview */}
              <div className="p-8 bg-white" style={{ fontFamily: theme.fontFamily }}>
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
                      <div className="flex justify-center items-center gap-4 flex-wrap">
                        {resumeData.website && (
                          <span className="flex items-center gap-1">
                            <span>🌐</span> {resumeData.website}
                          </span>
                        )}
                        {resumeData.location && (
                          <span className="flex items-center gap-1">
                            <span>📍</span> {resumeData.location}
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
                  {resumeData.workExperience.length > 0 && (
                    <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                      <h2 
                        className="text-xl font-bold mb-4 pb-1 border-b-2" 
                        style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                      >
                        WORK EXPERIENCE
                      </h2>
                      {resumeData.workExperience.map((exp, index) => (
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

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                      <h2 
                        className="text-xl font-bold mb-4 pb-1 border-b-2" 
                        style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                      >
                        EDUCATION
                      </h2>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className={theme.spacing === 'Compact' ? 'mb-2' : theme.spacing === 'Spacious' ? 'mb-4' : 'mb-3'}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold" style={{ color: theme.color }}>
                                {edu.degree || 'Degree'}
                              </h3>
                              <p className="font-medium text-gray-800">
                                {edu.school || 'School Name'}
                              </p>
                              {edu.gpa && (
                                <p className="text-gray-600 text-sm">
                                  GPA: {edu.gpa}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span 
                                className="font-medium px-3 py-1 rounded-full text-sm"
                                style={{ backgroundColor: theme.color + '20', color: theme.color }}
                              >
                                {edu.date || 'Date'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.length > 0 && (
                    <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                      <h2 
                        className="text-xl font-bold mb-4 pb-1 border-b-2" 
                        style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                      >
                        PROJECTS
                      </h2>
                      {resumeData.projects.map((project, index) => (
                        <div key={index} className={theme.spacing === 'Compact' ? 'mb-3' : theme.spacing === 'Spacious' ? 'mb-5' : 'mb-4'}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg" style={{ color: theme.color }}>
                              {project.name || 'Project Name'}
                            </h3>
                            <span 
                              className="font-medium px-3 py-1 rounded-full text-sm"
                              style={{ backgroundColor: theme.color + '20', color: theme.color }}
                            >
                              {project.date || 'Date'}
                            </span>
                          </div>
                          <ul className="list-none space-y-1.5 ml-0">
                            {project.description.filter(desc => desc.trim()).map((desc, i) => (
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
                  {resumeData.skills.skillsList.length > 0 && (
                    <div className={theme.spacing === 'Compact' ? 'mb-4' : theme.spacing === 'Spacious' ? 'mb-8' : 'mb-6'}>
                      <h2 
                        className="text-xl font-bold mb-4 pb-1 border-b-2" 
                        style={{ color: theme.color, borderColor: theme.color, fontSize: `${theme.fontSize * 1.4}pt` }}
                      >
                        TECHNICAL SKILLS
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.skillsList.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full font-medium text-sm"
                            style={{ 
                              backgroundColor: theme.color + '15', 
                              color: theme.color,
                              border: `1px solid ${theme.color}30`
                            }}
                          >
                            {skill}
                          </span>
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
  );
}
