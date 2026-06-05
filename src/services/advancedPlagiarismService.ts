import { createClient } from '@supabase/supabase-js';

export interface Match {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: 'academic' | 'web' | 'book' | 'journal';
  similarity: number;
  matchedText: string;
  originalText: string;
  startPosition: number;
  endPosition: number;
  confidence: number;
  isVerified: boolean;
  verificationScore: number;
  doi?: string;
}

export interface AnalysisResult {
  overallSimilarity: number;
  status: 'safe' | 'warning' | 'high-risk';
  matches: Match[];
  analysisMethod: 'winnowing' | 'ngram' | 'hybrid';
  analysisTimeMs: number;
  wordsAnalyzed: number;
  sourcesChecked: number;
  language: 'es' | 'en' | 'mixed';
  fingerprintHash: string;
  winnowingHash: string;
  ngram3Count: number;
  ngram5Count: number;
}

export interface RepositoryMatch {
  source: string;
  matches: Array<{
    title: string;
    similarity: number;
    url: string;
    doi?: string;
  }>;
}

class AdvancedPlagiarismService {
  private supabase: ReturnType<typeof createClient> | null = null;
  private readonly K_GRAM = 4;
  private readonly WINDOW_SIZE = 4;

  private getSupabase() {
    if (!this.supabase) {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (url && key) {
        this.supabase = createClient(url, key);
      }
    }
    return this.supabase;
  }

  // ========== WINNOWING ALGORITHM ==========
  // K-gram hashing: split text into overlapping k-character chunks, hash each
  private kgramHashes(text: string, k: number): number[] {
    const hashes: number[] = [];
    for (let i = 0; i <= text.length - k; i++) {
      hashes.push(this.hashStr(text.substring(i, i + k)));
    }
    return hashes;
  }

  // Winnowing: from the sequence of k-gram hashes, pick the minimum from each
  // sliding window of size w. This yields a compact fingerprint that is
  // robust to minor edits/insertions.
  private winnow(hashes: number[], w: number): number[] {
    const fingerprint: number[] = [];
    for (let i = 0; i <= hashes.length - w; i++) {
      const window = hashes.slice(i, i + w);
      const minVal = Math.min(...window);
      // Avoid consecutive duplicates
      if (fingerprint.length === 0 || fingerprint[fingerprint.length - 1] !== minVal) {
        fingerprint.push(minVal);
      }
    }
    return fingerprint;
  }

  winnowingFingerprint(text: string): { hash: string; points: number[] } {
    const normalized = text.toLowerCase().replace(/[^a-z0-9áéíóúñü ]/g, '').replace(/\s+/g, ' ').trim();
    const kgramHashes = this.kgramHashes(normalized, this.K_GRAM);
    const points = this.winnow(kgramHashes, this.WINDOW_SIZE);
    return { hash: points.join(':'), points };
  }

  // ========== N-GRAM ALGORITHM ==========
  // Character-level n-grams: overlapping substrings of length n
  charNgrams(text: string, n: number): string[] {
    const normalized = text.toLowerCase().replace(/[^a-z0-9áéíóúñü ]/g, '').replace(/\s+/g, ' ').trim();
    const grams: string[] = [];
    for (let i = 0; i <= normalized.length - n; i++) {
      grams.push(normalized.substring(i, i + n));
    }
    return grams;
  }

  // Word-level n-grams
  wordNgrams(text: string, n: number): string[] {
    const normalized = text.toLowerCase().replace(/[^a-z0-9áéíóúñü ]/g, '').replace(/\s+/g, ' ').trim();
    const words = normalized.split(' ').filter(w => w.length > 0);
    const grams: string[] = [];
    for (let i = 0; i <= words.length - n; i++) {
      grams.push(words.slice(i, i + n).join(' '));
    }
    return grams;
  }

  // ========== SIMILARITY METRICS ==========
  // Jaccard similarity between two sets
  jaccard<T>(a: Set<T>, b: Set<T>): number {
    if (a.size === 0 && b.size === 0) return 0;
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  // Cosine similarity between two frequency maps
  cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
    const allKeys = new Set([...a.keys(), ...b.keys()]);
    let dot = 0, magA = 0, magB = 0;
    for (const key of allKeys) {
      const va = a.get(key) || 0;
      const vb = b.get(key) || 0;
      dot += va * vb;
      magA += va * va;
      magB += vb * vb;
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  // Build frequency map from n-grams
  private freqMap(items: string[]): Map<string, number> {
    const m = new Map<string, number>();
    for (const item of items) {
      m.set(item, (m.get(item) || 0) + 1);
    }
    return m;
  }

  // ========== HASH UTILITY ==========
  private hashStr(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h = h & h; // 32-bit int
    }
    return Math.abs(h);
  }

  private fingerprintHash(text: string): string {
    return this.hashStr(text).toString(16);
  }

  // ========== MAIN ANALYSIS ==========
  async analyzeText(
    text: string,
    sourceTexts: Array<{ id: string; title: string; content: string; url: string; type: 'academic' | 'web' | 'book' | 'journal'; isVerified: boolean; doi?: string }>,
    language: 'es' | 'en' | 'mixed',
    method: 'winnowing' | 'ngram' | 'hybrid' = 'hybrid'
  ): Promise<AnalysisResult> {
    const t0 = performance.now();
    const wordsAnalyzed = text.split(/\s+/).filter(w => w.length > 0).length;

    const inputWinnowing = this.winnowingFingerprint(text);
    const inputChar3 = new Set(this.charNgrams(text, 3));
    const inputChar5 = new Set(this.charNgrams(text, 5));
    const inputWord3Freq = this.freqMap(this.wordNgrams(text, 3));
    const inputWord5Freq = this.freqMap(this.wordNgrams(text, 5));
    const fpHash = this.fingerprintHash(text);

    const matches: Match[] = [];

    for (const src of sourceTexts) {
      let score = 0;

      if (method === 'winnowing' || method === 'hybrid') {
        const srcWinnowing = this.winnowingFingerprint(src.content);
        const setInput = new Set(inputWinnowing.points);
        const setSrc = new Set(srcWinnowing.points);
        const winnowScore = this.jaccard(setInput, setSrc);
        score = method === 'winnowing' ? winnowScore : winnowScore;
      }

      if (method === 'ngram' || method === 'hybrid') {
        const srcChar3 = new Set(this.charNgrams(src.content, 3));
        const srcChar5 = new Set(this.charNgrams(src.content, 5));
        const srcWord3Freq = this.freqMap(this.wordNgrams(src.content, 3));
        const srcWord5Freq = this.freqMap(this.wordNgrams(src.content, 5));

        const char3sim = this.jaccard(inputChar3, srcChar3);
        const char5sim = this.jaccard(inputChar5, srcChar5);
        const word3sim = this.cosineSimilarity(inputWord3Freq, srcWord3Freq);
        const word5sim = this.cosineSimilarity(inputWord5Freq, srcWord5Freq);

        const ngramScore = (char3sim * 0.2 + char5sim * 0.3 + word3sim * 0.25 + word5sim * 0.25);

        if (method === 'hybrid') {
          score = score * 0.5 + ngramScore * 0.5;
        } else {
          score = ngramScore;
        }
      }

      const similarityPct = Math.round(score * 10000) / 100;

      if (similarityPct >= 15) {
        // Find best matching sentence fragments for display
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        let bestMatch = sentences[0]?.trim() || text.substring(0, 120);
        let bestSentScore = 0;

        for (const sent of sentences) {
          const sNorm = sent.toLowerCase().trim();
          const srcNorm = src.content.toLowerCase();
          // Quick n-gram overlap on sentence vs source
          const sent3 = new Set(this.charNgrams(sNorm, 3));
          const src3 = new Set(this.charNgrams(srcNorm, 3));
          const s = this.jaccard(sent3, src3);
          if (s > bestSentScore) {
            bestSentScore = s;
            bestMatch = sent.trim();
          }
        }

        matches.push({
          id: `match-${src.id}`,
          sourceTitle: src.title,
          sourceUrl: src.url,
          sourceType: src.type,
          similarity: similarityPct,
          matchedText: bestMatch,
          originalText: src.content.substring(0, 200),
          startPosition: text.indexOf(bestMatch),
          endPosition: text.indexOf(bestMatch) + bestMatch.length,
          confidence: Math.min(100, Math.round(similarityPct * 1.2)),
          isVerified: src.isVerified,
          verificationScore: src.isVerified ? 95 : 60,
          doi: src.doi,
        });
      }
    }

    matches.sort((a, b) => b.similarity - a.similarity);
    const topMatches = matches.slice(0, 20);

    const overallSimilarity = topMatches.length > 0
      ? Math.round(topMatches.reduce((s, m) => s + m.similarity, 0) / topMatches.length * 100) / 100
      : 0;

    let status: 'safe' | 'warning' | 'high-risk' = 'safe';
    if (overallSimilarity >= 50) status = 'high-risk';
    else if (overallSimilarity >= 25) status = 'warning';

    return {
      overallSimilarity,
      status,
      matches: topMatches,
      analysisMethod: method,
      analysisTimeMs: Math.round(performance.now() - t0),
      wordsAnalyzed,
      sourcesChecked: sourceTexts.length,
      language,
      fingerprintHash: fpHash,
      winnowingHash: inputWinnowing.hash,
      ngram3Count: inputChar3.size,
      ngram5Count: inputChar5.size,
    };
  }

  // ========== EDGE FUNCTION CALL ==========
  async checkRepositories(text: string, language: string): Promise<RepositoryMatch[]> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return [];

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/plagiarism-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          text,
          documentTitle: 'Análisis de Plagio',
          language,
          method: 'hybrid',
          checkRepositories: true,
        }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.repositoryResults || [];
    } catch {
      return [];
    }
  }

  // ========== DATABASE PERSISTENCE ==========
  async saveAnalysis(userId: string, docTitle: string, text: string, result: AnalysisResult): Promise<string | null> {
    const sb = this.getSupabase();
    if (!sb) return null;

    const { data, error } = await sb
      .from('plagiarism_analyses')
      .insert([{
        user_id: userId,
        document_title: docTitle,
        analyzed_text: text,
        language: result.language,
        overall_similarity: result.overallSimilarity,
        status: result.status,
        analysis_method: result.analysisMethod,
        total_words: result.wordsAnalyzed,
        sources_checked: result.sourcesChecked,
        analysis_time_ms: result.analysisTimeMs,
        metadata: {
          fingerprint: result.fingerprintHash,
          winnowing_hash: result.winnowingHash,
          ngram3_count: result.ngram3Count,
          ngram5_count: result.ngram5Count,
        }
      }])
      .select('id')
      .maybeSingle();

    if (error || !data) return null;

    const analysisId = data.id;

    // Save matches
    if (result.matches.length > 0) {
      await sb.from('plagiarism_matches').insert(
        result.matches.map(m => ({
          analysis_id: analysisId,
          source_title: m.sourceTitle,
          source_url: m.sourceUrl,
          source_type: m.sourceType,
          source_doi: m.doi,
          similarity_score: m.similarity,
          matched_text: m.matchedText,
          original_text: m.originalText,
          match_position_start: m.startPosition,
          match_position_end: m.endPosition,
          confidence_score: m.confidence,
          is_verified: m.isVerified,
          verification_score: m.verificationScore,
        }))
      );
    }

    // Save fingerprint
    await sb.from('analysis_fingerprints').insert([{
      analysis_id: analysisId,
      fingerprint_hash: result.fingerprintHash,
      winnowing_hash: result.winnowingHash,
      ngram_3_hashes: [],
      ngram_5_hashes: [],
    }]);

    return analysisId;
  }

  async getAnalysisHistory(userId: string, limit = 20): Promise<any[]> {
    const sb = this.getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from('plagiarism_analyses')
      .select('id, document_title, overall_similarity, status, analysis_method, total_words, sources_checked, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  }

  async getAnalysisMatches(analysisId: string): Promise<Match[]> {
    const sb = this.getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from('plagiarism_matches')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('similarity_score', { ascending: false });

    if (error) return [];
    return (data || []).map(m => ({
      id: m.id,
      sourceTitle: m.source_title,
      sourceUrl: m.source_url,
      sourceType: m.source_type,
      similarity: m.similarity_score,
      matchedText: m.matched_text,
      originalText: m.original_text,
      startPosition: m.match_position_start,
      endPosition: m.match_position_end,
      confidence: m.confidence_score,
      isVerified: m.is_verified,
      verificationScore: m.verification_score,
      doi: m.source_doi,
    }));
  }

  async deleteAnalysis(analysisId: string): Promise<boolean> {
    const sb = this.getSupabase();
    if (!sb) return false;

    const { error } = await sb
      .from('plagiarism_analyses')
      .delete()
      .eq('id', analysisId);

    return !error;
  }
}

export const advancedPlagiarismService = new AdvancedPlagiarismService();
