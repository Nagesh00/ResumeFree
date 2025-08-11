import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - ResumeAI',
  description: 'Configure your AI providers and application preferences',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <p className="text-xl text-muted-foreground">
              Configure your AI providers and application preferences
            </p>
          </div>

          <div className="grid gap-8">
            {/* AI Providers Section */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-6">AI Providers</h2>
              
              <div className="space-y-6">
                {/* Perplexity */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-medium">Perplexity</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Connected</span>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-800">Disconnect</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <input 
                        type="password" 
                        value="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"
                        className="w-full p-2 border rounded-md text-sm font-mono"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Model</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small (128K)</option>
                        <option value="llama-3.1-sonar-large-128k-online">Llama 3.1 Sonar Large (128K)</option>
                        <option value="llama-3.1-sonar-huge-128k-online">Llama 3.1 Sonar Huge (128K)</option>
                        <option value="llama-3.1-8b-instruct">Llama 3.1 8B Instruct</option>
                        <option value="llama-3.1-70b-instruct">Llama 3.1 70B Instruct</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Google Gemini */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-medium">Google Gemini</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Connected</span>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-800">Disconnect</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <input 
                        type="password" 
                        value="AIzaSyDG35yE_iXkIMwbAI4e_lTLVfPnoKfDepk"
                        className="w-full p-2 border rounded-md text-sm font-mono"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Model</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* OpenAI */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-medium text-gray-600">OpenAI</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Not Connected</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <input 
                        type="password" 
                        placeholder="sk-..."
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                      Connect OpenAI
                    </button>
                  </div>
                </div>

                {/* Anthropic */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-medium text-gray-600">Anthropic Claude</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Not Connected</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <input 
                        type="password" 
                        placeholder="sk-ant-..."
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                      Connect Anthropic
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Preferences */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-6">Application Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Default AI Provider</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="perplexity">Perplexity (Connected)</option>
                    <option value="google">Google Gemini (Connected)</option>
                    <option value="openai" disabled>OpenAI (Not Connected)</option>
                    <option value="anthropic" disabled>Anthropic (Not Connected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Enable local data storage</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Automatically redact PII in AI requests</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Save resume versions locally</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">AI Processing</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Enable AI-powered suggestions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Auto-improve resume content</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enable real-time ATS scoring</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-6">Export Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Export Format</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="json">JSON Resume</option>
                    <option value="markdown">Markdown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">PDF Template</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="modern">Modern Professional</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
