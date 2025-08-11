/**
 * Multi-Template Theme System
 * Theming engine with tokens and multiple resume templates
 */

export interface ThemeTokens {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontScale: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    background: {
      primary: string;
      secondary: string;
      accent: string;
    };
    border: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'traditional' | 'creative' | 'technical';
  preview: string;
  layout: {
    columns: 1 | 2 | 3;
    headerStyle: 'centered' | 'left' | 'split';
    sectionSpacing: 'compact' | 'normal' | 'spacious';
    bulletStyle: 'dot' | 'dash' | 'arrow' | 'none';
  };
  styling: {
    headerAccent: boolean;
    sectionDividers: boolean;
    skillBars: boolean;
    colorAccents: boolean;
  };
  tokens: Partial<ThemeTokens>;
  atsOptimized: boolean;
  printOptimized: boolean;
}

// Default theme tokens
const defaultTokens: ThemeTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  fontScale: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  colors: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#3b82f6',
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      accent: '#f3f4f6',
    },
    border: '#e5e7eb',
  },
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Georgia, serif',
    mono: 'JetBrains Mono, monospace',
  },
};

// Template definitions
export const RESUME_TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern-ats',
    name: 'Modern ATS',
    description: 'Clean, single-column layout optimized for ATS scanning',
    category: 'modern',
    preview: '/templates/modern-ats.png',
    layout: {
      columns: 1,
      headerStyle: 'centered',
      sectionSpacing: 'normal',
      bulletStyle: 'dot',
    },
    styling: {
      headerAccent: true,
      sectionDividers: true,
      skillBars: false,
      colorAccents: false,
    },
    tokens: {
      colors: {
        ...defaultTokens.colors,
        accent: '#2563eb',
      },
    },
    atsOptimized: true,
    printOptimized: true,
  },
  
  {
    id: 'compact-two-column',
    name: 'Compact Two-Column',
    description: 'Space-efficient two-column design for experienced professionals',
    category: 'modern',
    preview: '/templates/compact-two-column.png',
    layout: {
      columns: 2,
      headerStyle: 'split',
      sectionSpacing: 'compact',
      bulletStyle: 'dash',
    },
    styling: {
      headerAccent: false,
      sectionDividers: false,
      skillBars: true,
      colorAccents: true,
    },
    tokens: {
      spacing: {
        ...defaultTokens.spacing,
        md: '0.75rem',
        lg: '1rem',
      },
      fontScale: {
        ...defaultTokens.fontScale,
        base: '0.9rem',
        lg: '1rem',
      },
    },
    atsOptimized: false,
    printOptimized: true,
  },
  
  {
    id: 'engineering-lead',
    name: 'Engineering Lead',
    description: 'Technical-focused layout emphasizing leadership and architecture',
    category: 'technical',
    preview: '/templates/engineering-lead.png',
    layout: {
      columns: 1,
      headerStyle: 'left',
      sectionSpacing: 'normal',
      bulletStyle: 'arrow',
    },
    styling: {
      headerAccent: true,
      sectionDividers: true,
      skillBars: false,
      colorAccents: true,
    },
    tokens: {
      colors: {
        ...defaultTokens.colors,
        accent: '#059669',
        primary: '#064e3b',
      },
      fonts: {
        ...defaultTokens.fonts,
        sans: 'JetBrains Mono, monospace',
      },
    },
    atsOptimized: true,
    printOptimized: true,
  },
  
  {
    id: 'designer-portfolio',
    name: 'Designer Portfolio',
    description: 'Creative layout with project tiles and visual elements',
    category: 'creative',
    preview: '/templates/designer-portfolio.png',
    layout: {
      columns: 2,
      headerStyle: 'centered',
      sectionSpacing: 'spacious',
      bulletStyle: 'none',
    },
    styling: {
      headerAccent: true,
      sectionDividers: false,
      skillBars: true,
      colorAccents: true,
    },
    tokens: {
      colors: {
        ...defaultTokens.colors,
        accent: '#8b5cf6',
        primary: '#581c87',
      },
      spacing: {
        ...defaultTokens.spacing,
        lg: '2rem',
        xl: '3rem',
      },
    },
    atsOptimized: false,
    printOptimized: false,
  },
  
  {
    id: 'traditional-classic',
    name: 'Traditional Classic',
    description: 'Conservative design for traditional industries',
    category: 'traditional',
    preview: '/templates/traditional-classic.png',
    layout: {
      columns: 1,
      headerStyle: 'centered',
      sectionSpacing: 'normal',
      bulletStyle: 'dot',
    },
    styling: {
      headerAccent: false,
      sectionDividers: true,
      skillBars: false,
      colorAccents: false,
    },
    tokens: {
      colors: {
        ...defaultTokens.colors,
        accent: '#374151',
        primary: '#111827',
      },
      fonts: {
        ...defaultTokens.fonts,
        sans: 'Times New Roman, serif',
      },
    },
    atsOptimized: true,
    printOptimized: true,
  },
];

/**
 * Theme manager for dynamic styling
 */
export class ThemeManager {
  private currentTemplate: TemplateConfig;
  private customTokens: Partial<ThemeTokens> = {};
  
  constructor(templateId: string = 'modern-ats') {
    this.currentTemplate = this.getTemplate(templateId);
  }
  
  getTemplate(id: string): TemplateConfig {
    const template = RESUME_TEMPLATES.find(t => t.id === id);
    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }
    return template;
  }
  
  setTemplate(templateId: string): void {
    this.currentTemplate = this.getTemplate(templateId);
    this.applyTheme();
  }
  
  updateTokens(tokens: Partial<ThemeTokens>): void {
    this.customTokens = { ...this.customTokens, ...tokens };
    this.applyTheme();
  }
  
  getComputedTokens(): ThemeTokens {
    return {
      ...defaultTokens,
      ...this.currentTemplate.tokens,
      ...this.customTokens,
    };
  }
  
  generateCSS(): string {
    const tokens = this.getComputedTokens();
    
    return `
      :root {
        /* Spacing */
        --spacing-xs: ${tokens.spacing.xs};
        --spacing-sm: ${tokens.spacing.sm};
        --spacing-md: ${tokens.spacing.md};
        --spacing-lg: ${tokens.spacing.lg};
        --spacing-xl: ${tokens.spacing.xl};
        
        /* Font Scale */
        --font-xs: ${tokens.fontScale.xs};
        --font-sm: ${tokens.fontScale.sm};
        --font-base: ${tokens.fontScale.base};
        --font-lg: ${tokens.fontScale.lg};
        --font-xl: ${tokens.fontScale.xl};
        --font-2xl: ${tokens.fontScale['2xl']};
        --font-3xl: ${tokens.fontScale['3xl']};
        
        /* Colors */
        --color-primary: ${tokens.colors.primary};
        --color-secondary: ${tokens.colors.secondary};
        --color-accent: ${tokens.colors.accent};
        --color-text-primary: ${tokens.colors.text.primary};
        --color-text-secondary: ${tokens.colors.text.secondary};
        --color-text-muted: ${tokens.colors.text.muted};
        --color-bg-primary: ${tokens.colors.background.primary};
        --color-bg-secondary: ${tokens.colors.background.secondary};
        --color-bg-accent: ${tokens.colors.background.accent};
        --color-border: ${tokens.colors.border};
        
        /* Fonts */
        --font-sans: ${tokens.fonts.sans};
        --font-serif: ${tokens.fonts.serif};
        --font-mono: ${tokens.fonts.mono};
      }
    `;
  }
  
  private applyTheme(): void {
    // Apply theme to document
    const styleElement = document.getElementById('resume-theme') || document.createElement('style');
    styleElement.id = 'resume-theme';
    styleElement.textContent = this.generateCSS();
    
    if (!document.getElementById('resume-theme')) {
      document.head.appendChild(styleElement);
    }
  }
  
  exportTheme(): string {
    return JSON.stringify({
      template: this.currentTemplate.id,
      customTokens: this.customTokens,
    }, null, 2);
  }
  
  importTheme(themeData: string): void {
    try {
      const parsed = JSON.parse(themeData);
      this.setTemplate(parsed.template);
      this.updateTokens(parsed.customTokens || {});
    } catch (error) {
      throw new Error('Invalid theme data');
    }
  }
}

/**
 * Template-specific styling utilities
 */
export function getTemplateStyles(template: TemplateConfig) {
  const baseClasses = 'resume-template font-sans bg-white text-gray-900 print:shadow-none';
  const layoutClasses = {
    1: 'max-w-2xl mx-auto',
    2: 'max-w-4xl mx-auto grid grid-cols-3 gap-6',
    3: 'max-w-6xl mx-auto grid grid-cols-4 gap-4',
  };
  
  const spacingClasses = {
    compact: 'space-y-3',
    normal: 'space-y-6',
    spacious: 'space-y-8',
  };
  
  return `${baseClasses} ${layoutClasses[template.layout.columns]} ${spacingClasses[template.layout.sectionSpacing]}`;
}

/**
 * Get bullet style for template
 */
export function getBulletStyle(template: TemplateConfig): string {
  const styles = {
    dot: '• ',
    dash: '- ',
    arrow: '→ ',
    none: '',
  };
  
  return styles[template.layout.bulletStyle];
}

/**
 * Template validation
 */
export function validateTemplate(template: TemplateConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!template.id) errors.push('Template ID is required');
  if (!template.name) errors.push('Template name is required');
  if (!['modern', 'traditional', 'creative', 'technical'].includes(template.category)) {
    errors.push('Invalid template category');
  }
  if (![1, 2, 3].includes(template.layout.columns)) {
    errors.push('Invalid column count');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
