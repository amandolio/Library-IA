export interface User {
  id: string;
  name: string;
  email: string;
  role: 'lector' | 'admin';
  department: string;
  academicLevel: string;
  interests: string[];
  readingHistory: string[];
  favoriteGenres: string[];
  researchAreas: string[];
}

export interface LibrarySystemInfo {
  catalogId: string;
  barcode: string;
  acquisitionDate: string;
  lastUpdated: string;
  totalCopies: number;
  availableCopies: number;
  reservedCopies: number;
  checkedOutCopies: number;
  dueDate?: string;
  reservedBy?: string[];
  waitingList?: string[];
  digitalAccess?: boolean;
  digitalLicenses?: number;
  digitalActiveUsers?: number;
}

export interface Resource {
  id: string;
  title: string;
  authors: string[];
  type: 'book' | 'journal' | 'thesis' | 'conference' | 'multimedia' | 'dataset';
  category: string;
  tags: string[];
  abstract: string;
  publishedYear: number;
  publisher: string;
  citations: number;
  impactFactor?: number;
  availability: 'available' | 'checked-out' | 'reserved' | 'digital-only';
  location?: string;
  isbn?: string;
  doi?: string;
  rating: number;
  reviewCount: number;
  language: string;
  pageCount?: number;
  thumbnail: string;
  relatedTopics: string[];
  url?: string;
  digitalUrl?: string;
  librarySystem?: LibrarySystemInfo;
  fullTextKeywords?: string[];
}

export interface Recommendation {
  resource: Resource;
  score: number;
  reason: string;
  algorithm: 'collaborative' | 'content-based' | 'hybrid' | 'trending';
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  yearRange?: [number, number];
  availability?: string[];
  language?: string[];
  rating?: number;
}

export interface TopicSearchResult {
  topic: string;
  matchingResources: Resource[];
  confidence: number;
}

export interface KeywordExtractionResult {
  keywords: string[];
  confidence: number;
  method: 'tf-idf' | 'textrank' | 'yake' | 'hybrid';
  processingTime: number;
}

export interface BookCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export interface LibrarySystemSync {
  lastSyncTime: Date;
  syncStatus: 'active' | 'inactive' | 'error';
  totalResources: number;
  newResources: number;
  updatedResources: number;
  errors: string[];
}