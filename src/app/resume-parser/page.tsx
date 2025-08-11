import { Metadata } from 'next';
import ResumeParserClient from '../../components/resume-parser/ResumeParserClient';

export const metadata: Metadata = {
  title: 'Resume Parser - ResumeAI',
  description: 'Upload and parse your existing resume with AI',
};

export default function ResumeParserPage() {
  return <ResumeParserClient />;
}
