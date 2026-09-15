/**
 * lib/scribeArtefact.js — THE SCRIBE ARTEFACT: the one shape, and the ONLY writer of it.
 *
 * The Scribe renders a settlement's dossier prose once per EPOCH (design §5, §5b) and keeps
 * the result on ONE top-level key of the settlement blob:
 *
 *   settlement.prose = {
 *     schema: 3,
 *     version:     { scribe, engine, refuter, model },
 *     renderedFor: '<the settlement seed the render was keyed to>',
 *     current:     null | { advanceSeq, renderedAt,
 *                           blocks:   { [blockId]: { [poolKey]: Unit } },
 *                           receipts: [ { tab, blockId, poolKey, vid, verdict, arms, patched } ] },
 *     epochs:      [ { advanceSeq, nonce, renderedAt, state, blocks } ],  // the PAST LANE
 *     pendingRecord: null | <an epochRecord, computed at ADVANCE time>    // schema /2
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

/**
 * The artefact's own shape version. Bumped only when the shape below changes, with the cause.
 *
 * /2 (W4 car 2, 2026-09-14): `pendingRecord` added — the typed record of the advance that made
 * this artefact stale, computed AT ADVANCE TIME while both cards still exist (ruling 21) and sent
 * with the next render at open. W2 shipped the transport sending `record: null` on every render
 * and said so in terms; this is that gap closed. Absent is lawful everywhere: an artefact with no
 * pending record renders exactly as W2's did, and the writer's turn then says nothing moved.
 *
 * /3 (W4 car 4, 2026-09-14): `current.receipts` added — one row per pool the two readers acted on,
 * so the DM can read WHICH pools fell to the hand corpus and on which arms (ruling 6: refused units
 * are silently the corpus on the player page, and readable as a REPORT on the DM page). Absent is
 * lawful: an artefact landed before this shape reads as a survey with no notes.
 */
export const SCRIBE_ARTEFACT_SCHEMA = 3;

/**
 * How many COMPACT past epochs the blob keeps, and the HARD CEILING no tier may exceed.
 *
 * Without a cap a fifty-advance campaign at ~150 KB an epoch would be 7.5 MB on one save row.
 * The retention POLICY is tier-based and lives in `store/scribeEpochLane.js`, which reads the
 * product's existing narrative-history promise (`lib/chronicle.js` CHRONICLE_LIMITS) rather than
 * inventing a second number; this constant is the floor under that policy, because two of those
 * three tiers are `Infinity` and a JSONB row cannot be unbounded. Whether the owner wants every
 * epoch forever on the blob is a STORAGE decision and stays owner-gated (design §12 item 13).
 */
export const SCRIBE_PAST_EPOCH_LIMIT = 12;

/** The states a past-lane epoch can be in. `lived` is an epoch the world moved past. */
export const SCRIBE_EPOCH_STATES = Object.freeze(['lived', 'undone', 'redone']);

/**
 * ⭐ THE SHAPE, TYPED ONCE. Spelled here so `isArtefact` can be a TYPE PREDICATE: every reader
 * below narrows `unknown` through it and none of them needs a cast, which is what keeps this
 * module clean under `tsconfig.full.json` (an un-baselined file must be typecheck-clean).
 *
 * @typedef {object} ScribeUnit
 * @property {number} [vid] the ANNEX row the render was made for, never the pool index
 * @property {string} [spine]
 * @property {string[]} [faces]
 * @property {string[]} [notebook]
 * @property {string[]} [verdicts]
 * @property {object} [report]
 */

/** @typedef {Record<string, Record<string, ScribeUnit[]>>} ScribeBlocks */

/**
 * @typedef {object} ScribeEpoch
 * @property {number} advanceSeq
 * @property {string} [nonce]
 * @property {string} [renderedAt]
 * @property {string} [state]
 * @property {string} [undoneAt]
 * @property {string} [redoneAt]
 * @property {ScribeBlocks} [blocks]
 */

/**
 * @typedef {object} ScribeArtefact
 * @property {number} schema
 * @property {{scribe?: string, engine?: string, refuter?: string, model?: string}|null} version
 * @property {string} renderedFor
 * @property {{advanceSeq: number, renderedAt: string, blocks: ScribeBlocks,
 *   receipts?: ScribeReceipt[]}|null} current  `receipts` is schema /3 and absent on an older one
 * @property {ScribeEpoch[]} epochs
 * @property {{advanceSeq?: number}|null} [pendingRecord] schema /2; ABSENT on an artefact that has
 *   not been through an advance, which is why every reader below tolerates its absence rather than
 *   defaulting it: `null` and "not there" are the same answer and neither is a record.
 */

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
 * @returns {ScribeArtefact}
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
 * @returns {prose is ScribeArtefact}
 */
export function isArtefact(prose) {
  return isObj(prose)
    && /** @type {{schema?: unknown}} */ (prose).schema === SCRIBE_ARTEFACT_SCHEMA;
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
 * ⭐⭐ THE SURVEY'S RECEIPTS (schema /3; chair ruling 6; W4 car 4).
 *
 * ⛔ WHY THEY ARE A LIST ON THE EPOCH AND NOT A KEY ON EACH UNIT. The brief's letter is
 * `blocks[*][*].verdicts`, and two measured facts make that the wrong home. First, the rows that
 * matter MOST are the ones with no unit to hang on: a pool the readers FAILED has nothing in
 * `blocks`, because it fell to the hand corpus, and it is exactly the row a DM wants to see.
 * Second, the unit's own `verdicts` field is already typed `string[]` on the shipped shape and in
 * every fixture, and overloading it with records would make one key mean two things. So the whole
 * receipt list rides on `current`, beside the blocks rather than inside them, and a reader gets
 * PATCHED, WITHHELD and FAIL from one place.
 *
 * ⛔ THE FINDINGS' PROSE IS NOT STORED. A row keeps the verdict, the ARMS as the refuter names
 * them, and the SEATS a patch replaced. The findings' descriptions are the render's working: they
 * run to a hundred characters apiece and would multiply the list by ten to say, in words, what the
 * arm name already says.
 *
 * ⛔ ONE ROW PER POOL, WORST VERDICT WINS, ARMS UNIONED. A unit can earn TWO rows, one per reader
 * (tier 0 keeps it, the second reader patches it). Two rows for one pool would read as two
 * problems; the reader wants one row that says what happened to that pool in the end.
 *
 * @typedef {{tab: string, blockId: string, poolKey: string, vid: number|null, verdict: string,
 *   arms: string[], patched: string[]}} ScribeReceipt
 */

/** How the four verdicts rank when two rows land on one pool. FAIL is the worst and wins. */
const RECEIPT_RANK = Object.freeze({
  PASS: 0, WITHHELD: 1, PATCHED: 2, FAIL: 3,
});

/**
 * How many receipt rows one epoch keeps. A settlement is ~57-68 firing pools across its tabs plus
 * the five daily-life beats, so this holds every pool of a whole render with room over; the cap is
 * here because the list comes off a server response and nothing that comes off a response is
 * unbounded on the blob.
 */
export const SCRIBE_RECEIPT_LIMIT = 120;

/** The row key: one per pool per epoch. */
const receiptKeyOf = (row) => `${str(row?.tab)}::${str(row?.blockId)}::${str(row?.poolKey)}::${str(row?.vid)}`;

/**
 * One verdict row as the artefact keeps it: the pool, what happened to it, and on which arms.
 * @param {object} row a verdict row from the render response @param {string} tab
 * @returns {ScribeReceipt}
 */
function receiptOf(row, tab) {
  return {
    tab: str(tab),
    blockId: str(row?.blockId),
    poolKey: str(row?.poolKey),
    vid: typeof row?.vid === 'number' ? row.vid : null,
    verdict: str(row?.verdict) || 'FAIL',
    arms: (Array.isArray(row?.arms) ? row.arms : []).map(str).filter(Boolean),
    patched: (Array.isArray(row?.patched) ? row.patched : []).map(str).filter(Boolean),
  };
}

/**
 * Fold new rows into the ones this epoch already holds. Worst verdict wins, arms and seats union,
 * order is the order the tabs landed in.
 * @param {ScribeReceipt[]} held @param {ScribeReceipt[]} incoming @returns {ScribeReceipt[]}
 */
function mergeReceipts(held, incoming) {
  const out = [];
  /** @type {Map<string, ScribeReceipt>} */
  const byKey = new Map();
  for (const row of [...(Array.isArray(held) ? held : []), ...incoming]) {
    const key = receiptKeyOf(row);
    const prior = byKey.get(key);
    if (!prior) {
      byKey.set(key, row);
      out.push(row);
      continue;
    }
    const worse = (RECEIPT_RANK[row.verdict] ?? 0) > (RECEIPT_RANK[prior.verdict] ?? 0);
    prior.verdict = worse ? row.verdict : prior.verdict;
    prior.arms = [...new Set([...prior.arms, ...row.arms])].sort();
    prior.patched = [...new Set([...prior.patched, ...row.patched])];
  }
  return out.length <= SCRIBE_RECEIPT_LIMIT ? out : out.slice(0, SCRIBE_RECEIPT_LIMIT);
}

/**
 * ⭐ THE ROWS A DM READS (ruling 6). Only the pools something HAPPENED to: a PASS is the ordinary
 * case and a page of them would bury the three rows that matter. Grouped by tab, sorted, and with
 * a count per verdict so the panel can say how the survey went in one line.
 *
 * @param {unknown} prose
 * @returns {{tabs: Array<{tab: string, rows: ScribeReceipt[]}>,
 *   counts: {failed: number, patched: number, withheld: number}, total: number}}
 */
export function surveyNotesOf(prose) {
  const empty = { tabs: [], counts: { failed: 0, patched: 0, withheld: 0 }, total: 0 };
  if (!isArtefact(prose) || !isObj(prose.current)) return empty;
  const rows = Array.isArray(/** @type {any} */ (prose.current).receipts)
    ? /** @type {ScribeReceipt[]} */ (/** @type {any} */ (prose.current).receipts) : [];
  const kept = rows.filter((row) => row && row.verdict !== 'PASS');
  if (kept.length === 0) return empty;
  /** @type {Map<string, ScribeReceipt[]>} */
  const byTab = new Map();
  const counts = { failed: 0, patched: 0, withheld: 0 };
  for (const row of kept) {
    if (row.verdict === 'FAIL') counts.failed += 1;
    else if (row.verdict === 'PATCHED') counts.patched += 1;
    else if (row.verdict === 'WITHHELD') counts.withheld += 1;
    const tab = str(row.tab);
    if (!byTab.has(tab)) byTab.set(tab, []);
    /** @type {ScribeReceipt[]} */ (byTab.get(tab)).push(row);
  }
  const tabs = [...byTab.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([tab, list]) => ({
      tab,
      rows: list.slice().sort((a, b) => {
        const byBlock = a.blockId < b.blockId ? -1 : a.blockId > b.blockId ? 1 : 0;
        return byBlock || (a.poolKey < b.poolKey ? -1 : a.poolKey > b.poolKey ? 1 : 0);
      }),
    }));
  return { tabs, counts, total: kept.length };
}

/**
 * ⭐⭐ THE PENDING EPOCH RECORD (schema /2; chair ruling 21; design §5b).
 *
 * ⛔ WHY IT IS STORED AT ALL, AND STORED HERE. §5b renders epoch k from (card_k, the history as
 * typed deltas, the typed record of advance k) and never from its own prior prose — coherence has
 * to come from the ENGINE'S history, because a model re-reading its own words compounds drift and
 * a typed delta cannot. But the render happens at the OPEN (rule 14), which may be a week and a
 * reload after the advance, and by then the town has MOVED: the card the prose was written from is
 * gone and the past lane is compact by design (units only, no card). So the record is computed
 * AT ADVANCE TIME, while both sides of the delta still exist, and parked here until the render
 * that is owed it asks for it.
 *
 * ⛔ IT IS READ BY EPOCH, NEVER BLIND. A record belongs to exactly one epoch — the one the advance
 * created — and handing it to a render of a different epoch would licence "since the last survey"
 * over fields that moved in some other advance. So `pendingRecordFor` answers null unless the seq
 * it is asked about is the seq the record was stamped with.
 *
 * @param {unknown} prose @returns {object|null}
 */
export function pendingRecordOf(prose) {
  if (!isArtefact(prose)) return null;
  const record = /** @type {{pendingRecord?: unknown}} */ (prose).pendingRecord;
  return isObj(record) ? /** @type {object} */ (record) : null;
}

/**
 * The pending record IF it belongs to this epoch, else null.
 * @param {unknown} prose @param {number} advanceSeq @returns {object|null}
 */
export function pendingRecordFor(prose, advanceSeq) {
  const record = pendingRecordOf(prose);
  if (!record) return null;
  const seq = /** @type {{advanceSeq?: unknown}} */ (record).advanceSeq;
  return typeof seq === 'number' && seq === Number(advanceSeq) ? record : null;
}

/**
 * Park a record on the artefact, or clear it with null. Pure, like everything here.
 * @param {unknown} prose @param {object|null} record @returns {object} a NEW artefact
 */
export function setPendingRecord(prose, record) {
  if (!isArtefact(prose)) return isObj(prose) ? clone(prose) : emptyArtefact();
  const next = clone(prose);
  if (isObj(record)) next.pendingRecord = clone(record);
  else delete next.pendingRecord;
  return next;
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
 * ⭐ WHICH SURVEY THE PAGE IS SHOWING (design §5b, rule 14: "generation happens only once a
 * settlement's dossier is opened and frozen until next advance time").
 *
 * Three answers, and the middle one is the whole point. An advance makes every artefact stale
 * WITHOUT rendering anything, so between the advance and the next open a town has last epoch's
 * prose and no new prose. The page does not blank and does not mix: it shows what it has, marked
 * as THE PRIOR SURVEY, until the render lands and the blocks swap.
 *
 *   'none'    — nothing to draw; every pool takes the hand corpus.
 *   'prior'   — a render exists but belongs to an earlier epoch (or a superseded engine).
 *   'current' — the render is the current epoch's.
 *
 * A render made for a DIFFERENT SEED is 'none', not 'prior': another town's prose is not this
 * town's older prose, and there is no honest way to caption it.
 *
 * @param {unknown} prose
 * @param {{advanceSeq?: number, renderedFor?: string, engineVersion?: string}} q
 * @returns {'none'|'prior'|'current'}
 */
export function surveyStateOf(prose, q) {
  if (!isArtefact(prose)) return 'none';
  const wantSeed = str(q?.renderedFor);
  if (wantSeed && str(prose.renderedFor) !== wantSeed) return 'none';
  const seq = currentAdvanceSeq(prose);
  if (seq === null) return 'none';
  const wantEngine = str(q?.engineVersion);
  if (wantEngine && str(prose.version?.engine) !== wantEngine) return 'prior';
  const want = typeof q?.advanceSeq === 'number' ? q.advanceSeq : 0;
  return seq === want ? 'current' : 'prior';
}

/**
 * ⭐ LAND ONE BLOCK. The outbox delivers a tab at a time, so the artefact grows a block at a
 * time and a tab swaps from corpus to Scribe the moment ITS block is present. A block that
 * lands for a DIFFERENT epoch than the one already current starts a new current epoch and
 * retires the old one into the past lane (never a mix within one epoch).
 *
 * @param {unknown} prose the artefact so far (null/absent starts one)
 * @param {{advanceSeq: number, blockId: string, pools: Record<string, object[]>,
 *   renderedFor: string, renderedAt?: string, version?: object, nonce?: string,
 *   limit?: number, tab?: string, receipts?: object[]}} landing
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
    next = retireCurrent(next, {
      state: 'lived', nonce: str(landing.nonce), at: str(landing.renderedAt), limit: landing.limit,
    });
  }
  if (!isObj(next.current)) {
    next.current = {
      advanceSeq: seq, renderedAt: str(landing.renderedAt), blocks: {}, receipts: [],
    };
  }
  if (!Array.isArray(next.current.receipts)) next.current.receipts = [];
  next.current.advanceSeq = seq;
  if (landing.renderedAt) next.current.renderedAt = str(landing.renderedAt);
  next.current.blocks[blockId] = clone(pools);

  // ⭐ THE RECEIPTS FOR THIS BLOCK (schema /3). They ride with the landing rather than in a second
  // write, so a block and the account of what happened to it can never be out of step. See
  // `surveyNotesOf` for why they live on the epoch and not on the units.
  if (Array.isArray(landing.receipts) && landing.receipts.length > 0) {
    const incoming = landing.receipts.map((row) => receiptOf(row, landing.tab));
    next.current.receipts = mergeReceipts(next.current.receipts, incoming);
  }

  // ⭐ THE LANDING CLEARS THE RECORD IT WAS OWED (schema /2). A pending record exists to tell ONE
  // render what moved; once that epoch's prose is landing there is nothing left for it to licence,
  // and leaving it on the blob would hand it to the NEXT render as well, which would say "since
  // the last survey" over an advance two epochs old. The transport reads it once before the first
  // tab goes out, so clearing on the first block that lands loses nothing.
  const pending = pendingRecordOf(next);
  if (pending && typeof pending.advanceSeq === 'number' && seq >= pending.advanceSeq) {
    delete next.pendingRecord;
  }
  return next;
}

/**
 * ⭐ LAND RECEIPTS ALONE, for the rows whose pool landed NO BLOCK (W4 car 4).
 *
 * ⛔ THOSE ARE THE ROWS THAT MATTER MOST. A pool the two readers FAILED has no unit in `blocks` —
 * it fell to the hand corpus, which is the whole point of the gate — so a receipt reader that only
 * saw rows beside landed blocks would show the DM everything except the refusals. This is the one
 * write that carries no prose, and it is a no-op on an artefact with no current epoch: receipts
 * belong to a render, and a render that landed nothing has none.
 *
 * @param {unknown} prose @param {{advanceSeq: number, tab?: string, receipts: object[]}} landing
 * @returns {object} a NEW artefact, or a clone when there is nothing to file
 */
export function landReceipts(prose, landing) {
  if (!isArtefact(prose)) return isObj(prose) ? clone(prose) : emptyArtefact();
  const rows = Array.isArray(landing?.receipts) ? landing.receipts : [];
  const next = clone(prose);
  const current = next.current;
  if (!isObj(current) || rows.length === 0) return next;
  const seq = typeof landing?.advanceSeq === 'number' ? landing.advanceSeq : 0;
  if (current.advanceSeq !== seq) return next;
  if (!Array.isArray(current.receipts)) current.receipts = [];
  current.receipts = mergeReceipts(current.receipts, rows.map((row) => receiptOf(row, landing.tab)));
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
 * @param {{state?: 'lived'|'undone'|'redone', nonce?: string, at?: string, limit?: number}} [how]
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
  ], how.limit);
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
 * @param {{advanceSeq: number, nonce?: string, at?: string, limit?: number}} restore the depth restored TO
 * @returns {object} a NEW artefact
 */
export function restoreToDepth(prose, restore) {
  if (!isArtefact(prose)) return isObj(prose) ? clone(prose) : emptyArtefact();
  const depth = typeof restore?.advanceSeq === 'number' ? restore.advanceSeq : 0;
  const nonce = str(restore?.nonce);
  const at = str(restore?.at);
  let next = clone(prose);

  // ⭐ THE PENDING RECORD GOES BACK WITH THE EPOCH IT BELONGS TO (§5b UNDO, schema /2). It is the
  // typed record of an advance that has just been reverted: the world never took that step, so
  // there is nothing for it to licence and keeping it would tell the next render that fields moved
  // in an epoch the campaign no longer has. A record at or below the restored depth is untouched.
  const pending = pendingRecordOf(next);
  if (pending && typeof pending.advanceSeq === 'number' && pending.advanceSeq > depth) {
    delete next.pendingRecord;
  }

  const openSeq = currentAdvanceSeq(next);
  if (openSeq !== null && openSeq > depth) {
    next = retireCurrent(next, { state: 'undone', nonce, at, limit: restore?.limit });
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
  next.epochs = rotate(kept, restore?.limit);

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

/**
 * Keep the lane bounded, oldest first out. `limit` is the caller's tier policy; it is CLAMPED to
 * SCRIBE_PAST_EPOCH_LIMIT in both directions, so a caller can never widen the blob past the hard
 * ceiling and a missing or nonsense number falls back to it rather than to unbounded growth.
 * @param {object[]} lane @param {number} [limit]
 */
function rotate(lane, limit) {
  const rows = Array.isArray(lane) ? lane : [];
  const want = Number.isFinite(limit) && limit >= 0
    ? Math.min(Math.floor(/** @type {number} */ (limit)), SCRIBE_PAST_EPOCH_LIMIT)
    : SCRIBE_PAST_EPOCH_LIMIT;
  return rows.length <= want ? rows : rows.slice(rows.length - want);
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
 * @template {{[key: string]: unknown}} S
 * @param {S|null|undefined} settlement @returns {S|null|undefined}
 */
export function stripProse(settlement) {
  if (!isObj(settlement)) return settlement;
  if (!(SCRIBE_SETTLEMENT_KEY in settlement)) return settlement;
  const next = { ...settlement };
  delete next[SCRIBE_SETTLEMENT_KEY];
  return next;
}

/**
 * Attach an artefact to a settlement, or remove it when the artefact is empty. THE ONLY write
 * of the key in the estate; every other module goes through here.
 * @template {{[key: string]: unknown}} S
 * @param {S} settlement @param {unknown} prose @returns {S}
 */
export function attachProse(settlement, prose) {
  if (!isObj(settlement)) return settlement;
  if (!isArtefact(prose)) return /** @type {S} */ (stripProse(settlement));
  return { ...settlement, [SCRIBE_SETTLEMENT_KEY]: prose };
}

/**
 * Read the artefact off a settlement, or null.
 * @param {unknown} settlement @returns {ScribeArtefact|null}
 */
export function proseOf(settlement) {
  if (!isObj(settlement)) return null;
  const prose = /** @type {{[key: string]: unknown}} */ (settlement)[SCRIBE_SETTLEMENT_KEY];
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
