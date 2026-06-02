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
  Brain,
  BookOpen,
  Info,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  aiScore: number;
  sourceScore: number;
  highlights: HighlightItem[];
}

interface HighlightItem {
  text: string;
  type: 'ai' | 'source';
  confidence: number;
}

export function PDFAnalysisPanel() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfAnalysis, setPdfAnalysis] = useState<PDFAnalysis | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'ai' | 'source'>('all');
  const [showTooltip, setShowTooltip] = useState<'ai' | 'source' | null>(null);

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

  const analyzeProcedence = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const urlPatterns = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
    const citationPatterns = /\([^)]*(?:et al\.|et al|pp\.|pp|vol\.|vol|\d{4}|ISBN|DOI)[^)]*\)|\[[0-9]+\]|(?:Author|Smith|Johnson|Lee|García|López|Martínez|Rodríguez)\s+\(/gi;
    const biographyKeywords = /(?:references|bibliography|bibliografía|referencias|works cited|obras citadas)/gi;

    let sourceScore = 0;
    let aiScore = 0;
    const highlights: HighlightItem[] = [];
    let sourceCount = 0;

    sentences.forEach((sentence) => {
      const hasUrl = urlPatterns.test(sentence);
      const hasCitation = citationPatterns.test(sentence);
      const hasSpecificData = /\d{4}|\d+%|USD|EUR|€|\$/.test(sentence);
      const hasAcademicTerms = /hypothesis|methodology|empirical|quantitative|qualitative|research|study|analysis/gi.test(sentence);

      const sourceIndicators = [hasUrl, hasCitation, hasSpecificData, hasAcademicTerms].filter(Boolean).length;
      const isSource = sourceIndicators >= 2;

      if (isSource) {
        sourceCount++;
        highlights.push({
          text: sentence.trim(),
          type: 'source',
          confidence: Math.min(100, 60 + sourceIndicators * 10)
        });
      } else {
        highlights.push({
          text: sentence.trim(),
          type: 'ai',
          confidence: Math.max(40, 100 - sourceIndicators * 20)
        });
      }
    });

    const sourcePercentage = sentences.length > 0 ? Math.round((sourceCount / sentences.length) * 100) : 0;
    const aiPercentage = 100 - sourcePercentage;

    return { sourceScore: sourcePercentage, aiScore: aiPercentage, highlights };
  };

  const analyzeText = (text: string): PDFAnalysis => {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const pageCount = Math.ceil(wordCount / 250);
    const language = detectLanguage(text);
    const readabilityScore = calculateReadabilityScore(text);
    const complexity: 'low' | 'medium' | 'high' =
      readabilityScore > 70 ? 'low' : readabilityScore > 50 ? 'medium' : 'high';
    const keyPhrases = extractKeyPhrases(text);
    const { sourceScore, aiScore, highlights } = analyzeProcedence(text);

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
      aiScore,
      sourceScore,
      highlights,
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
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700">PDF procesado correctamente</p>
                </div>

                {/* Procedence Analysis Banner */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    Los resultados son estimaciones probabilísticas basadas en la densidad de referencias y patrones de lenguaje.
                  </p>
                </div>

                {/* Procedence Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Metrics */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Análisis de Procedencia</h3>

                      {/* Donut Chart */}
                      <div className="flex justify-center mb-6">
                        <ResponsiveContainer width={200} height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Basado en Fuentes', value: pdfAnalysis.sourceScore },
                                { name: 'Generado por IA', value: pdfAnalysis.aiScore }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#f97316" />
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Score Indicators */}
                      <div className="space-y-3">
                        <div
                          className="cursor-pointer p-3 bg-white rounded-lg border border-green-200 hover:shadow-md transition-all"
                          onMouseEnter={() => setShowTooltip('source')}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-gray-900">Basado en Fuentes</span>
                            </div>
                            <span className="text-2xl font-bold text-green-600">{pdfAnalysis.sourceScore}%</span>
                          </div>
                          {showTooltip === 'source' && (
                            <div className="text-xs text-gray-600 mt-2 p-2 bg-green-50 rounded">
                              Detectadas referencias bibliográficas, enlaces y datos verificables en el contenido.
                            </div>
                          )}
                        </div>

                        <div
                          className="cursor-pointer p-3 bg-white rounded-lg border border-orange-200 hover:shadow-md transition-all"
                          onMouseEnter={() => setShowTooltip('ai')}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-semibold text-gray-900">Generado por IA</span>
                            </div>
                            <span className="text-2xl font-bold text-orange-600">{pdfAnalysis.aiScore}%</span>
                          </div>
                          {showTooltip === 'ai' && (
                            <div className="text-xs text-gray-600 mt-2 p-2 bg-orange-50 rounded">
                              Contenido con patrones genéricos y falta de referencias específicas.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase">Filtrar Resaltado:</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHighlightFilter('all')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            highlightFilter === 'all'
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setHighlightFilter('source')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            highlightFilter === 'source'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          Fuentes
                        </button>
                        <button
                          onClick={() => setHighlightFilter('ai')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            highlightFilter === 'ai'
                              ? 'bg-orange-600 text-white'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          IA
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Highlights */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-96 overflow-y-auto">
                      <h4 className="font-semibold text-gray-900 mb-4 sticky top-0 bg-white pb-2">Contenido Resaltado</h4>
                      <div className="space-y-3">
                        {pdfAnalysis.highlights
                          .filter(h => highlightFilter === 'all' || h.type === highlightFilter)
                          .slice(0, 15)
                          .map((highlight, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-l-4 transition-colors ${
                                highlight.type === 'source'
                                  ? 'bg-green-50 border-green-400'
                                  : 'bg-orange-50 border-orange-400'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {highlight.type === 'source' ? (
                                    <BookOpen className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <Brain className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-xs font-semibold ${
                                    highlight.type === 'source'
                                      ? 'text-green-700'
                                      : 'text-orange-700'
                                  }`}>
                                    {highlight.type === 'source' ? 'Basado en Fuentes' : 'Patrón IA'}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {highlight.confidence}% confianza
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {highlight.text}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
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
