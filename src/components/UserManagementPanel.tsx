import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserCheck, Clock, Shield, BookOpen, Search,
  Filter, RefreshCw, UserX, Activity, Calendar, Trash2,
  AlertTriangle, Crown, ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/authService';

interface UserRow {
  id: string;
  email: string;
  name: string;
  department: string;
  role: 'admin' | 'lector';
  created_at: string;
  session: { login_at: string; last_seen: string } | null;
}

interface UserManagementPanelProps {
  currentUser: { id: string; role: string };
}

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-management`;

export function UserManagementPanel({ currentUser }: UserManagementPanelProps) {
  const { session, refreshUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'sessions'>('users');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<UserRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const authHeaders = {
    Authorization: `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch(`${EDGE_URL}/users`, { headers: authHeaders });
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const { users: data } = await res.json();
      setUsers(data ?? []);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Re-fetch sessions every 30s
  useEffect(() => {
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  const handleRoleChange = async (target: UserRow, newRole: 'admin' | 'lector') => {
    setActionLoading(target.id);
    try {
      const res = await fetch(`${EDGE_URL}/users/${target.id}/role`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Error al cambiar rol');
      showToast(`Rol de ${target.name} cambiado a ${newRole === 'admin' ? 'Administrador' : 'Lector'}`);
      await fetchUsers();
      if (target.id === currentUser.id) await refreshUser();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
      setRoleChangeTarget(null);
    }
  };

  const handleKickSession = async (userId: string, name: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${EDGE_URL}/sessions/${userId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Error al cerrar sesion');
      showToast(`Sesion de ${name} cerrada`);
      await fetchUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(userToDelete.id);
    try {
      // Delete from Supabase auth via edge function — skip for now, just remove session + profile
      await supabase.from('active_sessions').delete().eq('user_id', userToDelete.id);
      await supabase.from('user_profiles').delete().eq('id', userToDelete.id);
      showToast(`Usuario ${userToDelete.name} eliminado`);
      await fetchUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
      setUserToDelete(null);
    }
  };

  const isOnline = (lastSeen: string) => {
    return new Date().getTime() - new Date(lastSeen).getTime() < 90000; // 90s threshold
  };

  const formatTime = (iso: string) =>
    new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(iso));

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

  const getSessionDuration = (loginAt: string) => {
    const diff = new Date().getTime() - new Date(loginAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
  };

  const activeSessions = users.filter(u => u.session !== null);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    lectores: users.filter(u => u.role === 'lector').length,
    online: activeSessions.filter(u => u.session && isOnline(u.session.last_seen)).length,
  };

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion de Usuarios</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Administra usuarios y sesiones activas del sistema</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Usuarios', value: stats.total, icon: Users, color: 'text-blue-600' },
          { label: 'Administradores', value: stats.admins, icon: Shield, color: 'text-red-600' },
          { label: 'Lectores', value: stats.lectores, icon: BookOpen, color: 'text-blue-500' },
          { label: 'En Linea Ahora', value: stats.online, icon: UserCheck, color: 'text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {([
              { key: 'users', label: `Usuarios (${stats.total})`, icon: Users },
              { key: 'sessions', label: `Sesiones Activas (${activeSessions.length})`, icon: Activity },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : activeTab === 'users' ? (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, email o departamento..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="lector">Lectores</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredUsers.map(user => {
                  const isCurrentUser = user.id === currentUser.id;
                  const online = user.session && isOnline(user.session.last_seen);
                  const busy = actionLoading === user.id;

                  return (
                    <div key={user.id} className={`p-4 border rounded-xl transition-all ${
                      isCurrentUser
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                              online ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded-full">Tu</span>
                              )}
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1 ${
                                user.role === 'admin'
                                  ? 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                                  : 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
                              }`}>
                                {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                                {user.role === 'admin' ? 'Administrador' : 'Lector'}
                              </span>
                              {online && (
                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                  En linea
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{user.department}</p>
                          </div>
                        </div>

                        {/* Actions — only for admin acting on others */}
                        {currentUser.role === 'admin' && !isCurrentUser && (
                          <div className="flex items-center space-x-2">
                            {/* Role toggle */}
                            <button
                              disabled={busy}
                              onClick={() => setRoleChangeTarget(user)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              <Crown className="h-3.5 w-3.5" />
                              Cambiar rol
                              <ChevronDown className="h-3 w-3" />
                            </button>

                            {/* Delete */}
                            {user.role !== 'admin' && (
                              <button
                                disabled={busy}
                                onClick={() => setUserToDelete(user)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-3">
                {activeSessions.map(user => {
                  if (!user.session) return null;
                  const online = isOnline(user.session.last_seen);
                  const busy = actionLoading === user.id;
                  return (
                    <div key={user.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                              online ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                online
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                              }`}>
                                {online ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Inicio: {formatTime(user.session.login_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(user.session.login_at)}
                              </span>
                              <span>Duracion: {getSessionDuration(user.session.login_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right text-xs text-gray-400 dark:text-gray-500">
                            <p>Ultima actividad:</p>
                            <p>{formatTime(user.session.last_seen)}</p>
                          </div>
                          {user.id !== currentUser.id && currentUser.role === 'admin' && (
                            <button
                              disabled={busy}
                              onClick={() => handleKickSession(user.id, user.name)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                              title="Cerrar sesion"
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

              {activeSessions.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay sesiones activas en este momento</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {roleChangeTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <Crown className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cambiar Rol</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Selecciona el nuevo rol para <strong>{roleChangeTarget.name}</strong>:
            </p>
            <div className="space-y-2 mb-6">
              {(['admin', 'lector'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(roleChangeTarget, role)}
                  disabled={roleChangeTarget.role === role}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    roleChangeTarget.role === role
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30 opacity-60 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  {role === 'admin' ? <Shield className="h-5 w-5 text-red-600" /> : <BookOpen className="h-5 w-5 text-blue-600" />}
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{role === 'admin' ? 'Administrador' : 'Lector'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {role === 'admin' ? 'Acceso completo al sistema' : 'Acceso de lectura'}
                    </p>
                  </div>
                  {roleChangeTarget.role === role && (
                    <span className="ml-auto text-xs text-red-600 font-medium">Actual</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setRoleChangeTarget(null)}
              className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Eliminacion</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Estas a punto de eliminar la cuenta de <strong>{userToDelete.name}</strong> ({userToDelete.email}).
            </p>
            <p className="text-red-600 text-sm font-medium mb-6">Esta accion no se puede deshacer.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading === userToDelete.id}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
