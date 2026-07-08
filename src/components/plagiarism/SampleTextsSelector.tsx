import React from 'react';
import { sampleTexts } from '../../data/sourceDocuments';

interface Props {
  onSelect: (text: string) => void;
}

export function SampleTextsSelector({ onSelect }: Props) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">O elige textos de ejemplo:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sampleTexts.map((sample, i) => (
          <button key={i} onClick={() => onSelect(sample.text)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left">
            <div className="flex items-center justify-between mb-1">
              <h5 className="font-medium text-gray-900">{sample.title}</h5>
              <span className={`px-2 py-0.5 text-xs rounded-full ${sample.language === 'es' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                {sample.language === 'es' ? 'ES' : 'EN'}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{sample.text.substring(0, 100)}...</p>
          </button>
        ))}
      </div>
    </div>
  );
}
