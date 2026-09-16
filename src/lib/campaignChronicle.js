/**
 * lib/campaignChronicle.js — client side of the AI campaign chronicle.
 *
 * Builds the deterministic grounding from the campaign's Wizard News +
 * world state, then POSTs it to the `generate-chronicle` edge function (which
 * holds the Anthropic key). The browser never calls Anthropic directly — this
 * only ever fetches our own endpoint (enforced by clientAiBoundary.contract).
 */

import { buildChronicleGrounding } from '../domain/worldPulse/chronicle.js';
import { supabase, isConfigured } from './supabase.js';

/**
 * Request a prose chronicle for a campaign tick.
 * @param {Object} args
 * @param {any} [args.campaign] the campaign (reads worldState + wizardNews)
 * @param {any} [args.snapshot] a world snapshot (for settlement names/conditions)
 * @param {number} [args.tick]  restrict to a tick (default: latest)
 * @returns {Promise<{ chronicle?: string, creditsRemaining?: number, error?: string, grounding?: any }>}
 */
export async function requestCampaignChronicle({ campaign, snapshot, tick = null } = /** @type {{ campaign?: any, snapshot?: any, tick?: number|null }} */ ({})) {
  // TOTAL: everything runs inside the try so this helper ALWAYS resolves to a
  // { chronicle? , error? } object and never rejects. buildChronicleGrounding
  // and supabase.auth.getSession() can throw; a rejection here previously
  // propagated to the caller's bare await and left the paid Chronicle button
  // stuck busy forever (correctness-2).
  let grounding;
  try {
    grounding = buildChronicleGrounding({
      wizardNews: campaign?.wizardNews,
      worldState: campaign?.worldState,
      snapshot,
      // §S3 — the live regional graph names the siege coalition + trade-war
      // commodity in the grounding. Prefer the snapshot's graph (post-pulse), fall
      // back to the campaign's stored one. Absent ⇒ the war story is simply omitted.
      regionalGraph: snapshot?.regionalGraph || campaign?.regionalGraph,
      tick,
    });

    if (!isConfigured) {
      return { error: 'chronicle endpoint not configured', grounding };
    }

    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) return { error: 'Sign in to generate a chronicle', grounding };

    const { data: body, error } = await supabase.functions.invoke('generate-chronicle', {
      body: { grounding },
    });
    if (error) return { error: error.message || 'Chronicle failed', grounding };
    return { chronicle: body?.chronicle, creditsRemaining: body?.creditsRemaining, grounding };
  } catch (e) {
    return { error: `Chronicle unavailable — ${e?.message || e}`, grounding };
  }
}

export { buildChronicleGrounding };
