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
  Briefcase,
  School,
} from 'lucide-react';
import { Profession, Faculty } from '../types';

type LucideIcon = React.ComponentType<{ className?: string }>;

const FoxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3L8 7L4 5L6 11L4 17L8 15L12 19L16 15L20 17L18 11L20 5L16 7Z" />
    <circle cx="9.5" cy="11" r="1" fill="currentColor" />
    <circle cx="14.5" cy="11" r="1" fill="currentColor" />
    <path d="M10 14L12 16L14 14" />
  </svg>
);

const ScorpionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21V14M12 14L8 12M12 14L16 12M12 14L12 10M8 12L5 9M8 12L4 11M16 12L19 9M16 12L20 11M12 10L9 7M12 10L15 7M12 10L12 6" />
    <circle cx="12" cy="21" r="1.5" fill="currentColor" />
    <path d="M9 7L7 5M15 7L17 5" />
  </svg>
);

const DragonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 18C4 18 6 14 10 14C14 14 16 18 16 18" />
    <path d="M16 18C16 18 18 14 18 10C18 6 14 4 10 6C6 8 4 12 4 14" />
    <path d="M18 10L21 8M18 10L20 12" />
    <path d="M10 6L8 3M10 6L12 3" />
    <circle cx="11" cy="10" r="1" fill="currentColor" />
    <path d="M4 18L2 20M4 18L6 20" />
  </svg>
);

const CaimanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 14C3 14 5 12 8 12C11 12 14 14 18 14C20 14 21 13 21 13" />
    <path d="M3 14L2 16M21 13L22 15" />
    <path d="M8 12L8 9L10 10M11 12L11 9L13 10M14 12L14 9L16 10" />
    <circle cx="6" cy="13" r="0.5" fill="currentColor" />
    <path d="M18 14L18 17M21 13L21 17" />
    <path d="M18 17L17 19M18 17L19 19M21 17L20 19M21 17L22 19" />
  </svg>
);

const GladiatorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3L8 5L8 8L12 7L16 8L16 5Z" />
    <path d="M8 8L6 12L8 14L12 12L16 14L18 12L16 8" />
    <path d="M8 14L8 18L10 21M16 14L16 18L14 21" />
    <path d="M12 12L12 18" />
    <path d="M6 12L4 14M18 12L20 14" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
  </svg>
);

const WolfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 16L6 10L4 6L8 8L12 6L16 8L20 6L18 10L20 16L16 18L12 20L8 18Z" />
    <path d="M8 8L7 5M16 8L17 5" />
    <circle cx="9.5" cy="12" r="1" fill="currentColor" />
    <circle cx="14.5" cy="12" r="1" fill="currentColor" />
    <path d="M11 15L12 17L13 15" />
    <path d="M10 14L8 14M14 14L16 14" />
  </svg>
);

export const facultyConfig: Record<Faculty, { label: string; icon: LucideIcon }> = {
  facultad1: { label: 'Facultad 1', icon: FoxIcon },
  facultad2: { label: 'Facultad 2', icon: ScorpionIcon },
  facultad3: { label: 'Facultad 3', icon: DragonIcon },
  facultad4: { label: 'Facultad 4', icon: CaimanIcon },
  facultadCITEC: { label: 'Facultad CITEC', icon: GladiatorIcon },
  facultadFTE: { label: 'Facultad FTE', icon: WolfIcon },
};

const professionConfig: Record<Profession, { label: string; icon: LucideIcon }> = {
  profesor: { label: 'Profesor', icon: Briefcase },
  estudiante: { label: 'Estudiante', icon: School },
};

export function LoginPage() {
  const { login, register, error, clearError, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    profession: '' as Profession | '',
    department: '',
    faculty: '' as Faculty | '',
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
      if (!formData.profession) {
        newErrors.profession = 'Selecciona una profesión';
      }
      if (formData.profession === 'profesor' && !formData.department) {
        newErrors.department = 'Selecciona un departamento';
      }
      if (formData.profession === 'estudiante' && !formData.faculty) {
        newErrors.faculty = 'Selecciona una facultad';
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
        const extraData: Record<string, string> = {
          profession: formData.profession,
        };
        if (formData.profession === 'profesor') {
          extraData.department = formData.department;
        }
        if (formData.profession === 'estudiante') {
          extraData.faculty = formData.faculty;
        }
        await register(formData.email, formData.password, formData.name, formData.profession === 'profesor' ? formData.department : '', extraData);
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

  const handleProfessionChange = (newProfession: Profession) => {
    setFormData((prev) => ({
      ...prev,
      profession: newProfession,
      department: '',
      faculty: '',
    }));
    if (errors.profession) setErrors((prev) => ({ ...prev, profession: '' }));
    if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
    if (errors.faculty) setErrors((prev) => ({ ...prev, faculty: '' }));
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      profession: '',
      department: '',
      faculty: '',
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

            {/* Profession Selection (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Profesión</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(professionConfig) as [Profession, { label: string; icon: LucideIcon }][]).map(([prof, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={prof}
                        type="button"
                        onClick={() => handleProfessionChange(prof)}
                        className={`py-3 px-4 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                          formData.profession === prof
                            ? 'border-blue-400 bg-blue-500 bg-opacity-20 text-white'
                            : 'border-white border-opacity-20 text-blue-200 hover:bg-white hover:bg-opacity-5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.profession && <p className="text-red-300 text-xs mt-1">{errors.profession}</p>}
              </div>
            )}

            {/* Department Field (only for professors) */}
            {!isLogin && formData.profession === 'profesor' && (
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

            {/* Faculty Field (only for students) */}
            {!isLogin && formData.profession === 'estudiante' && (
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Facultad</label>
                <select
                  value={formData.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  className={`w-full px-4 py-3 bg-white bg-opacity-5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-10 transition-all ${
                    errors.faculty ? 'border-red-400' : 'border-white border-opacity-20'
                  }`}
                >
                  <option value="" className="bg-gray-900">Selecciona tu facultad</option>
                  {(Object.entries(facultyConfig) as [Faculty, { label: string; icon: LucideIcon }][]).map(([fac, config]) => (
                    <option key={fac} value={fac} className="bg-gray-900">
                      {config.label}
                    </option>
                  ))}
                </select>
                {errors.faculty && <p className="text-red-300 text-xs mt-1">{errors.faculty}</p>}
                {/* Faculty icon preview */}
                {formData.faculty && (
                  <div className="mt-2 flex items-center gap-2 p-2.5 bg-blue-500 bg-opacity-20 rounded-xl border border-blue-400 border-opacity-30">
                    {(() => {
                      const FacIcon = facultyConfig[formData.faculty as Faculty].icon;
                      return <FacIcon className="w-6 h-6 text-blue-300" />;
                    })()}
                    <span className="text-sm text-blue-100">
                      Tu icono de facultad: {facultyConfig[formData.faculty as Faculty].label}
                    </span>
                  </div>
                )}
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
