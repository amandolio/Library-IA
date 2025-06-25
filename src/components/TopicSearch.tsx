import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Lightbulb, 
  TrendingUp,
  ArrowRight,
  Globe,
  Download,
  Brain,
  Zap,
  Clock,
  Tag,
  BarChart3,
  RefreshCw,
  Database,
  Layers,
  Sparkles,
  FileText,
  Target,
  Activity
} from 'lucide-react';
import { Resource, KeywordExtractionResult, BookCategory } from '../types';
import { 
  searchResourcesByTopic, 
  popularTopics, 
  bookCategories,
  extractKeywords,
  analyzeResourceKeywords,
  getLibrarySyncStatus,
  syncWithLibrarySystem,
  searchResourcesByKeywords,
  getCachedKeywordAnalysis,
  cacheKeywordAnalysis
} from '../data/mockData';
import { ResourceCard } from './ResourceCard';

export function TopicSearch() {
  const [inputText, setInputText] = useState('');
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [keywordRecommendations, setKeywordRecommendations] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordExtractionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(getLibrarySyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'tf-idf' | 'textrank' | 'yake' | 'hybrid'>('hybrid');
  const [topK, setTopK] = useState(15);
  const [searchMode, setSearchMode] = useState<'simple' | 'nlp'>('simple');

  // Actualizar estado de sincronización cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getLibrarySyncStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const methods = [
    {
      id: 'tf-idf' as const,
      name: 'TF-IDF',
      description: 'Frecuencia de términos e inversa de frecuencia de documentos',
      color: 'blue',
      icon: BarChart3
    },
    {
      id: 'textrank' as const,
      name: 'TextRank',
      description: 'Algoritmo basado en grafos similar a PageRank',
      color: 'green',
      icon: Activity
    },
    {
      id: 'yake' as const,
      name: 'YAKE',
      description: 'Extracción no supervisada de keywords',
      color: 'purple',
      icon: Target
    },
    {
      id: 'hybrid' as const,
      name: 'Híbrido',
      description: 'Combinación de múltiples métodos para mejor precisión',
      color: 'orange',
      icon: Layers
    }
  ];

  const handleSearch = async () => {
    if (!inputText.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setKeywordAnalysis(null);
    setKeywordRecommendations([]);
    setSearchResults([]);
    
    try {
      if (searchMode === 'simple') {
        // Búsqueda simple por tema
        setTimeout(() => {
          const results = searchResourcesByTopic(inputText);
          setSearchResults(results);
          setIsSearching(false);
        }, 800);
      } else {
        // Búsqueda avanzada con análisis PLN
        setIsAnalyzing(true);
        
        // Verificar si ya tenemos análisis en caché
        let keywordResult = getCachedKeywordAnalysis(inputText);
        
        if (!keywordResult) {
          // Si no está en caché, hacer nuevo análisis
          keywordResult = await extractKeywords(inputText, selectedMethod, topK);
          // Guardar en caché
          cacheKeywordAnalysis(inputText, keywordResult);
        }
        
        setKeywordAnalysis(keywordResult);
        setIsAnalyzing(false);
        
        // Buscar recursos basados en las keywords extraídas
        if (keywordResult.keywords.length > 0) {
          setTimeout(() => {
            const keywordBasedResults = searchResourcesByKeywords(keywordResult.keywords);
            setSearchResults(keywordBasedResults);
            setIsSearching(false);
          }, 500);
        } else {
          setIsSearching(false);
        }
      }
    } catch (error) {
      console.error('Error in search:', error);
      setIsSearching(false);
      setIsAnalyzing(false);
    }
  };

  const handleTopicClick = (selectedTopic: string) => {
    setInputText(selectedTopic);
    setSearchMode('simple');
    // Ejecutar búsqueda automáticamente
    setTimeout(() => {
      const results = searchResourcesByTopic(selectedTopic);
      setSearchResults(results);
      setHasSearched(true);
    }, 100);
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.digitalUrl) {
      window.open(resource.digitalUrl, '_blank');
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncWithLibrarySystem();
      setSyncStatus(result);
    } catch (error) {
      console.error('Sync failed:', error);
    }
    setIsSyncing(false);
  };

  const filteredTopics = selectedCategory === 'all' 
    ? popularTopics 
    : bookCategories.find(cat => cat.id === selectedCategory)?.subcategories || [];

  const getAvailabilityInfo = (resource: Resource) => {
    if (!resource.librarySystem) return null;
    
    const { totalCopies, availableCopies, checkedOutCopies, reservedCopies, digitalAccess } = resource.librarySystem;
    
    return {
      physical: {
        total: totalCopies,
        available: availableCopies,
        checkedOut: checkedOutCopies,
        reserved: reservedCopies
      },
      digital: digitalAccess ? {
        licenses: resource.librarySystem.digitalLicenses || 0,
        activeUsers: resource.librarySystem.digitalActiveUsers || 0
      } : null
    };
  };

  const sampleTexts = [
    {
      title: 'Investigación en IA',
      text: 'Estoy trabajando en un proyecto de investigación sobre inteligencia artificial aplicada al procesamiento de lenguaje natural. Necesito recursos sobre algoritmos de machine learning, redes neuronales profundas y técnicas de análisis semántico para desarrollar un sistema de comprensión de texto automático.'
    },
    {
      title: 'Desarrollo Web Moderno',
      text: 'Quiero aprender sobre las últimas tecnologías de desarrollo web frontend y backend. Me interesan los frameworks de JavaScript como React y Vue, así como tecnologías de servidor como Node.js, bases de datos NoSQL y arquitecturas de microservicios para crear aplicaciones escalables.'
    },
    {
      title: 'Ciberseguridad Empresarial',
      text: 'Necesito información sobre estrategias de ciberseguridad para empresas, incluyendo protección contra ataques de malware, técnicas de hacking ético, criptografía avanzada, gestión de vulnerabilidades y implementación de políticas de seguridad en redes corporativas.'
    },
    {
      title: 'Ciencia de Datos',
      text: 'Estoy interesado en aprender sobre análisis de big data, visualización de información, estadística aplicada y algoritmos de minería de datos. Quiero dominar herramientas como Python, R y técnicas de machine learning para extraer insights valiosos de grandes conjuntos de datos.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="h-8 w-8" />
              <h2 className="text-3xl font-bold">Búsqueda Inteligente con PLN</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Busca por temas simples o introduce texto en lenguaje natural para análisis avanzado con PLN
            </p>
          </div>
          
          {/* Sync Status */}
          <div className="bg-white/10 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Estado del Sistema</span>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Sincronización:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  syncStatus.syncStatus === 'active' ? 'bg-green-500' :
                  syncStatus.syncStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>
                  {syncStatus.syncStatus === 'active' ? 'Activa' :
                   syncStatus.syncStatus === 'error' ? 'Error' : 'Inactiva'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recursos:</span>
                <span className="font-semibold">{syncStatus.totalResources}</span>
              </div>
              <div className="text-xs opacity-75">
                Última sync: {syncStatus.lastSyncTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Mode Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Modo de Búsqueda
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSearchMode('simple')}
              className={`p-4 border rounded-lg transition-all text-left ${
                searchMode === 'simple'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Search className={`h-5 w-5 ${
                  searchMode === 'simple' ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className={`font-semibold ${
                  searchMode === 'simple' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  Búsqueda Simple
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Busca por temas específicos como "Machine Learning", "Python", "Ciberseguridad"
              </p>
            </button>

            <button
              onClick={() => setSearchMode('nlp')}
              className={`p-4 border rounded-lg transition-all text-left ${
                searchMode === 'nlp'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Brain className={`h-5 w-5 ${
                  searchMode === 'nlp' ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <span className={`font-semibold ${
                  searchMode === 'nlp' ? 'text-purple-900' : 'text-gray-900'
                }`}>
                  Análisis PLN Avanzado
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Introduce texto en lenguaje natural y extrae keywords automáticamente
              </p>
            </button>
          </div>
        </div>

        {/* NLP Configuration (only show when NLP mode is selected) */}
        {searchMode === 'nlp' && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Configuración del Análisis PLN
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              {methods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 border rounded-lg transition-all text-left ${
                      selectedMethod === method.id
                        ? `border-${method.color}-500 bg-${method.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className={`h-4 w-4 ${
                        selectedMethod === method.id ? `text-${method.color}-600` : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-semibold ${
                        selectedMethod === method.id ? `text-${method.color}-900` : 'text-gray-900'
                      }`}>
                        {method.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{method.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Keywords a extraer:</label>
                <select
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Sample Texts for NLP Mode */}
        {searchMode === 'nlp' && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-green-600" />
              Textos de Ejemplo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(sample.text)}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <h5 className="font-medium text-gray-900 mb-1">{sample.title}</h5>
                  <p className="text-sm text-gray-600 line-clamp-2">{sample.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            {searchMode === 'simple' ? (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ej: Machine Learning, Quantum Computing, Cybersecurity..."
                className="w-full pl-12 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            ) : (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Introduce tu consulta en lenguaje natural. Ej: 'Estoy trabajando en un proyecto de inteligencia artificial y necesito recursos sobre machine learning y procesamiento de lenguaje natural...'"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg resize-none"
                rows={4}
              />
            )}
            <button
              onClick={handleSearch}
              disabled={!inputText.trim() || isSearching || isAnalyzing}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ${
                searchMode === 'simple' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isSearching || isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isAnalyzing ? 'Analizando...' : 'Buscando...'}</span>
                </>
              ) : (
                <>
                  {searchMode === 'simple' ? (
                    <Search className="h-4 w-4" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  <span>{searchMode === 'simple' ? 'Buscar' : 'Analizar con PLN'}</span>
                </>
              )}
            </button>
          </div>
          
          {searchMode === 'nlp' && inputText && (
            <div className="mt-2 text-sm text-gray-500">
              {inputText.length} caracteres | {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras
            </div>
          )}
        </div>

        {/* Category Filter (only for simple mode) */}
        {searchMode === 'simple' && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Categorías Temáticas
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Todos los Temas
                </button>
                {bookCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.id
                        ? `bg-${category.color}-600 text-white`
                        : `bg-${category.color}-50 text-${category.color}-700 hover:bg-${category.color}-100`
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                {selectedCategory === 'all' ? 'Temas Populares' : 
                 bookCategories.find(cat => cat.id === selectedCategory)?.name || 'Temas'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {filteredTopics.slice(0, 20).map((popularTopic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(popularTopic)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {popularTopic}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Keyword Analysis Results (only for NLP mode) */}
      {searchMode === 'nlp' && (keywordAnalysis || isAnalyzing) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Análisis de Keywords con PLN</h3>
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            )}
          </div>
          
          {keywordAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-600" />
                  Keywords Extraídas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keywordAnalysis.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-sm rounded-md border ${
                        index < 5 
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : index < 10
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      #{index + 1} {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-600" />
                  Métricas de Análisis
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confianza:</span>
                    <span className="font-semibold text-green-600">
                      {Math.round(keywordAnalysis.confidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-semibold text-purple-600 capitalize">
                      {keywordAnalysis.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo:</span>
                    <span className="font-semibold text-orange-600">
                      {keywordAnalysis.processingTime}ms
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                  Técnicas PLN Aplicadas
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    TF-IDF (Frecuencia de términos)
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    TextRank (Análisis de grafos)
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    YAKE (Extracción no supervisada)
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Método híbrido combinado
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {(isSearching || isAnalyzing) && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isAnalyzing ? 'Procesando con PLN Avanzado...' : 'Buscando Recursos...'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchMode === 'nlp' 
              ? `Analizando "${inputText.slice(0, 50)}..." con técnicas de PLN`
              : `Buscando recursos para "${inputText}"`
            }
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            {searchMode === 'nlp' ? (
              <>
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  Extrayendo keywords
                </div>
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  Consultando catálogo
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Calculando relevancia
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-1" />
                  Buscando coincidencias
                </div>
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  Consultando catálogo
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Ordenando resultados
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && !isAnalyzing && hasSearched && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {searchMode === 'nlp' 
                  ? 'Recursos Recomendados por PLN'
                  : `Recursos encontrados para "${inputText}"`
                }
              </h3>
              <p className="text-gray-600 mt-1">
                {searchResults.length} {searchResults.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
                {searchMode === 'nlp' && keywordAnalysis && (
                  <span className="ml-2 text-purple-600 text-sm">
                    (basado en {keywordAnalysis.keywords.length} keywords extraídas)
                  </span>
                )}
                {syncStatus.updatedResources > 0 && (
                  <span className="ml-2 text-green-600 text-sm">
                    ({syncStatus.updatedResources} actualizados recientemente)
                  </span>
                )}
              </p>
            </div>
            
            {searchResults.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Globe className="h-4 w-4" />
                <span>Haz clic en cualquier recurso para acceder directamente</span>
              </div>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-6">
              {searchResults.map((resource, index) => {
                const availabilityInfo = getAvailabilityInfo(resource);
                
                return (
                  <div key={resource.id} className="relative">
                    <div className={`absolute -left-4 top-4 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10 ${
                      searchMode === 'nlp' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-6">
                      <div 
                        onClick={() => handleResourceClick(resource)}
                        className="cursor-pointer transform hover:scale-[1.02] transition-transform"
                      >
                        <ResourceCard resource={resource} />
                      </div>
                      
                      {/* Información de Disponibilidad Detallada */}
                      {availabilityInfo && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Database className="h-4 w-4 mr-2" />
                            Estado en Sistema Bibliotecario
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Copias Físicas */}
                            <div className="space-y-2">
                              <h5 className="font-medium text-gray-800">Copias Físicas</h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-semibold">{availabilityInfo.physical.total}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Disponibles:</span>
                                  <span className={`font-semibold ${
                                    availabilityInfo.physical.available > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {availabilityInfo.physical.available}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Prestadas:</span>
                                  <span className="font-semibold text-orange-600">
                                    {availabilityInfo.physical.checkedOut}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Reservadas:</span>
                                  <span className="font-semibold text-blue-600">
                                    {availabilityInfo.physical.reserved}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Acceso Digital */}
                            {availabilityInfo.digital && (
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-800">Acceso Digital</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Licencias:</span>
                                    <span className="font-semibold">{availabilityInfo.digital.licenses}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Usuarios activos:</span>
                                    <span className="font-semibold text-blue-600">
                                      {availabilityInfo.digital.activeUsers}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Disponibilidad:</span>
                                    <span className={`font-semibold ${
                                      availabilityInfo.digital.activeUsers < availabilityInfo.digital.licenses 
                                        ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                      {availabilityInfo.digital.activeUsers < availabilityInfo.digital.licenses 
                                        ? 'Disponible' : 'Limitado'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* URLs de acceso */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Enlaces de Acceso
                        </h4>
                        <div className="space-y-2">
                          {resource.digitalUrl && (
                            <a
                              href={resource.digitalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
                            >
                              <div className="flex items-center space-x-3">
                                <Download className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium text-green-800">Acceso Digital</p>
                                  <p className="text-sm text-green-600">
                                    {resource.librarySystem?.digitalAccess ? 'Licencia institucional' : 'Acceso libre'}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                            </a>
                          )}
                          
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                            >
                              <div className="flex items-center space-x-3">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-blue-800">Catálogo de Biblioteca</p>
                                  <p className="text-sm text-blue-600">Ver detalles y disponibilidad</p>
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                            </a>
                          )}
                        </div>
                        
                        {/* Información adicional */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              Relevancia: <strong className="text-gray-900">
                                {searchMode === 'nlp' ? 'Alta (PLN)' : 'Alta'}
                              </strong>
                            </span>
                            <span>Última actualización: <strong className="text-gray-900">
                              {resource.librarySystem?.lastUpdated || 'N/A'}
                            </strong></span>
                          </div>
                          {searchMode === 'nlp' && resource.fullTextKeywords && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Keywords coincidentes: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resource.fullTextKeywords
                                  .filter(keyword => keywordAnalysis?.keywords.some(k => 
                                    k.toLowerCase().includes(keyword.toLowerCase()) || 
                                    keyword.toLowerCase().includes(k.toLowerCase())
                                  ))
                                  .slice(0, 8)
                                  .map((keyword, idx) => (
                                    <span key={idx} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-xs rounded">
                                      {keyword}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recursos</h3>
              <p className="text-gray-600 mb-4">
                {searchMode === 'nlp' 
                  ? 'No hay recursos disponibles para las keywords extraídas del texto.'
                  : `No hay recursos disponibles para el tema "${inputText}".`
                }
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Sugerencias:</p>
                <ul className="list-disc list-inside space-y-1">
                  {searchMode === 'nlp' ? (
                    <>
                      <li>Intenta con un texto más específico o detallado</li>
                      <li>Incluye términos técnicos relacionados con tu área de interés</li>
                      <li>Cambia el método de análisis PLN</li>
                      <li>Prueba con el modo de búsqueda simple</li>
                    </>
                  ) : (
                    <>
                      <li>Intenta con términos más generales</li>
                      <li>Verifica la ortografía</li>
                      <li>Usa sinónimos o términos relacionados</li>
                      <li>Prueba con los temas populares sugeridos</li>
                      <li>Selecciona una categoría específica</li>
                      <li>Prueba con el modo de análisis PLN</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !isSearching && !isAnalyzing && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sistema Bibliotecario Inteligente con PLN
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Busca por temas específicos o introduce texto en lenguaje natural para análisis avanzado con PLN. 
            Nuestro sistema extrae keywords automáticamente y recomienda recursos relevantes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Búsqueda Simple</h4>
              <p className="text-sm text-gray-600">Busca por temas específicos como "Machine Learning"</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Análisis PLN</h4>
              <p className="text-sm text-gray-600">Introduce texto natural y extrae keywords automáticamente</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Sincronización</h4>
              <p className="text-sm text-gray-600">Datos actualizados del sistema bibliotecario</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <ExternalLink className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Acceso Directo</h4>
              <p className="text-sm text-gray-600">Enlaces a recursos digitales y catálogo físico</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}