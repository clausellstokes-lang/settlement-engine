/**
 * admin-actions - Edge function for developer/admin operations.
 *
 * Actions:
 *   update_user_metadata - Update profile-backed auth metadata (tier, role)
 *   update_user_credits  - Set a user's credit balance through the ledger
 *   list_users           - List all users (with profiles)
 *   get_stats            - System-wide statistics
 *
 * Authorization: Only users with role='developer' or role='admin'
 * in the profiles table can invoke this function.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Tier 0.10 - abuse defense baseline (shared with every edge function).
import { botGuard } from "../_shared/requestMeta.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const ALLOWED_ROLES = ["user", "developer", "admin"];
const ALLOWED_TIERS = ["free", "premium"];
const ALLOWED_METADATA_KEYS = ["role", "tier", "display_name", "is_founder"];
const OWNER_EMAIL = "clausellstokes@aol.com";

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(record: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function buildProfilePatch(metadata: Record<string, unknown>) {
  const unsupported = Object.keys(metadata).filter((key) =>
    !ALLOWED_METADATA_KEYS.includes(key)
  );
  if (unsupported.length) {
    throw new Error(`Unsupported metadata keys: ${unsupported.join(", ")}`);
  }

  const patch: Record<string, unknown> = {};

  if (hasOwn(metadata, "role")) {
    const role = String(metadata.role);
    if (!ALLOWED_ROLES.includes(role)) throw new Error(`Invalid role: ${role}`);
    patch.role = role;
  }

  if (hasOwn(metadata, "tier")) {
    const tier = String(metadata.tier);
    if (!ALLOWED_TIERS.includes(tier)) throw new Error(`Invalid tier: ${tier}`);
    patch.tier = tier;
  }

  if (hasOwn(metadata, "display_name")) {
    const rawName = metadata.display_name;
    if (rawName === null || rawName === undefined) {
      patch.display_name = null;
    } else {
      const displayName = String(rawName).trim();
      if (displayName.length > 64) {
        throw new Error("display_name too long (max 64 chars)");
      }
      patch.display_name = displayName || null;
    }
  }

  if (hasOwn(metadata, "is_founder")) {
    if (typeof metadata.is_founder !== "boolean") {
      throw new Error("is_founder must be boolean");
    }
    patch.is_founder = metadata.is_founder;
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("No supported metadata keys supplied");
  }

  return patch;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Tier 0.10 - obvious-bot guard. Admin actions are role-gated, but
  // bots probing for admin endpoints should be rejected at the door.
  const guard = botGuard(req, "admin-actions");
  if (guard.reject) return guard.reject;

  try {
    // Get the user's JWT from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    // Create a client with the user's JWT to verify their identity
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the calling user
    const {
      data: { user: callingUser },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !callingUser) {
      return json({ error: "Invalid token" }, 401);
    }

    // Check that the calling user has an elevated role
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("role, email")
      .eq("id", callingUser.id)
      .single();

    const callerEmail = String(callingUser.email || callerProfile?.email || "")
      .trim()
      .toLowerCase();
    if (
      callerEmail !== OWNER_EMAIL &&
      (!callerProfile || !["developer", "admin"].includes(callerProfile.role))
    ) {
      return json({ error: "Insufficient privileges" }, 403);
    }

    // Parse the request body
    const { action, userId, metadata, credits, reason } = await req.json();
    const auditReason = typeof reason === "string" && reason.trim()
      ? reason.trim()
      : null;

    switch (action) {
      case "update_user_metadata": {
        if (!userId || !metadata) {
          return json({ error: "Missing userId or metadata" }, 400);
        }
        if (!isRecord(metadata)) {
          return json({ error: "metadata must be an object" }, 400);
        }

        let profilePatch: Record<string, unknown>;
        try {
          profilePatch = buildProfilePatch(metadata);
        } catch (e) {
          return json({ error: errorMessage(e) }, 400);
        }

        const { data: profileResult, error: profileError } =
          await adminClient.rpc("service_update_profile_metadata", {
            actor_user: callingUser.id,
            target_user: userId,
            profile_patch: profilePatch,
            reason: auditReason,
          });

        if (profileError) {
          return json({ error: profileError.message }, 500);
        }

        // profiles is the source of truth; auth metadata is a compatibility
        // mirror for legacy JWT/display-name surfaces.
        const { error: mirrorError } =
          await adminClient.auth.admin.updateUserById(userId, {
            user_metadata: profilePatch,
          });

        if (mirrorError) {
          console.warn("[admin-actions] user_metadata mirror failed:", mirrorError.message);
          return json({
            success: true,
            profile: profileResult,
            warning: "Profile updated, but auth metadata mirror failed",
          });
        }

        return json({ success: true, profile: profileResult });
      }

      case "list_users": {
        const rawSearch = typeof metadata?.search === "string"
          ? metadata.search.trim()
          : "";

        let query = adminClient
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (rawSearch) {
          query = query.or(`email.ilike.%${rawSearch}%,display_name.ilike.%${rawSearch}%`);
        }

        const { data, error } = await query;
        if (error) return json({ error: error.message }, 500);

        return json({ users: data || [] });
      }

      case "update_user_credits": {
        if (!userId || credits === undefined) {
          return json({ error: "Missing userId or credits" }, 400);
        }

        const newCredits = parseInt(String(credits), 10);
        if (!Number.isFinite(newCredits) || Number.isNaN(newCredits) || newCredits < 0) {
          return json({ error: "credits must be a non-negative integer" }, 400);
        }

        const { data: result, error: creditError } =
          await adminClient.rpc("service_set_credits", {
            actor_user: callingUser.id,
            target_user: userId,
            new_credits: newCredits,
            reason: auditReason,
          });

        if (creditError) {
          return json({ error: creditError.message }, 500);
        }

        return json({ success: true, ...(result || {}) });
      }

      case "get_stats": {
        const { data: profiles } = await adminClient
          .from("profiles")
          .select("tier, role, credits");

        const total = profiles?.length || 0;
        const premiumCount =
          profiles?.filter((p: any) => p.tier === "premium").length || 0;
        const totalCredits =
          profiles?.reduce((sum: number, p: any) => sum + (p.credits || 0), 0) ||
          0;
        const developerCount =
          profiles?.filter((p: any) =>
            ["developer", "admin"].includes(p.role)
          ).length || 0;

        return json({
          total,
          premiumCount,
          totalCredits,
          developerCount,
        });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    return json({ error: errorMessage(err) }, 500);
  }
});
