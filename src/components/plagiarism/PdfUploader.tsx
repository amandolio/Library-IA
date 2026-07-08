import React from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

interface Props {
  pdfFile: File | null;
  pdfText: string;
  extractingPdf: boolean;
  pdfError: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function PdfUploader({ pdfFile, pdfText, extractingPdf, pdfError, onUpload, onClear }: Props) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center mb-3">
        <Upload className="h-5 w-5 mr-2 text-blue-600" />
        <h4 className="font-semibold text-blue-900">Cargar Documento PDF</h4>
      </div>
      {pdfFile ? (
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{pdfFile.name}</p>
                <p className="text-sm text-gray-600">{(pdfFile.size / 1024).toFixed(2)} KB - {pdfText.split(/\s+/).length} palabras</p>
              </div>
            </div>
            <button onClick={onClear} className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">{extractingPdf ? 'Procesando PDF...' : 'Arrastra un PDF aquí o haz clic para cargar'}</p>
          </div>
          <input type="file" accept=".pdf" onChange={onUpload} disabled={extractingPdf} className="hidden" />
        </label>
      )}
      {pdfError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{pdfError}</p>
        </div>
      )}
    </div>
  );
}

export async function extractTextFromPdf(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        let text = '', i = 0;
        while (i < arr.length) {
          const b = arr[i];
          if (b === 0x42 && arr[i + 1] === 0x54) {
            i += 2;
            while (i < arr.length && arr[i] !== 0x45 && arr[i] !== 0x65) {
              const c = String.fromCharCode(arr[i]);
              if ((c >= ' ' && c <= '~') || c === '\n' || c === '\r' || c === '\t') text += c;
              i++;
            }
          } else if (b >= 32 && b <= 126) {
            text += String.fromCharCode(b);
          }
          i++;
        }
        const cleaned = text.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0).join(' ').replace(/\s+/g, ' ').substring(0, 50000);
        resolve(cleaned || text.substring(0, 50000));
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}
