import React, { useState } from 'react';
import {
  Brain,
  Lightbulb,
  Users,
  TrendingUp,
  Filter,
  Sliders,
  RefreshCw,
  ExternalLink,
  X,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { Recommendation, Resource } from '../types';
import { ResourceCard } from './ResourceCard';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const algorithmTypes = [
    { id: 'all', name: 'All Recommendations', icon: Brain, color: 'text-purple-600' },
    { id: 'collaborative', name: 'Collaborative Filtering', icon: Users, color: 'text-blue-600' },
    { id: 'content-based', name: 'Content-Based', icon: Lightbulb, color: 'text-green-600' },
    { id: 'hybrid', name: 'Hybrid AI', icon: Brain, color: 'text-purple-600' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, color: 'text-orange-600' }
  ];

  const filteredRecommendations = selectedAlgorithm === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.algorithm === selectedAlgorithm);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
          <p className="text-gray-600 mt-1">
            Personalized suggestions powered by advanced machine learning
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Algorithm Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Recommendation Algorithms</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {algorithmTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedAlgorithm(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedAlgorithm === type.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${selectedAlgorithm === type.id ? type.color : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{type.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Algorithm Explanation */}
      {selectedAlgorithm !== 'all' && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How {algorithmTypes.find(t => t.id === selectedAlgorithm)?.name} Works
              </h4>
              <p className="text-sm text-gray-700">
                {selectedAlgorithm === 'collaborative' && 
                  "Analyzes reading patterns of users with similar interests and academic profiles to suggest resources that others like you have found valuable."}
                {selectedAlgorithm === 'content-based' && 
                  "Examines the content, topics, and metadata of resources you've engaged with to find similar materials that match your research interests."}
                {selectedAlgorithm === 'hybrid' && 
                  "Combines multiple AI techniques including collaborative filtering, content analysis, and trending data for the most accurate recommendations."}
                {selectedAlgorithm === 'trending' && 
                  "Identifies currently popular resources in your field based on recent citations, downloads, and engagement from the academic community."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRecommendations.map((recommendation, index) => (
          <div key={recommendation.resource.id} className="relative">
            <div className="absolute -left-4 top-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
              {index + 1}
            </div>
            <div className="ml-6">
              <ResourceCard
                resource={recommendation.resource}
                showRecommendationReason={true}
                recommendationReason={recommendation.reason}
                onClick={() => setSelectedResource(recommendation.resource)}
              />
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">
                    Confidence: <span className="font-semibold text-gray-700">
                      {Math.round(recommendation.score * 100)}%
                    </span>
                  </span>
                  <span className="text-gray-500">
                    Algorithm: <span className="font-semibold text-gray-700 capitalize">
                      {recommendation.algorithm.replace('-', ' ')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600">
            Try selecting a different algorithm or refresh to get new suggestions.
          </p>
        </div>
      )}

      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedResource.title}</h3>
                <p className="text-gray-600">{selectedResource.authors.join(', ')}</p>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light ml-4 flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <img
                src={selectedResource.thumbnail}
                alt={selectedResource.title}
                className="w-32 h-48 object-cover rounded-lg shadow-md"
              />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Tipo de Recurso</h4>
                  <p className="text-gray-900 capitalize">{selectedResource.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Año de Publicación</h4>
                  <p className="text-gray-900">{selectedResource.publishedYear}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Categoría</h4>
                  <p className="text-gray-900">{selectedResource.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Idioma</h4>
                  <p className="text-gray-900">{selectedResource.language}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Calificación</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <p className="text-gray-900">{selectedResource.rating} ({selectedResource.reviewCount} reviews)</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Citaciones</h4>
                  <p className="text-gray-900">{selectedResource.citations}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Resumen</h4>
                <p className="text-gray-700 leading-relaxed">{selectedResource.abstract}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Palabras Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedResource.location && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-purple-900">
                    <MapPin className="h-5 w-5" />
                    <span className="font-semibold">{selectedResource.location}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => window.open(selectedResource.abstract, '_blank')}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Acceder al Recurso</span>
                </button>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}