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
import {
  attachProse, landBlock, landReceipts, pendingRecordFor, proseOf, retireCurrent,
} from '../lib/scribeArtefact.js';

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
  // ⭐ THE VERDICT ROWS RIDE WITH THE BLOCK THEY BELONG TO (W4 car 4, ruling 6). The response
  // carries them as ONE list for the whole tab, so each block takes its own share: a row whose
  // block is not landing here has no business in this landing, and splitting the list at the
  // source is what lets the artefact merge them without knowing about tabs.
  const verdicts = Array.isArray(answer?.verdicts) ? answer.verdicts : [];
  const tab = typeof answer?.tab === 'string' ? answer.tab : '';
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
      tab,
      receipts: verdicts.filter((row) => String(row?.blockId) === blockId),
    });
  }
  // ⛔ AND THE ROWS FOR POOLS THAT LANDED NO BLOCK AT ALL ARE THE ONES THAT MATTER MOST. A pool
  // the readers FAILED has no unit in `blocks` — it fell to the hand corpus, which is the whole
  // point of the gate — so the loop above would drop exactly the rows a DM opens the notes for.
  // `landReceipts` files them with no prose of their own.
  const landedBlocks = new Set(Object.keys(blocks));
  const orphans = verdicts.filter((row) => !landedBlocks.has(String(row?.blockId)));
  if (orphans.length > 0 && prose) {
    prose = landReceipts(prose, { advanceSeq: keys.advanceSeq, tab, receipts: orphans });
  }
  return prose ? attachProse(settlement, prose) : settlement;
}

/**
 * ⭐ THE BYTES THAT CROSS THE BOUNDARY FOR ONE TAB, built by a pure function so what is sent is a
 * thing a test can read rather than a shape buried in an async loop. Every field is one the edge
 * function names in its own reader (`scribe-render/index.ts`), and nothing else is here: no
 * settlement blob, no seed beyond the one the artefact is keyed to, no token.
 *
 * @param {{saveId: string, advanceSeq: number, renderedFor: string, engineVersion: string,
 *   guidance?: string}} request
 * @param {string} tab @param {object} card @param {object|null} record
 * @returns {object}
 */
export function tabRequestBody(request, tab, card, record) {
  return {
    saveId: request.saveId,
    advanceSeq: request.advanceSeq,
    renderedFor: request.renderedFor,
    engineVersion: request.engineVersion,
    tab,
    card,
    // ⭐ FILLED AT W4 car 2 (ruling 21). W2 sent `null` here and said in terms why: the past lane
    // is compact, so a prior card cannot be rebuilt once the settlement has moved. The cure was
    // the second half of that sentence — render the delta AT ADVANCE TIME, while both cards
    // exist — and it is what `record` now carries.
    record: record || null,
    guidance: request.guidance || '',
  };
}

/**
 * ⭐⭐ THE REDRAW'S OWN FIRST ACT (design §5c rule 1, ruling 16), as a PURE function over the
 * settlement so the order it happens in is a fact a test can read rather than a comment.
 *
 * The prior render moves WHOLE into the past lane marked `redone` — units, seq and nonce — and
 * `current` is emptied, so the fresh draw lands on a clean epoch and the DM can still read what
 * was replaced. Nothing is deleted anywhere on this path, which is the owner's rule for the undone
 * epoch (~06:4x) applied to the redone one.
 *
 * ⛔ AND IT IS HELD IN MEMORY UNTIL SOMETHING LANDS. Retiring and persisting BEFORE the model
 * answers would mean a redraw that fails — no credits, a provider refusal, a dropped connection —
 * left the dossier with its survey moved into the past and nothing in its place, which is a page
 * that got WORSE for pressing a button. So the retirement rides with the landing into one write:
 * on success the epoch is retired and the new one is current, and on failure the settlement is not
 * touched at all and the prior survey still reads.
 *
 * @param {object} settlement @param {{at: string, nonce: string, limit?: number}} how
 * @returns {object} a NEW settlement, or the same one when there is nothing to retire
 */
export function retireForRedraw(settlement, how) {
  const prose = proseOf(settlement);
  if (!prose || !prose.current) return settlement;
  return attachProse(settlement, retireCurrent(prose, {
    state: 'redone', at: how?.at, nonce: how?.nonce, limit: how?.limit,
  }));
}

/**
 * ⭐ THE RENDERER the trigger calls. Builds a card per firing tab, sends each, lands what comes
 * back, and persists ONCE at the end through the ordinary save outbox — `saves.js` writes the
 * settlement wholesale into `data`, so the artefact needs no column, no migration and no new call
 * site. Returns `{ok}` so the trigger's session ledger knows whether to hold the slot.
 *
 * ⭐ `reason` IS `open` OR `redo` AND IT CHANGES EXACTLY ONE THING: on `redo` the prior render is
 * retired into the past lane before the answers land, so the two renders of one epoch are kept
 * apart instead of the second overwriting the first. It changes NO pricing byte: a redraw is a
 * render and is billed through the same SKU by the same server call (`pricing.js` untouched).
 *
 * @param {{saveId: string, advanceSeq: number, renderedFor: string, engineVersion: string,
 *   settlement: object, guidance: string, reason?: 'open'|'redo'}} request
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

  const renderedAt = new Date().toISOString();
  const keys = {
    advanceSeq: request.advanceSeq,
    renderedFor: request.renderedFor,
    renderedAt,
    version: { scribe: null, engine: request.engineVersion, refuter: null, model: null },
  };

  // ⭐ THE REDRAW RETIRES FIRST (see `retireForRedraw`). The nonce keeps two renders of the SAME
  // advanceSeq apart, which is exactly the pair the past lane is keyed on: a redone epoch and the
  // epoch that replaced it carry one seq and two nonces.
  const redo = request?.reason === 'redo';
  let next = redo
    ? retireForRedraw(settlement, { at: renderedAt, nonce: `redo:${renderedAt}` })
    : settlement;
  let landed = 0;

  // ⭐⭐ THE EPOCH RECORD, READ ONCE AND SENT WITH EVERY TAB (chair ruling 21; design §5b). It was
  // computed at ADVANCE TIME, while the card the prior survey was written from still existed
  // (`lib/scribeEpochStamp.js`), and parked on the artefact until the render that is owed it asks.
  // It is read BY EPOCH: a record stamped for another advance is not this render's and answers
  // null, in which case the turn says nothing moved — which is W2's behaviour and is never false.
  // Reading it here, before the first tab goes out, is why the first landing may clear it.
  const record = pendingRecordFor(proseOf(settlement), request.advanceSeq);
  for (const tab of tabs) {
    let card;
    try { card = townCard(settlement, { tab, audience: 'dm' }); } catch { card = null; }
    if (!card || !Array.isArray(card.pools) || card.pools.length === 0) continue;
    const sent = await postTabRender(tabRequestBody(request, tab, card, record), token);
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
