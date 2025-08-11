/**
 * AI-Powered Resume Builder - Main Entry Point
 * Complete integration of all implemented features
 */

import AIResumeBuilder, { ErrorBoundary } from '../components/AIResumeBuilder';

export default function HomePage() {
  return (
    <ErrorBoundary>
      <AIResumeBuilder />
    </ErrorBoundary>
  );
}
