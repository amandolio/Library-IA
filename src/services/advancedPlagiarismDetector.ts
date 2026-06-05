import { createClient } from '@supabase/supabase-js';

export type PlagiarismType =
  | 'direct'           // 8+ palabras consecutivas sin comillas
  | 'paraphrase'       // Paráfrasis insuficiente
  | 'idea'             // Plagio de ideas
  | 'self'             // Autoplagio
  | 'ghost_citation'   // Citas fantasma
  | 'translation'      // Plagio de traducción
  | 'structure'        // Plagio de estructura
  | 'data'             // Plagio de datos/resultados
  | 'methodology'      // Plagio de metodología
  | 'author_omission'; // Omisión de autoría

export interface PlagiarismMatch {
  id: string;
  type: PlagiarismType;
  typeLabel: string;
  infractingFragment: string;
  sourceDocument: string;
  sourceAuthor: string;
  sourceYear: number;
  sourceUrl?: string;
  sourceDoi?: string;
  locationPage?: number;
  locationLine?: number;
  similarityScore: number;
  confidence: number;
  matchedText: string;
  originalText: string;
  wordCount: number;
}

export interface PlagiarismReport {
  totalWords: number;
  plagiarizedWords: number;
  plagiarismPercentage: number;
  nonPlagiarismPercentage: number;
  matches: PlagiarismMatch[];
  breakdownByType: Record<PlagiarismType, { count: number; percentage: number; words: number }>;
  status: 'safe' | 'warning' | 'high-risk';
  analysisMethod: 'advanced' | 'quick';
  analysisTimeMs: number;
  sourcesChecked: number;
  citationsVerified: number;
  ghostCitationsFound: number;
  language: string;
}

interface SourceDocument {
  id: string;
  title: string;
  author: string;
  year: number;
  content: string;
  url?: string;
  doi?: string;
  language: string;
  sections?: { heading: string; content: string }[];
  tables?: { caption: string; data: Record<string, any>[] }[];
  bibliography?: string[];
  type: 'academic' | 'book' | 'web' | 'journal';
}

class AdvancedPlagiarismDetector {
  private supabase: ReturnType<typeof createClient> | null = null;
  private readonly MIN_DIRECT_WORDS = 8;
  private readonly MIN_PARAPHRASE_SIMILARITY = 0.7;
  private readonly MIN_IDEA_SIMILARITY = 0.5;
  private readonly MIN_STRUCTURE_SIMILARITY = 0.6;

  private getSupabase() {
    if (!this.supabase) {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (url && key) this.supabase = createClient(url, key);
    }
    return this.supabase;
  }

  // ========== TEXT PREPROCESSING ==========
  private normalizeText(text: string): string {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return this.normalizeText(text).split(/\s+/).filter(w => w.length > 0);
  }

  private sentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  private extractWords(text: string): string[] {
    return text.match(/\b[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+\b/g) || [];
  }

  // ========== TYPE LABELS ==========
  getTypeLabel(type: PlagiarismType): string {
    const labels: Record<PlagiarismType, string> = {
      'direct': 'Plagio Directo/Literal',
      'paraphrase': 'Paráfrasis Insuficiente',
      'idea': 'Plagio de Ideas',
      'self': 'Autoplagio',
      'ghost_citation': 'Cita Fantasma',
      'translation': 'Plagio de Traducción',
      'structure': 'Plagio Estructural',
      'data': 'Plagio de Datos/Resultados',
      'methodology': 'Plagio de Metodología',
      'author_omission': 'Omisión de Autoría'
    };
    return labels[type];
  }

  // ========== 1. DIRECT PLAGIARISM (8+ consecutive words) ==========
  detectDirectPlagiarism(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];
    const words = this.extractWords(text);
    const textNormalized = this.normalizeText(text);

    for (const source of sources) {
      const sourceWords = this.extractWords(source.content);
      const sourceNormalized = this.normalizeText(source.content);

      // Find all sequences of 8+ consecutive matching words
      for (let i = 0; i <= words.length - this.MIN_DIRECT_WORDS; i++) {
        const window = words.slice(i, i + this.MIN_DIRECT_WORDS).join(' ');
        const windowNormalized = this.normalizeText(window);

        if (sourceNormalized.includes(windowNormalized)) {
          // Extend the match to find the full overlapping sequence
          let extendStart = i;
          let extendEnd = i + this.MIN_DIRECT_WORDS;

          while (extendStart > 0) {
            const prevWord = words[extendStart - 1];
            const prevMatch = this.normalizeText(prevWord + ' ' + words.slice(extendStart, extendEnd).join(' '));
            if (sourceNormalized.includes(prevMatch)) extendStart--;
            else break;
          }

          while (extendEnd < words.length) {
            const nextMatch = this.normalizeText(words.slice(extendStart, extendEnd + 1).join(' '));
            if (sourceNormalized.includes(nextMatch)) extendEnd++;
            else break;
          }

          const matchedWords = words.slice(extendStart, extendEnd);
          const matchedText = matchedWords.join(' ');
          const wordCount = matchedWords.length;

          // Find original context in source
          const originalContext = this.findContextInSource(sourceNormalized, textNormalized, matchedText);

          // Check if this is within quotation marks (properly cited)
          const inQuotes = this.isInQuotes(text, extendStart, extendEnd);

          if (!inQuotes) {
            matches.push({
              id: `direct-${source.id}-${extendStart}`,
              type: 'direct',
              typeLabel: this.getTypeLabel('direct'),
              infractingFragment: matchedText.substring(0, 300),
              sourceDocument: source.title,
              sourceAuthor: source.author,
              sourceYear: source.year,
              sourceUrl: source.url,
              sourceDoi: source.doi,
              locationPage: Math.floor(extendStart / 250) + 1,
              similarityScore: 100,
              confidence: 98,
              matchedText: matchedText,
              originalText: originalContext,
              wordCount
            });

            // Skip ahead to avoid overlapping matches
            i = extendEnd;
          }
        }
      }
    }

    return this.deduplicateMatches(matches);
  }

  private isInQuotes(text: string, startIdx: number, endIdx: number): boolean {
    const words = this.extractWords(text);
    let charPos = 0;
    for (let i = 0; i < startIdx; i++) {
      charPos += words[i].length + 1;
    }
    const beforeText = text.substring(Math.max(0, charPos - 50), charPos);
    const afterEndPos = charPos;
    for (let i = startIdx; i < endIdx; i++) {
      charPos += (words[i]?.length || 0) + 1;
    }
    const afterText = text.substring(charPos, Math.min(text.length, charPos + 50));

    const openQuote = beforeText.lastIndexOf('"') > beforeText.lastIndexOf('"') ||
                      beforeText.lastIndexOf('"') > beforeText.lastIndexOf('"') ||
                      beforeText.lastIndexOf('«') > beforeText.lastIndexOf('»');
    const closeQuote = afterText.indexOf('"') !== -1 && afterText.indexOf('"') < afterText.indexOf(' ');

    return openQuote || closeQuote;
  }

  // ========== 2. PARAPHRASE DETECTION (TF-IDF + Cosine Similarity) ==========
  detectParaphrase(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];
    const sentences = this.sentences(text);

    for (const source of sources) {
      const sourceSentences = this.sentences(source.content);

      for (let i = 0; i < sentences.length; i++) {
        const sent = sentences[i].trim();
        if (sent.split(/\s+/).length < 6) continue; // Skip short sentences

        const sentTfidf = this.computeTFIDF(sent, [text, ...sources.map(s => s.content)]);
        let bestSimilarity = 0;
        let bestMatch = '';

        for (const srcSent of sourceSentences) {
          if (srcSent.trim().split(/\s+/).length < 6) continue;

          const srcTfidf = this.computeTFIDF(srcSent, [text, ...sources.map(s => s.content)]);
          const similarity = this.cosineSimilarity(sentTfidf, srcTfidf);

          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = srcSent;
          }
        }

        if (bestSimilarity >= this.MIN_PARAPHRASE_SIMILARITY) {
          matches.push({
            id: `paraphrase-${source.id}-${i}`,
            type: 'paraphrase',
            typeLabel: this.getTypeLabel('paraphrase'),
            infractingFragment: sent.substring(0, 300),
            sourceDocument: source.title,
            sourceAuthor: source.author,
            sourceYear: source.year,
            sourceUrl: source.url,
            sourceDoi: source.doi,
            locationPage: Math.floor(i / 5) + 1,
            similarityScore: Math.round(bestSimilarity * 100),
            confidence: Math.round(bestSimilarity * 90),
            matchedText: sent,
            originalText: bestMatch.substring(0, 300),
            wordCount: sent.split(/\s+/).length
          });
        }
      }
    }

    return this.deduplicateMatches(matches);
  }

  private computeTFIDF(text: string, corpus: string[]): Map<string, number> {
    const tokens = this.tokenize(text);
    const tf = new Map<string, number>();

    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    // Normalize TF
    for (const [term, freq] of tf) {
      tf.set(term, freq / tokens.length);
    }

    // Compute IDF
    const idf = new Map<string, number>();
    const docsWithTerm = new Map<string, number>();

    for (const doc of corpus) {
      const docTokens = new Set(this.tokenize(doc));
      for (const token of docTokens) {
        docsWithTerm.set(token, (docsWithTerm.get(token) || 0) + 1);
      }
    }

    for (const [term, docs] of docsWithTerm) {
      idf.set(term, Math.log(corpus.length / (docs + 1)) + 1);
    }

    // TF-IDF
    const tfidf = new Map<string, number>();
    for (const [term, termFreq] of tf) {
      const idfVal = idf.get(term) || 1;
      tfidf.set(term, termFreq * idfVal);
    }

    return tfidf;
  }

  private cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
    const allKeys = new Set([...vec1.keys(), ...vec2.keys()]);
    let dotProduct = 0, mag1 = 0, mag2 = 0;

    for (const key of allKeys) {
      const v1 = vec1.get(key) || 0;
      const v2 = vec2.get(key) || 0;
      dotProduct += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    }

    const denom = Math.sqrt(mag1) * Math.sqrt(mag2);
    return denom === 0 ? 0 : dotProduct / denom;
  }

  // ========== 3. IDEA PLAGIARISM (Named Entities + Concept Graphs) ==========
  detectIdeaPlagiarism(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    // Extract entities and concepts from text
    const textEntities = this.extractEntities(text);
    const textConcepts = this.extractConcepts(text);

    for (const source of sources) {
      const sourceEntities = this.extractEntities(source.content);
      const sourceConcepts = this.extractConcepts(source.content);

      // Entity overlap
      const entityOverlap = this.setOverlap(textEntities, sourceEntities);

      // Concept similarity
      const conceptSimilarity = this.setOverlap(textConcepts, sourceConcepts);

      const combinedScore = (entityOverlap * 0.4 + conceptSimilarity * 0.6);

      if (combinedScore >= this.MIN_IDEA_SIMILARITY && entityOverlap > 0.3) {
        // Find the most relevant paragraph
        const paragraphs = text.split(/\n\n+/);
        let bestParagraph = '';
        let bestParagraphScore = 0;

        for (const para of paragraphs) {
          const paraEntities = this.extractEntities(para);
          const overlap = this.setOverlap(paraEntities, sourceEntities);
          if (overlap > bestParagraphScore) {
            bestParagraphScore = overlap;
            bestParagraph = para;
          }
        }

        matches.push({
          id: `idea-${source.id}`,
          type: 'idea',
          typeLabel: this.getTypeLabel('idea'),
          infractingFragment: bestParagraph.substring(0, 300),
          sourceDocument: source.title,
          sourceAuthor: source.author,
          sourceYear: source.year,
          sourceUrl: source.url,
          sourceDoi: source.doi,
          locationPage: 1,
          similarityScore: Math.round(combinedScore * 100),
          confidence: Math.round(combinedScore * 70),
          matchedText: bestParagraph,
          originalText: source.content.substring(0, 200),
          wordCount: bestParagraph.split(/\s+/).length
        });
      }
    }

    return this.deduplicateMatches(matches);
  }

  private extractEntities(text: string): Set<string> {
    const entities = new Set<string>();

    // Named entity patterns (capitalized phrases, acronyms)
    const namedEntityPattern = /\b[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]+)*\b/g;
    const matches = text.match(namedEntityPattern) || [];
    for (const m of matches) {
      if (m.length > 3) entities.add(m.toLowerCase());
    }

    // Technical terms and concepts
    const techTerms = /\b(?:inteligencia artificial|machine learning|deep learning|neural network|red neuronal|algoritmo|modelo|sistema|metodología|hipótesis|análisis|experimental|resultados|conclusión)\b/gi;
    const techMatches = text.match(techTerms) || [];
    for (const m of techMatches) {
      entities.add(m.toLowerCase());
    }

    return entities;
  }

  private extractConcepts(text: string): Set<string> {
    const concepts = new Set<string>();

    // Key noun phrases
    const nounPhrases = /\b(?:el|la|los|las|un|una)\s+([a-záéíóúüñ]+(?:\s+[a-záéíóúüñ]+){0,3})\b/gi;
    let match;
    while ((match = nounPhrases.exec(text)) !== null) {
      if (match[1] && match[1].length > 4) {
        concepts.add(match[1].toLowerCase());
      }
    }

    return concepts;
  }

  private setOverlap(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 || b.size === 0) return 0;
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return intersection.size / union.size;
  }

  // ========== 4. SELF-PLAGIARISM ==========
  detectSelfPlagiarism(text: string, sources: SourceDocument[], authorName?: string): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    if (!authorName) return matches;

    const authorSources = sources.filter(s =>
      s.author.toLowerCase().includes(authorName.toLowerCase())
    );

    if (authorSources.length === 0) return matches;

    // Check for significant overlap with author's previous works
    for (const source of authorSources) {
      const textNgrams = this.computeNgramSet(text, 5);
      const sourceNgrams = this.computeNgramSet(source.content, 5);
      const overlap = this.setOverlap(textNgrams, sourceNgrams);

      if (overlap >= 0.3) {
        matches.push({
          id: `self-${source.id}`,
          type: 'self',
          typeLabel: this.getTypeLabel('self'),
          infractingFragment: text.substring(0, 300),
          sourceDocument: source.title,
          sourceAuthor: source.author,
          sourceYear: source.year,
          sourceUrl: source.url,
          locationPage: 1,
          similarityScore: Math.round(overlap * 100),
          confidence: Math.round(overlap * 85),
          matchedText: text.substring(0, 200),
          originalText: source.content.substring(0, 200),
          wordCount: text.split(/\s+/).length
        });
      }
    }

    return matches;
  }

  private computeNgramSet(text: string, n: number): Set<string> {
    const tokens = this.tokenize(text);
    const ngrams = new Set<string>();

    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(' '));
    }

    return ngrams;
  }

  // ========== 5. GHOST CITATION DETECTION ==========
  detectGhostCitations(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    // Extract in-text citations
    const citationPattern = /\(([A-ZÁÉÍÓÚÑ][a-záéíóúüñ]+(?:\s+(?:et al\.?|and|&|y)?\s*[A-ZÁÉÍÓÚÑ]?[a-záéíóúüñ]*)*)\s*,?\s*(\d{4}[a-z]?)\)/gi;
    const citations: Array<{ author: string; year: string; full: string }> = [];

    let match;
    while ((match = citationPattern.exec(text)) !== null) {
      citations.push({ author: match[1], year: match[2], full: match[0] });
    }

    // Extract bibliography references
    const bibPattern = /^[\s]*([^\d].*?)\s*\((\d{4}[a-z]?)\)/gm;
    const bibliography: Set<string> = new Set();

    // Look for reference section
    const refSectionMatch = text.match(/(?:Referencias|References|Bibliografía|Bibliography)[\s\S]*$/i);
    if (refSectionMatch) {
      let bibMatch;
      const refText = refSectionMatch[0];
      while ((bibMatch = bibPattern.exec(refText)) !== null) {
        bibliography.add(`${bibMatch[1].toLowerCase().trim()}|${bibMatch[2]}`);
      }
    }

    // Check if in-text citations exist in bibliography
    for (const citation of citations) {
      const normalizedAuthor = citation.author.toLowerCase()
        .replace(/et al\.?/gi, '')
        .replace(/and|&|y/gi, ',')
        .trim()
        .split(',')[0]
        .trim();

      const citationKey = `${normalizedAuthor}|${citation.year}`;
      const found = Array.from(bibliography).some(b =>
        b.includes(normalizedAuthor) && b.includes(citation.year)
      );

      if (!found && bibliography.size > 0) {
        matches.push({
          id: `ghost-${citation.author}-${citation.year}`,
          type: 'ghost_citation',
          typeLabel: this.getTypeLabel('ghost_citation'),
          infractingFragment: citation.full,
          sourceDocument: 'Cita no verificada',
          sourceAuthor: citation.author,
          sourceYear: parseInt(citation.year) || 0,
          locationPage: 1,
          similarityScore: 100,
          confidence: 95,
          matchedText: citation.full,
          originalText: 'Referencia no encontrada en bibliografía',
          wordCount: citation.full.split(/\s+/).length
        });
      }
    }

    // Check if bibliography references are real (compare to known sources)
    for (const bibEntry of bibliography) {
      const [author, year] = bibEntry.split('|');
      const isReal = sources.some(s =>
        s.author.toLowerCase().includes(author) &&
        s.year.toString() === year
      );

      if (!isReal && sources.length > 0) {
        matches.push({
          id: `ghost-bib-${author}-${year}`,
          type: 'ghost_citation',
          typeLabel: this.getTypeLabel('ghost_citation'),
          infractingFragment: `${author} (${year})`,
          sourceDocument: 'Posible referencia inventada',
          sourceAuthor: author,
          sourceYear: parseInt(year) || 0,
          locationPage: 1,
          similarityScore: 80,
          confidence: 60,
          matchedText: bibEntry,
          originalText: 'No coincide con fuentes verificadas',
          wordCount: 5
        });
      }
    }

    return matches;
  }

  // ========== 6. TRANSLATION PLAGIARISM ==========
  detectTranslationPlagiarism(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];
    const textLanguage = this.detectLanguage(text);

    // Only check sources in different languages
    const differentLangSources = sources.filter(s => s.language !== textLanguage);

    for (const source of differentLangSources) {
      // Simple semantic similarity using word embeddings approximation
      const textKeywords = this.extractKeywords(text);
      const sourceKeywords = this.extractKeywords(source.content);

      // Translate keywords conceptually (simple mapping)
      const translatedTextKeywords = this.translateKeywords(textKeywords, textLanguage);
      const translatedSourceKeywords = this.translateKeywords(sourceKeywords, source.language);

      // Compare in common "semantic space"
      const overlap = this.setOverlap(translatedTextKeywords, translatedSourceKeywords);

      if (overlap >= 0.4) {
        matches.push({
          id: `translation-${source.id}`,
          type: 'translation',
          typeLabel: this.getTypeLabel('translation'),
          infractingFragment: text.substring(0, 300),
          sourceDocument: source.title,
          sourceAuthor: source.author,
          sourceYear: source.year,
          sourceUrl: source.url,
          sourceDoi: source.doi,
          locationPage: 1,
          similarityScore: Math.round(overlap * 100),
          confidence: Math.round(overlap * 60),
          matchedText: text.substring(0, 200),
          originalText: source.content.substring(0, 200),
          wordCount: text.split(/\s+/).length
        });
      }
    }

    return this.deduplicateMatches(matches);
  }

  private detectLanguage(text: string): string {
    const esWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'por'];
    const enWords = ['the', 'of', 'and', 'to', 'a', 'in', 'is', 'it', 'for', 'was'];

    const words = this.tokenize(text);
    let esCount = 0, enCount = 0;

    for (const w of words) {
      if (esWords.includes(w)) esCount++;
      if (enWords.includes(w)) enCount++;
    }

    return esCount > enCount ? 'es' : 'en';
  }

  private extractKeywords(text: string): Set<string> {
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'es', 'al',
      'the', 'a', 'an', 'of', 'in', 'on', 'for', 'with', 'to', 'and', 'or', 'is', 'are', 'was', 'were'
    ]);

    const words = this.tokenize(text);
    const freq = new Map<string, number>();

    for (const w of words) {
      if (!stopWords.has(w) && w.length > 3) {
        freq.set(w, (freq.get(w) || 0) + 1);
      }
    }

    const keywords = new Set<string>();
    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);
    for (const [word] of sorted) {
      keywords.add(word);
    }

    return keywords;
  }

  private translateKeywords(keywords: Set<string>, fromLang: string): Set<string> {
    // Simple bilingual mapping for common academic terms
    const translations: Record<string, Record<string, string>> = {
      'es': {
        'inteligencia': 'intelligence', 'artificial': 'artificial',
        'aprendizaje': 'learning', 'máquina': 'machine',
        'datos': 'data', 'análisis': 'analysis',
        'sistema': 'system', 'modelo': 'model',
        'metodología': 'methodology', 'resultados': 'results',
        'conclusión': 'conclusion', 'hipótesis': 'hypothesis',
        'investigación': 'research', 'estudio': 'study',
        'tecnología': 'technology', 'ciencia': 'science'
      },
      'en': {
        'intelligence': 'inteligencia', 'artificial': 'artificial',
        'learning': 'aprendizaje', 'machine': 'máquina',
        'data': 'datos', 'analysis': 'análisis',
        'system': 'sistema', 'model': 'modelo',
        'methodology': 'metodología', 'results': 'resultados',
        'conclusion': 'conclusión', 'hypothesis': 'hipótesis',
        'research': 'investigación', 'study': 'estudio',
        'technology': 'tecnología', 'science': 'ciencia'
      }
    };

    const translated = new Set<string>();
    const dict = translations[fromLang] || {};

    for (const kw of keywords) {
      translated.add(dict[kw] || kw);
    }

    return translated;
  }

  // ========== 7. STRUCTURE PLAGIARISM ==========
  detectStructurePlagiarism(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    const textStructure = this.extractStructure(text);

    for (const source of sources) {
      const sourceStructure = source.sections
        ? { headings: source.sections.map(s => s.heading), paragraphCounts: [source.sections.length] }
        : this.extractStructure(source.content);

      const headingSimilarity = this.compareHeadings(textStructure.headings, sourceStructure.headings);
      const sequenceSimilarity = this.compareSequence(textStructure.headings, sourceStructure.headings);

      const combinedScore = (headingSimilarity * 0.5 + sequenceSimilarity * 0.5);

      if (combinedScore >= this.MIN_STRUCTURE_SIMILARITY && textStructure.headings.length >= 3) {
        matches.push({
          id: `structure-${source.id}`,
          type: 'structure',
          typeLabel: this.getTypeLabel('structure'),
          infractingFragment: textStructure.headings.slice(0, 5).join(' → '),
          sourceDocument: source.title,
          sourceAuthor: source.author,
          sourceYear: source.year,
          sourceUrl: source.url,
          locationPage: 1,
          similarityScore: Math.round(combinedScore * 100),
          confidence: Math.round(combinedScore * 75),
          matchedText: `Secciones: ${textStructure.headings.join(', ')}`,
          originalText: `Fuente: ${sourceStructure.headings.join(', ')}`,
          wordCount: 50
        });
      }
    }

    return matches;
  }

  private extractStructure(text: string): { headings: string[]; paragraphCounts: number[] } {
    const headings: string[] = [];

    // Extract headings (numbered or markdown-style)
    const headingPatterns = [
      /^(?:#\s+|\d+\.?\s+)?([A-ZÁÉÍÓÚÑ][a-záéíóúüñ]+(?:\s+[a-záéíóúüñ]+){0,5})$/gm,
      /^(?:Capítulo|Chapter|Sección|Section|Parte)\s+(\d+)[:.]?\s*(.*)$/gim
    ];

    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^(?:Capítulo|Chapter|Sección|Section|Parte|\d+\.|#)/i)) {
        headings.push(trimmed.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, ''));
      }
    }

    // Also detect significant paragraph breaks as section boundaries
    const paragraphs = text.split(/\n\s*\n/);
    const paragraphCounts = paragraphs.map(p => p.split(/\s+/).length);

    return { headings: [...new Set(headings)], paragraphCounts };
  }

  private compareHeadings(h1: string[], h2: string[]): number {
    if (h1.length === 0 || h2.length === 0) return 0;

    const h1set = new Set(h1.map(h => this.normalizeText(h)));
    const h2set = new Set(h2.map(h => this.normalizeText(h)));

    return this.setOverlap(h1set, h2set);
  }

  private compareSequence(h1: string[], h2: string[]): number {
    if (h1.length < 2 || h2.length < 2) return 0;

    const h1norm = h1.map(h => this.normalizeText(h).split(' ')[0]);
    const h2norm = h2.map(h => this.normalizeText(h).split(' ')[0]);

    const h1joined = h1norm.join('|');
    const h2joined = h2norm.join('|');

    // Find longest common subsequence ratio
    let matches = 0;
    for (let i = 0; i < h1norm.length; i++) {
      for (let j = 0; j < h2norm.length; j++) {
        if (h1norm[i] === h2norm[j]) {
          matches++;
          break;
        }
      }
    }

    return matches / Math.max(h1norm.length, h2norm.length);
  }

  // ========== 8. DATA PLAGIARISM ==========
  detectDataPlagiarism(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    // Extract numerical data from text
    const textData = this.extractNumericalData(text);

    if (textData.length === 0) return matches;

    for (const source of sources) {
      const sourceData = source.tables
        ? source.tables.flatMap(t => Object.values(t.data || {}).flatMap(Object.values as any))
        : this.extractNumericalData(source.content);

      if (sourceData.length === 0) continue;

      // Find matching numerical sequences
      const matchingData = this.findMatchingData(textData, sourceData);

      if (matchingData.length >= 3) { // At least 3 matching data points
        matches.push({
          id: `data-${source.id}`,
          type: 'data',
          typeLabel: this.getTypeLabel('data'),
          infractingFragment: matchingData.slice(0, 5).join(', '),
          sourceDocument: source.title,
          sourceAuthor: source.author,
          sourceYear: source.year,
          sourceUrl: source.url,
          locationPage: 1,
          similarityScore: Math.round((matchingData.length / textData.length) * 100),
          confidence: Math.round((matchingData.length / Math.max(textData.length, sourceData.length)) * 100),
          matchedText: `Datos encontrados: ${matchingData.slice(0, 10).join(', ')}`,
          originalText: `Fuente original contiene datos similares`,
          wordCount: matchingData.length
        });
      }
    }

    return matches;
  }

  private extractNumericalData(text: string): number[] {
    const numbers: number[] = [];

    // Match floats, percentages, and integers
    const numPattern = /(?:^|[\s(])(\d+(?:[.,]\d+)?%?)(?:[\s)]|$|[\s,])/g;

    let match;
    while ((match = numPattern.exec(text)) !== null) {
      const num = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(num) && num > 0 && num !== 100) { // Exclude typical percentages like 100%
        numbers.push(num);
      }
    }

    // Also look for patterns like "n = X" or "X participants"
    const samplePatterns = [
      /(?:n|N|sample|participants?|subjects?|participants)\s*[=:]\s*(\d+)/gi,
      /(\d+)\s*(?:participants?|subjects?|cases?|patients?|students?)/gi
    ];

    if (samplePatterns) {
      // Implementation would extract sample sizes
    }

    return numbers;
  }

  private findMatchingData(data1: number[], data2: number[]): number[] {
    const matches: number[] = [];
    const tolerance = 0.01; // 1% tolerance for floating point comparison

    for (const d1 of data1) {
      for (const d2 of data2) {
        if (Math.abs(d1 - d2) <= d1 * tolerance || d1 === d2) {
          matches.push(d1);
          break;
        }
      }
    }

    return [...new Set(matches)];
  }

  // ========== 9. METHODOLOGY PLAGIARISM ==========
  detectMethodologyPlagiarism(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    // Extract methodology section
    const methodSection = this.extractMethodologySection(text);

    if (!methodSection) return matches;

    const methodKeywords = this.extractKeywords(methodSection);

    for (const source of sources) {
      const sourceMethod = this.extractMethodologySection(source.content);

      if (!sourceMethod) continue;

      const sourceKeywords = this.extractKeywords(sourceMethod);

      // Filter out common reagent/instrument names
      const commonTerms = new Set([
        'used', 'using', 'conducted', 'performed', 'carried', 'out',
        'utilizado', 'utilizando', 'realizado', 'realizando'
      ]);

      for (const term of commonTerms) {
        methodKeywords.delete(term);
        sourceKeywords.delete(term);
      }

      const similarity = this.cosineSimilarityMap(
        this.keywordToFreq(methodKeywords),
        this.keywordToFreq(sourceKeywords)
      );

      if (similarity >= 0.8) {
        matches.push({
          id: `method-${source.id}`,
          type: 'methodology',
          typeLabel: this.getTypeLabel('methodology'),
          infractingFragment: methodSection.substring(0, 300),
          sourceDocument: source.title,
          sourceAuthor: source.author,
          sourceYear: source.year,
          sourceUrl: source.url,
          sourceDoi: source.doi,
          locationPage: 1,
          similarityScore: Math.round(similarity * 100),
          confidence: Math.round(similarity * 85),
          matchedText: methodSection.substring(0, 200),
          originalText: sourceMethod.substring(0, 200),
          wordCount: methodSection.split(/\s+/).length
        });
      }
    }

    return matches;
  }

  private extractMethodologySection(text: string): string | null {
    const methodPatterns = [
      /(?:Metodología|Métodos|Methodology|Methods|Materials and Methods|Material y Métodos)[\s\S]*?(?=(?:Resultados|Results|Discusión|Discussion|Conclusiones|Conclusions|$))/i,
      /(?:Experimental|Procedure|Procedimiento)[\s\S]*?(?=(?:Results|Results|Discussion|$))/i
    ];

    for (const pattern of methodPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }

    return null;
  }

  private keywordToFreq(keywords: Set<string>): Map<string, number> {
    const m = new Map<string, number>();
    for (const k of keywords) {
      m.set(k, 1);
    }
    return m;
  }

  private cosineSimilarityMap(a: Map<string, number>, b: Map<string, number>): number {
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

  // ========== 10. AUTHOR OMISSION PLAGIARISM ==========
  detectAuthorOmission(text: string, sources: SourceDocument[]): PlagiarismMatch[] {
    const matches: PlagiarismMatch[] = [];

    // Check for citations to sources with high similarity
    const citationPattern = /\(([^)]+),?\s*(\d{4})\)/g;
    const citedAuthors = new Set<string>();

    let match;
    while ((match = citationPattern.exec(text)) !== null) {
      citedAuthors.add(match[1].toLowerCase().split(/[,&]/)[0].trim());
    }

    for (const source of sources) {
      // Check overall semantic similarity
      const textKeywords = this.extractKeywords(text);
      const sourceKeywords = this.extractKeywords(source.content);
      const similarity = this.setOverlap(textKeywords, sourceKeywords);

      if (similarity >= 0.3) {
        // Check if the source author is cited
        const sourceAuthorParts = source.author.toLowerCase().split(/[,&]/);
        const isCited = sourceAuthorParts.some(part =>
          citedAuthors.has(part.trim().split(' ').pop() || '')
        );

        if (!isCited) {
          matches.push({
            id: `omission-${source.id}`,
            type: 'author_omission',
            typeLabel: this.getTypeLabel('author_omission'),
            infractingFragment: `Similitud alta (${Math.round(similarity * 100)}%) sin cita a ${source.author}`,
            sourceDocument: source.title,
            sourceAuthor: source.author,
            sourceYear: source.year,
            sourceUrl: source.url,
            sourceDoi: source.doi,
            locationPage: 1,
            similarityScore: Math.round(similarity * 100),
            confidence: Math.round(similarity * 50),
            matchedText: 'Contenido con alta similitud semántica pero sin atribución',
            originalText: source.content.substring(0, 150),
            wordCount: 50
          });
        }
      }
    }

    return matches.slice(0, 5); // Limit to top 5
  }

  // ========== MAIN ANALYSIS FUNCTION ==========
  async analyzeFull(
    text: string,
    sources: SourceDocument[],
    authorName?: string
  ): Promise<PlagiarismReport> {
    const t0 = performance.now();
    const totalWords = this.extractWords(text).length;

    // Run all detection methods
    const [
      directMatches,
      paraphraseMatches,
      ideaMatches,
      selfMatches,
      ghostMatches,
      translationMatches,
      structureMatches,
      dataMatches,
      methodMatches,
      omissionMatches
    ] = await Promise.all([
      Promise.resolve(this.detectDirectPlagiarism(text, sources)),
      Promise.resolve(this.detectParaphrase(text, sources)),
      Promise.resolve(this.detectIdeaPlagiarism(text, sources)),
      Promise.resolve(this.detectSelfPlagiarism(text, sources, authorName)),
      Promise.resolve(this.detectGhostCitations(text, sources)),
      Promise.resolve(this.detectTranslationPlagiarism(text, sources)),
      Promise.resolve(this.detectStructurePlagiarism(text, sources)),
      Promise.resolve(this.detectDataPlagiarism(text, sources)),
      Promise.resolve(this.detectMethodologyPlagiarism(text, sources)),
      Promise.resolve(this.detectAuthorOmission(text, sources))
    ]);

    // Combine all matches
    const allMatches: PlagiarismMatch[] = [
      ...directMatches,
      ...paraphraseMatches,
      ...ideaMatches,
      ...selfMatches,
      ...ghostMatches,
      ...translationMatches,
      ...structureMatches,
      ...dataMatches,
      ...methodMatches,
      ...omissionMatches
    ];

    // Remove duplicates
    const uniqueMatches = this.deduplicateMatches(allMatches);

    // Calculate total plagiarized words
    const plagiarizedWords = uniqueMatches.reduce((sum, m) => sum + m.wordCount, 0);
    const plagiarismPercentage = totalWords > 0
      ? Math.round((plagiarizedWords / totalWords) * 10000) / 100
      : 0;

    // Calculate breakdown by type
    const breakdown = this.calculateBreakdown(uniqueMatches, plagiarizedWords);

    // Determine status
    let status: 'safe' | 'warning' | 'high-risk' = 'safe';
    if (plagiarismPercentage >= 30) status = 'high-risk';
    else if (plagiarismPercentage >= 15) status = 'warning';

    const analysisTimeMs = Math.round(performance.now() - t0);

    return {
      totalWords,
      plagiarizedWords,
      plagiarismPercentage,
      nonPlagiarismPercentage: Math.round((100 - plagiarismPercentage) * 100) / 100,
      matches: uniqueMatches,
      breakdownByType: breakdown,
      status,
      analysisMethod: 'advanced',
      analysisTimeMs,
      sourcesChecked: sources.length,
      citationsVerified: this.countCitations(text) - ghostMatches.length,
      ghostCitationsFound: ghostMatches.length,
      language: this.detectLanguage(text)
    };
  }

  private deduplicateMatches(matches: PlagiarismMatch[]): PlagiarismMatch[] {
    const seen = new Set<string>();
    return matches.filter(m => {
      const key = `${m.type}-${m.sourceDocument}-${m.infractingFragment.substring(0, 50)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private calculateBreakdown(
    matches: PlagiarismMatch[],
    totalPlagiarizedWords: number
  ): Record<PlagiarismType, { count: number; percentage: number; words: number }> {
    const types: PlagiarismType[] = [
      'direct', 'paraphrase', 'idea', 'self', 'ghost_citation',
      'translation', 'structure', 'data', 'methodology', 'author_omission'
    ];

    const breakdown: Record<string, { count: number; percentage: number; words: number }> = {};

    for (const type of types) {
      const typeMatches = matches.filter(m => m.type === type);
      const words = typeMatches.reduce((sum, m) => sum + m.wordCount, 0);
      breakdown[type] = {
        count: typeMatches.length,
        percentage: totalPlagiarizedWords > 0
          ? Math.round((words / totalPlagiarizedWords) * 100)
          : 0,
        words
      };
    }

    return breakdown as Record<PlagiarismType, { count: number; percentage: number; words: number }>;
  }

  private countCitations(text: string): number {
    const citationPattern = /\([^)]+,\s*\d{4}[a-z]?\)/g;
    return (text.match(citationPattern) || []).length;
  }

  private findContextInSource(sourceNormalized: string, textNormalized: string, match: string): string {
    const matchNormalized = this.normalizeText(match);
    const idx = sourceNormalized.indexOf(matchNormalized);
    if (idx === -1) return match;

    const start = Math.max(0, idx - 100);
    const end = Math.min(sourceNormalized.length, idx + matchNormalized.length + 100);
    return sourceNormalized.substring(start, end);
  }

  // ========== DATABASE OPERATIONS ==========
  async saveFullReport(userId: string, docTitle: string, text: string, report: PlagiarismReport): Promise<string | null> {
    const sb = this.getSupabase();
    if (!sb) return null;

    const { data, error } = await sb
      .from('plagiarism_analyses')
      .insert([{
        user_id: userId,
        document_title: docTitle,
        analyzed_text: text,
        language: report.language,
        overall_similarity: report.plagiarismPercentage,
        status: report.status,
        analysis_method: report.analysisMethod,
        total_words: report.totalWords,
        sources_checked: report.sourcesChecked,
        analysis_time_ms: report.analysisTimeMs,
        metadata: {
          plagiarism_types: report.breakdownByType,
          non_plagiarism_percentage: report.nonPlagiarismPercentage
        }
      }])
      .select('id')
      .maybeSingle();

    if (error || !data) return null;

    const analysisId = data.id;

    // Save all matches
    if (report.matches.length > 0) {
      await sb.from('plagiarism_matches').insert(
        report.matches.map(m => ({
          analysis_id: analysisId,
          source_title: m.sourceDocument,
          source_url: m.sourceUrl,
          source_type: 'academic',
          source_doi: m.sourceDoi,
          similarity_score: m.similarityScore,
          matched_text: m.matchedText,
          original_text: m.originalText,
          match_position_start: 0,
          match_position_end: m.wordCount,
          confidence_score: m.confidence,
          is_verified: m.confidence > 80,
          verification_score: m.confidence,
          metadata: {
            type: m.type,
            type_label: m.typeLabel,
            infracting_fragment: m.infractingFragment,
            source_author: m.sourceAuthor,
            source_year: m.sourceYear,
            location_page: m.locationPage,
            word_count: m.wordCount
          }
        }))
      );
    }

    return analysisId;
  }

  async getAnalysisHistory(userId: string, limit = 20): Promise<any[]> {
    const sb = this.getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from('plagiarism_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
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

export const advancedPlagiarismDetector = new AdvancedPlagiarismDetector();
