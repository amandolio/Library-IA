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

interface RepoResult {
  source: string;
  matches: Array<{ title: string; similarity: number; url: string; doi?: string }>;
}

async function fetchCrossRef(query: string): Promise<RepoResult> {
  try {
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`;
    const res = await fetch(url, { headers: { "User-Agent": "UniversityLibraryAI/1.0" } });
    const data = await res.json();
    const matches = (data.message?.items || []).map((item: any) => ({
      title: item.title?.[0] || "Sin título",
      similarity: 85,
      url: item.URL || `https://doi.org/${item.DOI}`,
      doi: item.DOI,
    }));
    return { source: "CrossRef", matches };
  } catch {
    return { source: "CrossRef", matches: [] };
  }
}

async function fetchSemanticScholar(query: string): Promise<RepoResult> {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=5&fields=title,url,externalIds`;
    const res = await fetch(url);
    const data = await res.json();
    const matches = (data.data || []).map((item: any) => ({
      title: item.title || "Sin título",
      similarity: 80,
      url: item.url || "",
      doi: item.externalIds?.DOI,
    }));
    return { source: "Semantic Scholar", matches };
  } catch {
    return { source: "Semantic Scholar", matches: [] };
  }
}

async function fetchArxiv(query: string): Promise<RepoResult> {
  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5`;
    const res = await fetch(url);
    const xml = await res.text();
    const entries = xml.match(/<title>([\s\S]*?)<\/title>/g) || [];
    const links = xml.match(/<id>([\s\S]*?)<\/id>/g) || [];
    const matches: Array<{ title: string; similarity: number; url: string }> = [];
    for (let i = 1; i < entries.length && matches.length < 5; i++) {
      const title = entries[i].replace(/<\/?title>/g, "").trim();
      const link = links[i]?.replace(/<\/?id>/g, "").trim() || "";
      matches.push({ title, similarity: 75, url: link });
    }
    return { source: "arXiv", matches };
  } catch {
    return { source: "arXiv", matches: [] };
  }
}

async function checkRepositories(text: string): Promise<RepoResult[]> {
  const words = text.split(/\s+/);
  const query = words.slice(0, Math.min(50, words.length)).join(" ");
  const results = await Promise.all([
    fetchCrossRef(query),
    fetchSemanticScholar(query),
    fetchArxiv(query),
  ]);
  return results.filter((r) => r.matches.length > 0);
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

    let repositoryResults: RepoResult[] = [];
    if (body.checkRepositories) {
      repositoryResults = await checkRepositories(body.text);
    }

    return new Response(
      JSON.stringify({
        documentTitle: body.documentTitle,
        language: body.language,
        repositoryResults,
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
