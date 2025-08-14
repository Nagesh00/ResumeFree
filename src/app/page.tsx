/**
 * Simple Resume Builder - Main Entry Point
 * Clean, simple resume builder like OpenResume
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create a <span className="text-blue-600">professional resume</span> easily
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            With this free, open-source, and powerful resume builder
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <Link 
              href="/simple-builder"
              className="block w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Resume
            </Link>
            <p className="text-sm text-gray-500">No sign up required</p>
            
            <p className="text-gray-600 mt-6">
              Already have a resume? Test its ATS readability with the{' '}
              <Link href="/resume-parser" className="text-blue-600 hover:underline">
                resume parser
              </Link>
            </p>
          </div>
        </div>

        {/* Simple Steps */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fill in your information</h3>
              <p className="text-gray-600">Enter your personal details, work experience, and education</p>
            </div>
            
            <div className="text-center">
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
