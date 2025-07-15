import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Star, 
  MapPin,
  BookOpen,
  Languages,
  Sliders
} from 'lucide-react';
import { Resource, SearchFilters } from '../types';
import { ResourceCard } from './ResourceCard';

interface AdvancedSearchProps {
  resources: Resource[];
}

export function AdvancedSearch({ resources }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'rating' | 'citations'>('relevance');

  const resourceTypes = ['book', 'journal', 'thesis', 'conference', 'multimedia', 'dataset'];
  const categories = [...new Set(resources.map(r => r.category))];
  const languages = [...new Set(resources.map(r => r.language))];

  const filteredResources = resources.filter(resource => {
    // Text search
    if (query) {
      const searchText = `${resource.title} ${resource.authors.join(' ')} ${resource.abstract} ${resource.tags.join(' ')}`.toLowerCase();
      if (!searchText.includes(query.toLowerCase())) return false;
    }

    // Type filter
    if (filters.type?.length && !filters.type.includes(resource.type)) return false;
    
    // Category filter
    if (filters.category?.length && !filters.category.includes(resource.category)) return false;
    
    // Year filter
    if (filters.yearRange) {
      const [min, max] = filters.yearRange;
      if (resource.publishedYear < min || resource.publishedYear > max) return false;
    }
    
    // Availability filter
    if (filters.availability?.length && !filters.availability.includes(resource.availability)) return false;
    
    // Language filter
    if (filters.language?.length && !filters.language.includes(resource.language)) return false;
    
    // Rating filter
    if (filters.rating && resource.rating < filters.rating) return false;

    return true;
  });

  // Sort results
  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.publishedYear - a.publishedYear;
      case 'rating':
        return b.rating - a.rating;
      case 'citations':
        return b.citations - a.citations;
      default:
        return 0; // relevance (would be calculated by search algorithm)
    }
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Search</h2>
        
        {/* Main Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, abstract, or keywords..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
            {Object.keys(filters).length > 0 && (
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Publication Date</option>
              <option value="rating">Rating</option>
              <option value="citations">Citations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline h-4 w-4 mr-1" />
                Resource Type
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {resourceTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type?.includes(type) || false}
                      onChange={(e) => {
                        const newTypes = filters.type || [];
                        if (e.target.checked) {
                          handleFilterChange('type', [...newTypes, type]);
                        } else {
                          handleFilterChange('type', newTypes.filter(t => t !== type));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category?.includes(category) || false}
                      onChange={(e) => {
                        const newCategories = filters.category || [];
                        if (e.target.checked) {
                          handleFilterChange('category', [...newCategories, category]);
                        } else {
                          handleFilterChange('category', newCategories.filter(c => c !== category));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Publication Year
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="2000"
                  max="2024"
                  value={filters.yearRange?.[0] || 2000}
                  onChange={(e) => {
                    const min = parseInt(e.target.value);
                    const max = filters.yearRange?.[1] || 2024;
                    handleFilterChange('yearRange', [min, max]);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{filters.yearRange?.[0] || 2000}</span>
                  <span>{filters.yearRange?.[1] || 2024}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Availability
              </label>
              <div className="space-y-2">
                {['available', 'checked-out', 'reserved', 'digital-only'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability?.includes(status) || false}
                      onChange={(e) => {
                        const newStatuses = filters.availability || [];
                        if (e.target.checked) {
                          handleFilterChange('availability', [...newStatuses, status]);
                        } else {
                          handleFilterChange('availability', newStatuses.filter(s => s !== status));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Languages className="inline h-4 w-4 mr-1" />
                Language
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {languages.map(language => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.language?.includes(language) || false}
                      onChange={(e) => {
                        const newLanguages = filters.language || [];
                        if (e.target.checked) {
                          handleFilterChange('language', [...newLanguages, language]);
                        } else {
                          handleFilterChange('language', newLanguages.filter(l => l !== language));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{language}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="inline h-4 w-4 mr-1" />
                Minimum Rating
              </label>
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setFilters({})}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({sortedResources.length})
          </h3>
          {query && (
            <p className="text-sm text-gray-600">
              Results for "<span className="font-medium">{query}</span>"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sortedResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {sortedResources.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search query or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}