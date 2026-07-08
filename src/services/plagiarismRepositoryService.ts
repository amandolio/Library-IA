import { SourceDocument } from '../data/sourceDocuments';

export interface RepoStatus {
  name: string;
  status: 'pending' | 'ok' | 'error';
  count: number;
  latencyMs?: number;
}

interface RepoDocument {
  title: string;
  author: string;
  year: number;
  abstract: string;
  url: string;
  doi?: string;
  source: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Fetch live documents from scientific repositories via Edge Function
 * Returns both converted sources and status for each repository
 */
export async function fetchLiveRepositoryDocs(text: string): Promise<{
  sources: SourceDocument[];
  statuses: RepoStatus[];
}> {
  const t0 = performance.now();
  const defaultStatuses: RepoStatus[] = [
    { name: 'CrossRef', status: 'pending', count: 0 },
    { name: 'Semantic Scholar', status: 'pending', count: 0 },
    { name: 'arXiv', status: 'pending', count: 0 },
    { name: 'Open Library', status: 'pending', count: 0 },
  ];

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { sources: [], statuses: defaultStatuses.map(s => ({ ...s, status: 'error' as const })) };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/plagiarism-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        text,
        documentTitle: 'Análisis de Plagio',
        language: 'auto',
        method: 'hybrid',
        checkRepositories: true,
      }),
    });

    const latencyMs = Math.round(performance.now() - t0);

    if (!res.ok) {
      return { sources: [], statuses: defaultStatuses.map(s => ({ ...s, status: 'error' as const, latencyMs })) };
    }

    const data = await res.json();
    const repoResults: Array<{ source: string; documents: RepoDocument[] }> = data.repositoryResults || [];

    const updatedStatuses: RepoStatus[] = defaultStatuses.map(s => {
      const repo = repoResults.find(r => r.source === s.name);
      return {
        ...s,
        status: repo ? 'ok' as const : 'error' as const,
        count: repo?.documents.length || 0,
        latencyMs,
      };
    });

    const sources: SourceDocument[] = repoResults.flatMap((repo, repoIdx) =>
      repo.documents.map((doc, docIdx) => ({
        id: `repo-${repoIdx}-${docIdx}`,
        title: doc.title,
        author: doc.author,
        year: doc.year,
        content: doc.abstract || doc.title,
        url: doc.url,
        doi: doc.doi,
        language: 'en',
        type: repo.source === 'Open Library' ? 'book' : 'academic' as 'academic' | 'book',
      }))
    );

    return { sources, statuses: updatedStatuses };
  } catch {
    const latencyMs = Math.round(performance.now() - t0);
    return { sources: [], statuses: defaultStatuses.map(s => ({ ...s, status: 'error' as const, latencyMs })) };
  }
}
