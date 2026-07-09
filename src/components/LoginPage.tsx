import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  BookOpen,
  Loader2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export function LoginPage() {
  const { login, register, error, clearError, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    department: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    'Literature',
    'Medicine',
    'Law',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo valido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'El nombre es requerido';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      if (!formData.department) {
        newErrors.department = 'Selecciona un departamento';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name, formData.department);
      }
    } catch (err) {
      // Error is handled by auth context
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      department: '',
    });
    if (error) clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl mb-4 border border-white border-opacity-20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sistema de Biblioteca</h1>
          <p className="text-blue-200 text-sm">Universidad - Acceso a Recursos Academicos</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-white border-opacity-10">
            <button
              onClick={() => !isLogin && switchMode()}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isLogin
                  ? 'text-white bg-white bg-opacity-10'
                  : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesion
            </button>
            <button
              onClick={() => isLogin && switchMode()}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                !isLogin
                  ? 'text-white bg-white bg-opacity-10'
                  : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 rounded-xl p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Nombre Completo</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white bg-opacity-5 border rounded-xl text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-10 transition-all ${
                      errors.name ? 'border-red-400' : 'border-white border-opacity-20'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Correo Electronico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-white bg-opacity-5 border rounded-xl text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-10 transition-all ${
                    errors.email ? 'border-red-400' : 'border-white border-opacity-20'
                  }`}
                  placeholder="usuario@universidad.edu"
                />
              </div>
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Department Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Departamento</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-4 py-3 bg-white bg-opacity-5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-10 transition-all ${
                    errors.department ? 'border-red-400' : 'border-white border-opacity-20'
                  }`}
                >
                  <option value="" className="bg-gray-900">Selecciona tu departamento</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-gray-900">
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="text-red-300 text-xs mt-1">{errors.department}</p>}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-white bg-opacity-5 border rounded-xl text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-10 transition-all ${
                    errors.password ? 'border-red-400' : 'border-white border-opacity-20'
                  }`}
                  placeholder="Minimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Confirmar Contrasena</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white bg-opacity-5 border rounded-xl text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-10 transition-all ${
                      errors.confirmPassword ? 'border-red-400' : 'border-white border-opacity-20'
                    }`}
                    placeholder="Confirma tu contrasena"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500 shadow-opacity-25 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Iniciando sesion...' : 'Registrando...'}
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
                </>
              )}
            </button>

            {/* Switch Mode Link */}
            <div className="text-center pt-4 border-t border-white border-opacity-10">
              <p className="text-blue-200 text-sm">
                {isLogin ? 'No tienes una cuenta?' : 'Ya tienes una cuenta?'}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-white font-semibold hover:underline ml-1"
                >
                  {isLogin ? 'Registrate aqui' : 'Inicia sesion'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300 text-xs mt-6 opacity-70">
          Al continuar, aceptas nuestros terminos de servicio y politicas de privacidad
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
