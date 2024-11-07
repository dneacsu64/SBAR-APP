import { analyzeImage, generateSBAR } from './openai';
import { fileToBase64, validateImageFile } from './imageProcessor';
import { createAPIError } from '../utils/errors';
import type { SBARReport } from '../types/api';

export async function processImage(file: File): Promise<SBARReport> {
  try {
    // Validate the image file
    validateImageFile(file);

    // Convert image to base64
    const base64Image = await fileToBase64(file);

    // Extract text from image using GPT-4 Vision
    const extractedText = await analyzeImage(base64Image);

    // Generate SBAR report
    const sbarReport = await generateSBAR(extractedText);

    return sbarReport;
  } catch (error: any) {
    console.error('Error processing image:', error);
    throw createAPIError(error);
  }
}