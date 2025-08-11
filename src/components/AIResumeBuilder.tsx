/**
 * AI-Powered Resume Builder - Main Application Component
 * Integrates all the implemented features with proper error handling
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { store } from '../lib/store';
import ResumeBuilderClient from './resume-builder/ResumeBuilderClient';

// Import completed components (with proper error boundaries)
const JobTailoringWorkspace = React.lazy(() => 
  import('./tailoring/JobTailoringWorkspace').catch(() => 
    Promise.resolve({ default: () => <div>Job Tailoring feature temporarily unavailable</div> })
  )
);

const TemplatePicker = React.lazy(() => 
  import('./templates/TemplatePicker').catch(() => 
    Promise.resolve({ default: () => <div>Template picker temporarily unavailable</div> })
  )
);

const CollaborationManager = React.lazy(() => 
  import('./collaboration/CollaborationManager').catch(() => 
    Promise.resolve({ default: () => <div>Collaboration features temporarily unavailable</div> })
  )
);

const CommandPalette = React.lazy(() => 
  import('./accessibility/CommandPalette').catch(() => 
    Promise.resolve({ default: () => null })
  )
);

interface AppProps {
  children?: React.ReactNode;
}

export default function AIResumeBuilder({ children }: AppProps) {
  const [activeFeature, setActiveFeature] = useState<'builder' | 'tailoring' | 'templates' | 'collaboration'>('builder');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette toggle
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // Feature navigation shortcuts
      if (e.ctrlKey && e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveFeature('builder');
            break;
          case '2':
            e.preventDefault();
            setActiveFeature('tailoring');
            break;
          case '3':
            e.preventDefault();
            setActiveFeature('templates');
            break;
          case '4':
            e.preventDefault();
            setActiveFeature('collaboration');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigationItems = [
    { key: 'builder', label: 'Resume Builder', shortcut: 'Ctrl+Alt+1' },
    { key: 'tailoring', label: 'Job Tailoring', shortcut: 'Ctrl+Alt+2' },
    { key: 'templates', label: 'Templates', shortcut: 'Ctrl+Alt+3' },
    { key: 'collaboration', label: 'Collaboration', shortcut: 'Ctrl+Alt+4' },
  ] as const;

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-background">
          {/* Navigation Header */}
          <header className="border-b bg-white shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
                  </div>

                  {/* Feature Navigation */}
                  <nav className="hidden md:flex space-x-1">
                    {navigationItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveFeature(item.key as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeFeature === item.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title={item.shortcut}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg"
                    title="Command Palette (Ctrl+`)"
                  >
                    <span className="hidden sm:inline">Command Palette</span>
                    <span className="sm:hidden">⌘</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <React.Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              {activeFeature === 'builder' && <ResumeBuilderClient />}
              
              {activeFeature === 'tailoring' && (
                <div className="container mx-auto px-4 py-8">
                  <JobTailoringWorkspace />
                </div>
              )}
              
              {activeFeature === 'templates' && (
                <div className="container mx-auto px-4 py-8">
                  <TemplatePicker 
                    onTemplateSelect={(templateId) => console.log('Template selected:', templateId)}
                    resume={{} as any}
                  />
                </div>
              )}
              
              {activeFeature === 'collaboration' && (
                <div className="container mx-auto px-4 py-8">
                  <CollaborationManager 
                    resume={{} as any}
                    onSave={(description, tags) => console.log('Save:', description, tags)}
                    onRestore={(snapshot) => console.log('Restore:', snapshot)}
                  />
                </div>
              )}
            </React.Suspense>
          </main>

          {/* Global Components */}
          <React.Suspense fallback={null}>
            <CommandPalette 
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
            />
          </React.Suspense>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-white border shadow-lg',
              duration: 4000,
            }}
          />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

// Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Resume Builder Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but there was an error loading the application.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Application
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>

            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Feature availability checker
export function useFeatureAvailability() {
  const [features, setFeatures] = useState({
    aiAssistant: true,
    jobTailoring: true,
    multiTemplates: true,
    collaboration: true,
    exportFormats: true,
    commandPalette: true,
    accessibility: true,
  });

  useEffect(() => {
    // Check feature availability based on environment/configuration
    const checkFeatures = async () => {
      try {
        // Test AI availability
        const aiAvailable = typeof window !== 'undefined' && 
          (localStorage.getItem('openai-api-key') || 
           localStorage.getItem('anthropic-api-key') ||
           localStorage.getItem('google-api-key'));

        setFeatures(prev => ({
          ...prev,
          aiAssistant: !!aiAvailable,
        }));
      } catch (error) {
        console.warn('Feature availability check failed:', error);
      }
    };

    checkFeatures();
  }, []);

  return features;
}
