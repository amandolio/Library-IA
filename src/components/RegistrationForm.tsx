import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Briefcase, Loader2, School, LogOut } from 'lucide-react';
import { Profession, Faculty } from '../types';
import { facultyConfig } from './FacultyIcons';
import { AuthShell } from './AuthShell';
import { RegistrationInput } from '../services/authService';

type LucideIcon = React.ComponentType<{ className?: string }>;

const professionConfig: Record<Profession, { label: string; icon: LucideIcon }> = {
  profesor: { label: 'Profesor', icon: Briefcase },
  estudiante: { label: 'Estudiante', icon: School },
};

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

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
    hasError ? 'border-red-400' : 'border-white/15'
  }`;

export function RegistrationForm() {
  const { pendingRegistration, completeRegistration, logout, error, clearError } = useAuth();
  const [name, setName] = useState(pendingRegistration?.name ?? '');
  const [profession, setProfession] = useState<Profession | ''>('');
  const [department, setDepartment] = useState('');
  const [faculty, setFaculty] = useState<Faculty | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!pendingRegistration) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es requerido';
    if (!profession) next.profession = 'Selecciona una profesion';
    if (profession === 'profesor' && !department) next.department = 'Selecciona un departamento';
    if (profession === 'estudiante' && !faculty) next.faculty = 'Selecciona una facultad';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !profession) return;

    const input: RegistrationInput = {
      name,
      profession,
      department: profession === 'profesor' ? department : undefined,
      faculty: profession === 'estudiante' ? faculty : undefined,
    };

    setSubmitting(true);
    await completeRegistration(input);
    setSubmitting(false);
  };

  const selectProfession = (value: Profession) => {
    setProfession(value);
    setDepartment('');
    setFaculty('');
    setErrors((prev) => ({ ...prev, profession: '', department: '', faculty: '' }));
    if (error) clearError();
  };

  return (
    <AuthShell
      title="Completa tu registro"
      subtitle="Es la primera vez que entras con esta cuenta. Necesitamos unos datos academicos para crear tu perfil."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-red-100 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <div className="text-sm text-slate-300">
          Cuenta de Google: <span className="text-white font-medium">{pendingRegistration.email}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Nombre completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            className={inputClass(!!errors.name)}
            placeholder="Tu nombre completo"
          />
          {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Profesion</label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(professionConfig) as [Profession, { label: string; icon: LucideIcon }][]).map(([prof, config]) => {
              const Icon = config.icon;
              const selected = profession === prof;
              return (
                <button
                  key={prof}
                  type="button"
                  onClick={() => selectProfession(prof)}
                  className={`py-3 px-4 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                    selected
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-white/15 text-slate-300 hover:bg-white/5'
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

        {profession === 'profesor' && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Departamento</label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
              }}
              className={inputClass(!!errors.department)}
            >
              <option value="" className="bg-slate-900">Selecciona tu departamento</option>
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-300 text-xs mt-1">{errors.department}</p>}
          </div>
        )}

        {profession === 'estudiante' && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Facultad</label>
            <select
              value={faculty}
              onChange={(e) => {
                setFaculty(e.target.value as Faculty | '');
                if (errors.faculty) setErrors((prev) => ({ ...prev, faculty: '' }));
              }}
              className={inputClass(!!errors.faculty)}
            >
              <option value="" className="bg-slate-900">Selecciona tu facultad</option>
              {(Object.entries(facultyConfig) as [Faculty, { label: string; icon: LucideIcon }][]).map(([fac, config]) => (
                <option key={fac} value={fac} className="bg-slate-900">{config.label}</option>
              ))}
            </select>
            {errors.faculty && <p className="text-red-300 text-xs mt-1">{errors.faculty}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <button
          type="button"
          onClick={() => logout()}
          className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cancelar y salir
        </button>
      </form>
    </AuthShell>
  );
}

export default RegistrationForm;
