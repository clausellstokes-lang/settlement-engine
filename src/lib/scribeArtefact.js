/**
 * lib/scribeArtefact.js — THE SCRIBE ARTEFACT: the one shape, and the ONLY writer of it.
 *
 * The Scribe renders a settlement's dossier prose once per EPOCH (design §5, §5b) and keeps
 * the result on ONE top-level key of the settlement blob:
 *
 *   settlement.prose = {
 *     schema: 1,
 *     version:     { scribe, engine, refuter, model },
 *     renderedFor: '<the settlement seed the render was keyed to>',
 *     current:     null | { advanceSeq, renderedAt, blocks: { [blockId]: { [poolKey]: Unit } } },
 *     epochs:      [ { advanceSeq, nonce, renderedAt, state, blocks } ]   // the PAST LANE
 *   }
 *
 *   Unit = { vid, spine, faces[], notebook[], verdicts[], report{} }
 *
 * ⛔ WHY THE SEED FIELD IS CALLED `renderedFor` AND NOT `seed`. The public projection's deeper
 * denylist (`domain/display/publicSafe.js` PRIVATE_KEY_RE) strips ANY sub-key whose name
 * contains `seed`, and its SQL twin does the same. A key called `seed` here would therefore be
 * silently holed by the sanitiser the day anyone projects this artefact. It is named for what it
 * is instead: the seed this render was made FOR. (Today `prose` is absent from
 * PUBLIC_TOPLEVEL_KEYS entirely — ruling 3, fail-closed — so the artefact never reaches a public
 * surface at all; this naming is the second wall, not the first.)
 *
 * ⛔ THE FINITE-SEMANTICS PIN (ruling 12). Prose is an OUTPUT. Nothing under `src/domain/`
 * (except `display/`, which draws it) and nothing under `src/generators/` may read
 * `settlement.prose`: an engine that read its own prose back would make text an input to the
 * world and break FINITE-SEMANTICS. That is why this module lives in `src/lib/` and why
 * `tests/lint/scribeFiniteSemantics.walker.test.js` parses both trees and refuses any member
 * read of the key.
 *
 * ⛔ THE SINGLE-WRITER RULE. Every function here is PURE: it returns a new artefact and never
 * mutates its input, and no other module in the estate assigns `settlement.prose`. The walker
 * test above enforces the second half by scanning for assignment as well as read.
 *
 * ⭐ THE FIVE LIFECYCLE CURES this module exists to make possible (design §5, each pinned in
 * tests/lib/scribeArtefact.test.js):
 *   1. SNAPSHOT — `snapshotSettlement` deletes the key, so fifty version-history clones do not
 *      each carry a copy of the prose (50 x ~200 KB on one save row).
 *   2. THE PENDING-DOSSIER STASH — the localStorage stash across the Stripe round trip strips
 *      it, so a bought dossier cannot blow the ~5 MB origin quota.
 *   3. EXPORT/IMPORT — the account transfer ceiling rises so an account can re-import its own
 *      export (see `lib/accountTransferContract.js`).
 *   4. THE LOCKED CARRY — a full regenerate is a new town, so the artefact is DROPPED unless a
 *      lock froze the ground the unit stands on (`carryProseThroughGenerate`).
 *   5. THE PUBLIC PROJECTION — absent from the allowlist, hence dropped everywhere.
 */

/** The settlement key the artefact lives on. One spelling, read by the pin. */
export const SCRIBE_SETTLEMENT_KEY = 'prose';

/** The artefact's own shape version. Bumped only when the shape below changes. */
export const SCRIBE_ARTEFACT_SCHEMA = 1;

/**
 * How many COMPACT past epochs the blob keeps. The lived past beyond this rotates into the
 * chronicle lane, which is where the product already promises narrative history lives
 * (`store/aiChronicleAppend.js`, CHRONICLE_LIMITS, tier-rotated). Without a cap a fifty-advance
 * campaign at ~150 KB an epoch would be 7.5 MB on one save row.
 */
export const SCRIBE_PAST_EPOCH_LIMIT = 12;

/** The states a past-lane epoch can be in. `lived` is an epoch the world moved past. */
export const SCRIBE_EPOCH_STATES = Object.freeze(['lived', 'undone', 'redone']);

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (v === null || v === undefined ? '' : String(v));

/**
 * A structural clone that never throws on a plain artefact (it is JSON by construction).
 * @template T @param {T} value @returns {T}
 */
const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * The empty artefact. A settlement that has never been scribed has NO `prose` key at all
 * (absent, not empty) so the 525-town generator golden master is byte-identical either way.
 * @param {{renderedFor?: string, version?: object}} [init]
 * @returns {object}
 */
export function emptyArtefact(init = {}) {
  return {
    schema: SCRIBE_ARTEFACT_SCHEMA,
    version: isObj(init.version) ? clone(init.version) : null,
    renderedFor: str(init.renderedFor),
    current: null,
    epochs: [],
  };
}

/**
 * Is this a shape we recognise. An artefact from a newer schema is treated as ABSENT by every
 * reader below rather than half-read, which is the estate's fail-closed posture for a shape it
 * cannot promise to understand.
 * @param {unknown} prose
 * @returns {boolean}
 */
export function isArtefact(prose) {
  return isObj(prose) && prose.schema === SCRIBE_ARTEFACT_SCHEMA;
}

/**
 * ⭐ THE READ THE DISPLAY LAYER MAKES. Returns the rendered units for one pool of one block, or
 * null when there is nothing lawful to draw. Null is the answer in every one of these cases, and
 * the caller falls back to the hand corpus without ever mixing the two inside one pool:
 *   - no artefact, or a schema this build does not know;
 *   - no current epoch (the first render has not landed yet);
 *   - the artefact was rendered for a DIFFERENT seed (an import, a reroll, a restored clone);
 *   - the artefact's engine version does not match the world's (design §7);
 *   - this block has not landed yet (the tabs swap per block as the outbox lands them).
 *
 * @param {unknown} prose the settlement's artefact
 * @param {{blockId: string, poolKey: string, renderedFor?: string, engineVersion?: string}} q
 * @returns {object[]|null}
 */
export function unitsFor(prose, q) {
  if (!isArtefact(prose)) return null;
  const current = prose.current;
  if (!isObj(current)) return null;
  const wantSeed = str(q?.renderedFor);
  if (wantSeed && str(prose.renderedFor) !== wantSeed) return null;
  const wantEngine = str(q?.engineVersion);
  if (wantEngine && str(prose.version?.engine) !== wantEngine) return null;
  const block = isObj(current.blocks) ? current.blocks[str(q?.blockId)] : null;
  if (!isObj(block)) return null;
  const pool = block[str(q?.poolKey)];
  if (!Array.isArray(pool) || pool.length === 0) return null;
  return pool;
}

/**
 * The epoch the artefact's CURRENT render belongs to, or null when nothing is rendered.
 * @param {unknown} prose @returns {number|null}
 */
export function currentAdvanceSeq(prose) {
  if (!isArtefact(prose) || !isObj(prose.current)) return null;
  const seq = prose.current.advanceSeq;
  return typeof seq === 'number' && Number.isFinite(seq) ? seq : null;
}

/**
 * ⭐ THE STALENESS TEST — the one the OPEN trigger asks (rule 14: the open renders, and the
 * artefact is frozen until the next advance). True when a render is owed: no artefact, a
 * different seed, or a current epoch behind the world's advance counter.
 * @param {unknown} prose
 * @param {{advanceSeq?: number, renderedFor?: string, engineVersion?: string}} q
 * @returns {boolean}
 */
export function isStale(prose, q) {
  if (!isArtefact(prose)) return true;
  const wantSeed = str(q?.renderedFor);
  if (wantSeed && str(prose.renderedFor) !== wantSeed) return true;
  const wantEngine = str(q?.engineVersion);
  if (wantEngine && str(prose.version?.engine) !== wantEngine) return true;
  const seq = currentAdvanceSeq(prose);
  if (seq === null) return true;
  const want = typeof q?.advanceSeq === 'number' ? q.advanceSeq : 0;
  return seq !== want;
}

/**
 * ⭐ LAND ONE BLOCK. The outbox delivers a tab at a time, so the artefact grows a block at a
 * time and a tab swaps from corpus to Scribe the moment ITS block is present. A block that
 * lands for a DIFFERENT epoch than the one already current starts a new current epoch and
 * retires the old one into the past lane (never a mix within one epoch).
 *
 * @param {unknown} prose the artefact so far (null/absent starts one)
 * @param {{advanceSeq: number, blockId: string, pools: Record<string, object[]>,
 *   renderedFor: string, renderedAt?: string, version?: object, nonce?: string}} landing
 * @returns {object} a NEW artefact
 */
export function landBlock(prose, landing) {
  const blockId = str(landing?.blockId);
  const pools = isObj(landing?.pools) ? landing.pools : null;
  const seq = typeof landing?.advanceSeq === 'number' ? landing.advanceSeq : 0;
  if (!blockId || !pools) return isArtefact(prose) ? clone(prose) : emptyArtefact(landing);

  let next = isArtefact(prose)
    ? clone(prose)
    : emptyArtefact({ renderedFor: landing.renderedFor, version: landing.version });

  // A different seed means a different town: the artefact does not follow it.
  if (str(next.renderedFor) !== str(landing.renderedFor)) {
    next = emptyArtefact({ renderedFor: landing.renderedFor, version: landing.version });
  }
  if (isObj(landing.version)) next.version = clone(landing.version);

  const openSeq = currentAdvanceSeq(next);
  if (openSeq !== null && openSeq !== seq) {
    next = retireCurrent(next, { state: 'lived', nonce: str(landing.nonce), at: str(landing.renderedAt) });
  }
  if (!isObj(next.current)) {
    next.current = { advanceSeq: seq, renderedAt: str(landing.renderedAt), blocks: {} };
  }
  next.current.advanceSeq = seq;
  if (landing.renderedAt) next.current.renderedAt = str(landing.renderedAt);
  next.current.blocks[blockId] = clone(pools);
  return next;
}

/**
 * ⭐ RETIRE THE CURRENT RENDER INTO THE PAST LANE (design §5b, rulings 15 and 16).
 *
 * The owner's rule of 2026-09-14 ~06:4x is that an undone advance's prose is SAVED, never
 * dropped, and a REDO moves the render it replaces the same way. So this is the one move both
 * verbs make, and neither has a delete in it. The pair (advanceSeq, nonce) keeps two renders of
 * the SAME seq apart, because the living-futures law means the next advance draws a different
 * future for a seq that was undone.
 *
 * @param {unknown} prose
 * @param {{state?: 'lived'|'undone'|'redone', nonce?: string, at?: string}} [how]
 * @returns {object} a NEW artefact with `current` null and one more past-lane entry
 */
export function retireCurrent(prose, how = {}) {
  if (!isArtefact(prose)) return isObj(prose) ? clone(prose) : emptyArtefact();
  const next = clone(prose);
  const current = next.current;
  if (!isObj(current)) return next;
  const state = SCRIBE_EPOCH_STATES.includes(str(how.state)) ? str(how.state) : 'lived';
  next.epochs = rotate([
    ...(Array.isArray(next.epochs) ? next.epochs : []),
    compactEpoch(current, { state, nonce: str(how.nonce), at: str(how.at) }),
  ]);
  next.current = null;
  return next;
}

/**
 * ⭐ THE UNDO OF AN ADVANCE (ruling 15). Every epoch at or above the restored depth MOVES into
 * the past lane marked undone; the epoch the world has been restored TO becomes current again if
 * the lane holds it, and otherwise current is simply empty and the next open renders it. The
 * artefact is never deleted on this path, which is the whole of the owner's rule.
 *
 * @param {unknown} prose
 * @param {{advanceSeq: number, nonce?: string, at?: string}} restore the depth restored TO
 * @returns {object} a NEW artefact
 */
export function restoreToDepth(prose, restore) {
  if (!isArtefact(prose)) return isObj(prose) ? clone(prose) : emptyArtefact();
  const depth = typeof restore?.advanceSeq === 'number' ? restore.advanceSeq : 0;
  const nonce = str(restore?.nonce);
  const at = str(restore?.at);
  let next = clone(prose);

  const openSeq = currentAdvanceSeq(next);
  if (openSeq !== null && openSeq > depth) {
    next = retireCurrent(next, { state: 'undone', nonce, at });
  }
  const lane = Array.isArray(next.epochs) ? next.epochs : [];
  /** @type {object[]} */
  const kept = [];
  for (const epoch of lane) {
    const seq = typeof epoch?.advanceSeq === 'number' ? epoch.advanceSeq : 0;
    if (seq > depth && epoch?.state !== 'undone') {
      kept.push({ ...clone(epoch), state: 'undone', undoneAt: at, nonce: str(epoch?.nonce) || nonce });
    } else {
      kept.push(clone(epoch));
    }
  }
  next.epochs = rotate(kept);

  // Re-point current at the surviving epoch when the lane still holds it whole.
  if (!isObj(next.current)) {
    const index = next.epochs.findIndex(
      (e) => e?.advanceSeq === depth && e?.state === 'lived' && isObj(e?.blocks),
    );
    if (index >= 0) {
      const [revived] = next.epochs.splice(index, 1);
      next.current = { advanceSeq: depth, renderedAt: str(revived.renderedAt), blocks: clone(revived.blocks) };
    }
  }
  return next;
}

/**
 * A past-lane entry: the UNITS only. No card, no report, no verdict detail — those are the
 * render's working, and keeping fifty copies of them is what would grow the blob without bound.
 * @param {object} epoch @param {{state: string, nonce?: string, at?: string}} how
 * @returns {object}
 */
export function compactEpoch(epoch, how) {
  /** @type {Record<string, Record<string, object[]>>} */
  const blocks = {};
  const source = isObj(epoch?.blocks) ? epoch.blocks : {};
  for (const blockId of Object.keys(source).sort()) {
    const pools = isObj(source[blockId]) ? source[blockId] : {};
    /** @type {Record<string, object[]>} */
    const row = {};
    for (const poolKey of Object.keys(pools).sort()) {
      const units = Array.isArray(pools[poolKey]) ? pools[poolKey] : [];
      row[poolKey] = units.map((u) => ({
        vid: u?.vid ?? null,
        spine: str(u?.spine),
        faces: Array.isArray(u?.faces) ? u.faces.map(str) : [],
        notebook: Array.isArray(u?.notebook) ? u.notebook.map(str) : [],
      }));
    }
    blocks[blockId] = row;
  }
  const out = {
    advanceSeq: typeof epoch?.advanceSeq === 'number' ? epoch.advanceSeq : 0,
    nonce: str(how?.nonce),
    renderedAt: str(epoch?.renderedAt),
    state: str(how?.state) || 'lived',
    blocks,
  };
  if (out.state === 'undone' && how?.at) out.undoneAt = str(how.at);
  if (out.state === 'redone' && how?.at) out.redoneAt = str(how.at);
  return out;
}

/** Keep the lane bounded, oldest first out. */
function rotate(lane) {
  const rows = Array.isArray(lane) ? lane : [];
  return rows.length <= SCRIBE_PAST_EPOCH_LIMIT ? rows : rows.slice(rows.length - SCRIBE_PAST_EPOCH_LIMIT);
}

/**
 * ⭐ STRIP THE ARTEFACT. Returns the SAME reference when there is nothing to strip, so the
 * ordinary path (a settlement that has never been scribed) allocates nothing and the callers'
 * own identity pins are untouched.
 *
 * Used by the version-history snapshot and the pending-dossier stash. Both are COPIES of a
 * settlement whose live blob still holds the prose, so stripping loses nothing: a restore
 * re-attaches from the live object, and a bought dossier renders on its first save.
 *
 * @template {object} S @param {S|null|undefined} settlement @returns {S|null|undefined}
 */
export function stripProse(settlement) {
  if (!isObj(settlement)) return settlement;
  if (!(SCRIBE_SETTLEMENT_KEY in settlement)) return settlement;
  const next = { ...settlement };
  delete next[SCRIBE_SETTLEMENT_KEY];
  return /** @type {any} */ (next);
}

/**
 * Attach an artefact to a settlement, or remove it when the artefact is empty. THE ONLY write
 * of the key in the estate; every other module goes through here.
 * @template {object} S @param {S} settlement @param {object|null} prose @returns {S}
 */
export function attachProse(settlement, prose) {
  if (!isObj(settlement)) return settlement;
  if (!isArtefact(prose)) return /** @type {any} */ (stripProse(settlement));
  return /** @type {any} */ ({ ...settlement, [SCRIBE_SETTLEMENT_KEY]: prose });
}

/** Read the artefact off a settlement, or null. @param {unknown} settlement */
export function proseOf(settlement) {
  if (!isObj(settlement)) return null;
  const prose = /** @type {any} */ (settlement)[SCRIBE_SETTLEMENT_KEY];
  return isArtefact(prose) ? prose : null;
}

/**
 * ⭐ THE LOCKED CARRY ACROSS A FULL GENERATE (design §5 REGENERATE).
 *
 * A full generate mints a NEW TOWN. `carryLockedSections` carries the sections the user froze
 * (the name, the whole history) across that identity boundary, and the hazard the design names
 * is that a unit carried with them would describe the old town's facts in the new town's mouth.
 *
 * THE LAW USED HERE IS GROUND EQUALITY, not a section-to-block map. A unit carries if and only
 * if the fresh town's card row for that pool is IDENTICAL to the previous town's in every field
 * the unit stands on: the drawn variant, the faces' seated sources and the roles those sources
 * seat, the slot fills, the frozen field values and the compromised roll. That is exactly the
 * ground a lock can freeze, it is checked rather than assumed, and it needs no map to maintain
 * as blocks are added. A pool whose ground moved by one field is dropped and draws the corpus.
 *
 * NOTHING carries when no lock is set: an unlocked generate is a different world by intent.
 *
 * The card builder is INJECTED so this module stays a leaf. The caller passes a function that
 * returns the pool rows for one settlement, which in the product is `townCard` behind a dynamic
 * import (it pulls the six prose leaves and must never enter the first-paint closure).
 *
 * @param {object|null|undefined} prev the settlement being replaced
 * @param {object} fresh the settlement just generated
 * @param {unknown} locks the lock map
 * @param {(settlement: object) => Array<{blockId: string, poolKey: string, ground: string}>} groundRows
 * @returns {object} `fresh` unchanged (same reference) when nothing carries
 */
export function carryProseThroughGenerate(prev, fresh, locks, groundRows) {
  const prose = proseOf(prev);
  if (!prose || !isObj(fresh) || typeof groundRows !== 'function') return fresh;
  if (!anyLockSet(locks)) return fresh;
  const current = prose.current;
  if (!isObj(current) || !isObj(current.blocks)) return fresh;

  const before = new Map();
  for (const row of groundRows(/** @type {object} */ (prev)) || []) {
    before.set(`${str(row?.blockId)}::${str(row?.poolKey)}`, str(row?.ground));
  }
  const after = new Map();
  for (const row of groundRows(fresh) || []) {
    after.set(`${str(row?.blockId)}::${str(row?.poolKey)}`, str(row?.ground));
  }

  /** @type {Record<string, Record<string, object[]>>} */
  const kept = {};
  for (const blockId of Object.keys(current.blocks).sort()) {
    const pools = isObj(current.blocks[blockId]) ? current.blocks[blockId] : {};
    for (const poolKey of Object.keys(pools).sort()) {
      const key = `${blockId}::${poolKey}`;
      const was = before.get(key);
      if (was === undefined || was === '' || after.get(key) !== was) continue;
      if (!kept[blockId]) kept[blockId] = {};
      kept[blockId][poolKey] = clone(pools[poolKey]);
    }
  }
  if (Object.keys(kept).length === 0) return fresh;

  const carried = {
    ...emptyArtefact({ renderedFor: seedKeyOf(fresh), version: prose.version || undefined }),
    current: { advanceSeq: current.advanceSeq ?? 0, renderedAt: str(current.renderedAt), blocks: kept },
  };
  return attachProse(fresh, carried);
}

/** The seed a card is keyed to, spelled exactly as the tabs spell it. */
function seedKeyOf(settlement) {
  const s = isObj(settlement) ? /** @type {any} */ (settlement) : {};
  return str(s._seed ?? s.id ?? '');
}

/** Is any lock set at all. Mirrors `domain/locksPreservation.js` without importing it. */
function anyLockSet(locks) {
  if (!isObj(locks)) return false;
  for (const value of Object.values(/** @type {any} */ (locks))) {
    if (value === true) return true;
    if (Array.isArray(value) && value.length > 0) return true;
  }
  return false;
}
