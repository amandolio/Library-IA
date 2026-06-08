import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  text: string;
  documentTitle: string;
  language: string;
  method: string;
  checkRepositories: boolean;
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

async function fetchCrossRef(query: string): Promise<RepoDocument[]> {
  try {
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=8&sort=relevance&select=DOI,title,abstract,author,published,URL`;
    const res = await fetch(url, {
      headers: { "User-Agent": "LibraryAI/1.0 (mailto:contact@libraryai.edu)" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.message?.items || []).map((item: any) => ({
      title: Array.isArray(item.title) ? item.title[0] : (item.title || "Sin título"),
      author: item.author?.map((a: any) => `${a.given ?? ""} ${a.family ?? ""}`.trim()).filter(Boolean).join(", ") || "Desconocido",
      year: item.published?.["date-parts"]?.[0]?.[0] || new Date().getFullYear(),
      abstract: item.abstract?.replace(/<[^>]+>/g, " ").trim() || "",
      url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : ""),
      doi: item.DOI,
      source: "CrossRef",
    }));
  } catch {
    return [];
  }
}

async function fetchSemanticScholar(query: string): Promise<RepoDocument[]> {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=8&fields=title,abstract,authors,year,url,externalIds`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((item: any) => ({
      title: item.title || "Sin título",
      author: item.authors?.map((a: any) => a.name).join(", ") || "Desconocido",
      year: item.year || new Date().getFullYear(),
      abstract: item.abstract || "",
      url: item.url || "",
      doi: item.externalIds?.DOI,
      source: "Semantic Scholar",
    }));
  } catch {
    return [];
  }
}

async function fetchArxiv(query: string): Promise<RepoDocument[]> {
  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=8&sortBy=relevance&sortOrder=descending`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();

    const entries: RepoDocument[] = [];
    const entryMatches = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);

    for (const match of entryMatches) {
      const entry = match[1];
      const title = (entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Sin título").trim().replace(/\s+/g, " ");
      const summary = (entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? "").trim().replace(/\s+/g, " ");
      const id = (entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? "").trim();
      const authorNames = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map(m => m[1].trim());
      const published = (entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] ?? "").trim();
      const year = published ? new Date(published).getFullYear() : new Date().getFullYear();

      entries.push({
        title,
        author: authorNames.slice(0, 3).join(", ") || "Desconocido",
        year,
        abstract: summary,
        url: id,
        source: "arXiv",
      });
    }

    return entries;
  } catch {
    return [];
  }
}

async function fetchOpenLibrary(query: string): Promise<RepoDocument[]> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=6&fields=key,title,author_name,first_publish_year,subject`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.docs || []).map((item: any) => ({
      title: item.title || "Sin título",
      author: item.author_name?.slice(0, 2).join(", ") || "Desconocido",
      year: item.first_publish_year || new Date().getFullYear(),
      abstract: item.subject?.slice(0, 5).join("; ") || "",
      url: `https://openlibrary.org${item.key}`,
      source: "Open Library",
    }));
  } catch {
    return [];
  }
}

async function checkRepositories(text: string): Promise<{ source: string; documents: RepoDocument[] }[]> {
  const words = text.split(/\s+/);
  const query = words.slice(0, Math.min(40, words.length)).join(" ");

  const [crossRef, semantic, arxiv, openLib] = await Promise.allSettled([
    fetchCrossRef(query),
    fetchSemanticScholar(query),
    fetchArxiv(query),
    fetchOpenLibrary(query),
  ]);

  const results: { source: string; documents: RepoDocument[] }[] = [
    { source: "CrossRef", documents: crossRef.status === "fulfilled" ? crossRef.value : [] },
    { source: "Semantic Scholar", documents: semantic.status === "fulfilled" ? semantic.value : [] },
    { source: "arXiv", documents: arxiv.status === "fulfilled" ? arxiv.value : [] },
    { source: "Open Library", documents: openLib.status === "fulfilled" ? openLib.value : [] },
  ];

  return results;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: AnalysisRequest = await req.json();
    if (!body.text || !body.documentTitle) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let repositoryResults: { source: string; documents: RepoDocument[] }[] = [];
    if (body.checkRepositories) {
      repositoryResults = await checkRepositories(body.text);
    }

    const allDocuments = repositoryResults.flatMap(r => r.documents);

    return new Response(
      JSON.stringify({
        documentTitle: body.documentTitle,
        language: body.language,
        repositoryResults,
        allDocuments,
        totalFound: allDocuments.length,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
