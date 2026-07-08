import React, { useState, useEffect, useCallback } from 'react';
import { Shield, FileText, Search, History, Clock, CheckCircle, Globe } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { advancedPlagiarismDetector, PlagiarismReport, PlagiarismType } from '../../services/advancedPlagiarismDetector';
import { fetchLiveRepositoryDocs, RepoStatus } from '../../services/plagiarismRepositoryService';
import { sourceDocuments } from '../../data/sourceDocuments';
import { RepositoryStatusPanel } from './RepositoryStatusPanel';
import { PlagiarismResults } from './PlagiarismResults';
import { PdfUploader, extractTextFromPdf } from './PdfUploader';
import { SampleTextsSelector } from './SampleTextsSelector';
import { plagiarismTypeLabels } from './plagiarismUtils';

export function PlagiarismDetectionPanel() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'fetching' | 'analyzing'>('idle');
  const [report, setReport] = useState<PlagiarismReport | null>(null);
  const [repoStatuses, setRepoStatuses] = useState<RepoStatus[]>([]);
  const [liveSourceCount, setLiveSourceCount] = useState(0);
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

  const clearPdf = useCallback(() => {
    setPdfFile(null);
    setPdfText('');
    setPdfError('');
    if (inputText === pdfText) setInputText('');
  }, [inputText, pdfText]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setReport(null);
    setSaveStatus('idle');
    setRepoStatuses([]);
    setLiveSourceCount(0);

    try {
      setAnalysisPhase('fetching');
      const { sources: liveSources, statuses } = await fetchLiveRepositoryDocs(inputText);
      setRepoStatuses(statuses);
      setLiveSourceCount(liveSources.length);

      setAnalysisPhase('analyzing');
      const combinedSources = [...sourceDocuments, ...liveSources];
      const result = await advancedPlagiarismDetector.analyzeFull(inputText, combinedSources);
      setReport(result);

      if (currentUser) {
        setSaveStatus('saving');
        const savedId = await advancedPlagiarismDetector.saveFullReport(currentUser.id, pdfFile?.name || 'Análisis de texto', inputText, result);
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
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
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
                </div>
              ))}
            </div>
          </div>
        )}

        <PdfUploader pdfFile={pdfFile} pdfText={pdfText} extractingPdf={extractingPdf} pdfError={pdfError} onUpload={handlePdfUpload} onClear={clearPdf} />
        <SampleTextsSelector onSelect={(text) => { setInputText(text); clearPdf(); }} />

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
                {plagiarismTypeLabels.map(label => (
                  <span key={label} className="p-2 bg-gray-50 rounded">{label}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && report && (
        <>
          <RepositoryStatusPanel statuses={repoStatuses} sourceCount={liveSourceCount} />
          <PlagiarismResults report={report} liveSourceCount={liveSourceCount} filterType={filterType} setFilterType={setFilterType} showBreakdown={showBreakdown} setShowBreakdown={setShowBreakdown} />
        </>
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
            {plagiarismTypeLabels.map((label, i) => (
              <div key={label} className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlagiarismDetectionPanel;
