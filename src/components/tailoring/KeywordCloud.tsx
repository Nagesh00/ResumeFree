/**
 * Keyword Cloud Component
 * Visual representation of keywords with relevance weighting
 */

'use client';

import { Badge } from '../ui/badge';

interface KeywordCloudProps {
  keywords: string[];
  weights?: number[];
  className?: string;
}

export function KeywordCloud({ keywords, weights, className = '' }: KeywordCloudProps) {
  // Calculate keyword frequency/importance
  const getKeywordSize = (index: number) => {
    if (!weights) return 'text-sm';
    
    const weight = weights[index] || 0;
    if (weight > 0.8) return 'text-lg';
    if (weight > 0.6) return 'text-base';
    if (weight > 0.4) return 'text-sm';
    return 'text-xs';
  };

  const getKeywordVariant = (index: number) => {
    if (!weights) return 'secondary';
    
    const weight = weights[index] || 0;
    if (weight > 0.8) return 'default';
    if (weight > 0.6) return 'secondary';
    return 'outline';
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {keywords.map((keyword, index) => (
        <Badge
          key={`${keyword}-${index}`}
          variant={getKeywordVariant(index)}
          className={`${getKeywordSize(index)} transition-all hover:scale-105`}
        >
          {keyword}
        </Badge>
      ))}
    </div>
  );
}
