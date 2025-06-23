import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Shield, 
  GraduationCap, 
  BookOpen,
  Search,
  Filter,
  RefreshCw,
  Eye,
  UserX,
  Activity,
  Calendar,
  MapPin,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';
import { 
  getAllUsers, 
  getActiveSessions, 
  updateSessionActivity, 
  closeSession, 
  cleanInactiveSessions,
  deleteUserFromDatabase,
  ActiveSession 
} from '../data/mockData';

interface UserManagementPanelProps {
  currentUser: User;
}

export function UserManagementPanel({ currentUser }: UserManagementPanelProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'sessions'>('users');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Actualizar datos cada 30 segundos
  useEffect(() => {
    const updateData = () => {
      cleanInactiveSessions();
      setAllUsers(getAllUsers());
      setActiveSessions(getActiveSessions());
    };

    updateData();
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    cleanInactiveSessions();
    setAllUsers(getAllUsers());
    setActiveSessions(getActiveSessions());
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCloseSession = (userId: string) => {
    closeSession(userId);
    setActiveSessions(getActiveSessions());
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === 'admin') {
      alert('No se pueden eliminar cuentas de administrador');
      return;
    }
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const success = deleteUserFromDatabase(userToDelete.id);
      if (success) {
        setAllUsers(getAllUsers());
        setActiveSessions(getActiveSessions());
        alert(`Usuario ${userToDelete.name} eliminado exitosamente`);
      } else {
        alert('Error al eliminar el usuario');
      }
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'faculty': return BookOpen;
      case 'student': return GraduationCap;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50 border-red-200';
      case 'faculty': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'student': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'faculty': return 'Docente';
      case 'student': return 'Estudiante';
      default: return role;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getSessionDuration = (loginTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - loginTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const isSessionActive = (lastActivity: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastActivity.getTime();
    return diff < 5 * 60 * 1000; // Activo si la última actividad fue hace menos de 5 minutos
  };

  const userStats = {
    total: allUsers.length,
    admins: allUsers.filter(u => u.role === 'admin').length,
    faculty: allUsers.filter(u => u.role === 'faculty').length,
    students: allUsers.filter(u => u.role === 'student').length,
    activeSessions: activeSessions.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">
            Administra usuarios registrados y sesiones activas del sistema
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-red-600">{userStats.admins}</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Docentes</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.faculty}</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estudiantes</p>
              <p className="text-2xl font-bold text-blue-600">{userStats.students}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sesiones Activas</p>
              <p className="text-2xl font-bold text-green-600">{userStats.activeSessions}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Usuarios Registrados ({userStats.total})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sessions'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Sesiones Activas ({userStats.activeSessions})</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' ? (
            <>
              {/* Search and Filter */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, email o departamento..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="faculty">Docentes</option>
                    <option value="student">Estudiantes</option>
                  </select>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  const isCurrentUser = user.id === currentUser.id;
                  const hasActiveSession = activeSessions.some(s => s.userId === user.id);
                  const canDelete = user.role !== 'admin' && !isCurrentUser;
                  
                  return (
                    <div key={user.id} className={`p-4 border rounded-lg transition-all ${
                      isCurrentUser ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <RoleIcon className="h-6 w-6 text-gray-600" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              {isCurrentUser && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                  Tú
                                </span>
                              )}
                              {hasActiveSession && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                  En línea
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                                {getRoleLabel(user.role)}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.department}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
                  <p className="text-gray-600">
                    Intenta ajustar los filtros de búsqueda.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Active Sessions */}
              <div className="space-y-4">
                {activeSessions.map((session) => {
                  const RoleIcon = getRoleIcon(session.user.role);
                  const isActive = isSessionActive(session.lastActivity);
                  
                  return (
                    <div key={session.sessionId} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center relative">
                            <RoleIcon className="h-6 w-6 text-gray-600" />
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              isActive ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{session.user.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{session.user.email}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Inicio: {formatTime(session.loginTime)}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(session.loginTime)}
                              </span>
                              <span>
                                Duración: {getSessionDuration(session.loginTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-xs text-gray-500">
                            <p>Última actividad:</p>
                            <p>{formatTime(session.lastActivity)}</p>
                          </div>
                          {session.userId !== currentUser.id && (
                            <button
                              onClick={() => handleCloseSession(session.userId)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cerrar sesión"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeSessions.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sesiones activas</h3>
                  <p className="text-gray-600">
                    Actualmente no hay usuarios conectados al sistema.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar la cuenta del usuario?
              </p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{userToDelete.name}</p>
                <p className="text-sm text-gray-600">{userToDelete.email}</p>
                <p className="text-sm text-gray-600">{getRoleLabel(userToDelete.role)} - {userToDelete.department}</p>
              </div>
              <p className="text-red-600 text-sm mt-3 font-medium">
                Esta acción no se puede deshacer. El usuario perderá acceso al sistema inmediatamente.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteUser}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteUser}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar Usuario</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}