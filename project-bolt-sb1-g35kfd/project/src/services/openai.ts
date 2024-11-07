import OpenAI from 'openai';
import { SBARReport } from '../types/api';
import { createAPIError } from '../utils/errors';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a medical document analysis assistant. Extract and organize medical information from images in a clear, structured format following standard nursing documentation practices."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract and organize all medical information from this image in a clear format. Include patient identification, allergies, code status, diagnoses, history, medications, vital signs, and all assessment findings."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return content;
  } catch (error: any) {
    console.error('OpenAI Vision API Error:', error);
    throw createAPIError(error);
  }
}

export async function generateSBAR(medicalText: string): Promise<SBARReport> {
  try {
    const prompt = `Based on the following medical information, create a structured SBAR report. Format your response as a valid JSON object with the following structure, ensuring all fields contain appropriate string values:

{
  "situation": {
    "patientInfo": "<patient name, DOB, room #, MRN>",
    "allergies": "<known allergies and reactions>",
    "codeStatus": "<code status>",
    "admittingDiagnosis": "<primary diagnosis>"
  },
  "background": {
    "presentIllness": "<HPI summary>",
    "pastHistory": "<PMH summary>",
    "medications": "<current medications>",
    "vitalSigns": "<latest vitals>"
  },
  "assessment": {
    "neurological": "<neuro status>",
    "cardiovascular": "<cardio status>",
    "respiratory": "<resp status>",
    "gastrointestinal": "<GI status>",
    "genitourinary": "<GU status>",
    "musculoskeletal": "<mobility status>",
    "skin": "<skin assessment>",
    "labsAndDiagnostics": "<lab results>",
    "linesAndDrains": "<lines/drains>",
    "therapies": "<current therapies>",
    "isolationStatus": "<isolation info>",
    "fallRisk": "<fall risk status>"
  },
  "recommendation": {
    "planOfCare": "<care plan>"
  }
}

Medical Information:
${medicalText}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an experienced nurse creating SBAR reports. Generate structured JSON responses following the exact format provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    try {
      const sbarReport = JSON.parse(content.trim()) as SBARReport;
      validateSBARReport(sbarReport);
      return sbarReport;
    } catch (parseError) {
      throw new Error('Failed to parse SBAR report: Invalid JSON format');
    }
  } catch (error: any) {
    console.error('OpenAI SBAR Generation Error:', error);
    throw createAPIError(error);
  }
}

function validateSBARReport(report: any): asserts report is SBARReport {
  const requiredSections = ['situation', 'background', 'assessment', 'recommendation'] as const;
  
  for (const section of requiredSections) {
    if (!report[section] || typeof report[section] !== 'object') {
      throw new Error(`Invalid SBAR report: missing or invalid ${section} section`);
    }
  }

  const situationFields = ['patientInfo', 'allergies', 'codeStatus', 'admittingDiagnosis'];
  const backgroundFields = ['presentIllness', 'pastHistory', 'medications', 'vitalSigns'];
  const assessmentFields = [
    'neurological', 'cardiovascular', 'respiratory', 'gastrointestinal',
    'genitourinary', 'musculoskeletal', 'skin', 'labsAndDiagnostics',
    'linesAndDrains', 'therapies', 'isolationStatus', 'fallRisk'
  ];
  const recommendationFields = ['planOfCare'];

  for (const field of situationFields) {
    if (typeof report.situation[field] !== 'string') {
      throw new Error(`Invalid SBAR report: missing or invalid situation.${field}`);
    }
  }

  for (const field of backgroundFields) {
    if (typeof report.background[field] !== 'string') {
      throw new Error(`Invalid SBAR report: missing or invalid background.${field}`);
    }
  }

  for (const field of assessmentFields) {
    if (typeof report.assessment[field] !== 'string') {
      throw new Error(`Invalid SBAR report: missing or invalid assessment.${field}`);
    }
  }

  for (const field of recommendationFields) {
    if (typeof report.recommendation[field] !== 'string') {
      throw new Error(`Invalid SBAR report: missing or invalid recommendation.${field}`);
    }
  }
}