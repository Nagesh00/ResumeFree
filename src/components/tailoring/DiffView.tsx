/**
 * Diff View Component
 * Shows side-by-side comparison of original vs suggested text
 */

'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface DiffViewProps {
  oldText: string;
  newText: string;
  showInline?: boolean;
}

export function DiffView({ oldText, newText, showInline = false }: DiffViewProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'inline'>('side-by-side');

  // Simple diff algorithm - highlights word changes
  const generateDiff = () => {
    const oldWords = oldText.split(/\s+/);
    const newWords = newText.split(/\s+/);
    
    const maxLength = Math.max(oldWords.length, newWords.length);
    const diff = [];
    
    for (let i = 0; i < maxLength; i++) {
      const oldWord = oldWords[i] || '';
      const newWord = newWords[i] || '';
      
      if (oldWord !== newWord) {
        diff.push({
          type: 'changed',
          oldWord,
          newWord,
          index: i,
        });
      } else {
        diff.push({
          type: 'unchanged',
          word: oldWord,
          index: i,
        });
      }
    }
    
    return diff;
  };

  const diff = generateDiff();

  if (viewMode === 'inline') {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Inline Diff</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('side-by-side')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Side by Side
          </Button>
        </div>
        
        <div className="p-3 bg-muted rounded border text-sm leading-relaxed">
          {diff.map((item, index) => {
            if (item.type === 'unchanged') {
              return <span key={index}>{item.word} </span>;
            } else {
              return (
                <span key={index}>
                  {item.oldWord && (
                    <span className="bg-red-100 text-red-800 line-through px-1 rounded">
                      {item.oldWord}
                    </span>
                  )}
                  {item.oldWord && item.newWord && ' '}
                  {item.newWord && (
                    <span className="bg-green-100 text-green-800 px-1 rounded">
                      {item.newWord}
                    </span>
                  )}
                  {' '}
                </span>
              );
            }
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Side-by-Side Diff</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('inline')}
        >
          <EyeOff className="h-4 w-4 mr-1" />
          Inline
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* Original */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
            Original
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm leading-relaxed">
            {oldText}
          </div>
        </div>
        
        {/* Suggested */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
            Suggested
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm leading-relaxed">
            {newText}
          </div>
        </div>
      </div>
    </div>
  );
}
