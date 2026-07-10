import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { AdvancedSearch } from './components/AdvancedSearch';
import { TopicSearch } from './components/TopicSearch';
import { PlagiarismDetectionPanel } from './components/PlagiarismDetectionPanel';
import { PDFAnalysisPanel } from './components/PDFAnalysisPanel';
import { LibrarySyncPanel } from './components/LibrarySyncPanel';
import { AcademicSearchPanel } from './components/AcademicSearchPanel';
import { CloudSyncPanel } from './components/CloudSyncPanel';
import { NationalRecommendations } from './components/NationalRecommendations';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsPanel } from './components/SettingsPanel';
import { mockResources, getRecommendations } from './data/mockData';
import { Loader2, LogOut } from 'lucide-react';

function AppContent() {
  const { user, loading, logout, error } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Convert AuthUser to mockUser format for compatibility with existing components
  const currentUser = {
    id: user.id,
    name: user.name || 'Usuario',
    email: user.email,
    role: user.role === 'admin' ? 'admin' : 'student',
    department: user.department || 'General',
    academicLevel: user.role === 'admin' ? 'Administrator' : 'Lector',
    interests: ['General Interest'],
    readingHistory: [],
    favoriteGenres: [user.department || 'General'],
    researchAreas: ['General Research'],
  };

  const recommendations = getRecommendations(currentUser.id);
  const recentResources = mockResources.filter(r => currentUser.readingHistory.includes(r.id));
  const trendingResources = mockResources
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 4);

  const handleProfileClick = async () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
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
      case 'pdf-analysis':
        return <PDFAnalysisPanel />;
      case 'library-sync':
        return <LibrarySyncPanel />;
      case 'cloud-sync':
        return <CloudSyncPanel />;
      case 'national-recommendations':
        return <NationalRecommendations />;
      case 'favorites':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Favoritos</h2>
            <p className="text-gray-600 dark:text-gray-400">Tus recursos favoritos apareceran aqui.</p>
          </div>
        );
      case 'history':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Historial de Lectura</h2>
            {recentResources.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {recentResources.map((resource) => (
                  <div key={resource.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <img src={resource.thumbnail} alt={resource.title} className="w-12 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">por {resource.authors.join(', ')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Leido el {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center">No hay recursos en el historial.</p>
            )}
          </div>
        );
      case 'trending':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recursos en Tendencia</h2>
            <div className="grid grid-cols-1 gap-6">
              {trendingResources.map((resource) => (
                <div key={resource.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">por {resource.authors.join(', ')}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>{resource.citations} citas</span>
                    <span>{resource.rating} estrellas</span>
                    <span>{resource.publishedYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analiticas de Investigacion</h2>
            <p className="text-gray-600 dark:text-gray-400">Analiticas detalladas e insights sobre tus patrones de investigacion.</p>
          </div>
        );
      case 'collaborate':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Centro de Colaboracion</h2>
            <p className="text-gray-600 dark:text-gray-400">Conecta con otros investigadores y colabora en proyectos.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header user={currentUser} onProfileClick={handleProfileClick} onSettingsClick={() => setShowSettings(true)} />

      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-8">{renderContent()}</main>
      </div>

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Profile Panel */}
      {showProfile && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-50 p-6 overflow-y-auto transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Perfil</h2>
            <button onClick={() => setShowProfile(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl">
              X
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentUser.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</p>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    currentUser.role === 'admin' ? 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Administrador' : 'Lector'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentUser.department}</p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Intereses de Investigacion</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Areas de Investigacion</h4>
              <div className="space-y-2">
                {currentUser.researchAreas.map((area, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    - {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
