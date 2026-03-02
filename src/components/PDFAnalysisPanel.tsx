import React, { useState } from 'react';
import {
  FileText,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  BarChart3,
  Eye,
  Download,
} from 'lucide-react';

interface PDFAnalysis {
  fileName: string;
  fileSize: number;
  wordCount: number;
  pageCount: number;
  extractedText: string;
  language: string;
  readabilityScore: number;
  complexity: 'low' | 'medium' | 'high';
  keyPhrases: string[];
  timestamp: Date;
}

export function PDFAnalysisPanel() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfAnalysis, setPdfAnalysis] = useState<PDFAnalysis | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          let text = '';
          let i = 0;

          while (i < uint8Array.length) {
            const byte = uint8Array[i];

            if (byte === 0x42 && uint8Array[i + 1] === 0x54) {
              i += 2;
              while (i < uint8Array.length && uint8Array[i] !== 0x45 && uint8Array[i] !== 0x65) {
                const char = String.fromCharCode(uint8Array[i]);
                if ((char >= ' ' && char <= '~') || char === '\n' || char === '\r' || char === '\t') {
                  text += char;
                }
                i++;
              }
            } else if (byte >= 32 && byte <= 126) {
              text += String.fromCharCode(byte);
            }
            i++;
          }

          const cleanedText = text
            .split(/[\n\r]+/)
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0)
            .join(' ')
            .replace(/\s+/g, ' ')
            .substring(0, 50000);

          resolve(cleanedText || text.substring(0, 50000));
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const detectLanguage = (text: string): string => {
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se'];
    const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i'];

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    const spanishCount = words.filter(w => spanishWords.includes(w)).length;
    const englishCount = words.filter(w => englishWords.includes(w)).length;

    if (spanishCount > englishCount) return 'Español';
    if (englishCount > spanishCount) return 'English';
    return 'Mixto';
  };

  const calculateReadabilityScore = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;

    let score = 100;
    if (avgWordsPerSentence > 20) score -= 15;
    if (avgWordsPerSentence > 25) score -= 10;

    return Math.max(30, Math.min(100, score));
  };

  const extractKeyPhrases = (text: string): string[] => {
    const words = text.split(/\s+/).filter(w => w.length > 3);
    const phrases: Record<string, number> = {};

    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }

    return Object.entries(phrases)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase]) => phrase);
  };

  const analyzeText = (text: string): PDFAnalysis => {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const pageCount = Math.ceil(wordCount / 250);
    const language = detectLanguage(text);
    const readabilityScore = calculateReadabilityScore(text);
    const complexity: 'low' | 'medium' | 'high' =
      readabilityScore > 70 ? 'low' : readabilityScore > 50 ? 'medium' : 'high';
    const keyPhrases = extractKeyPhrases(text);

    return {
      fileName: pdfFile?.name || 'documento.pdf',
      fileSize: pdfFile?.size || 0,
      wordCount,
      pageCount,
      extractedText: text,
      language,
      readabilityScore,
      complexity,
      keyPhrases,
      timestamp: new Date(),
    };
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdfError('');

    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      setPdfError('Por favor carga un archivo PDF válido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPdfError('El archivo es demasiado grande (máximo 10 MB)');
      return;
    }

    setPdfFile(file);
    setExtractingPdf(true);

    try {
      const text = await extractTextFromPdf(file);
      const analysis = analyzeText(text);
      setPdfAnalysis(analysis);
      setPdfError('');
    } catch (error) {
      setPdfError('Error al procesar el PDF. Intenta con otro archivo.');
      setPdfFile(null);
      setPdfAnalysis(null);
    } finally {
      setExtractingPdf(false);
    }
  };

  const clearPdf = () => {
    setPdfFile(null);
    setPdfAnalysis(null);
    setPdfError('');
    setShowExtractedText(false);
  };

  const downloadAnalysis = () => {
    if (!pdfAnalysis) return;

    const content = `Análisis de PDF
================

Archivo: ${pdfAnalysis.fileName}
Tamaño: ${(pdfAnalysis.fileSize / 1024).toFixed(2)} KB
Fecha: ${pdfAnalysis.timestamp.toLocaleString()}

ESTADÍSTICAS
============
Palabras: ${pdfAnalysis.wordCount}
Páginas estimadas: ${pdfAnalysis.pageCount}
Idioma: ${pdfAnalysis.language}
Puntuación de legibilidad: ${pdfAnalysis.readabilityScore}/100
Complejidad: ${pdfAnalysis.complexity === 'low' ? 'Baja' : pdfAnalysis.complexity === 'medium' ? 'Media' : 'Alta'}

FRASES CLAVE
============
${pdfAnalysis.keyPhrases.map((phrase, i) => `${i + 1}. ${phrase}`).join('\n')}

TEXTO EXTRAÍDO
==============
${pdfAnalysis.extractedText}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdfAnalysis.fileName.replace('.pdf', '')}_analisis.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Análisis de PDF</h2>
        </div>
        <p className="text-blue-100">
          Carga archivos PDF para extraer y analizar su contenido, incluyendo legibilidad, complejidad y frases clave.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {!pdfFile ? (
          <div>
            <label className="block cursor-pointer">
              <div className="p-8 border-2 border-dashed border-blue-300 rounded-lg text-center hover:bg-blue-50 transition-colors">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 text-lg">
                  {extractingPdf ? 'Procesando PDF...' : 'Arrastra un PDF aquí o haz clic para cargar'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Máximo 10 MB • Formato PDF
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={extractingPdf}
                className="hidden"
              />
            </label>

            {pdfError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{pdfError}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{pdfFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(pdfFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={clearPdf}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Loading State */}
            {extractingPdf && (
              <div className="p-4 bg-blue-50 rounded-lg flex items-center space-x-3">
                <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-blue-900">Procesando PDF...</p>
              </div>
            )}

            {/* Analysis Results */}
            {pdfAnalysis && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700">PDF procesado correctamente</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Palabras</p>
                    <p className="text-2xl font-bold text-gray-900">{pdfAnalysis.wordCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Páginas</p>
                    <p className="text-2xl font-bold text-gray-900">{pdfAnalysis.pageCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Idioma</p>
                    <p className="text-lg font-bold text-gray-900">{pdfAnalysis.language}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Legibilidad</p>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-2xl font-bold text-gray-900">{pdfAnalysis.readabilityScore}</p>
                      <p className="text-xs text-gray-600">/100</p>
                    </div>
                  </div>
                </div>

                {/* Complexity Badge */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-700">Complejidad:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pdfAnalysis.complexity === 'low'
                        ? 'bg-green-100 text-green-700'
                        : pdfAnalysis.complexity === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {pdfAnalysis.complexity === 'low'
                      ? 'Baja'
                      : pdfAnalysis.complexity === 'medium'
                        ? 'Media'
                        : 'Alta'}
                  </span>
                </div>

                {/* Key Phrases */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                    Frases Clave
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pdfAnalysis.keyPhrases.map((phrase, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Extracted Text Preview */}
                <div>
                  <button
                    onClick={() => setShowExtractedText(!showExtractedText)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>
                      {showExtractedText ? 'Ocultar' : 'Ver'} Texto Extraído
                    </span>
                  </button>

                  {showExtractedText && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {pdfAnalysis.extractedText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadAnalysis}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <Download className="h-5 w-5" />
                  <span>Descargar Análisis</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
