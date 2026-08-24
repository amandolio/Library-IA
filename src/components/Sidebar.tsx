import React from 'react';
import {
  Home,
  Search,
  BookOpen,
  Star,
  History,
  TrendingUp,
  Users,
  Settings,
  Brain,
  BarChart3,
  Lightbulb,
  Database,
  Shield,
  Globe,
  Cloud,
  MapPin,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
}

export function Sidebar({ activeTab, onTabChange, userRole }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'topic-search', label: 'Busqueda por Tema', icon: Lightbulb },
    { id: 'academic-search', label: 'APIs Academicas', icon: Globe },
    { id: 'search', label: 'Busqueda Avanzada', icon: Search },
    { id: 'recommendations', label: 'Recomendaciones IA', icon: Brain },
    { id: 'national-recommendations', label: 'Recomendacion Nacional', icon: MapPin },
    { id: 'plagiarism-detection', label: 'Deteccion de Plagios', icon: Shield },
    { id: 'pdf-analysis', label: 'Analisis de PDF', icon: FileText },
    { id: 'library-sync', label: 'Sincronizacion', icon: Database },
    { id: 'cloud-sync', label: 'Sincronizacion Nube', icon: Cloud },
    { id: 'favorites', label: 'Favoritos', icon: Star },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'trending', label: 'Tendencias', icon: TrendingUp },
    { id: 'analytics', label: 'Analiticas', icon: BarChart3 },
    { id: 'collaborate', label: 'Colaborar', icon: Users },
    ...(userRole === 'admin' ? [{ id: 'user-management', label: 'Gestion de Usuarios', icon: Settings }] : []),
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full transition-colors duration-300 perspective-800">
      <nav className="mt-8">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Navegacion
          </h2>
        </div>
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  sidebar-item-3d ${isActive ? 'active-3d' : ''}
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-2 border-blue-700 dark:border-blue-400 glow-3d'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
