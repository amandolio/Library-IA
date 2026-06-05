import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, FileText, Search,
  BarChart3, Globe, Eye, Brain, Database, ExternalLink, Copy,
  Layers, EggFried as Verified, AlertCircle, BookOpen, Upload, X,
  History, Server, Trash2, Clock, Fingerprint, Zap, Target,
} from 'lucide-react';
import { advancedPlagiarismService, AnalysisResult, RepositoryMatch } from '../services/advancedPlagiarismService';
import { createClient } from '@supabase/supabase-js';

interface PlagiarismSource {
  id: string;
  title: string;
  url: string;
  type: 'academic' | 'web' | 'book' | 'journal';
  content: string;
  language: 'es' | 'en';
  isVerified: boolean;
  doi?: string;
  isbn?: string;
}

const plagiarismSources: PlagiarismSource[] = [
  {
    id: 'source-1',
    title: 'Inteligencia Artificial: Una Guía Moderna',
    url: 'https://aima.cs.berkeley.edu/',
    type: 'book',
    language: 'es',
    content: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Esto incluye el aprendizaje automático, el procesamiento del lenguaje natural, la visión por computadora y la robótica.',
    isVerified: true,
    isbn: '978-0134610993'
  },
  {
    id: 'source-2',
    title: 'Machine Learning Fundamentals',
    url: 'https://www.microsoft.com/en-us/research/people/cmbishop/',
    type: 'academic',
    language: 'en',
    content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.',
    isVerified: true,
    doi: '10.1007/978-0-387-45528-0'
  },
  {
    id: 'source-3',
    title: 'Ciberseguridad en la Era Digital',
    url: 'https://www.pearson.com/store/p/computer-security-principles-and-practice/',
    type: 'journal',
    language: 'es',
    content: 'La ciberseguridad es la práctica de proteger sistemas, redes y programas de ataques digitales. Estos ataques cibernéticos generalmente tienen como objetivo acceder, cambiar o destruir información confidencial, extorsionar dinero de los usuarios o interrumpir procesos comerciales normales.',
    isVerified: true,
    isbn: '978-0134794105'
  },
  {
    id: 'source-4',
    title: 'Data Science and Analytics',
    url: 'https://wesmckinney.com/book/',
    type: 'web',
    language: 'en',
    content: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. Data science is related to data mining, machine learning and big data.',
    isVerified: true,
    isbn: '978-1491957660'
  },
  {
    id: 'source-5',
    title: 'Desarrollo de Software Moderno',
    url: 'https://example.com/software-dev',
    type: 'book',
    language: 'es',
    content: 'El desarrollo de software moderno requiere el uso de metodologías ágiles, frameworks actualizados y herramientas de colaboración. Los desarrolladores deben mantenerse al día con las últimas tecnologías y mejores prácticas de la industria.',
    isVerified: false
  }
];

const sampleTexts = [
  {
    title: 'Texto sobre IA (Español) - Verificable',
    text: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Los algoritmos de machine learning permiten a las máquinas aprender de los datos sin ser programadas explícitamente.',
    language: 'es' as const,
    hasVerifiableContent: true
  },
  {
    title: 'AI Text (English) - Verificable',
    text: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.',
    language: 'en' as const,
    hasVerifiableContent: true
  },
  {
    title: 'Texto Original (Español) - No Verificable',
    text: 'En el contexto actual de la transformación digital, las organizaciones necesitan implementar estrategias innovadoras que les permitan adaptarse a los cambios tecnológicos y mantener su competitividad en el mercado global.',
    language: 'es' as const,
    hasVerifiableContent: false
  },
  {
    title: 'Original Text (English) - No Verificable',
    text: 'The rapid advancement of quantum computing technologies presents unprecedented opportunities for solving complex computational problems that are currently intractable with classical computers.',
    language: 'en' as const,
    hasVerifiableContent: false
  }
];

export function PlagiarismDetectionPanel() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [repoResults, setRepoResults] = useState<RepositoryMatch[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'es' | 'en'>('auto');
  const [sensitivityLevel, setSensitivityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [sourcesToCheck, setSourcesToCheck] = useState<string[]>(['academic', 'web', 'books']);
  const [showDetailedMatches, setShowDetailedMatches] = useState(false);
  const [analysisMethod, setAnalysisMethod] = useState<'winnowing' | 'ngram' | 'hybrid'>('hybrid');
  const [checkRepositories, setCheckRepositories] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState('');
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      sb.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
        if (user) loadHistory(user.id);
      });
    }
  }, []);

  const loadHistory = async (userId: string) => {
    const h = await advancedPlagiarismService.getAnalysisHistory(userId);
    setAnalysisHistory(h);
  };

  const detectLanguage = (text: string): 'es' | 'en' | 'mixed' => {
    const esW = ['la','el','de','que','y','en','un','es','se','no','por','con','para','del','las','una','los','como','pero','sus','fue','ser','está','desde','hasta','más','muy','todo','también','puede','sistema','información','desarrollo'];
    const enW = ['the','be','to','of','and','a','in','that','have','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us'];
    const words = text.toLowerCase().split(/\s+/);
    let sc = 0, ec = 0;
    words.forEach(w => { if (esW.includes(w)) sc++; if (enW.includes(w)) ec++; });
    if (sc > ec * 1.5) return 'es';
    if (ec > sc * 1.5) return 'en';
    return 'mixed';
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
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
      setPdfText(text);
      setInputText(text);
    } catch {
      setPdfError('Error al procesar el PDF. Intenta con otro archivo.');
      setPdfFile(null);
      setPdfText('');
    } finally {
      setExtractingPdf(false);
    }
  };

  const clearPdf = () => {
    setPdfFile(null);
    setPdfText('');
    setPdfError('');
    if (inputText === pdfText) setInputText('');
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setRepoResults([]);
    setSaveStatus('idle');

    try {
      const detectedLang = selectedLanguage === 'auto' ? detectLanguage(inputText) : (selectedLanguage as 'es' | 'en');

      const relevantSources = plagiarismSources.filter(s => {
        const langOk = detectedLang === 'mixed' || s.language === detectedLang;
        const typeOk = sourcesToCheck.includes(s.type === 'academic' ? 'academic' : s.type === 'book' ? 'books' : 'web');
        return langOk && typeOk;
      });

      const sourceTexts = relevantSources.map(s => ({
        id: s.id,
        title: s.title,
        content: s.content,
        url: s.url,
        type: s.type,
        isVerified: s.isVerified,
        doi: s.doi,
      }));

      const analysisResult = await advancedPlagiarismService.analyzeText(
        inputText, sourceTexts, detectedLang, analysisMethod
      );

      // Apply sensitivity thresholds
      const thresholds = { low: { warning: 40, high: 70 }, medium: { warning: 25, high: 50 }, high: { warning: 15, high: 30 } };
      const th = thresholds[sensitivityLevel];
      if (analysisResult.overallSimilarity >= th.high) analysisResult.status = 'high-risk';
      else if (analysisResult.overallSimilarity >= th.warning) analysisResult.status = 'warning';
      else analysisResult.status = 'safe';

      setResult(analysisResult);

      // Check repositories via Edge Function
      if (checkRepositories) {
        const repos = await advancedPlagiarismService.checkRepositories(inputText, detectedLang);
        setRepoResults(repos);
      }

      // Save to database
      if (currentUser) {
        setSaveStatus('saving');
        const savedId = await advancedPlagiarismService.saveAnalysis(
          currentUser.id,
          pdfFile?.name || 'Análisis de texto',
          inputText,
          analysisResult
        );
        setSaveStatus(savedId ? 'saved' : 'error');
        if (savedId) loadHistory(currentUser.id);
      }
    } catch (err) {
      console.error('Error analyzing plagiarism:', err);
      setSaveStatus('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!currentUser) return;
    const ok = await advancedPlagiarismService.deleteAnalysis(analysisId);
    if (ok) loadHistory(currentUser.id);
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
      case 'book': return <BookOpen className="h-4 w-4" />;
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

  const methodLabel = (m: string) => {
    switch (m) {
      case 'winnowing': return 'Winnowing';
      case 'ngram': return 'N-gramas';
      case 'hybrid': return 'Híbrido';
      default: return m;
    }
  };

  const repoIcon = (source: string) => {
    switch (source) {
      case 'CrossRef': return <Database className="h-4 w-4 text-blue-600" />;
      case 'Semantic Scholar': return <Brain className="h-4 w-4 text-green-600" />;
      case 'arXiv': return <FileText className="h-4 w-4 text-orange-600" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Detección de Plagios Avanzada</h2>
        </div>
        <p className="text-red-100 text-lg">
          Algoritmos Winnowing y N-gramas con verificación en repositorios académicos (CrossRef, Semantic Scholar, arXiv)
        </p>
        <div className="flex items-center space-x-4 mt-4 text-sm text-red-200">
          <span className="flex items-center"><Fingerprint className="h-4 w-4 mr-1" /> Winnowing</span>
          <span className="flex items-center"><Layers className="h-4 w-4 mr-1" /> N-gramas</span>
          <span className="flex items-center"><Server className="h-4 w-4 mr-1" /> Repositorios en vivo</span>
          <span className="flex items-center"><Database className="h-4 w-4 mr-1" /> Registro en BD</span>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-orange-500" />
          Configuración del Análisis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Idioma del Texto
            </label>
            <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500">
              <option value="auto">Detección Automática</option>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Fingerprint className="inline h-4 w-4 mr-1" />
              Algoritmo de Análisis
            </label>
            <select value={analysisMethod} onChange={e => setAnalysisMethod(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500">
              <option value="winnowing">Winnowing (Rápido)</option>
              <option value="ngram">N-gramas (Preciso)</option>
              <option value="hybrid">Híbrido (Balanceado)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {analysisMethod === 'winnowing' && 'Huella digital compacta, resistente a ediciones menores'}
              {analysisMethod === 'ngram' && 'Comparación detallada por caracteres y palabras'}
              {analysisMethod === 'hybrid' && 'Combina Winnowing + N-gramas para máxima precisión'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              Nivel de Sensibilidad
            </label>
            <select value={sensitivityLevel} onChange={e => setSensitivityLevel(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500">
              <option value="low">Bajo (Menos estricto)</option>
              <option value="medium">Medio (Recomendado)</option>
              <option value="high">Alto (Más estricto)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Server className="inline h-4 w-4 mr-1" />
              Verificación de Repositorios
            </label>
            <div className="flex items-center space-x-2 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checkRepositories} onChange={e => setCheckRepositories(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
              <span className="text-sm text-gray-600">{checkRepositories ? 'Habilitado' : 'Deshabilitado'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">CrossRef, Semantic Scholar, arXiv</p>
          </div>
        </div>

        {/* Source type checkboxes */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Database className="inline h-4 w-4 mr-1" />
            Fuentes locales a verificar
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'academic', label: 'Artículos Académicos' },
              { id: 'books', label: 'Libros y Textos' },
              { id: 'web', label: 'Contenido Web' }
            ].map(source => (
              <label key={source.id} className="flex items-center">
                <input type="checkbox" checked={sourcesToCheck.includes(source.id)}
                  onChange={e => setSourcesToCheck(e.target.checked
                    ? [...sourcesToCheck, source.id]
                    : sourcesToCheck.filter(s => s !== source.id))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-700">{source.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Texto o PDF a Analizar
          </h3>
          {currentUser && (
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <History className="h-4 w-4" />
              <span>Historial ({analysisHistory.length})</span>
            </button>
          )}
        </div>

        {/* Analysis History */}
        {showHistory && analysisHistory.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <History className="h-4 w-4 mr-2 text-gray-600" />
              Análisis Anteriores
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analysisHistory.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{h.document_title}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{methodLabel(h.analysis_method)}</span>
                      <span className={h.status === 'safe' ? 'text-green-600' : h.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                        {Math.round(h.overall_similarity)}%
                      </span>
                      <span>{h.total_words} palabras</span>
                      <span>{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAnalysis(h.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Upload */}
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
                <button onClick={clearPdf} className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {pdfText && <p className="text-sm text-green-700 bg-green-50 p-2 rounded">PDF procesado correctamente</p>}
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{extractingPdf ? 'Procesando PDF...' : 'Arrastra un PDF aqui o haz clic para cargar'}</p>
                <p className="text-sm text-gray-600 mt-1">Maximo 10 MB - Formato PDF</p>
              </div>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={extractingPdf} className="hidden" />
            </label>
          )}
          {pdfError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{pdfError}</p>
            </div>
          )}
        </div>

        {/* Sample Texts */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">O elige textos de ejemplo:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleTexts.map((sample, i) => (
              <button key={i} onClick={() => { setInputText(sample.text); clearPdf(); }}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-900">{sample.title}</h5>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${sample.language === 'es' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {sample.language === 'es' ? 'ES' : 'EN'}
                    </span>
                    {sample.hasVerifiableContent && <Verified className="h-3 w-3 text-green-600" />}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{sample.text}</p>
              </button>
            ))}
          </div>
        </div>

        <textarea value={inputText} onChange={e => setInputText(e.target.value)}
          placeholder="Introduce el texto a analizar para detectar plagios. Puedes escribir en espanol o ingles..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {inputText.length} caracteres | {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras
            {inputText && (
              <span className="ml-2">| Idioma: <strong>{detectLanguage(inputText) === 'es' ? 'Espanol' : detectLanguage(inputText) === 'en' ? 'English' : 'Mixto'}</strong></span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {saveStatus === 'saved' && <span className="text-xs text-green-600 flex items-center"><CheckCircle className="h-3 w-3 mr-1" />Guardado en BD</span>}
            {saveStatus === 'saving' && <span className="text-xs text-blue-600 flex items-center"><Clock className="h-3 w-3 mr-1 animate-spin" />Guardando...</span>}
            {saveStatus === 'error' && <span className="text-xs text-red-600">Error al guardar</span>}
            <button onClick={handleAnalyze} disabled={!inputText.trim() || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isAnalyzing ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Analizando...</span></>
              ) : (
                <><Search className="h-4 w-4" /><span>Detectar Plagios</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analizando con {methodLabel(analysisMethod)}...</h3>
          <p className="text-gray-600 mb-4">
            Comparando con {sourcesToCheck.length} tipos de fuentes{checkRepositories ? ' + repositorios academicos' : ''}
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center"><Fingerprint className="h-4 w-4 mr-1" />Calculando huella digital</div>
            <div className="flex items-center"><Layers className="h-4 w-4 mr-1" />Comparando N-gramas</div>
            <div className="flex items-center"><Database className="h-4 w-4 mr-1" />Buscando fuentes</div>
            {checkRepositories && <div className="flex items-center"><Server className="h-4 w-4 mr-1" />Consultando repositorios</div>}
          </div>
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && result && (
        <div className="space-y-6">
          {/* Overall Results */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
              Resultados del Analisis - {methodLabel(result.analysisMethod)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Status */}
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full border-4 flex items-center justify-center mb-3 ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </div>
                <h4 className="font-semibold text-gray-900">{getStatusLabel(result.status)}</h4>
                <p className="text-2xl font-bold mt-1" style={{
                  color: result.status === 'safe' ? '#059669' : result.status === 'warning' ? '#D97706' : '#DC2626'
                }}>
                  {Math.round(result.overallSimilarity)}%
                </p>
                <p className="text-sm text-gray-600">Similitud General</p>
              </div>

              {/* Algorithm Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Fingerprint className="h-4 w-4 mr-2 text-blue-600" />
                  Detalles del Algoritmo
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metodo:</span>
                    <span className="font-semibold text-blue-600">{methodLabel(result.analysisMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Huella Winnowing:</span>
                    <span className="font-mono text-xs" title={result.winnowingHash}>{result.winnowingHash.substring(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">N-gramas (3-char):</span>
                    <span className="font-semibold">{result.ngram3Count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">N-gramas (5-char):</span>
                    <span className="font-semibold">{result.ngram5Count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo:</span>
                    <span className="font-semibold">{result.analysisTimeMs}ms</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Metricas</h4>
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
                    <span className="text-gray-600">Idioma detectado:</span>
                    <span className="font-semibold">{result.language === 'es' ? 'Espanol' : result.language === 'en' ? 'English' : 'Mixto'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coincidencias:</span>
                    <span className="font-semibold">{result.matches.length}</span>
                  </div>
                </div>
              </div>

              {/* Matches Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Resumen</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Similitud maxima:</span>
                    <span className="font-semibold text-red-600">
                      {result.matches.length > 0 ? Math.round(result.matches[0].similarity) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuentes verificadas:</span>
                    <span className="font-semibold text-green-600">{result.matches.filter(m => m.isVerified).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuentes academicas:</span>
                    <span className="font-semibold">{result.matches.filter(m => m.sourceType === 'academic').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guardado en BD:</span>
                    <span className={`font-semibold ${saveStatus === 'saved' ? 'text-green-600' : saveStatus === 'error' ? 'text-red-600' : 'text-gray-400'}`}>
                      {saveStatus === 'saved' ? 'Si' : saveStatus === 'error' ? 'Error' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Repository Results */}
          {repoResults.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-600" />
                Resultados de Repositorios Academicos
              </h3>
              <div className="space-y-4">
                {repoResults.map((repo, i) => (
                  <div key={i} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-3">
                      {repoIcon(repo.source)}
                      <h4 className="font-semibold text-blue-900">{repo.source}</h4>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{repo.matches.length} resultados</span>
                    </div>
                    <div className="space-y-2">
                      {repo.matches.map((match, j) => (
                        <div key={j} className="p-3 bg-white rounded border border-blue-200 flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm truncate">{match.title}</h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{match.similarity}% similitud</span>
                              {match.doi && <span className="text-xs text-blue-600">DOI: {match.doi}</span>}
                            </div>
                          </div>
                          {match.url && (
                            <a href={match.url} target="_blank" rel="noopener noreferrer"
                              className="ml-2 p-1 text-blue-500 hover:text-blue-700 rounded">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Matches */}
          {result.matches.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-orange-600" />
                  Coincidencias Detalladas ({result.matches.length})
                </h3>
                <button onClick={() => setShowDetailedMatches(!showDetailedMatches)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
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
                          match.similarity >= 70 ? 'bg-red-500' : match.similarity >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            {getSourceTypeIcon(match.sourceType)}
                            <span className="ml-2">{match.sourceTitle}</span>
                            {match.isVerified && <Verified className="h-4 w-4 ml-2 text-green-600" title="Fuente verificada" />}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center"><Layers className="h-3 w-3 mr-1" />{getSourceTypeLabel(match.sourceType)}</span>
                            <span className="font-semibold" style={{
                              color: match.similarity >= 70 ? '#DC2626' : match.similarity >= 40 ? '#D97706' : '#059669'
                            }}>{Math.round(match.similarity)}% similitud</span>
                            {match.isVerified && (
                              <span className="flex items-center text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Verificado ({match.verificationScore}%)</span>
                            )}
                            {match.doi && <span className="text-blue-600">DOI: {match.doi}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => navigator.clipboard.writeText(match.matchedText)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Copiar">
                          <Copy className="h-4 w-4" />
                        </button>
                        <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Ver fuente">
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
                          <span>Posicion: {match.startPosition}-{match.endPosition}</span>
                          {match.isVerified && <span className="text-green-600 font-medium">Fuente verificada academicamente</span>}
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Deteccion de Plagios Avanzada</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Analiza textos con algoritmos Winnowing y N-gramas, verifica contra repositorios academicos en tiempo real, y guarda un registro de cada analisis en la base de datos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-red-50 rounded-lg">
              <Fingerprint className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Winnowing</h4>
              <p className="text-sm text-gray-600">Huella digital compacta resistente a ediciones</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Layers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">N-gramas</h4>
              <p className="text-sm text-gray-600">Comparacion detallada por caracteres y palabras</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Repositorios</h4>
              <p className="text-sm text-gray-600">CrossRef, Semantic Scholar, arXiv en vivo</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Database className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Registro en BD</h4>
              <p className="text-sm text-gray-600">Historial completo de cada analisis</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
