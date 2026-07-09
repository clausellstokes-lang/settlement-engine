/**
 * power/conflicts.js — inter-faction conflicts from rivalries/enmities, plus
 * the per-conflict plot-hook builder.
 */
import { random as _rng } from '../rngContext.js';
import { getInstFlags, getStressFlags, pick, randInt } from '../helpers.js';

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

// generateConflicts — produce inter-faction conflicts from rivalries/enmities.
//   factions, relationships, config, institutions
export const generateConflicts = (factions, relationships, config = {}, institutions = []) => {
  if (factions.length < 2) return [];
  const instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    conflicts = [],
    conflictCount = Math.min(randInt(1, 3), Math.floor(factions.length / 2)),
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
      },
      {
        issue: 'Control of the dock taxation authority',
        stakes: 'Port revenue',
        flag: null,
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
  for (let i = 0; i < conflictCount && i < factions.length - 1; i++) {
    const factionA = factions[i],
      factionB = factions[i + 1],
      rivalries = relationships.filter((rel) => {
        const inA = factionA.members.some((member) => member.id === rel.npc1Id || member.id === rel.npc2Id),
          inB = factionB.members.some((member) => member.id === rel.npc1Id || member.id === rel.npc2Id);
        return inA && inB && ['rival', 'enemy'].includes(rel.type);
      });
    if (rivalries.length === 0 && _rng() < 0.4) continue;
    const applicableTemplates = issueTemplates.filter((tmpl) => !tmpl.flag || stressFlags[tmpl.flag]),
      chosen = pick(applicableTemplates.length ? applicableTemplates : issueTemplates),
      intensity = rivalries.length > 1 ? 'high' : rivalries.length === 1 ? 'moderate' : 'low';
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
