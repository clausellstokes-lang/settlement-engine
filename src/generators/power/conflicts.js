/**
 * power/conflicts.js — the standing quarrels between power factions, grounded in
 * the rival and enemy ties that cross them, plus the per-conflict plot-hook builder.
 */
import { getInstFlags, getStressFlags, pick, randInt } from '../helpers.js';
import { createGenerationWorldLaw } from '../generationContext.js';
import { nameOf } from '../../domain/rulingPower.js';
import { drawDeclared, lineText } from '../../domain/facts/drawDeclared.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { getActiveRng } from '../../kernel/rngContext.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { BASE_ISSUES, STRESS_ISSUES, castFilled, kindsOfPower } from './conflictIssues.js';

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
const buildConflictPlotHooks = (factionA, factionB, conflict, instFlags, stressFlags, facts = null) => {
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
    const drawn = drawDeclared([...own, ...flagHooks].map((line) => ({ id: line, text: line })), {
      draw: (pool) => pool[seedHash % pool.length], facts, key: seedKey,
      poolId: 'conflicts:HOOKS', surface: 'plot_hooks', drawKind: 'H',
    });
    if (drawn.line != null) return [String(lineText(drawn.line))];
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
    `A neutral figure is being pressured by both ${factionA.name} and ${factionB.name} to take a side before ${arbitrationVenue}.`,
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
export const generateConflicts = (powers, relationships, config = {}, institutions = [], npcs = []) => {
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
    facts = () => factsOf({ institutions, config, powerStructure: { factions: powers } });
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
      desc: `${factionA.name} and ${factionB.name} are in ${intensity} conflict over ${chosen.issue.toLowerCase()}. The stakes are ${chosen.stakes.toLowerCase()}.${touched ? ` It reaches ${touched.name} too, who are not a party to it.` : ''}`,
      plotHooks: buildConflictPlotHooks(factionA, factionB, chosen, instFlags, stressFlags, facts),
    });
  }
  return conflicts;
};
