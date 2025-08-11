import { AIMessage } from './types';
import { Resume } from '../schema/resume';

// Resume parsing prompt template
export function buildResumeParsePrompt(
  extractedText: string,
  layoutInfo?: any
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a professional resume parser. Your task is to convert extracted resume text into a structured JSON format that matches the given schema.

INSTRUCTIONS:
1. Parse the provided resume text carefully
2. Extract and organize information into the specified JSON structure
3. Normalize dates to "MM/YYYY" format or just "YYYY" if month is unclear
4. Group similar skills into logical categories
5. Extract bullet points exactly as written, preserving formatting
6. If information is missing or unclear, use appropriate defaults or empty values
7. Ensure all required fields are present
8. Return ONLY valid JSON, no additional text

SCHEMA STRUCTURE:
{
  "name": "string",
  "title": "string (job title/professional title)",
  "summary": "string (professional summary/objective)",
  "contact": {
    "email": "string",
    "phone": "string", 
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "location": "string"
  },
  "experiences": [
    {
      "id": "string (generate UUID)",
      "company": "string",
      "title": "string", 
      "location": "string",
      "startDate": {"month": "string", "year": "string"},
      "endDate": {"month": "string", "year": "string"} | null,
      "current": "boolean",
      "bullets": [
        {
          "id": "string (generate UUID)",
          "text": "string",
          "keywords": ["string"],
          "metrics": {"hasMetrics": "boolean", "values": ["string"]}
        }
      ]
    }
  ],
  "projects": [similar structure],
  "education": [similar structure],
  "skills": [
    {
      "id": "string",
      "category": "string (e.g., 'Programming Languages', 'Frameworks')",
      "items": ["string"]
    }
  ],
  "certifications": [similar structure],
  "achievements": [similar structure]
}`
    },
    {
      role: 'user',
      content: `Parse this resume text into the specified JSON format:

${extractedText}

${layoutInfo ? `\nLayout information: ${JSON.stringify(layoutInfo, null, 2)}` : ''}

Return only the JSON object, no additional text.`
    }
  ];
}

// Resume tailoring prompt template
export function buildTailorPrompt(
  resume: Resume,
  jobDescription: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a professional resume optimization expert. Your task is to analyze a resume against a job description and suggest specific improvements to increase ATS compatibility and recruiter appeal.

INSTRUCTIONS:
1. Analyze the job description to extract key requirements, skills, and keywords
2. Compare the resume content against these requirements
3. Suggest specific edits to better align with the job posting
4. Focus on keyword optimization, quantification, and relevance
5. Maintain professional tone and accuracy
6. Return suggestions in the specified JSON format

RESPONSE FORMAT:
{
  "analysis": {
    "keyRequirements": ["string"],
    "missingKeywords": ["string"],
    "strengths": ["string"],
    "gaps": ["string"]
  },
  "suggestions": [
    {
      "id": "string (generate UUID)",
      "type": "string (tailor-summary|tailor-experience|tailor-skills|add-keyword)",
      "section": "string (summary|experience|skills|etc)",
      "priority": "string (high|medium|low)",
      "currentText": "string",
      "proposedText": "string", 
      "rationale": "string",
      "keywordHits": ["string"],
      "confidence": "number (0-1)"
    }
  ],
  "atsScore": {
    "overall": "number (0-100)",
    "keywordMatch": "number (0-100)",
    "formatScore": "number (0-100)"
  }
}`
    },
    {
      role: 'user',
      content: `Analyze this resume against the job description and provide tailoring suggestions:

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME:
${JSON.stringify(resume, null, 2)}

Provide analysis and specific suggestions for improvement.`
    }
  ];
}

// Summary generation prompt
export function buildSummaryPrompt(
  resume: Resume,
  style: 'recruiter' | 'technical' | 'executive' = 'recruiter'
): AIMessage[] {
  const styleInstructions = {
    recruiter: 'Focus on achievements, impact, and career progression. Use action verbs and quantifiable results.',
    technical: 'Emphasize technical expertise, tools, methodologies, and complex problem-solving abilities.',
    executive: 'Highlight leadership, strategic thinking, business impact, and organizational achievements.'
  };

  return [
    {
      role: 'system',
      content: `You are a professional resume writer specializing in compelling career summaries. Create a professional summary that effectively showcases the candidate's value proposition.

STYLE: ${style.toUpperCase()}
INSTRUCTIONS: ${styleInstructions[style]}

REQUIREMENTS:
- 3-4 sentences maximum
- Start with years of experience and expertise area
- Include 2-3 key achievements or strengths
- End with career goal or value proposition
- Use active voice and strong action verbs
- Avoid first person pronouns
- Be specific and quantifiable where possible

Return only the summary text, no additional formatting.`
    },
    {
      role: 'user',
      content: `Create a ${style} professional summary based on this resume data:

${JSON.stringify(resume, null, 2)}

Return only the summary text.`
    }
  ];
}

// Bullet point quantification prompt
export function buildQuantifyPrompt(bullets: string[]): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a resume optimization expert specializing in quantifying achievements. Your task is to rewrite bullet points to include specific metrics and measurable outcomes.

INSTRUCTIONS:
1. Rewrite each bullet point to include quantifiable metrics
2. If exact numbers aren't available, suggest realistic estimates based on the role/industry
3. Use action verbs and focus on results/impact
4. Maintain accuracy - don't inflate or misrepresent
5. Include context for metrics (timeframe, scope, comparison)

METRIC TYPES TO INCLUDE:
- Percentages (growth, improvement, efficiency)
- Dollar amounts (revenue, cost savings, budget)
- Numbers (team size, projects, customers)
- Timeframes (delivery speed, frequency)
- Scale (volume, reach, scope)

RESPONSE FORMAT:
{
  "quantified_bullets": [
    {
      "original": "string",
      "quantified": "string",
      "metrics_added": ["string"],
      "rationale": "string"
    }
  ]
}`
    },
    {
      role: 'user',
      content: `Quantify these bullet points with specific metrics:

${bullets.map((bullet, index) => `${index + 1}. ${bullet}`).join('\n')}

Return the response in the specified JSON format.`
    }
  ];
}

// Keyword extraction prompt
export function buildKeywordExtractionPrompt(jobDescription: string): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an ATS (Applicant Tracking System) keyword extraction expert. Analyze the job description and extract the most important keywords and phrases that an ATS would look for.

CATEGORIES TO EXTRACT:
1. Hard Skills (technical skills, tools, software, programming languages)
2. Soft Skills (leadership, communication, problem-solving)
3. Certifications and Qualifications
4. Industry Terms and Jargon
5. Required Experience Levels
6. Education Requirements
7. Job Titles and Roles

RESPONSE FORMAT:
{
  "keywords": {
    "required": ["string (must-have keywords)"],
    "preferred": ["string (nice-to-have keywords)"],
    "hard_skills": ["string"],
    "soft_skills": ["string"],
    "certifications": ["string"],
    "experience_level": "string",
    "education": ["string"],
    "job_titles": ["string"]
  },
  "phrases": ["string (2-4 word phrases)"],
  "priority_score": {
    "keyword": "number (1-10)"
  }
}`
    },
    {
      role: 'user',
      content: `Extract ATS keywords from this job description:

${jobDescription}

Focus on terms that would be searched by recruiters and ATS systems.`
    }
  ];
}

// Cover letter generation prompt
export function buildCoverLetterPrompt(
  resume: Resume,
  jobDescription: string,
  companyName: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a professional cover letter writer. Create a compelling, personalized cover letter that connects the candidate's experience with the job requirements.

STRUCTURE:
1. Opening: Hook + position interest
2. Body 1: Relevant experience alignment
3. Body 2: Specific achievements and value
4. Closing: Call to action and enthusiasm

REQUIREMENTS:
- Maximum 3 paragraphs
- Specific examples from resume
- Address key job requirements
- Show knowledge of company/role
- Professional but engaging tone
- Include call to action
- Avoid clichés and generic statements

Return only the cover letter text, properly formatted.`
    },
    {
      role: 'user',
      content: `Create a cover letter for this position:

COMPANY: ${companyName}
JOB DESCRIPTION: ${jobDescription}

CANDIDATE RESUME: ${JSON.stringify(resume, null, 2)}

Write a compelling cover letter that highlights relevant experience and achievements.`
    }
  ];
}

// ATS scoring prompt
export function buildATSScorePrompt(
  resume: Resume,
  jobDescription: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an ATS (Applicant Tracking System) analysis expert. Evaluate how well the resume matches the job description and provide a detailed scoring breakdown.

SCORING CRITERIA:
1. Keyword Match (0-30 points)
2. Experience Relevance (0-25 points)
3. Skills Alignment (0-20 points)
4. Education Match (0-10 points)
5. Format/Structure (0-15 points)

RESPONSE FORMAT:
{
  "overall_score": "number (0-100)",
  "breakdown": {
    "keyword_match": {"score": "number", "details": "string"},
    "experience_relevance": {"score": "number", "details": "string"},
    "skills_alignment": {"score": "number", "details": "string"},
    "education_match": {"score": "number", "details": "string"},
    "format_structure": {"score": "number", "details": "string"}
  },
  "keyword_analysis": {
    "matched": ["string"],
    "missing": ["string"],
    "match_percentage": "number"
  },
  "recommendations": ["string"],
  "rank": "string (Excellent|Good|Fair|Poor)"
}`
    },
    {
      role: 'user',
      content: `Score this resume against the job description using ATS criteria:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${JSON.stringify(resume, null, 2)}

Provide detailed scoring and specific recommendations for improvement.`
    }
  ];
}

// Skills gap analysis prompt
export function buildSkillsGapPrompt(
  resume: Resume,
  jobDescription: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a career development expert. Analyze the gap between the candidate's current skills and the job requirements to provide actionable development recommendations.

ANALYSIS AREAS:
1. Required skills the candidate has
2. Required skills the candidate lacks
3. Preferred skills the candidate has
4. Preferred skills the candidate lacks
5. Learning priorities and resources

RESPONSE FORMAT:
{
  "skills_inventory": {
    "has_required": ["string"],
    "missing_required": ["string"],
    "has_preferred": ["string"],
    "missing_preferred": ["string"]
  },
  "gap_analysis": {
    "critical_gaps": ["string"],
    "development_priorities": ["string"],
    "strengths": ["string"]
  },
  "recommendations": [
    {
      "skill": "string",
      "priority": "string (high|medium|low)",
      "learning_path": "string",
      "resources": ["string"],
      "timeline": "string"
    }
  ],
  "overall_readiness": "number (0-100)"
}`
    },
    {
      role: 'user',
      content: `Analyze the skills gap for this candidate:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SKILLS (from resume):
${JSON.stringify(resume.skills, null, 2)}

CANDIDATE EXPERIENCE:
${JSON.stringify(resume.experiences, null, 2)}

Provide detailed gap analysis and development recommendations.`
    }
  ];
}
