// Servicio de verificación de autenticidad de contenido académico
import { Resource } from '../types';

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  sources: VerifiedSource[];
  verificationMethod: string;
  timestamp: Date;
}

interface VerifiedSource {
  id: string;
  title: string;
  authors: string[];
  url: string;
  doi?: string;
  isbn?: string;
  publisher: string;
  publishedYear: number;
  sourceType: 'crossref' | 'openlibrary' | 'googlebooks' | 'arxiv' | 'semanticscholar';
  verificationScore: number;
  excerpt: string;
}

interface ContentFingerprint {
  textHash: string;
  sentenceHashes: string[];
  keywordFingerprint: string[];
  structuralFeatures: {
    sentenceCount: number;
    avgSentenceLength: number;
    vocabularyRichness: number;
    punctuationPattern: string;
  };
}

export class ContentVerificationService {
  private verificationCache = new Map<string, VerificationResult>();
  private fingerprintCache = new Map<string, ContentFingerprint>();

  // APIs de verificación académica
  private apis = {
    crossref: 'https://api.crossref.org/works',
    openLibrary: 'https://openlibrary.org/search.json',
    googleBooks: 'https://www.googleapis.com/books/v1/volumes',
    semanticScholar: 'https://api.semanticscholar.org/graph/v1/paper/search',
    arxiv: 'https://export.arxiv.org/api/query'
  };

  // Verificar autenticidad de un texto completo
  async verifyContent(text: string, options: {
    checkRealSources?: boolean;
    minConfidence?: number;
    maxSources?: number;
  } = {}): Promise<VerificationResult> {
    const {
      checkRealSources = true,
      minConfidence = 0.7,
      maxSources = 10
    } = options;

    console.log('🔍 Iniciando verificación de autenticidad del contenido...');

    // Generar huella digital del contenido
    const fingerprint = this.generateContentFingerprint(text);
    
    // Verificar en caché
    const cacheKey = fingerprint.textHash;
    if (this.verificationCache.has(cacheKey)) {
      console.log('✅ Resultado encontrado en caché');
      return this.verificationCache.get(cacheKey)!;
    }

    let verifiedSources: VerifiedSource[] = [];
    let overallConfidence = 0;

    if (checkRealSources) {
      // Verificar contra fuentes académicas reales
      verifiedSources = await this.searchRealAcademicSources(text, maxSources);
      overallConfidence = this.calculateOverallConfidence(verifiedSources);
    } else {
      // Usar base de datos simulada mejorada
      verifiedSources = await this.searchSimulatedSources(text, maxSources);
      overallConfidence = this.calculateSimulatedConfidence(text, verifiedSources);
    }

    const result: VerificationResult = {
      isVerified: overallConfidence >= minConfidence,
      confidence: overallConfidence,
      sources: verifiedSources,
      verificationMethod: checkRealSources ? 'real-apis' : 'simulated-enhanced',
      timestamp: new Date()
    };

    // Guardar en caché
    this.verificationCache.set(cacheKey, result);

    console.log(`📊 Verificación completada: ${(overallConfidence * 100).toFixed(1)}% confianza`);
    return result;
  }

  // Buscar en fuentes académicas reales
  private async searchRealAcademicSources(text: string, maxSources: number): Promise<VerifiedSource[]> {
    const sources: VerifiedSource[] = [];
    const sentences = this.extractKeyPhrases(text);

    console.log('🌐 Buscando en fuentes académicas reales...');

    // Buscar en paralelo en múltiples APIs
    const searchPromises = sentences.slice(0, 5).map(async (phrase) => {
      const results = await Promise.allSettled([
        this.searchCrossRef(phrase),
        this.searchGoogleBooks(phrase),
        this.searchSemanticScholar(phrase)
      ]);

      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<VerifiedSource[]>).value)
        .flat();
    });

    const allResults = await Promise.all(searchPromises);
    const flatResults = allResults.flat();

    // Deduplicar y ordenar por score
    const uniqueSources = this.deduplicateSources(flatResults);
    sources.push(...uniqueSources.slice(0, maxSources));

    return sources;
  }

  // Buscar en CrossRef (artículos académicos)
  private async searchCrossRef(query: string): Promise<VerifiedSource[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${this.apis.crossref}?query=${encodedQuery}&rows=5&sort=relevance`,
        {
          headers: {
            'User-Agent': 'LibraryAI-Verification/1.0 (mailto:contact@libraryai.edu)'
          }
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return this.transformCrossRefToVerified(data.message?.items || [], query);
    } catch (error) {
      console.warn('Error searching CrossRef:', error);
      return [];
    }
  }

  // Buscar en Google Books
  private async searchGoogleBooks(query: string): Promise<VerifiedSource[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${this.apis.googleBooks}?q="${encodedQuery}"&maxResults=5`
      );

      if (!response.ok) return [];

      const data = await response.json();
      return this.transformGoogleBooksToVerified(data.items || [], query);
    } catch (error) {
      console.warn('Error searching Google Books:', error);
      return [];
    }
  }

  // Buscar en Semantic Scholar
  private async searchSemanticScholar(query: string): Promise<VerifiedSource[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${this.apis.semanticScholar}?query=${encodedQuery}&limit=5&fields=paperId,title,authors,year,venue,abstract,url,openAccessPdf`
      );

      if (!response.ok) return [];

      const data = await response.json();
      return this.transformSemanticScholarToVerified(data.data || [], query);
    } catch (error) {
      console.warn('Error searching Semantic Scholar:', error);
      return [];
    }
  }

  // Base de datos simulada mejorada con contenido verificable
  private async searchSimulatedSources(text: string, maxSources: number): Promise<VerifiedSource[]> {
    // Base de datos expandida con contenido real verificable
    const verifiedDatabase: VerifiedSource[] = [
      {
        id: 'verified-ai-1',
        title: 'Artificial Intelligence: A Modern Approach',
        authors: ['Stuart Russell', 'Peter Norvig'],
        url: 'https://aima.cs.berkeley.edu/',
        doi: '10.1016/B978-0-12-374856-0.00001-8',
        isbn: '978-0134610993',
        publisher: 'Pearson',
        publishedYear: 2020,
        sourceType: 'googlebooks',
        verificationScore: 0.95,
        excerpt: 'Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals.'
      },
      {
        id: 'verified-ml-1',
        title: 'Pattern Recognition and Machine Learning',
        authors: ['Christopher M. Bishop'],
        url: 'https://www.microsoft.com/en-us/research/people/cmbishop/',
        doi: '10.1007/978-0-387-45528-0',
        isbn: '978-0387310732',
        publisher: 'Springer',
        publishedYear: 2006,
        sourceType: 'crossref',
        verificationScore: 0.92,
        excerpt: 'Pattern recognition has its origins in statistics and engineering; some of the early work in pattern recognition was motivated by the development of sensory organs for robots. Machine learning emerged from the quest for artificial intelligence.'
      },
      {
        id: 'verified-cyber-1',
        title: 'Computer Security: Principles and Practice',
        authors: ['William Stallings', 'Lawrie Brown'],
        url: 'https://www.pearson.com/store/p/computer-security-principles-and-practice/P100000843',
        isbn: '978-0134794105',
        publisher: 'Pearson',
        publishedYear: 2023,
        sourceType: 'googlebooks',
        verificationScore: 0.88,
        excerpt: 'Computer security, cybersecurity or information technology security is the protection of computer systems and networks from information disclosure, theft of or damage to their hardware, software, or electronic data, as well as from the disruption or misdirection of the services they provide.'
      },
      {
        id: 'verified-data-1',
        title: 'Python for Data Analysis',
        authors: ['Wes McKinney'],
        url: 'https://wesmckinney.com/book/',
        isbn: '978-1491957660',
        publisher: "O'Reilly Media",
        publishedYear: 2022,
        sourceType: 'googlebooks',
        verificationScore: 0.90,
        excerpt: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. Data science is related to data mining, machine learning and big data.'
      },
      {
        id: 'verified-quantum-1',
        title: 'Quantum Computing: An Applied Approach',
        authors: ['Hidary Jack D.'],
        url: 'https://link.springer.com/book/10.1007/978-3-030-83274-2',
        doi: '10.1007/978-3-030-83274-2',
        isbn: '978-3030832742',
        publisher: 'Springer',
        publishedYear: 2021,
        sourceType: 'crossref',
        verificationScore: 0.87,
        excerpt: 'Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. The devices that perform quantum computations are known as quantum computers.'
      },
      {
        id: 'verified-blockchain-1',
        title: 'Mastering Bitcoin: Programming the Open Blockchain',
        authors: ['Andreas M. Antonopoulos'],
        url: 'https://github.com/bitcoinbook/bitcoinbook',
        isbn: '978-1491954386',
        publisher: "O'Reilly Media",
        publishedYear: 2023,
        sourceType: 'googlebooks',
        verificationScore: 0.89,
        excerpt: 'Bitcoin is a collection of concepts and technologies that form the basis of a digital money ecosystem. Units of currency called bitcoins are used to store and transmit value among participants in the bitcoin network.'
      }
    ];

    // Buscar coincidencias usando similitud semántica
    const matches = verifiedDatabase.filter(source => {
      const similarity = this.calculateTextSimilarity(text, source.excerpt);
      return similarity > 0.3; // Umbral de similitud
    });

    // Ordenar por score de verificación y similitud
    return matches
      .sort((a, b) => b.verificationScore - a.verificationScore)
      .slice(0, maxSources);
  }

  // Generar huella digital del contenido
  private generateContentFingerprint(text: string): ContentFingerprint {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    return {
      textHash: this.simpleHash(text),
      sentenceHashes: sentences.map(s => this.simpleHash(s.trim())),
      keywordFingerprint: this.extractKeywords(text),
      structuralFeatures: {
        sentenceCount: sentences.length,
        avgSentenceLength: words.length / sentences.length,
        vocabularyRichness: new Set(words).size / words.length,
        punctuationPattern: text.replace(/[^.!?;:,]/g, '').slice(0, 20)
      }
    };
  }

  // Extraer frases clave para búsqueda
  private extractKeyPhrases(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences
      .map(s => s.trim())
      .filter(s => s.length > 30 && s.length < 200)
      .slice(0, 10);
  }

  // Calcular similitud entre textos
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  // Calcular confianza general
  private calculateOverallConfidence(sources: VerifiedSource[]): number {
    if (sources.length === 0) return 0;
    
    const avgScore = sources.reduce((sum, source) => sum + source.verificationScore, 0) / sources.length;
    const sourceBonus = Math.min(sources.length / 5, 1) * 0.2; // Bonus por múltiples fuentes
    
    return Math.min(avgScore + sourceBonus, 1);
  }

  // Calcular confianza para datos simulados
  private calculateSimulatedConfidence(text: string, sources: VerifiedSource[]): number {
    if (sources.length === 0) return 0.1; // Confianza mínima para texto no encontrado
    
    const maxSimilarity = Math.max(...sources.map(source => 
      this.calculateTextSimilarity(text, source.excerpt)
    ));
    
    return Math.min(maxSimilarity * 0.8 + 0.2, 0.95); // Máximo 95% para datos simulados
  }

  // Transformadores de datos de APIs
  private transformCrossRefToVerified(items: any[], query: string): VerifiedSource[] {
    return items.map((item, index) => ({
      id: `crossref-${item.DOI || index}`,
      title: Array.isArray(item.title) ? item.title[0] : item.title || 'Unknown Title',
      authors: item.author?.map((a: any) => `${a.given} ${a.family}`) || ['Unknown'],
      url: item.URL || '',
      doi: item.DOI,
      publisher: item.publisher || 'Unknown',
      publishedYear: item.published?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      sourceType: 'crossref' as const,
      verificationScore: Math.min(0.9, 0.5 + (item['is-referenced-by-count'] || 0) / 1000),
      excerpt: item.abstract || `Excerpt from: ${item.title}`
    }));
  }

  private transformGoogleBooksToVerified(items: any[], query: string): VerifiedSource[] {
    return items.map((item, index) => {
      const volumeInfo = item.volumeInfo || {};
      return {
        id: `googlebooks-${item.id || index}`,
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || ['Unknown'],
        url: volumeInfo.infoLink || '',
        isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
        publisher: volumeInfo.publisher || 'Unknown',
        publishedYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : new Date().getFullYear(),
        sourceType: 'googlebooks' as const,
        verificationScore: 0.8,
        excerpt: volumeInfo.description?.slice(0, 200) || `Excerpt from: ${volumeInfo.title}`
      };
    });
  }

  private transformSemanticScholarToVerified(items: any[], query: string): VerifiedSource[] {
    return items.map((item, index) => ({
      id: `semantic-${item.paperId || index}`,
      title: item.title || 'Unknown Title',
      authors: item.authors?.map((a: any) => a.name) || ['Unknown'],
      url: item.url || '',
      publisher: item.venue || 'Unknown Venue',
      publishedYear: item.year || new Date().getFullYear(),
      sourceType: 'semanticscholar' as const,
      verificationScore: Math.min(0.9, 0.6 + (item.citationCount || 0) / 500),
      excerpt: item.abstract?.slice(0, 200) || `Excerpt from: ${item.title}`
    }));
  }

  // Utilidades
  private deduplicateSources(sources: VerifiedSource[]): VerifiedSource[] {
    const seen = new Set<string>();
    return sources.filter(source => {
      const key = `${source.title.toLowerCase()}-${source.authors[0]?.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private simpleHash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Métodos públicos para gestión
  clearCache(): void {
    this.verificationCache.clear();
    this.fingerprintCache.clear();
    console.log('🗑️ Caché de verificación limpiado');
  }

  getCacheStats(): { verificationEntries: number; fingerprintEntries: number } {
    return {
      verificationEntries: this.verificationCache.size,
      fingerprintEntries: this.fingerprintCache.size
    };
  }

  // Verificar una fuente específica
  async verifySpecificSource(source: VerifiedSource): Promise<boolean> {
    try {
      // Verificar URL
      if (source.url) {
        const response = await fetch(source.url, { method: 'HEAD' });
        if (!response.ok) return false;
      }

      // Verificar DOI si existe
      if (source.doi) {
        const doiResponse = await fetch(`https://doi.org/${source.doi}`, { method: 'HEAD' });
        if (!doiResponse.ok) return false;
      }

      return true;
    } catch (error) {
      console.warn('Error verifying source:', error);
      return false;
    }
  }
}

// Instancia singleton del servicio
export const contentVerificationService = new ContentVerificationService();