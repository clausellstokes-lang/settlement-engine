/**
 * domain/npc/characterDrift.js — THE DRIFT STATE (W-LIVES car L2;
 * DESIGN_W_LIVES.md §2, as amended by §15's panel fold, which OUTRANKS it).
 *
 * WHAT THIS HOLDS. A paradigm chart has two halves. The AUTHORED CORE lives on the
 * entity (`entity.character.axes[axisId] = { pole, level }`) and is the user's; what
 * a life does to it lives HERE, in the campaign's world state, as a sparse per-axis
 * OFFSET. Effective position is core + offset, clamped to the spectrum, and it is
 * read through ONE chokepoint (`effectiveCharacter`) so no consumer can ever grow a
 * second opinion about who somebody is.
 *
 * ── THE KEY IS THE DURABLE IDENTITY, AND THAT IS THE WHOLE RULING ────────────
 *
 * §2 wrote the home as `worldState.characterDrift[npcUid]` "beside npcStates, which
 * already keys NPCs by the composite npcId(settlementId, npc, index)". The L2 recon
 * REFUTED that composite by execution: on a section reroll the old slot id does not
 * orphan, it REBINDS — a keeper moved npc_6 -> npc_8 while `npc_6` came to name a
 * different human being. On a positional key a drift map transfers a soul's chart
 * WHOLE to a stranger, and no prune can ever catch it because the key stays live.
 * For a user-authored chart that is corruption of authored data.
 *
 * So drift is keyed on `wnpc_<hash>` — npcLedger.js's durable, world-scoped
 * identity, whose own charter is precisely that "a positional id cannot name a
 * person ACROSS settlements or ACROSS rerolls". The rebind class is not remembered
 * at every future churn site; it is STRUCTURALLY IMPOSSIBLE, because the ledger's
 * lookup key carries the NAME and a stranger at the old slot therefore resolves to
 * nobody (executed: `durableIdForRoster` returns null for the stranger).
 *
 * GRADUATE ON FIRST DRIFT WRITE. An NPC gains a durable identity the first time an
 * offset actually MATERIALIZES — never on a sub-epsilon nudge, so the floor governs
 * graduation exactly as it governs the map. The mint is the ledger's existing one,
 * and its three load-bearing properties were verified by execution before this
 * module was written rather than taken on the header's word: it is IDEMPOTENT (a
 * second graduation returns the same id, `minted:false`, and the SAME worldState
 * reference), it is ZERO-RNG (a live PRNG stream sits at the same position on both
 * sides of a graduation), and it is DORMANT-CLEAN (dark ⇒ null id, same reference,
 * JSON-identical world).
 *
 * NO DRIFT WITHOUT A DURABLE IDENTITY. When the ledger cannot mint one — it is
 * dark — the write is REFUSED rather than falling back to a positional key. A
 * fallback would be the refuted design wearing a cure's name.
 *
 * ── THE TWO PANEL AMENDMENTS THIS FILE IMPLEMENTS ────────────────────────────
 *
 * F9, THE MATERIALIZATION FLOOR. An ambient pull writes a key only when the
 * accumulated offset would cross a sub-band epsilon; below it, NOTHING
 * materializes. That is what lets full-paradigm ambient pull touch every axis while
 * the stored map stays sparse — sparsity is structural here, not a convention. The
 * floor works in both directions: an offset that decays back under it removes its
 * key, so a soul that returns to its authored core is byte-identical to one that
 * never drifted.
 *
 * ⚠ AND THE CONSEQUENCE F9 DOES NOT STATE, MEASURED HERE AND NAMED FOR THE FUNNEL
 * CAR: because nothing below the floor is stored, nothing below the floor
 * ACCUMULATES. A per-tick pull smaller than the epsilon starts from zero every tick
 * and can never cross, however many ticks pass — sparsity is bought with exactly
 * that. Whether that is the intent ("a pull too faint to move a soul in one lesson
 * is not a lesson") or wants a sub-floor accumulator is an OWNER ROW, carried in
 * DRIFT_PROVENANCE and pinned in the test so the experience funnel meets it as a
 * documented law rather than as a mystery about why nobody ever drifts.
 *
 * F11, THE PER-AXIS OFFSET CLAMP. Linear pull and decay equilibrate at
 * x* = pull/(1-decay), which is unbounded as decay approaches 1 — so an unclamped
 * accumulator grows invisibly behind a position that looks pinned at the spectrum
 * edge, and one later tuning change teleports the soul. The clamp is explicit and
 * BAND-BOUNDED: no stored offset may exceed the spectrum's own full span, which is
 * exactly the offset that carries one pole's extreme to the other's. A TIGHTER
 * clamp is owner taste and is named as such below.
 *
 * ROUNDING AT PERSISTENCE ONLY (the bandedStock discipline). Callers accumulate in
 * full precision and this module rounds once, where it knows its own serialized
 * width. Two consequences that are the point: `n` pulls of `k` and one pull of
 * `n*k` cannot disagree in the persisted bytes over floating-point associativity
 * noise (the class that moved 1 leaf of 29 in the §713 dormancy wave), and a
 * codepoint-ordered fold means a persisted map is permutation-independent.
 *
 * READ-LAST / WRITE-NEXT. An offset is stamped with the tick it was written ON, and
 * `axisOffsetAt(worldState, id, axis, tick)` counts only offsets written STRICTLY
 * EARLIER. Within one tick every reader therefore sees the same chart no matter
 * where in the fold order it runs, which is what makes a multi-source pull
 * order-independent instead of order-dependent-and-nobody-noticed.
 *
 * ── DORMANT, TWICE OVER (law 5) ─────────────────────────────────────────────
 *
 * 1. THE DOOR: `characterDriftActive` reads the VIRTUAL flag
 *    `simulationRules.characterDriftEnabled`, which has NO entry in
 *    DEFAULT_SIMULATION_RULES (the npcCredibility / npcLadder / npcConsequences
 *    idiom), so it is absent in every existing campaign and every entry point that
 *    writes is a whole-function early return. ⚠ TE-VIRT-1 OWES THE FLAG'S HOME —
 *    the registration that lets a rule surface turn it on. THAT REGISTRATION IS
 *    THE ONLY WIRING NEEDED; the seam is `CHARACTER_DRIFT_FLAG_KEY` below, and it
 *    is named in code so the flag car has an address rather than a search.
 * 2. NO PRODUCTION CALLER AT ALL. Nothing in src/ imports this module, proved by a
 *    walker rather than promised (the L1 idiom). The experience funnel that will
 *    call it is car L3+; this car lands the state and its laws.
 *
 * PURE. No store, no clock, no PRNG, no React, no I/O, no mutation. Every fold is
 * codepoint-ordered, and every entry point returns the SAME worldState reference
 * when it changes nothing.
 *
 * @see docs/DESIGN_W_LIVES.md §2, §4, §15 (F9, F11)
 * @see docs/OWNER_DECISION_QUEUE.md §800.2, §800.4, §806, §850
 * @enforced-by tests/domain/npc/characterDrift.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { durableIdForRoster, graduateNpc } from '../worldPulse/npcLedger.js';

/** The world-state key the sparse drift map lives under (DESIGN_W_LIVES §2). */
export const CHARACTER_DRIFT_KEY = 'characterDrift';

/**
 * THE DOOR SEAM — the virtual flag TE-VIRT-1 owes a home to.
 *
 * Named as a constant rather than spelled inline at the one read site so the flag
 * car can find its own address by symbol, and so a second reader can never invent a
 * second spelling of the same switch.
 *
 * ── ⭐⭐ THE ONE-SPELLING RULING (substrate coupling; TE-VIRT-1's two-spelling find) ──
 *
 * DESIGN_W_LIVES §8 specifies TWO virtual doors by name, and the built seam has ONE.
 * TE-VIRT-1 found the discrepancy and it is settled here rather than carried, because
 * a door whose name is undecided is a door two cars will register twice. Both of the
 * volume's names are recorded below as ACTS — what was decided and why — rather than
 * as dead tokens, per the §769.4 tombstone law; neither is minted anywhere in the
 * tree, and `tests/domain/npc/characterDrift.test.js` walks the code to prove it.
 *
 * ⛔ TOMBSTONE 1 — `livedExperienceEnabled` WAS RULED THE SAME DOOR AS THIS ONE, AND
 * IS NOT MINTED. The volume gives it "funnel + drift"; the built seam gates both
 * through this single key, and that is not an accident of construction but a law the
 * funnel's own suite already pins in as many words — "ONE DOOR: the funnel mints NO
 * flag of its own, it rides L2's", because a family with two switches has a half-lit
 * state and nobody ever tests it. Minting the second name would create exactly the
 * half-lit cell that pin exists to make unrepresentable. Same door, one spelling, and
 * the spelling that survives is the one the code already reads.
 *
 * ⛔ TOMBSTONE 2 — `paradigmChartEnabled` WAS RULED UNNECESSARY, AND ITS DARKNESS IS
 * STRUCTURAL INSTEAD. The volume wants a flag on "the catalog-backed read path", so
 * that "legacy words keep projecting identically when dark". That guarantee is
 * already delivered, and delivered more strongly, by an INJECTION rather than a
 * switch: `characterConsumers.effectiveDescriptors` hands back THE CALLER'S OWN ARRAY
 * BY REFERENCE while `PARADIGM_WORD_PROJECTION_SEAM` is unbound, so the identity is
 * structural rather than asserted. A flag that could only ever be ON once an
 * injection was bound would be a switch on a road that cannot speak — a second thing
 * to get wrong protecting a property that cannot be violated. If the pen later wants
 * a user-facing dial for the read path, it registers beside this key rather than
 * reviving a name that never had a reader.
 *
 * ⚠ AND NO KEY IS REGISTERED HERE, DELIBERATELY. This ruling settles the SPELLING;
 * putting `characterDriftEnabled` into `ENGINE_GATED_VIRTUAL_RULE_KEYS` is the door
 * car's own bill and carries its own certification row. The seam stays dark: absent
 * from DEFAULT_SIMULATION_RULES, absent from every preset, and every writer below is
 * a whole-function early return.
 */
export const CHARACTER_DRIFT_FLAG_KEY = 'characterDriftEnabled';

/**
 * The band words per side, ascending. MIRRORED, NOT IMPORTED: the authority is car
 * L1's `src/domain/npc/paradigmAxisCatalog.js` (`AXIS_LEVELS`), which is UNLANDED at
 * this base — importing an unlanded sibling would make this car unbuildable alone.
 * The mirror is reconciled against L1's tree at the stack landing, and the test
 * asserts the equality the moment the catalog is present.
 * @type {readonly string[]}
 */
export const AXIS_LEVELS = Object.freeze(['a_touch', 'marked', 'defining']);

/**
 * The neutral centre. A position of 0 belongs to no pole, which is why the pole is
 * ABSENT rather than set to a third word: "neither" is not a third side.
 */
export const NEUTRAL_POSITION = 0;

/** How far one pole reaches: 3 bands, so the ladder is 7 rungs wide per axis. */
export const SPECTRUM_HALF_SPAN = AXIS_LEVELS.length;

/**
 * The offset that carries one pole's extreme to the other's, and therefore the
 * widest clamp that is still BAND-BOUNDED (F11). DERIVED, never authored: a number
 * chosen by taste here would be an unsigned tuning row wearing the authority of
 * code, and a tighter clamp is exactly the kind of row the owner signs.
 */
export const MAX_AXIS_OFFSET = 2 * SPECTRUM_HALF_SPAN;

/**
 * THE MATERIALIZATION FLOOR (F9): a quarter of one band. Below this an accumulated
 * offset is not written at all, and an existing one that falls back under it is
 * removed. The panel's own candidate value ("a quarter of `a_touch`", and one band
 * IS `a_touch`'s width), carried as a derivation rather than a magic number.
 */
export const MATERIALIZATION_EPSILON = 1 / 4;

/**
 * Decimal places kept when an offset is persisted. Fine enough that the floor is
 * exactly representable and 2,500 times coarser than the floor itself, so rounding
 * can never decide materialization; coarse enough that floating-point associativity
 * noise cannot reach the serialized bytes.
 */
export const OFFSET_DECIMALS = 4;

/**
 * `10 ** OFFSET_DECIMALS`, built by INTEGER MULTIPLICATION rather than by `**`.
 *
 * Not style: `**` is a transcendental site, and the estate's transcendental ratchet
 * refuses new ones in `src/domain` because they are the forms whose last bits are
 * NOT guaranteed identical across JavaScript engines — which is how a same-seed
 * replay diverges on somebody else's machine and nowhere on yours. A loop of
 * multiplications by 10 is correctly rounded at every step and exact for every
 * decimal width this constant will ever take.
 */
export const OFFSET_SCALE = (() => {
  let scale = 1;
  for (let i = 0; i < OFFSET_DECIMALS; i += 1) scale *= 10;
  return scale;
})();

/**
 * Provenance, in the module, so a reader who arrives at the code before the docs
 * learns the signature status here (the L1 catalog's idiom).
 * @type {Readonly<{ status: string, signedBy: string|null, keyRuling: string, ownerRows: readonly string[], consumers: string }>}
 */
export const DRIFT_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (the magnitudes are derived, not authored)',
  signedBy: null,
  keyRuling: 'ODQ 850: drift keys on the durable wnpc_ identity, graduated on first drift write',
  ownerRows: Object.freeze([
    'a TIGHTER per-axis offset clamp than the full spectrum span (F11 fixes the property, not the number)',
    'the materialization floor: F9 offers a quarter-band as a CANDIDATE',
    'sub-floor pull does NOT accumulate, because nothing sub-floor is stored: a per-tick delta under the epsilon can never cross it. Intent, or does F9 want a sub-floor accumulator',
    'whether a dead soul closes its chart or keeps it (F6 mints one chronicle receipt; drift close-out is unruled)',
  ]),
  consumers: 'NONE by design; the experience funnel is a later car',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {number} a finite number, or 0 */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * Round to the persisted width, SYMMETRICALLY about zero. `Math.round` is half-UP,
 * which rounds -0.5 to -0 and +0.5 to +1 — an asymmetry that would make a virtue
 * curdling into its own vice behave differently from the reverse, on a spectrum
 * whose whole point is that the two directions are the same journey.
 * @param {number} value @param {number} scale the persisted width, as OFFSET_SCALE
 * @returns {number}
 */
function roundSymmetric(value, scale) {
  const scaled = Math.abs(value) * scale;
  const rounded = Math.round(scaled) / scale;
  // `+ 0` normalizes -0 to 0 so a zeroed offset serializes as `0`, never `-0`.
  return (value < 0 ? -rounded : rounded) + 0;
}

/**
 * THE GATE (law 5). Reads `simulationRules[CHARACTER_DRIFT_FLAG_KEY] === true`,
 * defensively. ABSENT ⇒ false ⇒ DORMANT.
 * @param {{ simulationRules?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function characterDriftActive(worldState) {
  return asObject(asObject(worldState).simulationRules)[CHARACTER_DRIFT_FLAG_KEY] === true;
}

/**
 * @typedef {Object} AxisDrift
 * @property {number} offset      signed, in bands; clamped to +/-MAX_AXIS_OFFSET
 * @property {number} updatedTick the tick this offset was written ON
 */

/**
 * @typedef {Object} DriftWriteResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {boolean} materialized
 * @property {number} offset
 */

/**
 * @typedef {Object} GraduatedDriftWriteResult
 * @property {Record<string, unknown>} worldState
 * @property {string|null} wnpcId
 * @property {boolean} changed
 * @property {boolean} materialized
 * @property {boolean} graduated
 * @property {number} offset
 * @property {string|null} refusal
 */

/**
 * @typedef {Object} AxisPosition
 * @property {'virtue'|'vice'} [pole]  absent at neutral: "neither" is not a side
 * @property {string} [level]          an AXIS_LEVELS member; absent at neutral
 */

/**
 * The live drift map, normalized and TOTAL. An absent, garbage or partially-shaped
 * map reads as the empty one, so every accessor below is total without a guard.
 * Both levels are codepoint-sorted, so a persisted map is permutation-independent.
 * @param {{ characterDrift?: unknown } | null | undefined} worldState
 * @returns {Record<string, Record<string, AxisDrift>>}
 */
export function characterDriftOf(worldState) {
  const raw = asObject(asObject(worldState)[CHARACTER_DRIFT_KEY]);
  /** @type {Record<string, Record<string, AxisDrift>>} */
  const out = {};
  for (const wnpcId of Object.keys(raw).sort(compareCodepoint)) {
    const axes = asObject(raw[wnpcId]);
    /** @type {Record<string, AxisDrift>} */
    const entry = {};
    for (const axisId of Object.keys(axes).sort(compareCodepoint)) {
      const cell = asObject(axes[axisId]);
      const offset = clampOffset(roundSymmetric(num(cell.offset), OFFSET_SCALE));
      // AN OFFSET UNDER THE FLOOR IS NOT AN ENTRY (F9, read side): a hand-edited or
      // legacy map holding a sub-epsilon cell reads exactly like one that never had
      // it, so the sparsity law cannot be defeated by the shape of a stored file.
      if (Math.abs(offset) < MATERIALIZATION_EPSILON) continue;
      entry[axisId] = { offset, updatedTick: tickOf(cell.updatedTick) };
    }
    if (Object.keys(entry).length > 0) out[wnpcId] = entry;
  }
  return out;
}

/**
 * Fold a drift map back onto worldState, DROPPING THE WHOLE KEY when it is empty so
 * a drained map is byte-identical to a world that never had one (the conditional-
 * ledger pattern). Returns the SAME worldState reference when the serialized map is
 * unchanged; never mutates.
 * @param {Record<string, unknown>} worldState
 * @param {Record<string, Record<string, AxisDrift>>} drift
 * @returns {Record<string, unknown>}
 */
export function setCharacterDrift(worldState, drift) {
  const host = asObject(worldState);
  const next = asObject(drift);
  const empty = Object.keys(next).length === 0;
  const prior = host[CHARACTER_DRIFT_KEY];
  const priorSerialized = JSON.stringify(prior === undefined ? null : prior);
  const nextSerialized = JSON.stringify(empty ? null : next);
  if (priorSerialized === nextSerialized) return worldState;
  if (empty) {
    const out = { ...host };
    delete out[CHARACTER_DRIFT_KEY];
    return out;
  }
  return { ...host, [CHARACTER_DRIFT_KEY]: next };
}

/** Clamp one offset to the band-bounded window (F11). @param {number} offset @returns {number} */
function clampOffset(offset) {
  return Math.max(-MAX_AXIS_OFFSET, Math.min(MAX_AXIS_OFFSET, offset));
}

/**
 * The drift entry for a durable identity, or an empty object.
 * @param {{ characterDrift?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @returns {Record<string, AxisDrift>}
 */
export function driftEntryOf(worldState, wnpcId) {
  return characterDriftOf(worldState)[String(wnpcId)] || {};
}

/**
 * The stored offset on one axis (0 when there is none). The RAW read — for
 * persistence, for a chart surface, and for the accumulator that decides the next
 * write. A per-tick consumer wants `axisOffsetAt` instead.
 * @param {{ characterDrift?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @param {string} axisId @returns {number}
 */
export function axisOffsetOf(worldState, wnpcId, axisId) {
  const cell = driftEntryOf(worldState, wnpcId)[String(axisId)];
  return cell ? cell.offset : 0;
}

/**
 * The offset a reader at `tick` may see: READ-LAST. An offset written ON this tick
 * is not yet visible, so every consumer in one fold reads the same chart regardless
 * of where it runs in the order.
 * @param {{ characterDrift?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @param {string} axisId @param {number} tick
 * @returns {number}
 */
export function axisOffsetAt(worldState, wnpcId, axisId, tick) {
  const cell = driftEntryOf(worldState, wnpcId)[String(axisId)];
  return cell && cell.updatedTick < tickOf(tick) ? cell.offset : 0;
}

// ── THE SPECTRUM ──────────────────────────────────────────────────────────────
/**
 * An authored (pole, level) as a signed band position. Neutral, unknown and
 * malformed all read as 0 — a chart that cannot be understood is a chart with no
 * claim, never a guessed one.
 * @param {AxisPosition | null | undefined} position @returns {number}
 */
export function positionValue(position) {
  const p = asObject(position);
  const rung = AXIS_LEVELS.indexOf(String(p.level));
  if (rung === -1) return NEUTRAL_POSITION;
  if (p.pole === 'virtue') return rung + 1;
  if (p.pole === 'vice') return -(rung + 1);
  return NEUTRAL_POSITION;
}

/**
 * A signed band position back to an authored (pole, level), clamped to the
 * spectrum. Rounding is symmetric so the two directions of the same journey band
 * identically.
 * @param {number} value @returns {AxisPosition}
 */
export function valuePosition(value) {
  const raw = num(value);
  const magnitude = Math.min(SPECTRUM_HALF_SPAN, Math.round(Math.abs(raw)));
  if (magnitude === 0) return {};
  return { pole: raw < 0 ? 'vice' : 'virtue', level: AXIS_LEVELS[magnitude - 1] };
}

// ── THE AUTHORED CORE'S ONE READER ────────────────────────────────────────────
/**
 * ⭐⭐ THE ONE READ OF THE AUTHORED CORE. Every reader in the estate routes here.
 *
 * ⛔ NOTHING IN THIS TREE WRITES `npc.character`, and that is MEASURED rather than
 * assumed: the observed-shape corpus carries 6,507 npc rows across 107 observed keys
 * and the key sits on NO shape at all (what a generator writes is `personality`).
 * `characterConsumers.js` states the same fact in its own header. The chart arrives
 * with car L8's edit surface — DESIGN_W_LIVES §7, whose NPC authoring surface is
 * still an undischarged RECON ROW — so until that car lands this read answers
 * `undefined` on every world this engine can generate.
 *
 * ⭐ THAT ABSENCE IS PRECISELY WHY THE READ GETS ONE HOME. A key with no writer,
 * hand-spelled at N sites, is N addresses the writer's car must find and N spellings
 * free to drift; this estate has spent whole cars killing that shape. THREE
 * hand-spelled sites existed before this one — the chokepoint below,
 * `knownCharacter.knownCharacterOf` and `livedExperienceFunnel.effectiveChartOf` —
 * and only ONE of the three was ever visible to the observed-shape register, because
 * the other two sit behind receivers its resolver cannot pin. A guard that sees one
 * of three sites was never the guard for this key; the census in
 * `tests/domain/npc/characterDrift.test.js` is, and it is SPELLING-COMPLETE where the
 * register is resolution-dependent.
 *
 * TOTAL, and byte-sparse in both directions: null, a non-object, an array, and an
 * entity carrying no chart are ONE case, and that case is `undefined` — never `{}`,
 * which would be an authored chart claiming to exist. ABSENT = NEUTRAL = ZERO BYTES.
 * A present chart comes back AS AUTHORED, BY REFERENCE, which is what keeps the
 * chokepoint's byte-identity claim structural rather than asserted.
 *
 * @param {{ character?: unknown } | null | undefined} entity  a roster record
 * @returns {unknown} the authored core by reference, or `undefined`
 */
export function authoredCharacterOf(entity) {
  const { character } = asObject(entity);
  return character;
}

// ── THE CHOKEPOINT (design §4) ────────────────────────────────────────────────
/**
 * THE ONE READ EVERY CONSUMER USES. Core plus drift, banded back into the authored
 * shape so every existing seam that reads `{ pole, level }` is untouched.
 *
 * ABSENT DRIFT ⇒ THE AUTHORED CORE, BY REFERENCE. Not a copy, not a rebuild: the
 * very object handed in. That is what makes the byte-identity claim checkable
 * rather than asserted — an undrifted world cannot differ from a pre-drift one
 * because nothing in this path constructs anything.
 *
 * @param {{ character?: unknown } | null | undefined} npc
 * @param {Record<string, AxisDrift> | null | undefined} drift  the entry for THIS npc
 * @returns {unknown} the effective character, or the authored one unchanged
 */
export function effectiveCharacter(npc, drift) {
  const core = authoredCharacterOf(npc);
  const entry = /** @type {Record<string, AxisDrift>} */ (asObject(drift));
  const axisIds = Object.keys(entry);
  if (axisIds.length === 0) return core;
  const authored = asObject(asObject(core).axes);
  /** @type {Record<string, AxisPosition>} */
  const axes = {};
  for (const axisId of [...new Set([...Object.keys(authored), ...axisIds])].sort(compareCodepoint)) {
    const cell = entry[axisId];
    if (!cell) { axes[axisId] = /** @type {AxisPosition} */ (authored[axisId]); continue; }
    const moved = valuePosition(positionValue(/** @type {AxisPosition} */ (authored[axisId])) + cell.offset);
    // A drifted axis that lands back on neutral carries no pole, so the effective
    // chart is sparse in exactly the way the authored one is.
    if (moved.pole) axes[axisId] = moved;
  }
  return { ...asObject(core), axes };
}

// ── THE WRITER ────────────────────────────────────────────────────────────────
/**
 * Apply one axis delta to an ALREADY-IDENTIFIED soul. The floor, the clamp and the
 * rounding all live here, so no caller can accumulate its own way to a stored value
 * this module would not have written.
 *
 * DORMANT, an unknown id, or a delta that does not carry the offset across the
 * floor ⇒ the SAME worldState reference and `materialized: false`.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {string} args.axisId
 * @param {number} args.delta   signed, in bands, at full precision
 * @param {number} args.tick
 * @returns {DriftWriteResult}
 */
export function applyAxisDrift({ worldState, wnpcId, axisId, delta, tick }) {
  const id = String(wnpcId == null ? '' : wnpcId);
  const axis = String(axisId == null ? '' : axisId);
  const none = { worldState, changed: false, materialized: false, offset: 0 };
  if (!characterDriftActive(worldState) || !id || !axis) return none;

  const drift = characterDriftOf(worldState);
  const entry = drift[id] || {};
  const prior = entry[axis] ? entry[axis].offset : 0;
  const offset = clampOffset(roundSymmetric(prior + num(delta), OFFSET_SCALE));
  const materialized = Math.abs(offset) >= MATERIALIZATION_EPSILON;
  if (!materialized && !entry[axis]) return { ...none, offset: 0 };

  /** @type {Record<string, AxisDrift>} */
  const nextEntry = {};
  for (const key of Object.keys(entry).sort(compareCodepoint)) {
    if (key === axis) continue;
    nextEntry[key] = entry[key];
  }
  // F9 BOTH WAYS: an offset that decays back under the floor DELETES its cell, so a
  // soul that returns to its authored core serializes as one that never left it.
  if (materialized) nextEntry[axis] = { offset, updatedTick: tickOf(tick) };

  /** @type {Record<string, Record<string, AxisDrift>>} */
  const nextDrift = {};
  for (const key of Object.keys(drift).sort(compareCodepoint)) {
    if (key === id) continue;
    nextDrift[key] = drift[key];
  }
  if (Object.keys(nextEntry).length > 0) nextDrift[id] = sortedAxes(nextEntry);

  const next = setCharacterDrift(worldState, sortedEntries(nextDrift));
  return { worldState: next, changed: next !== worldState, materialized, offset: materialized ? offset : 0 };
}

/**
 * THE GRADUATION DOOR — the whole point of car L2's identity ruling.
 *
 * Resolves a roster NPC to its durable identity, MINTING one only when a drift
 * offset genuinely materializes, and refuses outright rather than falling back to a
 * positional key. The refusals are typed, because "nothing happened" and "nothing
 * COULD happen here" are different facts a caller may need to tell apart.
 *
 *   'dormant'              — the drift flag is dark (TE-VIRT-1's door is shut)
 *   'no_durable_identity'  — the ledger is dark, so no id can exist; NEVER fall back
 *   'below_floor'          — F9: the pull did not cross the epsilon, so nothing was
 *                            written AND nobody was graduated for nothing
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.settlementSeed
 * @param {string} args.settlementId
 * @param {{ rosterId?: unknown, name?: unknown, role?: unknown }} args.rosterIdentity
 * @param {string} args.axisId
 * @param {number} args.delta
 * @param {number} args.tick
 * @returns {GraduatedDriftWriteResult}
 */
export function writeAxisDrift({
  worldState, settlementSeed, settlementId, rosterIdentity, axisId, delta, tick,
}) {
  /** @param {string} refusal @returns {GraduatedDriftWriteResult} */
  const refuse = (refusal) => ({
    worldState, wnpcId: null, changed: false, materialized: false, graduated: false, offset: 0, refusal,
  });
  if (!characterDriftActive(worldState)) return refuse('dormant');

  // The EXISTING id first, and it is a pure read: resolving before minting is what
  // keeps graduation idempotent and keeps the floor in charge of who graduates.
  const existing = durableIdForRoster(worldState, settlementId, rosterIdentity);
  const prior = existing ? axisOffsetOf(worldState, existing, axisId) : 0;
  const prospective = clampOffset(roundSymmetric(prior + num(delta), OFFSET_SCALE));
  if (Math.abs(prospective) < MATERIALIZATION_EPSILON) {
    // Below the floor: no key, and — the point of doing this BEFORE the mint — no
    // graduation either. A soul is not made world-scoped by a nudge that vanished.
    if (!existing) return refuse('below_floor');
    const decayed = applyAxisDrift({ worldState, wnpcId: existing, axisId, delta, tick });
    return { ...decayed, wnpcId: existing, graduated: false, refusal: 'below_floor' };
  }

  let host = worldState;
  let wnpcId = existing;
  let graduated = false;
  if (!wnpcId) {
    const out = graduateNpc({
      worldState, settlementSeed, settlementId, rosterIdentity, tick,
    });
    // The ledger is dark. There is no durable identity to key on, and the refuted
    // positional fallback is not on the table, so nothing is written at all.
    if (!out.wnpcId) return refuse('no_durable_identity');
    host = out.worldState;
    wnpcId = out.wnpcId;
    graduated = out.minted;
  }
  const applied = applyAxisDrift({ worldState: host, wnpcId, axisId, delta, tick });
  return {
    worldState: applied.worldState,
    wnpcId,
    // A graduation that minted a ledger record is itself a change, even in the
    // impossible case where the offset write turned out to be a no-op.
    changed: applied.changed || host !== worldState,
    materialized: applied.materialized,
    graduated,
    offset: applied.offset,
    refusal: null,
  };
}

/** @template T @param {Record<string, T>} map @returns {Record<string, T>} */
function sortedAxes(map) {
  /** @type {Record<string, T>} */
  const out = {};
  for (const key of Object.keys(map).sort(compareCodepoint)) out[key] = map[key];
  return out;
}

/** @template T @param {Record<string, T>} map @returns {Record<string, T>} */
function sortedEntries(map) {
  /** @type {Record<string, T>} */
  const out = {};
  for (const key of Object.keys(map).sort(compareCodepoint)) out[key] = map[key];
  return out;
}
