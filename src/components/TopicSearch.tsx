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
  Sparkles
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
  const [topic, setTopic] = useState('');
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [keywordRecommendations, setKeywordRecommendations] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordExtractionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(getLibrarySyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  // Actualizar estado de sincronización cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getLibrarySyncStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (searchTopic: string) => {
    if (!searchTopic.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setKeywordAnalysis(null);
    setKeywordRecommendations([]);
    
    // Simular delay de búsqueda AI
    setTimeout(async () => {
      const results = searchResourcesByTopic(searchTopic);
      setSearchResults(results);
      setIsSearching(false);
      
      // Analizar keywords del tema de búsqueda
      if (searchTopic.length > 5) {
        setIsAnalyzing(true);
        try {
          // Verificar si ya tenemos análisis en caché
          let keywordResult = getCachedKeywordAnalysis(searchTopic);
          
          if (!keywordResult) {
            // Si no está en caché, hacer nuevo análisis
            keywordResult = await extractKeywords(searchTopic, 'hybrid', 15);
            // Guardar en caché
            cacheKeywordAnalysis(searchTopic, keywordResult);
          }
          
          setKeywordAnalysis(keywordResult);
          
          // Buscar recursos basados en las keywords extraídas
          if (keywordResult.keywords.length > 0) {
            const keywordBasedResults = searchResourcesByKeywords(keywordResult.keywords);
            // Filtrar resultados que no estén ya en los resultados principales
            const uniqueKeywordResults = keywordBasedResults.filter(
              kwRes => !results.some(res => res.id === kwRes.id)
            );
            setKeywordRecommendations(uniqueKeywordResults.slice(0, 6));
          }
        } catch (error) {
          console.error('Error analyzing keywords:', error);
        }
        setIsAnalyzing(false);
      }
    }, 800);
  };

  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic);
    handleSearch(selectedTopic);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="h-8 w-8" />
              <h2 className="text-3xl font-bold">Búsqueda Inteligente por Tema</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Sistema avanzado con PLN, sincronización bibliotecaria y análisis de keywords en tiempo real.
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

      {/* Search Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(topic)}
              placeholder="Ej: Machine Learning, Quantum Computing, Cybersecurity..."
              className="w-1/2 pl-4 pr-32 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              onClick={() => handleSearch(topic)}
              disabled={!topic.trim() || isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>Buscar con IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter */}
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
      </div>

      {/* Keyword Analysis */}
      {(keywordAnalysis || isAnalyzing) && (
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
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200"
                    >
                      {keyword}
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
      {isSearching && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Procesando con IA Avanzada...</h3>
          <p className="text-gray-600 mb-4">
            Analizando "{topic}" con técnicas de PLN y sincronización bibliotecaria
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
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
          </div>
        </div>
      )}

      {/* Keyword-based Recommendations */}
      {keywordRecommendations.length > 0 && !isSearching && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Recomendaciones Basadas en Keywords PLN
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Recursos adicionales encontrados mediante análisis semántico de las keywords extraídas
          </p>
          <div className="grid grid-cols-1 gap-4">
            {keywordRecommendations.map((resource, index) => (
              <div key={resource.id} className="relative">
                <div className="absolute -left-4 top-4 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>
                <div className="ml-6">
                  <div 
                    onClick={() => handleResourceClick(resource)}
                    className="cursor-pointer transform hover:scale-[1.02] transition-transform"
                  >
                    <ResourceCard resource={resource} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && hasSearched && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recursos encontrados para "{topic}"
              </h3>
              <p className="text-gray-600 mt-1">
                {searchResults.length} {searchResults.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
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
                    <div className="absolute -left-4 top-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
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
                            <span>Relevancia del tema: <strong className="text-gray-900">Alta</strong></span>
                            <span>Última actualización: <strong className="text-gray-900">
                              {resource.librarySystem?.lastUpdated || 'N/A'}
                            </strong></span>
                          </div>
                          {resource.fullTextKeywords && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Keywords PLN: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resource.fullTextKeywords.slice(0, 8).map((keyword, idx) => (
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
                No hay recursos disponibles para el tema "{topic}". 
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Sugerencias:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Intenta con términos más generales</li>
                  <li>Verifica la ortografía</li>
                  <li>Usa sinónimos o términos relacionados</li>
                  <li>Prueba con los temas populares sugeridos</li>
                  <li>Selecciona una categoría específica</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !isSearching && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sistema Bibliotecario Inteligente
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestro sistema avanzado combina IA, PLN y sincronización bibliotecaria en tiempo real 
            para ofrecerte los recursos más relevantes con información actualizada de disponibilidad.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">IA Avanzada</h4>
              <p className="text-sm text-gray-600">Análisis semántico con múltiples algoritmos de PLN</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Sincronización</h4>
              <p className="text-sm text-gray-600">Datos actualizados del sistema bibliotecario</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Tag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Keywords PLN</h4>
              <p className="text-sm text-gray-600">Extracción automática con TF-IDF, TextRank y YAKE</p>
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