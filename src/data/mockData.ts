import { User, Resource, Recommendation } from '../types';

// ==================== USUARIOS Y AUTENTICACIÓN ====================

export const superAdmin: User = {
  id: 'admin-001',
  name: 'Alain Raidel Vazquez Rodriguez',
  email: 'alainr@admin.edu.cu',
  role: 'admin',
  department: 'Computer Science',
  academicLevel: 'Administrator',
  interests: ['System Administration', 'AI', 'Database Management'],
  readingHistory: ['res-001', 'res-002', 'res-003'],
  favoriteGenres: ['Computer Science', 'Artificial Intelligence'],
  researchAreas: ['System Administration', 'Educational Technology', 'AI in Education']
};

// Base de datos de usuarios en memoria
let userDatabase: User[] = [superAdmin];

// Sesiones activas
export interface ActiveSession {
  sessionId: string;
  userId: string;
  user: User;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

let activeSessions: ActiveSession[] = [];

// ==================== CATEGORÍAS Y TEMAS ====================

export interface BookCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export const bookCategories: BookCategory[] = [
  {
    id: 'ai-ml',
    name: 'Inteligencia Artificial y Machine Learning',
    description: 'Recursos sobre IA, ML, Deep Learning y tecnologías cognitivas',
    icon: 'Brain',
    color: 'purple',
    subcategories: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Neural Networks', 'AI Ethics', 'Robotics']
  },
  {
    id: 'programming',
    name: 'Programación y Desarrollo',
    description: 'Lenguajes de programación, frameworks y metodologías de desarrollo',
    icon: 'Code',
    color: 'blue',
    subcategories: ['Python', 'JavaScript', 'Java', 'C++', 'Web Development', 'Mobile Development', 'DevOps', 'Software Architecture']
  },
  {
    id: 'data-science',
    name: 'Ciencia de Datos y Analytics',
    description: 'Big Data, análisis estadístico y visualización de datos',
    icon: 'BarChart3',
    color: 'green',
    subcategories: ['Data Mining', 'Statistics', 'Data Visualization', 'Big Data', 'Business Intelligence', 'Predictive Analytics', 'R Programming', 'SQL']
  },
  {
    id: 'cybersecurity',
    name: 'Ciberseguridad y Criptografía',
    description: 'Seguridad informática, criptografía y protección de datos',
    icon: 'Shield',
    color: 'red',
    subcategories: ['Network Security', 'Cryptography', 'Ethical Hacking', 'Digital Forensics', 'Information Security', 'Blockchain', 'Privacy', 'Malware Analysis']
  },
  {
    id: 'systems',
    name: 'Sistemas y Redes',
    description: 'Sistemas operativos, redes de computadoras y arquitectura',
    icon: 'Server',
    color: 'orange',
    subcategories: ['Operating Systems', 'Computer Networks', 'Distributed Systems', 'Cloud Computing', 'System Administration', 'Network Protocols', 'Virtualization', 'Containers']
  },
  {
    id: 'databases',
    name: 'Bases de Datos',
    description: 'Gestión de bases de datos, SQL, NoSQL y almacenamiento',
    icon: 'Database',
    color: 'indigo',
    subcategories: ['SQL', 'NoSQL', 'Database Design', 'Data Warehousing', 'MongoDB', 'PostgreSQL', 'MySQL', 'Database Administration']
  },
  {
    id: 'algorithms',
    name: 'Algoritmos y Estructuras de Datos',
    description: 'Algoritmos fundamentales, complejidad y estructuras de datos',
    icon: 'GitBranch',
    color: 'teal',
    subcategories: ['Sorting Algorithms', 'Graph Algorithms', 'Dynamic Programming', 'Data Structures', 'Algorithm Analysis', 'Optimization', 'Computational Complexity', 'Parallel Algorithms']
  },
  {
    id: 'mathematics',
    name: 'Matemáticas para Computación',
    description: 'Matemáticas discretas, álgebra lineal y estadística',
    icon: 'Calculator',
    color: 'pink',
    subcategories: ['Discrete Mathematics', 'Linear Algebra', 'Statistics', 'Probability', 'Calculus', 'Graph Theory', 'Number Theory', 'Mathematical Logic']
  },
  {
    id: 'software-engineering',
    name: 'Ingeniería de Software',
    description: 'Metodologías, patrones de diseño y gestión de proyectos',
    icon: 'Wrench',
    color: 'yellow',
    subcategories: ['Software Design', 'Agile Methodologies', 'Testing', 'Project Management', 'Requirements Engineering', 'Software Quality', 'Maintenance', 'Documentation']
  },
  {
    id: 'emerging-tech',
    name: 'Tecnologías Emergentes',
    description: 'IoT, Quantum Computing, AR/VR y tecnologías del futuro',
    icon: 'Zap',
    color: 'violet',
    subcategories: ['Internet of Things', 'Quantum Computing', 'Augmented Reality', 'Virtual Reality', 'Blockchain Technology', 'Edge Computing', '5G Networks', 'Nanotechnology']
  }
];

// ==================== RECURSOS BIBLIOTECARIOS EXPANDIDOS ====================

export const mockResources: Resource[] = [
  // INTELIGENCIA ARTIFICIAL Y MACHINE LEARNING
  {
    id: 'ai-001',
    title: 'Artificial Intelligence: A Modern Approach',
    authors: ['Stuart Russell', 'Peter Norvig'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['AI', 'Machine Learning', 'Algorithms', 'Problem Solving'],
    abstract: 'The leading textbook in Artificial Intelligence, used in over 1400 schools in 128 countries. Comprehensive coverage of AI concepts, algorithms, and applications.',
    publishedYear: 2020,
    publisher: 'Pearson',
    citations: 15420,
    impactFactor: 9.2,
    availability: 'available',
    location: 'Section A, Shelf 12',
    isbn: '978-0134610993',
    rating: 4.8,
    reviewCount: 2847,
    language: 'English',
    pageCount: 1152,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Machine Learning', 'Neural Networks', 'Expert Systems'],
    url: 'https://library.university.edu/catalog/ai-modern-approach',
    digitalUrl: 'https://digital.library.edu/books/ai-modern-approach-pdf',
    librarySystem: {
      catalogId: 'CAT-AI-001',
      barcode: '31234567890123',
      acquisitionDate: '2020-09-15',
      lastUpdated: '2024-01-15',
      totalCopies: 5,
      availableCopies: 3,
      reservedCopies: 1,
      checkedOutCopies: 1,
      dueDate: '2024-02-15'
    },
    fullTextKeywords: ['artificial intelligence', 'machine learning', 'neural networks', 'search algorithms', 'knowledge representation', 'natural language processing', 'computer vision', 'robotics', 'expert systems', 'planning', 'uncertainty', 'learning algorithms']
  },
  {
    id: 'ai-002',
    title: 'Deep Learning',
    authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['Deep Learning', 'Neural Networks', 'Backpropagation', 'CNN', 'RNN'],
    abstract: 'The definitive textbook on deep learning, covering mathematical foundations, practical techniques, and research perspectives.',
    publishedYear: 2016,
    publisher: 'MIT Press',
    citations: 28750,
    impactFactor: 12.5,
    availability: 'digital-only',
    isbn: '978-0262035613',
    rating: 4.9,
    reviewCount: 1923,
    language: 'English',
    pageCount: 800,
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Neural Networks', 'Convolutional Networks', 'Recurrent Networks'],
    digitalUrl: 'https://www.deeplearningbook.org/',
    librarySystem: {
      catalogId: 'CAT-AI-002',
      barcode: '31234567890124',
      acquisitionDate: '2021-03-10',
      lastUpdated: '2024-01-10',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 50,
      digitalActiveUsers: 12
    },
    fullTextKeywords: ['deep learning', 'neural networks', 'backpropagation', 'convolutional networks', 'recurrent networks', 'autoencoders', 'generative models', 'optimization', 'regularization', 'representation learning']
  },
  {
    id: 'ai-003',
    title: 'Pattern Recognition and Machine Learning',
    authors: ['Christopher Bishop'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['Pattern Recognition', 'Bayesian Methods', 'Statistical Learning'],
    abstract: 'A comprehensive introduction to pattern recognition and machine learning from a Bayesian perspective.',
    publishedYear: 2006,
    publisher: 'Springer',
    citations: 45230,
    impactFactor: 15.8,
    availability: 'checked-out',
    location: 'Section A, Shelf 13',
    isbn: '978-0387310732',
    rating: 4.7,
    reviewCount: 1456,
    language: 'English',
    pageCount: 738,
    thumbnail: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Bayesian Networks', 'Support Vector Machines', 'Clustering'],
    url: 'https://library.university.edu/catalog/pattern-recognition-ml',
    librarySystem: {
      catalogId: 'CAT-AI-003',
      barcode: '31234567890125',
      acquisitionDate: '2019-08-20',
      lastUpdated: '2024-01-12',
      totalCopies: 3,
      availableCopies: 0,
      reservedCopies: 2,
      checkedOutCopies: 3,
      dueDate: '2024-02-20',
      waitingList: ['user-123', 'user-456']
    },
    fullTextKeywords: ['pattern recognition', 'machine learning', 'bayesian methods', 'statistical learning', 'classification', 'regression', 'clustering', 'dimensionality reduction', 'kernel methods', 'graphical models']
  },
  {
    id: 'ai-004',
    title: 'Natural Language Processing with Python',
    authors: ['Steven Bird', 'Ewan Klein', 'Edward Loper'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['NLP', 'Python', 'Text Processing', 'NLTK'],
    abstract: 'Practical guide to natural language processing using Python and the NLTK library.',
    publishedYear: 2019,
    publisher: "O'Reilly Media",
    citations: 8920,
    impactFactor: 7.3,
    availability: 'available',
    location: 'Section A, Shelf 14',
    isbn: '978-0596516499',
    rating: 4.5,
    reviewCount: 892,
    language: 'English',
    pageCount: 504,
    thumbnail: 'https://images.pexels.com/photos/8386421/pexels-photo-8386421.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Text Mining', 'Sentiment Analysis', 'Language Models'],
    url: 'https://library.university.edu/catalog/nlp-python',
    digitalUrl: 'https://www.nltk.org/book/',
    librarySystem: {
      catalogId: 'CAT-AI-004',
      barcode: '31234567890126',
      acquisitionDate: '2020-01-15',
      lastUpdated: '2024-01-08',
      totalCopies: 4,
      availableCopies: 2,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-02-10'
    },
    fullTextKeywords: ['natural language processing', 'python programming', 'text processing', 'tokenization', 'parsing', 'semantic analysis', 'information extraction', 'machine translation', 'speech recognition', 'computational linguistics']
  },
  {
    id: 'ai-005',
    title: 'Reinforcement Learning: An Introduction',
    authors: ['Richard Sutton', 'Andrew Barto'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['Reinforcement Learning', 'Q-Learning', 'Policy Gradient'],
    abstract: 'The standard textbook on reinforcement learning, covering fundamental concepts and advanced techniques.',
    publishedYear: 2018,
    publisher: 'MIT Press',
    citations: 32150,
    impactFactor: 18.2,
    availability: 'reserved',
    location: 'Section A, Shelf 15',
    isbn: '978-0262039246',
    rating: 4.8,
    reviewCount: 1234,
    language: 'English',
    pageCount: 552,
    thumbnail: 'https://images.pexels.com/photos/8386415/pexels-photo-8386415.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Markov Decision Processes', 'Dynamic Programming', 'Temporal Difference'],
    url: 'https://library.university.edu/catalog/reinforcement-learning',
    digitalUrl: 'http://incompleteideas.net/book/the-book-2nd.html',
    librarySystem: {
      catalogId: 'CAT-AI-005',
      barcode: '31234567890127',
      acquisitionDate: '2020-05-10',
      lastUpdated: '2024-01-05',
      totalCopies: 2,
      availableCopies: 0,
      reservedCopies: 2,
      checkedOutCopies: 0,
      reservedBy: ['user-789', 'user-101']
    },
    fullTextKeywords: ['reinforcement learning', 'markov decision processes', 'dynamic programming', 'monte carlo methods', 'temporal difference learning', 'policy gradient', 'actor critic', 'multi armed bandits', 'exploration exploitation', 'value functions']
  },
  {
    id: 'ai-006',
    title: 'Computer Vision: Algorithms and Applications',
    authors: ['Richard Szeliski'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['Computer Vision', 'Image Processing', 'Feature Detection'],
    abstract: 'Comprehensive textbook on computer vision covering fundamental algorithms and modern applications.',
    publishedYear: 2022,
    publisher: 'Springer',
    citations: 12340,
    impactFactor: 8.9,
    availability: 'available',
    location: 'Section A, Shelf 16',
    isbn: '978-1848829343',
    rating: 4.6,
    reviewCount: 756,
    language: 'English',
    pageCount: 812,
    thumbnail: 'https://images.pexels.com/photos/8386408/pexels-photo-8386408.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Image Processing', 'Object Recognition', 'Machine Learning'],
    url: 'https://library.university.edu/catalog/computer-vision-algorithms',
    digitalUrl: 'https://szeliski.org/Book/',
    librarySystem: {
      catalogId: 'CAT-AI-006',
      barcode: '31234567890140',
      acquisitionDate: '2022-08-15',
      lastUpdated: '2024-01-20',
      totalCopies: 4,
      availableCopies: 3,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-02-28'
    },
    fullTextKeywords: ['computer vision', 'image processing', 'feature detection', 'object recognition', 'stereo vision', 'motion estimation', 'image segmentation', 'face recognition', 'optical flow', 'structure from motion']
  },
  {
    id: 'ai-007',
    title: 'AI Ethics: Global Perspectives',
    authors: ['Luciano Floridi', 'Josh Cowls', 'Monica Beltrametti'],
    type: 'book',
    category: 'Inteligencia Artificial y Machine Learning',
    tags: ['AI Ethics', 'Responsible AI', 'Algorithmic Bias'],
    abstract: 'Comprehensive examination of ethical considerations in artificial intelligence development and deployment.',
    publishedYear: 2023,
    publisher: 'Oxford University Press',
    citations: 2340,
    impactFactor: 6.7,
    availability: 'digital-only',
    isbn: '978-0198857839',
    rating: 4.4,
    reviewCount: 234,
    language: 'English',
    pageCount: 456,
    thumbnail: 'https://images.pexels.com/photos/8386401/pexels-photo-8386401.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Responsible AI', 'Algorithmic Fairness', 'AI Governance'],
    digitalUrl: 'https://digital.library.edu/books/ai-ethics-global-perspectives',
    librarySystem: {
      catalogId: 'CAT-AI-007',
      barcode: '31234567890141',
      acquisitionDate: '2023-05-10',
      lastUpdated: '2024-01-18',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 30,
      digitalActiveUsers: 7
    },
    fullTextKeywords: ['ai ethics', 'responsible ai', 'algorithmic bias', 'fairness', 'transparency', 'accountability', 'privacy', 'human rights', 'ai governance', 'ethical frameworks', 'social impact', 'digital rights']
  },

  // PROGRAMACIÓN Y DESARROLLO
  {
    id: 'prog-001',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    authors: ['Robert C. Martin'],
    type: 'book',
    category: 'Programación y Desarrollo',
    tags: ['Clean Code', 'Software Craftsmanship', 'Best Practices'],
    abstract: 'Essential guide to writing clean, maintainable code with practical examples and principles.',
    publishedYear: 2008,
    publisher: 'Prentice Hall',
    citations: 12450,
    impactFactor: 8.7,
    availability: 'available',
    location: 'Section B, Shelf 5',
    isbn: '978-0132350884',
    rating: 4.6,
    reviewCount: 3421,
    language: 'English',
    pageCount: 464,
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Software Engineering', 'Code Quality', 'Refactoring'],
    url: 'https://library.university.edu/catalog/clean-code',
    librarySystem: {
      catalogId: 'CAT-PROG-001',
      barcode: '31234567890128',
      acquisitionDate: '2019-03-20',
      lastUpdated: '2024-01-14',
      totalCopies: 6,
      availableCopies: 4,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-02-18'
    },
    fullTextKeywords: ['clean code', 'software craftsmanship', 'code quality', 'refactoring', 'naming conventions', 'functions', 'comments', 'formatting', 'objects', 'data structures', 'error handling', 'unit testing']
  },
  {
    id: 'prog-002',
    title: 'JavaScript: The Definitive Guide',
    authors: ['David Flanagan'],
    type: 'book',
    category: 'Programación y Desarrollo',
    tags: ['JavaScript', 'Web Development', 'Programming'],
    abstract: 'Comprehensive guide to JavaScript programming, covering ES6+ features and modern development practices.',
    publishedYear: 2020,
    publisher: "O'Reilly Media",
    citations: 5670,
    impactFactor: 6.2,
    availability: 'digital-only',
    isbn: '978-1491952023',
    rating: 4.4,
    reviewCount: 1876,
    language: 'English',
    pageCount: 706,
    thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Web Development', 'Frontend Development', 'Node.js'],
    digitalUrl: 'https://digital.library.edu/books/javascript-definitive-guide',
    librarySystem: {
      catalogId: 'CAT-PROG-002',
      barcode: '31234567890129',
      acquisitionDate: '2021-01-10',
      lastUpdated: '2024-01-11',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 25,
      digitalActiveUsers: 8
    },
    fullTextKeywords: ['javascript', 'web development', 'programming language', 'es6', 'dom manipulation', 'event handling', 'ajax', 'promises', 'async await', 'closures', 'prototypes', 'modules']
  },
  {
    id: 'prog-003',
    title: 'Python Crash Course',
    authors: ['Eric Matthes'],
    type: 'book',
    category: 'Programación y Desarrollo',
    tags: ['Python', 'Programming', 'Beginner'],
    abstract: 'Fast-paced introduction to Python programming with hands-on projects and practical examples.',
    publishedYear: 2019,
    publisher: 'No Starch Press',
    citations: 3420,
    impactFactor: 5.1,
    availability: 'available',
    location: 'Section B, Shelf 8',
    isbn: '978-1593279288',
    rating: 4.7,
    reviewCount: 2134,
    language: 'English',
    pageCount: 544,
    thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Data Science', 'Web Development', 'Automation'],
    url: 'https://library.university.edu/catalog/python-crash-course',
    librarySystem: {
      catalogId: 'CAT-PROG-003',
      barcode: '31234567890130',
      acquisitionDate: '2020-02-15',
      lastUpdated: '2024-01-13',
      totalCopies: 8,
      availableCopies: 5,
      reservedCopies: 2,
      checkedOutCopies: 3,
      dueDate: '2024-02-25'
    },
    fullTextKeywords: ['python programming', 'programming basics', 'data types', 'control structures', 'functions', 'classes', 'file handling', 'web scraping', 'data visualization', 'game development', 'web applications', 'testing']
  },
  {
    id: 'prog-004',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
    type: 'book',
    category: 'Programación y Desarrollo',
    tags: ['Design Patterns', 'Object-Oriented Programming', 'Software Architecture'],
    abstract: 'Classic book on design patterns that provides solutions to common software design problems.',
    publishedYear: 1994,
    publisher: 'Addison-Wesley',
    citations: 45670,
    impactFactor: 15.2,
    availability: 'available',
    location: 'Section B, Shelf 3',
    isbn: '978-0201633610',
    rating: 4.5,
    reviewCount: 2876,
    language: 'English',
    pageCount: 395,
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Software Architecture', 'Object-Oriented Design', 'Software Engineering'],
    url: 'https://library.university.edu/catalog/design-patterns',
    librarySystem: {
      catalogId: 'CAT-PROG-004',
      barcode: '31234567890142',
      acquisitionDate: '2018-09-10',
      lastUpdated: '2024-01-16',
      totalCopies: 5,
      availableCopies: 3,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-02-22'
    },
    fullTextKeywords: ['design patterns', 'object oriented programming', 'software architecture', 'creational patterns', 'structural patterns', 'behavioral patterns', 'singleton', 'factory', 'observer', 'strategy', 'decorator', 'adapter']
  },
  {
    id: 'prog-005',
    title: 'React: Up & Running',
    authors: ['Stoyan Stefanov'],
    type: 'book',
    category: 'Programación y Desarrollo',
    tags: ['React', 'Frontend Development', 'JavaScript'],
    abstract: 'Practical guide to building user interfaces with React, covering components, state management, and modern patterns.',
    publishedYear: 2021,
    publisher: "O'Reilly Media",
    citations: 1890,
    impactFactor: 4.3,
    availability: 'digital-only',
    isbn: '978-1491931820',
    rating: 4.2,
    reviewCount: 567,
    language: 'English',
    pageCount: 312,
    thumbnail: 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Frontend Development', 'JavaScript', 'Web Development'],
    digitalUrl: 'https://digital.library.edu/books/react-up-running',
    librarySystem: {
      catalogId: 'CAT-PROG-005',
      barcode: '31234567890143',
      acquisitionDate: '2021-06-15',
      lastUpdated: '2024-01-17',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 20,
      digitalActiveUsers: 6
    },
    fullTextKeywords: ['react', 'frontend development', 'javascript', 'components', 'jsx', 'state management', 'hooks', 'virtual dom', 'props', 'lifecycle methods', 'routing', 'testing']
  },
  {
    id: 'prog-006',
    title: 'Docker Deep Dive',
    authors: ['Nigel Poulton'],
    type: 'book',
    category: 'Programación y Desarrollo',
    tags: ['Docker', 'Containerization', 'DevOps'],
    abstract: 'Comprehensive guide to Docker containerization technology, from basics to advanced orchestration.',
    publishedYear: 2020,
    publisher: 'Leanpub',
    citations: 2340,
    impactFactor: 5.6,
    availability: 'available',
    location: 'Section B, Shelf 12',
    isbn: '978-1521822807',
    rating: 4.6,
    reviewCount: 892,
    language: 'English',
    pageCount: 389,
    thumbnail: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['DevOps', 'Containerization', 'Microservices'],
    url: 'https://library.university.edu/catalog/docker-deep-dive',
    librarySystem: {
      catalogId: 'CAT-PROG-006',
      barcode: '31234567890144',
      acquisitionDate: '2020-11-20',
      lastUpdated: '2024-01-19',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-02-26'
    },
    fullTextKeywords: ['docker', 'containerization', 'devops', 'microservices', 'orchestration', 'kubernetes', 'container registry', 'dockerfile', 'docker compose', 'swarm mode', 'networking', 'volumes']
  },

  // CIENCIA DE DATOS Y ANALYTICS
  {
    id: 'data-001',
    title: 'Python for Data Analysis',
    authors: ['Wes McKinney'],
    type: 'book',
    category: 'Ciencia de Datos y Analytics',
    tags: ['Data Analysis', 'Python', 'Pandas', 'NumPy'],
    abstract: 'Essential guide to data analysis with Python, focusing on pandas, NumPy, and IPython.',
    publishedYear: 2017,
    publisher: "O'Reilly Media",
    citations: 8920,
    impactFactor: 7.8,
    availability: 'available',
    location: 'Section C, Shelf 3',
    isbn: '978-1491957660',
    rating: 4.5,
    reviewCount: 1567,
    language: 'English',
    pageCount: 544,
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Data Science', 'Statistical Analysis', 'Data Visualization'],
    url: 'https://library.university.edu/catalog/python-data-analysis',
    digitalUrl: 'https://digital.library.edu/books/python-data-analysis-pdf',
    librarySystem: {
      catalogId: 'CAT-DATA-001',
      barcode: '31234567890131',
      acquisitionDate: '2020-06-10',
      lastUpdated: '2024-01-09',
      totalCopies: 5,
      availableCopies: 3,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-02-12'
    },
    fullTextKeywords: ['data analysis', 'python', 'pandas', 'numpy', 'data manipulation', 'data cleaning', 'exploratory data analysis', 'time series', 'groupby operations', 'data aggregation', 'statistical analysis', 'data visualization']
  },
  {
    id: 'data-002',
    title: 'The Elements of Statistical Learning',
    authors: ['Trevor Hastie', 'Robert Tibshirani', 'Jerome Friedman'],
    type: 'book',
    category: 'Ciencia de Datos y Analytics',
    tags: ['Statistical Learning', 'Machine Learning', 'Statistics'],
    abstract: 'Comprehensive treatment of statistical learning methods with emphasis on applications in data mining and bioinformatics.',
    publishedYear: 2016,
    publisher: 'Springer',
    citations: 67890,
    impactFactor: 25.4,
    availability: 'digital-only',
    isbn: '978-0387848570',
    rating: 4.8,
    reviewCount: 987,
    language: 'English',
    pageCount: 745,
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Machine Learning', 'Statistical Methods', 'Predictive Modeling'],
    digitalUrl: 'https://web.stanford.edu/~hastie/ElemStatLearn/',
    librarySystem: {
      catalogId: 'CAT-DATA-002',
      barcode: '31234567890132',
      acquisitionDate: '2021-04-05',
      lastUpdated: '2024-01-07',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 100,
      digitalActiveUsers: 23
    },
    fullTextKeywords: ['statistical learning', 'machine learning', 'supervised learning', 'unsupervised learning', 'linear regression', 'classification', 'resampling methods', 'regularization', 'tree based methods', 'support vector machines', 'neural networks', 'ensemble methods']
  },
  {
    id: 'data-003',
    title: 'R for Data Science',
    authors: ['Hadley Wickham', 'Garrett Grolemund'],
    type: 'book',
    category: 'Ciencia de Datos y Analytics',
    tags: ['R Programming', 'Data Science', 'Statistics'],
    abstract: 'Learn how to use R to turn raw data into insight, knowledge, and understanding.',
    publishedYear: 2017,
    publisher: "O'Reilly Media",
    citations: 6780,
    impactFactor: 7.2,
    availability: 'available',
    location: 'Section C, Shelf 5',
    isbn: '978-1491910399',
    rating: 4.6,
    reviewCount: 1234,
    language: 'English',
    pageCount: 520,
    thumbnail: 'https://images.pexels.com/photos/590024/pexels-photo-590024.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Statistical Analysis', 'Data Visualization', 'R Programming'],
    url: 'https://library.university.edu/catalog/r-data-science',
    digitalUrl: 'https://r4ds.had.co.nz/',
    librarySystem: {
      catalogId: 'CAT-DATA-003',
      barcode: '31234567890145',
      acquisitionDate: '2020-03-15',
      lastUpdated: '2024-01-21',
      totalCopies: 4,
      availableCopies: 2,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-03-01'
    },
    fullTextKeywords: ['r programming', 'data science', 'statistics', 'data visualization', 'ggplot2', 'dplyr', 'tidyverse', 'data wrangling', 'exploratory data analysis', 'statistical modeling', 'data import', 'data transformation']
  },
  {
    id: 'data-004',
    title: 'Hands-On Machine Learning with Scikit-Learn and TensorFlow',
    authors: ['Aurélien Géron'],
    type: 'book',
    category: 'Ciencia de Datos y Analytics',
    tags: ['Machine Learning', 'Scikit-Learn', 'TensorFlow'],
    abstract: 'Practical guide to machine learning using popular Python libraries with hands-on examples.',
    publishedYear: 2019,
    publisher: "O'Reilly Media",
    citations: 4560,
    impactFactor: 6.8,
    availability: 'digital-only',
    isbn: '978-1492032649',
    rating: 4.7,
    reviewCount: 1876,
    language: 'English',
    pageCount: 851,
    thumbnail: 'https://images.pexels.com/photos/590026/pexels-photo-590026.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Machine Learning', 'Deep Learning', 'Python'],
    digitalUrl: 'https://digital.library.edu/books/hands-on-ml-scikit-tensorflow',
    librarySystem: {
      catalogId: 'CAT-DATA-004',
      barcode: '31234567890146',
      acquisitionDate: '2021-07-20',
      lastUpdated: '2024-01-22',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 35,
      digitalActiveUsers: 14
    },
    fullTextKeywords: ['machine learning', 'scikit learn', 'tensorflow', 'supervised learning', 'unsupervised learning', 'neural networks', 'deep learning', 'feature engineering', 'model evaluation', 'ensemble methods', 'dimensionality reduction', 'clustering']
  },
  {
    id: 'data-005',
    title: 'Data Visualization: A Practical Introduction',
    authors: ['Kieran Healy'],
    type: 'book',
    category: 'Ciencia de Datos y Analytics',
    tags: ['Data Visualization', 'ggplot2', 'R Programming'],
    abstract: 'Comprehensive guide to creating effective data visualizations using R and ggplot2.',
    publishedYear: 2018,
    publisher: 'Princeton University Press',
    citations: 2340,
    impactFactor: 5.4,
    availability: 'available',
    location: 'Section C, Shelf 8',
    isbn: '978-0691181622',
    rating: 4.4,
    reviewCount: 567,
    language: 'English',
    pageCount: 296,
    thumbnail: 'https://images.pexels.com/photos/590028/pexels-photo-590028.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Data Visualization', 'Statistical Graphics', 'R Programming'],
    url: 'https://library.university.edu/catalog/data-visualization-practical',
    librarySystem: {
      catalogId: 'CAT-DATA-005',
      barcode: '31234567890147',
      acquisitionDate: '2020-08-10',
      lastUpdated: '2024-01-23',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-05'
    },
    fullTextKeywords: ['data visualization', 'ggplot2', 'r programming', 'statistical graphics', 'charts', 'graphs', 'visual design', 'exploratory data analysis', 'presentation graphics', 'color theory', 'typography', 'dashboard design']
  },

  // CIBERSEGURIDAD Y CRIPTOGRAFÍA
  {
    id: 'cyber-001',
    title: 'Applied Cryptography: Protocols, Algorithms and Source Code in C',
    authors: ['Bruce Schneier'],
    type: 'book',
    category: 'Ciberseguridad y Criptografía',
    tags: ['Cryptography', 'Security', 'Algorithms', 'Protocols'],
    abstract: 'Comprehensive guide to cryptographic protocols and algorithms with practical implementations.',
    publishedYear: 2015,
    publisher: 'Wiley',
    citations: 23450,
    impactFactor: 12.3,
    availability: 'available',
    location: 'Section D, Shelf 2',
    isbn: '978-1119096726',
    rating: 4.6,
    reviewCount: 1234,
    language: 'English',
    pageCount: 784,
    thumbnail: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Network Security', 'Information Security', 'Blockchain'],
    url: 'https://library.university.edu/catalog/applied-cryptography',
    librarySystem: {
      catalogId: 'CAT-CYBER-001',
      barcode: '31234567890133',
      acquisitionDate: '2019-09-15',
      lastUpdated: '2024-01-06',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-02-08'
    },
    fullTextKeywords: ['cryptography', 'encryption', 'decryption', 'digital signatures', 'hash functions', 'key management', 'public key cryptography', 'symmetric cryptography', 'cryptographic protocols', 'security analysis', 'implementation', 'algorithms']
  },
  {
    id: 'cyber-002',
    title: 'The Web Application Hacker\'s Handbook',
    authors: ['Dafydd Stuttard', 'Marcus Pinto'],
    type: 'book',
    category: 'Ciberseguridad y Criptografía',
    tags: ['Web Security', 'Penetration Testing', 'Ethical Hacking'],
    abstract: 'Comprehensive guide to finding and exploiting security flaws in web applications.',
    publishedYear: 2011,
    publisher: 'Wiley',
    citations: 8760,
    impactFactor: 6.8,
    availability: 'checked-out',
    location: 'Section D, Shelf 3',
    isbn: '978-1118026472',
    rating: 4.7,
    reviewCount: 892,
    language: 'English',
    pageCount: 912,
    thumbnail: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Penetration Testing', 'Web Security', 'Vulnerability Assessment'],
    url: 'https://library.university.edu/catalog/web-app-hackers-handbook',
    librarySystem: {
      catalogId: 'CAT-CYBER-002',
      barcode: '31234567890134',
      acquisitionDate: '2020-03-20',
      lastUpdated: '2024-01-04',
      totalCopies: 2,
      availableCopies: 0,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-02-15',
      waitingList: ['user-234']
    },
    fullTextKeywords: ['web application security', 'penetration testing', 'vulnerability assessment', 'sql injection', 'cross site scripting', 'authentication bypass', 'session management', 'access controls', 'input validation', 'security testing', 'ethical hacking', 'web vulnerabilities']
  },
  {
    id: 'cyber-003',
    title: 'Network Security Essentials',
    authors: ['William Stallings'],
    type: 'book',
    category: 'Ciberseguridad y Criptografía',
    tags: ['Network Security', 'Firewalls', 'VPN'],
    abstract: 'Comprehensive introduction to network security concepts, protocols, and technologies.',
    publishedYear: 2020,
    publisher: 'Pearson',
    citations: 5670,
    impactFactor: 7.1,
    availability: 'available',
    location: 'Section D, Shelf 5',
    isbn: '978-0134527338',
    rating: 4.3,
    reviewCount: 678,
    language: 'English',
    pageCount: 432,
    thumbnail: 'https://images.pexels.com/photos/60506/security-protection-anti-virus-software-60506.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Network Security', 'Cryptography', 'Information Security'],
    url: 'https://library.university.edu/catalog/network-security-essentials',
    librarySystem: {
      catalogId: 'CAT-CYBER-003',
      barcode: '31234567890148',
      acquisitionDate: '2021-02-10',
      lastUpdated: '2024-01-24',
      totalCopies: 4,
      availableCopies: 3,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-08'
    },
    fullTextKeywords: ['network security', 'firewalls', 'vpn', 'intrusion detection', 'access control', 'authentication', 'encryption', 'network protocols', 'security policies', 'risk management', 'incident response', 'security architecture']
  },
  {
    id: 'cyber-004',
    title: 'Digital Forensics and Incident Response',
    authors: ['Gerard Johansen'],
    type: 'book',
    category: 'Ciberseguridad y Criptografía',
    tags: ['Digital Forensics', 'Incident Response', 'Cybercrime Investigation'],
    abstract: 'Practical guide to digital forensics and incident response in cybersecurity investigations.',
    publishedYear: 2021,
    publisher: 'Packt Publishing',
    citations: 1890,
    impactFactor: 4.2,
    availability: 'digital-only',
    isbn: '978-1800569393',
    rating: 4.1,
    reviewCount: 234,
    language: 'English',
    pageCount: 368,
    thumbnail: 'https://images.pexels.com/photos/60508/security-protection-anti-virus-software-60508.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Digital Forensics', 'Cybercrime', 'Security Investigation'],
    digitalUrl: 'https://digital.library.edu/books/digital-forensics-incident-response',
    librarySystem: {
      catalogId: 'CAT-CYBER-004',
      barcode: '31234567890149',
      acquisitionDate: '2022-01-15',
      lastUpdated: '2024-01-25',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 15,
      digitalActiveUsers: 4
    },
    fullTextKeywords: ['digital forensics', 'incident response', 'cybercrime investigation', 'evidence collection', 'malware analysis', 'network forensics', 'mobile forensics', 'memory forensics', 'forensic tools', 'chain of custody', 'legal procedures', 'threat hunting']
  },

  // SISTEMAS Y REDES
  {
    id: 'sys-001',
    title: 'Computer Networks: A Top-Down Approach',
    authors: ['James Kurose', 'Keith Ross'],
    type: 'book',
    category: 'Sistemas y Redes',
    tags: ['Computer Networks', 'TCP/IP', 'Internet Protocols'],
    abstract: 'Comprehensive introduction to computer networking with a top-down approach to understanding network protocols.',
    publishedYear: 2016,
    publisher: 'Pearson',
    citations: 18920,
    impactFactor: 9.5,
    availability: 'available',
    location: 'Section E, Shelf 1',
    isbn: '978-0133594140',
    rating: 4.5,
    reviewCount: 2341,
    language: 'English',
    pageCount: 864,
    thumbnail: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Network Protocols', 'Internet Architecture', 'Network Security'],
    url: 'https://library.university.edu/catalog/computer-networks-top-down',
    digitalUrl: 'https://digital.library.edu/books/computer-networks-kurose-ross',
    librarySystem: {
      catalogId: 'CAT-SYS-001',
      barcode: '31234567890135',
      acquisitionDate: '2019-08-10',
      lastUpdated: '2024-01-03',
      totalCopies: 7,
      availableCopies: 4,
      reservedCopies: 2,
      checkedOutCopies: 3,
      dueDate: '2024-02-20'
    },
    fullTextKeywords: ['computer networks', 'internet protocols', 'tcp ip', 'network layers', 'application layer', 'transport layer', 'network layer', 'link layer', 'wireless networks', 'network security', 'multimedia networking', 'network management']
  },
  {
    id: 'sys-002',
    title: 'Operating System Concepts',
    authors: ['Abraham Silberschatz', 'Peter Galvin', 'Greg Gagne'],
    type: 'book',
    category: 'Sistemas y Redes',
    tags: ['Operating Systems', 'Process Management', 'Memory Management'],
    abstract: 'Comprehensive textbook covering fundamental concepts of operating systems including processes, memory, and file systems.',
    publishedYear: 2018,
    publisher: 'Wiley',
    citations: 25670,
    impactFactor: 11.2,
    availability: 'reserved',
    location: 'Section E, Shelf 2',
    isbn: '978-1118063330',
    rating: 4.4,
    reviewCount: 1876,
    language: 'English',
    pageCount: 976,
    thumbnail: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['System Programming', 'Concurrent Programming', 'Distributed Systems'],
    url: 'https://library.university.edu/catalog/operating-system-concepts',
    librarySystem: {
      catalogId: 'CAT-SYS-002',
      barcode: '31234567890136',
      acquisitionDate: '2020-01-25',
      lastUpdated: '2024-01-02',
      totalCopies: 4,
      availableCopies: 0,
      reservedCopies: 4,
      checkedOutCopies: 0,
      reservedBy: ['user-345', 'user-456', 'user-567', 'user-678']
    },
    fullTextKeywords: ['operating systems', 'process management', 'memory management', 'file systems', 'synchronization', 'deadlocks', 'cpu scheduling', 'virtual memory', 'storage management', 'protection', 'security', 'distributed systems']
  },
  {
    id: 'sys-003',
    title: 'Distributed Systems: Concepts and Design',
    authors: ['George Coulouris', 'Jean Dollimore', 'Tim Kindberg'],
    type: 'book',
    category: 'Sistemas y Redes',
    tags: ['Distributed Systems', 'Concurrency', 'Fault Tolerance'],
    abstract: 'Comprehensive textbook on distributed systems covering fundamental concepts and modern architectures.',
    publishedYear: 2019,
    publisher: 'Addison-Wesley',
    citations: 12340,
    impactFactor: 8.7,
    availability: 'available',
    location: 'Section E, Shelf 5',
    isbn: '978-0132143011',
    rating: 4.3,
    reviewCount: 987,
    language: 'English',
    pageCount: 927,
    thumbnail: 'https://images.pexels.com/photos/1148822/pexels-photo-1148822.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Distributed Computing', 'Microservices', 'Cloud Computing'],
    url: 'https://library.university.edu/catalog/distributed-systems-concepts',
    librarySystem: {
      catalogId: 'CAT-SYS-003',
      barcode: '31234567890150',
      acquisitionDate: '2020-09-20',
      lastUpdated: '2024-01-26',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-10'
    },
    fullTextKeywords: ['distributed systems', 'concurrency', 'fault tolerance', 'consistency', 'replication', 'consensus', 'distributed algorithms', 'microservices', 'service oriented architecture', 'cloud computing', 'scalability', 'reliability']
  },
  {
    id: 'sys-004',
    title: 'Cloud Computing: Concepts, Technology & Architecture',
    authors: ['Thomas Erl', 'Zaigham Mahmood', 'Ricardo Puttini'],
    type: 'book',
    category: 'Sistemas y Redes',
    tags: ['Cloud Computing', 'Virtualization', 'Scalability'],
    abstract: 'Comprehensive guide to cloud computing concepts, technologies, and architectural patterns.',
    publishedYear: 2021,
    publisher: 'Prentice Hall',
    citations: 3450,
    impactFactor: 6.2,
    availability: 'digital-only',
    isbn: '978-0133387520',
    rating: 4.2,
    reviewCount: 456,
    language: 'English',
    pageCount: 528,
    thumbnail: 'https://images.pexels.com/photos/1148824/pexels-photo-1148824.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Cloud Architecture', 'Virtualization', 'Distributed Systems'],
    digitalUrl: 'https://digital.library.edu/books/cloud-computing-concepts',
    librarySystem: {
      catalogId: 'CAT-SYS-004',
      barcode: '31234567890151',
      acquisitionDate: '2021-11-15',
      lastUpdated: '2024-01-27',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 25,
      digitalActiveUsers: 9
    },
    fullTextKeywords: ['cloud computing', 'virtualization', 'scalability', 'elasticity', 'saas', 'paas', 'iaas', 'cloud architecture', 'multi tenancy', 'cloud security', 'hybrid cloud', 'cloud migration']
  },

  // BASES DE DATOS
  {
    id: 'db-001',
    title: 'Database System Concepts',
    authors: ['Abraham Silberschatz', 'Henry Korth', 'S. Sudarshan'],
    type: 'book',
    category: 'Bases de Datos',
    tags: ['Database Systems', 'SQL', 'Relational Databases'],
    abstract: 'Comprehensive textbook covering database system concepts, design, and implementation.',
    publishedYear: 2019,
    publisher: 'McGraw-Hill',
    citations: 15430,
    impactFactor: 8.9,
    availability: 'available',
    location: 'Section F, Shelf 1',
    isbn: '978-0078022159',
    rating: 4.3,
    reviewCount: 1654,
    language: 'English',
    pageCount: 1376,
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Database Design', 'Query Processing', 'Transaction Management'],
    url: 'https://library.university.edu/catalog/database-system-concepts',
    librarySystem: {
      catalogId: 'CAT-DB-001',
      barcode: '31234567890137',
      acquisitionDate: '2020-04-15',
      lastUpdated: '2024-01-01',
      totalCopies: 6,
      availableCopies: 3,
      reservedCopies: 2,
      checkedOutCopies: 3,
      dueDate: '2024-02-28'
    },
    fullTextKeywords: ['database systems', 'relational databases', 'sql', 'database design', 'normalization', 'query processing', 'transaction management', 'concurrency control', 'recovery', 'distributed databases', 'data warehousing', 'nosql']
  },
  {
    id: 'db-002',
    title: 'MongoDB: The Definitive Guide',
    authors: ['Kristina Chodorow', 'Michael Dirolf'],
    type: 'book',
    category: 'Bases de Datos',
    tags: ['MongoDB', 'NoSQL', 'Document Databases'],
    abstract: 'Complete guide to MongoDB, covering installation, querying, indexing, and advanced features.',
    publishedYear: 2013,
    publisher: "O'Reilly Media",
    citations: 4320,
    impactFactor: 5.2,
    availability: 'digital-only',
    isbn: '978-1449344689',
    rating: 4.2,
    reviewCount: 876,
    language: 'English',
    pageCount: 432,
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['NoSQL Databases', 'Document Stores', 'Big Data'],
    digitalUrl: 'https://digital.library.edu/books/mongodb-definitive-guide',
    librarySystem: {
      catalogId: 'CAT-DB-002',
      barcode: '31234567890138',
      acquisitionDate: '2021-02-10',
      lastUpdated: '2023-12-30',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 15,
      digitalActiveUsers: 5
    },
    fullTextKeywords: ['mongodb', 'nosql', 'document database', 'json', 'bson', 'querying', 'indexing', 'aggregation', 'replication', 'sharding', 'performance', 'administration']
  },
  {
    id: 'db-003',
    title: 'PostgreSQL: Up and Running',
    authors: ['Regina Obe', 'Leo Hsu'],
    type: 'book',
    category: 'Bases de Datos',
    tags: ['PostgreSQL', 'SQL', 'Database Administration'],
    abstract: 'Practical guide to PostgreSQL database administration and advanced features.',
    publishedYear: 2020,
    publisher: "O'Reilly Media",
    citations: 2340,
    impactFactor: 4.8,
    availability: 'available',
    location: 'Section F, Shelf 3',
    isbn: '978-1491963418',
    rating: 4.4,
    reviewCount: 567,
    language: 'English',
    pageCount: 312,
    thumbnail: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['SQL', 'Database Administration', 'Relational Databases'],
    url: 'https://library.university.edu/catalog/postgresql-up-running',
    librarySystem: {
      catalogId: 'CAT-DB-003',
      barcode: '31234567890152',
      acquisitionDate: '2021-03-25',
      lastUpdated: '2024-01-28',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-12'
    },
    fullTextKeywords: ['postgresql', 'sql', 'database administration', 'relational database', 'acid properties', 'indexing', 'query optimization', 'stored procedures', 'triggers', 'replication', 'backup', 'performance tuning']
  },
  {
    id: 'db-004',
    title: 'Data Warehousing Fundamentals',
    authors: ['Paulraj Ponniah'],
    type: 'book',
    category: 'Bases de Datos',
    tags: ['Data Warehousing', 'ETL', 'Business Intelligence'],
    abstract: 'Comprehensive guide to data warehousing concepts, design, and implementation.',
    publishedYear: 2018,
    publisher: 'Wiley',
    citations: 3450,
    impactFactor: 5.6,
    availability: 'available',
    location: 'Section F, Shelf 6',
    isbn: '978-0471412540',
    rating: 4.1,
    reviewCount: 345,
    language: 'English',
    pageCount: 542,
    thumbnail: 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Business Intelligence', 'Data Mining', 'Analytics'],
    url: 'https://library.university.edu/catalog/data-warehousing-fundamentals',
    librarySystem: {
      catalogId: 'CAT-DB-004',
      barcode: '31234567890153',
      acquisitionDate: '2020-07-10',
      lastUpdated: '2024-01-29',
      totalCopies: 2,
      availableCopies: 1,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-15'
    },
    fullTextKeywords: ['data warehousing', 'etl', 'business intelligence', 'olap', 'dimensional modeling', 'star schema', 'snowflake schema', 'data marts', 'data integration', 'metadata management', 'data quality', 'reporting']
  },

  // ALGORITMOS Y ESTRUCTURAS DE DATOS
  {
    id: 'algo-001',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    type: 'book',
    category: 'Algoritmos y Estructuras de Datos',
    tags: ['Algorithms', 'Data Structures', 'Complexity Analysis'],
    abstract: 'Comprehensive textbook covering fundamental algorithms and data structures with mathematical analysis.',
    publishedYear: 2009,
    publisher: 'MIT Press',
    citations: 67890,
    impactFactor: 18.5,
    availability: 'available',
    location: 'Section G, Shelf 1',
    isbn: '978-0262033848',
    rating: 4.7,
    reviewCount: 3456,
    language: 'English',
    pageCount: 1312,
    thumbnail: 'https://images.pexels.com/photos/1181683/pexels-photo-1181683.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Computer Science Theory', 'Mathematical Analysis', 'Programming'],
    url: 'https://library.university.edu/catalog/introduction-algorithms',
    librarySystem: {
      catalogId: 'CAT-ALGO-001',
      barcode: '31234567890154',
      acquisitionDate: '2018-05-15',
      lastUpdated: '2024-01-30',
      totalCopies: 8,
      availableCopies: 5,
      reservedCopies: 2,
      checkedOutCopies: 3,
      dueDate: '2024-03-18'
    },
    fullTextKeywords: ['algorithms', 'data structures', 'complexity analysis', 'sorting', 'searching', 'graph algorithms', 'dynamic programming', 'greedy algorithms', 'divide and conquer', 'asymptotic notation', 'trees', 'heaps']
  },
  {
    id: 'algo-002',
    title: 'Algorithm Design Manual',
    authors: ['Steven S. Skiena'],
    type: 'book',
    category: 'Algoritmos y Estructuras de Datos',
    tags: ['Algorithm Design', 'Problem Solving', 'Programming Contests'],
    abstract: 'Practical guide to algorithm design with real-world examples and problem-solving techniques.',
    publishedYear: 2020,
    publisher: 'Springer',
    citations: 8920,
    impactFactor: 7.3,
    availability: 'digital-only',
    isbn: '978-1848000698',
    rating: 4.5,
    reviewCount: 1234,
    language: 'English',
    pageCount: 748,
    thumbnail: 'https://images.pexels.com/photos/1181685/pexels-photo-1181685.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Problem Solving', 'Competitive Programming', 'Algorithm Analysis'],
    digitalUrl: 'https://digital.library.edu/books/algorithm-design-manual',
    librarySystem: {
      catalogId: 'CAT-ALGO-002',
      barcode: '31234567890155',
      acquisitionDate: '2021-08-20',
      lastUpdated: '2024-01-31',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 40,
      digitalActiveUsers: 16
    },
    fullTextKeywords: ['algorithm design', 'problem solving', 'programming contests', 'optimization', 'graph theory', 'combinatorial algorithms', 'computational geometry', 'string algorithms', 'numerical algorithms', 'heuristics', 'approximation algorithms', 'backtracking']
  },
  {
    id: 'algo-003',
    title: 'Competitive Programming Handbook',
    authors: ['Antti Laaksonen'],
    type: 'book',
    category: 'Algoritmos y Estructuras de Datos',
    tags: ['Competitive Programming', 'Problem Solving', 'Algorithms'],
    abstract: 'Comprehensive guide to competitive programming with algorithms and problem-solving techniques.',
    publishedYear: 2021,
    publisher: 'Self-Published',
    citations: 1890,
    impactFactor: 4.2,
    availability: 'available',
    location: 'Section G, Shelf 5',
    isbn: '978-9526805597',
    rating: 4.6,
    reviewCount: 567,
    language: 'English',
    pageCount: 292,
    thumbnail: 'https://images.pexels.com/photos/1181687/pexels-photo-1181687.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Programming Contests', 'Algorithm Implementation', 'Problem Solving'],
    url: 'https://library.university.edu/catalog/competitive-programming-handbook',
    digitalUrl: 'https://cses.fi/book/book.pdf',
    librarySystem: {
      catalogId: 'CAT-ALGO-003',
      barcode: '31234567890156',
      acquisitionDate: '2022-02-10',
      lastUpdated: '2024-02-01',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-20'
    },
    fullTextKeywords: ['competitive programming', 'problem solving', 'algorithms', 'data structures', 'graph algorithms', 'dynamic programming', 'number theory', 'combinatorics', 'geometry', 'string processing', 'range queries', 'tree algorithms']
  },

  // MATEMÁTICAS PARA COMPUTACIÓN
  {
    id: 'math-001',
    title: 'Discrete Mathematics and Its Applications',
    authors: ['Kenneth H. Rosen'],
    type: 'book',
    category: 'Matemáticas para Computación',
    tags: ['Discrete Mathematics', 'Logic', 'Graph Theory'],
    abstract: 'Comprehensive textbook on discrete mathematics with applications to computer science.',
    publishedYear: 2019,
    publisher: 'McGraw-Hill',
    citations: 23450,
    impactFactor: 9.8,
    availability: 'available',
    location: 'Section H, Shelf 1',
    isbn: '978-0073383095',
    rating: 4.4,
    reviewCount: 2134,
    language: 'English',
    pageCount: 1072,
    thumbnail: 'https://images.pexels.com/photos/1181689/pexels-photo-1181689.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Mathematical Logic', 'Combinatorics', 'Number Theory'],
    url: 'https://library.university.edu/catalog/discrete-mathematics-applications',
    librarySystem: {
      catalogId: 'CAT-MATH-001',
      barcode: '31234567890157',
      acquisitionDate: '2020-01-15',
      lastUpdated: '2024-02-02',
      totalCopies: 6,
      availableCopies: 4,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-03-22'
    },
    fullTextKeywords: ['discrete mathematics', 'logic', 'graph theory', 'combinatorics', 'number theory', 'set theory', 'relations', 'functions', 'boolean algebra', 'proof techniques', 'recursion', 'counting principles']
  },
  {
    id: 'math-002',
    title: 'Linear Algebra and Its Applications',
    authors: ['David C. Lay', 'Steven R. Lay', 'Judi J. McDonald'],
    type: 'book',
    category: 'Matemáticas para Computación',
    tags: ['Linear Algebra', 'Matrices', 'Vector Spaces'],
    abstract: 'Modern introduction to linear algebra with applications to computer science and engineering.',
    publishedYear: 2020,
    publisher: 'Pearson',
    citations: 18920,
    impactFactor: 8.7,
    availability: 'digital-only',
    isbn: '978-0321982384',
    rating: 4.3,
    reviewCount: 1567,
    language: 'English',
    pageCount: 576,
    thumbnail: 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Mathematics', 'Computer Graphics', 'Machine Learning'],
    digitalUrl: 'https://digital.library.edu/books/linear-algebra-applications',
    librarySystem: {
      catalogId: 'CAT-MATH-002',
      barcode: '31234567890158',
      acquisitionDate: '2021-09-10',
      lastUpdated: '2024-02-03',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 50,
      digitalActiveUsers: 18
    },
    fullTextKeywords: ['linear algebra', 'matrices', 'vector spaces', 'eigenvalues', 'eigenvectors', 'linear transformations', 'determinants', 'orthogonality', 'least squares', 'singular value decomposition', 'matrix factorization', 'numerical methods']
  },
  {
    id: 'math-003',
    title: 'Probability and Statistics for Computer Science',
    authors: ['David Forsyth'],
    type: 'book',
    category: 'Matemáticas para Computación',
    tags: ['Probability', 'Statistics', 'Data Analysis'],
    abstract: 'Introduction to probability and statistics with applications to computer science and data analysis.',
    publishedYear: 2018,
    publisher: 'Springer',
    citations: 5670,
    impactFactor: 6.4,
    availability: 'available',
    location: 'Section H, Shelf 5',
    isbn: '978-3319644097',
    rating: 4.2,
    reviewCount: 789,
    language: 'English',
    pageCount: 448,
    thumbnail: 'https://images.pexels.com/photos/1181693/pexels-photo-1181693.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Data Science', 'Statistical Analysis', 'Machine Learning'],
    url: 'https://library.university.edu/catalog/probability-statistics-cs',
    librarySystem: {
      catalogId: 'CAT-MATH-003',
      barcode: '31234567890159',
      acquisitionDate: '2020-11-20',
      lastUpdated: '2024-02-04',
      totalCopies: 4,
      availableCopies: 3,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-25'
    },
    fullTextKeywords: ['probability', 'statistics', 'data analysis', 'random variables', 'distributions', 'hypothesis testing', 'confidence intervals', 'regression analysis', 'bayesian statistics', 'monte carlo methods', 'statistical inference', 'experimental design']
  },

  // INGENIERÍA DE SOFTWARE
  {
    id: 'se-001',
    title: 'Software Engineering: A Practitioner\'s Approach',
    authors: ['Roger S. Pressman', 'Bruce R. Maxim'],
    type: 'book',
    category: 'Ingeniería de Software',
    tags: ['Software Engineering', 'SDLC', 'Project Management'],
    abstract: 'Comprehensive guide to software engineering practices, methodologies, and project management.',
    publishedYear: 2020,
    publisher: 'McGraw-Hill',
    citations: 12340,
    impactFactor: 7.8,
    availability: 'available',
    location: 'Section I, Shelf 1',
    isbn: '978-0078022128',
    rating: 4.3,
    reviewCount: 1456,
    language: 'English',
    pageCount: 928,
    thumbnail: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Project Management', 'Software Development', 'Quality Assurance'],
    url: 'https://library.university.edu/catalog/software-engineering-practitioners',
    librarySystem: {
      catalogId: 'CAT-SE-001',
      barcode: '31234567890160',
      acquisitionDate: '2021-04-15',
      lastUpdated: '2024-02-05',
      totalCopies: 5,
      availableCopies: 3,
      reservedCopies: 1,
      checkedOutCopies: 2,
      dueDate: '2024-03-28'
    },
    fullTextKeywords: ['software engineering', 'sdlc', 'project management', 'requirements engineering', 'software design', 'testing', 'maintenance', 'quality assurance', 'agile methodologies', 'waterfall model', 'risk management', 'software metrics']
  },
  {
    id: 'se-002',
    title: 'Agile Software Development: Principles, Patterns, and Practices',
    authors: ['Robert C. Martin'],
    type: 'book',
    category: 'Ingeniería de Software',
    tags: ['Agile Development', 'Scrum', 'XP'],
    abstract: 'Comprehensive guide to agile software development methodologies and best practices.',
    publishedYear: 2017,
    publisher: 'Prentice Hall',
    citations: 8920,
    impactFactor: 6.7,
    availability: 'digital-only',
    isbn: '978-0135974445',
    rating: 4.5,
    reviewCount: 987,
    language: 'English',
    pageCount: 552,
    thumbnail: 'https://images.pexels.com/photos/1181697/pexels-photo-1181697.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Agile Methodologies', 'Team Management', 'Software Development'],
    digitalUrl: 'https://digital.library.edu/books/agile-software-development',
    librarySystem: {
      catalogId: 'CAT-SE-002',
      barcode: '31234567890161',
      acquisitionDate: '2021-12-10',
      lastUpdated: '2024-02-06',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 30,
      digitalActiveUsers: 11
    },
    fullTextKeywords: ['agile development', 'scrum', 'extreme programming', 'iterative development', 'user stories', 'sprint planning', 'retrospectives', 'continuous integration', 'test driven development', 'pair programming', 'refactoring', 'customer collaboration']
  },
  {
    id: 'se-003',
    title: 'Software Testing: A Comprehensive Guide',
    authors: ['Glenford J. Myers', 'Corey Sandler', 'Tom Badgett'],
    type: 'book',
    category: 'Ingeniería de Software',
    tags: ['Software Testing', 'Quality Assurance', 'Test Automation'],
    abstract: 'Complete guide to software testing methodologies, techniques, and automation strategies.',
    publishedYear: 2019,
    publisher: 'Wiley',
    citations: 5670,
    impactFactor: 5.9,
    availability: 'available',
    location: 'Section I, Shelf 5',
    isbn: '978-1118031964',
    rating: 4.2,
    reviewCount: 678,
    language: 'English',
    pageCount: 384,
    thumbnail: 'https://images.pexels.com/photos/1181699/pexels-photo-1181699.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Quality Assurance', 'Test Automation', 'Software Quality'],
    url: 'https://library.university.edu/catalog/software-testing-comprehensive',
    librarySystem: {
      catalogId: 'CAT-SE-003',
      barcode: '31234567890162',
      acquisitionDate: '2020-06-25',
      lastUpdated: '2024-02-07',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-03-30'
    },
    fullTextKeywords: ['software testing', 'quality assurance', 'test automation', 'unit testing', 'integration testing', 'system testing', 'acceptance testing', 'test cases', 'test planning', 'bug tracking', 'performance testing', 'security testing']
  },

  // TECNOLOGÍAS EMERGENTES
  {
    id: 'emerging-001',
    title: 'Quantum Computing: An Applied Approach',
    authors: ['Hidary Jack D.'],
    type: 'book',
    category: 'Tecnologías Emergentes',
    tags: ['Quantum Computing', 'Quantum Algorithms', 'Quantum Physics'],
    abstract: 'Comprehensive introduction to quantum computing with practical applications and programming examples.',
    publishedYear: 2021,
    publisher: 'Springer',
    citations: 3450,
    impactFactor: 6.8,
    availability: 'digital-only',
    isbn: '978-3030239213',
    rating: 4.4,
    reviewCount: 456,
    language: 'English',
    pageCount: 372,
    thumbnail: 'https://images.pexels.com/photos/1181701/pexels-photo-1181701.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Quantum Physics', 'Advanced Computing', 'Cryptography'],
    digitalUrl: 'https://digital.library.edu/books/quantum-computing-applied',
    librarySystem: {
      catalogId: 'CAT-EMERGING-001',
      barcode: '31234567890163',
      acquisitionDate: '2022-03-15',
      lastUpdated: '2024-02-08',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 20,
      digitalActiveUsers: 7
    },
    fullTextKeywords: ['quantum computing', 'quantum algorithms', 'quantum physics', 'qubits', 'quantum gates', 'quantum circuits', 'quantum entanglement', 'quantum supremacy', 'quantum programming', 'quantum cryptography', 'quantum machine learning', 'quantum simulation']
  },
  {
    id: 'emerging-002',
    title: 'Internet of Things: Architecture and Implementation',
    authors: ['Raj Kamal'],
    type: 'book',
    category: 'Tecnologías Emergentes',
    tags: ['IoT', 'Embedded Systems', 'Sensor Networks'],
    abstract: 'Comprehensive guide to IoT architecture, protocols, and implementation strategies.',
    publishedYear: 2020,
    publisher: 'McGraw-Hill',
    citations: 2890,
    impactFactor: 5.3,
    availability: 'available',
    location: 'Section J, Shelf 1',
    isbn: '978-1259029608',
    rating: 4.1,
    reviewCount: 345,
    language: 'English',
    pageCount: 456,
    thumbnail: 'https://images.pexels.com/photos/1181703/pexels-photo-1181703.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Embedded Systems', 'Wireless Networks', 'Smart Devices'],
    url: 'https://library.university.edu/catalog/iot-architecture-implementation',
    librarySystem: {
      catalogId: 'CAT-EMERGING-002',
      barcode: '31234567890164',
      acquisitionDate: '2021-05-20',
      lastUpdated: '2024-02-09',
      totalCopies: 3,
      availableCopies: 2,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-04-01'
    },
    fullTextKeywords: ['internet of things', 'iot', 'embedded systems', 'sensor networks', 'wireless communication', 'mqtt', 'coap', 'edge computing', 'smart cities', 'industrial iot', 'wearable devices', 'home automation']
  },
  {
    id: 'emerging-003',
    title: 'Blockchain Technology: Principles and Applications',
    authors: ['Zibin Zheng', 'Shaoan Xie', 'Hong-Ning Dai'],
    type: 'book',
    category: 'Tecnologías Emergentes',
    tags: ['Blockchain', 'Cryptocurrency', 'Distributed Ledger'],
    abstract: 'Comprehensive exploration of blockchain technology, cryptocurrencies, and decentralized applications.',
    publishedYear: 2022,
    publisher: 'Springer',
    citations: 1890,
    impactFactor: 4.7,
    availability: 'available',
    location: 'Section J, Shelf 3',
    isbn: '978-3030320119',
    rating: 4.3,
    reviewCount: 234,
    language: 'English',
    pageCount: 328,
    thumbnail: 'https://images.pexels.com/photos/1181705/pexels-photo-1181705.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Cryptocurrency', 'Decentralized Systems', 'Smart Contracts'],
    url: 'https://library.university.edu/catalog/blockchain-technology-principles',
    librarySystem: {
      catalogId: 'CAT-EMERGING-003',
      barcode: '31234567890165',
      acquisitionDate: '2022-08-10',
      lastUpdated: '2024-02-10',
      totalCopies: 2,
      availableCopies: 1,
      reservedCopies: 0,
      checkedOutCopies: 1,
      dueDate: '2024-04-05'
    },
    fullTextKeywords: ['blockchain', 'cryptocurrency', 'distributed ledger', 'smart contracts', 'consensus algorithms', 'proof of work', 'proof of stake', 'decentralized applications', 'bitcoin', 'ethereum', 'hyperledger', 'digital currency']
  },
  {
    id: 'emerging-004',
    title: 'Augmented and Virtual Reality: Concepts and Applications',
    authors: ['Steve Aukstakalnis'],
    type: 'book',
    category: 'Tecnologías Emergentes',
    tags: ['AR', 'VR', 'Mixed Reality', 'Immersive Technology'],
    abstract: 'Comprehensive guide to augmented and virtual reality technologies and their applications.',
    publishedYear: 2021,
    publisher: 'Academic Press',
    citations: 1560,
    impactFactor: 4.1,
    availability: 'digital-only',
    isbn: '978-0128009659',
    rating: 4.0,
    reviewCount: 189,
    language: 'English',
    pageCount: 392,
    thumbnail: 'https://images.pexels.com/photos/1181707/pexels-photo-1181707.jpeg?auto=compress&cs=tinysrgb&w=300',
    relatedTopics: ['Computer Graphics', 'Human-Computer Interaction', 'Game Development'],
    digitalUrl: 'https://digital.library.edu/books/ar-vr-concepts-applications',
    librarySystem: {
      catalogId: 'CAT-EMERGING-004',
      barcode: '31234567890166',
      acquisitionDate: '2022-01-25',
      lastUpdated: '2024-02-11',
      totalCopies: 0,
      availableCopies: 0,
      reservedCopies: 0,
      checkedOutCopies: 0,
      digitalAccess: true,
      digitalLicenses: 15,
      digitalActiveUsers: 5
    },
    fullTextKeywords: ['augmented reality', 'virtual reality', 'mixed reality', 'immersive technology', 'computer graphics', 'human computer interaction', 'head mounted displays', 'motion tracking', 'spatial computing', 'haptic feedback', 'unity', 'unreal engine']
  }
];

// ==================== SISTEMA DE SINCRONIZACIÓN BIBLIOTECARIA ====================

export interface LibrarySystemSync {
  lastSyncTime: Date;
  syncStatus: 'active' | 'inactive' | 'error';
  totalResources: number;
  newResources: number;
  updatedResources: number;
  errors: string[];
}

let librarySync: LibrarySystemSync = {
  lastSyncTime: new Date(),
  syncStatus: 'active',
  totalResources: mockResources.length,
  newResources: 0,
  updatedResources: 0,
  errors: []
};

// Simular sincronización con sistema bibliotecario
export const syncWithLibrarySystem = async (): Promise<LibrarySystemSync> => {
  try {
    // Simular llamada a API del sistema bibliotecario
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar disponibilidad de recursos
    const updatedCount = Math.floor(Math.random() * 5);
    for (let i = 0; i < updatedCount; i++) {
      const randomIndex = Math.floor(Math.random() * mockResources.length);
      const resource = mockResources[randomIndex];
      
      if (resource.librarySystem) {
        // Simular cambios en disponibilidad
        const availableChange = Math.floor(Math.random() * 3) - 1;
        resource.librarySystem.availableCopies = Math.max(0, 
          Math.min(resource.librarySystem.totalCopies, 
            resource.librarySystem.availableCopies + availableChange));
        
        resource.librarySystem.checkedOutCopies = 
          resource.library System.totalCopies - resource.librarySystem.availableCopies - resource.librarySystem.reservedCopies;
        
        // Actualizar estado de disponibilidad
        if (resource.librarySystem.availableCopies > 0) {
          resource.availability = 'available';
        } else if (resource.librarySystem.reservedCopies > 0) {
          resource.availability = 'reserved';
        } else {
          resource.availability = 'checked-out';
        }
        
        resource.librarySystem.lastUpdated = new Date().toISOString().split('T')[0];
      }
    }
    
    librarySync = {
      lastSyncTime: new Date(),
      syncStatus: 'active',
      totalResources: mockResources.length,
      newResources: Math.floor(Math.random() * 3),
      updatedResources: updatedCount,
      errors: []
    };
    
    return librarySync;
  } catch (error) {
    librarySync = {
      ...librarySync,
      lastSyncTime: new Date(),
      syncStatus: 'error',
      errors: ['Error connecting to library system']
    };
    return librarySync;
  }
};

export const getLibrarySyncStatus = (): LibrarySystemSync => librarySync;

// ==================== EXTRACCIÓN DE KEYWORDS CON PLN ====================

export interface KeywordExtractionResult {
  keywords: string[];
  confidence: number;
  method: 'tf-idf' | 'textrank' | 'yake' | 'hybrid';
  processingTime: number;
}

// Cache para análisis de keywords
let keywordCache: { [key: string]: KeywordExtractionResult } = {};

// Palabras vacías en español e inglés
const stopWords = new Set([
  // Español
  'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'han', 'fue', 'ser', 'está', 'son', 'desde', 'hasta', 'este', 'esta', 'estos', 'estas',
  // Inglés
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
]);

// Función para limpiar y tokenizar texto
const tokenizeText = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

// Algoritmo TF-IDF simplificado
const extractKeywordsTFIDF = (text: string, topK: number = 10): string[] => {
  const tokens = tokenizeText(text);
  const termFreq: { [key: string]: number } = {};
  
  // Calcular frecuencia de términos
  tokens.forEach(token => {
    termFreq[token] = (termFreq[token] || 0) + 1;
  });
  
  // Calcular TF-IDF (simplificado, sin corpus para IDF)
  const tfIdfScores: { [key: string]: number } = {};
  const totalTokens = tokens.length;
  
  Object.keys(termFreq).forEach(term => {
    const tf = termFreq[term] / totalTokens;
    // IDF simplificado basado en longitud del término y frecuencia
    const idf = Math.log(totalTokens / termFreq[term]) + (term.length / 10);
    tfIdfScores[term] = tf * idf;
  });
  
  // Ordenar por puntuación y devolver top K
  return Object.entries(tfIdfScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, topK)
    .map(([term]) => term);
};

// Algoritmo TextRank simplificado
const extractKeywordsTextRank = (text: string, topK: number = 10): string[] => {
  const tokens = tokenizeText(text);
  const uniqueTokens = [...new Set(tokens)];
  
  // Crear matriz de co-ocurrencia
  const coOccurrence: { [key: string]: { [key: string]: number } } = {};
  const windowSize = 3;
  
  uniqueTokens.forEach(token => {
    coOccurrence[token] = {};
    uniqueTokens.forEach(otherToken => {
      coOccurrence[token][otherToken] = 0;
    });
  });
  
  // Calcular co-ocurrencias
  for (let i = 0; i < tokens.length; i++) {
    for (let j = Math.max(0, i - windowSize); j < Math.min(tokens.length, i + windowSize + 1); j++) {
      if (i !== j) {
        coOccurrence[tokens[i]][tokens[j]]++;
      }
    }
  }
  
  // Algoritmo PageRank simplificado
  const scores: { [key: string]: number } = {};
  uniqueTokens.forEach(token => {
    scores[token] = 1.0;
  });
  
  // Iteraciones de PageRank
  for (let iter = 0; iter < 10; iter++) {
    const newScores: { [key: string]: number } = {};
    uniqueTokens.forEach(token => {
      newScores[token] = 0.15;
      uniqueTokens.forEach(otherToken => {
        if (token !== otherToken && coOccurrence[otherToken][token] > 0) {
          const totalOutLinks = Object.values(coOccurrence[otherToken]).reduce((a, b) => a + b, 0);
          if (totalOutLinks > 0) {
            newScores[token] += 0.85 * scores[otherToken] * (coOccurrence[otherToken][token] / totalOutLinks);
          }
        }
      });
    });
    Object.assign(scores, newScores);
  }
  
  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, topK)
    .map(([term]) => term);
};

// Algoritmo YAKE simplificado
const extractKeywordsYAKE = (text: string, topK: number = 10): string[] => {
  const tokens = tokenizeText(text);
  const termStats: { [key: string]: { freq: number, positions: number[], leftDegree: number, rightDegree: number } } = {};
  
  // Calcular estadísticas de términos
  tokens.forEach((token, index) => {
    if (!termStats[token]) {
      termStats[token] = { freq: 0, positions: [], leftDegree: 0, rightDegree: 0 };
    }
    termStats[token].freq++;
    termStats[token].positions.push(index);
  });
  
  // Calcular grados de conectividad
  tokens.forEach((token, index) => {
    if (index > 0 && tokens[index - 1] !== token) {
      termStats[token].leftDegree++;
    }
    if (index < tokens.length - 1 && tokens[index + 1] !== token) {
      termStats[token].rightDegree++;
    }
  });
  
  // Calcular puntuación YAKE
  const yakeScores: { [key: string]: number } = {};
  Object.keys(termStats).forEach(term => {
    const stats = termStats[term];
    const rel = stats.positions.length / (stats.leftDegree + stats.rightDegree + 1);
    const pos = Math.log(3 + Math.min(...stats.positions));
    const freq = stats.freq / tokens.length;
    
    yakeScores[term] = (rel * pos) / (freq + 1);
  });
  
  return Object.entries(yakeScores)
    .sort(([,a], [,b]) => a - b) // YAKE usa puntuaciones más bajas para mejores keywords
    .slice(0, topK)
    .map(([term]) => term);
};

// Función principal de extracción de keywords
export const extractKeywords = async (
  text: string, 
  method: 'tf-idf' | 'textrank' | 'yake' | 'hybrid' = 'hybrid',
  topK: number = 15
): Promise<KeywordExtractionResult> => {
  const startTime = Date.now();
  
  try {
    let keywords: string[] = [];
    
    switch (method) {
      case 'tf-idf':
        keywords = extractKeywordsTFIDF(text, topK);
        break;
      case 'textrank':
        keywords = extractKeywordsTextRank(text, topK);
        break;
      case 'yake':
        keywords = extractKeywordsYAKE(text, topK);
        break;
      case 'hybrid':
        // Combinar resultados de múltiples métodos
        const tfidfKeywords = extractKeywordsTFIDF(text, Math.ceil(topK * 0.4));
        const textrankKeywords = extractKeywordsTextRank(text, Math.ceil(topK * 0.4));
        const yakeKeywords = extractKeywordsYAKE(text, Math.ceil(topK * 0.3));
        
        // Combinar y eliminar duplicados
        const combinedKeywords = [...new Set([...tfidfKeywords, ...textrankKeywords, ...yakeKeywords])];
        keywords = combinedKeywords.slice(0, topK);
        break;
    }
    
    const processingTime = Date.now() - startTime;
    const confidence = Math.min(0.95, 0.6 + (keywords.length / topK) * 0.3);
    
    return {
      keywords,
      confidence,
      method,
      processingTime
    };
  } catch (error) {
    return {
      keywords: [],
      confidence: 0,
      method,
      processingTime: Date.now() - startTime
    };
  }
};

// Función para analizar un recurso completo y extraer keywords
export const analyzeResourceKeywords = async (resourceId: string): Promise<KeywordExtractionResult | null> => {
  const resource = mockResources.find(r => r.id === resourceId);
  if (!resource) return null;
  
  // Combinar título, abstract y keywords existentes para análisis
  const fullText = `${resource.title} ${resource.abstract} ${resource.tags.join(' ')} ${resource.relatedTopics.join(' ')}`;
  
  return await extractKeywords(fullText, 'hybrid', 20);
};

// ==================== FUNCIONES DE BÚSQUEDA MEJORADAS ====================

export const searchResourcesByTopic = (topic: string): Resource[] => {
  const searchTerm = topic.toLowerCase();
  
  return mockResources.filter(resource => {
    // Búsqueda en múltiples campos
    const titleMatch = resource.title.toLowerCase().includes(searchTerm);
    const abstractMatch = resource.abstract.toLowerCase().includes(searchTerm);
    const tagsMatch = resource.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    const categoryMatch = resource.category.toLowerCase().includes(searchTerm);
    const keywordsMatch = resource.fullTextKeywords?.some(keyword => 
      keyword.toLowerCase().includes(searchTerm) || searchTerm.includes(keyword.toLowerCase())
    );
    
    return titleMatch || abstractMatch || tagsMatch || categoryMatch || keywordsMatch;
  }).sort((a, b) => {
    // Ordenar por relevancia (título > tags > abstract > keywords)
    const aScore = (a.title.toLowerCase().includes(searchTerm) ? 4 : 0) +
                   (a.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 3 : 0) +
                   (a.abstract.toLowerCase().includes(searchTerm) ? 2 : 0) +
                   (a.fullTextKeywords?.some(k => k.toLowerCase().includes(searchTerm)) ? 1 : 0);
    
    const bScore = (b.title.toLowerCase().includes(searchTerm) ? 4 : 0) +
                   (b.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 3 : 0) +
                   (b.abstract.toLowerCase().includes(searchTerm) ? 2 : 0) +
                   (b.fullTextKeywords?.some(k => k.toLowerCase().includes(searchTerm)) ? 1 : 0);
    
    return bScore - aScore;
  });
};

// Nueva función para buscar por keywords extraídas
export const searchResourcesByKeywords = (keywords: string[]): Resource[] => {
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
  
  return mockResources.filter(resource => {
    // Buscar coincidencias en keywords del texto completo
    const keywordMatches = resource.fullTextKeywords?.some(keyword => 
      keywordSet.has(keyword.toLowerCase())
    ) || false;
    
    // Buscar coincidencias en tags y temas relacionados
    const tagMatches = resource.tags.some(tag => 
      keywords.some(keyword => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    const topicMatches = resource.relatedTopics.some(topic => 
      keywords.some(keyword => topic.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    // Buscar coincidencias en título y abstract
    const titleMatches = keywords.some(keyword => 
      resource.title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const abstractMatches = keywords.some(keyword => 
      resource.abstract.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return keywordMatches || tagMatches || topicMatches || titleMatches || abstractMatches;
  }).sort((a, b) => {
    // Calcular puntuación de relevancia basada en coincidencias de keywords
    const aScore = keywords.reduce((score, keyword) => {
      const kw = keyword.toLowerCase();
      let points = 0;
      
      if (a.title.toLowerCase().includes(kw)) points += 5;
      if (a.tags.some(tag => tag.toLowerCase().includes(kw))) points += 4;
      if (a.fullTextKeywords?.some(k => k.toLowerCase().includes(kw))) points += 3;
      if (a.relatedTopics.some(topic => topic.toLowerCase().includes(kw))) points += 2;
      if (a.abstract.toLowerCase().includes(kw)) points += 1;
      
      return score + points;
    }, 0);
    
    const bScore = keywords.reduce((score, keyword) => {
      const kw = keyword.toLowerCase();
      let points = 0;
      
      if (b.title.toLowerCase().includes(kw)) points += 5;
      if (b.tags.some(tag => tag.toLowerCase().includes(kw))) points += 4;
      if (b.fullTextKeywords?.some(k => k.toLowerCase().includes(kw))) points += 3;
      if (b.relatedTopics.some(topic => topic.toLowerCase().includes(kw))) points += 2;
      if (b.abstract.toLowerCase().includes(kw)) points += 1;
      
      return score + points;
    }, 0);
    
    return bScore - aScore;
  });
};

// Funciones para el cache de keywords
export const getCachedKeywordAnalysis = (text: string): KeywordExtractionResult | null => {
  const cacheKey = text.toLowerCase().trim();
  return keywordCache[cacheKey] || null;
};

export const cacheKeywordAnalysis = (text: string, result: KeywordExtractionResult): void => {
  const cacheKey = text.toLowerCase().trim();
  keywordCache[cacheKey] = result;
  
  // Limpiar cache si tiene más de 100 entradas
  if (Object.keys(keywordCache).length > 100) {
    const keys = Object.keys(keywordCache);
    const keysToDelete = keys.slice(0, 20); // Eliminar las 20 más antiguas
    keysToDelete.forEach(key => delete keywordCache[key]);
  }
};

// Temas populares expandidos por categorías
export const popularTopics = [
  // AI y ML
  'Machine Learning', 'Deep Learning', 'Neural Networks', 'Natural Language Processing',
  'Computer Vision', 'Reinforcement Learning', 'AI Ethics', 'Robotics',
  
  // Programación
  'Python Programming', 'JavaScript', 'Web Development', 'Mobile Development',
  'Software Architecture', 'DevOps', 'Clean Code', 'Agile Development',
  
  // Data Science
  'Data Science', 'Big Data', 'Data Visualization', 'Statistical Analysis',
  'Business Intelligence', 'Predictive Analytics', 'Data Mining', 'R Programming',
  
  // Ciberseguridad
  'Cybersecurity', 'Ethical Hacking', 'Cryptography', 'Network Security',
  'Digital Forensics', 'Blockchain Security', 'Information Security', 'Privacy',
  
  // Sistemas
  'Operating Systems', 'Computer Networks', 'Distributed Systems', 'Cloud Computing',
  'System Administration', 'Virtualization', 'Containers', 'Microservices',
  
  // Bases de Datos
  'Database Design', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL',
  'Data Warehousing', 'Database Administration', 'Big Data Storage',
  
  // Algoritmos
  'Algorithms', 'Data Structures', 'Algorithm Analysis', 'Graph Algorithms',
  'Dynamic Programming', 'Optimization', 'Parallel Computing', 'Complexity Theory',
  
  // Matemáticas
  'Discrete Mathematics', 'Linear Algebra', 'Statistics', 'Probability',
  'Mathematical Logic', 'Graph Theory', 'Number Theory', 'Calculus',
  
  // Ingeniería de Software
  'Software Engineering', 'Design Patterns', 'Testing', 'Project Management',
  'Requirements Engineering', 'Software Quality', 'Maintenance', 'Documentation',
  
  // Tecnologías Emergentes
  'Quantum Computing', 'Internet of Things', 'Augmented Reality', 'Virtual Reality',
  'Blockchain Technology', 'Edge Computing', '5G Networks', 'Nanotechnology'
];

// ==================== FUNCIONES DE GESTIÓN DE USUARIOS ====================

export const validateEmailDomain = (email: string, role: string): boolean => {
  const domain = email.split('@')[1];
  switch (role) {
    case 'admin':
      return domain === 'admin.edu.cu';
    case 'faculty':
      return domain === 'trabajador.edu.cu';
    case 'student':
      return domain === 'estudiante.edu.cu';
    default:
      return false;
  }
};

export const getRequiredDomain = (role: string): string => {
  switch (role) {
    case 'admin':
      return '@admin.edu.cu';
    case 'faculty':
      return '@trabajador.edu.cu';
    case 'student':
      return '@estudiante.edu.cu';
    default:
      return '@estudiante.edu.cu';
  }
};

export const findUserByEmail = (email: string): User | null => {
  return userDatabase.find(user => user.email === email) || null;
};

export const addUserToDatabase = (user: User): boolean => {
  try {
    userDatabase.push(user);
    console.log(`Usuario agregado a la base de datos: ${user.name} (${user.email})`);
    return true;
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    return false;
  }
};

export const deleteUserFromDatabase = (userId: string): boolean => {
  try {
    const initialLength = userDatabase.length;
    userDatabase = userDatabase.filter(user => user.id !== userId);
    
    // También cerrar sesiones activas del usuario eliminado
    activeSessions = activeSessions.filter(session => session.userId !== userId);
    
    const deleted = userDatabase.length < initialLength;
    if (deleted) {
      console.log(`Usuario eliminado de la base de datos: ${userId}`);
    }
    return deleted;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return false;
  }
};

export const getAllUsers = (): User[] => {
  return [...userDatabase];
};

// ==================== GESTIÓN DE SESIONES ====================

export const createSession = (user: User): ActiveSession => {
  const session: ActiveSession = {
    sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: user.id,
    user: user,
    loginTime: new Date(),
    lastActivity: new Date(),
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
    userAgent: 'Mozilla/5.0 (compatible; LibraryAI/1.0)'
  };
  
  activeSessions.push(session);
  console.log(`Sesión creada para ${user.name}: ${session.sessionId}`);
  return session;
};

export const updateSessionActivity = (userId: string): void => {
  const session = activeSessions.find(s => s.userId === userId);
  if (session) {
    session.lastActivity = new Date();
  }
};

export const closeSession = (userId: string): boolean => {
  const initialLength = activeSessions.length;
  activeSessions = activeSessions.filter(session => session.userId !== userId);
  return activeSessions.length < initialLength;
};

export const getActiveSessions = (): ActiveSession[] => {
  return [...activeSessions];
};

export const cleanInactiveSessions = (): void => {
  const now = new Date();
  const inactiveThreshold = 30 * 60 * 1000; // 30 minutos
  
  activeSessions = activeSessions.filter(session => {
    const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
    return timeSinceLastActivity < inactiveThreshold;
  });
};

// ==================== SISTEMA DE RECOMENDACIONES ====================

export const mockUser: User = {
  id: 'user-001',
  name: 'Juan Pérez',
  email: 'juan.perez@estudiante.edu.cu',
  role: 'student',
  department: 'Computer Science',
  academicLevel: 'Undergraduate',
  interests: ['Machine Learning', 'Web Development', 'Data Science'],
  readingHistory: ['ai-001', 'prog-001', 'data-001'],
  favoriteGenres: ['Computer Science', 'Artificial Intelligence'],
  researchAreas: ['Machine Learning', 'Natural Language Processing']
};

export const getRecommendations = (userId: string): Recommendation[] => {
  const user = userDatabase.find(u => u.id === userId) || mockUser;
  
  const recommendations: Recommendation[] = [
    {
      resource: mockResources.find(r => r.id === 'ai-002')!,
      score: 0.95,
      reason: 'Based on your interest in Machine Learning and recent reading of AI fundamentals',
      algorithm: 'hybrid'
    },
    {
      resource: mockResources.find(r => r.id === 'data-002')!,
      score: 0.88,
      reason: 'Recommended because you enjoyed Python for Data Analysis',
      algorithm: 'collaborative'
    },
    {
      resource: mockResources.find(r => r.id === 'ai-004')!,
      score: 0.82,
      reason: 'Perfect match for your Natural Language Processing research area',
      algorithm: 'content-based'
    }
  ].filter(rec => rec.resource);
  
  return recommendations;
};

// Inicializar sincronización automática cada 5 minutos
setInterval(() => {
  syncWithLibrarySystem().then(result => {
    console.log('Library sync completed:', result);
  }).catch(error => {
    console.error('Library sync failed:', error);
  });
}, 5 * 60 * 1000);