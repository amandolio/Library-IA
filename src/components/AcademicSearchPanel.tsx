import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Database, 
  BookOpen, 
  FileText, 
  Globe, 
  Download, 
  ExternalLink,
  RefreshCw,
  Save,
  Trash2,
  Eye,
  Calendar,
  Users,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Filter,
  ArrowRight,
  Zap,
  Brain,
  Target,
  Activity,
  Layers,
  Settings,
  Cloud,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Resource } from '../types';
import { academicAPI } from '../services/academicAPIs';
import { databaseService } from '../services/databaseService';
import { cloudSyncService } from '../services/cloudSyncService';

export function AcademicSearchPanel() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    crossref: Resource[];
    openLibrary: Resource[];
    arxiv: Resource[];
    semanticScholar: Resource[];
    googleBooks: Resource[];
    combined: Resource[];
  } | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(['crossref', 'openLibrary', 'googleBooks']);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [cloudStats, setCloudStats] = useState<any>(null);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const sources = [
    { 
      id: 'crossref', 
      name: 'CrossRef', 
      description: 'Artículos académicos y DOIs',
      icon: FileText,
      color: 'blue'
    },
    { 
      id: 'openLibrary', 
      name: 'Open Library', 
      description: 'Libros y literatura',
      icon: BookOpen,
      color: 'green'
    },
    { 
      id: 'arxiv', 
      name: 'arXiv', 
      description: 'Preprints científicos',
      icon: Brain,
      color: 'red'
    },
    { 
      id: 'semanticScholar', 
      name: 'Semantic Scholar', 
      description: 'Papers con análisis semántico',
      icon: Target,
      color: 'purple'
    },
    { 
      id: 'googleBooks', 
      name: 'Google Books', 
      description: 'Libros y publicaciones',
      icon: Globe,
      color: 'yellow'
    }
  ];

  // Verificar conexión a la nube al cargar
  useEffect(() => {
    checkCloudConnection();
    loadSavedResources();
    loadStats();
  }, []);

  // Actualizar stats cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkCloudConnection = async () => {
    try {
      if (cloudSyncService.isConfigured()) {
        const connected = await cloudSyncService.checkConnection();
        setIsCloudConnected(connected);
        
        if (connected) {
          const lastSync = await cloudSyncService.getLastSyncTime();
          setLastSyncTime(lastSync);
        }
      }
    } catch (error) {
      console.warn('Error checking cloud connection:', error);
      setIsCloudConnected(false);
    }
  };

  const loadStats = async () => {
    try {
      const [dbStatsData, cloudStatsData] = await Promise.all([
        databaseService.getStats(),
        isCloudConnected ? cloudSyncService.getCloudStats() : Promise.resolve(null)
      ]);
      
      setDbStats(dbStatsData);
      setCloudStats(cloudStatsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadSavedResources = async () => {
    setIsLoadingSaved(true);
    try {
      const resources = await databaseService.getAllResources();
      setSavedResources(resources);
    } catch (error) {
      console.error('Error loading saved resources:', error);
    }
    setIsLoadingSaved(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      console.log(`🔍 Iniciando búsqueda académica para: "${query}"`);
      const results = await academicAPI.searchAllSources(query, 10);
      setSearchResults(results);
      
      // Guardar búsqueda en historial
      await databaseService.saveSearch(query, results.combined, 'academic-apis');
      
    } catch (error) {
      console.error('Error in academic search:', error);
    }
    setIsSearching(false);
  };

  const handleSaveResource = async (resource: Resource, source: string) => {
    setIsSaving(resource.id);
    try {
      await databaseService.saveResources([resource], source);
      
      // Sincronizar a la nube si está conectado
      if (isCloudConnected) {
        try {
          await cloudSyncService.syncToCloud();
          console.log('✅ Recurso sincronizado a la nube');
        } catch (error) {
          console.warn('⚠️ Error sincronizando a la nube:', error);
        }
      }
      
      await loadSavedResources();
      await loadStats();
      
      console.log(`✅ Recurso "${resource.title}" guardado exitosamente`);
    } catch (error) {
      console.error('Error saving resource:', error);
    }
    setIsSaving(null);
  };

  const handleDeleteResource = async (resourceId: string) => {
    setIsDeleting(resourceId);
    try {
      await databaseService.deleteResource(resourceId);
      
      // Eliminar de la nube si está conectado
      if (isCloudConnected) {
        try {
          await cloudSyncService.deleteResourceFromCloud(resourceId);
          console.log('✅ Recurso eliminado de la nube');
        } catch (error) {
          console.warn('⚠️ Error eliminando de la nube:', error);
        }
      }
      
      await loadSavedResources();
      await loadStats();
      
      console.log(`✅ Recurso eliminado exitosamente`);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
    setIsDeleting(null);
  };

  const handleSyncToCloud = async () => {
    if (!isCloudConnected) return;
    
    setIsSyncing(true);
    try {
      await cloudSyncService.syncToCloud();
      await loadStats();
      setLastSyncTime(new Date());
      console.log('✅ Sincronización a la nube completada');
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
    setIsSyncing(false);
  };

  const handleSyncFromCloud = async () => {
    if (!isCloudConnected) return;
    
    setIsSyncing(true);
    try {
      await cloudSyncService.syncFromCloud();
      await loadSavedResources();
      await loadStats();
      setLastSyncTime(new Date());
      console.log('✅ Sincronización desde la nube completada');
    } catch (error) {
      console.error('Error syncing from cloud:', error);
    }
    setIsSyncing(false);
  };

  const getSourceIcon = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source?.icon || Database;
  };

  const getSourceColor = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source?.color || 'gray';
  };

  const isResourceSaved = (resourceId: string) => {
    return savedResources.some(r => r.id === resourceId);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-8 w-8" />
              <h2 className="text-3xl font-bold">APIs Académicas</h2>
            </div>
            <p className="text-indigo-100 text-lg">
              Busca en múltiples fuentes académicas y guarda recursos en tu biblioteca personal
            </p>
          </div>
          
          {/* Cloud Status */}
          <div className="bg-white/10 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Estado de la Nube</span>
              <div className="flex items-center space-x-1">
                {isCloudConnected ? (
                  <Wifi className="h-4 w-4 text-green-300" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-300" />
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isCloudConnected ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {isCloudConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            {isCloudConnected && (
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>En la nube:</span>
                  <span className="font-semibold">{cloudStats?.totalResources || 0}</span>
                </div>
                {lastSyncTime && (
                  <div className="text-xs opacity-75">
                    Última sync: {formatTime(lastSyncTime)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'search'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Buscar en APIs</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'saved'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Recursos Guardados ({savedResources.length})</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'search' ? (
            <>
              {/* Source Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-indigo-600" />
                  Fuentes de Búsqueda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {sources.map((source) => {
                    const Icon = source.icon;
                    const isSelected = selectedSources.includes(source.id);
                    return (
                      <button
                        key={source.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSources(selectedSources.filter(s => s !== source.id));
                          } else {
                            setSelectedSources([...selectedSources, source.id]);
                          }
                        }}
                        className={`p-4 border rounded-lg transition-all text-left ${
                          isSelected
                            ? `border-${source.color}-500 bg-${source.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-5 w-5 ${
                            isSelected ? `text-${source.color}-600` : 'text-gray-500'
                          }`} />
                          <span className={`font-semibold ${
                            isSelected ? `text-${source.color}-900` : 'text-gray-900'
                          }`}>
                            {source.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{source.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Buscar en fuentes académicas... (ej: machine learning, quantum computing)"
                    className="w-full pl-12 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!query.trim() || isSearching || selectedSources.length === 0}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Buscando...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        <span>Buscar</span>
                      </>
                    )}
                  </button>
                </div>
                
                {selectedSources.length === 0 && (
                  <p className="text-red-600 text-sm mt-2">
                    Selecciona al menos una fuente de búsqueda
                  </p>
                )}
                
                <div className="mt-2 text-sm text-gray-600">
                  Fuentes seleccionadas: {selectedSources.map(id => 
                    sources.find(s => s.id === id)?.name
                  ).join(', ')}
                </div>
              </div>

              {/* Loading State */}
              {isSearching && (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Buscando en APIs Académicas...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Consultando {selectedSources.length} fuentes para "{query}"
                  </p>
                  <div className="flex justify-center space-x-6 text-sm text-gray-500">
                    {selectedSources.map(sourceId => {
                      const source = sources.find(s => s.id === sourceId);
                      const Icon = source?.icon || Database;
                      return (
                        <div key={sourceId} className="flex items-center">
                          <Icon className="h-4 w-4 mr-1" />
                          {source?.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {!isSearching && searchResults && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Resultados de la Búsqueda</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      {Object.entries(searchResults).map(([source, results]) => {
                        if (source === 'combined') return null;
                        const sourceInfo = sources.find(s => s.id === source);
                        const Icon = sourceInfo?.icon || Database;
                        return (
                          <div key={source} className="text-center">
                            <Icon className={`h-6 w-6 mx-auto mb-1 text-${sourceInfo?.color || 'gray'}-600`} />
                            <p className="font-semibold text-gray-900">{results.length}</p>
                            <p className="text-gray-600">{sourceInfo?.name}</p>
                          </div>
                        );
                      })}
                      <div className="text-center">
                        <BarChart3 className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
                        <p className="font-semibold text-gray-900">{searchResults.combined.length}</p>
                        <p className="text-gray-600">Total Único</p>
                      </div>
                    </div>
                  </div>

                  {/* Combined Results */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Resultados Combinados ({searchResults.combined.length})
                    </h3>
                    <div className="space-y-4">
                      {searchResults.combined.map((resource, index) => {
                        const sourceId = (resource as any).source || 'unknown';
                        const SourceIcon = getSourceIcon(sourceId);
                        const isSaved = isResourceSaved(resource.id);
                        const saving = isSaving === resource.id;
                        
                        return (
                          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </span>
                                  <SourceIcon className={`h-4 w-4 text-${getSourceColor(sourceId)}-600`} />
                                  <span className="text-sm text-gray-500 capitalize">
                                    {sources.find(s => s.id === sourceId)?.name || sourceId}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                    resource.type === 'book' ? 'bg-green-100 text-green-700' :
                                    resource.type === 'journal' ? 'bg-blue-100 text-blue-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>
                                    {resource.type}
                                  </span>
                                </div>
                                
                                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {resource.title}
                                </h4>
                                
                                <p className="text-sm text-gray-600 mb-2">
                                  por {resource.authors.join(', ')}
                                </p>
                                
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                  {resource.abstract}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {resource.publishedYear}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {resource.citations} citas
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {resource.rating}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col space-y-2 ml-4">
                                {resource.digitalUrl && (
                                  <a
                                    href={resource.digitalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Ver</span>
                                  </a>
                                )}
                                
                                {resource.digitalUrl && (
                                  <a
                                    href={resource.digitalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                                  >
                                    <Download className="h-3 w-3" />
                                    <span>PDF</span>
                                  </a>
                                )}
                                
                                <button
                                  onClick={() => handleSaveResource(resource, sourceId)}
                                  disabled={saving || isSaved}
                                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors text-sm ${
                                    isSaved 
                                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                      : saving
                                      ? 'bg-indigo-100 text-indigo-600 cursor-not-allowed'
                                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                  }`}
                                >
                                  {saving ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                      <span>Guardando...</span>
                                    </>
                                  ) : isSaved ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" />
                                      <span>Guardado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save className="h-3 w-3" />
                                      <span>Guardar</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* No Results */}
              {!isSearching && searchResults && searchResults.combined.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-600">
                    Intenta con términos diferentes o selecciona más fuentes de búsqueda.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Saved Resources Tab */}
              <div className="space-y-6">
                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recursos Guardados</h3>
                    <p className="text-gray-600">
                      {savedResources.length} recursos en tu biblioteca personal
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isCloudConnected && (
                      <>
                        <button
                          onClick={handleSyncToCloud}
                          disabled={isSyncing}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {isSyncing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Cloud className="h-4 w-4" />
                          )}
                          <span>Sincronizar a la Nube</span>
                        </button>
                        
                        <button
                          onClick={handleSyncFromCloud}
                          disabled={isSyncing}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {isSyncing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span>Sincronizar desde la Nube</span>
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={loadSavedResources}
                      disabled={isLoadingSaved}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoadingSaved ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span>Actualizar</span>
                    </button>
                  </div>
                </div>

                {/* Database Stats */}
                {dbStats && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Estadísticas de la Base de Datos
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <HardDrive className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                        <p className="font-semibold text-gray-900">{dbStats.totalResources}</p>
                        <p className="text-gray-600">Total Local</p>
                      </div>
                      {isCloudConnected && cloudStats && (
                        <div className="text-center">
                          <Cloud className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                          <p className="font-semibold text-gray-900">{cloudStats.totalResources}</p>
                          <p className="text-gray-600">En la Nube</p>
                        </div>
                      )}
                      <div className="text-center">
                        <Clock className="h-6 w-6 mx-auto mb-1 text-green-600" />
                        <p className="font-semibold text-gray-900">
                          {dbStats.lastUpdate ? formatTime(new Date(dbStats.lastUpdate)) : 'N/A'}
                        </p>
                        <p className="text-gray-600">Última Actualización</p>
                      </div>
                      <div className="text-center">
                        <Activity className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                        <p className="font-semibold text-gray-900">
                          {Object.keys(dbStats.bySource || {}).length}
                        </p>
                        <p className="text-gray-600">Fuentes</p>
                      </div>
                    </div>
                    
                    {/* Sources Breakdown */}
                    {dbStats.bySource && Object.keys(dbStats.bySource).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Por Fuente:</h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(dbStats.bySource).map(([source, count]) => {
                            const sourceInfo = sources.find(s => s.id === source);
                            const Icon = sourceInfo?.icon || Database;
                            return (
                              <span key={source} className={`px-2 py-1 text-xs rounded-full bg-${sourceInfo?.color || 'gray'}-100 text-${sourceInfo?.color || 'gray'}-700 flex items-center space-x-1`}>
                                <Icon className="h-3 w-3" />
                                <span>{sourceInfo?.name || source}: {count as number}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Saved Resources List */}
                {isLoadingSaved ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando recursos guardados...</p>
                  </div>
                ) : savedResources.length > 0 ? (
                  <div className="space-y-4">
                    {savedResources.map((resource, index) => {
                      const sourceId = (resource as any).source || 'unknown';
                      const SourceIcon = getSourceIcon(sourceId);
                      const deleting = isDeleting === resource.id;
                      
                      return (
                        <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </span>
                                <SourceIcon className={`h-4 w-4 text-${getSourceColor(sourceId)}-600`} />
                                <span className="text-sm text-gray-500 capitalize">
                                  {sources.find(s => s.id === sourceId)?.name || sourceId}
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  resource.type === 'book' ? 'bg-green-100 text-green-700' :
                                  resource.type === 'journal' ? 'bg-blue-100 text-blue-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {resource.type}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Guardado: {(resource as any).dateAdded ? 
                                    formatTime(new Date((resource as any).dateAdded)) : 'N/A'}
                                </span>
                              </div>
                              
                              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {resource.title}
                              </h4>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                por {resource.authors.join(', ')}
                              </p>
                              
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {resource.abstract}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {resource.publishedYear}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {resource.citations} citas
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {resource.rating}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-4">
                              {resource.digitalUrl && (
                                <a
                                  href={resource.digitalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Ver</span>
                                </a>
                              )}
                              
                              <button
                                onClick={() => {/* TODO: Implement view details */}}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Detalles</span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteResource(resource.id)}
                                disabled={deleting}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                              >
                                {deleting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                                    <span>Eliminando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-3 w-3" />
                                    <span>Eliminar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos guardados</h3>
                    <p className="text-gray-600 mb-4">
                      Busca en las APIs académicas y guarda recursos para verlos aquí.
                    </p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                    >
                      <Search className="h-4 w-4" />
                      <span>Ir a Búsqueda</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}