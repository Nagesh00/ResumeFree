/**
 * Command Palette and Accessibility System
 * Keyboard-first navigation and accessibility features as specified
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Command,
  Search,
  Keyboard,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Type,
  Save,
  Download,
  Upload,
  Eye,
  Plus,
  Trash2,
  Copy,
  Edit,
  Settings,
  HelpCircle,
  Zap,
  FileText,
  Palette,
  Users,
  GitBranch,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RefreshCw,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { RootState } from '../../lib/store';

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<any>;
  shortcut?: string[];
  category: 'navigation' | 'editing' | 'export' | 'ai' | 'settings' | 'accessibility';
  action: () => void;
  disabled?: boolean;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  announcements: boolean;
}

/**
 * Command Palette Component
 */
export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<CommandAction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);

  // Define all available commands
  const commands: CommandAction[] = [
    // Navigation Commands
    {
      id: 'nav-home',
      label: 'Go to Home',
      icon: FileText,
      shortcut: ['Ctrl', 'H'],
      category: 'navigation',
      action: () => console.log('Navigate to home'),
    },
    {
      id: 'nav-templates',
      label: 'Browse Templates',
      icon: Palette,
      shortcut: ['Ctrl', 'T'],
      category: 'navigation',
      action: () => console.log('Navigate to templates'),
    },
    {
      id: 'nav-collaboration',
      label: 'Open Collaboration',
      icon: Users,
      shortcut: ['Ctrl', 'Shift', 'C'],
      category: 'navigation',
      action: () => console.log('Open collaboration'),
    },
    {
      id: 'nav-versions',
      label: 'Version History',
      icon: GitBranch,
      shortcut: ['Ctrl', 'Shift', 'V'],
      category: 'navigation',
      action: () => console.log('Open version history'),
    },

    // Editing Commands
    {
      id: 'edit-save',
      label: 'Save Resume',
      description: 'Save current changes',
      icon: Save,
      shortcut: ['Ctrl', 'S'],
      category: 'editing',
      action: () => console.log('Save resume'),
    },
    {
      id: 'edit-undo',
      label: 'Undo',
      icon: SkipBack,
      shortcut: ['Ctrl', 'Z'],
      category: 'editing',
      action: () => console.log('Undo action'),
    },
    {
      id: 'edit-redo',
      label: 'Redo',
      icon: SkipForward,
      shortcut: ['Ctrl', 'Y'],
      category: 'editing',
      action: () => console.log('Redo action'),
    },
    {
      id: 'edit-add-experience',
      label: 'Add Experience',
      icon: Plus,
      shortcut: ['Ctrl', 'Shift', 'E'],
      category: 'editing',
      action: () => console.log('Add experience'),
    },
    {
      id: 'edit-add-education',
      label: 'Add Education',
      icon: Plus,
      shortcut: ['Ctrl', 'Shift', 'D'],
      category: 'editing',
      action: () => console.log('Add education'),
    },

    // Export Commands
    {
      id: 'export-pdf',
      label: 'Export as PDF',
      description: 'Download resume as PDF',
      icon: Download,
      shortcut: ['Ctrl', 'Shift', 'P'],
      category: 'export',
      action: () => console.log('Export PDF'),
    },
    {
      id: 'export-docx',
      label: 'Export as DOCX',
      icon: Download,
      shortcut: ['Ctrl', 'Shift', 'W'],
      category: 'export',
      action: () => console.log('Export DOCX'),
    },
    {
      id: 'export-json',
      label: 'Export as JSON',
      icon: Download,
      category: 'export',
      action: () => console.log('Export JSON'),
    },

    // AI Commands
    {
      id: 'ai-assistant',
      label: 'Open AI Assistant',
      description: 'Get AI help with your resume',
      icon: Zap,
      shortcut: ['Ctrl', 'Shift', 'A'],
      category: 'ai',
      action: () => console.log('Open AI assistant'),
    },
    {
      id: 'ai-optimize',
      label: 'AI Optimize',
      description: 'Let AI improve your resume',
      icon: Zap,
      shortcut: ['Ctrl', 'Alt', 'O'],
      category: 'ai',
      action: () => console.log('AI optimize'),
    },
    {
      id: 'ai-tailor',
      label: 'Tailor for Job',
      description: 'Customize resume for specific job',
      icon: Zap,
      shortcut: ['Ctrl', 'Alt', 'T'],
      category: 'ai',
      action: () => console.log('AI tailor'),
    },

    // Settings Commands
    {
      id: 'settings-preferences',
      label: 'Open Preferences',
      icon: Settings,
      shortcut: ['Ctrl', ','],
      category: 'settings',
      action: () => console.log('Open preferences'),
    },
    {
      id: 'settings-theme-toggle',
      label: 'Toggle Dark Mode',
      icon: Moon,
      shortcut: ['Ctrl', 'Shift', 'L'],
      category: 'settings',
      action: () => console.log('Toggle theme'),
    },
    {
      id: 'settings-accessibility',
      label: 'Accessibility Settings',
      icon: Eye,
      category: 'accessibility',
      action: () => console.log('Open accessibility'),
    },

    // Help Commands
    {
      id: 'help-shortcuts',
      label: 'Keyboard Shortcuts',
      icon: Keyboard,
      shortcut: ['Ctrl', '?'],
      category: 'accessibility',
      action: () => console.log('Show shortcuts'),
    },
    {
      id: 'help-docs',
      label: 'Documentation',
      icon: HelpCircle,
      category: 'accessibility',
      action: () => console.log('Open docs'),
    },
  ];

  // Filter commands based on search query
  useEffect(() => {
    const filtered = commands.filter(cmd =>
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (commandsRef.current) {
      const selectedElement = commandsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const groupedCommands = filteredCommands.reduce((groups, cmd) => {
    if (!groups[cmd.category]) {
      groups[cmd.category] = [];
    }
    groups[cmd.category].push(cmd);
    return groups;
  }, {} as Record<string, CommandAction[]>);

  const categoryLabels = {
    navigation: 'Navigation',
    editing: 'Editing',
    export: 'Export',
    ai: 'AI Assistant',
    settings: 'Settings',
    accessibility: 'Accessibility',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-24 z-50">
      <div className="bg-white rounded-xl shadow-2xl border w-full max-w-2xl mx-4 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-lg"
            aria-label="Command search"
          />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↵</kbd>
            <span>select</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">esc</kbd>
            <span>close</span>
          </div>
        </div>

        {/* Commands List */}
        <div 
          ref={commandsRef}
          className="max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Available commands"
        >
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category}>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              {commands.map((cmd, index) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                const isSelected = globalIndex === selectedIndex;
                const Icon = cmd.icon;
                
                return (
                  <div
                    key={cmd.id}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border-r-2 border-blue-500' 
                        : 'hover:bg-gray-50'
                    } ${cmd.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!cmd.disabled) {
                        cmd.action();
                        onClose();
                      }
                    }}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${
                      isSelected ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {cmd.label}
                      </div>
                      {cmd.description && (
                        <div className="text-sm text-gray-500">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    
                    {cmd.shortcut && (
                      <div className="flex items-center gap-1">
                        {cmd.shortcut.map((key, i) => (
                          <kbd 
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Keyboard Shortcuts Help Component
 */
export const KeyboardShortcutsHelp: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { category: 'General', items: [
      { keys: ['Ctrl', '`'], description: 'Open Command Palette' },
      { keys: ['Ctrl', 'S'], description: 'Save Resume' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Y'], description: 'Redo' },
      { keys: ['Ctrl', '?'], description: 'Show Keyboard Shortcuts' },
    ]},
    { category: 'Navigation', items: [
      { keys: ['Ctrl', 'H'], description: 'Go to Home' },
      { keys: ['Ctrl', 'T'], description: 'Browse Templates' },
      { keys: ['Tab'], description: 'Navigate between fields' },
      { keys: ['Shift', 'Tab'], description: 'Navigate backwards' },
      { keys: ['Enter'], description: 'Activate focused element' },
    ]},
    { category: 'Editing', items: [
      { keys: ['Ctrl', 'Shift', 'E'], description: 'Add Experience' },
      { keys: ['Ctrl', 'Shift', 'D'], description: 'Add Education' },
      { keys: ['Ctrl', 'Shift', 'K'], description: 'Add Skills' },
      { keys: ['Delete'], description: 'Delete selected item' },
      { keys: ['Escape'], description: 'Cancel editing' },
    ]},
    { category: 'Export', items: [
      { keys: ['Ctrl', 'Shift', 'P'], description: 'Export as PDF' },
      { keys: ['Ctrl', 'Shift', 'W'], description: 'Export as DOCX' },
      { keys: ['Ctrl', 'Shift', 'J'], description: 'Export as JSON' },
      { keys: ['Ctrl', 'Shift', 'M'], description: 'Export as Markdown' },
    ]},
    { category: 'AI Assistant', items: [
      { keys: ['Ctrl', 'Shift', 'A'], description: 'Open AI Assistant' },
      { keys: ['Ctrl', 'Alt', 'O'], description: 'AI Optimize' },
      { keys: ['Ctrl', 'Alt', 'T'], description: 'Tailor for Job' },
      { keys: ['Ctrl', 'Alt', 'R'], description: 'AI Rewrite Section' },
    ]},
    { category: 'Accessibility', items: [
      { keys: ['Ctrl', 'Shift', 'L'], description: 'Toggle Dark Mode' },
      { keys: ['Ctrl', '+'], description: 'Increase Text Size' },
      { keys: ['Ctrl', '-'], description: 'Decrease Text Size' },
      { keys: ['Alt', 'Shift', 'H'], description: 'Toggle High Contrast' },
    ]},
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl border w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close shortcuts help"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {shortcuts.map((section) => (
            <div key={section.category} className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd 
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Accessibility Settings Component
 */
export const AccessibilitySettings: React.FC<{
  settings: AccessibilitySettings;
  onUpdate: (settings: Partial<AccessibilitySettings>) => void;
}> = ({ settings, onUpdate }) => {
  const toggleSetting = (key: keyof AccessibilitySettings) => {
    onUpdate({ [key]: !settings[key] });
  };

  const accessibilityOptions = [
    {
      key: 'highContrast' as const,
      label: 'High Contrast Mode',
      description: 'Increase color contrast for better visibility',
      icon: Eye,
    },
    {
      key: 'largeText' as const,
      label: 'Large Text',
      description: 'Increase default text size throughout the app',
      icon: Type,
    },
    {
      key: 'reduceMotion' as const,
      label: 'Reduce Motion',
      description: 'Minimize animations and transitions',
      icon: Minimize,
    },
    {
      key: 'screenReader' as const,
      label: 'Screen Reader Support',
      description: 'Optimize for screen reader accessibility',
      icon: Volume2,
    },
    {
      key: 'keyboardNavigation' as const,
      label: 'Enhanced Keyboard Navigation',
      description: 'Improve keyboard-only navigation experience',
      icon: Keyboard,
    },
    {
      key: 'focusIndicators' as const,
      label: 'Enhanced Focus Indicators',
      description: 'More visible focus outlines for keyboard navigation',
      icon: ArrowRight,
    },
    {
      key: 'announcements' as const,
      label: 'Status Announcements',
      description: 'Announce important status changes for screen readers',
      icon: Volume2,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold">Accessibility Settings</h2>
          <p className="text-gray-600">Customize the app for your accessibility needs</p>
        </div>
      </div>

      <div className="space-y-4">
        {accessibilityOptions.map((option) => {
          const Icon = option.icon;
          const isEnabled = settings[option.key];
          
          return (
            <div
              key={option.key}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => toggleSetting(option.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={isEnabled}
                aria-labelledby={`${option.key}-label`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <button
          onClick={() => onUpdate({
            highContrast: true,
            largeText: true,
            keyboardNavigation: true,
            focusIndicators: true,
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enable Recommended Settings
        </button>
        
        <button
          onClick={() => onUpdate({
            highContrast: false,
            largeText: false,
            reduceMotion: false,
            screenReader: false,
            keyboardNavigation: false,
            focusIndicators: false,
            announcements: false,
          })}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

/**
 * Global Keyboard Handler Hook
 */
export const useGlobalKeyboardShortcuts = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // Keyboard Shortcuts Help
      if (e.ctrlKey && e.key === '?') {
        e.preventDefault();
        setIsShortcutsHelpOpen(true);
      }

      // Quick Actions
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        // Trigger save action
        console.log('Save triggered');
      }

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        // Trigger undo action
        console.log('Undo triggered');
      }

      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        // Trigger redo action
        console.log('Redo triggered');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isShortcutsHelpOpen,
    setIsShortcutsHelpOpen,
  };
};

export default CommandPalette;
