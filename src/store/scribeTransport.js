/**
 * store/scribeTransport.js — THE TRANSPORT, and the only module that turns a decision into money.
 *
 * The OPEN decides a render is owed (`scribeOpenTrigger.js`); this sends it. It is reached ONLY by
 * dynamic import and it registers itself with `lib/scribeRenderer.js`, so the trigger never names
 * it and the edge client cannot be pulled into the dossier's chunk by a static edge.
 *
 * ⭐ ONE INVOCATION PER TAB (design §6). A settlement is ~57-68 firing pools across its tabs, and
 * one invocation is bounded by the edge's 55 s budget, so the render is split the way the reader
 * consumes it: each tab is its own call, its own credited spend decision on the server, and its
 * own landing. A tab that lands swaps its blocks immediately; a tab that fails leaves the hand
 * corpus standing and costs the reader nothing but a retry on the next open.
 *
 * ⛔ NO PROVIDER CALL FROM THE CLIENT, EVER. This module POSTs a card to `scribe-render` and reads
 * a structured answer back. It holds no key, names no model and knows no prompt: the brief, the
 * model, the refuter and the money all live server-side, where a forged card can harm only the
 * forger's own prose.
 *
 * ⛔ WHAT THE CLIENT SENDS IS A CARD, NOT A SETTLEMENT. `townCard` collapses the town to the facts
 * the page already draws, which is both smaller and narrower than the blob: no seed, no config, no
 * covert field the page does not already read.
 */

import { supabase, isConfigured } from '../lib/supabase.js';
import { setScribeRenderer } from '../lib/scribeRenderer.js';
import { attachProse, landBlock, proseOf } from '../lib/scribeArtefact.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** One tab call's ceiling. The edge's own budget is 55 s; this is the client's patience. */
const TAB_TIMEOUT_MS = 90_000;

/**
 * The bearer token, read the way `lib/ai.js` reads it. A render is a credited call, so an
 * unauthenticated one is refused here rather than bounced off the edge.
 * @returns {Promise<string|null>}
 */
async function accessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  } catch {
    return null;
  }
}

/**
 * The tabs a render covers. Every tab whose page actually composes a line, in the card builder's
 * own order, so the set is a fact about the town rather than a list to maintain.
 * @param {object} settlement @param {Function} renderTabPage @param {ReadonlyArray<string>} tabs
 * @returns {string[]}
 */
export function firingTabs(settlement, renderTabPage, tabs) {
  const out = [];
  for (const tab of tabs) {
    let lines;
    try { lines = renderTabPage(settlement, tab, { audience: 'dm' }) || []; } catch { lines = []; }
    if (lines.some((line) => line && line.kind === 'composed')) out.push(tab);
  }
  return out;
}

/**
 * POST one tab's card and read the structured answer.
 * @param {object} body @param {string} token @param {typeof fetch} [fetchImpl]
 * @returns {Promise<{ok: boolean, status: number, data: object|null}>}
 */
export async function postTabRender(body, token, fetchImpl = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TAB_TIMEOUT_MS);
  try {
    const res = await fetchImpl(`${SUPABASE_URL}/functions/v1/scribe-render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok && data?.ok === true, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * ⭐ LAND ONE TAB'S ANSWER ON A SETTLEMENT. Pure: takes the settlement and the answer, returns a
 * new settlement. A block at a time, through the artefact's one writer, so a partially rendered
 * settlement is a lawful settlement whose unrendered pools draw the hand corpus.
 * @param {object} settlement @param {object} answer @param {object} keys
 * @returns {object}
 */
export function landTabAnswer(settlement, answer, keys) {
  const blocks = answer && typeof answer.blocks === 'object' ? answer.blocks : null;
  if (!blocks) return settlement;
  let prose = proseOf(settlement);
  for (const blockId of Object.keys(blocks).sort()) {
    prose = landBlock(prose, {
      advanceSeq: keys.advanceSeq,
      blockId,
      pools: blocks[blockId],
      renderedFor: keys.renderedFor,
      renderedAt: keys.renderedAt,
      version: keys.version,
      limit: keys.limit,
    });
  }
  return prose ? attachProse(settlement, prose) : settlement;
}

/**
 * ⭐ THE RENDERER the trigger calls. Builds a card per firing tab, sends each, lands what comes
 * back, and persists ONCE at the end through the ordinary save outbox — `saves.js` writes the
 * settlement wholesale into `data`, so the artefact needs no column, no migration and no new call
 * site. Returns `{ok}` so the trigger's session ledger knows whether to hold the slot.
 *
 * @param {{saveId: string, advanceSeq: number, renderedFor: string, engineVersion: string,
 *   settlement: object, guidance: string}} request
 * @returns {Promise<{ok: boolean, reason?: string, tabs?: number, landed?: number}>}
 */
export async function renderScribe(request) {
  if (!isConfigured) return { ok: false, reason: 'offline' };
  const token = await accessToken();
  if (!token) return { ok: false, reason: 'unauthenticated' };

  const [{ townCard }, { renderTabPage, SCRIBE_TABS }, { persistSaveUpdate }, store] = await Promise.all([
    import('../domain/prose/townCard.js'),
    import('../domain/prose/scribePage.js'),
    import('./campaignSliceShared.js'),
    import('./index.js'),
  ]);

  const settlement = request?.settlement;
  if (!settlement) return { ok: false, reason: 'no-settlement' };
  const tabs = firingTabs(settlement, renderTabPage, SCRIBE_TABS);
  if (tabs.length === 0) return { ok: false, reason: 'no-tabs' };

  const keys = {
    advanceSeq: request.advanceSeq,
    renderedFor: request.renderedFor,
    renderedAt: new Date().toISOString(),
    version: { scribe: null, engine: request.engineVersion, refuter: null, model: null },
  };

  let next = settlement;
  let landed = 0;
  for (const tab of tabs) {
    let card;
    try { card = townCard(settlement, { tab, audience: 'dm' }); } catch { card = null; }
    if (!card || !Array.isArray(card.pools) || card.pools.length === 0) continue;
    const sent = await postTabRender({
      saveId: request.saveId,
      advanceSeq: request.advanceSeq,
      renderedFor: request.renderedFor,
      engineVersion: request.engineVersion,
      tab,
      card,
      // ⛔ THE EPOCH RECORD IS NOT SENT IN W2, AND THAT IS A KNOWN GAP RATHER THAN AN OVERSIGHT.
      // §5b wants epoch k rendered from the prior cards as typed deltas; the past lane is COMPACT
      // by the same design (units only, no card), so a prior card cannot be rebuilt from the
      // artefact once the settlement has moved. The field is here, the edge reads it, and filling
      // it is W3's first measurement — either by keeping a card digest per epoch or by rendering
      // the delta at advance time. Until then an epoch render is card-grounded and not diff-aware,
      // which is lawful (nothing false is written) and less coherent than the design intends.
      record: null,
      guidance: request.guidance || '',
    }, token);
    if (!sent.ok || !sent.data) continue;
    // The version the SERVER reports is the one recorded, never the client's guess.
    next = landTabAnswer(next, sent.data, {
      ...keys,
      version: { ...keys.version, engine: sent.data.engineVersion || request.engineVersion },
    });
    landed += 1;
  }

  if (landed === 0) return { ok: false, reason: 'nothing-landed', tabs: tabs.length, landed: 0 };

  try {
    store.useStore.setState((state) => {
      const rows = Array.isArray(state.savedSettlements) ? state.savedSettlements : [];
      const index = rows.findIndex((row) => String(row.id) === String(request.saveId));
      if (index === -1) return {};
      const savedSettlements = rows.slice();
      savedSettlements[index] = { ...rows[index], settlement: next };
      const patch = { savedSettlements };
      // The live view is re-pointed only when it is still THIS save: a reader who switched
      // settlements mid-render must not have another town's prose appear under their eyes.
      if (String(state.activeSaveId) === String(request.saveId)) patch.settlement = next;
      return patch;
    });
    await persistSaveUpdate(request.saveId, { settlement: next });
  } catch (error) {
    return { ok: false, reason: String(error?.message || error), tabs: tabs.length, landed };
  }

  return { ok: true, tabs: tabs.length, landed };
}

/** Install the transport. Idempotent; called by the dossier's open-trigger hook. */
export function registerScribeTransport() {
  setScribeRenderer(renderScribe);
}

export default registerScribeTransport;
