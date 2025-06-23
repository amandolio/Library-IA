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
          resource.librarySystem.totalCopies - resource.librarySystem.availableCopies - resource.librarySystem.reservedCopies;
        
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
  'Edge Computing', '5G Networks', 'Nanotechnology', 'Biotechnology'
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