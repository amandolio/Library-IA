import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Search, BarChart3, Globe, Eye, Brain, Database, ExternalLink, Copy, Layers, EggFried as Verified, AlertCircle, BookOpen, Upload, X, History, Server, Trash2, Clock, Fingerprint, Zap, Target, TrendingUp, PieChart, FileWarning, MessageSquareText, Link2, LayoutGrid as Layout, Table2, FlaskConical, UserX } from 'lucide-react';
import { advancedPlagiarismDetector, PlagiarismReport, PlagiarismMatch, PlagiarismType } from '../services/advancedPlagiarismDetector';
import { createClient } from '@supabase/supabase-js';

interface SourceDocument {
  id: string;
  title: string;
  author: string;
  year: number;
  content: string;
  url?: string;
  doi?: string;
  language: string;
  type: 'academic' | 'book' | 'web' | 'journal';
}

interface RepoStatus {
  name: string;
  status: 'pending' | 'ok' | 'error';
  count: number;
  latencyMs?: number;
}

const sourceDocuments: SourceDocument[] = [
  {
    id: 'source-1',
    title: 'Inteligencia Artificial: Una Guía Moderna',
    author: 'Stuart Russell, Peter Norvig',
    year: 2020,
    content: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Esto incluye el aprendizaje automático, el procesamiento del lenguaje natural, la visión por computadora y la robótica. Los sistemas de IA modernos utilizan redes neuronales profundas para aprender representaciones jerárquicas de datos.',
    url: 'https://aima.cs.berkeley.edu/',
    doi: '10.1038/nature14539',
    language: 'es',
    type: 'book'
  },
  {
    id: 'source-2',
    title: 'Machine Learning Fundamentals',
    author: 'Christopher Bishop',
    year: 2019,
    content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves. The methodology involves training algorithms on datasets to identify patterns.',
    url: 'https://www.microsoft.com/en-us/research/people/cmbishop/',
    doi: '10.1007/978-0-387-45528-0',
    language: 'en',
    type: 'academic'
  },
  {
    id: 'source-3',
    title: 'Ciberseguridad en la Era Digital',
    author: 'William Stallings, Lawrie Brown',
    year: 2021,
    content: 'La ciberseguridad es la práctica de proteger sistemas, redes y programas de ataques digitales. Estos ataques cibernéticos generalmente tienen como objetivo acceder, cambiar o destruir información confidencial, extorsionar dinero de los usuarios o interrumpir procesos comerciales normales. La metodología de análisis de vulnerabilidades incluye pruebas de penetración.',
    url: 'https://www.pearson.com/store/p/computer-security-principles-and-practice/',
    language: 'es',
    type: 'journal'
  },
  {
    id: 'source-4',
    title: 'Data Science and Analytics',
    author: 'Wes McKinney',
    year: 2022,
    content: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. Data science is related to data mining, machine learning and big data. The results show that 95% of organizations use data analytics.',
    url: 'https://wesmckinney.com/book/',
    language: 'en',
    type: 'web'
  },
  {
    id: 'source-5',
    title: 'Deep Learning with Neural Networks',
    author: 'Ian Goodfellow, Yoshua Bengio',
    year: 2018,
    content: 'Deep learning is a class of machine learning algorithms that uses multiple layers to progressively extract higher-level features from raw input. For example, in image processing, lower layers may identify edges, while higher layers may identify the concepts relevant to a human such as digits or letters or faces.',
    doi: '10.1038/nature14539',
    language: 'en',
    type: 'academic'
  }
];

const sampleTexts = [
  {
    title: 'Texto con plagio directo (ES)',
    text: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Los sistemas de IA modernos utilizan redes neuronales profundas para aprender representaciones jerárquicas de datos.',
    language: 'es' as const
  },
  {
    title: 'Texto con paráfrasis (EN)',
    text: 'Artificial intelligence involves developing computing systems that can perform tasks typically requiring human cognition. Modern AI systems employ deep neural architectures to learn hierarchical data representations automatically.',
    language: 'en' as const
  },
  {
    title: 'Texto original sin plagio',
    text: 'La computación cuántica representa un paradigma completamente nuevo en el procesamiento de información. Utilizando los principios de superposición y entrelazamiento cuántico, estos sistemas pueden resolver problemas matemáticos específicos exponencialmente más rápido que los computadores clásicos tradicionales.',
    language: 'es' as const
  },
  {
    title: 'Texto con cita fantasma',
    text: 'Según varios autores (García, 2025), la aplicación de metodologías ágiles mejora la productividad. Otros estudios (López et al., 2024) confirman estos hallazgos.\n\nReferencias\nPérez, J. (2020). Fundamentos de desarrollo.',
    language: 'es' as const
  }
];

const typeIcons: Record<PlagiarismType, React.ReactNode> = {
  'direct': <FileWarning className="h-4 w-4 text-red-600" />,
  'paraphrase': <MessageSquareText className="h-4 w-4 text-orange-600" />,
  'idea': <Brain className="h-4 w-4 text-purple-600" />,
  'self': <Copy className="h-4 w-4 text-yellow-600" />,
  'ghost_citation': <Link2 className="h-4 w-4 text-pink-600" />,
  'translation': <Globe className="h-4 w-4 text-blue-600" />,
  'structure': <Layout className="h-4 w-4 text-indigo-600" />,
  'data': <Table2 className="h-4 w-4 text-teal-600" />,
  'methodology': <FlaskConical className="h-4 w-4 text-cyan-600" />,
  'author_omission': <UserX className="h-4 w-4 text-rose-600" />
};

const typeColors: Record<PlagiarismType, string> = {
  'direct': 'bg-red-50 border-red-300',
  'paraphrase': 'bg-orange-50 border-orange-300',
  'idea': 'bg-purple-50 border-purple-300',
  'self': 'bg-yellow-50 border-yellow-300',
  'ghost_citation': 'bg-pink-50 border-pink-300',
  'translation': 'bg-blue-50 border-blue-300',
  'structure': 'bg-indigo-50 border-indigo-300',
  'data': 'bg-teal-50 border-teal-300',
  'methodology': 'bg-cyan-50 border-cyan-300',
  'author_omission': 'bg-rose-50 border-rose-300'
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function fetchLiveRepositoryDocs(text: string): Promise<{ sources: SourceDocument[]; statuses: RepoStatus[] }> {
  const t0 = performance.now();
  const statuses: RepoStatus[] = [
    { name: 'CrossRef', status: 'pending', count: 0 },
    { name: 'Semantic Scholar', status: 'pending', count: 0 },
    { name: 'arXiv', status: 'pending', count: 0 },
    { name: 'Open Library', status: 'pending', count: 0 },
  ];

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { sources: [], statuses: statuses.map(s => ({ ...s, status: 'error' as const })) };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/plagiarism-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        text,
        documentTitle: 'Análisis de Plagio',
        language: 'auto',
        method: 'hybrid',
        checkRepositories: true,
      }),
    });

    const latencyMs = Math.round(performance.now() - t0);

    if (!res.ok) {
      return { sources: [], statuses: statuses.map(s => ({ ...s, status: 'error' as const, latencyMs })) };
    }

    const data = await res.json();
    const repoResults: Array<{ source: string; documents: Array<{ title: string; author: string; year: number; abstract: string; url: string; doi?: string }> }> = data.repositoryResults || [];

    const updatedStatuses: RepoStatus[] = statuses.map(s => {
      const repo = repoResults.find(r => r.source === s.name);
      return {
        ...s,
        status: repo ? 'ok' as const : 'error' as const,
        count: repo?.documents.length || 0,
        latencyMs,
      };
    });

    const sources: SourceDocument[] = repoResults.flatMap((repo, repoIdx) =>
      repo.documents.map((doc, docIdx) => ({
        id: `repo-${repoIdx}-${docIdx}`,
        title: doc.title,
        author: doc.author,
        year: doc.year,
        content: doc.abstract || doc.title,
        url: doc.url,
        doi: doc.doi,
        language: 'en',
        type: repo.source === 'Open Library' ? 'book' : 'academic' as 'academic' | 'book',
      }))
    );

    return { sources, statuses: updatedStatuses };
  } catch {
    const latencyMs = Math.round(performance.now() - t0);
    return { sources: [], statuses: statuses.map(s => ({ ...s, status: 'error' as const, latencyMs })) };
  }
}

export function PlagiarismDetectionPanel() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'fetching' | 'analyzing'>('idle');
  const [report, setReport] = useState<PlagiarismReport | null>(null);
  const [repoStatuses, setRepoStatuses] = useState<RepoStatus[]>([]);
  const [liveSourceCount, setLiveSourceCount] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'es' | 'en'>('auto');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState('');
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [filterType, setFilterType] = useState<PlagiarismType | 'all'>('all');
  const [showBreakdown, setShowBreakdown] = useState(true);

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
    const h = await advancedPlagiarismDetector.getAnalysisHistory(userId);
    setAnalysisHistory(h);
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
    setReport(null);
    setSaveStatus('idle');
    setRepoStatuses([]);
    setLiveSourceCount(0);

    try {
      // Phase 1: Fetch live repository documents
      setAnalysisPhase('fetching');
      const { sources: liveSources, statuses } = await fetchLiveRepositoryDocs(inputText);
      setRepoStatuses(statuses);
      setLiveSourceCount(liveSources.length);

      // Phase 2: Run plagiarism analysis with local + live sources
      setAnalysisPhase('analyzing');
      const combinedSources = [...sourceDocuments, ...liveSources];
      const result = await advancedPlagiarismDetector.analyzeFull(inputText, combinedSources);
      setReport(result);

      if (currentUser) {
        setSaveStatus('saving');
        const savedId = await advancedPlagiarismDetector.saveFullReport(
          currentUser.id,
          pdfFile?.name || 'Análisis de texto',
          inputText,
          result
        );
        setSaveStatus(savedId ? 'saved' : 'error');
        if (savedId) loadHistory(currentUser.id);
      }
    } catch (err) {
      console.error('Error analyzing plagiarism:', err);
      setSaveStatus('error');
    } finally {
      setIsAnalyzing(false);
      setAnalysisPhase('idle');
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!currentUser) return;
    const ok = await advancedPlagiarismDetector.deleteAnalysis(analysisId);
    if (ok) loadHistory(currentUser.id);
  };

  const filteredMatches = report?.matches.filter(m => filterType === 'all' || m.type === filterType) || [];

  const totalPlagiarismTypes = report
    ? Object.values(report.breakdownByType).reduce((sum, b) => sum + b.count, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Detección Avanzada de Plagios</h2>
        </div>
        <p className="text-red-100 text-lg">
          Análisis completo: 10 tipos de plagio - Directo, Paráfrasis, Ideas, Autoplagio, Citas Fantasma, Traducción, Estructura, Datos, Metodología, Omisión de Autoría
        </p>
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

        {/* History Panel */}
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
                      <span className={h.status === 'safe' ? 'text-green-600' : h.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                        {Math.round(h.overall_similarity)}% plagio
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
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{extractingPdf ? 'Procesando PDF...' : 'Arrastra un PDF aquí o haz clic para cargar'}</p>
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
                  <span className={`px-2 py-0.5 text-xs rounded-full ${sample.language === 'es' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {sample.language === 'es' ? 'ES' : 'EN'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{sample.text.substring(0, 100)}...</p>
              </button>
            ))}
          </div>
        </div>

        <textarea value={inputText} onChange={e => setInputText(e.target.value)}
          placeholder="Introduce el texto a analizar para detectar múltiples tipos de plagio..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {inputText.length} caracteres | {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras
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
                <><Search className="h-4 w-4" /><span>Analizar Plagio</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          {analysisPhase === 'fetching' ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consultando repositorios científicos...</h3>
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                {['CrossRef', 'Semantic Scholar', 'arXiv', 'Open Library'].map(name => (
                  <span key={name} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                    <Globe className="h-3 w-3 animate-pulse" />{name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analizando 10 tipos de plagio...</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 max-w-2xl mx-auto text-xs text-gray-500">
                <span className="p-2 bg-red-50 rounded">Directo</span>
                <span className="p-2 bg-orange-50 rounded">Paráfrasis</span>
                <span className="p-2 bg-purple-50 rounded">Ideas</span>
                <span className="p-2 bg-yellow-50 rounded">Autoplagio</span>
                <span className="p-2 bg-pink-50 rounded">Citas Fantasma</span>
                <span className="p-2 bg-blue-50 rounded">Traducción</span>
                <span className="p-2 bg-indigo-50 rounded">Estructura</span>
                <span className="p-2 bg-teal-50 rounded">Datos</span>
                <span className="p-2 bg-cyan-50 rounded">Metodología</span>
                <span className="p-2 bg-rose-50 rounded">Omisión Autoría</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && report && (
        <div className="space-y-6">
          {/* Repository Status Panel */}
          {repoStatuses.length > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <Server className="h-4 w-4 mr-2 text-blue-500" />
                Repositorios Científicos Consultados
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {liveSourceCount} documentos recuperados
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {repoStatuses.map(repo => (
                  <div key={repo.name} className={`flex items-center justify-between p-3 rounded-lg border ${
                    repo.status === 'ok' ? 'bg-green-50 border-green-200' :
                    repo.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 min-w-0">
                      {repo.status === 'ok'
                        ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        : repo.status === 'error'
                        ? <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        : <div className="h-4 w-4 rounded-full border-2 border-gray-400 animate-spin flex-shrink-0" />
                      }
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{repo.name}</p>
                        <p className="text-xs text-gray-500">
                          {repo.status === 'ok' ? `${repo.count} docs` :
                           repo.status === 'error' ? 'Sin conexión' : 'Esperando...'}
                        </p>
                      </div>
                    </div>
                    {repo.latencyMs !== undefined && repo.status === 'ok' && (
                      <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{repo.latencyMs}ms</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Overall Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
              Resumen del Análisis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Percentage Display */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                        <circle cx="64" cy="64" r="56" stroke={report.plagiarismPercentage > 30 ? '#dc2626' : report.plagiarismPercentage > 15 ? '#f59e0b' : '#10b981'}
                          strokeWidth="12" fill="none"
                          strokeDasharray={`${report.plagiarismPercentage * 3.52} 352`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-gray-900">{Math.round(report.plagiarismPercentage)}%</span>
                          <span className="block text-xs text-gray-500">Plagio</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === 'safe' ? 'bg-green-100 text-green-700' :
                      report.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {report.status === 'safe' ? 'Documento Original' : report.status === 'warning' ? 'Plagio Moderado' : 'Alto Plagio'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <span className="text-2xl font-bold text-green-600">{Math.round(report.nonPlagiarismPercentage)}%</span>
                      <span className="block text-xs text-green-700">No Plagio</span>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <span className="text-2xl font-bold text-red-600">{Math.round(report.plagiarismPercentage)}%</span>
                      <span className="block text-xs text-red-700">Plagio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total palabras:</span>
                    <span className="font-semibold">{report.totalWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Palabras plagiadas:</span>
                    <span className="font-semibold text-red-600">{report.plagiarizedWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuentes analizadas:</span>
                    <span className="font-semibold">{report.sourcesChecked} ({liveSourceCount} en vivo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Citas verificadas:</span>
                    <span className="font-semibold text-green-600">{report.citationsVerified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Citas fantasma:</span>
                    <span className="font-semibold text-pink-600">{report.ghostCitationsFound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo análisis:</span>
                    <span className="font-semibold">{report.analysisTimeMs}ms</span>
                  </div>
                </div>
              </div>

              {/* Matches Count */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Detecciones</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-3xl font-bold text-gray-900">{report.matches.length}</span>
                  <span className="block text-sm text-gray-600">fragmentos detectados</span>
                </div>
                <div className="text-xs text-gray-500">
                  En {totalPlagiarismTypes} categorías de plagio
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown by Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                Desglose por Tipo de Plagio
              </h3>
              <button onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-sm text-gray-500 hover:text-gray-700">
                {showBreakdown ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showBreakdown && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(Object.entries(report.breakdownByType) as [PlagiarismType, { count: number; percentage: number; words: number }][]).map(([type, data]) => (
                  <button key={type} onClick={() => setFilterType(filterType === type ? 'all' : type)}
                    className={`p-3 rounded-lg border transition-all ${filterType === type ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${typeColors[type]}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {typeIcons[type]}
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900">{data.count}</span>
                      <span className="block text-xs text-gray-600">{data.percentage}% del plagio</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Matches */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-orange-600" />
                Fragmentos Detectados ({filteredMatches.length})
              </h3>
              <select value={filterType} onChange={e => setFilterType(e.target.value as PlagiarismType | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500">
                <option value="all">Todos los tipos</option>
                {Object.entries(report.breakdownByType).filter(([_, d]) => d.count > 0).map(([type]) => (
                  <option key={type} value={type}>{type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                ))}
              </select>
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron fragmentos con plagio
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match, index) => (
                  <div key={match.id} className={`border-l-4 rounded-lg p-4 ${typeColors[match.type]}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {typeIcons[match.type]}
                          <span className="font-semibold text-gray-900">{match.typeLabel}</span>
                        </div>
                        <span className="text-xs bg-white px-2 py-0.5 rounded">
                          {match.similarityScore}% similitud
                        </span>
                        <span className="text-xs text-gray-500">
                          Confianza: {match.confidence}%
                        </span>
                      </div>
                      {match.sourceUrl && (
                        <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1 text-blue-500 hover:text-blue-700">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Fragmento Infractor:</h5>
                        <div className="p-3 bg-white bg-opacity-70 rounded border border-gray-200">
                          <p className="text-sm text-gray-800">"{match.infractingFragment}"</p>
                        </div>
                      </div>

                      {match.originalText && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Texto Original:</h5>
                          <div className="p-3 bg-gray-100 rounded border border-gray-200">
                            <p className="text-sm text-gray-600">"{match.originalText}"</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center"><BookOpen className="h-3 w-3 mr-1" /><strong>Fuente:</strong> {match.sourceDocument}</span>
                        <span className="flex items-center"><span className="font-semibold">Autor:</span> {match.sourceAuthor}</span>
                        <span className="flex items-center"><span className="font-semibold">Año:</span> {match.sourceYear}</span>
                        {match.locationPage && <span className="flex items-center"><span className="font-semibold">Página:</span> ~{match.locationPage}</span>}
                        <span className="flex items-center"><span className="font-semibold">Palabras:</span> {match.wordCount}</span>
                        {match.sourceDoi && <span className="flex items-center text-blue-600">DOI: {match.sourceDoi}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!report && !isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Detección Avanzada de Plagios</h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Analiza textos para detectar 10 tipos diferentes de plagio, genera un reporte detallado con porcentajes,
            desglose por tipo, fuentes originales, autores y localización aproximada de cada fragmento.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {Object.entries(typeIcons).map(([type, icon]) => (
              <div key={type} className={`p-3 rounded-lg ${typeColors[type as PlagiarismType]}`}>
                <div className="flex items-center space-x-2">
                  {icon}
                  <span className="text-xs font-medium text-gray-900">
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
