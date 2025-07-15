// Servicios para integración con APIs académicas (con datos simulados para desarrollo)
import { Resource, LibrarySystemInfo } from '../types';

// Base de datos simulada de recursos académicos organizados por temas
const SIMULATED_ACADEMIC_DATABASE: Record<string, Resource[]> = {
  // Tecnología e Informática
  'machine learning': [
    {
      id: 'ml-001',
      title: 'Pattern Recognition and Machine Learning',
      authors: ['Christopher M. Bishop'],
      type: 'book',
      category: 'Computer Science',
      tags: ['machine learning', 'pattern recognition', 'statistics', 'algorithms'],
      abstract: 'This is the first textbook on pattern recognition to present the Bayesian viewpoint. The book presents approximate inference algorithms that permit fast approximate answers in situations where exact answers are not feasible.',
      publishedYear: 2006,
      publisher: 'Springer',
      citations: 45678,
      availability: 'digital-only',
      rating: 4.8,
      reviewCount: 1234,
      language: 'en',
      pageCount: 738,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&h=160&fit=crop',
      relatedTopics: ['artificial intelligence', 'statistics', 'data science'],
      url: 'https://example.com/pattern-recognition-ml',
      digitalUrl: 'https://example.com/pattern-recognition-ml.pdf',
      librarySystem: {
        catalogId: 'CS-ML-001',
        barcode: 'ML001234567',
        acquisitionDate: '2023-01-15',
        lastUpdated: '2024-12-04',
        totalCopies: 3,
        availableCopies: 1,
        reservedCopies: 1,
        checkedOutCopies: 1,
        digitalAccess: true,
        digitalLicenses: 100,
        digitalActiveUsers: 3
      },
      fullTextKeywords: ['machine', 'learning', 'pattern', 'recognition', 'bayesian', 'inference', 'algorithms']
    },
    {
      id: 'ml-002',
      title: 'Deep Learning',
      authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
      type: 'book',
      category: 'Computer Science',
      tags: ['deep learning', 'neural networks', 'artificial intelligence'],
      abstract: 'Deep learning is a form of machine learning that enables computers to learn from experience and understand the world in terms of a hierarchy of concepts.',
      publishedYear: 2016,
      publisher: 'MIT Press',
      citations: 38945,
      availability: 'available',
      rating: 4.7,
      reviewCount: 892,
      language: 'en',
      pageCount: 800,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=160&fit=crop',
      relatedTopics: ['neural networks', 'artificial intelligence', 'computer vision'],
      url: 'https://example.com/deep-learning',
      digitalUrl: 'https://example.com/deep-learning.pdf',
      librarySystem: {
        catalogId: 'CS-DL-002',
        barcode: 'DL002345678',
        acquisitionDate: '2023-02-20',
        lastUpdated: '2024-12-04',
        totalCopies: 5,
        availableCopies: 2,
        reservedCopies: 0,
        checkedOutCopies: 3,
        digitalAccess: true,
        digitalLicenses: 15,
        digitalActiveUsers: 7
      },
      fullTextKeywords: ['deep', 'learning', 'neural', 'networks', 'artificial', 'intelligence', 'hierarchy']
    }
  ],
  'artificial intelligence': [
    {
      id: 'ai-001',
      title: 'Artificial Intelligence: A Modern Approach',
      authors: ['Stuart Russell', 'Peter Norvig'],
      type: 'book',
      category: 'Computer Science',
      tags: ['artificial intelligence', 'algorithms', 'problem solving'],
      abstract: 'The leading textbook in Artificial Intelligence. Used in over 1300 universities in over 100 countries.',
      publishedYear: 2020,
      publisher: 'Pearson',
      citations: 52341,
      availability: 'available',
      rating: 4.9,
      reviewCount: 1567,
      language: 'en',
      pageCount: 1152,
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&h=160&fit=crop',
      relatedTopics: ['machine learning', 'robotics', 'natural language processing'],
      url: 'https://example.com/ai-modern-approach',
      digitalUrl: 'https://example.com/ai-modern-approach.pdf',
      librarySystem: {
        catalogId: 'CS-AI-001',
        barcode: 'AI001234567',
        acquisitionDate: '2023-01-10',
        lastUpdated: '2024-12-04',
        totalCopies: 8,
        availableCopies: 3,
        reservedCopies: 2,
        checkedOutCopies: 3,
        digitalAccess: true,
        digitalLicenses: 20,
        digitalActiveUsers: 12
      },
      fullTextKeywords: ['artificial', 'intelligence', 'modern', 'approach', 'algorithms', 'problem', 'solving']
    }
  ],
  'cybersecurity': [
    {
      id: 'cyber-001',
      title: 'Computer Security: Principles and Practice',
      authors: ['William Stallings', 'Lawrie Brown'],
      type: 'book',
      category: 'Computer Science',
      tags: ['cybersecurity', 'network security', 'cryptography'],
      abstract: 'Comprehensive coverage of computer security concepts, technology, principles, applications, and management.',
      publishedYear: 2023,
      publisher: 'Pearson',
      citations: 15678,
      availability: 'digital-only',
      rating: 4.6,
      reviewCount: 543,
      language: 'en',
      pageCount: 912,
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=160&fit=crop',
      relatedTopics: ['network security', 'cryptography', 'information security'],
      url: 'https://example.com/computer-security',
      digitalUrl: 'https://example.com/computer-security.pdf',
      librarySystem: {
        catalogId: 'CS-SEC-001',
        barcode: 'SEC001234567',
        acquisitionDate: '2023-03-15',
        lastUpdated: '2024-12-04',
        totalCopies: 0,
        availableCopies: 0,
        reservedCopies: 0,
        checkedOutCopies: 0,
        digitalAccess: true,
        digitalLicenses: 25,
        digitalActiveUsers: 8
      },
      fullTextKeywords: ['computer', 'security', 'principles', 'practice', 'cybersecurity', 'network', 'cryptography']
    }
  ],
  'data science': [
    {
      id: 'ds-001',
      title: 'Python for Data Analysis',
      authors: ['Wes McKinney'],
      type: 'book',
      category: 'Computer Science',
      tags: ['data science', 'python', 'data analysis', 'pandas'],
      abstract: 'Get complete instructions for manipulating, processing, cleaning, and crunching datasets in Python.',
      publishedYear: 2022,
      publisher: "O'Reilly Media",
      citations: 8934,
      availability: 'available',
      rating: 4.5,
      reviewCount: 678,
      language: 'en',
      pageCount: 550,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=160&fit=crop',
      relatedTopics: ['python programming', 'data analysis', 'statistics'],
      url: 'https://example.com/python-data-analysis',
      digitalUrl: 'https://example.com/python-data-analysis.pdf',
      librarySystem: {
        catalogId: 'CS-DS-001',
        barcode: 'DS001234567',
        acquisitionDate: '2023-04-10',
        lastUpdated: '2024-12-04',
        totalCopies: 4,
        availableCopies: 2,
        reservedCopies: 1,
        checkedOutCopies: 1,
        digitalAccess: true,
        digitalLicenses: 12,
        digitalActiveUsers: 5
      },
      fullTextKeywords: ['python', 'data', 'analysis', 'pandas', 'science', 'datasets', 'processing']
    }
  ],
  'quantum computing': [
    {
      id: 'qc-001',
      title: 'Quantum Computing: An Applied Approach',
      authors: ['Hidary Jack D.'],
      type: 'book',
      category: 'Physics',
      tags: ['quantum computing', 'quantum mechanics', 'algorithms'],
      abstract: 'This book integrates the foundations of quantum computing with a hands-on coding approach to this emerging field.',
      publishedYear: 2021,
      publisher: 'Springer',
      citations: 3456,
      availability: 'digital-only',
      rating: 4.4,
      reviewCount: 234,
      language: 'en',
      pageCount: 372,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&h=160&fit=crop',
      relatedTopics: ['quantum mechanics', 'computer science', 'physics'],
      url: 'https://example.com/quantum-computing',
      digitalUrl: 'https://example.com/quantum-computing.pdf',
      librarySystem: {
        catalogId: 'PHY-QC-001',
        barcode: 'QC001234567',
        acquisitionDate: '2023-05-20',
        lastUpdated: '2024-12-04',
        totalCopies: 0,
        availableCopies: 0,
        reservedCopies: 0,
        checkedOutCopies: 0,
        digitalAccess: true,
        digitalLicenses: 8,
        digitalActiveUsers: 2
      },
      fullTextKeywords: ['quantum', 'computing', 'applied', 'approach', 'mechanics', 'algorithms', 'coding']
    }
  ],
  'blockchain': [
    {
      id: 'bc-001',
      title: 'Mastering Bitcoin: Programming the Open Blockchain',
      authors: ['Andreas M. Antonopoulos'],
      type: 'book',
      category: 'Computer Science',
      tags: ['blockchain', 'bitcoin', 'cryptocurrency', 'programming'],
      abstract: 'Join the technological revolution that is taking the financial world by storm. Mastering Bitcoin is your guide through the seemingly complex world of bitcoin.',
      publishedYear: 2023,
      publisher: "O'Reilly Media",
      citations: 5678,
      availability: 'available',
      rating: 4.7,
      reviewCount: 456,
      language: 'en',
      pageCount: 416,
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=160&fit=crop',
      relatedTopics: ['cryptocurrency', 'programming', 'financial technology'],
      url: 'https://example.com/mastering-bitcoin',
      digitalUrl: 'https://example.com/mastering-bitcoin.pdf',
      librarySystem: {
        catalogId: 'CS-BC-001',
        barcode: 'BC001234567',
        acquisitionDate: '2023-06-15',
        lastUpdated: '2024-12-04',
        totalCopies: 2,
        availableCopies: 1,
        reservedCopies: 0,
        checkedOutCopies: 1,
        digitalAccess: true,
        digitalLicenses: 6,
        digitalActiveUsers: 3
      },
      fullTextKeywords: ['mastering', 'bitcoin', 'programming', 'blockchain', 'cryptocurrency', 'financial']
    }
  ],
  // Ciencias Naturales
  'physics': [
    {
      id: 'phy-001',
      title: 'University Physics with Modern Physics',
      authors: ['Hugh D. Young', 'Roger A. Freedman'],
      type: 'book',
      category: 'Physics',
      tags: ['physics', 'mechanics', 'thermodynamics', 'electromagnetism'],
      abstract: 'University Physics is known for its uniquely broad, deep, and thoughtful set of worked examples.',
      publishedYear: 2020,
      publisher: 'Pearson',
      citations: 12345,
      availability: 'available',
      rating: 4.6,
      reviewCount: 789,
      language: 'en',
      pageCount: 1600,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=120&h=160&fit=crop',
      relatedTopics: ['mechanics', 'thermodynamics', 'quantum physics'],
      url: 'https://example.com/university-physics',
      digitalUrl: 'https://example.com/university-physics.pdf',
      librarySystem: {
        catalogId: 'PHY-001',
        barcode: 'PHY001234567',
        acquisitionDate: '2023-01-05',
        lastUpdated: '2024-12-04',
        totalCopies: 10,
        availableCopies: 4,
        reservedCopies: 2,
        checkedOutCopies: 4,
        digitalAccess: true,
        digitalLicenses: 30,
        digitalActiveUsers: 15
      },
      fullTextKeywords: ['university', 'physics', 'modern', 'mechanics', 'thermodynamics', 'electromagnetism']
    }
  ],
  'chemistry': [
    {
      id: 'chem-001',
      title: 'General Chemistry: Principles and Modern Applications',
      authors: ['Ralph H. Petrucci', 'F. Geoffrey Herring'],
      type: 'book',
      category: 'Chemistry',
      tags: ['chemistry', 'organic chemistry', 'inorganic chemistry'],
      abstract: 'The most trusted general chemistry text in Canada is back in a thoroughly revised 11th edition.',
      publishedYear: 2022,
      publisher: 'Pearson',
      citations: 8765,
      availability: 'available',
      rating: 4.5,
      reviewCount: 567,
      language: 'en',
      pageCount: 1344,
      thumbnail: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=120&h=160&fit=crop',
      relatedTopics: ['organic chemistry', 'physical chemistry', 'biochemistry'],
      url: 'https://example.com/general-chemistry',
      digitalUrl: 'https://example.com/general-chemistry.pdf',
      librarySystem: {
        catalogId: 'CHEM-001',
        barcode: 'CHEM001234567',
        acquisitionDate: '2023-02-10',
        lastUpdated: '2024-12-04',
        totalCopies: 8,
        availableCopies: 3,
        reservedCopies: 1,
        checkedOutCopies: 4,
        digitalAccess: true,
        digitalLicenses: 20,
        digitalActiveUsers: 8
      },
      fullTextKeywords: ['general', 'chemistry', 'principles', 'modern', 'applications', 'organic', 'inorganic']
    }
  ],
  'biology': [
    {
      id: 'bio-001',
      title: 'Campbell Biology',
      authors: ['Jane B. Reece', 'Lisa A. Urry', 'Michael L. Cain'],
      type: 'book',
      category: 'Biology',
      tags: ['biology', 'cell biology', 'genetics', 'evolution'],
      abstract: 'Campbell Biology is the unsurpassed leader in introductory biology.',
      publishedYear: 2021,
      publisher: 'Pearson',
      citations: 15432,
      availability: 'available',
      rating: 4.8,
      reviewCount: 1023,
      language: 'en',
      pageCount: 1488,
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=160&fit=crop',
      relatedTopics: ['cell biology', 'genetics', 'molecular biology'],
      url: 'https://example.com/campbell-biology',
      digitalUrl: 'https://example.com/campbell-biology.pdf',
      librarySystem: {
        catalogId: 'BIO-001',
        barcode: 'BIO001234567',
        acquisitionDate: '2023-01-20',
        lastUpdated: '2024-12-04',
        totalCopies: 12,
        availableCopies: 5,
        reservedCopies: 3,
        checkedOutCopies: 4,
        digitalAccess: true,
        digitalLicenses: 25,
        digitalActiveUsers: 18
      },
      fullTextKeywords: ['campbell', 'biology', 'cell', 'genetics', 'evolution', 'molecular', 'introductory']
    }
  ],
  // Medicina y Salud
  'medicine': [
    {
      id: 'med-001',
      title: "Harrison's Principles of Internal Medicine",
      authors: ['J. Larry Jameson', 'Anthony S. Fauci', 'Dennis L. Kasper'],
      type: 'book',
      category: 'Medicine',
      tags: ['medicine', 'internal medicine', 'clinical medicine'],
      abstract: 'The landmark guide to internal medicine— updated and streamlined for today\'s students and clinicians.',
      publishedYear: 2022,
      publisher: 'McGraw-Hill Education',
      citations: 25678,
      availability: 'digital-only',
      rating: 4.9,
      reviewCount: 1456,
      language: 'en',
      pageCount: 3000,
      thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&h=160&fit=crop',
      relatedTopics: ['clinical medicine', 'pathology', 'pharmacology'],
      url: 'https://example.com/harrisons-medicine',
      digitalUrl: 'https://example.com/harrisons-medicine.pdf',
      librarySystem: {
        catalogId: 'MED-001',
        barcode: 'MED001234567',
        acquisitionDate: '2023-03-01',
        lastUpdated: '2024-12-04',
        totalCopies: 0,
        availableCopies: 0,
        reservedCopies: 0,
        checkedOutCopies: 0,
        digitalAccess: true,
        digitalLicenses: 50,
        digitalActiveUsers: 35
      },
      fullTextKeywords: ['harrison', 'principles', 'internal', 'medicine', 'clinical', 'landmark', 'guide']
    }
  ],
  // Ingeniería
  'engineering': [
    {
      id: 'eng-001',
      title: 'Engineering Mechanics: Dynamics',
      authors: ['J. L. Meriam', 'L. G. Kraige'],
      type: 'book',
      category: 'Engineering',
      tags: ['engineering', 'mechanics', 'dynamics', 'physics'],
      abstract: 'Known for its accuracy, clarity, and dependability, Meriam, Kraige, and Bolton\'s Engineering Mechanics: Dynamics.',
      publishedYear: 2020,
      publisher: 'Wiley',
      citations: 9876,
      availability: 'available',
      rating: 4.4,
      reviewCount: 432,
      language: 'en',
      pageCount: 752,
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&h=160&fit=crop',
      relatedTopics: ['mechanical engineering', 'physics', 'mathematics'],
      url: 'https://example.com/engineering-mechanics',
      digitalUrl: 'https://example.com/engineering-mechanics.pdf',
      librarySystem: {
        catalogId: 'ENG-001',
        barcode: 'ENG001234567',
        acquisitionDate: '2023-02-15',
        lastUpdated: '2024-12-04',
        totalCopies: 6,
        availableCopies: 2,
        reservedCopies: 1,
        checkedOutCopies: 3,
        digitalAccess: true,
        digitalLicenses: 15,
        digitalActiveUsers: 9
      },
      fullTextKeywords: ['engineering', 'mechanics', 'dynamics', 'meriam', 'kraige', 'accuracy', 'clarity']
    }
  ]
};

// Configuración de APIs usando proxy routes para evitar CORS
const API_CONFIG = {
  crossref: {
    baseUrl: '/api/crossref/works',
    userAgent: 'LibraryAI/1.0 (mailto:contact@libraryai.edu)'
  },
  openLibrary: {
    baseUrl: '/api/openlibrary',
    searchUrl: '/api/openlibrary/search.json'
  },
  arxiv: {
    baseUrl: '/api/arxiv/api/query'
  },
  semanticScholar: {
    baseUrl: '/api/semantic/graph/v1',
    apiKey: import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY || ''
  },
  googleBooks: {
    baseUrl: '/api/googlebooks/books/v1/volumes',
    apiKey: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || ''
  }
};

// Función para buscar en la base de datos simulada
function searchSimulatedDatabase(query: string, limit: number = 10): Resource[] {
  const searchTerms = query.toLowerCase().split(' ');
  const results: Resource[] = [];
  
  // Buscar coincidencias exactas primero
  for (const [topic, resources] of Object.entries(SIMULATED_ACADEMIC_DATABASE)) {
    if (searchTerms.some(term => topic.includes(term) || term.includes(topic))) {
      results.push(...resources);
    }
  }
  
  // Buscar en títulos, abstracts y keywords
  for (const [topic, resources] of Object.entries(SIMULATED_ACADEMIC_DATABASE)) {
    for (const resource of resources) {
      const searchText = `${resource.title} ${resource.abstract} ${resource.tags.join(' ')} ${resource.fullTextKeywords?.join(' ')}`.toLowerCase();
      
      if (searchTerms.some(term => searchText.includes(term)) && !results.find(r => r.id === resource.id)) {
        results.push(resource);
      }
    }
  }
  
  // Agregar fuente y timestamp
  return results.slice(0, limit).map(resource => ({
    ...resource,
    source: 'simulated-academic-db'
  }));
}

// Función para generar recursos adicionales basados en la búsqueda
function generateAdditionalResources(query: string, count: number = 5): Resource[] {
  const baseTopics = ['Computer Science', 'Physics', 'Mathematics', 'Engineering', 'Biology', 'Chemistry', 'Medicine'];
  const types: Resource['type'][] = ['book', 'journal', 'conference', 'thesis'];
  
  return Array.from({ length: count }, (_, index) => {
    const randomTopic = baseTopics[Math.floor(Math.random() * baseTopics.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: `generated-${query.replace(/\s+/g, '-')}-${index + 1}`,
      title: `Advanced ${query.charAt(0).toUpperCase() + query.slice(1)}: Research and Applications`,
      authors: [`Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`],
      type: randomType,
      category: randomTopic,
      tags: query.split(' ').concat(['research', 'applications', 'theory']),
      abstract: `This comprehensive work explores the latest developments in ${query}, providing both theoretical foundations and practical applications. Essential reading for researchers and practitioners in the field.`,
      publishedYear: 2020 + Math.floor(Math.random() * 4),
      publisher: ['Springer', 'Elsevier', 'IEEE', 'ACM', 'Wiley'][Math.floor(Math.random() * 5)],
      citations: Math.floor(Math.random() * 1000) + 100,
      availability: ['available', 'digital-only'][Math.floor(Math.random() * 2)] as Resource['availability'],
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      language: 'en',
      pageCount: 200 + Math.floor(Math.random() * 600),
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=120&h=160&fit=crop`,
      relatedTopics: query.split(' ').concat(['research', 'technology', 'innovation']),
      url: `https://example.com/${query.replace(/\s+/g, '-')}-${index + 1}`,
      digitalUrl: `https://example.com/${query.replace(/\s+/g, '-')}-${index + 1}.pdf`,
      librarySystem: {
        catalogId: `GEN-${index + 1}`,
        barcode: `GEN${String(index + 1).padStart(9, '0')}`,
        acquisitionDate: '2023-06-01',
        lastUpdated: '2024-12-04',
        totalCopies: Math.floor(Math.random() * 5) + 1,
        availableCopies: Math.floor(Math.random() * 3),
        reservedCopies: Math.floor(Math.random() * 2),
        checkedOutCopies: Math.floor(Math.random() * 3),
        digitalAccess: true,
        digitalLicenses: Math.floor(Math.random() * 20) + 5,
        digitalActiveUsers: Math.floor(Math.random() * 10)
      },
      fullTextKeywords: query.split(' ').concat(['advanced', 'research', 'applications', 'theory', 'practice']),
      source: 'generated-academic'
    };
  });
}

// Clase principal para gestión de APIs académicas
export class AcademicAPIService {
  private rateLimits: Map<string, { lastCall: number; callsPerMinute: number }> = new Map();
  private useSimulatedData: boolean = true; // Cambiar a false para usar APIs reales

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

  // Búsqueda simulada que siempre devuelve resultados
  private async searchSimulated(query: string, source: string, limit: number = 10): Promise<Resource[]> {
    // Simular tiempo de búsqueda
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    console.log(`🔍 Buscando "${query}" en ${source} (modo simulado)`);
    
    // Buscar en base de datos simulada
    const simulatedResults = searchSimulatedDatabase(query, Math.floor(limit * 0.6));
    
    // Generar recursos adicionales si no hay suficientes
    const additionalResults = simulatedResults.length < limit 
      ? generateAdditionalResources(query, limit - simulatedResults.length)
      : [];
    
    const allResults = [...simulatedResults, ...additionalResults].slice(0, limit);
    
    // Agregar información de fuente
    return allResults.map(resource => ({
      ...resource,
      source: source
    }));
  }

  // Búsqueda en CrossRef (artículos académicos y DOIs)
  async searchCrossRef(query: string, limit: number = 20): Promise<Resource[]> {
    if (this.useSimulatedData) {
      return this.searchSimulated(query, 'crossref', limit);
    }
    
    try {
      await this.checkRateLimit('crossref');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.crossref.baseUrl}?query=${encodedQuery}&rows=${limit}&sort=relevance&order=desc`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': API_CONFIG.crossref.userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        console.warn(`CrossRef API error: ${response.status}. Usando datos simulados.`);
        return this.searchSimulated(query, 'crossref', limit);
      }

      const data = await response.json();
      
      if (!data.message || !data.message.items) {
        console.warn('CrossRef: Respuesta inesperada. Usando datos simulados.');
        return this.searchSimulated(query, 'crossref', limit);
      }

      return this.transformCrossRefResults(data.message.items);
    } catch (error) {
      console.warn('CrossRef: Error de conexión. Usando datos simulados:', error);
      return this.searchSimulated(query, 'crossref', limit);
    }
  }

  // Búsqueda en Open Library (libros)
  async searchOpenLibrary(query: string, limit: number = 20): Promise<Resource[]> {
    if (this.useSimulatedData) {
      return this.searchSimulated(query, 'openLibrary', limit);
    }
    
    try {
      await this.checkRateLimit('openLibrary');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.openLibrary.searchUrl}?q=${encodedQuery}&limit=${limit}&fields=key,title,author_name,first_publish_year,publisher,isbn,subject,language,cover_i,edition_count`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': API_CONFIG.crossref.userAgent,
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        console.warn(`Open Library API error: ${response.status}. Usando datos simulados.`);
        return this.searchSimulated(query, 'openLibrary', limit);
      }

      const data = await response.json();
      return this.transformOpenLibraryResults(data.docs);
    } catch (error) {
      console.warn('Open Library: Error de conexión. Usando datos simulados:', error);
      return this.searchSimulated(query, 'openLibrary', limit);
    }
  }

  // Búsqueda en arXiv (preprints científicos)
  async searchArxiv(query: string, limit: number = 20): Promise<Resource[]> {
    if (this.useSimulatedData) {
      return this.searchSimulated(query, 'arxiv', limit);
    }
    
    try {
      await this.checkRateLimit('arxiv');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.arxiv.baseUrl}?search_query=all:${encodedQuery}&start=0&max_results=${limit}&sortBy=relevance&sortOrder=descending`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': API_CONFIG.crossref.userAgent,
          'Accept': 'application/atom+xml'
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        console.warn(`arXiv API error: ${response.status}. Usando datos simulados.`);
        return this.searchSimulated(query, 'arxiv', limit);
      }

      const xmlText = await response.text();
      return this.transformArxivResults(xmlText);
    } catch (error) {
      console.warn('arXiv: Error de conexión. Usando datos simulados:', error);
      return this.searchSimulated(query, 'arxiv', limit);
    }
  }

  // Búsqueda en Semantic Scholar (papers académicos)
  async searchSemanticScholar(query: string, limit: number = 20): Promise<Resource[]> {
    if (this.useSimulatedData) {
      return this.searchSimulated(query, 'semanticScholar', limit);
    }
    
    try {
      const apiKey = API_CONFIG.semanticScholar.apiKey;
      if (!this.isValidApiKey(apiKey)) {
        console.warn('Semantic Scholar: API key no configurada. Usando datos simulados.');
        return this.searchSimulated(query, 'semanticScholar', limit);
      }

      await this.checkRateLimit('semanticScholar');
      
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_CONFIG.semanticScholar.baseUrl}/paper/search?query=${encodedQuery}&limit=${limit}&fields=paperId,title,abstract,authors,year,venue,citationCount,influentialCitationCount,fieldsOfStudy,url,openAccessPdf`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'User-Agent': API_CONFIG.crossref.userAgent,
        'x-api-key': apiKey
      };
      
      const response = await fetch(url, { 
        headers,
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        console.warn(`Semantic Scholar API error: ${response.status}. Usando datos simulados.`);
        return this.searchSimulated(query, 'semanticScholar', limit);
      }

      const data = await response.json();
      return this.transformSemanticScholarResults(data.data || []);
    } catch (error) {
      console.warn('Semantic Scholar: Error de conexión. Usando datos simulados:', error);
      return this.searchSimulated(query, 'semanticScholar', limit);
    }
  }

  // Búsqueda en Google Books
  async searchGoogleBooks(query: string, limit: number = 20): Promise<Resource[]> {
    if (this.useSimulatedData) {
      return this.searchSimulated(query, 'googleBooks', limit);
    }
    
    try {
      await this.checkRateLimit('googleBooks');
      
      const encodedQuery = encodeURIComponent(query);
      let url = `${API_CONFIG.googleBooks.baseUrl}?q=${encodedQuery}&maxResults=${limit}&orderBy=relevance`;
      
      const apiKey = API_CONFIG.googleBooks.apiKey;
      if (this.isValidApiKey(apiKey)) {
        url += `&key=${apiKey}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': API_CONFIG.crossref.userAgent,
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        console.warn(`Google Books API error: ${response.status}. Usando datos simulados.`);
        return this.searchSimulated(query, 'googleBooks', limit);
      }

      const data = await response.json();
      return this.transformGoogleBooksResults(data.items || []);
    } catch (error) {
      console.warn('Google Books: Error de conexión. Usando datos simulados:', error);
      return this.searchSimulated(query, 'googleBooks', limit);
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

  // Validar si una API key es válida (no es placeholder)
  private isValidApiKey(apiKey: string): boolean {
    return apiKey && 
           apiKey.length > 10 && 
           !apiKey.includes('your_') && 
           !apiKey.includes('api_key_here') &&
           !apiKey.includes('placeholder');
  }

  // Transformadores de datos (implementaciones simplificadas para el ejemplo)
  private transformCrossRefResults(items: any[]): Resource[] {
    return items.map((item, index) => ({
      id: `crossref-real-${index}`,
      title: Array.isArray(item.title) ? item.title[0] : item.title || 'Unknown Title',
      authors: item.author?.map((a: any) => `${a.given} ${a.family}`) || ['Unknown'],
      type: 'journal' as const,
      category: 'Academic',
      tags: item.subject || [],
      abstract: item.abstract || 'No abstract available',
      publishedYear: item.published?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      publisher: item.publisher || 'Unknown Publisher',
      citations: item['is-referenced-by-count'] || 0,
      availability: 'digital-only' as const,
      rating: Math.min(5, Math.max(1, (item['is-referenced-by-count'] || 0) / 100 + 3)),
      reviewCount: Math.floor((item['is-referenced-by-count'] || 0) / 10),
      language: 'en',
      thumbnail: `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop`,
      relatedTopics: item.subject || [],
      url: item.URL,
      digitalUrl: item.URL,
      librarySystem: this.createLibrarySystemInfo('crossref', item.DOI || `crossref-${index}`),
      fullTextKeywords: this.extractKeywordsFromText(item.title + ' ' + (item.abstract || '')),
      source: 'crossref'
    }));
  }

  private transformOpenLibraryResults(items: any[]): Resource[] {
    return items.map((item, index) => ({
      id: `openlibrary-real-${index}`,
      title: item.title || 'Unknown Title',
      authors: item.author_name || ['Unknown'],
      type: 'book' as const,
      category: 'Literature',
      tags: item.subject?.slice(0, 10) || [],
      abstract: `Book with ${item.edition_count || 1} editions available`,
      publishedYear: item.first_publish_year || new Date().getFullYear(),
      publisher: item.publisher?.[0] || 'Unknown Publisher',
      citations: (item.edition_count || 1) * 5,
      availability: 'digital-only' as const,
      rating: Math.min(5, Math.max(1, (item.edition_count || 1) / 2 + 2)),
      reviewCount: (item.edition_count || 1) * 2,
      language: item.language?.[0] || 'en',
      thumbnail: item.cover_i 
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop`,
      relatedTopics: item.subject?.slice(0, 5) || [],
      url: `https://openlibrary.org${item.key}`,
      digitalUrl: `https://openlibrary.org${item.key}`,
      librarySystem: this.createLibrarySystemInfo('openlibrary', item.key || `ol-${index}`),
      fullTextKeywords: this.extractKeywordsFromText(item.title + ' ' + (item.subject?.join(' ') || '')),
      source: 'openLibrary'
    }));
  }

  private transformArxivResults(xmlText: string): Resource[] {
    // Implementación simplificada para el ejemplo
    return [];
  }

  private transformSemanticScholarResults(items: any[]): Resource[] {
    return items.map((item, index) => ({
      id: `semantic-real-${index}`,
      title: item.title || 'Unknown Title',
      authors: item.authors?.map((a: any) => a.name) || ['Unknown'],
      type: 'journal' as const,
      category: 'Computer Science',
      tags: item.fieldsOfStudy || [],
      abstract: item.abstract || 'No abstract available',
      publishedYear: item.year || new Date().getFullYear(),
      publisher: item.venue || 'Unknown Venue',
      citations: item.citationCount || 0,
      availability: 'digital-only' as const,
      rating: Math.min(5, Math.max(1, (item.citationCount || 0) / 50 + 2)),
      reviewCount: Math.floor((item.citationCount || 0) / 5),
      language: 'en',
      thumbnail: `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop`,
      relatedTopics: item.fieldsOfStudy || [],
      url: item.url,
      digitalUrl: item.openAccessPdf?.url || item.url,
      librarySystem: this.createLibrarySystemInfo('semantic', item.paperId || `sem-${index}`),
      fullTextKeywords: this.extractKeywordsFromText(item.title + ' ' + item.abstract),
      source: 'semanticScholar'
    }));
  }

  private transformGoogleBooksResults(items: any[]): Resource[] {
    return items.map((item, index) => {
      const volumeInfo = item.volumeInfo || {};
      return {
        id: `googlebooks-real-${index}`,
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || ['Unknown'],
        type: 'book' as const,
        category: 'General',
        tags: volumeInfo.categories || [],
        abstract: volumeInfo.description || 'No description available',
        publishedYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : new Date().getFullYear(),
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        citations: Math.floor(Math.random() * 100),
        availability: 'available' as const,
        rating: Math.min(5, Math.max(2, Math.random() * 3 + 2)),
        reviewCount: Math.floor(Math.random() * 50),
        language: volumeInfo.language || 'en',
        pageCount: volumeInfo.pageCount,
        thumbnail: volumeInfo.imageLinks?.thumbnail || 
                  `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop`,
        relatedTopics: volumeInfo.categories || [],
        url: volumeInfo.infoLink,
        digitalUrl: volumeInfo.previewLink,
        librarySystem: this.createLibrarySystemInfo('googlebooks', item.id || `gb-${index}`),
        fullTextKeywords: this.extractKeywordsFromText(volumeInfo.title + ' ' + (volumeInfo.description || '')),
        source: 'googleBooks'
      };
    });
  }

  // Utilidades
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
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'then', 'them', 'well', 'were'].includes(word));
    
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

  // Método para cambiar entre datos simulados y APIs reales
  setUseSimulatedData(useSimulated: boolean): void {
    this.useSimulatedData = useSimulated;
    console.log(`🔄 Modo de datos: ${useSimulated ? 'Simulado' : 'APIs Reales'}`);
  }

  // Método para obtener el estado actual
  isUsingSimulatedData(): boolean {
    return this.useSimulatedData;
  }
}

// Instancia singleton del servicio
export const academicAPI = new AcademicAPIService();