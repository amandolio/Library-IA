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
  Cloud
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'topic-search', label: 'Búsqueda por Tema', icon: Lightbulb },
    { id: 'academic-search', label: 'APIs Académicas', icon: Globe },
    { id: 'search', label: 'Búsqueda Avanzada', icon: Search },
    { id: 'recommendations', label: 'Recomendaciones IA', icon: Brain },
    { id: 'plagiarism-detection', label: 'Detección de Plagios', icon: Shield },
    { id: 'library-sync', label: 'Sincronización', icon: Database },
    { id: 'cloud-sync', label: 'Sincronización Nube', icon: Cloud },
    { id: 'favorites', label: 'Favoritos', icon: Star },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'trending', label: 'Tendencias', icon: TrendingUp },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'collaborate', label: 'Colaborar', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-8">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Navegación
          </h2>
        </div>
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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