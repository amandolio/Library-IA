import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileText,
  Search,
  BarChart3,
  Clock,
  Globe,
  Eye,
  Download,
  RefreshCw,
  Zap,
  Target,
  Activity,
  Brain,
  Database,
  ExternalLink,
  Copy,
  Layers
} from 'lucide-react';

interface PlagiarismResult {
  overallSimilarity: number;
  status: 'safe' | 'warning' | 'high-risk';
  matches: PlagiarismMatch[];
  analysisTime: number;
  wordsAnalyzed: number;
  sourcesChecked: number;
  language: 'es' | 'en' | 'mixed';
}

interface PlagiarismMatch {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: 'academic' | 'web' | 'book' | 'journal';
  similarity: number;
  matchedText: string;
  originalText: string;
  startPosition: number;
  endPosition: number;
  confidence: number;
}

interface PlagiarismSource {
  id: string;
  title: string;
  url: string;
  type: 'academic' | 'web' | 'book' | 'journal';
  content: string;
  language: 'es' | 'en';
  lastUpdated: Date;
}

export function PlagiarismDetectionPanel() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'es' | 'en'>('auto');
  const [sensitivityLevel, setSensitivityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [sourcesToCheck, setSourcesToCheck] = useState<string[]>(['academic', 'web', 'books']);
  const [showDetailedMatches, setShowDetailedMatches] = useState(false);

  // Fuentes de datos simuladas para detección de plagios
  const plagiarismSources: PlagiarismSource[] = [
    {
      id: 'source-1',
      title: 'Inteligencia Artificial: Una Guía Moderna',
      url: 'https://example.com/ai-guide',
      type: 'book',
      language: 'es',
      content: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Esto incluye el aprendizaje automático, el procesamiento del lenguaje natural, la visión por computadora y la robótica.',
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: 'source-2',
      title: 'Machine Learning Fundamentals',
      url: 'https://example.com/ml-fundamentals',
      type: 'academic',
      language: 'en',
      content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.',
      lastUpdated: new Date('2024-02-10')
    },
    {
      id: 'source-3',
      title: 'Ciberseguridad en la Era Digital',
      url: 'https://example.com/cybersecurity',
      type: 'journal',
      language: 'es',
      content: 'La ciberseguridad es la práctica de proteger sistemas, redes y programas de ataques digitales. Estos ataques cibernéticos generalmente tienen como objetivo acceder, cambiar o destruir información confidencial, extorsionar dinero de los usuarios o interrumpir procesos comerciales normales.',
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: 'source-4',
      title: 'Data Science and Analytics',
      url: 'https://example.com/data-science',
      type: 'web',
      language: 'en',
      content: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. Data science is related to data mining, machine learning and big data.',
      lastUpdated: new Date('2024-02-05')
    },
    {
      id: 'source-5',
      title: 'Desarrollo de Software Moderno',
      url: 'https://example.com/software-dev',
      type: 'book',
      language: 'es',
      content: 'El desarrollo de software moderno requiere el uso de metodologías ágiles, frameworks actualizados y herramientas de colaboración. Los desarrolladores deben mantenerse al día con las últimas tecnologías y mejores prácticas de la industria.',
      lastUpdated: new Date('2024-01-30')
    }
  ];

  const sampleTexts = [
    {
      title: 'Texto sobre IA (Español)',
      text: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Los algoritmos de machine learning permiten a las máquinas aprender de los datos sin ser programadas explícitamente.',
      language: 'es' as const
    },
    {
      title: 'AI Text (English)',
      text: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.',
      language: 'en' as const
    },
    {
      title: 'Texto Original (Español)',
      text: 'En el contexto actual de la transformación digital, las organizaciones necesitan implementar estrategias innovadoras que les permitan adaptarse a los cambios tecnológicos y mantener su competitividad en el mercado global.',
      language: 'es' as const
    },
    {
      title: 'Original Text (English)',
      text: 'The rapid advancement of quantum computing technologies presents unprecedented opportunities for solving complex computational problems that are currently intractable with classical computers.',
      language: 'en' as const
    }
  ];

  const detectLanguage = (text: string): 'es' | 'en' | 'mixed' => {
    const spanishWords = ['la', 'el', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'del', 'las', 'una', 'los', 'como', 'pero', 'sus', 'han', 'fue', 'ser', 'está', 'son', 'desde', 'hasta', 'más', 'muy', 'todo', 'también', 'puede', 'hacer', 'tiempo', 'sistema', 'información', 'desarrollo', 'tecnología'];
    const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];
    
    const words = text.toLowerCase().split(/\s+/);
    let spanishCount = 0;
    let englishCount = 0;
    
    words.forEach(word => {
      if (spanishWords.includes(word)) spanishCount++;
      if (englishWords.includes(word)) englishCount++;
    });
    
    if (spanishCount > englishCount * 1.5) return 'es';
    if (englishCount > spanishCount * 1.5) return 'en';
    return 'mixed';
  };

  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  };

  const findMatches = (inputText: string, sources: PlagiarismSource[]): PlagiarismMatch[] => {
    const matches: PlagiarismMatch[] = [];
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach((sentence, index) => {
      sources.forEach(source => {
        const similarity = calculateSimilarity(sentence.trim(), source.content);
        
        if (similarity > 0.3) { // Umbral de similitud
          matches.push({
            id: `match-${index}-${source.id}`,
            sourceTitle: source.title,
            sourceUrl: source.url,
            sourceType: source.type,
            similarity: similarity * 100,
            matchedText: sentence.trim(),
            originalText: source.content.substring(0, 200) + '...',
            startPosition: inputText.indexOf(sentence),
            endPosition: inputText.indexOf(sentence) + sentence.length,
            confidence: similarity * 100
          });
        }
      });
    });
    
    return matches.sort((a, b) => b.similarity - a.similarity);
  };

  const analyzePlagiarism = async (): Promise<PlagiarismResult> => {
    const detectedLanguage = selectedLanguage === 'auto' ? detectLanguage(inputText) : selectedLanguage as 'es' | 'en';
    
    // Filtrar fuentes según el idioma detectado y tipos seleccionados
    const relevantSources = plagiarismSources.filter(source => {
      const languageMatch = detectedLanguage === 'mixed' || source.language === detectedLanguage;
      const typeMatch = sourcesToCheck.includes(source.type === 'academic' ? 'academic' : 
                                               source.type === 'book' ? 'books' : 'web');
      return languageMatch && typeMatch;
    });
    
    const matches = findMatches(inputText, relevantSources);
    
    // Calcular similitud general
    const overallSimilarity = matches.length > 0 
      ? matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length 
      : 0;
    
    // Determinar estado según nivel de sensibilidad
    let status: 'safe' | 'warning' | 'high-risk' = 'safe';
    const thresholds = {
      low: { warning: 40, highRisk: 70 },
      medium: { warning: 25, highRisk: 50 },
      high: { warning: 15, highRisk: 30 }
    };
    
    const threshold = thresholds[sensitivityLevel];
    if (overallSimilarity >= threshold.highRisk) status = 'high-risk';
    else if (overallSimilarity >= threshold.warning) status = 'warning';
    
    return {
      overallSimilarity,
      status,
      matches: matches.slice(0, 10), // Limitar a 10 coincidencias principales
      analysisTime: Math.random() * 2000 + 1000, // Simular tiempo de análisis
      wordsAnalyzed: inputText.split(/\s+/).length,
      sourcesChecked: relevantSources.length,
      language: detectedLanguage
    };
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simular tiempo de análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      const analysisResult = await analyzePlagiarism();
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing plagiarism:', error);
    }
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high-risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'high-risk': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'safe': return 'Texto Original';
      case 'warning': return 'Similitud Moderada';
      case 'high-risk': return 'Alto Riesgo de Plagio';
      default: return 'Sin Analizar';
    }
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <Brain className="h-4 w-4" />;
      case 'book': return <FileText className="h-4 w-4" />;
      case 'journal': return <Database className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'academic': return 'Académico';
      case 'book': return 'Libro';
      case 'journal': return 'Revista';
      case 'web': return 'Web';
      default: return type;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Sistema de Detección de Plagios</h2>
        </div>
        <p className="text-red-100 text-lg">
          Detecta similitudes y posibles plagios en textos académicos con soporte multiidioma (Español/English)
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-orange-500" />
          Configuración del Análisis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Idioma del Texto
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="auto">Detección Automática</option>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Sensitivity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              Nivel de Sensibilidad
            </label>
            <select
              value={sensitivityLevel}
              onChange={(e) => setSensitivityLevel(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="low">Bajo (Menos estricto)</option>
              <option value="medium">Medio (Recomendado)</option>
              <option value="high">Alto (Más estricto)</option>
            </select>
          </div>

          {/* Sources to Check */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Database className="inline h-4 w-4 mr-1" />
              Fuentes a Verificar
            </label>
            <div className="space-y-2">
              {[
                { id: 'academic', label: 'Artículos Académicos' },
                { id: 'books', label: 'Libros y Textos' },
                { id: 'web', label: 'Contenido Web' }
              ].map((source) => (
                <label key={source.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sourcesToCheck.includes(source.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSourcesToCheck([...sourcesToCheck, source.id]);
                      } else {
                        setSourcesToCheck(sourcesToCheck.filter(s => s !== source.id));
                      }
                    }}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{source.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          Texto a Analizar
        </h3>
        
        {/* Sample Texts */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Textos de ejemplo:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setInputText(sample.text)}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-900">{sample.title}</h5>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    sample.language === 'es' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {sample.language === 'es' ? 'ES' : 'EN'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{sample.text}</p>
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Introduce el texto que deseas analizar para detectar posibles plagios. Puedes escribir en español o inglés..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {inputText.length} caracteres | {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras
            {inputText && (
              <span className="ml-2">
                | Idioma detectado: <strong>
                  {detectLanguage(inputText) === 'es' ? 'Español' : 
                   detectLanguage(inputText) === 'en' ? 'English' : 'Mixto'}
                </strong>
              </span>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Detectar Plagios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Analizando Texto para Detectar Plagios...
          </h3>
          <p className="text-gray-600 mb-4">
            Comparando con {sourcesToCheck.length} tipos de fuentes en múltiples idiomas
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              Procesando texto
            </div>
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-1" />
              Comparando fuentes
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Calculando similitudes
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && result && (
        <div className="space-y-6">
          {/* Overall Results */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Resultados del Análisis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Status */}
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full border-4 flex items-center justify-center mb-3 ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </div>
                <h4 className="font-semibold text-gray-900">{getStatusLabel(result.status)}</h4>
                <p className="text-2xl font-bold mt-1" style={{
                  color: result.status === 'safe' ? '#059669' : 
                         result.status === 'warning' ? '#D97706' : '#DC2626'
                }}>
                  {Math.round(result.overallSimilarity)}%
                </p>
                <p className="text-sm text-gray-600">Similitud General</p>
              </div>

              {/* Analysis Metrics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Métricas de Análisis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Palabras analizadas:</span>
                    <span className="font-semibold">{result.wordsAnalyzed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuentes verificadas:</span>
                    <span className="font-semibold">{result.sourcesChecked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo de análisis:</span>
                    <span className="font-semibold">{Math.round(result.analysisTime)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Idioma detectado:</span>
                    <span className="font-semibold">
                      {result.language === 'es' ? 'Español' : 
                       result.language === 'en' ? 'English' : 'Mixto'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Matches Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Coincidencias Encontradas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de coincidencias:</span>
                    <span className="font-semibold">{result.matches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Similitud máxima:</span>
                    <span className="font-semibold text-red-600">
                      {result.matches.length > 0 ? Math.round(result.matches[0].similarity) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuentes académicas:</span>
                    <span className="font-semibold">
                      {result.matches.filter(m => m.sourceType === 'academic').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Libros y textos:</span>
                    <span className="font-semibold">
                      {result.matches.filter(m => m.sourceType === 'book').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Recomendaciones</h4>
                <div className="space-y-2 text-sm">
                  {result.status === 'safe' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        ✓ El texto parece ser original. No se detectaron similitudes significativas.
                      </p>
                    </div>
                  )}
                  {result.status === 'warning' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">
                        ⚠ Se detectaron algunas similitudes. Revisa las coincidencias y cita las fuentes apropiadamente.
                      </p>
                    </div>
                  )}
                  {result.status === 'high-risk' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">
                        ⚠ Alto riesgo de plagio detectado. Revisa y reescribe las secciones similares.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Matches */}
          {result.matches.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-orange-600" />
                  Coincidencias Detalladas ({result.matches.length})
                </h3>
                <button
                  onClick={() => setShowDetailedMatches(!showDetailedMatches)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>{showDetailedMatches ? 'Ocultar Detalles' : 'Ver Detalles'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {result.matches.map((match, index) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          match.similarity >= 70 ? 'bg-red-500' :
                          match.similarity >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            {getSourceTypeIcon(match.sourceType)}
                            <span className="ml-2">{match.sourceTitle}</span>
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Layers className="h-3 w-3 mr-1" />
                              {getSourceTypeLabel(match.sourceType)}
                            </span>
                            <span className="font-semibold" style={{
                              color: match.similarity >= 70 ? '#DC2626' :
                                     match.similarity >= 40 ? '#D97706' : '#059669'
                            }}>
                              {Math.round(match.similarity)}% similitud
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(match.matchedText)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copiar texto"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <a
                          href={match.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver fuente"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {showDetailedMatches && (
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Texto Coincidente:</h5>
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">"{match.matchedText}"</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Texto Original de la Fuente:</h5>
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-700 text-sm">"{match.originalText}"</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Confianza: {Math.round(match.confidence)}%</span>
                          <span>Posición: {match.startPosition}-{match.endPosition}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!result && !isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sistema de Detección de Plagios Avanzado
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Analiza textos académicos para detectar similitudes y posibles plagios. 
            Compatible con español e inglés, con múltiples fuentes de verificación.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-red-50 rounded-lg">
              <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Detección Precisa</h4>
              <p className="text-sm text-gray-600">Algoritmos avanzados de comparación textual</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Multiidioma</h4>
              <p className="text-sm text-gray-600">Soporte para español e inglés</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Múltiples Fuentes</h4>
              <p className="text-sm text-gray-600">Académicas, libros y contenido web</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Análisis Detallado</h4>
              <p className="text-sm text-gray-600">Reportes completos con recomendaciones</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}