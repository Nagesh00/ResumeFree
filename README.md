# ResumeAI - AI-Powered Resume Builder

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-green)](https://opensource.org/licenses/AGPL-3.0)

A modern, AI-powered resume builder with advanced parsing, job tailoring, and multi-format export capabilities. Built with Next.js 14, React 18, TypeScript, and multiple AI provider integrations.

## ✨ Features

### 🤖 AI-Powered Resume Assistant
- **Multi-Provider Support**: OpenAI, Anthropic, Google AI, Perplexity, and Ollama
- **Smart Content Generation**: AI-assisted writing for resume sections
- **Job Tailoring**: Automatically customize resumes for specific job descriptions
- **ATS Optimization**: AI-powered keyword extraction and matching

### 📄 Advanced Resume Parser
- **PDF Parsing**: Extract content from existing PDFs with high accuracy
- **LLM Post-Correction**: AI-enhanced parsing for better data extraction
- **Multiple Formats**: Support for PDF, DOCX, and plain text uploads
- **Confidence Scoring**: Real-time parsing accuracy indicators

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful, modern interface with glass effects
- **Dark Mode**: System-aware dark/light theme switching
- **Responsive Layout**: Mobile-first design that works on all devices
- **Keyboard Navigation**: Full keyboard accessibility support
- **Command Palette**: Quick actions with Cmd+K

### 📤 Multi-Format Export
- **PDF Export**: High-quality PDF generation with custom templates
- **DOCX Export**: Microsoft Word compatible documents
- **JSON Resume**: Standard JSON Resume format
- **Markdown Export**: Clean markdown for version control

### 🔒 Privacy & Security
- **Local-First**: All processing happens in your browser by default
- **Client-Side AI**: Direct API calls with your own keys
- **No Data Collection**: Your resume data never leaves your device
- **Optional Cloud**: Opt-in AI features with user-provided API keys

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nagesh00/ResumeAI.git
   cd ResumeAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your AI provider API keys:
   ```env
   # Required for AI features
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   
   # Optional: For local AI models
   OLLAMA_BASE_URL=http://localhost:11434
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### AI Providers

The application supports multiple AI providers. Configure them in your `.env.local`:

#### OpenAI
```env
OPENAI_API_KEY=sk-...
```

#### Anthropic Claude
```env
ANTHROPIC_API_KEY=sk-ant-...
```

#### Google AI (Gemini)
```env
GOOGLE_API_KEY=AI...
```

#### Azure OpenAI
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_KEY=your_azure_openai_key_here
```

#### Ollama (Local Models)
```env
OLLAMA_BASE_URL=http://localhost:11434
```

### Template Customization

Resume templates can be customized in `src/lib/templates/`. Each template includes:
- Layout configuration
- Styling options
- Export settings
- Responsive breakpoints

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── builder/           # Resume builder pages
│   ├── parser/            # Resume parser pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ai/               # AI assistant components
│   ├── builder/          # Resume builder UI
│   ├── parser/           # Resume parser UI
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Core libraries
│   ├── ai/               # AI provider implementations
│   ├── parsing/          # PDF/document parsing
│   ├── exporters/        # Multi-format export
│   ├── storage/          # Local storage & persistence
│   ├── templates/        # Resume templates
│   └── schema/           # Type definitions & validation
├── store/                # Redux store configuration
│   ├── slices/           # Redux slices
│   └── index.ts          # Store configuration
└── types/                # TypeScript type definitions
```

## 🎯 Usage Guide

### Building a Resume

1. **Start Fresh**: Click "Create New Resume" on the homepage
2. **Personal Information**: Fill in your basic details
3. **Experience**: Add work experience with AI assistance
4. **Education**: Include your educational background
5. **Skills**: Add technical and soft skills
6. **AI Enhancement**: Use the AI assistant to improve content
7. **Preview**: Review your resume in real-time
8. **Export**: Download in your preferred format

### Parsing Existing Resumes

1. **Upload**: Drag and drop your existing resume (PDF/DOCX)
2. **Processing**: Watch the AI parse and extract information
3. **Review**: Check the extracted data for accuracy
4. **Edit**: Make any necessary corrections
5. **Save**: Store as a new resume project

### Job Tailoring

1. **Job Description**: Paste the target job description
2. **Analysis**: AI analyzes requirements and keywords
3. **Suggestions**: Get tailored content recommendations
4. **Apply Changes**: Accept or modify AI suggestions
5. **Compare**: Use the diff viewer to see changes
6. **Export**: Generate the tailored resume

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Code Quality

- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting (auto-formatted on save)
- **Husky**: Git hooks for pre-commit checks

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Type check: `npm run type-check`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 🔌 API Integration

### AI Providers API

```typescript
// Example: Using the AI service
import { runAI } from '@/lib/ai/resume-generator';

const response = await runAI({
  provider: 'openai',
  prompt: 'Improve this resume section...',
  context: resumeData
});
```

### Export API

```typescript
// Example: Exporting resume
import { exportResumeToPDF } from '@/lib/exporters/pdf-exporter';

const pdfBlob = await exportResumeToPDF(resumeData, templateId);
```

## 📦 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add your API keys in Vercel dashboard
3. **Deploy**: Automatic deployment on push to main branch

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

### Docker

```dockerfile
# Build and run with Docker
docker build -t resumeai .
docker run -p 3000:3000 resumeai
```

### Other Platforms

- **Netlify**: Static export with `npm run export`
- **Railway**: Direct deployment from GitHub
- **AWS Amplify**: Connect repository for auto-deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Areas for Contribution

- 🎨 New resume templates
- 🤖 Additional AI provider integrations
- 📱 Mobile app development
- 🌍 Internationalization (i18n)
- ♿ Accessibility improvements
- 🧪 Test coverage expansion

## 📄 License

This project is licensed under the **AGPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

### Why AGPL-3.0?

We chose AGPL-3.0 to ensure that:
- The project remains open source
- Any modifications or improvements are shared back with the community
- Commercial use is allowed with proper attribution
- Network use (SaaS) requires source code disclosure

## 🙏 Acknowledgments

- **Open Resume**: Original inspiration and foundation
- **Next.js Team**: Amazing React framework
- **Vercel**: Excellent hosting platform
- **OpenAI**: GPT models for AI features
- **Anthropic**: Claude AI integration
- **Google**: Gemini AI support

## 📞 Support

- **Documentation**: [Wiki](https://github.com/Nagesh00/ResumeAI/wiki)
- **Issues**: [GitHub Issues](https://github.com/Nagesh00/ResumeAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nagesh00/ResumeAI/discussions)

## 🗺️ Roadmap

### Version 2.1 (Next Release)
- [ ] Real-time collaboration
- [ ] Advanced template editor
- [ ] Integration with job boards
- [ ] Mobile app (React Native)

### Version 2.2 (Future)
- [ ] Video resume support
- [ ] Portfolio integration
- [ ] Advanced analytics
- [ ] Multi-language support

### Version 3.0 (Long-term)
- [ ] AI-powered interview preparation
- [ ] Career progression tracking
- [ ] Social features and sharing
- [ ] Enterprise features

---

**Built with ❤️ using Next.js, TypeScript, and AI**

⭐ **Star this repository if you find it helpful!**
