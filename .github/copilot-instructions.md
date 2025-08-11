# AI-Powered Resume Builder - Copilot Instructions

## Project Overview
Modern resume builder based on Next.js 13 with AI assistance, advanced parsing, job tailoring, and multi-format export capabilities.

## Progress Checklist
- [x] Verify copilot-instructions.md file created
- [ ] Clarify Project Requirements  
- [ ] Scaffold the Project
- [ ] Customize the Project
- [ ] Install Required Extensions
- [ ] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete

## Project Requirements
- **Base**: Next.js 13, React, TypeScript, Tailwind CSS, Redux Toolkit
- **Core Features**: PDF.js parsing, react-pdf generation
- **AI Features**: Multiple provider support (OpenAI, Anthropic, Azure, Google, Ollama)
- **Export Formats**: PDF, DOCX, JSON Resume, Markdown
- **Privacy**: Local-first with opt-in cloud AI
- **UI/UX**: Modern glassmorphism, dark mode, keyboard-first navigation

## Architecture
```
src/
├── lib/
│   ├── ai/                 # AI provider abstraction
│   ├── parsing/           # PDF parsing & schema validation
│   ├── exporters/         # Multi-format export
│   ├── providers/         # AI provider implementations
│   ├── ats/              # ATS scoring & keyword extraction
│   ├── storage/          # Local snapshots & versioning
│   └── schema/           # Zod validation schemas
├── components/
│   ├── ai/               # AI assistant components
│   ├── tailoring/        # Job tailoring workspace
│   ├── diff/            # Diff viewer components
│   └── settings/        # Settings & privacy controls
└── app/                 # Next.js 13 app router
```

## Key Features to Implement
1. AI Resume Assistant (modular providers)
2. Advanced PDF Parser with LLM post-correction
3. Job-tailoring workspace with diff view
4. Multi-template theme system
5. Export/Import (PDF, DOCX, JSON Resume, Markdown)
6. Collaboration and versioning
7. Accessibility and command palette
8. Privacy modes and local inference

## Development Guidelines
- Keep AGPL-3.0 license compatibility
- Client-side AI calls with user-provided keys
- Feature flags for AI modules
- Comprehensive error handling and validation
- Accessible UI with keyboard navigation
- Dark mode by default
