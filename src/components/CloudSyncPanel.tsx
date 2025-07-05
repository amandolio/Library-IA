import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  Wifi, 
  WifiOff,
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Database,
  Upload,
  Download,
  Trash2,
  Settings,
  Activity,
  BarChart3,
  Clock,
  Users,
  Shield,
  Zap,
  Globe,
  Server,
  HardDrive,
  SyncIcon as Sync
} from 'lucide-react';
import { cloudSyncService } from '../services/cloudSyncService';
import { databaseService } from '../services/databaseService';

export function CloudSyncPanel() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState({
    totalResources: 0,
    lastSync: null as Date | null,
    syncCount: 0
  });
  const [localStats, setLocalStats] = useState({
    totalResources: 0,
    bySource: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    lastUpdate: new Date()
  });
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Verificar estado de conexión y estadísticas
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        
        if (!cloudSyncService.isConfigured()) {
          setConnectionStatus('disconnected');
          return;
        }

        const connected = await cloudSyncService.checkConnection();
        setIsConnected(connected);
        setConnectionStatus(connected ? 'connected' : 'error');

        if (connected) {
          const stats = await cloudSyncService.getCloudStats();
          setSyncStats(stats);
        }

        const localData = await databaseService.getStats();
        setLocalStats(localData);
      } catch (error) {
        console.error('Error checking connection:', error);
        setConnectionStatus('error');
      }
    };

    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync cada 5 minutos si está habilitado
  useEffect(() => {
    if (!autoSyncEnabled || !isConnected) return;

    const autoSync = async () => {
      try {
        await handleSyncToCloud();
      } catch (error) {
        console.warn('Auto-sync failed:', error);
      }
    };

    const interval = setInterval(autoSync, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(interval);
  }, [autoSyncEnabled, isConnected]);

  const handleConnect = async () => {
    try {
      setConnectionStatus('checking');
      await cloudSyncService.connect();
      setIsConnected(true);
      setConnectionStatus('connected');
      
      const stats = await cloudSyncService.getCloudStats();
      setSyncStats(stats);
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionStatus('error');
      setIsConnected(false);
    }
  };

  const handleSyncToCloud = async () => {
    if (!isConnected) return;
    
    setIsSyncing(true);
    try {
      await cloudSyncService.syncToCloud();
      
      // Actualizar estadísticas
      const stats = await cloudSyncService.getCloudStats();
      setSyncStats(stats);
      
      // Agregar al historial
      setSyncHistory(prev => [{
        type: 'upload',
        timestamp: new Date(),
        status: 'success',
        resourceCount: localStats.totalResources
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Sync to cloud failed:', error);
      setSyncHistory(prev => [{
        type: 'upload',
        timestamp: new Date(),
        status: 'error',
        error: error.message
      }, ...prev.slice(0, 9)]);
    }
    setIsSyncing(false);
  };

  const handleSyncFromCloud = async () => {
    if (!isConnected) return;
    
    setIsSyncing(true);
    try {
      await cloudSyncService.syncFromCloud();
      
      // Actualizar estadísticas locales
      const localData = await databaseService.getStats();
      setLocalStats(localData);
      
      setSyncHistory(prev => [{
        type: 'download',
        timestamp: new Date(),
        status: 'success',
        resourceCount: syncStats.totalResources
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Sync from cloud failed:', error);
      setSyncHistory(prev => [{
        type: 'download',
        timestamp: new Date(),
        status: 'error',
        error: error.message
      }, ...prev.slice(0, 9)]);
    }
    setIsSyncing(false);
  };

  const handleClearCloudData = async () => {
    if (!isConnected) return;
    
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar todos los datos de la nube? Esta acción no se puede deshacer.'
    );
    
    if (confirmed) {
      try {
        await cloudSyncService.clearCloudData();
        setSyncStats({ totalResources: 0, lastSync: null, syncCount: 0 });
      } catch (error) {
        console.error('Clear cloud data failed:', error);
      }
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-5 w-5 text-green-600" />;
      case 'disconnected': return <WifiOff className="h-5 w-5 text-gray-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking': return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connected': return 'Conectado a Supabase';
      case 'disconnected': return 'No configurado';
      case 'error': return 'Error de conexión';
      case 'checking': return 'Verificando conexión...';
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Nunca';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Cloud className="h-8 w-8" />
              <h2 className="text-3xl font-bold">Sincronización en la Nube</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Gestiona la sincronización de tus datos académicos con Supabase
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center space-x-2 mb-2">
              {getConnectionIcon()}
              <span className="font-semibold">{getConnectionStatus()}</span>
            </div>
            <div className="text-sm opacity-90">
              <p>Usuario: {cloudSyncService.getCurrentUserId()?.slice(0, 8) || 'No conectado'}</p>
              <p>Última sync: {formatTime(syncStats.lastSync)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Setup */}
      {!cloudSyncService.isConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-900">Configuración Requerida</h3>
          </div>
          <p className="text-yellow-800 mb-4">
            Para usar la sincronización en la nube, necesitas configurar Supabase. 
            Haz clic en el botón "Connect to Supabase" en la esquina superior derecha.
          </p>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Pasos para configurar:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
              <li>Haz clic en "Connect to Supabase" en la barra superior</li>
              <li>Crea una cuenta gratuita en Supabase si no tienes una</li>
              <li>Crea un nuevo proyecto</li>
              <li>Copia las credenciales del proyecto</li>
              <li>Pégalas en el formulario de configuración</li>
            </ol>
          </div>
        </div>
      )}

      {/* Connection Controls */}
      {cloudSyncService.isConfigured() && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              Control de Conexión
            </h3>
            
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-sync cada 5 min</span>
              </label>
              
              {!isConnected && connectionStatus !== 'checking' && (
                <button
                  onClick={handleConnect}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Wifi className="h-4 w-4" />
                  <span>Conectar</span>
                </button>
              )}
            </div>
          </div>

          {/* Sync Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <HardDrive className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{localStats.totalResources}</span>
              </div>
              <p className="text-sm text-blue-800 font-medium">Recursos Locales</p>
              <p className="text-xs text-blue-600">En tu dispositivo</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Cloud className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{syncStats.totalResources}</span>
              </div>
              <p className="text-sm text-green-800 font-medium">Recursos en la Nube</p>
              <p className="text-xs text-green-600">En Supabase</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{syncStats.syncCount}</span>
              </div>
              <p className="text-sm text-purple-800 font-medium">Sincronizaciones</p>
              <p className="text-xs text-purple-600">Total realizadas</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-bold text-orange-600">
                  {syncStats.lastSync ? formatTime(syncStats.lastSync).split(' ')[1] : 'N/A'}
                </span>
              </div>
              <p className="text-sm text-orange-800 font-medium">Última Sync</p>
              <p className="text-xs text-orange-600">
                {syncStats.lastSync ? formatTime(syncStats.lastSync).split(' ')[0] : 'Nunca'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sync Actions */}
      {isConnected && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Sync className="h-5 w-5 mr-2 text-green-600" />
            Acciones de Sincronización
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleSyncToCloud}
              disabled={isSyncing}
              className="flex flex-col items-center p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              <CloudUpload className={`h-8 w-8 text-blue-600 mb-3 ${isSyncing ? 'animate-bounce' : ''}`} />
              <h4 className="font-semibold text-gray-900 mb-2">Subir a la Nube</h4>
              <p className="text-sm text-gray-600 text-center">
                Sincronizar datos locales con Supabase
              </p>
              <div className="mt-3 text-xs text-blue-600">
                {localStats.totalResources} recursos locales
              </div>
            </button>

            <button
              onClick={handleSyncFromCloud}
              disabled={isSyncing}
              className="flex flex-col items-center p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all disabled:opacity-50"
            >
              <CloudDownload className={`h-8 w-8 text-green-600 mb-3 ${isSyncing ? 'animate-bounce' : ''}`} />
              <h4 className="font-semibold text-gray-900 mb-2">Descargar de la Nube</h4>
              <p className="text-sm text-gray-600 text-center">
                Obtener datos desde Supabase
              </p>
              <div className="mt-3 text-xs text-green-600">
                {syncStats.totalResources} recursos en la nube
              </div>
            </button>

            <button
              onClick={handleClearCloudData}
              disabled={isSyncing}
              className="flex flex-col items-center p-6 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all disabled:opacity-50"
            >
              <Trash2 className="h-8 w-8 text-red-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Limpiar Nube</h4>
              <p className="text-sm text-gray-600 text-center">
                Eliminar todos los datos de Supabase
              </p>
              <div className="mt-3 text-xs text-red-600">
                ⚠️ Acción irreversible
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Data Breakdown */}
      {isConnected && Object.keys(localStats.bySource).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Desglose de Datos Locales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Por Fuente</h4>
              <div className="space-y-2">
                {Object.entries(localStats.bySource).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">{source}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Por Tipo</h4>
              <div className="space-y-2">
                {Object.entries(localStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync History */}
      {syncHistory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            Historial de Sincronización
          </h3>
          
          <div className="space-y-3">
            {syncHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {entry.type === 'upload' ? (
                    <Upload className={`h-4 w-4 ${entry.status === 'success' ? 'text-blue-600' : 'text-red-600'}`} />
                  ) : (
                    <Download className={`h-4 w-4 ${entry.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.type === 'upload' ? 'Subida a la nube' : 'Descarga de la nube'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(entry.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {entry.status === 'success' ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        {entry.resourceCount} recursos
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Error</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Info */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Server className="h-5 w-5 mr-2 text-gray-600" />
          Información Técnica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Configuración</h4>
            <div className="space-y-1 text-gray-600">
              <p>• <strong>Backend:</strong> Supabase PostgreSQL</p>
              <p>• <strong>Autenticación:</strong> Anónima con Device ID</p>
              <p>• <strong>Sincronización:</strong> Bidireccional</p>
              <p>• <strong>Compresión:</strong> JSON optimizado</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Características</h4>
            <div className="space-y-1 text-gray-600">
              <p>• <strong>Offline-first:</strong> Funciona sin conexión</p>
              <p>• <strong>Deduplicación:</strong> Evita datos duplicados</p>
              <p>• <strong>Versionado:</strong> Control de cambios</p>
              <p>• <strong>Seguridad:</strong> RLS habilitado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}