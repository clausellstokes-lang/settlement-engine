// deno-lint-ignore-file no-import-prefix
/**
 * Public one-click unsubscribe endpoint for announcement email.
 *
 * GET is confirmation-only and never mutates. POST is the sole mutation path,
 * including RFC 8058 clients posting `List-Unsubscribe=One-Click`. The bearer
 * token can only turn an allowed category off through migration 194's
 * service-role-only opt-out RPC, so no login or platform JWT is expected.
 */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { getCorsHeaders } from "../_shared/cors.ts";

const ALLOWED_CATEGORIES = new Set(["product_updates", "referral", "lifecycle", "all"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function defaultClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

type UnsubscribeClient = ReturnType<typeof defaultClient>;

function headers(req: Request, contentType: string) {
  return {
    ...getCorsHeaders(req),
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    "X-Content-Type-Options": "nosniff",
  };
}

function page(title: string, message: string, formAction?: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;background:#f3ead8;color:#211a14;font:16px/1.55 system-ui,sans-serif}main{max-width:38rem;margin:12vh auto;padding:2rem;border:1px solid #b99a61;background:#fffaf0}h1{font:600 1.55rem Georgia,serif}button{padding:.7rem 1rem;border:1px solid #6f1818;background:#8f2323;color:white;font-weight:700;cursor:pointer}</style></head>
<body><main><h1>${title}</h1><p>${message}</p>${formAction ? `<form method="post" action="${formAction}"><button type="submit">Unsubscribe</button></form>` : ""}</main></body></html>`;
}

function requestParams(url: URL) {
  const token = url.searchParams.get("token") || "";
  const category = url.searchParams.get("category") || "product_updates";
  return {
    token: UUID_RE.test(token) ? token : null,
    category: ALLOWED_CATEGORIES.has(category) ? category : null,
  };
}

export async function handleUnsubscribe(
  req: Request,
  deps: { client?: () => UnsubscribeClient } = {},
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, reason: "method_not_allowed" }), {
      status: 405,
      headers: headers(req, "application/json"),
    });
  }

  const url = new URL(req.url);
  const { token, category } = requestParams(url);
  if (!token || !category) {
    return new Response(page("Invalid unsubscribe link", "This unsubscribe link is not valid."), {
      status: 400,
      headers: headers(req, "text/html; charset=utf-8"),
    });
  }

  if (req.method === "GET") {
    const action = `${url.pathname}?token=${encodeURIComponent(token)}&category=${encodeURIComponent(category)}`;
    return new Response(page(
      "Unsubscribe from SettlementForge email",
      "Confirm that you no longer want this category of optional email. Account and service notices remain available in Account Messages.",
      action,
    ), { status: 200, headers: headers(req, "text/html; charset=utf-8") });
  }

  const client = (deps.client ?? defaultClient)();
  const { data, error } = await client.rpc("unsubscribe_via_token", {
    p_token: token,
    p_category: category,
  });
  if (error) {
    console.error("[unsubscribe] RPC failed:", error.message);
    return new Response(page("Unsubscribe unavailable", "We could not update your preference. Please try again from Account settings."), {
      status: 503,
      headers: headers(req, "text/html; charset=utf-8"),
    });
  }
  const ok = data === true;
  return new Response(page(
    ok ? "You are unsubscribed" : "Link not found",
    ok
      ? "Your email preference was updated. Messages already saved in your account remain available."
      : "This link no longer matches an account. No preference was changed.",
  ), {
    status: ok ? 200 : 404,
    headers: headers(req, "text/html; charset=utf-8"),
  });
}

serve((req) => handleUnsubscribe(req));
