import React, { useState } from 'react';
import { 
  Brain, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Filter,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { Recommendation } from '../types';
import { ResourceCard } from './ResourceCard';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    </div>
  );
}