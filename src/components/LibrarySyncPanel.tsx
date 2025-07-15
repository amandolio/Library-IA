import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Clock,
  BookOpen,
  TrendingUp,
  Activity,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';
import { 
  getLibrarySyncStatus, 
  syncWithLibrarySystem,
  LibrarySystemSync 
} from '../data/mockData';

export function LibrarySyncPanel() {
  const [syncStatus, setSyncStatus] = useState<LibrarySystemSync>(getLibrarySyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState<LibrarySystemSync[]>([]);

  useEffect(() => {
    // Actualizar estado cada 30 segundos
    const interval = setInterval(() => {
      const status = getLibrarySyncStatus();
      setSyncStatus(status);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncWithLibrarySystem();
      setSyncStatus(result);
      setSyncHistory(prev => [result, ...prev.slice(0, 9)]); // Mantener últimas 10 sincronizaciones
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
    setIsSyncing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sincronización Bibliotecaria</h2>
          <p className="text-gray-600 mt-1">
            Estado y gestión de la sincronización con el sistema bibliotecario
          </p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(syncStatus.syncStatus)}
              <h3 className="font-semibold text-gray-900">Estado</h3>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(syncStatus.syncStatus)}`}>
            {syncStatus.syncStatus === 'active' ? 'Activo' :
             syncStatus.syncStatus === 'error' ? 'Error' : 'Inactivo'}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Última sync: {formatTime(syncStatus.lastSyncTime)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Recursos</h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{syncStatus.totalResources}</p>
          <p className="text-sm text-gray-600">Total en sistema</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Nuevos</h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{syncStatus.newResources}</p>
          <p className="text-sm text-gray-600">Última sincronización</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Actualizados</h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">{syncStatus.updatedResources}</p>
          <p className="text-sm text-gray-600">Última sincronización</p>
        </div>
      </div>

      {/* Sync Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Configuración de Sincronización</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Parámetros de Sincronización</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Intervalo automático:</span>
                <span className="text-sm font-medium text-gray-900">5 minutos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Timeout de conexión:</span>
                <span className="text-sm font-medium text-gray-900">30 segundos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reintentos automáticos:</span>
                <span className="text-sm font-medium text-gray-900">3 intentos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modo de sincronización:</span>
                <span className="text-sm font-medium text-gray-900">Incremental</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Datos Sincronizados</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Disponibilidad de recursos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Estados de préstamo</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Reservas activas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Nuevas adquisiciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Metadatos actualizados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Rendimiento del Sistema</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">99.8%</p>
            <p className="text-sm text-gray-600">Disponibilidad del sistema</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">1.2s</p>
            <p className="text-sm text-gray-600">Tiempo promedio de sync</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">98.5%</p>
            <p className="text-sm text-gray-600">Tasa de éxito</p>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {syncStatus.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Errores de Sincronización</h3>
          </div>
          <div className="space-y-2">
            {syncStatus.errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={handleManualSync}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Reintentar Sincronización
            </button>
          </div>
        </div>
      )}

      {/* Sync History */}
      {syncHistory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Sincronizaciones</h3>
          <div className="space-y-3">
            {syncHistory.map((sync, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(sync.syncStatus)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatTime(sync.lastSyncTime)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sync.newResources} nuevos, {sync.updatedResources} actualizados
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{sync.totalResources} recursos</p>
                  {sync.errors.length > 0 && (
                    <p className="text-xs text-red-600">{sync.errors.length} errores</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}