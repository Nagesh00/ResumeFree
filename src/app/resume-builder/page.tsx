import { Metadata } from 'next';
import ResumeBuilderClient from '../../components/resume-builder/ResumeBuilderClient';

export const metadata: Metadata = {
  title: 'Resume Builder - ResumeAI',
  description: 'Build your professional resume with AI assistance',
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
