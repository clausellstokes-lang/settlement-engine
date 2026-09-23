/**
 * guardRules.js — THE FIVE GUARD RULES AND THE FOLD (EM-C3, wave 2; design §2.7,
 * §2.7a, §12.8, §18; ARCH §5). The rule set the folded engine (EM-C2) runs.
 *
 * ⛔ GUARDS NEVER REFUSE. A rule returns a finding, a list of findings, or `null`.
 * `null` is silence, never a verdict; the engine appends `proceed` to any finding
 * that left it out, so no rule here can mint a refusal even by omission.
 *
 * ⛔ THE VOCABULARIES ARE THE ENGINE'S AND ARE IMPORTED, NEVER RE-SPELLED (the
 * chair's judgment 236, from EM-C2's executed closure measurement). `GUARD_KINDS`
 * and `GUARD_OFFERS` are VALUE exports of `guards.js`, whose whole static closure
 * is itself plus `../deterministicSort.js`; the reverse direction would make the
 * engine unbuildable until this leaf landed. The typedefs come from the same home
 * TYPE-ONLY: `import('./guards.js')` in a `@typedef` erases at emit and creates no
 * runtime edge, which is the idiom `operationsOffStage.js` already uses.
 *
 * ⛔ THIS LEAF IMPORTS NOTHING FROM `src/generators`, AND THAT IS MEASURED RATHER
 * THAN STYLE. `tests/build/domainGeneratorsBoundary.test.js` freezes four
 * domain-to-generators edges and pins their count at five; a static OR dynamic
 * specifier here takes its arm 1 to a NEW-importer line naming this file and its
 * arm 3 from five to seven. The instrument's own message names the cure, and
 * design §22.3 item 6 ruled the same principle for the band ladders: invert, do
 * not widen. So the two writers the design names arrive as INJECTED dependencies
 * on `ctx.deps`, and the prerequisite table is imported directly because it
 * already lives a layer down, in `src/data`.
 *
 * ⛔ IT IMPORTS NOTHING FROM `operations.js` EITHER.
 * `tests/lint/editMutationPath.walker.test.js` convicts by name every `src/`
 * module that statically imports `OP_TYPES`, `makeOp` or `validateOp` outside the
 * three declared edit-path members, and this leaf is not one of them. The engine
 * reads the catalogue and hands each rule the one row it judges, as `ctx.decl`.
 *
 * ⛔ THE PREREQUISITE RULE JUDGES THE STANDING ROSTER. `liveInstitutions` is the
 * estate's one functional-liveness accessor, and a calamity-ruined wall does not
 * satisfy a citadel's gate; reading the raw roster here would be precisely the
 * over-crediting class `tests/lint/ruinFilterRoster.walker.test.js` exists for.
 *
 * ⛔ A FULFIL OFFER IS AN OP THE CATALOGUE ACCEPTS, OR IT IS NOT OFFERED AT ALL (U65).
 * `validateOp` judges a fulfil the moment a surface stages it, and it reads three things:
 * a well-formed target, every REQUIRED field of the row, and no field the row does not
 * declare. So the offer is SHAPED BY THE ROW rather than hand-written beside it — the row
 * for the offered type, read off `ctx.catalogue`, which is the seam the engine hands in
 * precisely so a rule may ask about a type that is not its own entry's. Each declared
 * field takes the value the FINDING computed, else the value the ENTRY carries under the
 * same name, else — for a required field the row spells as a plain string — the target's
 * own id, which the DM edits. A required POOL, INT or ENUM value nothing can name is the
 * catalogue's word to choose, so the offer is dropped instead of guessed: the `fulfil`
 * OFFER still stands on the finding (it already does when more than one act is owed) and
 * the DM authors the act. The op carries type, target and payload and nothing else: the
 * store's staging path re-mints it through `makeOp`, which is the one op writer.
 *
 * ⛔ ZERO `any`, ZERO SUPPRESSIONS, NO NAMED NUMERIC CONSTANT.
 * `tests/lint/domainAnyCastBaseline.test.js` fails a NEW `src/domain` file that
 * carries any suppression debt, and `tests/lint/tuningRegister.walker.test.js`'s
 * P2 arm holds a new file at zero unregistered named constants. The totality
 * target is therefore READ FROM THE WRITER rather than spelled as a literal.
 */

/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./guards.js').GuardContext} GuardContext */
/** @typedef {import('./guards.js').GuardFinding} GuardFinding */
/** @typedef {import('./guards.js').GuardRule} GuardRule */
/** @typedef {import('./guards.js').ProjectFn} ProjectFn */

import { GATE_FEATURES } from '../../data/spatialData.js';
import { compareCodepoint } from '../deterministicSort.js';
import { GUARD_KINDS, GUARD_OFFERS } from './guards.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * The injected writers, BY NAME, in the estate's one string order. The engine's
 * caller supplies both on the rule set's `deps`; a rule whose `needs` are unmet is
 * skipped and returned in the verdict's `unevaluated`, because coverage is stated
 * even when it is empty.
 */
export const GUARD_RULE_DEPENDENCIES = Object.freeze(/** @type {const} */ ([
  'checkStructuralValidity', 'renormalizeFactionPower',
]));

/** @typedef {Record<string, unknown>} Bag */
/** @typedef {{ world: readonly string[], registry: readonly string[] }} RequiresSplit */
/** @typedef {{ type?: string, institution?: string, missing?: readonly string[],
 *   reason?: string, severity?: string }} StructuralRow */
/** @typedef {{ violations: readonly StructuralRow[], suggestions: readonly StructuralRow[] }} StructuralVerdict */
/** @typedef {{ faction?: string, power?: number }} FactionRow */
/** @typedef {{ checkStructuralValidity: (roster: readonly Bag[], config: Bag) => StructuralVerdict,
 *   renormalizeFactionPower: (factions: FactionRow[]) => FactionRow[] }} GuardRuleDeps */

/** @param {unknown} value @returns {value is Bag} a plain object, never an array and never null */
const isObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

/** @param {unknown} value @returns {Bag} the value as a bag, or an empty one */
const bagOf = (value) => (isObject(value) ? value : {});

/** @param {unknown} value @returns {readonly string[]} the value as a string list, or empty */
const listOf = (value) => (Array.isArray(value) ? value.map((each) => String(each)) : []);

/** @param {unknown} ref @returns {string} a stable address for one target, or the empty string */
const addressOf = (ref) => (isObject(ref) ? `${String(ref.kind || '')}:${String(ref.id || '')}` : '');

/** @param {Bag} entry @returns {Bag} the entry's op, or an empty bag */
const opOf = (entry) => bagOf(entry.op);

/** @param {Bag} entry @returns {string} the entry's op type, or the empty string */
const typeOf = (entry) => String(opOf(entry).type || '');

/** @param {Bag} entry @returns {string} the entry's target address */
const targetOf = (entry) => addressOf(opOf(entry).target);

/** @param {Bag} entry @returns {Bag} the entry's payload, or an empty bag */
const payloadOf = (entry) => bagOf(opOf(entry).payload);

/** @param {Bag} entry @returns {string} the entry's own id */
const idOf = (entry) => String(entry.id || '');

/** @param {Bag} entry @returns {string} the id the entry's target names, or the empty string */
const targetIdOf = (entry) => String(bagOf(opOf(entry).target).id || '');

/**
 * The declaration's `requires` SPLIT, narrowed. The engine types `ctx.decl` loosely,
 * and design §18's two kinds are judged by two different rules, so the split is read
 * here once rather than re-narrowed at each site.
 * @param {GuardContext} ctx @returns {RequiresSplit}
 */
function requiresOf(ctx) {
  const requires = bagOf(bagOf(ctx.decl).requires);
  return { world: listOf(requires.world), registry: listOf(requires.registry) };
}

/** @param {GuardContext} ctx @param {string} key @returns {readonly string[]} a relation list */
const relationOf = (ctx, key) => listOf(bagOf(ctx.decl)[key]);

/** @param {GuardContext} ctx @returns {GuardRuleDeps} the injected writers, narrowed */
const depsOf = (ctx) => /** @type {GuardRuleDeps} */ (/** @type {unknown} */ (bagOf(ctx.deps)));

/** @param {unknown} world @returns {FactionRow[]} the world's faction roster, never a copy */
function factionsOf(world) {
  const power = bagOf(bagOf(world).powerStructure);
  return Array.isArray(power.factions) ? /** @type {FactionRow[]} */ (power.factions) : [];
}

/** @param {readonly FactionRow[]} rows @returns {number} the roster's power sum */
const shareSum = (rows) => rows.reduce((total, row) => total + (Number(row.power) || 0), 0);

/**
 * The catalogue's row for ONE op type, read off the context. `ctx.decl` answers for the
 * ENTRY's type alone, and an offer is by definition about another act, so the offer is
 * shaped by this row; `Object.hasOwn`, never a prototype walk, so `constructor` is an
 * unknown type like any other.
 * @param {GuardContext} ctx @param {string} type @returns {Bag} the row, or an empty bag
 */
function rowOf(ctx, type) {
  const catalogue = bagOf(ctx.catalogue);
  return Object.hasOwn(catalogue, type) ? bagOf(catalogue[type]) : {};
}

/**
 * The two payload-spec kinds that hold a PLAIN STRING, which is the only kind of required
 * value a rule may fill from the target's own id. `operations.js` keeps its own
 * `PAYLOAD_SPEC_KINDS` module-private and this leaf may not import that module at all, so
 * the two words are spelled here exactly as `registry.js` spells the two vocabulary-bearing
 * kinds, and the acceptance asserts them against the live catalogue's own kind set.
 */
const FREE_SPEC = 'free';
const REF_SPEC = 'ref';

/**
 * ONE fulfil offer the catalogue accepts, or `null` (U65; see the header clause). The
 * payload carries EXACTLY the fields the row declares, in `compareCodepoint` order so the
 * same finding mints the same bytes twice, and the target is the row's own declared kind
 * against the id the offer is about.
 * @param {GuardContext} ctx @param {string} type the op type offered
 * @param {string} id the id the offered act is about
 * @param {Bag} known the fields the FINDING itself computed
 * @returns {Op|null} null when the catalogue cannot express the act
 */
function offeredOp(ctx, type, id, known) {
  const row = rowOf(ctx, type);
  const kind = String(row.target || '');
  if (!kind || !id) return null;
  const declared = bagOf(row.payload);
  const carried = payloadOf(bagOf(ctx.entry));
  /** @type {Bag} */
  const payload = {};
  for (const field of Object.keys(declared).sort(compareCodepoint)) {
    const spec = bagOf(declared[field]);
    const given = [known[field], carried[field]].find((value) => value !== undefined);
    if (given !== undefined) payload[field] = given;
    else if (spec.required !== true) continue;
    else if (spec.kind === FREE_SPEC || spec.kind === REF_SPEC) payload[field] = id;
    else return null;
  }
  return /** @type {Op} */ (/** @type {unknown} */ (Object.freeze({
    type, target: Object.freeze({ kind, id }), payload: Object.freeze(payload),
  })));
}

/**
 * The gate table KEYED FOR A STRING LOOKUP, built once at module scope. The imported
 * literal is a frozen object with 96 authored keys and NO index signature, so indexing
 * it with a runtime `string` is TS7053 under the strict domain config even behind an
 * `Object.hasOwn` guard (the full config never sees it — the two disagree, and both
 * must read zero on a new `src/domain` leaf). A `Map` built from the table's own
 * entries is the REAL type rather than a cast: the any-cast ratchet stays at zero, the
 * table is still imported from `src/data` and never re-spelled here, and `has`/`get`
 * carry the own-key semantics the guard needs without walking a prototype.
 * @type {ReadonlyMap<string, unknown>}
 */
const GATE_TABLE = new Map(Object.entries(GATE_FEATURES));

/**
 * The world-state predicates a declaration may name. Design §18's world half is
 * READ FROM THE RECORD, never from the registry. An unknown name never holds, so
 * a declaration naming a predicate nothing implements says so out loud.
 * @param {string} name @param {unknown} world @param {Bag} entry @returns {boolean}
 */
function worldConditionHolds(name, world, entry) {
  if (name !== 'npcPresent') return false;
  const npcs = bagOf(world).npcs;
  const roster = Array.isArray(npcs) ? npcs : [];
  const wanted = targetOf(entry);
  return roster.some((npc) => `npc:${String(bagOf(npc).id || '')}` === wanted);
}

/**
 * PREREQUISITE. Two facets, both against the FOLDED world: the declaration's own
 * `requires.world` predicates, and the institution gate table read through the
 * injected validator. The registry half belongs to the connection rule.
 * @param {GuardContext} ctx @returns {GuardFinding|null}
 */
function prerequisiteRule(ctx) {
  const entry = bagOf(ctx.entry);
  const folded = bagOf(ctx.folded);
  const unmet = requiresOf(ctx).world.filter((name) => !worldConditionHolds(name, folded, entry));
  if (unmet.length) {
    return { kind: GUARD_KINDS[3], facet: 'world', offers: [GUARD_OFFERS[6]],
      message: `This act needs the world to be a way it is not yet: ${[...unmet].sort(compareCodepoint).join(', ')}.` };
  }
  const named = String(payloadOf(entry).name || '');
  if (!GATE_TABLE.has(named)) return null;
  const gate = bagOf(GATE_TABLE.get(named));
  const verdict = depsOf(ctx).checkStructuralValidity(liveInstitutions(folded), bagOf(folded.config));
  const against = verdict.violations.filter((row) => row.institution === named);
  if (!against.length) return null;
  const missing = [...new Set(against.flatMap((row) => [...(row.missing || [])]))].sort(compareCodepoint);
  // The offer seats the FIRST missing prerequisite in codepoint order. Its class is the one
  // the staged act itself carries, because the row requires that field and a pool value is
  // the catalogue's word rather than a guard's.
  const ground = missing.length
    ? offeredOp(ctx, 'add-institution', missing[0], { name: missing[0] })
    : null;
  return {
    kind: GUARD_KINDS[3], facet: 'gate',
    message: `${named} rests on something the town does not have: ${String(gate.reason || '')}`,
    offers: missing.length ? [GUARD_OFFERS[0], GUARD_OFFERS[6]] : [GUARD_OFFERS[6]],
    ...(ground ? { fulfil: ground } : {}),
  };
}

/**
 * TOTALITY. THE TARGET IS READ FROM THE WRITER, NEVER RE-SPELLED: the rule
 * renormalises a CLONE (the injected writer MUTATES ITS ARGUMENT IN PLACE and a
 * guard is pure) and compares the live sum against the clone's. So no literal
 * total lives here, and a roster whose shares are all zero is silence rather than
 * a false alarm, because the writer returns such a roster unchanged.
 * @param {GuardContext} ctx @returns {GuardFinding|null}
 */
function totalityRule(ctx) {
  const factions = factionsOf(ctx.folded);
  if (!factions.length) return null;
  const sum = shareSum(factions);
  const clone = factions.map((row) => ({ ...row }));
  depsOf(ctx).renormalizeFactionPower(clone);
  const target = shareSum(clone);
  if (sum === target) return null;
  const shares = clone
    .map((row) => `${String(row.faction || '')} ${Number(row.power) || 0}`)
    .sort(compareCodepoint).join(', ');
  // The message reads the WHOLE rebalanced roster, because that is what the DM must see;
  // the offer can only carry what the row expresses, which is ONE faction at one power. It
  // is the faction this act touches while the folded roster still holds it, and otherwise
  // the first in codepoint order — and the power is the WRITER'S, read off the same clone
  // the message quotes, never a second arithmetic.
  const named = clone.map((row) => String(row.faction || '')).sort(compareCodepoint);
  const here = targetIdOf(bagOf(ctx.entry));
  const who = named.includes(here) ? here : named[0];
  const seat = clone.filter((row) => String(row.faction || '') === who)[0];
  const rebalanced = offeredOp(ctx, 'rebalance-power', who,
    { faction: who, power: Number(bagOf(seat).power) || 0 });
  return {
    kind: GUARD_KINDS[4], facet: 'share', offers: [GUARD_OFFERS[0], GUARD_OFFERS[6]],
    message: `The factions hold ${sum} points of power between them, not ${target}. Rebalanced they would read: ${shares}.`,
    ...(rebalanced ? { fulfil: rebalanced } : {}),
  };
}

/**
 * CONTRADICTION. Two entries on ONE TARGET whose op types name each other in
 * `conflictsWith`. The earlier entry is named so the DM may keep either.
 * @param {GuardContext} ctx @returns {GuardFinding|null}
 */
function contradictionRule(ctx) {
  const entry = bagOf(ctx.entry);
  const here = targetOf(entry);
  const conflicts = relationOf(ctx, 'conflictsWith');
  const clash = ctx.priorEntries.find((other) => targetOf(bagOf(other)) === here
    && conflicts.includes(typeOf(bagOf(other))));
  if (!clash) return null;
  return { kind: GUARD_KINDS[2], relatedEntryId: idOf(bagOf(clash)),
    offers: [GUARD_OFFERS[1], GUARD_OFFERS[2], GUARD_OFFERS[3]],
    message: `This undoes what ${typeOf(bagOf(clash))} already does to the same thing.` };
}

/**
 * CONTENTION. Two entries setting ONE FACT: the same target and a shared payload
 * field, whatever their op types. The later wins unless the DM says otherwise.
 * @param {GuardContext} ctx @returns {GuardFinding|null}
 */
function contentionRule(ctx) {
  const entry = bagOf(ctx.entry);
  const here = targetOf(entry);
  const fields = new Set(Object.keys(payloadOf(entry)));
  const clash = ctx.priorEntries.find((other) => targetOf(bagOf(other)) === here
    && Object.keys(payloadOf(bagOf(other))).some((key) => fields.has(key)));
  if (!clash) return null;
  return { kind: GUARD_KINDS[1], relatedEntryId: idOf(bagOf(clash)),
    offers: [GUARD_OFFERS[2], GUARD_OFFERS[3]],
    message: 'Two waiting acts set the same fact. The later one wins unless you say otherwise.' };
}

/**
 * CONNECTION. The registry half of `requires`, and then `relatedTo`. Out of
 * sequence offers reorder, fulfil or proceed; a related pair offers the
 * follows-from link (design §2.7a). It never reads `op.requires`, which `makeOp`
 * has flattened into one array where a world predicate is indistinguishable from
 * a registry one.
 * @param {GuardContext} ctx @returns {GuardFinding|null}
 */
function connectionRule(ctx) {
  const before = new Set(ctx.priorEntries.map((other) => typeOf(bagOf(other))));
  const owed = requiresOf(ctx).registry.filter((type) => !before.has(type));
  if (owed.length) {
    const waiting = ctx.laterEntries.find((other) => owed.includes(typeOf(bagOf(other))));
    // ONE owed act can be offered; two or more leave the DM the order. The owed act is
    // about the same thing this entry is about, so it takes this entry's target and, for
    // every field the owed row and this entry both declare, this entry's own value.
    const ground = owed.length === 1
      ? offeredOp(ctx, owed[0], targetIdOf(bagOf(ctx.entry)), {})
      : null;
    return {
      kind: GUARD_KINDS[0], facet: 'sequence',
      message: `This follows from ${[...owed].sort(compareCodepoint).join(', ')}, which is not staged before it.`,
      offers: waiting ? [GUARD_OFFERS[0], GUARD_OFFERS[5]] : [GUARD_OFFERS[0]],
      ...(waiting ? { relatedEntryId: idOf(bagOf(waiting)) } : {}),
      ...(ground ? { fulfil: ground } : {}),
    };
  }
  const related = relationOf(ctx, 'relatedTo');
  const kin = ctx.laterEntries.find((other) => related.includes(typeOf(bagOf(other))));
  if (!kin) return null;
  return { kind: GUARD_KINDS[0], facet: 'related', relatedEntryId: idOf(bagOf(kin)),
    offers: [GUARD_OFFERS[5]],
    message: `The catalogue reads this and ${typeOf(bagOf(kin))} as one account.` };
}

/**
 * THE FIVE RULES, frozen, in `compareCodepoint` order of their ids. `appliesTo`
 * is a closed list of op types or `null` for every type; `needs` names the
 * injected dependencies the rule uses, and every key is required on every row.
 * @type {readonly GuardRule[]}
 */
export const GUARD_RULES = Object.freeze([
  Object.freeze({ id: 'connection', appliesTo: null,
    needs: Object.freeze([]), evaluate: connectionRule }),
  Object.freeze({ id: 'contention', appliesTo: null,
    needs: Object.freeze([]), evaluate: contentionRule }),
  Object.freeze({ id: 'contradiction', appliesTo: null,
    needs: Object.freeze([]), evaluate: contradictionRule }),
  Object.freeze({ id: 'prerequisite', appliesTo: null,
    needs: Object.freeze([GUARD_RULE_DEPENDENCIES[0]]), evaluate: prerequisiteRule }),
  Object.freeze({ id: 'totality',
    appliesTo: Object.freeze(['add-faction', 'rebalance-power', 'remove-faction']),
    needs: Object.freeze([GUARD_RULE_DEPENDENCIES[1]]), evaluate: totalityRule }),
]);

/**
 * THE FOLD (§12.8). Only a rule set knows what an op does to the fact its rules
 * judge, so the engine never synthesises a post-op world: this does, for the two
 * facts the five rules read and for nothing else. It returns a NEW world and
 * mutates neither the world it is handed nor the op.
 * @type {ProjectFn}
 */
export function project(world, op, catalogue) {
  if (!isObject(world) || !isObject(op)) return null;
  const type = String(op.type || '');
  if (!Object.hasOwn(bagOf(catalogue), type)) return null;
  const payload = bagOf(op.payload);
  const address = addressOf(op.target);
  if (type === 'add-institution') {
    const roster = Array.isArray(world.institutions) ? world.institutions : [];
    return { ...world, institutions: [...roster, { name: String(payload.name || '') }] };
  }
  if (type === 'remove-institution') {
    const gone = address.split(':').slice(1).join(':');
    const roster = Array.isArray(world.institutions) ? world.institutions : [];
    return { ...world, institutions: roster.filter((row) => String(bagOf(row).name || '') !== gone) };
  }
  if (type === 'add-faction' || type === 'remove-faction' || type === 'rebalance-power') {
    const rows = factionsOf(world).map((row) => ({ ...row }));
    // ⛔ U80 — THE ADDRESS IS THE CATALOGUE'S OWN TARGET KIND, NEVER A LITERAL. An op
    // addresses its subject at the kind ITS OWN ROW declares: `offeredOp` mints every
    // fulfil target from `row.target`, `isEntityRef` admits only the declared seven, and
    // the two faction-roster ops do NOT share one kind — `remove-faction` declares
    // `faction`, `rebalance-power` declares `power`, because a share is a fact of the
    // POWER card. A literal `faction:` here therefore compared `faction:Guild` against a
    // rebalance's `power:Guild`, matched no row, and returned a NEW world with the roster
    // UNCHANGED: the guard then judged a share that never moved, and nothing said so.
    // Read from the row, the fold cannot disagree with a declaration that moves.
    const seat = `${String(bagOf(bagOf(catalogue)[type]).target || '')}:`;
    const next = type === 'add-faction'
      ? [...rows, { faction: String(payload.faction || ''), power: Number(payload.power) || 0 }]
      : (type === 'remove-faction'
        ? rows.filter((row) => `${seat}${String(row.faction || '')}` !== address)
        : rows.map((row) => (`${seat}${String(row.faction || '')}` === address
          ? { ...row, power: Number(payload.power) || 0 } : row)));
    return { ...world, powerStructure: { ...bagOf(world.powerStructure), factions: next } };
  }
  return null;
}

/**
 * THE RULE SET the caller hands the engine, frozen, at `EMPTY_RULE_SET`'s three
 * keys. `deps` is the caller's because the two writers live under `src/generators`
 * and nothing under `src/domain/edit` may import them; a caller that supplies
 * neither still gets a lawful rule set, and the engine reports the three rules it
 * could not run rather than pretending they were silent.
 * @param {Partial<GuardRuleDeps>} deps
 * @returns {{ rules: readonly GuardRule[], project: ProjectFn, deps: Bag }}
 */
export function makeGuardRuleSet(deps) {
  return Object.freeze({
    rules: GUARD_RULES,
    project,
    deps: Object.freeze({ ...bagOf(deps) }),
  });
}

/**
 * The rules that CAN fire for one op type, in `id` order. A catalogue row's
 * declared coverage is read from here and nowhere else.
 * @param {string} type @returns {readonly GuardRule[]}
 */
export function rulesFor(type) {
  return GUARD_RULES.filter((rule) => rule.appliesTo === null || rule.appliesTo.includes(type));
}
