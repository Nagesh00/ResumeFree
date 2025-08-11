'use client';

import { useState } from 'react';

export default function TestAIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProvider = async (provider: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          prompt: 'Hello! Please respond with "Connection successful" to confirm you are working.'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Provider Test</h1>
            <p className="text-xl text-muted-foreground">
              Test your configured AI providers to ensure they are working correctly
            </p>
          </div>

          <div className="grid gap-6">
            {/* Test Buttons */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Available Providers</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => testProvider('perplexity')}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Test Perplexity
                </button>
                <button
                  onClick={() => testProvider('google')}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Test Gemini
                </button>
                <button
                  onClick={() => testProvider('openai')}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Test OpenAI
                </button>
                <button
                  onClick={() => testProvider('anthropic')}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  Test Anthropic
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Testing AI provider...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Test Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Success State */}
            {result && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Test Successful! ✅</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Provider:</span> {result.provider}
                  </div>
                  <div>
                    <span className="font-medium">Response:</span>
                    <div className="mt-2 p-3 bg-white rounded border">
                      {result.response}
                    </div>
                  </div>
                  {result.usage && (
                    <div>
                      <span className="font-medium">Token Usage:</span>
                      <div className="mt-2 text-sm text-gray-600">
                        Prompt: {result.usage.promptTokens} | 
                        Completion: {result.usage.completionTokens} | 
                        Total: {result.usage.totalTokens}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Perplexity:</strong> Your API key is already configured and should work.
                </p>
                <p>
                  <strong>Google Gemini:</strong> Your API key is already configured and should work.
                </p>
                <p>
                  <strong>OpenAI:</strong> You need to add your OpenAI API key to the .env.local file as OPENAI_API_KEY.
                </p>
                <p>
                  <strong>Anthropic:</strong> You need to add your Anthropic API key to the .env.local file as ANTHROPIC_API_KEY.
                </p>
                <div className="mt-4 p-4 bg-muted rounded">
                  <p className="font-medium mb-2">Environment Variables:</p>
                  <pre className="text-xs">
{`PERPLEXITY_API_KEY=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 ✅
GEMINI_API_KEY=AIzaSyDG35yE_iXkIMwbAI4e_lTLVfPnoKfDepk ✅
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
