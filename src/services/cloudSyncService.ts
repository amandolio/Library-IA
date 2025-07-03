// Servicio de sincronización en la nube usando Supabase
import { Resource } from '../types';
import { databaseService } from './databaseService';

interface CloudResource extends Resource {
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  source?: string;
  dateAdded?: string;
}

interface CloudSyncStats {
  totalResources: number;
  lastSync: Date | null;
  syncCount: number;
}

export class CloudSyncService {
  private supabaseUrl: string | null = null;
  private supabaseKey: string | null = null;
  private supabase: any = null;
  private currentUser: any = null;
  private isConnected = false;

  constructor() {
    // Intentar obtener configuración de Supabase del entorno
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;
    
    // Auto-conectar si las credenciales están disponibles
    if (this.supabaseUrl && this.supabaseKey) {
      this.connect().catch(error => {
        console.warn('Auto-connect to cloud failed:', error);
      });
    }
  }

  async connect(): Promise<boolean> {
    try {
      // Verificar si Supabase está configurado
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase no está configurado. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
      }

      // Importar dinámicamente Supabase
      const { createClient } = await import('@supabase/supabase-js');
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);

      // Autenticar usuario anónimo o usar usuario actual
      await this.authenticateUser();

      // Verificar conexión básica
      const { data, error } = await this.supabase
        .from('academic_resources')
        .select('count')
        .limit(1);
      
      if (error && !['PGRST116', '42P01'].includes(error.code)) {
        // PGRST116 = tabla no existe, 42P01 = relation does not exist
        // Estos errores son normales si las tablas no existen aún
        console.warn('Connection warning:', error);
      }

      this.isConnected = true;
      console.log('✅ Conectado a Supabase exitosamente');
      return true;
    } catch (error) {
      console.error('Error connecting to cloud:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    try {
      const { data, error } = await this.supabase
        .from('academic_resources')
        .select('count')
        .limit(1);
      return !error || ['PGRST116', '42P01'].includes(error.code);
    } catch (error) {
      return false;
    }
  }

  private async authenticateUser(): Promise<void> {
    try {
      // Intentar obtener usuario actual
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (user) {
        this.currentUser = user;
        console.log('Usuario autenticado:', user.email || user.id);
      } else {
        // Crear sesión anónima usando un ID único del navegador
        const deviceId = this.getDeviceId();
        this.currentUser = { id: deviceId };
        console.log('Usuario anónimo creado:', deviceId);
      }
    } catch (error) {
      // Usar ID de dispositivo como fallback
      const deviceId = this.getDeviceId();
      this.currentUser = { id: deviceId };
      console.log('Usuario fallback creado:', deviceId);
    }
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('libraryai_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('libraryai_device_id', deviceId);
    }
    return deviceId;
  }

  async syncToCloud(): Promise<void> {
    if (!this.isConnected || !this.supabase || !this.currentUser) {
      throw new Error('No hay conexión a la nube');
    }

    try {
      // Obtener todos los recursos locales
      const localResources = await databaseService.getAllResources();
      
      if (localResources.length === 0) {
        console.log('No hay recursos locales para sincronizar');
        return;
      }

      console.log(`Sincronizando ${localResources.length} recursos a la nube...`);

      // Preparar recursos para la nube
      const cloudResources = localResources.map(resource => ({
        id: resource.id,
        user_id: this.currentUser.id,
        title: resource.title,
        authors: resource.authors,
        type: resource.type,
        category: resource.category,
        tags: resource.tags,
        abstract: resource.abstract,
        published_year: resource.publishedYear,
        publisher: resource.publisher,
        citations: resource.citations,
        availability: resource.availability,
        location: resource.location,
        isbn: resource.isbn,
        doi: resource.doi,
        rating: resource.rating,
        review_count: resource.reviewCount,
        language: resource.language,
        page_count: resource.pageCount,
        thumbnail: resource.thumbnail,
        related_topics: resource.relatedTopics,
        url: resource.url,
        digital_url: resource.digitalUrl,
        library_system: resource.librarySystem,
        full_text_keywords: resource.fullTextKeywords,
        source: (resource as any).source || 'unknown',
        date_added: (resource as any).dateAdded || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Subir recursos en lotes para evitar límites
      const batchSize = 50;
      let uploadedCount = 0;
      
      for (let i = 0; i < cloudResources.length; i += batchSize) {
        const batch = cloudResources.slice(i, i + batchSize);
        
        const { error } = await this.supabase
          .from('academic_resources')
          .upsert(batch, { 
            onConflict: 'id,user_id',
            ignoreDuplicates: false 
          });

        if (error) {
          console.warn(`Error uploading batch ${i / batchSize + 1}:`, error);
          // Continuar con el siguiente lote
        } else {
          uploadedCount += batch.length;
        }
      }

      console.log(`✅ ${uploadedCount} recursos sincronizados a la nube`);

      // Actualizar metadata de sincronización
      await this.updateSyncMetadata('upload');

    } catch (error) {
      console.error('Error syncing to cloud:', error);
      throw error;
    }
  }

  async syncFromCloud(): Promise<void> {
    if (!this.isConnected || !this.supabase || !this.currentUser) {
      throw new Error('No hay conexión a la nube');
    }

    try {
      console.log('Descargando recursos desde la nube...');

      // Obtener recursos del usuario desde la nube
      const { data: cloudResources, error } = await this.supabase
        .from('academic_resources')
        .select('*')
        .eq('user_id', this.currentUser.id);

      if (error) {
        throw error;
      }

      if (!cloudResources || cloudResources.length === 0) {
        console.log('No hay recursos en la nube para descargar');
        return;
      }

      console.log(`Descargando ${cloudResources.length} recursos desde la nube...`);

      // Convertir recursos de la nube al formato local
      const localResources: Resource[] = cloudResources.map((cloudResource: any) => ({
        id: cloudResource.id,
        title: cloudResource.title,
        authors: cloudResource.authors || [],
        type: cloudResource.type,
        category: cloudResource.category,
        tags: cloudResource.tags || [],
        abstract: cloudResource.abstract || '',
        publishedYear: cloudResource.published_year,
        publisher: cloudResource.publisher || '',
        citations: cloudResource.citations || 0,
        availability: cloudResource.availability,
        location: cloudResource.location,
        isbn: cloudResource.isbn,
        doi: cloudResource.doi,
        rating: cloudResource.rating || 0,
        reviewCount: cloudResource.review_count || 0,
        language: cloudResource.language || 'en',
        pageCount: cloudResource.page_count,
        thumbnail: cloudResource.thumbnail || '',
        relatedTopics: cloudResource.related_topics || [],
        url: cloudResource.url,
        digitalUrl: cloudResource.digital_url,
        librarySystem: cloudResource.library_system,
        fullTextKeywords: cloudResource.full_text_keywords || [],
        // Metadata adicional
        source: cloudResource.source,
        dateAdded: cloudResource.date_added || cloudResource.created_at
      }));

      // Guardar recursos en la base de datos local
      if (localResources.length > 0) {
        // Agrupar por fuente para guardar correctamente
        const resourcesBySource = localResources.reduce((acc, resource) => {
          const source = (resource as any).source || 'cloud';
          if (!acc[source]) acc[source] = [];
          acc[source].push(resource);
          return acc;
        }, {} as Record<string, Resource[]>);

        for (const [source, resources] of Object.entries(resourcesBySource)) {
          await databaseService.saveResources(resources, source);
        }
      }

      console.log(`✅ ${localResources.length} recursos descargados desde la nube`);

      // Actualizar metadata de sincronización
      await this.updateSyncMetadata('download');

    } catch (error) {
      console.error('Error syncing from cloud:', error);
      throw error;
    }
  }

  async deleteResourceFromCloud(resourceId: string): Promise<void> {
    if (!this.isConnected || !this.supabase || !this.currentUser) {
      return;
    }

    try {
      const { error } = await this.supabase
        .from('academic_resources')
        .delete()
        .eq('id', resourceId)
        .eq('user_id', this.currentUser.id);

      if (error) {
        console.warn('Error deleting resource from cloud:', error);
      } else {
        console.log(`Recurso ${resourceId} eliminado de la nube`);
      }
    } catch (error) {
      console.warn('Error deleting resource from cloud:', error);
    }
  }

  async getCloudStats(): Promise<CloudSyncStats> {
    if (!this.isConnected || !this.supabase || !this.currentUser) {
      return {
        totalResources: 0,
        lastSync: null,
        syncCount: 0
      };
    }

    try {
      // Contar recursos en la nube
      const { count, error: countError } = await this.supabase
        .from('academic_resources')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', this.currentUser.id);

      if (countError) {
        console.warn('Error getting cloud resource count:', countError);
      }

      // Obtener metadata de sincronización
      const { data: syncData, error: syncError } = await this.supabase
        .from('sync_metadata')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .order('last_sync', { ascending: false })
        .limit(1);

      if (syncError) {
        console.warn('Error getting sync metadata:', syncError);
      }

      const lastSyncRecord = syncData?.[0];

      return {
        totalResources: count || 0,
        lastSync: lastSyncRecord ? new Date(lastSyncRecord.last_sync) : null,
        syncCount: lastSyncRecord?.sync_count || 0
      };
    } catch (error) {
      console.error('Error getting cloud stats:', error);
      return {
        totalResources: 0,
        lastSync: null,
        syncCount: 0
      };
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    const stats = await this.getCloudStats();
    return stats.lastSync;
  }

  private async updateSyncMetadata(operation: 'upload' | 'download'): Promise<void> {
    if (!this.supabase || !this.currentUser) return;

    try {
      // Obtener metadata actual
      const { data: existing } = await this.supabase
        .from('sync_metadata')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .single();

      const syncCount = (existing?.sync_count || 0) + 1;

      const metadata = {
        user_id: this.currentUser.id,
        last_sync: new Date().toISOString(),
        sync_count: syncCount,
        last_operation: operation,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        await this.supabase
          .from('sync_metadata')
          .update(metadata)
          .eq('user_id', this.currentUser.id);
      } else {
        await this.supabase
          .from('sync_metadata')
          .insert({ ...metadata, created_at: new Date().toISOString() });
      }
    } catch (error) {
      console.warn('Error updating sync metadata:', error);
    }
  }

  async clearCloudData(): Promise<void> {
    if (!this.isConnected || !this.supabase || !this.currentUser) {
      throw new Error('No hay conexión a la nube');
    }

    try {
      // Eliminar todos los recursos del usuario
      await this.supabase
        .from('academic_resources')
        .delete()
        .eq('user_id', this.currentUser.id);

      // Eliminar metadata de sincronización
      await this.supabase
        .from('sync_metadata')
        .delete()
        .eq('user_id', this.currentUser.id);

      console.log('Datos de la nube eliminados exitosamente');
    } catch (error) {
      console.error('Error clearing cloud data:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.isConnected = false;
    this.supabase = null;
    this.currentUser = null;
    console.log('Desconectado de la nube');
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getCurrentUserId(): string | null {
    return this.currentUser?.id || null;
  }

  isConfigured(): boolean {
    return !!(this.supabaseUrl && this.supabaseKey);
  }
}

// Instancia singleton del servicio de sincronización
export const cloudSyncService = new CloudSyncService();