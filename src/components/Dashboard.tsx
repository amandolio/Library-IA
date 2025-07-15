import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Clock,
  ArrowRight,
  Brain,
  Target,
  Zap,
  Shield,
  GraduationCap,
  Settings,
  UserPlus
} from 'lucide-react';
import { User, Resource } from '../types';
import { ResourceCard } from './ResourceCard';
import { AuthModal } from './AuthModal';
import { UserManagementPanel } from './UserManagementPanel';

interface DashboardProps {
  user: User;
  recentResources: Resource[];
  trendingResources: Resource[];
}

export function Dashboard({ user, recentResources, trendingResources }: DashboardProps) {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const getRoleSpecificStats = () => {
    switch (user.role) {
      case 'admin':
        return [
          {
            label: 'Total Users',
            value: '1,247',
            change: '+23 this week',
            changeType: 'positive',
            icon: Users,
            color: 'bg-red-500'
          },
          {
            label: 'System Uptime',
            value: '99.9%',
            change: 'Last 30 days',
            changeType: 'positive', 
            icon: Shield,
            color: 'bg-green-500'
          },
          {
            label: 'Active Sessions',
            value: '342',
            change: '+15 today',
            changeType: 'positive',
            icon: Clock,
            color: 'bg-blue-500'
          },
          {
            label: 'AI Accuracy',
            value: '94%',
            change: 'recommendation match',
            changeType: 'neutral',
            icon: Brain,
            color: 'bg-orange-500'
          }
        ];
      case 'faculty':
        return [
          {
            label: 'Students Guided',
            value: '45',
            change: '+3 this semester',
            changeType: 'positive',
            icon: GraduationCap,
            color: 'bg-purple-500'
          },
          {
            label: 'Research Papers',
            value: '12',
            change: '+2 published',
            changeType: 'positive', 
            icon: BookOpen,
            color: 'bg-green-500'
          },
          {
            label: 'Teaching Hours',
            value: '156',
            change: 'this semester',
            changeType: 'neutral',
            icon: Clock,
            color: 'bg-blue-500'
          },
          {
            label: 'Citations',
            value: '234',
            change: '+18 this month',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'bg-orange-500'
          }
        ];
      default: // student
        return [
          {
            label: 'Resources Read',
            value: '24',
            change: '+3 this week',
            changeType: 'positive',
            icon: BookOpen,
            color: 'bg-blue-500'
          },
          {
            label: 'Study Hours',
            value: '156',
            change: '+12 this month',
            changeType: 'positive', 
            icon: Clock,
            color: 'bg-green-500'
          },
          {
            label: 'Study Groups',
            value: '3',
            change: '+1 joined',
            changeType: 'positive',
            icon: Users,
            color: 'bg-purple-500'
          },
          {
            label: 'AI Accuracy',
            value: '94%',
            change: 'recommendation match',
            changeType: 'neutral',
            icon: Brain,
            color: 'bg-orange-500'
          }
        ];
    }
  };

  const getRoleSpecificWelcome = () => {
    switch (user.role) {
      case 'admin':
        return {
          title: `Welcome back, Administrator!`,
          subtitle: `System overview and management tools are ready for your review.`,
          gradient: 'from-red-600 to-pink-600'
        };
      case 'faculty':
        return {
          title: `Welcome back, ${user.name.split(' ')[0]}!`,
          subtitle: `Your research dashboard and student guidance tools are updated.`,
          gradient: 'from-purple-600 to-indigo-600'
        };
      default:
        return {
          title: `Welcome back, ${user.name.split(' ')[0]}!`,
          subtitle: `Your AI-powered study assistant has ${recentResources.length} new recommendations ready.`,
          gradient: 'from-blue-600 to-purple-600'
        };
    }
  };

  const handleCreateUser = () => {
    // La función onLogin no hace nada en este caso, solo cerramos el modal
    setShowCreateUserModal(false);
  };

  const stats = getRoleSpecificStats();
  const welcome = getRoleSpecificWelcome();

  // Si se está mostrando el panel de gestión de usuarios
  if (showUserManagement && user.role === 'admin') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowUserManagement(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
        <UserManagementPanel currentUser={user} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`bg-gradient-to-r ${welcome.gradient} rounded-xl p-8 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{welcome.title}</h2>
            <p className="text-blue-100 text-lg">
              {welcome.subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-4">
            <Brain className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">AI Confidence</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center">
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-gray-400'
                }`} />
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-specific AI Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">
              {user.role === 'admin' ? 'System Insights' : 
               user.role === 'faculty' ? 'Research Insights' : 'AI Insights'}
            </h3>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user.role === 'admin' ? (
            <>
              <div className="p-4 bg-red-50 rounded-lg">
                <Shield className="h-5 w-5 text-red-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">System Health</h4>
                <p className="text-sm text-gray-600">
                  All services running optimally with 99.9% uptime
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">User Activity</h4>
                <p className="text-sm text-gray-600">
                  Peak usage hours: 10-12 AM and 2-4 PM daily
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Performance</h4>
                <p className="text-sm text-gray-600">
                  AI recommendation accuracy improved by 5% this month
                </p>
              </div>
            </>
          ) : user.role === 'faculty' ? (
            <>
              <div className="p-4 bg-purple-50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Student Engagement</h4>
                <p className="text-sm text-gray-600">
                  Your students show 92% engagement with recommended resources
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Research Trends</h4>
                <p className="text-sm text-gray-600">
                  Your research area is trending with 15% more citations
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Collaboration</h4>
                <p className="text-sm text-gray-600">
                  5 new collaboration opportunities identified
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Study Focus</h4>
                <p className="text-sm text-gray-600">
                  Your reading pattern shows 85% alignment with current trends
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Study Groups</h4>
                <p className="text-sm text-gray-600">
                  3 students share similar interests and study schedule
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Knowledge Gaps</h4>
                <p className="text-sm text-gray-600">
                  Consider exploring Ethics in AI to complement your studies
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity & Trending - Only for students and faculty */}
      {user.role !== 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Resources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {user.role === 'faculty' ? 'Recent Research' : 'Continue Reading'}
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {recentResources.slice(0, 2).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Trending Now</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {trendingResources.slice(0, 2).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin-specific Management Panel */}
      {user.role === 'admin' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">System Management</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUserManagement(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Gestionar Usuarios</span>
              </button>
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Crear Usuario</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowUserManagement(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-semibold text-gray-900">User Management</h4>
              <p className="text-sm text-gray-600">Manage users and permissions</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BookOpen className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Resource Management</h4>
              <p className="text-sm text-gray-600">Add and manage library resources</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Brain className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="font-semibold text-gray-900">AI Configuration</h4>
              <p className="text-sm text-gray-600">Configure recommendation algorithms</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Settings className="h-6 w-6 text-orange-600 mb-2" />
              <h4 className="font-semibold text-gray-900">System Settings</h4>
              <p className="text-sm text-gray-600">Configure system parameters</p>
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <AuthModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onLogin={handleCreateUser}
        currentUser={user}
        isAdminCreating={true}
      />
    </div>
  );
}