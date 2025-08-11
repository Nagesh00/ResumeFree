import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Tailoring - ResumeAI',
  description: 'Tailor your resume to specific job descriptions with AI',
};

export default function JobTailoringPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Job Tailoring Workspace</h1>
          <p className="text-xl text-muted-foreground">
            Optimize your resume for specific job opportunities with AI assistance
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Description Input */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <textarea 
                className="w-full p-3 border rounded-md h-64 text-sm"
                placeholder="Paste the job description here..."
              />
              <button className="w-full mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Analyze Job Requirements
              </button>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Key Requirements</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-sm mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">React</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">TypeScript</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Node.js</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-2">Nice to Have</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">AWS</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Docker</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">agile</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">team player</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resume Analysis */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Current Resume Analysis</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">ATS Match Score</span>
                    <span className="text-2xl font-bold text-orange-600">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Skills Coverage</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Technical Skills</span>
                      <span className="text-green-600">85% ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry Keywords</span>
                      <span className="text-yellow-600">60% ⚠</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience Level</span>
                      <span className="text-green-600">90% ✓</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">microservices</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">CI/CD</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">scalable</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="font-medium">Add Missing Keywords</p>
                  <p className="text-muted-foreground">Include "microservices" and "CI/CD" in your experience descriptions.</p>
                </div>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <p className="font-medium">Quantify Achievements</p>
                  <p className="text-muted-foreground">Add specific metrics to your accomplishments.</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="font-medium">Reorder Sections</p>
                  <p className="text-muted-foreground">Move technical skills section higher up.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tailored Resume Preview */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tailored Resume</h2>
                <div className="text-sm text-green-600 font-medium">+23% ATS Score</div>
              </div>
              
              <div className="bg-white p-4 rounded border min-h-[400px] text-xs">
                <div className="text-center mb-4">
                  <h1 className="text-lg font-bold text-gray-800">John Doe</h1>
                  <p className="text-gray-600">Full Stack Developer | React & Node.js Expert</p>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-gray-800 border-b pb-1 mb-2">
                    Technical Skills
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Frontend:</strong> React, TypeScript, Next.js, Tailwind CSS<br/>
                    <strong>Backend:</strong> Node.js, Express, Microservices, REST APIs<br/>
                    <strong>DevOps:</strong> AWS, Docker, CI/CD, Jenkins<br/>
                    <strong>Database:</strong> PostgreSQL, MongoDB, Redis
                  </p>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-gray-800 border-b pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Experienced Full Stack Developer with 5+ years building <em>scalable</em> web applications 
                    using React and Node.js. Proven expertise in <em>microservices architecture</em> and 
                    <em>CI/CD pipelines</em>. Strong <em>team player</em> with <em>agile</em> development experience.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-gray-800 border-b pb-1 mb-2">
                    Experience
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Senior Developer | Tech Corp | 2021-Present</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Built <em>scalable microservices</em> serving 100k+ users using React and Node.js</li>
                        <li>Implemented <em>CI/CD pipelines</em> reducing deployment time by 75%</li>
                        <li>Led <em>agile</em> development team of 5 developers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90">
                  Apply Changes
                </button>
                <button className="flex-1 px-3 py-2 border border-input rounded text-sm hover:bg-accent">
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Version History</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span>Marketing Manager - TechCorp</span>
                  <span className="text-green-600">95% ATS</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span>Product Manager - StartupXYZ</span>
                  <span className="text-blue-600">87% ATS</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Original Resume</span>
                  <span className="text-gray-600">72% ATS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
