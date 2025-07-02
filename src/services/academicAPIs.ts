// Servicios para integración con APIs académicas
import { Resource, LibrarySystemInfo } from '../types';

// Configuración de APIs
const API_CONFIG = {
  crossref: {
    baseUrl: 'https://api.crossref.org/works',
    userAgent: 'LibraryAI/1.0 (mailto:contact@libraryai.edu)'
  },
  openLibrary: {
    baseUrl: 'https://openlibrary.org',
    searchUrl: 'https://openlibrary.org/search.json'
  },
  arxiv: {
    baseUrl: 'https://export.arxiv.org/api/query'
  },
  semanticScholar: {
    baseUrl: 'https://api.semanticscholar.org/graph/v1',
    apiKey: import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY || ''
  },
  googleBooks: {
    baseUrl: 'https://www.googleapis.com/books/v1/volumes',
    apiKey: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || ''
  }
};

// Interfaces para respuestas de APIs
interface CrossRefWork {
  DOI: string;
  title: string[];
  author: Array<{ given: string; family: string }>;
  published: { 'date-parts': number[][] };
  publisher: string;
  subject: string[];
  abstract?: string;
  'is-referenced-by-count': number;
  type: string;
  URL: string;
}

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  subject?: string[];
  language?: string[];
  cover_i?: number;
  edition_count: number;
}

interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: Array<{ name: string }>;
  published: string;
  categories: string[];
  doi?: string;
  journal_ref?: string;
}

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string;
  authors: Array<{ name: string; authorId: string }>;
  year: number;
  venue: string;
  citationCount: number;
  influentialCitationCount: number;
  fieldsOfStudy: string[];
  url: string;
  openAccessPdf?: { url: string };
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    pageCount?: number;
    categories?: string[];
    language?: string;
    imageLinks?: { thumbnail: string; smallThumbnail: string };
    previewLink?: string;
    infoLink?: string;
  };
  accessInfo: {
    accessViewStatus: string;
    embeddable: boolean;
    publicDomain: boolean;
    webReaderLink?: string;
  };
}

// Clase principal para gestión de APIs académicas
export class AcademicAPIService {
  private rateLimits: Map<string, { lastCall: number; callsPerMinute: number }> = new Map();

  constructor() {
    // Configurar límites de rate limiting
    this.rateLimits.set('crossref', { lastCall: 0, callsPerMinute: 50 });
    this.rateLimits.set('openLibrary', { lastCall: 0, callsPerMinute: 100 });
    this.rateLimits.set('arxiv', { lastCall: 0, callsPerMinute: 30 });
    this.rateLimits.set('semanticScholar', { lastCall: 0, callsPerMinute: 100 });
    this.rateLimits.set('googleBooks', { lastCall: 0, callsPerMinute: 1000 });
  }

  // Control de rate limiting
  private async checkRateLimit(service: string): Promise<void> {
    const limit = this.rateLimits.get(service);
    if (!limit) return;

    const now = Date.now();
    const timeSinceLastCall = now - limit.lastCall;
    const minInterval = 60000 / limit.callsPerMinute; // ms entre llamadas

    if (timeSinceLastCall < minInterval) {
      const waitTime = minInterval - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    limit.lastCall = Date.now();
  }

  // Búsqueda en CrossRef (artículos académicos y DOIs)
  async searchCrossRef(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      await this.checkRateLimit('crossref');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.crossref.baseUrl}?query=${encodedQuery}&rows=${limit}&sort=relevance&order=desc`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': API_CONFIG.crossref.userAgent
        }
      });

      if (!response.ok) {
        throw new Error(`CrossRef API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCrossRefResults(data.message.items);
    } catch (error) {
      console.error('Error searching CrossRef:', error);
      return [];
    }
  }

  // Búsqueda en Open Library (libros)
  async searchOpenLibrary(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      await this.checkRateLimit('openLibrary');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.openLibrary.searchUrl}?q=${encodedQuery}&limit=${limit}&fields=key,title,author_name,first_publish_year,publisher,isbn,subject,language,cover_i,edition_count`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformOpenLibraryResults(data.docs);
    } catch (error) {
      console.error('Error searching Open Library:', error);
      return [];
    }
  }

  // Búsqueda en arXiv (preprints científicos)
  async searchArxiv(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      await this.checkRateLimit('arxiv');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.arxiv.baseUrl}?search_query=all:${encodedQuery}&start=0&max_results=${limit}&sortBy=relevance&sortOrder=descending`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`arXiv API error: ${response.status}`);
      }

      const xmlText = await response.text();
      return this.transformArxivResults(xmlText);
    } catch (error) {
      console.error('Error searching arXiv:', error);
      return [];
    }
  }

  // Búsqueda en Semantic Scholar (papers académicos)
  async searchSemanticScholar(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      await this.checkRateLimit('semanticScholar');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.semanticScholar.baseUrl}/paper/search?query=${encodedQuery}&limit=${limit}&fields=paperId,title,abstract,authors,year,venue,citationCount,influentialCitationCount,fieldsOfStudy,url,openAccessPdf`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (API_CONFIG.semanticScholar.apiKey) {
        headers['x-api-key'] = API_CONFIG.semanticScholar.apiKey;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSemanticScholarResults(data.data || []);
    } catch (error) {
      console.error('Error searching Semantic Scholar:', error);
      return [];
    }
  }

  // Búsqueda en Google Books
  async searchGoogleBooks(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      await this.checkRateLimit('googleBooks');
      
      const encodedQuery = encodeURIComponent(query);
      let url = `${API_CONFIG.googleBooks.baseUrl}?q=${encodedQuery}&maxResults=${limit}&orderBy=relevance`;
      
      if (API_CONFIG.googleBooks.apiKey) {
        url += `&key=${API_CONFIG.googleBooks.apiKey}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGoogleBooksResults(data.items || []);
    } catch (error) {
      console.error('Error searching Google Books:', error);
      return [];
    }
  }

  // Búsqueda combinada en todas las fuentes
  async searchAllSources(query: string, sourcesLimit: number = 10): Promise<{
    crossref: Resource[];
    openLibrary: Resource[];
    arxiv: Resource[];
    semanticScholar: Resource[];
    googleBooks: Resource[];
    combined: Resource[];
  }> {
    console.log(`🔍 Iniciando búsqueda académica para: "${query}"`);
    
    const [crossref, openLibrary, arxiv, semanticScholar, googleBooks] = await Promise.allSettled([
      this.searchCrossRef(query, sourcesLimit),
      this.searchOpenLibrary(query, sourcesLimit),
      this.searchArxiv(query, sourcesLimit),
      this.searchSemanticScholar(query, sourcesLimit),
      this.searchGoogleBooks(query, sourcesLimit)
    ]);

    const results = {
      crossref: crossref.status === 'fulfilled' ? crossref.value : [],
      openLibrary: openLibrary.status === 'fulfilled' ? openLibrary.value : [],
      arxiv: arxiv.status === 'fulfilled' ? arxiv.value : [],
      semanticScholar: semanticScholar.status === 'fulfilled' ? semanticScholar.value : [],
      googleBooks: googleBooks.status === 'fulfilled' ? googleBooks.value : [],
      combined: [] as Resource[]
    };

    // Combinar y deduplicar resultados
    const allResults = [
      ...results.crossref,
      ...results.openLibrary,
      ...results.arxiv,
      ...results.semanticScholar,
      ...results.googleBooks
    ];

    // Deduplicar por título y DOI/ISBN
    const uniqueResults = this.deduplicateResources(allResults);
    results.combined = uniqueResults.slice(0, sourcesLimit * 2); // Limitar resultados combinados

    console.log(`📊 Resultados encontrados:`, {
      CrossRef: results.crossref.length,
      'Open Library': results.openLibrary.length,
      arXiv: results.arxiv.length,
      'Semantic Scholar': results.semanticScholar.length,
      'Google Books': results.googleBooks.length,
      'Total único': results.combined.length
    });

    return results;
  }

  // Transformadores de datos
  private transformCrossRefResults(items: CrossRefWork[]): Resource[] {
    return items.map(item => ({
      id: `crossref-${item.DOI.replace(/[^a-zA-Z0-9]/g, '-')}`,
      title: Array.isArray(item.title) ? item.title[0] : item.title,
      authors: item.author?.map(a => `${a.given} ${a.family}`) || ['Unknown'],
      type: this.mapCrossRefType(item.type),
      category: item.subject?.[0] || 'Academic',
      tags: item.subject || [],
      abstract: item.abstract || 'No abstract available',
      publishedYear: item.published?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      publisher: item.publisher || 'Unknown Publisher',
      citations: item['is-referenced-by-count'] || 0,
      availability: 'digital-only' as const,
      doi: item.DOI,
      rating: Math.min(5, Math.max(1, (item['is-referenced-by-count'] || 0) / 100 + 3)),
      reviewCount: Math.floor((item['is-referenced-by-count'] || 0) / 10),
      language: 'en',
      thumbnail: `https://via.placeholder.com/120x160/3B82F6/FFFFFF?text=${encodeURIComponent(item.title.substring(0, 2))}`,
      relatedTopics: item.subject || [],
      url: item.URL,
      digitalUrl: item.URL,
      librarySystem: this.createLibrarySystemInfo('crossref', item.DOI),
      fullTextKeywords: this.extractKeywordsFromText(item.title + ' ' + (item.abstract || ''))
    }));
  }

  private transformOpenLibraryResults(items: OpenLibraryBook[]): Resource[] {
    return items.map(item => ({
      id: `openlibrary-${item.key.replace(/[^a-zA-Z0-9]/g, '-')}`,
      title: item.title,
      authors: item.author_name || ['Unknown'],
      type: 'book' as const,
      category: item.subject?.[0] || 'Literature',
      tags: item.subject?.slice(0, 10) || [],
      abstract: `Book with ${item.edition_count} editions available in Open Library`,
      publishedYear: item.first_publish_year || new Date().getFullYear(),
      publisher: item.publisher?.[0] || 'Unknown Publisher',
      citations: item.edition_count * 5, // Estimación basada en ediciones
      availability: 'digital-only' as const,
      isbn: item.isbn?.[0],
      rating: Math.min(5, Math.max(1, item.edition_count / 2 + 2)),
      reviewCount: item.edition_count * 2,
      language: item.language?.[0] || 'en',
      thumbnail: item.cover_i 
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : `https://via.placeholder.com/120x160/10B981/FFFFFF?text=${encodeURIComponent(item.title.substring(0, 2))}`,
      relatedTopics: item.subject?.slice(0, 5) || [],
      url: `https://openlibrary.org${item.key}`,
      digitalUrl: `https://openlibrary.org${item.key}`,
      librarySystem: this.createLibrarySystemInfo('openlibrary', item.key),
      fullTextKeywords: this.extractKeywordsFromText(item.title + ' ' + (item.subject?.join(' ') || ''))
    }));
  }

  private transformArxivResults(xmlText: string): Resource[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    
    return Array.from(entries).map(entry => {
      const id = entry.querySelector('id')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || '';
      const summary = entry.querySelector('summary')?.textContent || '';
      const published = entry.querySelector('published')?.textContent || '';
      const authors = Array.from(entry.querySelectorAll('author name')).map(name => name.textContent || '');
      const categories = Array.from(entry.querySelectorAll('category')).map(cat => cat.getAttribute('term') || '');
      
      return {
        id: `arxiv-${id.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '-')}`,
        title: title.replace(/\s+/g, ' ').trim(),
        authors: authors.length > 0 ? authors : ['Unknown'],
        type: 'journal' as const,
        category: categories[0] || 'Physics',
        tags: categories,
        abstract: summary.replace(/\s+/g, ' ').trim(),
        publishedYear: new Date(published).getFullYear(),
        publisher: 'arXiv',
        citations: Math.floor(Math.random() * 50), // Estimación
        availability: 'digital-only' as const,
        rating: Math.min(5, Math.max(3, Math.random() * 2 + 3)),
        reviewCount: Math.floor(Math.random() * 20),
        language: 'en',
        thumbnail: `https://via.placeholder.com/120x160/EF4444/FFFFFF?text=${encodeURIComponent(title.substring(0, 2))}`,
        relatedTopics: categories,
        url: id,
        digitalUrl: id.replace('http://arxiv.org/abs/', 'https://arxiv.org/pdf/') + '.pdf',
        librarySystem: this.createLibrarySystemInfo('arxiv', id),
        fullTextKeywords: this.extractKeywordsFromText(title + ' ' + summary)
      };
    });
  }

  private transformSemanticScholarResults(items: SemanticScholarPaper[]): Resource[] {
    return items.map(item => ({
      id: `semantic-${item.paperId}`,
      title: item.title,
      authors: item.authors?.map(a => a.name) || ['Unknown'],
      type: 'journal' as const,
      category: item.fieldsOfStudy?.[0] || 'Computer Science',
      tags: item.fieldsOfStudy || [],
      abstract: item.abstract || 'No abstract available',
      publishedYear: item.year || new Date().getFullYear(),
      publisher: item.venue || 'Unknown Venue',
      citations: item.citationCount || 0,
      impactFactor: item.influentialCitationCount || 0,
      availability: 'digital-only' as const,
      rating: Math.min(5, Math.max(1, (item.citationCount || 0) / 50 + 2)),
      reviewCount: Math.floor((item.citationCount || 0) / 5),
      language: 'en',
      thumbnail: `https://via.placeholder.com/120x160/8B5CF6/FFFFFF?text=${encodeURIComponent(item.title.substring(0, 2))}`,
      relatedTopics: item.fieldsOfStudy || [],
      url: item.url,
      digitalUrl: item.openAccessPdf?.url || item.url,
      librarySystem: this.createLibrarySystemInfo('semantic', item.paperId),
      fullTextKeywords: this.extractKeywordsFromText(item.title + ' ' + item.abstract)
    }));
  }

  private transformGoogleBooksResults(items: GoogleBooksItem[]): Resource[] {
    return items.map(item => {
      const volumeInfo = item.volumeInfo;
      const accessInfo = item.accessInfo;
      
      return {
        id: `googlebooks-${item.id}`,
        title: volumeInfo.title,
        authors: volumeInfo.authors || ['Unknown'],
        type: 'book' as const,
        category: volumeInfo.categories?.[0] || 'General',
        tags: volumeInfo.categories || [],
        abstract: volumeInfo.description || 'No description available',
        publishedYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : new Date().getFullYear(),
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        citations: Math.floor(Math.random() * 100), // Estimación
        availability: accessInfo.publicDomain ? 'digital-only' : 'available' as const,
        isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier,
        rating: Math.min(5, Math.max(2, Math.random() * 3 + 2)),
        reviewCount: Math.floor(Math.random() * 50),
        language: volumeInfo.language || 'en',
        pageCount: volumeInfo.pageCount,
        thumbnail: volumeInfo.imageLinks?.thumbnail || 
                  `https://via.placeholder.com/120x160/F59E0B/FFFFFF?text=${encodeURIComponent(volumeInfo.title.substring(0, 2))}`,
        relatedTopics: volumeInfo.categories || [],
        url: volumeInfo.infoLink,
        digitalUrl: volumeInfo.previewLink || accessInfo.webReaderLink,
        librarySystem: this.createLibrarySystemInfo('googlebooks', item.id),
        fullTextKeywords: this.extractKeywordsFromText(volumeInfo.title + ' ' + (volumeInfo.description || ''))
      };
    });
  }

  // Utilidades
  private mapCrossRefType(type: string): Resource['type'] {
    const typeMap: Record<string, Resource['type']> = {
      'journal-article': 'journal',
      'book': 'book',
      'book-chapter': 'book',
      'proceedings-article': 'conference',
      'thesis': 'thesis',
      'dataset': 'dataset'
    };
    return typeMap[type] || 'journal';
  }

  private createLibrarySystemInfo(source: string, identifier: string): LibrarySystemInfo {
    return {
      catalogId: `${source}-${identifier}`,
      barcode: `${source.toUpperCase()}-${Date.now()}`,
      acquisitionDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      totalCopies: source === 'openlibrary' ? Math.floor(Math.random() * 5) + 1 : 0,
      availableCopies: source === 'openlibrary' ? Math.floor(Math.random() * 3) : 0,
      reservedCopies: 0,
      checkedOutCopies: source === 'openlibrary' ? Math.floor(Math.random() * 2) : 0,
      digitalAccess: true,
      digitalLicenses: Math.floor(Math.random() * 10) + 5,
      digitalActiveUsers: Math.floor(Math.random() * 3)
    };
  }

  private extractKeywordsFromText(text: string): string[] {
    // Extracción simple de keywords (se puede mejorar con PLN)
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'then', 'them', 'well', 'were'].includes(word));
    
    // Contar frecuencias y devolver las más comunes
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([word]) => word);
  }

  private deduplicateResources(resources: Resource[]): Resource[] {
    const seen = new Set<string>();
    return resources.filter(resource => {
      const key = `${resource.title.toLowerCase()}-${resource.authors[0]?.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

// Instancia singleton del servicio
export const academicAPI = new AcademicAPIService();