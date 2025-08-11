import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  FileText, 
  Zap, 
  Target, 
  BarChart3, 
  Download, 
  Brain,
  Sparkles,
  CheckCircle 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/resume-builder" className="text-sm hover:text-primary transition-colors">
              Builder
            </Link>
            <Link href="/resume-parser" className="text-sm hover:text-primary transition-colors">
              Parser
            </Link>
            <Link href="/job-tailoring" className="text-sm hover:text-primary transition-colors">
              Job Tailoring
            </Link>
            <Link href="/settings" className="text-sm hover:text-primary transition-colors">
              Settings
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/resume-parser">Get Started</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/resume-builder">Create Resume</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI-Powered Resume Builder
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Create, parse, and tailor your resume with advanced AI assistance. 
              Get ATS-optimized resumes that land interviews.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/resume-builder">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/resume-parser">
                <FileText className="mr-2 h-5 w-5" />
                Upload Existing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides all the tools you need to create, 
            optimize, and tailor your resume for maximum impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Resume Parser</CardTitle>
              <CardDescription>
                Upload your existing resume and let AI extract and structure 
                your information with high accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  PDF text extraction with layout analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Intelligent section detection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  JSON Resume format support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Job Tailoring</CardTitle>
              <CardDescription>
                Automatically tailor your resume to specific job descriptions 
                for better ATS matching and recruiter appeal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Keyword optimization
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ATS scoring and feedback
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Skills gap analysis
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Builder</CardTitle>
              <CardDescription>
                Create professional resumes with AI assistance, 
                real-time suggestions, and modern templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Multiple professional templates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time AI suggestions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Auto-save and versioning
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>ATS Optimization</CardTitle>
              <CardDescription>
                Get detailed ATS scores and recommendations to ensure 
                your resume passes automated screening systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Keyword density analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Format compatibility check
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Industry-specific recommendations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <Download className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Multiple Formats</CardTitle>
              <CardDescription>
                Export your resume in various formats including PDF, DOCX, 
                JSON Resume, and Markdown.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Professional PDF output
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  DOCX for easy editing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  JSON Resume standard
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your data stays secure with local-first approach, 
                optional AI features, and full control over your information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Local-first data storage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Optional cloud AI features
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  PII redaction options
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Create Your Perfect Resume?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of job seekers who have already created 
              ATS-optimized resumes with ResumeAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/resume-builder">
                  Start Building Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/resume-parser">
                  Upload Existing Resume
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-bold">ResumeAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered resume builder for the modern job seeker.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/resume-builder" className="hover:text-primary">Resume Builder</Link></li>
                <li><Link href="/resume-parser" className="hover:text-primary">Resume Parser</Link></li>
                <li><Link href="/job-tailoring" className="hover:text-primary">Job Tailoring</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="/templates" className="hover:text-primary">Templates</Link></li>
                <li><Link href="/examples" className="hover:text-primary">Examples</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ResumeAI. All rights reserved. Built with ❤️ for job seekers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
