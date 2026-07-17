import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/admin-management/, "");

    // POST /seed — create alainr admin (NO auth check — idempotent bootstrap)
    if (path === "/seed" && req.method === "POST") {
      const email = "alainr@administrador.uci.cu";
      const password = "123456";

      // Check if exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u) => u.email === email);

      let userId: string;
      if (existing) {
        userId = existing.id;
        // Ensure password is correct
        await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: "alainr", department: "Computer Science", role: "admin" },
        });
        if (createError) throw createError;
        userId = newUser.user!.id;
      }

      // Upsert profile
      await supabaseAdmin.from("user_profiles").upsert({
        id: userId,
        name: "alainr",
        department: "Computer Science",
        role: "admin",
      }, { onConflict: "id" });

      return new Response(JSON.stringify({ success: true, userId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller is admin for all other endpoints
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check caller role
    const { data: callerProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("role")
      .eq("id", caller.id)
      .maybeSingle();

    const isAdmin = callerProfile?.role === "admin";

    // GET /users — list all users with profiles (admin only)
    if (path === "/users" && req.method === "GET") {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
      const { data: profiles } = await supabaseAdmin.from("user_profiles").select("*");
      const { data: sessions } = await supabaseAdmin
        .from("active_sessions")
        .select("user_id, login_at, last_seen");

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      const sessionMap = new Map((sessions ?? []).map((s) => [s.user_id, s]));

      const users = (authUsers?.users ?? []).map((u) => {
        const profile = profileMap.get(u.id);
        const session = sessionMap.get(u.id);
        return {
          id: u.id,
          email: u.email ?? "",
          name: profile?.name ?? u.user_metadata?.name ?? u.email?.split("@")[0] ?? "Usuario",
          department: profile?.department ?? u.user_metadata?.department ?? "General",
          role: profile?.role ?? u.user_metadata?.role ?? "lector",
          created_at: u.created_at,
          session: session ?? null,
        };
      });

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /users/:id/role — promote/demote user (admin only)
    if (path.match(/^\/users\/[^/]+\/role$/) && req.method === "PUT") {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const targetId = path.split("/")[2];
      const { role } = await req.json();

      if (!["admin", "lector"].includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabaseAdmin.from("user_profiles").upsert(
        { id: targetId, role, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

      // Also update auth metadata
      await supabaseAdmin.auth.admin.updateUserById(targetId, {
        user_metadata: { role },
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /sessions/:userId — kick user session (admin only)
    if (path.match(/^\/sessions\/[^/]+$/) && req.method === "DELETE") {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const targetId = path.split("/")[2];
      await supabaseAdmin.from("active_sessions").delete().eq("user_id", targetId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
