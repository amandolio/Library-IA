import React from 'react';
import { 
  Star, 
  Users, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  BookOpen,
  FileText,
  Video,
  Database
} from 'lucide-react';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  showRecommendationReason?: boolean;
  recommendationReason?: string;
  onClick?: () => void;
}

export function ResourceCard({ 
  resource, 
  showRecommendationReason, 
  recommendationReason,
  onClick 
}: ResourceCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'journal': return FileText;
      case 'multimedia': return Video;
      case 'dataset': return Database;
      default: return FileText;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'checked-out': return 'text-red-600 bg-red-50';
      case 'reserved': return 'text-yellow-600 bg-yellow-50';
      case 'digital-only': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const TypeIcon = getTypeIcon(resource.type);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-20 h-28 object-cover rounded-lg shadow-sm"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TypeIcon className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {resource.type}
              </span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(resource.availability)}`}>
              {resource.availability.replace('-', ' ')}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {resource.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            by {resource.authors.join(', ')}
          </p>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {resource.abstract}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {resource.publishedYear}
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {resource.rating} ({resource.reviewCount})
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {resource.citations} citations
              </div>
            </div>
            
            {resource.location && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {resource.location}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
          
          {showRecommendationReason && recommendationReason && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Why recommended:</strong> {recommendationReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}