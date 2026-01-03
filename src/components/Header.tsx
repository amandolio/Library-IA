import React from 'react';
import { Search, Bell, User, BookOpen, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
  onProfileClick: () => void;
}

export function Header({ user, onProfileClick }: HeaderProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50';
      case 'faculty': return 'text-purple-600 bg-purple-50';
      case 'student': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'faculty': return 'Docente';
      case 'student': return 'Estudiante';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">LibraryAI</h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources, authors, topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={onProfileClick}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}