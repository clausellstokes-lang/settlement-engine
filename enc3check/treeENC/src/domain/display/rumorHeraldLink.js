/**
 * domain/display/rumorHeraldLink.js — THE RUMOR MILL LINKS UPWARD (SP-6's SCOPE
 * + SURFACE CONTRACT and PAIRING LAW amendments, 2026-08-03).
 *
 * The causal voice is the Herald's; the settlement rumor mill keeps its own
 * local, worn, human register and REFERENCES UPWARD. Every rumor whose event
 * reached the Herald carries a LINK to that headline, by the id join the address
 * law already mandates. A rumor whose event stayed below the pacing floor
 * carries NO link, and is TRUTHFULLY UNLINKED rather than dead-linked.
 *
 * THE PAIRING LAW is what the link is for: the rumor mill is the world's
 * BELIEVED word — wrong, worn, human — and its link to the truthful headline is
 * the DM's fog-of-war instrument. What the town believes, one click from what
 * happened.
 *
 * ── THE DIRECTION MATTERS ───────────────────────────────────────────────────
 * This module is the RUMOR side reaching UP. It is deliberately NOT in the
 * Herald composer set and no Herald composer imports it: the fence forbids the
 * paper from reading the rumor mill, not the rumor mill from citing the paper.
 * Nothing here contributes a word to any Herald tier; it produces an id and a
 * label, and the popup it summons is the Herald's own.
 *
 * ── FAIL CLOSED, AND HONEST ABOUT WHY ───────────────────────────────────────
 * The join key is `eventRef`, which today lives ONLY in the DM `truth` block of
 * a rumor projection (`settlementRumors` with `includeGroundTruth`). A PLAYER
 * projection carries no join key at all, so it produces no links — which is the
 * correct behaviour twice over: the instrument is the DM's, and a player surface
 * must never gain a path to the truthful paper. This is a recorded limit of
 * today's projection, not a silent one; `linkRumorsToHerald` reports
 * `joinable: false` for exactly this reason rather than returning an empty list
 * that reads like "no rumor matched".
 *
 * PURE: no store, no React, no Date, no rng, no mutation.
 *
 * @enforced-by tests/domain/rumorHeraldLink.test.js
 */

import { readableBy } from './heraldIndex.js';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return v == null ? '' : String(v).trim();
}

/**
 * The canonical event ref a rumor projection carries, or '' when it carries
 * none. A PLAYER projection has no `truth` block and therefore no key — by
 * design, and the caller is told so rather than left to infer it from silence.
 * @param {Record<string, unknown>} rumor
 * @returns {string}
 */
export function rumorEventRef(rumor) {
  const row = asObject(rumor);
  const truth = asObject(row.truth);
  return text(truth.eventRef);
}

/**
 * Index the Herald's entries by every id a rumor's `eventRef` could name: the
 * entry's own id, and the source event it was minted from. Codepoint-stable, and
 * FIRST-WINS on a duplicate so the same corpus always resolves the same way.
 *
 * The AUDIENCE GATE runs here, not at the join: an entry a viewer could not read
 * never enters the index, so it can never be reached through a rumor either. A
 * link is a view, exactly as a search is.
 *
 * @param {ReadonlyArray<Record<string, unknown>>} entries
 * @param {boolean} [includeCovert]
 * @returns {Map<string, Record<string, unknown>>}
 */
export function heraldEntriesByEventRef(entries = [], includeCovert = false) {
  /** @type {Map<string, Record<string, unknown>>} */
  const index = new Map();
  const ordered = [...entries].sort((a, b) => {
    const ia = text(asObject(a).id);
    const ib = text(asObject(b).id);
    return ia < ib ? -1 : ia > ib ? 1 : 0;
  });
  for (const entry of ordered) {
    if (!readableBy(entry, includeCovert)) continue;
    const row = asObject(entry);
    const record = asObject(row.record);
    const outcome = asObject(record.outcome);
    for (const key of [row.id, row.rootId, record.sourceEventId, outcome.sourceEventId, record.id]) {
      const id = text(key);
      if (id && !index.has(id)) index.set(id, entry);
    }
  }
  return index;
}

/**
 * THE UPWARD LINK for one rumor: the Herald headline its event reached, or null.
 *
 * Null is a first-class answer here and means exactly one thing — this rumor's
 * event did not reach the paper (it stayed below the pacing floor, or the viewer
 * could not read it). The caller renders NOTHING in that case. A dead link is
 * forbidden: the amendment's word is "truthfully unlinked, never dead-linked".
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.rumor
 * @param {Map<string, Record<string, unknown>>} args.index
 * @returns {{ headlineId: string, headline: string, section: string, tick: number|null }|null}
 */
export function heraldLinkForRumor({ rumor, index }) {
  const ref = rumorEventRef(rumor);
  if (!ref || !index) return null;
  const entry = index.get(ref);
  if (!entry) return null;
  const row = asObject(entry);
  return {
    headlineId: text(row.id),
    // Byte-verbatim, as everywhere else: the paper's own recorded words.
    headline: text(row.headline),
    section: text(row.section) || 'events',
    tick: Number.isFinite(row.tick) ? Number(row.tick) : null,
  };
}

/**
 * Attach upward links to a whole rumor list, without mutating any input row.
 *
 * `joinable` distinguishes the two ways a list comes back linkless: `false` means
 * NO rumor in the list carried a join key at all (a player projection — the
 * instrument is the DM's), while `true` with zero links means the rumors were
 * joinable and their events genuinely did not reach the paper. Collapsing those
 * two into one empty answer is what makes an honest surface look broken.
 *
 * @param {Object} args
 * @param {ReadonlyArray<Record<string, unknown>>} args.rumors
 * @param {ReadonlyArray<Record<string, unknown>>} args.entries
 * @param {boolean} [args.includeCovert]
 * @returns {{ rumors: Array<Record<string, unknown>>, joinable: boolean, linked: number, unlinked: number }}
 */
export function linkRumorsToHerald({ rumors = [], entries = [], includeCovert = false }) {
  const index = heraldEntriesByEventRef(entries, includeCovert);
  const joinable = rumors.some((rumor) => !!rumorEventRef(rumor));
  let linked = 0;
  const out = rumors.map((rumor) => {
    const link = heraldLinkForRumor({ rumor, index });
    if (link) linked += 1;
    // The absent case adds NO key at all rather than a null one, so a renderer
    // that checks `'heraldLink' in rumor` cannot paint a dead affordance.
    return link ? { ...rumor, heraldLink: link } : { ...rumor };
  });
  return { rumors: out, joinable, linked, unlinked: out.length - linked };
}
