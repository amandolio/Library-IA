import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { AuthShell } from './AuthShell';

const GoogleGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

export function LoginPage() {
  const { loginWithGoogle, error, isOffline } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    await loginWithGoogle();
    setSubmitting(false);
  };

  return (
    <AuthShell
      title="Sistema de Biblioteca"
      subtitle="Acceso a recursos academicos de la universidad"
    >
      <div className="space-y-6">
        {isOffline && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="text-amber-100 text-sm leading-relaxed">
              Sin conexion. Necesitas internet para iniciar sesion por primera vez.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-red-100 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting || isOffline}
          className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleGlyph />}
          {submitting ? 'Redirigiendo a Google...' : 'Continuar con Google'}
        </button>

        <p className="text-center text-slate-400 text-sm leading-relaxed">
          Si es tu primera vez, te pediremos completar tu registro con tus datos academicos.
        </p>
      </div>
    </AuthShell>
  );
}

export default LoginPage;
