import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  X,
  GraduationCap,
  BookOpen,
  Shield,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '../types';
import {
  superAdmin,
  validateEmailDomain,
  getRequiredDomain,
  findUserByEmail,
  addUserToDatabase,
  createSession,
  usernameExists
} from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  currentUser?: UserType | null;
  isAdminCreating?: boolean;
}

export function AuthModal({ isOpen, onClose, onLogin, currentUser, isAdminCreating = false }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(!isAdminCreating);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'lector' as 'lector' | 'admin',
    department: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const departments = [
    'Computer Science',
    'Mathematics',
    'Engineering',
    'Physics',
    'Biology',
    'Chemistry',
    'Economics',
    'Psychology',
    'Philosophy',
    'Literature'
  ];

  const roleIcons = {
    lector: BookOpen,
    admin: Shield
  };

  const roleLabels = {
    lector: 'Lector',
    admin: 'Administrador'
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = 'El nombre de usuario solo puede contener letras, números, puntos y guiones';
    } else if (!isLogin && usernameExists(formData.username, formData.role)) {
      newErrors.username = 'Este nombre de usuario ya está en uso';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6 && !(isLogin && formData.username !== 'alainr')) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin || isAdminCreating) {
      if (!formData.fullName) {
        newErrors.fullName = 'El nombre completo es requerido';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!formData.department) {
        newErrors.department = 'El departamento es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      if (isLogin && !isAdminCreating) {
        const email = `${formData.username}@${formData.role === 'admin' ? 'administrador' : 'lector'}.uci.cu`;
        const foundUser = findUserByEmail(email);

        if (foundUser) {
          if (formData.username === 'alainr' && formData.password !== 'Sis19900*') {
            setErrors({ password: 'Contraseña incorrecta para el superadministrador' });
            setIsLoading(false);
            return;
          }

          const session = createSession(foundUser);
          console.log(`Usuario logueado: ${foundUser.name} (${foundUser.email})`);
          console.log(`Sesión creada: ${session.sessionId}`);

          onLogin(foundUser);
          onClose();
        } else {
          setErrors({ username: 'Usuario no encontrado o credenciales incorrectas' });
        }
      } else {
        const email = `${formData.username}@${formData.role === 'admin' ? 'administrador' : 'lector'}.uci.cu`;
        const newUser: UserType = {
          id: `user-${Date.now()}`,
          name: formData.fullName,
          email: email,
          role: formData.role,
          department: formData.department,
          academicLevel: formData.role === 'admin' ? 'Administrator' : 'Reader',
          interests: ['General Interest'],
          readingHistory: [],
          favoriteGenres: [formData.department],
          researchAreas: ['General Research']
        };

        addUserToDatabase(newUser);

        setSuccessMessage(`Usuario ${formData.fullName} creado exitosamente como ${roleLabels[formData.role]}. Ya puede iniciar sesión con sus credenciales.`);

        setFormData({
          username: '',
          fullName: '',
          password: '',
          confirmPassword: '',
          role: 'lector',
          department: ''
        });

        setTimeout(() => {
          setSuccessMessage('');
          if (!isAdminCreating) {
            onClose();
          }
        }, 3000);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (newRole: 'lector' | 'admin') => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      username: ''
    }));
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: '' }));
    }
  };

  if (!isOpen) return null;

  // Si no es admin y está intentando registrarse (no es login), mostrar mensaje de error
  if (!isLogin && !isAdminCreating && (!currentUser || currentUser.role !== 'admin')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acceso Restringido
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Solo los administradores pueden crear nuevas cuentas de usuario. 
              Si necesitas una cuenta, contacta al administrador del sistema.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsLogin(true)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {isAdminCreating ? (
                  <Shield className="h-6 w-6 text-blue-600" />
                ) : isLogin ? (
                  <LogIn className="h-6 w-6 text-blue-600" />
                ) : (
                  <User className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isAdminCreating ? 'Crear Usuario' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {isAdminCreating && (
            <p className="text-sm text-gray-600 mt-2">
              Creando nueva cuenta como administrador
            </p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role Selection (only for user creation) */}
          {(!isLogin || isAdminCreating) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(roleLabels).map(([role, label]) => {
                  const Icon = roleIcons[role as keyof typeof roleIcons];
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role as 'lector' | 'admin')}
                      className={`p-3 border rounded-lg flex flex-col items-center space-y-1 transition-all ${
                        formData.role === role
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
              {!isLogin && (
                <span className="text-xs text-gray-500 ml-2">
                  (se agregará @{formData.role === 'admin' ? 'administrador' : 'lector'}.uci.cu)
                </span>
              )}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre de usuario"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Full Name (only for user creation) */}
          {(!isLogin || isAdminCreating) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre completo"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
          )}


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password (only for user creation) */}
          {(!isLogin || isAdminCreating) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirma la contraseña"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Department (only for user creation) */}
          {(!isLogin || isAdminCreating) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona el departamento</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>
          )}


          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>
                  {isAdminCreating ? 'Creando usuario...' : isLogin ? 'Iniciando sesión...' : 'Registrando...'}
                </span>
              </>
            ) : (
              <>
                {isAdminCreating ? (
                  <Shield className="h-4 w-4" />
                ) : isLogin ? (
                  <LogIn className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>
                  {isAdminCreating ? 'Crear Usuario' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </span>
              </>
            )}
          </button>

          {/* Switch Mode - Only show for login, not for admin creating users */}
          {!isAdminCreating && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setFormData({
                      username: '',
                      fullName: '',
                      password: '',
                      confirmPassword: '',
                      role: 'lector',
                      department: ''
                    });
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? 'Contacta al administrador' : 'Inicia sesión aquí'}
                </button>
              </p>
            </div>
          )}

          {/* Demo Accounts */}
          {isLogin && !isAdminCreating && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2 font-medium">Cuentas de demostración:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Superadministrador:</strong> alainr (rol: administrador)</p>
                <p><strong>Lector:</strong> juan.perez (rol: lector)</p>
                <p className="text-gray-400">Contraseña: cualquiera (excepto superadmin)</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}