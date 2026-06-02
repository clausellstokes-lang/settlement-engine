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

const CHRONICLE_URL = import.meta.env.VITE_GENERATE_CHRONICLE_URL;

/**
 * Request a prose chronicle for a campaign tick.
 * @param {Object} args
 * @param {any} args.campaign   the campaign (reads worldState + wizardNews)
 * @param {any} [args.snapshot] a world snapshot (for settlement names/conditions)
 * @param {number} [args.tick]  restrict to a tick (default: latest)
 * @returns {Promise<{ chronicle?: string, creditsRemaining?: number, error?: string, grounding?: any }>}
 */
export async function requestCampaignChronicle({ campaign, snapshot, tick = null } = {}) {
  const grounding = buildChronicleGrounding({
    wizardNews: campaign?.wizardNews,
    worldState: campaign?.worldState,
    snapshot,
    tick,
  });

  if (!isConfigured || !CHRONICLE_URL) {
    // No backend wired — return the grounding so a caller can preview or the
    // UI can show a "configure VITE_GENERATE_CHRONICLE_URL" hint.
    return { error: 'chronicle endpoint not configured', grounding };
  }

  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) return { error: 'Sign in to generate a chronicle', grounding };

  let resp;
  try {
    resp = await fetch(CHRONICLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ grounding }),
    });
  } catch (e) {
    return { error: `Network error: ${e?.message || e}`, grounding };
  }

  const body = await resp.json().catch(() => ({}));
  if (!resp.ok) return { error: body.error || `Chronicle failed (${resp.status})`, grounding };
  return { chronicle: body.chronicle, creditsRemaining: body.creditsRemaining, grounding };
}

export { buildChronicleGrounding };
