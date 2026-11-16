/**
 * tests/helpers/defenceDeskKinds.js — THE DEFENCE DESK'S KIND DETECTORS (BAR4-CORPUS-DEF, BRIEF-BAR4 amendment K1).
 *
 * A DETECTOR is a pure function over a town's RECORD and the lines its page DREW (`{ blockId, poolKey, vid }`, the
 * kernel's draw record, or the census dump's sentences matched back to their members): it returns EVERY instance of a
 * kind, the line printing in a state that makes it false, with that state named. It reads the settled record
 * DIRECTLY (never through the vocabulary's readers the cure declares against), so a cure cannot pass by agreeing with
 * itself. Each kind names the members that PRESUME a state (the small table beside the pool, K1) and the record
 * reading that denies it. A member the detector finds and the seat judged TRUE is excluded by NAME, with its reason,
 * in `EXCLUDED` below, never by narrowing a state until it is quiet.
 *
 *   D1  "NOTHING THREATENS IT": a member that declares `no threat` (it presumes no danger is coming) printed where the
 *       record's live tensions hold an external threat ("news of approaching danger"), or the crisis record holds an
 *       armed threat (siege, occupation, monster pressure).
 *   D2  WHAT RESTS ON MAGIC: a "nothing here rests on magic" member printed where the record brings goods in by magic
 *       (an isolated route supplied by teleportation: `economicState.tradeDependencies[].impact`, the generator's own
 *       "teleportation imports replace road access", severity below critical); or a named-chain member printed where
 *       the chain it names works a fish water every row calls depleted (the page's own "fished out ... bought in").
 *   D3  A CALM LINE IN A CRISIS: "watched, not stopped" under a curfew (an occupation's curfew at the checkpoints, a
 *       war's curfews); the poor purse of years ("short of money for years", "always short of money") in a town the
 *       record calls prosperous or wealthy; the quiet walls ("asks little of its defences", "ahead of any present need")
 *       under war or open revolt.
 *   C24893  "books record no gang, guild or racket", and its sibling "goes wrong one thing at a time and belongs to
 *       whoever did it", printed where the record's income lists a criminal revenue.
 *
 * Pure: no randomness, no clock, no write; imports nothing.
 */

/** @typedef {{ blockId: string, poolKey: string, vid: number }} Drawn */
/** @typedef {{ kind: string, blockId: string, poolKey: string, vid: number, state: string, split?: boolean }} Instance */

/** @param {any} s @returns {string[]} the active crisis types of the stress record (either alias) */
function crisisTypes(s) {
  const raw = Array.isArray(s?.stressors) ? s.stressors : Array.isArray(s?.stress) ? s.stress : s?.stress ? [s.stress] : [];
  return raw.map((/** @type {any} */ x) => x?.type).filter((/** @type {unknown} */ t) => typeof t === 'string');
}

/** @param {any} s @returns {string|null} what makes "no danger is coming" false here, or null */
export function liveThreatOf(s) {
  const armed = crisisTypes(s).find((t) => ['under_siege', 'occupied', 'monster_pressure'].includes(t));
  if (armed) return `crisis ${armed}`;
  const tension = (s?.history?.currentTensions || []).find((/** @type {any} */ t) => t?.type === 'external_threat');
  return tension ? 'a live external_threat tension' : null;
}

/** @param {any} s @returns {string|null} what makes "nothing it lives by rests on magic" false here, or null */
export function magicSupplyOf(s) {
  const e = s?.economicState;
  if (e?.tradeAccess !== 'isolated') return null;
  const dep = (e.tradeDependencies || []).find((/** @type {any} */ d) => d?.severity !== 'critical' && /teleportation imports/i.test(String(d?.impact || '')));
  return dep ? `${dep.resource} for ${dep.institution} brought in by magic (isolated route)` : null;
}

const FISH_WATERS = ['fishing_grounds', 'river_fish'];
/**
 * THE SPLIT (K6): every fish water the chains work is depleted and salted fish is bought in (the income line's own
 * reading: "The fishery here is fished out; the fish sold now is salted and bought in"), while a chain the record holds
 * up by magic still works one (`magicNote`, status vulnerable: it runs). @param {any} s @returns {string|null}
 */
export function fishedOutMagicChainOf(s) {
  const chains = Array.isArray(s?.economicState?.activeChains) ? s.economicState.activeChains : [];
  /** @type {unknown[]} */ const conditions = [];
  for (const row of chains) {
    if (FISH_WATERS.includes(String(row?.resourceKey))) conditions.push(row?.resourceCondition);
    if (FISH_WATERS.includes(String(row?.resourceInputKey))) conditions.push(row?.resourceInputCondition);
  }
  if (!(conditions.length > 0 && conditions.every((c) => c === 'depleted'))) return null;
  const named = chains.find((/** @type {any} */ c) => String(c?.magicNote || '').trim() && FISH_WATERS.includes(String(c?.resourceKey)));
  const imports = (s?.economicState?.primaryImports || []).map((/** @type {any} */ i) => (typeof i === 'string' ? i : i?.name || i?.good || '')).join(' | ');
  return named && /\bsalt(?:ed)? fish\b/i.test(imports) ? `a fished-out water bought in as salted fish, worked by the magic-held chain (${named.chainId || named.name})` : null;
}

/** @param {any} s @returns {string|null} a curfew on the record's crisis, or null */
export function curfewOf(s) {
  const t = crisisTypes(s).find((x) => x === 'occupied' || x === 'wartime');
  return t ? `crisis ${t} (curfew)` : null;
}

/** @param {any} s @returns {string|null} a purse the record calls full, or null */
export function fullPurseOf(s) {
  const p = String(s?.economicState?.prosperity || '');
  return p === 'Prosperous' || p === 'Wealthy' ? `prosperity ${p}` : null;
}

/** @param {any} s @returns {string|null} any active crisis on the record ("when a real crisis comes" presumes none), or null */
export function activeCrisisOf(s) {
  const t = crisisTypes(s)[0];
  return t ? `crisis ${t}` : null;
}

/** @param {any} s @returns {string|null} war or open revolt on the crisis record, or null */
export function armedUnrestOf(s) {
  const t = crisisTypes(s).find((x) => ['wartime', 'insurgency', 'slave_revolt'].includes(x));
  return t ? `crisis ${t}` : null;
}

/** @param {any} s @returns {string|null} a criminal revenue on the income list, or a service a criminal house offers, or null */
export function criminalIncomeOf(s) {
  const src = (s?.economicState?.incomeSources || []).find((/** @type {any} */ i) => /black market|smuggling|criminal|syndicate/i.test(String(i?.source || '')));
  if (src) return `income: ${src.source}`;
  const svc = s?.availableServices;
  const rows = Array.isArray(svc) ? svc : Object.values(svc || {}).flat();
  const covert = rows.find((/** @type {any} */ x) => /\bfence\b|smuggl|black market|thieves|criminal|syndicate/i.test(String(x?.institution || '')));
  return covert ? `a covert service: ${covert.name} (${covert.institution})` : null;
}

/** @param {any} s @returns {string|null} the watch is the unpaid rota of households (the village watch) and nobody else is paid to defend, or null */
export function unpaidRotaOf(s) {
  const inst = s?.defenseProfile?.institutions || {};
  const watch = Array.isArray(inst.watch) ? inst.watch : [];
  const paid = ['garrison', 'mercenary'].some((k) => Array.isArray(inst[k]) && inst[k].length > 0);
  return watch.length > 0 && !paid && watch.every((/** @type {any} */ w) => w?.catalogId === 'village_watch') ? 'the watch is an unpaid rota of households' : null;
}

/**
 * THE TABLE: each kind's members (a pool and its vids; `vids: null` = every member of the pool; `marked` = every
 * member of the whole desk carrying that mark) and the record reading that makes them false.
 * `split: true` marks a K6 split this desk does not write: its instances are reported (`Instance.split`), not zeroed.
 * @type {ReadonlyArray<{ kind: string, split?: boolean, blockId?: string, poolKey?: string, vids?: number[]|null, marked?: string, state: (s: any) => string|null }>}
 */
export const DEFENCE_DESK_KINDS = Object.freeze([
  { kind: 'D1', marked: 'no threat', state: liveThreatOf },
  // v4 is the magic-supply twin (BAR4-CORPUS-DEF): it says the goods come in by magic, so it presumes nothing denied here
  { kind: 'D2', blockId: 'DS-DEF-9', poolKey: 'magicDependency false', vids: [1, 2, 3], state: magicSupplyOf },
  { kind: 'D2', blockId: 'DS-DEF-9', poolKey: 'magicDependency false, availability absent', vids: null, state: magicSupplyOf },
  // THE SPLIT (K6): not this desk's to cure (the income line's writer, `incomeLineSiblings.js`); counted, held by a ceiling
  { kind: 'D2', split: true, blockId: 'DS-DEF-9', poolKey: 'magicDependency true, with a NAMED dependent chain', vids: null, state: fishedOutMagicChainOf },
  { kind: 'D3', blockId: 'DS-DEF-5', poolKey: 'watch PRESENT', vids: [3], state: curfewOf },
  // v6 is the well-off twin (BAR4-CORPUS-DEF): "is well off, but little of its wealth is set aside for its defence"
  { kind: 'D3', blockId: 'DS-DEF-2', poolKey: 'Economic Survival: WEAK', vids: [1, 2, 3, 4, 5], state: fullPurseOf },
  { kind: 'D3', blockId: 'DS-DEF-11', poolKey: 'WALLED-QUIET', vids: [2, 3], state: armedUnrestOf },
  { kind: 'D3', blockId: 'DS-DEF-2', poolKey: 'Economic Survival: WEAK', vids: [3], state: activeCrisisOf },
  // PAY (BAR4-SAFETY's row, the chair 08:59): a member that presumes paid defenders, beside an unpaid rota and no paid force
  { kind: 'PAY', blockId: 'DS-DEF-6', poolKey: 'Economic Backing: Well-funded', vids: [2, 3, 4], state: unpaidRotaOf },
  { kind: 'PAY', blockId: 'DS-DEF-6', poolKey: 'Economic Backing: Underfunded', vids: [1], state: unpaidRotaOf },
  { kind: 'PAY', blockId: 'DS-DEF-6', poolKey: 'Economic Backing: Critical', vids: [2], state: unpaidRotaOf },
  { kind: 'PAY', blockId: 'DS-DEF-8', poolKey: 'override: UNDER TRIBUTE', vids: [2], state: unpaidRotaOf },
  { kind: 'PAY', blockId: 'DS-DEF-11', poolKey: 'WALLED-STRAINED', vids: [1], state: unpaidRotaOf },
  { kind: 'C24893', blockId: 'DS-DEF-4', poolKey: 'structure null (nothing organized recognized)', vids: [1, 2], state: criminalIncomeOf },
]);

/**
 * THE NAMED EXCLUSIONS: a member the detector finds that the seat judged TRUE in that state, with the reason.
 * @type {ReadonlyArray<{ kind: string, blockId: string, poolKey: string, vid: number, why: string }>}
 */
export const EXCLUDED = Object.freeze([
  // D1: judged TRUE beside a danger on its way (REVIEW-BAR-4's "news of approaching danger", parties for war, talks or flight)
  { kind: 'D1', blockId: 'DS-DEF-1', poolKey: 'readiness STRONG', vid: 2, why: 'its strength, not a calm: "would take real effort to threaten and knows it"' },
  ...[1, 2, 3].flatMap((vid) => ['Beasts & Monsters: settled, defenses beyond the need', 'Beasts & Monsters: settled, nothing organized'].map((poolKey) => ({
    kind: 'D1', blockId: 'DS-DEF-2', poolKey, vid, why: 'the beasts row: the country\'s beasts (the settled monster threat), not a danger one can parley with' }))),
  { kind: 'D1', blockId: 'DS-DEF-2', poolKey: 'Invasion & War: neither walls nor force', vid: 2, why: 'conditional: "safe for exactly as long as nobody comes" names the danger, denies none' },
  { kind: 'D1', blockId: 'DS-DEF-2', poolKey: 'Invasion & War: neither walls nor force', vid: 7, why: 'its watch "would be no answer to an army": true, and the sharper for the danger' },
  { kind: 'D1', blockId: 'DS-DEF-6', poolKey: 'Naval Defense: Port only', vid: 2, why: '"nothing at the water would stop a hostile ship": an exposure, not a calm' },
  { kind: 'D1', blockId: 'DS-DEF-11', poolKey: 'WALLED-QUIET', vid: 6, why: 'the danger twin (BAR4-CORPUS-DEF): "with news of danger on the way, the town is glad it did"' },
  { kind: 'D1', blockId: 'DS-DEF-11', poolKey: 'UNWALLED-SMALL', vid: 1, why: 'what keeps it is "its neighbours, its distance, and its unimportance": the page\'s own reading of a hamlet with no force (C18729)' },
]);

/**
 * Every instance of every kind among the lines a town drew.
 * @param {any} record the settlement record
 * @param {ReadonlyArray<Drawn>} drawn the members the page drew
 * @param {(d: Drawn) => ReadonlyArray<string>} marksOf a member's marks (the leaf's own)
 * @returns {Instance[]}
 */
export function defenceDeskKindsIn(record, drawn, marksOf) {
  /** @type {Instance[]} */
  const out = [];
  for (const d of drawn) {
    for (const k of DEFENCE_DESK_KINDS) {
      const member = k.marked
        ? d.blockId.startsWith('DS-DEF-') && marksOf(d).includes(k.marked)
        : d.blockId === k.blockId && d.poolKey === k.poolKey && (k.vids === null || (k.vids || []).includes(d.vid));
      if (!member) continue;
      if (EXCLUDED.some((x) => x.kind === k.kind && x.blockId === d.blockId && x.poolKey === d.poolKey && x.vid === d.vid)) continue;
      const state = k.state(record);
      if (state) out.push({ kind: k.kind, blockId: d.blockId, poolKey: d.poolKey, vid: d.vid, state, ...(k.split ? { split: true } : {}) });
    }
  }
  return out;
}
