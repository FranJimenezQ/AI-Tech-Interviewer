import Groq from 'groq-sdk';
import { NextResponse, NextRequest } from 'next/server';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://ai-tech-interviewer-iota.vercel.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
const SYSTEM_PROMPT = `You are an expert CV/resume analyst and career coach. 
Your job is to analyze a candidate's CV against a job description and provide detailed, actionable feedback.

You must respond ONLY with a valid JSON object, no markdown, no explanation, no extra text.

The JSON must follow this exact structure:
{
  "fitScore": <number between 0-100>,
  "matchSummary": "<2-3 sentence summary of how well the CV matches the role>",
  "keywords": {
    "matched": <number of keywords from job description found in CV>,
    "total": <total number of important keywords in job description>,
    "percentage": <matched/total * 100>
  },
  "seniorityAlignment": "<one of: Aligned | Overqualified | Underqualified | Not Applicable>",
  "formatStatus": "<one of: Clean | Needs Review | Incomplete | Not Applicable>",
  "suggestedChanges": [
    {
      "id": 1,
      "title": "<short title of the suggestion>",
      "description": "<specific, actionable description with examples where possible>"
    }
  ]
}

Rules:
- suggestedChanges must have between 3 and 6 items
- fitScore must reflect how well the CV matches the specific job description
- matchSummary must be honest and specific, mentioning strengths and gaps
- keywords must reflect actual keywords from the job description
- Be specific and actionable, not generic`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cvText, level, jobDescription } = body;
        
        if (!cvText || !level || !jobDescription) {
            return NextResponse.json(
                { message: 'Missing required fields: cvText, level, jobDescription' }, 
                { status: 400, headers: corsHeaders }
            );
        }

        if (cvText.length < 100) {
            return NextResponse.json(
                { message: 'CV text is too short to analyze. Please provide a more detailed CV.' }, 
                { status: 400, headers: corsHeaders }
            );
        }
        const userMessage = `
            CANDIDATE LEVEL: ${level}

            JOB DESCRIPTION:
            ${jobDescription}

            CV CONTENT:
            ${cvText.slice(0, 6000)}
            `;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 2000,
            temperature: 0.3
        });

        const rawResponse = completion.choices[0].message.content ?? '';
        let analysisResult;
        try {
            analysisResult = JSON.parse(rawResponse);

        } catch {
            const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in model response');
            }
        }

        return NextResponse.json(analysisResult, { 
            status: 200,
            headers: corsHeaders 
        });

    } catch (error: any) {
        console.error('Error in analysis route:', error);
        return NextResponse.json(
            { message: error.message || 'An error occurred while processing the analysis.' }, 
            { status: 500, headers: corsHeaders }
        );
    }
}