/**
 * power/conflicts.js — the standing quarrels between power factions, grounded in
 * the rival and enemy ties that cross them, plus the per-conflict plot-hook builder.
 */
import { getInstFlags, getStressFlags, pick, randInt } from '../helpers.js';
import { createGenerationWorldLaw } from '../generationContext.js';
import { nameOf } from '../../domain/rulingPower.js';
import { powerNameWithArticle } from '../../domain/display/powerSentenceName.js';
import { drawDeclared, lineText } from '../../domain/facts/drawDeclared.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { getActiveRng } from '../../kernel/rngContext.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { BASE_ISSUES, STRESS_ISSUES, castFilled, kindsOfPower } from './conflictIssues.js';
import { guardPayOf } from '../../domain/facts/guardPay.js'; // BAR4-SAFETY (F1, SF1 b)

/**
 * BAR4-SAFETY (kind F1, REVIEW-BAR-4 C6022; the chair's SF1 (b), vetoable by the owner): the quarrel over the guard's cost
 * draws "The guard has not been paid this month" exactly as before; where the guard's pay reads paid in full
 * (`facts/guardPay.js :: guardPayOf`: the funded gate is 1), its TWIN prints IN PLACE (the same slot, no redraw): the quarrel
 * over what the guard costs, without the claim that nobody was paid (bar0-city-under_siege+famine-rand-23: "The garrison and
 * city watch are well paid and well equipped" on the same page).
 */
/** C6022's hook, read off its own row (the issue whose stakes are who pays for defence: its first hook), and its twin. */
export const UNPAID_GUARD_HOOK = String(BASE_ISSUES.find((row) => row.stakes === 'Who pays for defence')?.hooks?.[0] ?? '');
export const UNPAID_GUARD_HOOK_PAID_TWIN = String(lineText({ text: 'The guard is paid in full every month, and the other side wants to know whose purse it comes out of.', needs: ['guardPresence'] }));

// buildConflictPlotHooks — the quarrel's plot hook (COHERENCE-QUARREL cure 2). One hook per
// quarrel, as the dossier prints it (the chair's ruling 3): drawn from the issue's OWN hooks and
// the flag hooks whose flag is up, without a roll — a hash of the town's seed, the two parties
// and the issue picks it, so no other draw of the birth moves. The two generic sentences (the
// neutral figure, the letter) retire to the fallback of an issue that has no hooks of its own.
//   factionA, factionB — the two opposing powers
//   conflict           — the drawn issue row (its `hooks`)
//   instFlags          — institution flags (gov power name, criminal score)
//   stressFlags        — active stress flags
//   facts              — the town's facts, for a hook that declares a thing
const buildConflictPlotHooks = (factionA, factionB, conflict, instFlags, stressFlags, facts = null, pay = null) => {
  // ONE HASH PER QUARREL: it picks the hook and the offer's wording, so no other draw moves.
  const seedKey = `${getActiveRng()?.seed ?? ''}::${factionA.name}>${factionB.name}::${conflict?.id ?? conflict?.issue}`; // COHERENCE-POWERS-8 (#337): the issue's stable id (its text, for every issue but a reworded one)
  const seedHash = fnv1a32(seedKey);
  const flagHooks = [];
  if (stressFlags.merchantCriminalBlur)
    flagHooks.push(
      'Leading members of both powers are partners in the same business, one that skirts the law, and neither side wants that said aloud during arbitration.'
    );
  if (stressFlags.stateCrime)
    flagHooks.push(
      "One power has been using official authority to harass the other's members. The harassment is technically legal."
    );
  // The offer has two wordings, the same thought, so one sentence does not stand in every
  // place where crime runs deep: the quarrel's hash chooses, without a roll.
  if (instFlags.criminalEffective > 55)
    flagHooks.push(
      (seedHash >>> 16) % 2 === 0
        ? 'Someone is offering to resolve the conflict "permanently" for a price. Both powers have received the offer. Neither has refused yet.'
        : 'Each side has been told, in secret, that the other can be made to go away for good. The price is the same for both.'
    );
  const own = Array.isArray(conflict?.hooks) ? conflict.hooks : [];
  if (own.length) {
    // Each hook carries its own text as its id, so the ledger counts a line, not a slot.
    // BAR2-PEOPLE (PP10): a declared hook keeps its declaration (and a twin its `twinOf`); its id is still its text
    const drawn = drawDeclared([...own, ...flagHooks].map((line) => (typeof line === 'string' ? { id: line, text: line } : { ...line, id: line.text })), {
      draw: (pool) => pool[seedHash % pool.length], facts, key: seedKey,
      poolId: 'conflicts:HOOKS', surface: 'plot_hooks', drawKind: 'H',
    });
    if (drawn.line != null) {
      const hook = String(lineText(drawn.line));
      return [hook === UNPAID_GUARD_HOOK && pay === 'full' ? UNPAID_GUARD_HOOK_PAID_TWIN : hook]; // BAR4-SAFETY (F1, SF1 b): the twin in place, no redraw
    }
  }
  const govFacName = (instFlags == null ? void 0 : instFlags._govFacName) || '',
    isFeudal =
      govFacName.includes('Feudal') ||
      govFacName.includes('Steward') ||
      govFacName.includes('Manor') ||
      govFacName.includes('Noble') ||
      govFacName.includes('Lord'),
    isChurch =
      govFacName.includes('Church') ||
      govFacName.includes('Theocrat') ||
      govFacName.includes('Clergy') ||
      govFacName.includes('Bishop'),
    arbitrationVenue = isFeudal
      ? "the lord's next court hearing"
      : isChurch
        ? 'the next chapter assembly'
        : 'the next council session';
  return [
    // POWERS-16 (the chair's ruling (r2)): a power named in a sentence takes its prose form, from one leaf; NAMES-1 (CN1): with its article
    `A neutral figure is being pressured by both ${powerNameWithArticle(factionA.name)} and ${powerNameWithArticle(factionB.name)} to take a side before ${arbitrationVenue}.`,
    'A letter has turned up showing that someone outside both powers paid for the last clash between them.',
    ...flagHooks,
  ].slice(0, 3);
};

/**
 * A person's home power, by NAME: the power it ranks best in (its memberships, the people car's
 * shape); none for a card in no power. Pure.
 * @param {{ memberships?: Array<{ power?: unknown, rank?: unknown }> } | null | undefined} npc
 * @returns {string | null}
 */
const homePowerOf = (npc) => {
  // PEOPLE-5A (M-2): the memberships only — the legacy `factionAffiliation` fallback is deleted
  // (a pre-car record gets its memberships from the save migration, M-7).
  const memberships = Array.isArray(npc?.memberships) ? npc.memberships.filter((m) => m && typeof m.power === 'string') : [];
  if (!memberships.length) return null;
  const rankOf = (m) => (Number.isInteger(m.rank) ? m.rank : Number.MAX_SAFE_INTEGER);
  return String([...memberships].sort((x, y) => rankOf(x) - rankOf(y))[0].power);
};

/**
 * The pairs of POWERS a rival or enemy tie crosses, strongest first (GS-2, ODQ §934.101; the
 * people car, PEOPLE-3 HOOKS: paired over the POWERS — `powerStructure.factions` — never over the
 * NPC grouping, which PEOPLE-5 deletes). Each person's home is the power it ranks best in
 * (`homePowerOf`); a tie whose two ends share a home, or whose end has none, grounds nothing.
 * Ranked by tie count, then by the powers' order on the power roster, so the ranking is a pure
 * function of the record. Pure: no draw.
 * @param {Array<{ name: string }>} powers the powers, `{ name }`, in roster order
 * @param {Array<{ type?: string, from?: unknown, to?: unknown }>} relationships
 * @param {Array<Record<string, any>>} npcs the cast
 * @returns {Array<{ factionA: { name: string }, factionB: { name: string }, ties: number }>}
 */
const crossFactionRivalPairs = (powers, relationships, npcs) => {
  const byName = new Map(powers.map((power) => [power.name, power]));
  const rank = new Map(powers.map((power, index) => [power, index]));
  const homeOf = new Map();
  for (const npc of npcs || []) {
    const home = byName.get(homePowerOf(npc));
    if (npc?.id != null && home && !homeOf.has(npc.id)) homeOf.set(npc.id, home);
  }
  const pairs = new Map();
  for (const rel of relationships || []) {
    if (!['rival', 'enemy'].includes(rel?.type)) continue;
    const a = homeOf.get(rel.from), b = homeOf.get(rel.to); // PEOPLE-4 TIES: the directed ends (R-P7)
    if (!a || !b || a === b) continue;
    const [first, second] = rank.get(a) < rank.get(b) ? [a, b] : [b, a];
    const key = `${rank.get(first)}:${rank.get(second)}`;
    const entry = pairs.get(key) || { factionA: first, factionB: second, ties: 0 };
    entry.ties += 1;
    pairs.set(key, entry);
  }
  return [...pairs.values()].sort((p, q) => q.ties - p.ties
    || rank.get(p.factionA) - rank.get(q.factionA)
    || rank.get(p.factionB) - rank.get(q.factionB));
};

// generateConflicts — the standing quarrels between POWERS (GS-2, ODQ §934.101).
// A conflict is two powers a rival or enemy tie crosses; its intensity is the count of
// those ties. A town where no such tie crosses two powers has no conflict row, honestly: the
// old pairing put adjacent tie-components against each other with no rivalry at all four times
// in ten. Draws (on the caller's stream): the count, then one issue pick per conflict.
//   powers (powerStructure.factions rows), relationships, config, institutions, npcs (the cast:
//   each person's home power is read from its memberships — PEOPLE-3 HOOKS, never the grouping)
/** @param {any} c @returns {string|null} the quarrel's pair, unordered */
const pairKeyOf = (c) => (Array.isArray(c?.parties) && c.parties.length === 2 ? [...c.parties].map(String).sort().join('\u0000') : null);

/**
 * BAR3-CLOSE-SWEEP-B (2026-11-16, letter c; the chair's RG1c, vetoable by the owner): A QUARREL BETWEEN TWO POWERS DOES
 * NOT END BECAUSE THE PEOPLE WERE RE-ROLLED. A section regen's conflict list keeps every born quarrel as it is, and takes
 * its own draws only for the pairs the born list does not name, up to the cap (the born first): the draw's own ceiling
 * (`generateConflicts :: randInt(1, 3)`), read here as a local, so the tuning estate gains no named constant. A conflict names powers
 * only (`parties`, `issue`, `stakes`, `intensity`, `desc`, `plotHooks`): no person of the old cast is carried. `drawn` is
 * returned beside the list so the caller twins only the rows of the pairs the born list did not name (their rows are the
 * generator's un-twinned rows: a row is twinned only where a conflict names its pair). Pure; no draw.
 * @param {ReadonlyArray<any>} born @param {ReadonlyArray<any>} regen
 * @returns {{ conflicts: any[], drawn: any[] }}
 */
export function carryBornQuarrels(born, regen) {
  const cap = 3; // generateConflicts :: randInt(1, 3), the most quarrels one draw deals
  const kept = (Array.isArray(born) ? born : []).slice(0, cap);
  const named = new Set(kept.map(pairKeyOf).filter(Boolean));
  const drawn = (Array.isArray(regen) ? regen : []).filter((c) => !named.has(pairKeyOf(c))).slice(0, cap - kept.length);
  return { conflicts: [...kept, ...drawn], drawn };
}

export const generateConflicts = (powers, relationships, config = {}, institutions = [], npcs = [], defenseProfile = null) => { // BAR4-SAFETY (SF1 b): the defence profile, for the guard's pay
  const named = (Array.isArray(powers) ? powers : [])
    .map((row) => ({ name: nameOf(row), category: row?.category, isGoverning: row?.isGoverning === true }))
    .filter((row) => row.name !== '');
  if (named.length < 2) return [];
  const rivalPairs = crossFactionRivalPairs(named, relationships, npcs);
  if (!rivalPairs.length) return [];
  const worldLaw = createGenerationWorldLaw(config, {
    tradeRoute: config.tradeRouteAccess,
    terrainType: config.terrainType,
  });
  const instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    conflicts = [],
    conflictCount = Math.min(randInt(1, 3), rivalPairs.length),
    stressTypes = config.stressTypes || (config.stressType ? [config.stressType] : []),
    // THE ISSUES (COHERENCE-QUARREL): the table lives beside this file, each issue with its cast.
    // The stress issues join in the table's own order, as the old chain of pushes added them.
    issueTemplates = [
      ...BASE_ISSUES,
      ...Object.keys(STRESS_ISSUES).filter((type) => stressTypes.includes(type)).flatMap((type) => STRESS_ISSUES[type]),
    ],
    // BAR2-PEOPLE (PP10): the birth's crisis is handed in the stress shape (factsOf.js :: birthFactsOf's rule), so a hook
    // that excludes the siege reads it; no other line of these pools declares a crisis
    facts = () => factsOf({ institutions, config, stress: stressTypes.map((type) => ({ type })), powerStructure: { factions: powers }, defenseProfile }),
    pay = guardPayOf({ institutions, defenseProfile }); // BAR4-SAFETY (F1, SF1 b): how the guard is paid, read off the same record
  for (let i = 0; i < conflictCount; i++) {
    const { factionA, factionB, ties } = rivalPairs[i];
    const applicableTemplates = issueTemplates.filter((template) => {
      if (template.flag && !stressFlags[template.flag]) return false;
      if (template.requires === 'magic' && !worldLaw.magicFunctions()) {
        return false;
      }
      if (
        template.requires === 'water_trade'
        && !worldLaw.supportsMaritime()
        && !worldLaw.supportsRiverTrade()
      ) {
        return false;
      }
      return worldLaw.allowsGeneratedContent(
        `${template.issue} ${template.stakes}`,
      );
    }),
      // EVERY ISSUE DECLARES ITS CAST (COHERENCE-QUARREL cure 1): a pair is offered only the
      // issues its two powers can fill; with none, the issues that need no cast.
      kindsA = kindsOfPower(factionA),
      kindsB = kindsOfPower(factionB),
      castOpen = applicableTemplates.filter((template) => castFilled(template, kindsA, kindsB)),
      castFree = applicableTemplates.filter((template) => !template.cast.length),
      offered = castOpen.length ? castOpen : castFree.length ? castFree : applicableTemplates.length ? applicableTemplates : issueTemplates,
      chosen = drawDeclared(offered, {
        draw: (pool) => pick(pool), facts, key: `${getActiveRng()?.seed ?? ''}::${factionA.name}>${factionB.name}::conflict-issue`,
        poolId: 'conflicts:ISSUES', surface: 'power', drawKind: 'R', keepRefused: true,
      }).line || offered[0],
      intensity = ties > 1 ? 'high' : 'moderate';
    // THE TOUCHED POWERS ARE NAMED (COHERENCE-QUARREL cure 3): an issue that reaches a kind of
    // power that need not be a party (the craft guilds, in a conscription quarrel) says so in one
    // clause, naming the first such power the town has, when it is not a party.
    const reached = (chosen.touches || []).length
      ? named.filter((power) => power !== factionA && power !== factionB
        && [...kindsOfPower(power)].some((kind) => chosen.touches.includes(kind)))
      : [];
    const touched = (chosen.touchesFirst && reached.find((power) => chosen.touchesFirst.test(power.name))) || reached[0] || null;
    conflicts.push({
      parties: [factionA.name, factionB.name],
      issue: chosen.issue,
      stakes: chosen.stakes,
      intensity,
      // POWERS-16 (the chair's ruling (r2)): the powers named in the sentence take their prose form, from one leaf; NAMES-1
      // (CN1, the seventh chair's ruling of 2026-11-20): with its article, "The Elder Council and the Craft Guilds are …"
      desc: `${powerNameWithArticle(factionA.name, true)} and ${powerNameWithArticle(factionB.name)} are in ${intensity} conflict over ${chosen.issue.toLowerCase()}. The stakes are ${chosen.stakes.toLowerCase()}.${touched ? ` It reaches ${powerNameWithArticle(touched.name)} too, who are not a party to it.` : ''}`,
      plotHooks: buildConflictPlotHooks(factionA, factionB, chosen, instFlags, stressFlags, facts, pay),
    });
  }
  return conflicts;
};
