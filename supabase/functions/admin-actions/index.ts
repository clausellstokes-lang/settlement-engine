/**
 * admin-actions — Edge function for developer/admin operations.
 *
 * Actions:
 *   update_user_metadata — Update a user's auth metadata (tier, role)
 *   update_user_credits  — Adjust a user's credit balance
 *   list_users           — List all users (with profiles)
 *   get_stats            — System-wide statistics
 *
 * Authorization: Only users with role='developer' or role='admin'
 * in the profiles table can invoke this function.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Tier 0.10 — abuse defense baseline (shared with every edge function).
import { botGuard } from "../_shared/requestMeta.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Tier 0.10 — obvious-bot guard. Admin actions are role-gated, but
  // bots probing for admin endpoints should be rejected at the door.
  const guard = botGuard(req, "admin-actions");
  if (guard.reject) return guard.reject;

  try {
    // Get the user's JWT from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check that the calling user has an elevated role
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", callingUser.id)
      .single();

    if (
      !callerProfile ||
      !["developer", "admin"].includes(callerProfile.role)
    ) {
      return new Response(JSON.stringify({ error: "Insufficient privileges" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const { action, userId, metadata, credits } = await req.json();

    switch (action) {
      case "update_user_metadata": {
        if (!userId || !metadata) {
          return new Response(
            JSON.stringify({ error: "Missing userId or metadata" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Update user metadata via admin API
        const { error: updateError } =
          await adminClient.auth.admin.updateUserById(userId, {
            user_metadata: metadata,
          });

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_user_credits": {
        if (!userId || credits === undefined) {
          return new Response(
            JSON.stringify({ error: "Missing userId or credits" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Tier 9.9 audit plan #2 — keep the SET semantics admin tooling
        // expects, but record the underlying delta as a credit_ledger
        // entry so the audit trail stays continuous. Three-step:
        //   1. Read current credits.
        //   2. Compute delta = newValue - currentValue.
        //   3. Insert a ledger row reflecting the change direction.
        //   4. SET the new value (atomic — the read could be stale
        //      under concurrent admin actions, but the ledger row
        //      makes the change auditable either way).
        //
        // A more elegant migration to admin_grant_credits would require
        // a paired admin_revoke_credits RPC (currently missing). When
        // that lands, this branch should route through the two RPCs
        // and drop the direct SET entirely.

        const newCredits = parseInt(String(credits), 10);

        const { data: current } = await adminClient
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();

        const prevCredits = (current && typeof current.credits === "number") ? current.credits : 0;
        const delta = newCredits - prevCredits;

        // Write a ledger row for the delta. We use grant/spend kinds
        // depending on direction; source='admin_set' so reporting can
        // distinguish from organic grants.
        if (delta !== 0) {
          const { error: ledgerErr } = await adminClient.from("credit_ledger").insert({
            user_id: userId,
            kind:    delta > 0 ? "grant" : "spend",
            amount:  Math.abs(delta),
            source:  "admin_set",
            metadata: { actor_id: user.id, prev: prevCredits, next: newCredits },
          });
          if (ledgerErr) {
            console.warn("[admin-actions] credit_ledger write failed; continuing with direct SET:", ledgerErr.message);
          }
        }

        const { error: creditError } = await adminClient
          .from("profiles")
          .update({ credits: newCredits })
          .eq("id", userId);

        if (creditError) {
          return new Response(JSON.stringify({ error: creditError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Audit row capturing actor + before/after.
        await adminClient.rpc("_audit_action", {
          p_actor_id: user.id,
          p_target_id: userId,
          p_action: "admin_set_credits",
          p_before: { credits: prevCredits },
          p_after:  { credits: newCredits, delta },
          p_reason: null,
        }).catch((e: unknown) => {
          // _audit_action is internal — catch is best-effort.
          console.warn("[admin-actions] _audit_action failed:", (e as Error)?.message);
        });

        return new Response(JSON.stringify({ success: true, prev: prevCredits, next: newCredits, delta }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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

        return new Response(
          JSON.stringify({
            total,
            premiumCount,
            totalCredits,
            developerCount,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
