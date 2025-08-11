/**
 * Advanced Theme System for Resume Templates
 * Token-based theming with live preview as specified
 */

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textLight: string;
    background: string;
    surface: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'traditional' | 'minimal';
  preview: string;
  tokens: DesignTokens;
  layout: {
    columns: 1 | 2;
    sidebar: 'left' | 'right' | 'none';
    headerStyle: 'minimal' | 'accent' | 'full';
    sectionSpacing: 'compact' | 'normal' | 'spacious';
  };
  customization: {
    allowColorChange: boolean;
    allowFontChange: boolean;
    allowLayoutChange: boolean;
    presetVariations: string[];
  };
}

// Default design tokens
const defaultTokens: DesignTokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0f172a',
    text: '#0f172a',
    textLight: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0'
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
};

// Pre-defined templates
export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, traditional layout perfect for corporate environments',
    category: 'professional',
    preview: '/templates/professional-preview.png',
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#1e40af',
        secondary: '#475569',
        accent: '#0f172a'
      }
    },
    layout: {
      columns: 1,
      sidebar: 'none',
      headerStyle: 'minimal',
      sectionSpacing: 'normal'
    },
    customization: {
      allowColorChange: true,
      allowFontChange: false,
      allowLayoutChange: false,
      presetVariations: ['blue', 'gray', 'green']
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with accent colors and clean typography',
    category: 'modern',
    preview: '/templates/modern-preview.png',
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#7c3aed',
        secondary: '#6b7280',
        accent: '#f59e0b'
      },
      borderRadius: {
        ...defaultTokens.borderRadius,
        md: '0.5rem',
        lg: '0.75rem'
      }
    },
    layout: {
      columns: 2,
      sidebar: 'left',
      headerStyle: 'accent',
      sectionSpacing: 'normal'
    },
    customization: {
      allowColorChange: true,
      allowFontChange: true,
      allowLayoutChange: true,
      presetVariations: ['purple', 'blue', 'teal', 'rose']
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals and designers',
    category: 'creative',
    preview: '/templates/creative-preview.png',
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#fafafa'
      },
      typography: {
        ...defaultTokens.typography,
        headingFont: 'Playfair Display, serif'
      }
    },
    layout: {
      columns: 2,
      sidebar: 'right',
      headerStyle: 'full',
      sectionSpacing: 'spacious'
    },
    customization: {
      allowColorChange: true,
      allowFontChange: true,
      allowLayoutChange: true,
      presetVariations: ['gradient', 'colorful', 'artistic']
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, spacious design focusing on content',
    category: 'minimal',
    preview: '/templates/minimal-preview.png',
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#374151',
        secondary: '#9ca3af',
        accent: '#374151'
      },
      spacing: {
        ...defaultTokens.spacing,
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      }
    },
    layout: {
      columns: 1,
      sidebar: 'none',
      headerStyle: 'minimal',
      sectionSpacing: 'spacious'
    },
    customization: {
      allowColorChange: false,
      allowFontChange: true,
      allowLayoutChange: false,
      presetVariations: ['default']
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior-level positions',
    category: 'professional',
    preview: '/templates/executive-preview.png',
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#d97706'
      },
      typography: {
        ...defaultTokens.typography,
        headingFont: 'Georgia, serif'
      }
    },
    layout: {
      columns: 2,
      sidebar: 'left',
      headerStyle: 'full',
      sectionSpacing: 'normal'
    },
    customization: {
      allowColorChange: true,
      allowFontChange: false,
      allowLayoutChange: false,
      presetVariations: ['classic', 'navy', 'charcoal']
    }
  }
];

export class ThemeManager {
  private currentTemplate: TemplateConfig;
  private customizations: Partial<DesignTokens>;

  constructor(templateId: string = 'professional') {
    this.currentTemplate = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    this.customizations = {};
  }

  /**
   * Get current template configuration
   */
  getCurrentTemplate(): TemplateConfig {
    return this.currentTemplate;
  }

  /**
   * Switch to a different template
   */
  switchTemplate(templateId: string): TemplateConfig {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    this.currentTemplate = template;
    this.customizations = {}; // Reset customizations
    return template;
  }

  /**
   * Apply customizations to current template
   */
  customize(customizations: Partial<DesignTokens>): DesignTokens {
    this.customizations = { ...this.customizations, ...customizations };
    return this.getComputedTokens();
  }

  /**
   * Get final computed design tokens
   */
  getComputedTokens(): DesignTokens {
    return {
      colors: {
        ...this.currentTemplate.tokens.colors,
        ...this.customizations.colors
      },
      typography: {
        ...this.currentTemplate.tokens.typography,
        ...this.customizations.typography
      },
      spacing: {
        ...this.currentTemplate.tokens.spacing,
        ...this.customizations.spacing
      },
      borderRadius: {
        ...this.currentTemplate.tokens.borderRadius,
        ...this.customizations.borderRadius
      },
      shadows: {
        ...this.currentTemplate.tokens.shadows,
        ...this.customizations.shadows
      }
    };
  }

  /**
   * Generate CSS variables from design tokens
   */
  generateCSSVariables(): Record<string, string> {
    const tokens = this.getComputedTokens();
    const cssVars: Record<string, string> = {};

    // Colors
    Object.entries(tokens.colors).forEach(([key, value]) => {
      cssVars[`--color-${key}`] = value;
    });

    // Typography
    cssVars['--font-family'] = tokens.typography.fontFamily;
    cssVars['--font-heading'] = tokens.typography.headingFont;
    
    Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
      cssVars[`--font-size-${key}`] = value;
    });

    Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
      cssVars[`--font-weight-${key}`] = value.toString();
    });

    Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
      cssVars[`--line-height-${key}`] = value.toString();
    });

    // Spacing
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      cssVars[`--spacing-${key}`] = value;
    });

    // Border radius
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      cssVars[`--radius-${key}`] = value;
    });

    // Shadows
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      cssVars[`--shadow-${key}`] = value;
    });

    return cssVars;
  }

  /**
   * Export theme configuration
   */
  exportTheme(): { template: string; customizations: Partial<DesignTokens> } {
    return {
      template: this.currentTemplate.id,
      customizations: this.customizations
    };
  }

  /**
   * Import theme configuration
   */
  importTheme(config: { template: string; customizations: Partial<DesignTokens> }): void {
    this.switchTemplate(config.template);
    this.customizations = config.customizations;
  }

  /**
   * Reset to template defaults
   */
  resetToDefaults(): DesignTokens {
    this.customizations = {};
    return this.currentTemplate.tokens;
  }

  /**
   * Get available color presets for current template
   */
  getColorPresets(): Record<string, Partial<DesignTokens['colors']>> {
    const presets: Record<string, Partial<DesignTokens['colors']>> = {};
    
    this.currentTemplate.customization.presetVariations.forEach(variation => {
      switch (variation) {
        case 'blue':
          presets.blue = { primary: '#2563eb', accent: '#1d4ed8' };
          break;
        case 'green':
          presets.green = { primary: '#059669', accent: '#047857' };
          break;
        case 'purple':
          presets.purple = { primary: '#7c3aed', accent: '#6d28d9' };
          break;
        case 'rose':
          presets.rose = { primary: '#e11d48', accent: '#be123c' };
          break;
        case 'teal':
          presets.teal = { primary: '#0d9488', accent: '#0f766e' };
          break;
        default:
          presets[variation] = {};
      }
    });

    return presets;
  }
}
