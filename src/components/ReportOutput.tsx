import React from 'react';
import { ClipboardCopy } from 'lucide-react';
import type { SBARReport } from '../types/api';

interface ReportOutputProps {
  sbarReport: SBARReport | null;
  isLoading: boolean;
}

export function ReportOutput({ sbarReport, isLoading }: ReportOutputProps) {
  if (isLoading) {
    return (
      <div className="border rounded-md p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sbarReport) return null;

  const sections = [
    {
      title: 'Situation',
      subsections: [
        { label: 'Patient Information', content: sbarReport.situation.patientInfo },
        { label: 'Allergies', content: sbarReport.situation.allergies },
        { label: 'Code Status', content: sbarReport.situation.codeStatus },
        { label: 'Admitting Diagnosis', content: sbarReport.situation.admittingDiagnosis }
      ]
    },
    {
      title: 'Background',
      subsections: [
        { label: 'Present Illness', content: sbarReport.background.presentIllness },
        { label: 'Past History', content: sbarReport.background.pastHistory },
        { label: 'Medications', content: sbarReport.background.medications },
        { label: 'Vital Signs', content: sbarReport.background.vitalSigns }
      ]
    },
    {
      title: 'Assessment',
      subsections: [
        { label: 'Neurological', content: sbarReport.assessment.neurological },
        { label: 'Cardiovascular', content: sbarReport.assessment.cardiovascular },
        { label: 'Respiratory', content: sbarReport.assessment.respiratory },
        { label: 'Gastrointestinal', content: sbarReport.assessment.gastrointestinal },
        { label: 'Genitourinary', content: sbarReport.assessment.genitourinary },
        { label: 'Musculoskeletal', content: sbarReport.assessment.musculoskeletal },
        { label: 'Skin', content: sbarReport.assessment.skin },
        { label: 'Labs & Diagnostics', content: sbarReport.assessment.labsAndDiagnostics },
        { label: 'Lines & Drains', content: sbarReport.assessment.linesAndDrains },
        { label: 'Therapies', content: sbarReport.assessment.therapies },
        { label: 'Isolation Status', content: sbarReport.assessment.isolationStatus },
        { label: 'Fall Risk', content: sbarReport.assessment.fallRisk }
      ]
    },
    {
      title: 'Recommendation',
      subsections: [
        { label: 'Plan of Care', content: sbarReport.recommendation.planOfCare }
      ]
    }
  ];

  const copyToClipboard = () => {
    const text = sections
      .map(section => {
        const subsectionText = section.subsections
          .map(sub => `${sub.label}:\n${sub.content}`)
          .join('\n\n');
        return `${section.title}\n\n${subsectionText}`;
      })
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="border rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">SBAR Report</h2>
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-50"
          title="Copy to clipboard"
        >
          <ClipboardCopy className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">{section.title}</h3>
            <div className="space-y-4">
              {section.subsections.map(subsection => (
                <div key={subsection.label} className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">{subsection.label}</h4>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{subsection.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}