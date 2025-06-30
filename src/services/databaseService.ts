// Servicio para gestión de base de datos local
import { Resource } from '../types';

interface DatabaseStats {
  totalResources: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
  byLanguage: Record<string, number>;
  lastUpdate: Date;
}

export class DatabaseService {
  private dbName = 'LibraryAI_DB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store para recursos académicos
        if (!db.objectStoreNames.contains('resources')) {
          const resourceStore = db.createObjectStore('resources', { keyPath: 'id' });
          resourceStore.createIndex('title', 'title', { unique: false });
          resourceStore.createIndex('authors', 'authors', { unique: false, multiEntry: true });
          resourceStore.createIndex('type', 'type', { unique: false });
          resourceStore.createIndex('category', 'category', { unique: false });
          resourceStore.createIndex('publishedYear', 'publishedYear', { unique: false });
          resourceStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          resourceStore.createIndex('source', 'source', { unique: false });
        }

        // Store para búsquedas y caché
        if (!db.objectStoreNames.contains('searches')) {
          const searchStore = db.createObjectStore('searches', { keyPath: 'id', autoIncrement: true });
          searchStore.createIndex('query', 'query', { unique: false });
          searchStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para estadísticas
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'id' });
        }
      };
    });
  }

  async saveResources(resources: Resource[], source: string): Promise<number> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readwrite');
      const store = transaction.objectStore('resources');
      let savedCount = 0;

      transaction.oncomplete = () => {
        this.updateStats();
        resolve(savedCount);
      };
      transaction.onerror = () => reject(transaction.error);

      resources.forEach(resource => {
        // Agregar información de fuente
        const resourceWithSource = {
          ...resource,
          source,
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };

        const request = store.put(resourceWithSource);
        request.onsuccess = () => savedCount++;
      });
    });
  }

  async getResourceById(id: string): Promise<Resource | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async searchResources(query: string, filters?: {
    type?: string;
    category?: string;
    source?: string;
    yearRange?: [number, number];
  }): Promise<Resource[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result as Resource[];
        
        // Filtrar por texto de búsqueda
        if (query) {
          const searchTerms = query.toLowerCase().split(' ');
          results = results.filter(resource => {
            const searchText = `${resource.title} ${resource.authors.join(' ')} ${resource.abstract} ${resource.tags.join(' ')}`.toLowerCase();
            return searchTerms.every(term => searchText.includes(term));
          });
        }

        // Aplicar filtros adicionales
        if (filters) {
          if (filters.type) {
            results = results.filter(r => r.type === filters.type);
          }
          if (filters.category) {
            results = results.filter(r => r.category === filters.category);
          }
          if (filters.source) {
            results = results.filter(r => (r as any).source === filters.source);
          }
          if (filters.yearRange) {
            const [minYear, maxYear] = filters.yearRange;
            results = results.filter(r => r.publishedYear >= minYear && r.publishedYear <= maxYear);
          }
        }

        // Ordenar por relevancia (simplificado)
        results.sort((a, b) => {
          const scoreA = (a.citations || 0) + (a.rating || 0) * 10;
          const scoreB = (b.citations || 0) + (b.rating || 0) * 10;
          return scoreB - scoreA;
        });

        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllResources(): Promise<Resource[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getResourcesBySource(source: string): Promise<Resource[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result.filter((r: any) => r.source === source);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSearch(query: string, results: Resource[], source: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['searches'], 'readwrite');
      const store = transaction.objectStore('searches');
      
      const searchRecord = {
        query,
        source,
        resultCount: results.length,
        timestamp: new Date().toISOString(),
        results: results.map(r => r.id) // Solo guardar IDs para evitar duplicación
      };

      const request = store.add(searchRecord);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSearchHistory(limit: number = 50): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['searches'], 'readonly');
      const store = transaction.objectStore('searches');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');
      
      const results: any[] = [];
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getStats(): Promise<DatabaseStats> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources', 'stats'], 'readonly');
      const resourceStore = transaction.objectStore('resources');
      const statsStore = transaction.objectStore('stats');
      
      // Intentar obtener stats cacheadas
      const statsRequest = statsStore.get('current');
      
      statsRequest.onsuccess = () => {
        const cachedStats = statsRequest.result;
        const now = new Date();
        
        // Si las stats son recientes (menos de 1 hora), usarlas
        if (cachedStats && (now.getTime() - new Date(cachedStats.lastUpdate).getTime()) < 3600000) {
          resolve(cachedStats);
          return;
        }
        
        // Calcular stats frescas
        const allResourcesRequest = resourceStore.getAll();
        allResourcesRequest.onsuccess = () => {
          const resources = allResourcesRequest.result as any[];
          
          const stats: DatabaseStats = {
            totalResources: resources.length,
            bySource: {},
            byType: {},
            byLanguage: {},
            lastUpdate: now
          };
          
          resources.forEach(resource => {
            // Por fuente
            const source = resource.source || 'unknown';
            stats.bySource[source] = (stats.bySource[source] || 0) + 1;
            
            // Por tipo
            stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
            
            // Por idioma
            stats.byLanguage[resource.language] = (stats.byLanguage[resource.language] || 0) + 1;
          });
          
          // Guardar stats en caché
          const saveStatsTransaction = this.db!.transaction(['stats'], 'readwrite');
          const saveStatsStore = saveStatsTransaction.objectStore('stats');
          saveStatsStore.put({ id: 'current', ...stats });
          
          resolve(stats);
        };
        allResourcesRequest.onerror = () => reject(allResourcesRequest.error);
      };
      statsRequest.onerror = () => reject(statsRequest.error);
    });
  }

  private async updateStats(): Promise<void> {
    // Invalidar caché de estadísticas
    if (!this.db) return;
    
    const transaction = this.db.transaction(['stats'], 'readwrite');
    const store = transaction.objectStore('stats');
    store.delete('current');
  }

  async clearDatabase(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources', 'searches', 'stats'], 'readwrite');
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      
      transaction.objectStore('resources').clear();
      transaction.objectStore('searches').clear();
      transaction.objectStore('stats').clear();
    });
  }

  async exportData(): Promise<{
    resources: Resource[];
    searches: any[];
    stats: DatabaseStats;
  }> {
    const [resources, searches, stats] = await Promise.all([
      this.getAllResources(),
      this.getSearchHistory(1000),
      this.getStats()
    ]);
    
    return { resources, searches, stats };
  }
}

// Instancia singleton del servicio de base de datos
export const databaseService = new DatabaseService();