/**
 * Template Selection and Customization UI Components
 * Multi-template theme system interface as specified
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Eye, 
  Download, 
  Palette, 
  Layout, 
  Type, 
  Sliders,
  Check,
  RefreshCw,
  Sparkles,
  FileText,
  Monitor,
  Briefcase,
  User,
  Crown
} from 'lucide-react';
import { ThemeManager, TemplateConfig, TEMPLATES } from '../../../lib/theme/theme-system';
import { Resume } from '../../../lib/schema/resume';
import { RootState } from '../../../store';

interface TemplatePickerProps {
  onTemplateSelect: (templateId: string) => void;
  selectedTemplate?: string;
  resume: Resume;
}

/**
 * Template Preview Card
 */
const TemplatePreviewCard: React.FC<{
  template: TemplateConfig;
  isSelected: boolean;
  onSelect: () => void;
  resume: Resume;
}> = ({ template, isSelected, onSelect, resume }) => {
  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'modern-ats': return <FileText className="w-5 h-5" />;
      case 'compact-two-column': return <Layout className="w-5 h-5" />;
      case 'engineering-lead': return <Monitor className="w-5 h-5" />;
      case 'designer-portfolio': return <Palette className="w-5 h-5" />;
      case 'executive': return <Crown className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const previewContent = (
    <div 
      className="template-preview bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      style={{ 
        backgroundColor: template.colors.background,
        borderColor: isSelected ? template.colors.primary : '#e5e7eb',
        borderWidth: isSelected ? '2px' : '1px',
      }}
    >
      {/* Preview Header */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: template.colors.border }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: template.colors.accent + '20' }}
            >
              {getTemplateIcon(template.id)}
            </div>
            <div>
              <h3 
                className="font-semibold text-sm"
                style={{ color: template.colors.primary }}
              >
                {template.name}
              </h3>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>
          </div>
          {isSelected && (
            <div className="p-1 rounded-full bg-green-100">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          )}
        </div>

        {/* Mini preview of resume content */}
        <div className="space-y-2 text-xs">
          <div 
            className="font-semibold text-center"
            style={{ 
              color: template.colors.primary,
              fontSize: template.spacing.headerSize * 0.4 + 'px'
            }}
          >
            {resume.name || 'Your Name'}
          </div>
          <div 
            className="text-center opacity-75"
            style={{ color: template.colors.text }}
          >
            {resume.contact.email || 'email@example.com'}
          </div>
          
          {/* Section preview */}
          <div className="space-y-1 mt-3">
            <div 
              className="font-medium pb-1 border-b"
              style={{ 
                color: template.colors.accent,
                borderColor: template.colors.border
              }}
            >
              EXPERIENCE
            </div>
            <div className="space-y-1">
              <div 
                className="font-medium"
                style={{ color: template.colors.primary }}
              >
                {resume.experiences[0]?.title || 'Job Title'}
              </div>
              <div style={{ color: template.colors.textLight }}>
                {resume.experiences[0]?.company || 'Company'} | 2021 - Present
              </div>
              <div style={{ color: template.colors.text }}>
                • Key achievement or responsibility
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Features */}
      <div className="p-3">
        <div className="flex flex-wrap gap-1">
          {template.features.map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: template.colors.accent + '20',
                color: template.colors.accent,
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Select Button */}
      <div className="p-3 pt-0">
        <button
          onClick={onSelect}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Template'}
        </button>
      </div>
    </div>
  );

  return previewContent;
};

/**
 * Template Customization Panel
 */
const TemplateCustomizer: React.FC<{
  template: TemplateConfig;
  onCustomize: (updates: Partial<TemplateConfig>) => void;
}> = ({ template, onCustomize }) => {
  const [localTemplate, setLocalTemplate] = useState(template);

  const updateTemplate = (updates: Partial<TemplateConfig>) => {
    const updated = { ...localTemplate, ...updates };
    setLocalTemplate(updated);
    onCustomize(updates);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center gap-3">
        <Sliders className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Customize Template</h3>
      </div>

      {/* Color Customization */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Colors
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <input
              type="color"
              value={localTemplate.colors.primary}
              onChange={(e) => updateTemplate({
                colors: { ...localTemplate.colors, primary: e.target.value }
              })}
              className="w-full h-10 rounded border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <input
              type="color"
              value={localTemplate.colors.accent}
              onChange={(e) => updateTemplate({
                colors: { ...localTemplate.colors, accent: e.target.value }
              })}
              className="w-full h-10 rounded border"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Type className="w-4 h-4" />
          Typography
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Header Font</label>
            <select
              value={localTemplate.fonts.heading}
              onChange={(e) => updateTemplate({
                fonts: { ...localTemplate.fonts, heading: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Body Font</label>
            <select
              value={localTemplate.fonts.body}
              onChange={(e) => updateTemplate({
                fonts: { ...localTemplate.fonts, body: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Layout & Spacing
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              Header Size: {localTemplate.spacing.headerSize}px
            </label>
            <input
              type="range"
              min="20"
              max="40"
              value={localTemplate.spacing.headerSize}
              onChange={(e) => updateTemplate({
                spacing: { ...localTemplate.spacing, headerSize: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Section Spacing: {localTemplate.spacing.sectionGap}px
            </label>
            <input
              type="range"
              min="16"
              max="32"
              value={localTemplate.spacing.sectionGap}
              onChange={(e) => updateTemplate({
                spacing: { ...localTemplate.spacing, sectionGap: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setLocalTemplate(template);
          onCustomize(template);
        }}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Reset to Default
      </button>
    </div>
  );
};

/**
 * Main Template Picker Component
 */
export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  onTemplateSelect,
  selectedTemplate = 'modern-ats',
  resume,
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizedTemplates, setCustomizedTemplates] = useState<Record<string, TemplateConfig>>({});
  
  const themeManager = new ThemeManager();
  const templates = Object.values(TEMPLATES);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
    themeManager.applyTemplate(templateId);
  };

  const handleCustomize = (templateId: string, updates: Partial<TemplateConfig>) => {
    const baseTemplate = TEMPLATES[templateId];
    const customized = { ...baseTemplate, ...updates };
    
    setCustomizedTemplates(prev => ({
      ...prev,
      [templateId]: customized
    }));
    
    themeManager.applyCustomTemplate(customized);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Choose Your Template</h2>
            <p className="text-gray-600">Select and customize a professional resume template</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showCustomizer 
              ? 'bg-blue-600 text-white' 
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Customize
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplatePreviewCard
            key={template.id}
            template={customizedTemplates[template.id] || template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => handleTemplateSelect(template.id)}
            resume={resume}
          />
        ))}
      </div>

      {/* Customization Panel */}
      {showCustomizer && selectedTemplate && (
        <TemplateCustomizer
          template={customizedTemplates[selectedTemplate] || TEMPLATES[selectedTemplate]}
          onCustomize={(updates) => handleCustomize(selectedTemplate, updates)}
        />
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Eye className="w-4 h-4" />
          Live Preview
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export Current
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Compare Templates
        </button>
      </div>
    </div>
  );
};

/**
 * Template Comparison View
 */
export const TemplateComparison: React.FC<{
  templates: string[];
  resume: Resume;
  onSelect: (templateId: string) => void;
}> = ({ templates, resume, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Layout className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Compare Templates</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((templateId) => {
          const template = TEMPLATES[templateId];
          return (
            <div key={templateId} className="space-y-3">
              <TemplatePreviewCard
                template={template}
                isSelected={false}
                onSelect={() => onSelect(templateId)}
                resume={resume}
              />
              
              {/* Feature comparison */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Template Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
