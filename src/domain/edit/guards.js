/**
 * guards.js — THE GUARD ENGINE (EM-C2, wave 2; ARCH §2/§5/§6, design §2.7/§2.7a/§11/§12.8/§18).
 *
 * ONE pure function over a decree registry's PENDING entries. It judges nothing itself: the
 * rules arrive on its fourth argument and run in `compareCodepoint` order of their ids, and the
 * engine only orders the queue, builds each entry's context, normalises what a rule returns and
 * mints a stable id for it.
 *
 * ⭐ THE FOLD IS WHAT MAKES THE PROPERTY NON-VACUOUS (design §12.8). Entry i is judged against
 * the world with entries 0..i-1 applied, so a queue of ten is judged exactly as a queue of one.
 * The engine never synthesises that post-op world: `ruleSet.project` does, because only a rule
 * knows what an op does to the fact it judges, and a world the engine invented would be a
 * fiction every later rule then read as truth.
 *
 * ⛔ A RULE READS `ctx.decl.requires.registry`, NEVER `ctx.op.requires`. `makeOp` FLATTENS the
 * declaration's `{ world, registry }` pair into one array, so `op.requires` of `remove-npc` and
 * of `set-npc-status` reads a WORLD predicate that design §18 rules is not a guard's business at
 * all (it decides which seals a card OFFERS). The engine therefore hands the DECLARATION through
 * on `ctx.decl` and never reads `op.requires` itself.
 *
 * ⛔ NOTHING HERE CAN REFUSE. Every guard carries `proceed`, appended when the rule left it out,
 * and a guard whose id the entry already recorded in `overrode` is MARKED `overridden` rather
 * than suppressed: a surface may hide a marked guard, and could never recover a suppressed one.
 * A malformed registry, entry, rule or finding is SKIPPED at the narrowest scope that can skip
 * it, because design §9 rules that a false warning costs more trust than a missing one.
 *
 * ⛔ THE LEAF IMPORTS EXACTLY ONE MODULE. `../deterministicSort.js` and nothing else: no rule
 * module, no registry, no catalogue, no `src/generators` specifier (the landed shrink-only
 * ratchet `tests/build/domainGeneratorsBoundary.test.js` reds a static OR a dynamic one). The
 * two generator writers a rule needs arrive INJECTED on `ruleSet.deps`, and the engine checks
 * each rule's `needs` against that bag ONCE, before the fold, so a mis-wired caller is NAMED in
 * `unevaluated` instead of reading as clean coverage.
 *
 * ⛔ IT LANDS DARK BY HAVING ZERO IMPORTERS, which is stronger than a flag: no reachable path
 * calls it until EM-C4b wires it behind the tier gate. EM-C3's `guardRules.js` is its first
 * importer; it names the typedefs below type-only and imports the two value vocabularies.
 *
 * PURE and TOTAL: no clock, no PRNG, no locale, no store, no I/O, and nothing it is handed is
 * mutated or frozen in place. It reads no settlement field and writes no state at all.
 */

/** @typedef {import('./types.js').Op} Op */

import { compareCodepoint } from '../deterministicSort.js';

/**
 * The rule set's fold, and the ONLY thing that may synthesise a post-op world (§5 clause item
 * 7). Pure: it returns a NEW world, and `undefined` or `null` leaves the world where it was.
 * @typedef {(world: unknown, op: Op, catalogue: unknown) => unknown} ProjectFn
 */

/**
 * The frozen context ONE rule is handed (§5 clause item 5). `decl` is the catalogue's row for
 * the entry's own op type and `folded` is §12.8's world with every EARLIER pending entry
 * applied; both stay wide so a rule narrows them through its own predicate rather than casting.
 * A rule reads and returns; it writes nothing it was handed.
 * @typedef {{
 *   entry: Record<string, unknown>,
 *   op: Op,
 *   decl: Record<string, unknown>|null,
 *   index: number,
 *   world: unknown,
 *   folded: unknown,
 *   priorEntries: readonly Record<string, unknown>[],
 *   laterEntries: readonly Record<string, unknown>[],
 *   entries: readonly Record<string, unknown>[],
 *   catalogue: unknown,
 *   deps: Readonly<Record<string, unknown>>,
 * }} GuardContext
 */

/**
 * What ONE rule returns for one entry (§5 clause item 6). `kind` is a member of `GUARD_KINDS`,
 * `message` is a non-empty string in the herald's voice, and `facet` is the rule's own
 * discriminator when it yields more than one finding for one (entry, related) pair.
 * @typedef {{ kind: string, message: string, offers?: readonly string[], fulfil?: Op,
 *   relatedEntryId?: string, facet?: string }} GuardFinding
 */

/**
 * ONE rule (§5 clause item 4). EVERY field is required on every rule: `appliesTo` is a list of
 * op types or `null` for every type, `needs` names the injected dependencies the rule uses (`[]`
 * when it uses none), and an OMITTED key is not an absence value — its rule is malformed and is
 * skipped silently. `id` is unique across the rule set and stable across versions, because it is
 * half of a guard's id and renaming one orphans an override the DM already recorded.
 * @typedef {{ id: string, appliesTo: readonly string[]|null, needs: readonly string[],
 *   evaluate: (ctx: GuardContext) => GuardFinding|readonly GuardFinding[]|null }} GuardRule
 */

/**
 * ONE normalised guard, frozen. ARCH §2's typedef plus `id` (an entry's `overrode` records guard
 * IDS, so something must mint them), `ruleId` (which rule spoke) and `overridden` (the badge).
 * @typedef {{ id: string, entryId: string, ruleId: string, kind: string, message: string,
 *   offers: readonly string[], fulfil: Op|null, relatedEntryId: string|null,
 *   overridden: boolean }} Guard
 */

/**
 * THE VERDICT, frozen, and both halves frozen. `unevaluated` names the rules the caller
 * under-supplied, so ARCH §5's "coverage is stated when empty" is a RUNTIME statement here as
 * well as a catalogue one.
 * @typedef {{ guards: readonly Guard[], unevaluated: readonly string[] }} GuardVerdict
 */

/** The five kinds design §12.8 keeps; the range rule is DROPPED until a count table exists. */
export const GUARD_KINDS = Object.freeze(['connection', 'contention', 'contradiction', 'prerequisite', 'totality']);

/** The seven offers of design §2.7 as widened by §2.7a and §11, in the order a reader sees them. */
export const GUARD_OFFERS = Object.freeze(['fulfil', 'keepBoth', 'keepFirst', 'keepLast', 'proceed', 'reorder', 'self']);

/** The absence value for the fourth argument: no rule, no fold, no injected dependency. */
export const EMPTY_RULE_SET = Object.freeze({ rules: Object.freeze([]), project: null, deps: Object.freeze({}) });

/** The offer no guard may lack, read out of the vocabulary rather than re-spelled beside it. */
const PROCEED = GUARD_OFFERS[4];

/** The one status this engine judges; design §11's absent `when` means the next advance. */
const PENDING = 'pending';

/** The id's absence mark, its separator, and the season a `when`-less entry reads. */
const ABSENT = '-';
const JOIN = ':';
const NO_SEASON = '';

/**
 * @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an
 *   array and never null. A TYPE PREDICATE rather than a boolean, so the bodies below read
 *   `Record<string, unknown>` and this leaf carries ZERO `any` (the any-cast ratchet is at zero).
 */
const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

/** @param {unknown} value @returns {value is string} a non-empty string */
const isText = (value) => typeof value === 'string' && value.length > 0;

/** @param {unknown} value @returns {value is ProjectFn} the rule set's fold, or not a fold */
const isProjectFn = (value) => typeof value === 'function';

/** @param {unknown} value @returns {value is Op} enough of an `Op` for the engine to dispatch on */
const isOp = (value) => isPlainObject(value) && isText(value.type);

/**
 * A well-formed rule. An omitted `appliesTo` or `needs` is NOT an absence value here: EM-B1a's
 * law for the catalogue's rows is kept, so the rule is malformed and appears in NEITHER half.
 * @param {unknown} value @returns {value is GuardRule}
 */
function isRule(value) {
  return isPlainObject(value) && isText(value.id) && typeof value.evaluate === 'function'
    && (value.appliesTo === null || Array.isArray(value.appliesTo)) && Array.isArray(value.needs);
}

/**
 * A finding the engine will mint. Anything else is skipped: design §9's tie-break again.
 * @param {unknown} value @returns {value is GuardFinding}
 */
function isFinding(value) {
  return isPlainObject(value) && isText(value.kind) && GUARD_KINDS.includes(value.kind)
    && isText(value.message);
}

/**
 * Design §11's order key: the `when` CLASS first (0 absent, 1 tick-scheduled, 2 season-only),
 * then the tick, then the season, then the registry's own `orderIndex`, then the id. An absent
 * or non-finite `orderIndex` reads 0, and an absent `when` sorts FIRST because it is due at the
 * next advance.
 * @param {Record<string, unknown>} entry
 * @returns {readonly [number, number, string, number, string]}
 */
function orderKey(entry) {
  const when = isPlainObject(entry.when) ? entry.when : null;
  const scheduled = when !== null && typeof when.tick === 'number' && Number.isFinite(when.tick);
  const tick = scheduled && typeof when.tick === 'number' ? when.tick : 0;
  const season = when !== null && isText(when.season) ? when.season : NO_SEASON;
  const klass = scheduled ? 1 : (season === NO_SEASON ? 0 : 2);
  const index = typeof entry.orderIndex === 'number' && Number.isFinite(entry.orderIndex)
    ? entry.orderIndex
    : 0;
  return [klass, tick, season, index, String(entry.id)];
}

/**
 * The total order the fold walks. Numbers compare numerically; every string compares through the
 * tree's own codepoint comparator, so no host locale can reorder a queue.
 * @param {Record<string, unknown>} a @param {Record<string, unknown>} b @returns {number}
 */
function compareEntries(a, b) {
  const [aClass, aTick, aSeason, aIndex, aId] = orderKey(a);
  const [bClass, bTick, bSeason, bIndex, bId] = orderKey(b);
  return (aClass - bClass) || (aTick - bTick) || compareCodepoint(aSeason, bSeason)
    || (aIndex - bIndex) || compareCodepoint(aId, bId);
}

/**
 * The offers ONE guard carries: the rule's own order kept, duplicates dropped, any member
 * outside the vocabulary dropped, and `proceed` APPENDED when the rule left it out. No rule can
 * mint a refusal, because there is no refusal value to return.
 * @param {unknown} declared @returns {readonly string[]}
 */
function offersOf(declared) {
  /** @type {string[]} */
  const kept = [];
  for (const offer of Array.isArray(declared) ? declared : []) {
    if (isText(offer) && GUARD_OFFERS.includes(offer) && !kept.includes(offer)) kept.push(offer);
  }
  if (!kept.includes(PROCEED)) kept.push(PROCEED);
  return Object.freeze(kept);
}

/**
 * Mint one guard from one finding. The id is `<ruleId>:<entryId>:<relatedEntryId or ->:<facet or
 * ->`, plus `:<n>` for the nth finding under one identity beyond the first, so a rule that omits
 * a needed facet gets an ordinal rather than a collision and every finding survives.
 * @param {GuardFinding} finding @param {string} ruleId @param {string} entryId
 * @param {Map<string, number>} taken @param {readonly unknown[]} overrode @returns {Guard}
 */
function mint(finding, ruleId, entryId, taken, overrode) {
  const related = isText(finding.relatedEntryId) ? finding.relatedEntryId : null;
  const facet = isText(finding.facet) ? finding.facet : ABSENT;
  const base = [ruleId, entryId, related === null ? ABSENT : related, facet].join(JOIN);
  const used = (taken.get(base) || 0) + 1;
  taken.set(base, used);
  const id = used === 1 ? base : [base, String(used)].join(JOIN);
  return Object.freeze({
    id,
    entryId,
    ruleId,
    kind: finding.kind,
    message: finding.message,
    offers: offersOf(finding.offers),
    fulfil: isPlainObject(finding.fulfil) ? finding.fulfil : null,
    relatedEntryId: related,
    overridden: overrode.includes(id),
  });
}

/**
 * Judge a decree registry's PENDING entries against a world.
 *
 * @param {unknown} registry  the decree registry (EM-C1's array). A non-array yields no guards.
 * @param {unknown} world     the world as it stands, with everything already applied applied.
 * @param {unknown} catalogue the op catalogue (`OP_TYPES`). A non-object yields `decl: null`
 *                            on every entry; an unknown op type yields `decl: null` on that one.
 * @param {unknown} ruleSet   `{ rules, project, deps }`. Absent, or not a plain object, reads
 *                            as `EMPTY_RULE_SET`; a non-array `rules` reads as `[]`; a
 *                            `project` that is not a function reads as `null`; a `deps` that
 *                            is not a plain object reads as `{}`.
 * @returns {GuardVerdict} `{ guards, unevaluated }`, the pair FROZEN and each half frozen.
 *                            `guards` is ordered by the fold, then by rule id in codepoint
 *                            order, then by the order the rule yielded its findings.
 *                            `unevaluated` is the ids of the rules whose `needs` the caller
 *                            did not supply, DEDUPED and in codepoint order.
 */
export function evaluateGuards(registry, world, catalogue, ruleSet) {
  const bag = isPlainObject(ruleSet) ? ruleSet : EMPTY_RULE_SET;
  // A COPY, frozen here rather than the caller's own bag frozen in place: freezing a thing the
  // engine was handed is a mutation of it, and §11 forbids every one of those.
  const deps = Object.freeze({ ...(isPlainObject(bag.deps) ? bag.deps : {}) });
  const project = isProjectFn(bag.project) ? bag.project : null;
  /** @type {GuardRule[]} */
  const runnable = [];
  /** @type {string[]} */
  const skipped = [];
  // THE `needs` CHECK IS ON THE WIRING, NOT ON THE QUEUE, and that is deliberate: what is wrong
  // is the CALLER, so an empty registry must not hide it.
  for (const row of Array.isArray(bag.rules) ? bag.rules : []) {
    if (!isRule(row)) continue;
    if (row.needs.every((name) => Object.hasOwn(deps, name))) runnable.push(row);
    else skipped.push(row.id);
  }
  runnable.sort((a, b) => compareCodepoint(a.id, b.id));
  const unevaluated = Object.freeze([...new Set(skipped)].sort(compareCodepoint));

  /** @type {{ entry: Record<string, unknown>, op: Op }[]} */
  const seats = [];
  for (const row of Array.isArray(registry) ? registry : []) {
    if (isPlainObject(row) && isText(row.id) && row.status === PENDING && isOp(row.op)) {
      seats.push({ entry: row, op: row.op });
    }
  }
  seats.sort((left, right) => compareEntries(left.entry, right.entry));
  const entries = Object.freeze(seats.map((seat) => seat.entry));

  // §12.8's synthesized post-op worlds: entry 0 is judged against `world` itself, and entry i
  // against the world with entries 0..i-1 projected. The LAST entry needs no successor world.
  /** @type {unknown[]} */
  const worlds = [world];
  for (let i = 0; i + 1 < seats.length; i += 1) {
    const next = project === null ? undefined : project(worlds[i], seats[i].op, catalogue);
    worlds.push(next === undefined || next === null ? worlds[i] : next);
  }

  /** @type {Guard[]} */
  const guards = [];
  /** @type {Map<string, number>} */
  const taken = new Map();
  for (let i = 0; i < seats.length; i += 1) {
    const { entry, op } = seats[i];
    const entryId = String(entry.id);
    const overrode = Array.isArray(entry.overrode) ? entry.overrode : [];
    // Object.hasOwn, never a prototype walk: 'constructor' is an unknown op type like any other.
    const declared = isPlainObject(catalogue) && Object.hasOwn(catalogue, op.type)
      ? catalogue[op.type]
      : null;
    const ctx = Object.freeze({
      entry,
      op,
      decl: isPlainObject(declared) ? declared : null,
      index: i,
      world,
      folded: worlds[i],
      priorEntries: entries.slice(0, i),
      laterEntries: entries.slice(i + 1),
      entries,
      catalogue,
      deps,
    });
    for (const rule of runnable) {
      if (rule.appliesTo !== null && !rule.appliesTo.includes(op.type)) continue;
      // The engine wraps this in no `try`: `evaluate` is contracted TOTAL, and a swallowed throw
      // is a guard that silently stopped guarding.
      const yielded = rule.evaluate(ctx);
      for (const finding of Array.isArray(yielded) ? yielded : [yielded]) {
        if (isFinding(finding)) guards.push(mint(finding, rule.id, entryId, taken, overrode));
      }
    }
  }
  return Object.freeze({ guards: Object.freeze(guards), unevaluated });
}
