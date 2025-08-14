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
import { ThemeManager, TemplateConfig, TEMPLATES } from '../../lib/theme/theme-system';
import { Resume } from '../../lib/schema/resume';
import { RootState } from '../../lib/store';

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
        backgroundColor: template.tokens.colors.background,
        borderColor: isSelected ? template.tokens.colors.primary : '#e5e7eb',
        borderWidth: isSelected ? '2px' : '1px',
      }}
    >
      {/* Preview Header */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: template.tokens.colors.border }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: template.tokens.colors.accent + '20' }}
            >
              {getTemplateIcon(template.id)}
            </div>
            <div>
              <h3 
                className="font-semibold text-sm"
                style={{ color: template.tokens.colors.primary }}
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
              color: template.tokens.colors.primary,
              fontSize: template.tokens.typography.fontSize.lg
            }}
          >
            {resume.name || 'Your Name'}
          </div>
          <div 
            className="text-center opacity-75"
            style={{ color: template.tokens.colors.text }}
          >
            {resume.contact.email || 'email@example.com'}
          </div>
          
          {/* Section preview */}
          <div className="space-y-1 mt-3">
            <div 
              className="font-medium pb-1 border-b"
              style={{ 
                color: template.tokens.colors.accent,
                borderColor: template.tokens.colors.border
              }}
            >
              EXPERIENCE
            </div>
            <div className="space-y-1">
              <div 
                className="font-medium"
                style={{ color: template.tokens.colors.primary }}
              >
                {resume.experiences[0]?.title || 'Job Title'}
              </div>
              <div style={{ color: template.tokens.colors.textLight }}>
                {resume.experiences[0]?.company || 'Company'} | 2021 - Present
              </div>
              <div style={{ color: template.tokens.colors.text }}>
                • Key achievement or responsibility
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Features */}
      <div className="p-3">
        <div className="flex flex-wrap gap-1">
          <span
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: template.tokens.colors.accent + '20',
              color: template.tokens.colors.accent,
            }}
          >
            {template.category}
          </span>
          {template.customization.allowColorChange && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: template.tokens.colors.accent + '20',
                color: template.tokens.colors.accent,
              }}
            >
              Custom Colors
            </span>
          )}
          {template.customization.allowFontChange && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: template.tokens.colors.accent + '20',
                color: template.tokens.colors.accent,
              }}
            >
              Custom Fonts
            </span>
          )}
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
              value={localTemplate.tokens.colors.primary}
              onChange={(e) => updateTemplate({
                tokens: { 
                  ...localTemplate.tokens,
                  colors: { ...localTemplate.tokens.colors, primary: e.target.value }
                }
              })}
              className="w-full h-10 rounded border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <input
              type="color"
              value={localTemplate.tokens.colors.accent}
              onChange={(e) => updateTemplate({
                tokens: { 
                  ...localTemplate.tokens,
                  colors: { ...localTemplate.tokens.colors, accent: e.target.value }
                }
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
              value={localTemplate.tokens.typography.headingFont}
              onChange={(e) => updateTemplate({
                tokens: { 
                  ...localTemplate.tokens,
                  typography: { ...localTemplate.tokens.typography, headingFont: e.target.value }
                }
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
              value={localTemplate.tokens.typography.fontFamily}
              onChange={(e) => updateTemplate({
                tokens: { 
                  ...localTemplate.tokens,
                  typography: { ...localTemplate.tokens.typography, fontFamily: e.target.value }
                }
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
            <label className="block text-sm font-medium mb-2">Section Spacing</label>
            <select
              value={template.layout.sectionSpacing}
              onChange={(e) => updateTemplate({
                layout: { ...localTemplate.layout, sectionSpacing: e.target.value as any }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Header Style</label>
            <select
              value={template.layout.headerStyle}
              onChange={(e) => updateTemplate({
                layout: { ...localTemplate.layout, headerStyle: e.target.value as any }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="minimal">Minimal</option>
              <option value="accent">Accent</option>
              <option value="full">Full</option>
            </select>
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
    themeManager.switchTemplate(templateId);
  };

  const handleCustomize = (templateId: string, updates: Partial<TemplateConfig>) => {
    const baseTemplate = TEMPLATES.find(t => t.id === templateId);
    if (!baseTemplate) return;
    
    const customized = { ...baseTemplate, ...updates };
    
    setCustomizedTemplates(prev => ({
      ...prev,
      [templateId]: customized
    }));

    // Note: ThemeManager doesn't have a method to apply custom templates
    // You might want to extend ThemeManager or handle this differently
  };  return (
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
          template={customizedTemplates[selectedTemplate] || TEMPLATES.find(t => t.id === selectedTemplate)!}
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
          const template = TEMPLATES.find(t => t.id === templateId);
          if (!template) return null;
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
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-600" />
                    {template.category} style
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-600" />
                    {template.layout.columns} column layout
                  </li>
                  {template.customization.allowColorChange && (
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-600" />
                      Customizable colors
                    </li>
                  )}
                  {template.customization.allowFontChange && (
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-600" />
                      Customizable fonts
                    </li>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;
