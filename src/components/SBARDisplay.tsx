import React from 'react';
import { Copy } from 'lucide-react';

interface SBARDisplayProps {
  sbar: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  } | null;
}

export function SBARDisplay({ sbar }: SBARDisplayProps) {
  if (!sbar) return null;

  const sections = [
    { title: 'Situation', content: sbar.situation },
    { title: 'Background', content: sbar.background },
    { title: 'Assessment', content: sbar.assessment },
    { title: 'Recommendation', content: sbar.recommendation }
  ];

  const copyToClipboard = () => {
    const text = sections
      .map(section => `${section.title}:\n${section.content}\n`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={copyToClipboard}
          className="notion-button"
        >
          <Copy className="w-4 h-4" />
          Copy to clipboard
        </button>
      </div>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="text-[#9B9A97] text-sm">{section.title}</h3>
            <div className="bg-[#F7F6F3] p-4 rounded-lg">
              <p className="text-[15px] leading-relaxed">{section.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}