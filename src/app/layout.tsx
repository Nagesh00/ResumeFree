import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeAI - AI-Powered Resume Builder',
  description: 'Create, tailor, and optimize your resume with advanced AI assistance. Parse existing resumes, get ATS scoring, and tailor content for specific job descriptions.',
  keywords: 'resume, AI, ATS, job application, career, CV, resume builder, job tailoring',
  authors: [{ name: 'ResumeAI Team' }],
  creator: 'ResumeAI',
  publisher: 'ResumeAI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumeai.dev',
    siteName: 'ResumeAI',
    title: 'ResumeAI - AI-Powered Resume Builder',
    description: 'Create, tailor, and optimize your resume with advanced AI assistance.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResumeAI - AI-Powered Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeAI - AI-Powered Resume Builder',
    description: 'Create, tailor, and optimize your resume with advanced AI assistance.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
