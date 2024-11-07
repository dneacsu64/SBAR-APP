import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ReportOutput } from './components/ReportOutput';
import { processImage } from './services/api';
import { FileText } from 'lucide-react';
import type { SBARReport, APIError } from './types/api';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sbarReport, setSbarReport] = useState<SBARReport | null>(null);
  const [error, setError] = useState<APIError | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      setSbarReport(null);

      const report = await processImage(file);
      setSbarReport(report);
    } catch (err: any) {
      console.error('Error processing image:', err);
      setError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <FileText className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-medium">SBAR Report Generator</h1>
        </div>

        <div className="space-y-6">
          <ImageUploader 
            onImageUpload={handleImageUpload}
            isLoading={isProcessing}
          />

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-md p-4 text-red-600">
              {error.message}
            </div>
          )}

          <ReportOutput 
            sbarReport={sbarReport}
            isLoading={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}