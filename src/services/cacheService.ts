
import { JobDescription, JobApplication } from "@/types";

type CacheKey = 'jobs' | 'applications' | `job-${string}` | `applications-job-${string}`;

interface CacheData {
  data: unknown;
  expiry: number;
}

class CacheService {
  private cache: Map<CacheKey, CacheData> = new Map();
  private defaultExpiry = 5 * 60 * 1000; // 5 minutes default

  constructor() {
    // Try to load cache from sessionStorage on initialization
    this.loadFromStorage();
    
    // Save cache to sessionStorage before unload
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }

  get<T>(key: CacheKey): T | null {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    // Check if cache has expired
    if (Date.now() > cachedItem.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data as T;
  }

  set<T>(key: CacheKey, data: T, expiryInMs?: number): void {
    const expiry = Date.now() + (expiryInMs || this.defaultExpiry);
    this.cache.set(key, { data, expiry });
  }

  remove(key: CacheKey): void {
    this.cache.delete(key);
  }

  clearAll(): void {
    this.cache.clear();
    sessionStorage.removeItem('appCache');
  }

  private saveToStorage(): void {
    const cacheData: Record<string, CacheData> = {};
    this.cache.forEach((value, key) => {
      cacheData[key] = value;
    });
    
    try {
      sessionStorage.setItem('appCache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save cache to sessionStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const storedCache = sessionStorage.getItem('appCache');
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        Object.keys(parsedCache).forEach(key => {
          this.cache.set(key as CacheKey, parsedCache[key]);
        });
      }
    } catch (error) {
      console.error('Failed to load cache from sessionStorage:', error);
    }
  }
}

// Create a singleton instance
export const cacheService = new CacheService();

// Helper functions for specific entity types
export const jobsCache = {
  get: () => cacheService.get<JobDescription[]>('jobs'),
  set: (jobs: JobDescription[]) => cacheService.set('jobs', jobs),
  getJob: (id: string) => cacheService.get<JobDescription>(`job-${id}`),
  setJob: (job: JobDescription) => cacheService.set(`job-${job.id}`, job),
  clear: () => {
    cacheService.remove('jobs');
    // Clear individual job caches too if needed
  }
};

export const applicationsCache = {
  get: () => cacheService.get<JobApplication[]>('applications'),
  set: (applications: JobApplication[]) => cacheService.set('applications', applications),
  getForJob: (jobId: string) => cacheService.get<JobApplication[]>(`applications-job-${jobId}`),
  setForJob: (jobId: string, applications: JobApplication[]) => 
    cacheService.set(`applications-job-${jobId}`, applications),
  clear: () => {
    cacheService.remove('applications');
    // Clear job-specific application caches if needed
  }
};
