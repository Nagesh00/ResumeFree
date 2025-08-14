/**
 * Advanced AI Resume Builder - Main Entry Point
 * Like OpenResume.com with AI enhancements
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Create a <span className="text-blue-600">professional resume</span> easily
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            With this free, open-source, and powerful AI-enhanced resume builder. 
            Advanced features like AI content generation, ATS optimization, and job tailoring.
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <Link 
              href="/simple-builder"
              className="block w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              🚀 Create AI Resume
            </Link>
            <p className="text-sm text-gray-500">No sign up required • AI-powered • ATS optimized</p>
            
            <p className="text-gray-600 mt-6">
              Already have a resume? Test its ATS readability with the{' '}
              <Link href="/resume-parser" className="text-blue-600 hover:underline font-semibold">
                🔍 AI Resume Parser
              </Link>
            </p>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4">🤖 AI-Powered Features</h2>
          <p className="text-center text-gray-600 mb-12">Advanced capabilities beyond traditional resume builders</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Content Generation</h3>
              <p className="text-gray-600">Let AI write compelling resume content based on your experience</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS Optimization</h3>
              <p className="text-gray-600">Ensure your resume passes Applicant Tracking Systems</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Tailoring</h3>
              <p className="text-gray-600">Customize your resume for specific job descriptions</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className="text-gray-600">Export to PDF, DOCX, JSON, and more formats</p>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">🆚 OpenResume + AI = Better Results</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">📝 Traditional Resume Builders</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Manual content writing</li>
                <li>• Basic templates</li>
                <li>• Limited customization</li>
                <li>• No ATS insights</li>
                <li>• Generic formatting</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600">🚀 Our AI Resume Builder</h3>
              <ul className="space-y-2 text-blue-600">
                <li>• ✨ AI-generated content suggestions</li>
                <li>• 🎨 Professional templates + AI optimization</li>
                <li>• 🔧 Smart customization based on job roles</li>
                <li>• 📊 Real-time ATS scoring and feedback</li>
                <li>• 🎯 Job-specific tailoring and keywords</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">🛠️ Advanced Tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/job-tailoring" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              🎯 Job Tailoring
            </Link>
            <Link href="/resume-builder" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              🏗️ Advanced Builder
            </Link>
            <Link href="/settings" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              ⚙️ AI Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Preview in real-time</h3>
              <p className="text-gray-600">See your resume formatted professionally as you type</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download PDF</h3>
              <p className="text-gray-600">Get your professional resume ready for job applications</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Resume Builder?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">ATS-Optimized</h3>
              <p className="text-gray-600">Designed to pass Applicant Tracking Systems used by employers</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Privacy-Focused</h3>
              <p className="text-gray-600">Your data stays in your browser. No sign-up or data collection</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Professional Design</h3>
              <p className="text-gray-600">Clean, modern templates that hiring managers love</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Real-time Preview</h3>
              <p className="text-gray-600">See changes instantly as you edit your information</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Export Ready</h3>
              <p className="text-gray-600">Download as PDF for immediate use in job applications</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Mobile Friendly</h3>
              <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
