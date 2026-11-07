/**
 * power/conflicts.js — the standing quarrels between power factions, grounded in
 * the rival and enemy ties that cross them, plus the per-conflict plot-hook builder.
 */
import { getInstFlags, getStressFlags, pick, randInt } from '../helpers.js';
import { createGenerationWorldLaw } from '../generationContext.js';
import { nameOf } from '../../domain/rulingPower.js';

// computeRelTension
// buildConflictPlotHooks — build up to 3 plot hooks for a conflict between two
// factions, given the institution flags and stress flags.
//   factionA, factionB — the two opposing factions
//   conflict           — the conflict-issue object (unused here)
//   instFlags          — institution flags (gov faction name, criminal score)
//   stressFlags        — active stress flags
const buildConflictPlotHooks = (factionA, factionB, conflict, instFlags, stressFlags) => {
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
        : 'the next council session',
    hooks = [
      `A neutral figure is being pressured by both ${factionA.name} and ${factionB.name} to take a side before ${arbitrationVenue}.`,
      'Evidence has surfaced suggesting a third party is deliberately escalating the tension between the two factions.',
    ];
  if (stressFlags.merchantCriminalBlur)
    hooks.push(
      'The dispute is complicated by the fact that key members of both factions share business interests that neither wants exposed during arbitration.'
    );
  if (stressFlags.stateCrime)
    hooks.push(
      "One faction has been using official authority to harass the other's members. The harassment is technically legal."
    );
  if (instFlags.criminalEffective > 55)
    hooks.push(
      'Someone is offering to resolve the conflict "permanently" for a price. Both factions have received the offer. Neither has refused yet.'
    );
  return hooks.slice(0, 3);
};

/**
 * A person's home power, by NAME: the power it ranks best in (its memberships, the people car's
 * shape), else the legacy affiliation a pre-car record carries. Pure.
 * @param {{ memberships?: Array<{ power?: unknown, rank?: unknown }>, factionAffiliation?: unknown } | null | undefined} npc
 * @returns {string | null}
 */
const homePowerOf = (npc) => {
  const memberships = Array.isArray(npc?.memberships) ? npc.memberships.filter((m) => m && typeof m.power === 'string') : [];
  if (memberships.length) {
    const rankOf = (m) => (Number.isInteger(m.rank) ? m.rank : Number.MAX_SAFE_INTEGER);
    return String([...memberships].sort((x, y) => rankOf(x) - rankOf(y))[0].power);
  }
  return typeof npc?.factionAffiliation === 'string' && npc.factionAffiliation ? npc.factionAffiliation : null;
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
    .map((row) => ({ name: nameOf(row) }))
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
    issueTemplates = [
      {
        issue: 'Control of the market licensing process',
        stakes: 'Commercial supremacy',
        flag: null,
      },
      {
        issue: 'Jurisdiction over a disputed arrest',
        stakes: 'Institutional authority',
        flag: 'stateCrime',
      },
      {
        issue: 'Church land claims on guild property',
        stakes: 'Institutional power',
        flag: 'theocraticEconomy',
      },
      {
        issue: 'Arcane research permit regulations',
        stakes: 'Magical autonomy',
        flag: 'heresySuppression',
        requires: 'magic',
      },
      {
        issue: 'Control of the dock taxation authority',
        stakes: 'Port revenue',
        flag: null,
        requires: 'water_trade',
      },
      {
        issue: 'Military conscription of guild apprentices',
        stakes: 'Labor control',
        flag: null,
      },
      {
        issue: "Access to the criminal network's intelligence",
        stakes: 'Operational advantage',
        flag: 'merchantCriminalBlur',
      },
      {
        issue: 'Succession to a council seat',
        stakes: 'Political influence',
        flag: null,
      },
      {
        issue: 'A mercenary contract being disputed by both parties',
        stakes: 'Military contract rights',
        flag: 'merchantArmy',
      },
      {
        issue: 'Control of a key trade route checkpoint',
        stakes: 'Economic leverage',
        flag: null,
      },
    ],
    stressTypes = config.stressTypes || (config.stressType ? [config.stressType] : []);
  if (stressTypes.includes('wartime'))
    issueTemplates.push(
      {
        issue: 'Rights to a lucrative war supply contract',
        stakes: 'Economic windfall',
        flag: null,
      },
      {
        issue: 'Authority over military conscription lists',
        stakes: 'Labour and loyalty control',
        flag: null,
      },
      {
        issue: 'Control of the requisition enforcement apparatus',
        stakes: 'Political leverage',
        flag: null,
      }
    );
  if (stressTypes.includes('insurgency'))
    issueTemplates.push(
      {
        issue: 'Legitimacy of the current governing authority',
        stakes: 'Political survival',
        flag: null,
      },
      {
        issue: 'Whether to open back-channel negotiations with the insurgency',
        stakes: 'Settlement stability',
        flag: null,
      },
      {
        issue: 'Control of the intelligence on insurgent cells',
        stakes: 'Operational advantage',
        flag: null,
      }
    );
  if (stressTypes.includes('mass_migration'))
    issueTemplates.push(
      {
        issue: 'Allocation of housing and resources between established residents and newcomers',
        stakes: 'Social cohesion',
        flag: null,
      },
      {
        issue: 'Control of the documentation and registration process for new arrivals',
        stakes: 'Legal and financial leverage',
        flag: null,
      }
    );
  if (stressTypes.includes('religious_conversion'))
    issueTemplates.push(
      {
        issue: "Custody of the settlement's religious records and property",
        stakes: 'Institutional legitimacy',
        flag: null,
      },
      {
        issue: 'Whether the governing authority should formally declare a religious allegiance',
        stakes: 'Political and legal authority',
        flag: null,
      }
    );
  if (stressTypes.includes('slave_revolt'))
    issueTemplates.push(
      {
        issue: 'Whether to suppress, contain, or negotiate with the revolt leadership',
        stakes: 'Settlement order and precedent',
        flag: null,
      },
      {
        issue: 'Accountability for the conditions that produced the revolt',
        stakes: 'Political survival',
        flag: null,
      },
      {
        issue: 'Control of the escape routes and networks supporting the revolt',
        stakes: 'Security and leverage',
        flag: null,
      }
    );
  if (stressTypes.includes('occupied'))
    issueTemplates.push({
      issue: 'Degree of collaboration with the occupying authority',
      stakes: 'Survival vs dignity',
      flag: null,
    });
  if (stressTypes.includes('famine'))
    issueTemplates.push({
      issue: 'Control of the remaining grain stores',
      stakes: 'Survival',
      flag: null,
    });
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
      chosen = pick(applicableTemplates.length ? applicableTemplates : issueTemplates),
      intensity = ties > 1 ? 'high' : 'moderate';
    conflicts.push({
      parties: [factionA.name, factionB.name],
      issue: chosen.issue,
      stakes: chosen.stakes,
      intensity,
      desc: `${factionA.name} and ${factionB.name} are in ${intensity} conflict over ${chosen.issue.toLowerCase()}. The stakes are ${chosen.stakes.toLowerCase()}.`,
      plotHooks: buildConflictPlotHooks(factionA, factionB, chosen, instFlags, stressFlags),
    });
  }
  return conflicts;
};
