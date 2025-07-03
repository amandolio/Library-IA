import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Database, 
  Download, 
  RefreshCw, 
  BookOpen, 
  FileText, 
  Globe, 
  Brain,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Settings,
  Zap,
  TrendingUp,
  Activity,
  Archive,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Cloud,
  CloudOff,
  Upload,
  Sync
} from 'lucide-react';
import { Resource } from '../types';
import { ResourceCard } from './ResourceCard';
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
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'crossref', 'openLibrary', 'semanticScholar', 'googleBooks'
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [dbStats, setDbStats] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'database' | 'history' | 'saved'>('search');
  const [savedResourcesFilter, setSavedResourcesFilter] = useState({
    source: 'all',
    type: 'all',
    searchTerm: ''
  });
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'connected' | 'disconnected' | 'syncing' | 'error'>('disconnected');
  const [lastCloudSync, setLastCloudSync] = useState<Date | null>(null);
  const [cloudStats, setCloudStats] = useState<any>(null);

  useEffect(() => {
    initializeDatabase();
    loadSearchHistory();
    initializeCloudSync();
    if (activeTab === 'saved') {
      loadSavedResources();
    }
  }, [activeTab]);

  const initializeDatabase = async () => {
    try {
      await databaseService.init();
      const stats = await databaseService.getStats();
      setDbStats(stats);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  const initializeCloudSync = async () => {
    try {
      const isConnected = await cloudSyncService.checkConnection();
      if (isConnected) {
        setCloudSyncStatus('connected');
        const lastSync = await cloudSyncService.getLastSyncTime();
        setLastCloudSync(lastSync);
        const stats = await cloudSyncService.getCloudStats();
        setCloudStats(stats);
      } else {
        setCloudSyncStatus('disconnected');
      }
    } catch (error) {
      console.error('Error initializing cloud sync:', error);
      setCloudSyncStatus('error');
    }
  };

  const handleCloudSync = async () => {
    if (cloudSyncStatus === 'syncing') return;
    
    setCloudSyncStatus('syncing');
    try {
      // Sincronizar datos locales con la nube
      await cloudSyncService.syncToCloud();
      
      // Descargar datos de la nube y fusionar con datos locales
      await cloudSyncService.syncFromCloud();
      
      // Actualizar estadísticas locales
      const stats = await databaseService.getStats();
      setDbStats(stats);
      
      // Actualizar estadísticas de la nube
      const cloudStats = await cloudSyncService.getCloudStats();
      setCloudStats(cloudStats);
      
      setLastCloudSync(new Date());
      setCloudSyncStatus('connected');
      
      // Recargar recursos guardados si estamos en esa pestaña
      if (activeTab === 'saved') {
        await loadSavedResources();
      }
      
      alert('✅ Sincronización completada exitosamente');
    } catch (error) {
      console.error('Error during cloud sync:', error);
      setCloudSyncStatus('error');
      alert('❌ Error durante la sincronización: ' + (error as Error).message);
    }
  };

  const handleConnectToCloud = async () => {
    try {
      const connected = await cloudSyncService.connect();
      if (connected) {
        setCloudSyncStatus('connected');
        await handleCloudSync(); // Sincronizar inmediatamente después de conectar
      }
    } catch (error) {
      console.error('Error connecting to cloud:', error);
      setCloudSyncStatus('error');
      alert('Error al conectar con la nube: ' + (error as Error).message);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await databaseService.getSearchHistory(20);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const loadSavedResources = async () => {
    setIsLoadingSaved(true);
    try {
      let resources = await databaseService.getAllResources();
      
      // Aplicar filtros
      if (savedResourcesFilter.source !== 'all') {
        resources = await databaseService.getResourcesBySource(savedResourcesFilter.source);
      }
      
      if (savedResourcesFilter.type !== 'all') {
        resources = resources.filter(r => r.type === savedResourcesFilter.type);
      }
      
      if (savedResourcesFilter.searchTerm) {
        const searchTerm = savedResourcesFilter.searchTerm.toLowerCase();
        resources = resources.filter(r => 
          r.title.toLowerCase().includes(searchTerm) ||
          r.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
          r.abstract.toLowerCase().includes(searchTerm) ||
          r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      setSavedResources(resources);
    } catch (error) {
      console.error('Error loading saved resources:', error);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este recurso de la base de datos?')) {
      try {
        await databaseService.deleteResource(resourceId);
        
        // Si estamos conectados a la nube, también eliminar de allí
        if (cloudSyncStatus === 'connected') {
          await cloudSyncService.deleteResourceFromCloud(resourceId);
        }
        
        await loadSavedResources();
        
        // Actualizar estadísticas
        const stats = await databaseService.getStats();
        setDbStats(stats);
        
        alert('Recurso eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error al eliminar el recurso');
      }
    }
  };

  const handleExportData = async () => {
    try {
      const data = await databaseService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `libraryai-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar los datos');
    }
  };

  const sources = [
    {
      id: 'crossref',
      name: 'CrossRef',
      description: 'Artículos académicos y DOIs',
      icon: FileText,
      color: 'blue',
      enabled: true
    },
    {
      id: 'openLibrary',
      name: 'Open Library',
      description: 'Libros y literatura',
      icon: BookOpen,
      color: 'green',
      enabled: true
    },
    {
      id: 'arxiv',
      name: 'arXiv',
      description: 'Preprints científicos',
      icon: Brain,
      color: 'red',
      enabled: false
    },
    {
      id: 'semanticScholar',
      name: 'Semantic Scholar',
      description: 'Papers de CS y medicina',
      icon: Activity,
      color: 'purple',
      enabled: true
    },
    {
      id: 'googleBooks',
      name: 'Google Books',
      description: 'Libros y publicaciones',
      icon: Globe,
      color: 'yellow',
      enabled: true
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchResults(null);
    
    try {
      console.log('🔍 Iniciando búsqueda académica...');
      const results = await academicAPI.searchAllSources(query, 15);
      setSearchResults(results);
      
      // Guardar búsqueda en historial
      await databaseService.saveSearch(query, results.combined, 'academic-apis');
      await loadSearchHistory();
      
    } catch (error) {
      console.error('Error en búsqueda académica:', error);
      alert('Error al realizar la búsqueda. Por favor, intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveResults = async () => {
    if (!searchResults) return;
    
    setIsSaving(true);
    setSavedCount(0);
    
    try {
      let totalSaved = 0;
      
      // Guardar resultados por fuente
      for (const [source, resources] of Object.entries(searchResults)) {
        if (source !== 'combined' && resources.length > 0) {
          const saved = await databaseService.saveResources(resources, source);
          totalSaved += saved;
          setSavedCount(totalSaved);
        }
      }
      
      // Si estamos conectados a la nube, sincronizar automáticamente
      if (cloudSyncStatus === 'connected') {
        try {
          await cloudSyncService.syncToCloud();
          setLastCloudSync(new Date());
        } catch (error) {
          console.warn('Error syncing to cloud:', error);
        }
      }
      
      // Actualizar estadísticas
      const stats = await databaseService.getStats();
      setDbStats(stats);
      
      alert(`✅ Se guardaron ${totalSaved} recursos en la base de datos${cloudSyncStatus === 'connected' ? ' y se sincronizaron con la nube' : ''}`);
      
    } catch (error) {
      console.error('Error guardando resultados:', error);
      alert('Error al guardar los resultados en la base de datos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const getSourceIcon = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source?.icon || FileText;
  };

  const getSourceColor = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source?.color || 'gray';
  };

  const sampleQueries = [
    'machine learning algorithms',
    'quantum computing applications',
    'artificial intelligence ethics',
    'climate change mitigation',
    'blockchain technology',
    'renewable energy systems',
    'data science methods',
    'cybersecurity frameworks'
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCloudSyncIcon = () => {
    switch (cloudSyncStatus) {
      case 'connected': return <Cloud className="h-4 w-4 text-green-600" />;
      case 'syncing': return <Sync className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error': return <CloudOff className="h-4 w-4 text-red-600" />;
      default: return <CloudOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCloudSyncLabel = () => {
    switch (cloudSyncStatus) {
      case 'connected': return 'Conectado a la nube';
      case 'syncing': return 'Sincronizando...';
      case 'error': return 'Error de conexión';
      default: return 'Sin conexión a la nube';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Búsqueda Académica Avanzada</h2>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-indigo-100 text-lg">
            Conecta con fuentes académicas confiables y sincroniza tus recursos en la nube
          </p>
          
          {/* Cloud Sync Status */}
          <div className="bg-white/10 rounded-lg p-4 min-w-[250px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getCloudSyncIcon()}
                <span className="text-sm font-medium">{getCloudSyncLabel()}</span>
              </div>
              {cloudSyncStatus === 'disconnected' ? (
                <button
                  onClick={handleConnectToCloud}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
                >
                  Conectar
                </button>
              ) : cloudSyncStatus === 'connected' ? (
                <button
                  onClick={handleCloudSync}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
                >
                  Sincronizar
                </button>
              ) : null}
            </div>
            {lastCloudSync && (
              <div className="text-xs opacity-75">
                Última sync: {lastCloudSync.toLocaleTimeString()}
              </div>
            )}
            {cloudStats && (
              <div className="text-xs opacity-75 mt-1">
                En la nube: {cloudStats.totalResources} recursos
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
                <span>Búsqueda en APIs</span>
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
                <Archive className="h-4 w-4" />
                <span>Recursos Guardados ({dbStats?.totalResources || 0})</span>
                {cloudSyncStatus === 'connected' && (
                  <Cloud className="h-3 w-3 text-green-600" />
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'database'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Estadísticas BD</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Historial ({searchHistory.length})</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'search' && (
            <>
              {/* Source Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                  Fuentes Académicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {sources.map((source) => {
                    const Icon = source.icon;
                    const isSelected = selectedSources.includes(source.id);
                    
                    return (
                      <button
                        key={source.id}
                        onClick={() => source.enabled && handleSourceToggle(source.id)}
                        disabled={!source.enabled}
                        className={`p-4 border rounded-lg transition-all text-left ${
                          !source.enabled 
                            ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                            : isSelected
                            ? `border-${source.color}-500 bg-${source.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className={`h-5 w-5 ${
                            !source.enabled 
                              ? 'text-gray-400'
                              : isSelected 
                              ? `text-${source.color}-600` 
                              : 'text-gray-500'
                          }`} />
                          <span className={`font-semibold ${
                            !source.enabled 
                              ? 'text-gray-400'
                              : isSelected 
                              ? `text-${source.color}-900` 
                              : 'text-gray-900'
                          }`}>
                            {source.name}
                          </span>
                          {!source.enabled && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              Próximamente
                            </span>
                          )}
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
                    placeholder="Buscar en fuentes académicas (ej: machine learning, quantum computing)..."
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
                
                {/* Sample Queries */}
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Consultas de ejemplo:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleQueries.map((sampleQuery, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(sampleQuery)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        {sampleQuery}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isSearching && (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Buscando en Fuentes Académicas...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Consultando {selectedSources.length} fuentes para "{query}"
                  </p>
                  <div className="flex justify-center space-x-6 text-sm text-gray-500">
                    {selectedSources.map(sourceId => {
                      const source = sources.find(s => s.id === sourceId);
                      const Icon = source?.icon || FileText;
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
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Resultados de Búsqueda Académica
                      </h3>
                      {searchResults.combined.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSaveResults}
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Guardando... ({savedCount})</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                <span>Guardar en BD</span>
                              </>
                            )}
                          </button>
                          {cloudSyncStatus === 'connected' && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <Cloud className="h-3 w-3" />
                              <span>Se sincronizará automáticamente</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {Object.entries(searchResults).map(([source, resources]) => {
                        if (source === 'combined') return null;
                        const Icon = getSourceIcon(source);
                        const color = getSourceColor(source);
                        
                        return (
                          <div key={source} className={`p-3 bg-${color}-50 rounded-lg text-center`}>
                            <Icon className={`h-6 w-6 text-${color}-600 mx-auto mb-1`} />
                            <p className={`text-sm font-semibold text-${color}-900`}>
                              {sources.find(s => s.id === source)?.name}
                            </p>
                            <p className={`text-lg font-bold text-${color}-600`}>
                              {resources.length}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Combined Results */}
                  {searchResults.combined.length > 0 ? (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Recursos Encontrados ({searchResults.combined.length})
                      </h3>
                      <div className="space-y-6">
                        {searchResults.combined.map((resource, index) => (
                          <div key={resource.id} className="relative">
                            <div className="absolute -left-4 top-4 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                              {index + 1}
                            </div>
                            <div className="ml-6">
                              <ResourceCard resource={resource} />
                              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-4">
                                  <span>Fuente: <strong>{(resource as any).source}</strong></span>
                                  <span>Agregado: <strong>{new Date((resource as any).dateAdded).toLocaleDateString()}</strong></span>
                                </div>
                                {resource.digitalUrl && (
                                  <a
                                    href={resource.digitalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Ver recurso</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                      <p className="text-gray-600">
                        Intenta con términos de búsqueda diferentes o selecciona más fuentes.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-6">
              {/* Filters and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={savedResourcesFilter.searchTerm}
                      onChange={(e) => {
                        setSavedResourcesFilter(prev => ({ ...prev, searchTerm: e.target.value }));
                        // Recargar recursos con filtro aplicado
                        setTimeout(loadSavedResources, 300);
                      }}
                      placeholder="Buscar en recursos guardados..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                  </div>
                  
                  <select
                    value={savedResourcesFilter.source}
                    onChange={(e) => {
                      setSavedResourcesFilter(prev => ({ ...prev, source: e.target.value }));
                      loadSavedResources();
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todas las fuentes</option>
                    {sources.map(source => (
                      <option key={source.id} value={source.id}>{source.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={savedResourcesFilter.type}
                    onChange={(e) => {
                      setSavedResourcesFilter(prev => ({ ...prev, type: e.target.value }));
                      loadSavedResources();
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="book">Libros</option>
                    <option value="journal">Artículos</option>
                    <option value="thesis">Tesis</option>
                    <option value="conference">Conferencias</option>
                    <option value="dataset">Datasets</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadSavedResources}
                    disabled={isLoadingSaved}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingSaved ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                  
                  {cloudSyncStatus === 'connected' && (
                    <button
                      onClick={handleCloudSync}
                      disabled={cloudSyncStatus === 'syncing'}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {cloudSyncStatus === 'syncing' ? (
                        <Sync className="h-4 w-4 animate-spin" />
                      ) : (
                        <Cloud className="h-4 w-4" />
                      )}
                      <span>Sincronizar</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleExportData}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>

              {/* Cloud Sync Info */}
              {cloudSyncStatus === 'connected' && cloudStats && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Sincronización en la Nube Activa</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Recursos locales:</span>
                      <span className="font-semibold text-blue-900 ml-2">{dbStats?.totalResources || 0}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Recursos en la nube:</span>
                      <span className="font-semibold text-blue-900 ml-2">{cloudStats.totalResources}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Última sincronización:</span>
                      <span className="font-semibold text-blue-900 ml-2">
                        {lastCloudSync ? lastCloudSync.toLocaleString() : 'Nunca'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Tus recursos se sincronizan automáticamente entre dispositivos y navegadores.
                  </p>
                </div>
              )}

              {/* Saved Resources List */}
              {isLoadingSaved ? (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando recursos guardados...</h3>
                </div>
              ) : savedResources.length > 0 ? (
                <div className="space-y-4">
                  {savedResources.map((resource, index) => (
                    <div key={resource.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <ResourceCard resource={resource} />
                          
                          {/* Metadata adicional */}
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Database className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Fuente:</span>
                                <span className="font-semibold text-gray-900 capitalize">
                                  {(resource as any).source || 'Desconocida'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Guardado:</span>
                                <span className="font-semibold text-gray-900">
                                  {(resource as any).dateAdded ? formatDate((resource as any).dateAdded) : 'N/A'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Tipo:</span>
                                <span className="font-semibold text-gray-900 capitalize">
                                  {resource.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {resource.digitalUrl && (
                            <a
                              href={resource.digitalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver recurso"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar recurso"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos guardados</h3>
                  <p className="text-gray-600 mb-4">
                    Los recursos que guardes desde las búsquedas académicas aparecerán aquí.
                  </p>
                  {cloudSyncStatus === 'disconnected' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm mb-2">
                        💡 <strong>Consejo:</strong> Conecta a la nube para sincronizar tus recursos entre dispositivos
                      </p>
                      <button
                        onClick={handleConnectToCloud}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Conectar a la Nube
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setActiveTab('search')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ir a Búsqueda
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Database Stats */}
              {dbStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-indigo-600">Total Recursos</p>
                        <p className="text-2xl font-bold text-indigo-900">{dbStats.totalResources}</p>
                      </div>
                      <Database className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Fuentes</p>
                        <p className="text-2xl font-bold text-green-900">{Object.keys(dbStats.bySource).length}</p>
                      </div>
                      <Globe className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600">Tipos</p>
                        <p className="text-2xl font-bold text-purple-900">{Object.keys(dbStats.byType).length}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600">Idiomas</p>
                        <p className="text-2xl font-bold text-orange-900">{Object.keys(dbStats.byLanguage).length}</p>
                      </div>
                      <Globe className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Cloud Sync Stats */}
              {cloudSyncStatus === 'connected' && cloudStats && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                    Estadísticas de la Nube
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{cloudStats.totalResources}</p>
                      <p className="text-sm text-gray-600">Recursos en la nube</p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Sync className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{cloudStats.syncCount || 0}</p>
                      <p className="text-sm text-gray-600">Sincronizaciones realizadas</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">
                        {lastCloudSync ? lastCloudSync.toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">Última sincronización</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Breakdown */}
              {dbStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Por Fuente</h4>
                    <div className="space-y-2">
                      {Object.entries(dbStats.bySource).map(([source, count]) => (
                        <div key={source} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{source}</span>
                          <span className="font-semibold">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Por Tipo</h4>
                    <div className="space-y-2">
                      {Object.entries(dbStats.byType).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{type}</span>
                          <span className="font-semibold">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Por Idioma</h4>
                    <div className="space-y-2">
                      {Object.entries(dbStats.byLanguage).map(([language, count]) => (
                        <div key={language} className="flex justify-between text-sm">
                          <span className="text-gray-600 uppercase">{language}</span>
                          <span className="font-semibold">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Historial de Búsquedas</h3>
              {searchHistory.length > 0 ? (
                <div className="space-y-3">
                  {searchHistory.map((search, index) => (
                    <div key={search.id || index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">"{search.query}"</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Fuente: {search.source}</span>
                            <span>Resultados: {search.resultCount}</span>
                            <span>{new Date(search.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setQuery(search.query)}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
                        >
                          Repetir búsqueda
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin historial</h3>
                  <p className="text-gray-600">
                    Realiza búsquedas académicas para ver tu historial aquí.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Initial State */}
      {activeTab === 'search' && !searchResults && !isSearching && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Database className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Búsqueda Académica Avanzada con Sincronización en la Nube
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Conecta con fuentes académicas confiables como CrossRef, Open Library, Semantic Scholar y Google Books. 
            Los resultados se guardan automáticamente y se sincronizan en la nube para acceso desde cualquier dispositivo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">CrossRef</h4>
              <p className="text-sm text-gray-600">Artículos académicos con DOI</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Open Library</h4>
              <p className="text-sm text-gray-600">Millones de libros gratuitos</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Semantic Scholar</h4>
              <p className="text-sm text-gray-600">Papers de CS y medicina</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Cloud className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Sincronización</h4>
              <p className="text-sm text-gray-600">Acceso desde cualquier dispositivo</p>
            </div>
          </div>
          
          {cloudSyncStatus === 'disconnected' && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                <CloudOff className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Conecta a la Nube</h4>
              </div>
              <p className="text-blue-800 text-sm mb-3">
                Sincroniza tus recursos entre navegadores y dispositivos
              </p>
              <button
                onClick={handleConnectToCloud}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Conectar Ahora
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}