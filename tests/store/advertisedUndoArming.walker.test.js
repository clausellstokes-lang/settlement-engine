/**
 * advertisedUndoArming.walker.test.js — WAVE R-4: the ADVERTISED-UNDO INVARIANT
 * (the missing half of the queue-#5 cure; atlas VI.3 #62, atlas queue #5).
 *
 * THE DEFECT CLASS. A registry row can SAY recovery exists and be believed by
 * every reader — the Compendium renders a "reversible" badge straight off
 * `undoToken` (RegistryHubs.jsx), the search index keys on it, the future
 * Surveyor will plan against it — while NOTHING in the code arms that recovery.
 * R-0 found five pulse rows advertising `undoLastPulse` against exactly ONE push
 * site and de-advertised two of them; R-1 armed a third for real. This walker is
 * the standing guard that no row may drift back, in EITHER direction.
 *
 * WHAT WAS ALREADY GUARDED (this file EXTENDS, never re-asserts):
 *   • tests/store/operationRegistry.walker.test.js — (a) the set()-usage census
 *     proving registered ⊆ real mutating actions and back, (b) the undoState
 *     GRAMMAR + the token⇔state agreement in both directions. Because that file
 *     proves `covered ⊆ census`, a token resolving into OPERATIONS here is
 *     transitively proven to name a REAL mutating action; this file does not
 *     re-run the census.
 *   • tests/store/pulseUndoAdvertising.test.js — BEHAVIOURAL pins on the five
 *     pulse ops, on a real zustand store (pushes, cap-flood, reload corner).
 *   • tests/store/mapSlice.undo.test.js — behavioural map undo/redo pins.
 * Those prove metadata coherence and five ops' runtime behaviour. NONE of them
 * asks the question this file asks: for EVERY advertising row, where is the
 * arming, and does every arming site belong to a row that advertises?
 *
 * WHAT COUNTS AS ADVERTISING (the denominator). The R-0 tri-state grammar in the
 * registry header splits `undoState` into claims and non-claims:
 *   ADVERTISING (recovery is CLAIMED to exist):
 *     'action'          — armed, full restore through the named inverse
 *     'action-partial'  — armed, primary state only
 *     'external:<ref>'  — recovery through OTHER machinery named by <ref>
 *     'partial:<ref>'   — recovery elsewhere, partial in scope
 *   NOT ADVERTISING (no claim to prove):
 *     'none'            — undo would make sense, is NOT built (an honest gap)
 *     'irreversible'    — one-way by design
 *     'not-applicable'  — nothing to undo (loads, pointers, the undo verbs)
 *     'undetermined'    — explicitly unclassified rather than guessed
 * The brief's shorthand was "anything but none/irreversible"; that would sweep in
 * 'not-applicable' and 'undetermined', which claim NOTHING and so have nothing to
 * arm. Widening the denominator to them would make the walker demand evidence for
 * a non-claim — the opposite of honesty. The narrowing is recorded here so the
 * choice is visible and vetoable.
 *
 * THE ARMING MODEL. Every advertising row resolves to exactly one arming kind.
 * The kinds are ordered by how much this source scan can actually prove:
 *
 *   PROVEN AT THE SITE (the walker reads the code and would red if it changed):
 *     'ring'          — the op's own body pushes onto a named session ring.
 *     'ring-transaction' — armed by ANOTHER op's push inside the same transaction
 *                       (resolveIntervalMajors rides the paused advance's push).
 *     'delegates'     — the op re-enters an armed op (catchUp → advance).
 *     'map-snapshot'  — a mapSlice op whose body calls snapshotForUndo.
 *     'map-push'      — a mapSlice op that writes an undo/redo ring directly.
 *     'map-caller'    — arming lives in the CONSUMER (pushMapUndo at drag-start);
 *                       proven by requiring a consumer file that does both.
 *     'record'        — the op appends to a durable record the recovery verb
 *                       consumes (eventLog → undoLastEvent; versionHistory →
 *                       revertToSnapshot).
 *     'tombstone'     — the canonize/uncanonize session tombstone (R-1).
 *   REFERENTIAL ONLY (derived, not hand-listed; see CANNOT-CATCH 1):
 *     'inverse-verb'  — the named inverse resolves to a registered operation.
 *     'external-mechanism' — <ref> is a hyphenated token from the frozen
 *                       mechanism vocabulary below.
 *
 * A row whose undoToken (or external/partial <ref>) names one of the RING_VERBS
 * — the verbs backed by a real snapshot/record mechanism — MUST carry a
 * hand-audited ARMING entry. That is the fail-closed hinge: a new row that
 * advertises `undoLastPulse` or `mapUndo` cannot ship on metadata alone.
 *
 * ROW-CLASS-CONDITIONAL ARMING, MODELLED HONESTLY (the R-3 lesson). undoLastEvent
 * refuses flat destroy rows BY DESIGN (typed `entry_not_undoable`) while the op
 * still advertises for real entries. Flattening that to "armed" or "not armed"
 * would be a new lie, so the eventLog record kind carries an explicit
 * `conditional` note plus the refusal token, and the walker asserts the refusal
 * exists in source. Arming is per-row-class, and the model says so.
 *
 * CANNOT-CATCH (accepted, documented — the honesty clause):
 *   1. 'inverse-verb' and 'external-mechanism' are REFERENTIAL: they prove the
 *      named recovery verb exists and is a real mutating action, not that calling
 *      it restores the prior state. Proving semantic restoration needs a
 *      behavioural round-trip per pair (the pulseUndoAdvertising idiom), which is
 *      per-op work, not a walker's. What the walker does add for them: no
 *      dangling reference, and the UNREACHABLE-INVERSE ledger below.
 *   2. The ring census reads the APPEND idiom (`[...(state.ring || []), entry]`).
 *      A push written some other way (`state.ring.push(x)`) would be invisible to
 *      direction 2. Both live rings use the append idiom; a new ring must either
 *      follow it or extend this scanner.
 *   3. Attribution walks backwards to the nearest enclosing `export function
 *      run<Op>` (the session-helper convention) or slice property key. A push
 *      buried in a non-exported local helper attributes to whatever encloses it.
 *   4. 'map-caller' proves SOME consumer file calls pushMapUndo and consumes the
 *      op; it cannot prove the push happens on the same interaction. That is
 *      exactly the gap updatePlacement fell through in the other direction (no
 *      consumer did either), which this walker now pins.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { OPERATIONS } from '../../src/store/operationRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const STORE_DIR = join(ROOT, 'src/store');

/** Drop comment and string/template contents so prose can never false-match.
 *  (The build-time source-scan idiom of the census walker next door.) */
function stripCode(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let state = 'code';
  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];
    if (state === 'code') {
      if (c === '/' && c2 === '/') { state = 'line'; i += 2; continue; }
      if (c === '/' && c2 === '*') { state = 'block'; i += 2; continue; }
      if (c === "'") { state = 'sq'; i++; continue; }
      if (c === '"') { state = 'dq'; i++; continue; }
      if (c === '`') { state = 'tpl'; i++; continue; }
      out += c; i++; continue;
    }
    if (state === 'line') { if (c === '\n') { state = 'code'; out += c; } i++; continue; }
    if (state === 'block') { if (c === '*' && c2 === '/') { state = 'code'; i += 2; } else { if (c === '\n') out += c; i++; } continue; }
    if (state === 'sq') { if (c === '\\') { i += 2; continue; } if (c === "'") state = 'code'; i++; continue; }
    if (state === 'dq') { if (c === '\\') { i += 2; continue; } if (c === '"') state = 'code'; i++; continue; }
    if (state === 'tpl') { if (c === '\\') { i += 2; continue; } if (c === '`') state = 'code'; i++; continue; }
  }
  return out;
}

function listStoreFiles() {
  return readdirSync(STORE_DIR)
    .filter((f) => f.endsWith('.js'))
    .sort();
}

const storeSource = new Map();
/** Raw (unstripped) store source — used ONLY where the evidence IS a string
 *  literal, which stripCode necessarily erases. Each such probe pins a form that
 *  cannot occur in prose (`reason: 'entry_not_undoable'`), so reading raw text
 *  does not re-open the comment-false-match hole stripCode exists to close. */
const storeRaw = new Map();
for (const f of listStoreFiles()) {
  const raw = readFileSync(join(STORE_DIR, f), 'utf8');
  storeRaw.set(f, raw);
  storeSource.set(f, stripCode(raw));
}

// ── The advertising denominator ──────────────────────────────────────────────
const ADVERTISING_STATE = /^(?:action|action-partial|external:.+|partial:.+)$/;
const isAdvertising = (op) => ADVERTISING_STATE.test(String(op.undoState));
/** The <ref> of an external:/partial: state, or null. */
const refOf = (op) => {
  const m = /^(?:external|partial):(.+)$/.exec(String(op.undoState));
  return m ? m[1] : null;
};
/** The recovery verb a row points at: its undoToken, or a verb-shaped <ref>. */
const recoveryVerbOf = (op) => {
  if (op.undoToken != null) return op.undoToken;
  const ref = refOf(op);
  return ref && !ref.includes('-') ? ref : null;
};

/**
 * The verbs whose recovery is backed by a real snapshot / record mechanism. A row
 * pointing at one of these must carry a hand-audited ARMING entry — metadata
 * alone can never satisfy it.
 */
const RING_VERBS = Object.freeze(new Set([
  'undoLastEvent',
  'undoLastPulse',
  'undoLastProposalApply',
  'revertToSnapshot',
  'mapUndo',
  'mapRedo',
  'pushMapUndo',
]));

/**
 * The frozen mechanism vocabulary: the hyphenated <ref> tokens that name recovery
 * machinery rather than a registered verb. Exact-set — a new spelling reds, and a
 * token that stops being used must be deleted here (the honesty half).
 */
const MECHANISM_VOCABULARY = Object.freeze([
  'auto-pre-revert-snapshot',
  'blob-time-travel',
  'inverse-call',
  'reconcile-replay',
  'rehydrate-from-authority',
  'restore-command',
  'revision-history',
  'rollback-migration',
  // DELETED (R-5b, owner queue #21): 'server-rebalance'. Its only two speakers were
  // addCredits and spendCredits (undoState:'external:server-rebalance'), and both
  // were RETIRED as dead ops — a client-side credit ledger beside the
  // server-authoritative one. With no row left pointing at it, the honesty half of
  // this exact-set demands the spelling go too: a vocabulary that outlives its
  // speakers starts describing recovery machinery the product no longer advertises.
]);

/**
 * THE ARMING MANIFEST — hand-audited 2026-07-27 against the live tree, one entry
 * per row whose recovery verb is a RING_VERB (plus the two tombstone rows, whose
 * arming is a mechanism even though their inverse is an ordinary verb).
 *
 * To add a row: name the mechanism and the site. If you cannot, the row does not
 * arm and must not advertise.
 */
const ARMING = Object.freeze({
  // ── eventLog record → undoLastEvent ────────────────────────────────────────
  // R-3: the pop refuses flat destroy rows BY DESIGN with a typed
  // `entry_not_undoable`, so arming is per-row-class, not global.
  applyEvent: { kind: 'record', record: 'eventLog', reader: 'undoLastEvent', conditional: 'destroy rows refuse (entry_not_undoable)' },
  applyEventBatch: { kind: 'record', record: 'eventLog', reader: 'undoLastEvent', conditional: 'destroy rows refuse (entry_not_undoable)' },
  // ROW RETIRED (R-5b, owner queue #21): `recordCanonFlavorEntry`'s registry entry
  // was removed with its dead STORE surface, so it no longer advertises undo and a
  // row here would be stale by this manifest's own honesty rule. The CAPABILITY is
  // untouched — settlementPendingEditWriters still calls recordCanonFlavorEntryImpl
  // directly, the flavour row still lands in the eventLog, and undoLastEvent still
  // pops it as an ok:true no-op (the R-3 jam cure). What disappeared is the second,
  // never-called door onto it, not the behaviour this row described.
  // ── versionHistory record → revertToSnapshot ───────────────────────────────
  recordSnapshot: { kind: 'record', record: 'versionHistory', reader: 'revertToSnapshot' },
  commitPendingEdits: { kind: 'record', record: 'versionHistory', reader: 'revertToSnapshot' },
  // ── session rings ──────────────────────────────────────────────────────────
  advanceCampaignWorld: { kind: 'ring', ring: 'pulseUndoStack' },
  applyWorldPulseProposal: { kind: 'ring', ring: 'proposalUndoStack' },
  // R-5b re-audit 2026-07-27: still transaction-armed in the normal case (the
  // paused advance's Phase-2 push covers the whole interval), but the row gained a
  // SECOND, narrow push site and the manifest records it rather than letting the
  // scan surprise a successor. `alsoPushes`: when a RELOAD-into-paused interval is
  // resumed to COMPLETION, the pre-interval snapshot lived only on the cursor being
  // cleared, so the resume adopts it onto pulseUndoStack — the advance's own push,
  // arriving late in a session that never ran the advance. It is guarded on the
  // campaign having NO stack entry, so the in-session path still pushes exactly
  // once (pinned in pulseUndoAdvertising.test.js). This does NOT reopen the R-0
  // mislabel the direction-2 assertion guards: the entry IS a pre-advance snapshot
  // and this op DOES advertise undoLastPulse, which the assertion re-checks below.
  resolveIntervalMajors: {
    kind: 'ring-transaction', ring: 'pulseUndoStack', armedBy: 'advanceCampaignWorld',
    alsoPushes: 'pulseUndoStack',
  },
  // R-5b re-audit 2026-07-27: the row was PROMOTED from the referential
  // `external:undoLastPulse` to a first-class `undoToken:'undoLastPulse'` /
  // `undoState:'action'`. The arming kind is unchanged and still exact — the site,
  // the function, and the delegated call were re-derived at the source, and the
  // delegation assertion below already fails closed if that call disappears.
  catchUpCampaignWorld: { kind: 'delegates', armedBy: 'advanceCampaignWorld', site: 'campaignAdvanceSession.js', fn: 'runCatchUpCampaignWorld' },
  // ── the map annotation ring ────────────────────────────────────────────────
  addPlacement: { kind: 'map-snapshot' },
  removePlacementLocal: { kind: 'map-snapshot' },
  clearAllPlacementsLocal: { kind: 'map-snapshot' },
  // W-G / J-D1. Hand-audited 2026-07-31: applyAutoplacement opens with exactly ONE
  // snapshotForUndo for the whole act, then delegates every coordinate write to
  // updatePlacement. That delegation is why the op advertises `mapUndo` while its
  // sibling updatePlacement is de-advertised (R-4): the arming lives in the CALLER
  // here, deliberately, so a single Undo reverts an entire placement pass rather
  // than one settlement of seven. The snapshot is taken before the first write, so
  // the restored image is genuinely pre-autoplacement.
  applyAutoplacement: { kind: 'map-snapshot' },
  addLabel: { kind: 'map-snapshot' },
  deleteLabel: { kind: 'map-snapshot' },
  addMarker: { kind: 'map-snapshot' },
  deleteMarker: { kind: 'map-snapshot' },
  addForest: { kind: 'map-snapshot' },
  deleteForest: { kind: 'map-snapshot' },
  pushMapUndo: { kind: 'map-snapshot' },
  mapUndo: { kind: 'map-push', ring: 'mapRedoStack' },
  mapRedo: { kind: 'map-push', ring: 'mapUndoStack' },
  updateLabel: { kind: 'map-caller', consumer: 'src/components/map/LabelsLayer.jsx' },
  updateMarker: { kind: 'map-caller', consumer: 'src/components/map/MarkersLayer.jsx' },
  updateForest: { kind: 'map-caller', consumer: 'src/components/map/ForestsLayer.jsx' },
  // ── the canonize session tombstone (R-1, atlas queue #25) ──────────────────
  canonize: { kind: 'tombstone', field: '_uncanonizeTombstone', role: 'restore' },
  uncanonize: { kind: 'tombstone', field: '_uncanonizeTombstone', role: 'capture' },
});

/** Rows that must carry an ARMING entry: ring-verb rows plus the tombstone pair. */
const TOMBSTONE_OPS = Object.freeze(['canonize', 'uncanonize']);
function requiresArmingEntry(op) {
  if (TOMBSTONE_OPS.includes(op.opType)) return true;
  const verb = recoveryVerbOf(op);
  return verb != null && RING_VERBS.has(verb);
}

// ── Source scanners ──────────────────────────────────────────────────────────

/**
 * Every site that APPENDS to a session ring, attributed to the operation that
 * owns it. The append idiom is `[...(state.<ring> || []), <entry>]`; attribution
 * walks back to the nearest enclosing `export [async] function run<Op>(` (the
 * session-helper convention) and lowercases its first letter.
 * @param {string} ring
 * @returns {string[]} op names, sorted and de-duplicated
 */
function ringPushOwners(ring) {
  const owners = new Set();
  const append = new RegExp(`\\[\\s*\\.\\.\\.\\(\\s*state\\.${ring}\\s*\\|\\|\\s*\\[\\s*\\]\\s*\\)\\s*,`, 'g');
  const decl = /export\s+(?:async\s+)?function\s+run([A-Z][\w$]*)\s*\(/g;
  for (const [file, code] of storeSource) {
    const decls = [...code.matchAll(decl)].map((m) => ({ at: m.index, name: m[1] }));
    for (const hit of code.matchAll(append)) {
      const enclosing = decls.filter((d) => d.at < hit.index).pop();
      owners.add(enclosing
        ? enclosing.name.charAt(0).toLowerCase() + enclosing.name.slice(1)
        : `UNATTRIBUTED@${file}`);
    }
  }
  return [...owners].sort();
}

/**
 * Depth-1 property bodies of a slice object literal, key → body text. Narrower
 * than the census walker's scanProps (which classifies the whole store surface);
 * here we only need "what is inside this action" for one file.
 * @param {string} code comment/string-stripped source
 */
function sliceActionBodies(code) {
  const bodies = new Map();
  const key = /\n {2}([A-Za-z_$][\w$]*)\s*:\s*(?=[^\n]*=>|\(|async)/g;
  const hits = [...code.matchAll(key)];
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].index + hits[i][0].length;
    const end = i + 1 < hits.length ? hits[i + 1].index : code.length;
    bodies.set(hits[i][1], code.slice(start, end));
  }
  return bodies;
}

const MAP_SLICE = storeSource.get('mapSlice.js') || '';
const mapBodies = sliceActionBodies(MAP_SLICE);

/** mapSlice ops whose own body arms the annotation undo ring. */
function mapArmingOwners() {
  const out = [];
  for (const [name, body] of mapBodies) {
    if (/(?<![\w$.])snapshotForUndo\s*\(/.test(body)) out.push(name);
    else if (/state\.map(?:Undo|Redo)Stack\.push\s*\(/.test(body)) out.push(name);
  }
  return out.sort();
}

/** Product files (outside src/store) that call the named store verb. */
function productFilesCalling(verb) {
  const out = [];
  const call = new RegExp(`(?<![\\w$.])${verb}\\s*\\(`);
  const read = new RegExp(`\\.${verb}(?![\\w$])`);
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.(js|jsx)$/.test(p)) continue;
      const rel = relative(ROOT, p).replace(/\\/g, '/');
      if (rel.startsWith('src/store/')) continue;
      const code = stripCode(readFileSync(p, 'utf8'));
      if (read.test(code) && call.test(code)) out.push(rel);
    }
  };
  walk(join(ROOT, 'src'));
  return out.sort();
}

// ── The suites ───────────────────────────────────────────────────────────────

const ALL_OPS = Object.values(OPERATIONS);
const ADVERTISERS = ALL_OPS.filter(isAdvertising);

describe('R-4 advertised-undo invariant — the denominator is real', () => {
  test('a non-trivial set of rows advertises recovery (the scanner did not collapse)', () => {
    // Anti-vacuity: if isAdvertising ever stopped matching, every assertion below
    // would pass over an empty set. The registry carries ~180 ops and roughly half
    // claim some recovery; assert we are in that regime.
    expect(ADVERTISERS.length).toBeGreaterThan(60);
    expect(ADVERTISERS.length).toBeLessThan(ALL_OPS.length);
  });

  test('the advertising classifier discriminates (positive control)', () => {
    expect(isAdvertising({ undoState: 'action' })).toBe(true);
    expect(isAdvertising({ undoState: 'action-partial' })).toBe(true);
    expect(isAdvertising({ undoState: 'external:deleteCampaign' })).toBe(true);
    expect(isAdvertising({ undoState: 'partial:pushMapUndo' })).toBe(true);
    expect(isAdvertising({ undoState: 'none' })).toBe(false);
    expect(isAdvertising({ undoState: 'irreversible' })).toBe(false);
    expect(isAdvertising({ undoState: 'not-applicable' })).toBe(false);
    expect(isAdvertising({ undoState: 'undetermined' })).toBe(false);
  });
});

describe('R-4 advertised-undo invariant — every claim resolves to an arming', () => {
  test('every mechanism-backed advertiser carries a hand-audited ARMING entry', () => {
    const missing = ADVERTISERS
      .filter(requiresArmingEntry)
      .filter((op) => !ARMING[op.opType])
      .map((op) => `${op.opType} (undoState:${op.undoState}, undoToken:${JSON.stringify(op.undoToken)})`);
    // A NEW row advertising a snapshot/record-backed verb (undoLastPulse,
    // undoLastEvent, mapUndo, revertToSnapshot, undoLastProposalApply,
    // pushMapUndo) landed with no arming evidence. Either arm it and add its
    // ARMING row here, or say so honestly in the registry: 'none' if the undo
    // could be built and is not, 'irreversible' if it is one-way by design.
    expect(missing, `\nAdvertising rows with no arming entry:\n  ${missing.join('\n  ')}\n`).toEqual([]);
  });

  test('the ARMING manifest carries NO stale rows (every entry still advertises)', () => {
    // The monotone other half: an op that was de-advertised, renamed or retired
    // must lose its arming row too, or the manifest starts describing a world
    // that no longer exists.
    const advertisingNames = new Set(ADVERTISERS.map((op) => op.opType));
    const stale = Object.keys(ARMING).filter((name) => !advertisingNames.has(name)).sort();
    expect(stale, `\nARMING rows whose op no longer advertises:\n  ${stale.join('\n  ')}\n`).toEqual([]);
  });

  test('every referential advertiser names a recovery that resolves', () => {
    const bad = [];
    for (const op of ADVERTISERS) {
      if (ARMING[op.opType]) continue;
      const verb = recoveryVerbOf(op);
      if (verb) {
        if (!OPERATIONS[verb]) bad.push(`${op.opType} → unregistered verb ${JSON.stringify(verb)}`);
        continue;
      }
      const ref = refOf(op);
      if (!ref) { bad.push(`${op.opType} → armed state with no undoToken and no ref`); continue; }
      if (!MECHANISM_VOCABULARY.includes(ref)) {
        bad.push(`${op.opType} → mechanism token ${JSON.stringify(ref)} outside the frozen vocabulary`);
      }
    }
    // A dangling reference is the cheapest way for an undo promise to rot: the
    // named verb gets renamed or retired and the row keeps promising it. Either
    // point at a live registered verb, or use a frozen mechanism token (and add
    // the token to MECHANISM_VOCABULARY in the same change).
    expect(bad, `\nUnresolvable recovery references:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('the frozen mechanism vocabulary is exactly the set in use (no dead spellings)', () => {
    const used = new Set();
    for (const op of ADVERTISERS) {
      const ref = refOf(op);
      if (ref && ref.includes('-')) used.add(ref);
    }
    expect([...used].sort()).toEqual([...MECHANISM_VOCABULARY].sort());
  });
});

describe('R-4 advertised-undo invariant — the session rings, BOTH directions', () => {
  /** Every op DECLARED to push `ring`: its primary ring owner, plus any row that
   *  declares a secondary `alsoPushes` site (R-5b). Both kinds are audited entries
   *  with a written mechanism; an UNdeclared site still reds. */
  const declaredFor = (ring) => Object.entries(ARMING)
    .filter(([, a]) => (a.kind === 'ring' && a.ring === ring) || a.alsoPushes === ring)
    .map(([name]) => name)
    .sort();

  test('pulseUndoStack: exactly the declared ops push, and each one advertises it', () => {
    const owners = ringPushOwners('pulseUndoStack');
    // Direction 1 (declared ⊆ found): a row claiming a pulse-ring push must really
    // push. Direction 2 (found ⊆ declared): a NEW push site whose op does not
    // advertise would silently re-create the R-0 mislabel — a snapshot popped
    // through "Undo Advance" that was never an advance.
    expect(owners).toEqual(declaredFor('pulseUndoStack'));
    // Named explicitly so a failure reads as "the push-site roster changed", not
    // "an unknown op appeared". advanceCampaignWorld is the primary arming site;
    // resolveIntervalMajors adopts the SAME advance's snapshot off a cleared
    // reload-into-paused cursor (see its ARMING entry for why that is not a
    // second kind of undo).
    expect(owners).toEqual(['advanceCampaignWorld', 'resolveIntervalMajors']);
    for (const name of owners) {
      expect(OPERATIONS[name].undoToken, `${name} pushes the pulse ring but advertises nothing`)
        .toBe('undoLastPulse');
    }
  });

  test('proposalUndoStack: exactly the declared op pushes, against its OWN verb', () => {
    const owners = ringPushOwners('proposalUndoStack');
    expect(owners).toEqual(declaredFor('proposalUndoStack'));
    expect(owners).toEqual(['applyWorldPulseProposal']);
    // R-1's separation-by-construction: the proposal ring is popped by its own
    // labelled verb, never by "Undo Advance".
    expect(OPERATIONS.applyWorldPulseProposal.undoToken).toBe('undoLastProposalApply');
  });

  test('the R-0 de-advertised pulse ops still push NOTHING (regression guard)', () => {
    // The de-advertising work must not silently regress: if either op grew a
    // push, direction 2 above would already red — this names them so the failure
    // reads as "the R-0 ruling was reversed", not "an unknown op appeared".
    const pushers = new Set(ringPushOwners('pulseUndoStack'));
    for (const name of ['canonizeCampaignWorld', 'recordPartyImpact']) {
      expect(pushers.has(name), `${name} regained a pulse-ring push`).toBe(false);
      expect(OPERATIONS[name].undoToken).toBeNull();
      expect(OPERATIONS[name].undoState).toBe('none');
    }
  });

  test('the transaction-armed and delegating rows really reach an armed op', () => {
    // resolveIntervalMajors is armed by the paused advance's Phase-2 push, not by
    // one of its own; catchUpCampaignWorld re-enters the advance verb. Both are
    // honest only while the op they lean on still arms.
    for (const [name, arming] of Object.entries(ARMING)) {
      if (arming.kind !== 'ring-transaction' && arming.kind !== 'delegates') continue;
      const base = ARMING[arming.armedBy];
      expect(base, `${name} is armed by ${arming.armedBy}, which has no arming entry`).toBeTruthy();
      expect(base.kind).toBe('ring');
    }
    // The delegation is a real call, not a claim: catchUp re-enters the advance.
    const advanceSession = storeSource.get('campaignAdvanceSession.js') || '';
    const catchUpAt = advanceSession.indexOf('export async function runCatchUpCampaignWorld');
    expect(catchUpAt).toBeGreaterThan(-1);
    expect(
      /get\(\)\.advanceCampaignWorld\s*\(/.test(advanceSession.slice(catchUpAt)),
      'runCatchUpCampaignWorld no longer re-enters advanceCampaignWorld — external:undoLastPulse is now false',
    ).toBe(true);
  });
});

describe('R-4 advertised-undo invariant — the map annotation ring, BOTH directions', () => {
  test('the mapSlice body scan found the action surface (not vacuous)', () => {
    expect(mapBodies.size).toBeGreaterThan(30);
    expect(mapBodies.has('addPlacement')).toBe(true);
    expect(mapBodies.has('updatePlacement')).toBe(true);
  });

  test('exactly the declared map ops arm the ring in their own body', () => {
    const declared = Object.entries(ARMING)
      .filter(([, a]) => a.kind === 'map-snapshot' || a.kind === 'map-push')
      .map(([name]) => name)
      .sort();
    // Direction 1 + 2 at once: a declared arming that stopped snapshotting, and a
    // new snapshotting op that does not advertise mapUndo, both land here.
    expect(mapArmingOwners()).toEqual(declared);
  });

  test('every self-arming map op advertises the map undo verb', () => {
    for (const name of mapArmingOwners()) {
      const op = OPERATIONS[name];
      expect(op, `${name} snapshots the map ring but is not a registered operation`).toBeTruthy();
      expect(
        op.undoToken,
        `${name} arms the map ring but advertises undoToken:${JSON.stringify(op.undoToken)}`,
      ).toMatch(/^map(Undo|Redo)$/);
      expect(op.undoState).toBe('action');
    }
  });

  test('every caller-armed map row has a consumer that ALSO pushes the snapshot', () => {
    const pushers = new Set(productFilesCalling('pushMapUndo'));
    expect(pushers.size).toBeGreaterThan(0);
    for (const [name, arming] of Object.entries(ARMING)) {
      if (arming.kind !== 'map-caller') continue;
      const consumers = productFilesCalling(name);
      const armed = consumers.filter((f) => pushers.has(f));
      // 'partial:pushMapUndo' says the arming lives in the caller. If no caller
      // both calls the op and pushes the snapshot, the claim is false — that is
      // exactly how updatePlacement's advertising failed.
      expect(
        armed,
        `\n${name} claims caller-side arming but no consumer pushes:\n  consumers: ${consumers.join(', ') || '(none)'}\n  pushMapUndo callers: ${[...pushers].join(', ')}\n`,
      ).toContain(arming.consumer);
      expect(OPERATIONS[name].undoState).toBe('partial:pushMapUndo');
    }
  });

  test('R-4 DE-ADVERTISED: updatePlacement arms nothing, at the site or the caller', () => {
    // The finding this wave closed. Both arming seats are empty, so both must
    // stay empty for the honest 'none' to hold — and if either is filled, the row
    // should be upgraded (to 'action' with a body snapshot, or to
    // 'partial:pushMapUndo' with the caller push its three siblings have).
    expect(/(?<![\w$.])snapshotForUndo\s*\(/.test(mapBodies.get('updatePlacement') || ''))
      .toBe(false);
    const consumers = productFilesCalling('updatePlacement');
    const pushers = new Set(productFilesCalling('pushMapUndo'));
    expect(consumers.length, 'updatePlacement lost its consumer').toBeGreaterThan(0);
    expect(consumers.filter((f) => pushers.has(f))).toEqual([]);
    expect(OPERATIONS.updatePlacement.undoToken).toBeNull();
    expect(OPERATIONS.updatePlacement.undoState).toBe('none');
  });

  test('negative control — the sibling rows that DO arm are distinguished', () => {
    // Guard the guard: the same two probes that clear updatePlacement must light
    // up for its armed and caller-armed siblings, or the checks above are vacuous.
    expect(/(?<![\w$.])snapshotForUndo\s*\(/.test(mapBodies.get('addPlacement') || ''))
      .toBe(true);
    const pushers = new Set(productFilesCalling('pushMapUndo'));
    expect(productFilesCalling('updateLabel').some((f) => pushers.has(f))).toBe(true);
  });
});

describe('R-4 advertised-undo invariant — records and the session tombstone', () => {
  const settlement = storeSource.get('settlementSlice.js') || '';
  // THE DECOMPOSITION WAVE (lane D) moved recordSnapshot's + revertToSnapshot's
  // bodies out of settlementSlice.js into settlementVersionHistoryActions.js, and
  // the identity/ripple helpers into settlementLifecycleHelpers.js. The
  // versionHistory probe below asks whether the record is really WRITTEN on this
  // path — not whether one filename happens to contain a substring — so it reads
  // the slice's whole module family. Left anchored on the single filename it would
  // have gone vacuous on a pure relocation: green, guarding nothing. The tombstone
  // probe keeps the narrower slice-only source on purpose; its writes are still
  // there.
  const SETTLEMENT_FAMILY = [
    'settlementSlice.js',
    'settlementLifecycleHelpers.js',
    'settlementVersionHistoryActions.js',
  ];
  const settlementFamily = SETTLEMENT_FAMILY.map((f) => storeSource.get(f) || '').join('\n');

  test('the eventLog record kind: the reader exists and its refusal is typed', () => {
    for (const [name, arming] of Object.entries(ARMING)) {
      if (arming.kind !== 'record') continue;
      expect(OPERATIONS[arming.reader], `${name} names reader ${arming.reader}`).toBeTruthy();
      expect(OPERATIONS[name].undoToken).toBe(arming.reader);
    }
    // R-3's row-class-conditional truth, asserted rather than flattened: the
    // shared planner skips flavor rows but refuses a non-undoable mechanical
    // barrier with a TYPED reason. If either half disconnects, the conditional
    // note here is stale.
    expect(/planTimelineUndo\s*\(\s*eventLog\s*\)/.test(settlement)).toBe(true);
    expect(
      /reason:\s*'entry_not_undoable'/.test(storeRaw.get('settlementSliceHelpers.js') || ''),
      'undoLastEvent lost its typed refusal — the conditional arming note in ARMING is now unproven',
    ).toBe(true);
    for (const [name, arming] of Object.entries(ARMING)) {
      if (arming.record !== 'eventLog') continue;
      expect(typeof arming.conditional, `${name} must state its row-class condition`).toBe('string');
    }
  });

  test('the versionHistory record kind: both writers really write the timeline', () => {
    const writers = Object.entries(ARMING)
      .filter(([, a]) => a.record === 'versionHistory')
      .map(([name]) => name);
    expect(writers.sort()).toEqual(['commitPendingEdits', 'recordSnapshot']);
    // The record the recovery verb reads must actually be written on this path.
    // The family must resolve — a renamed/removed module would otherwise make the
    // containment probe below trivially true-by-absence-of-check.
    for (const f of SETTLEMENT_FAMILY) {
      expect(storeSource.get(f), `${f} must exist in the store source map`).toBeTruthy();
    }
    expect(/versionHistory/.test(settlementFamily)).toBe(true);
    expect(OPERATIONS.revertToSnapshot.undoState).toBe('external:auto-pre-revert-snapshot');
  });

  test('the canonize tombstone is captured on one side and restored on the other', () => {
    const field = ARMING.canonize.field;
    expect(ARMING.uncanonize.field).toBe(field);
    // Capture and restore are both real writes to the session-only field, and the
    // pair's declared partiality is preserved (the event log is the part that
    // survives in-session and dies across reload).
    const writes = (settlement.match(new RegExp(`state\\.${field}\\s*=`, 'g')) || []).length;
    expect(writes, `${field} must be written by both the capture and the restore`).toBeGreaterThanOrEqual(2);
    expect(settlement.includes('uncanonizeTombstoneKey')).toBe(true);
    expect(OPERATIONS.canonize.undoState).toBe('action-partial');
    expect(OPERATIONS.uncanonize.undoState).toBe('action-partial');
  });
});
