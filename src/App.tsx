import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { AdvancedSearch } from './components/AdvancedSearch';
import { TopicSearch } from './components/TopicSearch';
import { AuthModal } from './components/AuthModal';
import { PlagiarismDetectionPanel } from './components/PlagiarismDetectionPanel';
import { LibrarySyncPanel } from './components/LibrarySyncPanel';
import { AcademicSearchPanel } from './components/AcademicSearchPanel';
import { CloudSyncPanel } from './components/CloudSyncPanel';
import { mockUser, mockResources, getRecommendations, updateSessionActivity } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Actualizar actividad de sesión cada minuto
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        updateSessionActivity(user.id);
      }, 60000); // Cada minuto

      return () => clearInterval(interval);
    }
  }, [user]);

  const recommendations = user ? getRecommendations(user.id) : [];
  const recentResources = user ? mockResources.filter(r => user.readingHistory.includes(r.id)) : [];
  const trendingResources = mockResources
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 4);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
    setActiveTab('dashboard');
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenido a LibraryAI
              </h2>
              <p className="text-gray-600 mb-6">
                Sistema inteligente de recomendación para bibliotecas universitarias. 
                Inicia sesión para acceder a recomendaciones personalizadas y recursos académicos.
              </p>
              <button
                onClick={handleAuthClick}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </button>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Solo los administradores pueden crear nuevas cuentas. 
                  Si necesitas acceso, contacta al administrador del sistema.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">IA Avanzada</h3>
                <p className="text-gray-600">Recomendaciones personalizadas con machine learning</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Recursos Académicos</h3>
                <p className="text-gray-600">Acceso a miles de libros y papers científicos</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">👥</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Colaboración</h3>
                <p className="text-gray-600">Conecta con otros investigadores y estudiantes</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            recentResources={recentResources}
            trendingResources={trendingResources}
          />
        );
      case 'topic-search':
        return <TopicSearch />;
      case 'academic-search':
        return <AcademicSearchPanel />;
      case 'recommendations':
        return <RecommendationsPanel recommendations={recommendations} />;
      case 'search':
        return <AdvancedSearch resources={mockResources} />;
      case 'plagiarism-detection':
        return <PlagiarismDetectionPanel />;
      case 'library-sync':
        return <LibrarySyncPanel />;
      case 'cloud-sync':
        return <CloudSyncPanel />;
      case 'favorites':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Favoritos</h2>
            <p className="text-gray-600">Tus recursos favoritos aparecerán aquí.</p>
          </div>
        );
      case 'history':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Lectura</h2>
            <div className="grid grid-cols-1 gap-6">
              {recentResources.map(resource => (
                <div key={resource.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img src={resource.thumbnail} alt={resource.title} className="w-12 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-600">por {resource.authors.join(', ')}</p>
                    <p className="text-xs text-gray-500 mt-1">Leído el {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'trending':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos en Tendencia</h2>
            <div className="grid grid-cols-1 gap-6">
              {trendingResources.map(resource => (
                <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">por {resource.authors.join(', ')}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{resource.citations} citas</span>
                    <span>{resource.rating} ⭐</span>
                    <span>{resource.publishedYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analíticas de Investigación</h2>
            <p className="text-gray-600">Analíticas detalladas e insights sobre tus patrones de investigación.</p>
          </div>
        );
      case 'collaborate':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Centro de Colaboración</h2>
            <p className="text-gray-600">Conecta con otros investigadores y colabora en proyectos.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onProfileClick={handleProfileClick}
        onAuthClick={handleAuthClick}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        {user && <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />}
        
        <main className={`flex-1 p-8 ${!user ? 'max-w-6xl mx-auto' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Profile Sidebar */}
      {showProfile && user && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Perfil</h2>
            <button 
              onClick={() => setShowProfile(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user.role === 'admin' ? 'text-red-600 bg-red-50' :
                  user.role === 'faculty' ? 'text-purple-600 bg-purple-50' :
                  'text-blue-600 bg-blue-50'
                }`}>
                  {user.role === 'admin' ? 'Administrador' :
                   user.role === 'faculty' ? 'Docente' : 'Estudiante'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{user.department}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Intereses de Investigación</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Áreas de Investigación</h4>
              <div className="space-y-2">
                {user.researchAreas.map((area, index) => (
                  <div key={index} className="text-sm text-gray-600">• {area}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        currentUser={user}
      />
    </div>
  );
}

export default App;