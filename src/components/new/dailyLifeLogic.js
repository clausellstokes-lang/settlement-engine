// dailyLifeLogic.js — Pure settlement-context extraction for DailyLifeTab.
import { textOf } from '../../domain/facts/textOf.js';
import { TIER_LABELS } from './design';
import { computeEffectiveMagicPresence } from '../../generators/priorityHelpers.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import {
  CULTURE_PROFILES,
  resolveCultureProfileKey,
} from '../../domain/cultureProfiles.js';
import { resolveDeclared, lineText } from '../../domain/facts/drawDeclared.js';

function legacyCultureContext(culture) {
  const key = resolveCultureProfileKey(culture);
  if (key === 'mixed') {
    return 'Several local traditions remain visible in ordinary institutions, household obligations, and the built environment.';
  }
  return textOf(CULTURE_PROFILES[key]?.socialTexture?.[0]) || null; // R-C: a declared row gives back its text (CENSUS-2d)
}

/**
 * THE DAILY LIFE OFFER LINE (CENSUS-2, the chair's ruling R10; ledger
 * `docs/census/declarations/DAILY_LIFE_TAB.json`). The line names only what the place has —
 * each named item is a declared line asking its one reader in `factsOf`: the market
 * (`market`), the tavern (`institution: tavern`), the watch (`watch`) — and with none of the
 * three it is "Ordinary life here in prose." alone. A place with all three reads the original
 * wording byte for byte.
 * @param {object} s the settlement record
 * @param {boolean} enabled the saved-settlement variant ("Ordinary life…") or the unsaved one
 * @returns {string}
 */
export function dailyLifeOfferLine(s, enabled) {
  const facts = factsOf(s);
  const named = [
    ...(facts.market ? ['the market'] : []),
    ...(facts.hasInstitution('tavern') ? ['the tavern'] : []),
    ...(facts.defence.watch ? ['the watch'] : []),
  ];
  const tail = named.length ? `: dawn, ${named.join(', ')}.` : '.';
  return enabled ? `Ordinary life here in prose${tail}` : `Save this settlement to write its ordinary life in prose${tail}`;
}

export function extractSettlementContext(s) {
  const tier     = s.tier || 'village';
  const cfg      = s.config || {};
  const eco      = s.economicState   || {};
  const via      = s.economicViability || {};
  const dp       = s.defenseProfile   || {};
  const scores   = dp.scores          || {};
  const sp       = eco.safetyProfile  || {};
  const ps       = s.powerStructure   || {};
  const hist     = s.history          || {};
  const insts    = s.institutions     || [];

  const stresses = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
  const stressTypes = stresses.map(st => st?.type).filter(Boolean);

  const factions      = ps.factions || [];
  const governing     = factions.find(f => f.isGoverning);
  const govFaction    = governing?.faction   || null;
  const govCat        = governing?.category  || null;
  const govPower      = governing?.power     || null;
  // powerStructure.stability is a LABEL ('Tense (external threat)'), not a
  // 0-100 score — same trap aiLayer fixed; formatStability handles both.
  const stability     = ps.stability         ?? 50;
  // Conflicts are written TOP-LEVEL by assembleSettlement (which now also
  // dual-writes them onto powerStructure) — reading only ps.conflicts kept
  // this prompt conflict-blind (same phantom read aiLayer fixed).
  const conflicts     = s.conflicts || ps.conflicts || [];
  const tensions      = hist.currentTensions || [];

  const instNames = insts.map(i => (i.name || '').toLowerCase());
  const byCategory = insts.reduce((acc, i) => {
    (acc[i.category] = acc[i.category] || []).push(i.name);
    return acc;
  }, {});

  // Food
  const fb = via.metrics?.foodBalance;
  const foodDeficit = fb?.deficit ? fb.deficitPercent || 0 : 0;
  // fb.surplus is an ABSOLUTE lb/day quantity (economicGenerator), not a
  // percent — rendering it raw produced the '1200% above need' prompt class
  // (same trap aiLayer fixed). Derive the percent from dailyNeed; without a
  // dailyNeed there is no honest percent, so stay at 0 (reads as 'roughly
  // self-sufficient' downstream rather than inventing a number).
  const foodSurplus = fb && !fb.deficit && fb.dailyNeed > 0
    ? Math.round(((fb.surplus || 0) / fb.dailyNeed) * 100)
    : 0;

  // Safety — use safetyProfile (same source as OverviewTab)
  const safetyRatioRaw = sp.safetyRatio ?? 1.0;
  const safetyScore = Math.min(100, Math.max(0,
    safetyRatioRaw >= 2.0 ? 90 :
    safetyRatioRaw >= 1.5 ? 75 :
    safetyRatioRaw >= 1.2 ? 62 :
    safetyRatioRaw >= 1.0 ? 50 :
    safetyRatioRaw >= 0.7 ? 32 :
    safetyRatioRaw >= 0.5 ? 18 : 8
  ));
  const safetyLabelFromProfile = (sp.safetyLabel || '').split(':')[0].trim() || null;
  // safetyProfile.crimeTypes entries are {type, desc} objects — joining them
  // raw printed '[object Object]' into the prompt (same trap aiLayer fixed).
  const crimeTypes  = (sp.crimeTypes || []).map(ct => ct?.type || ct).filter(Boolean);
  const criminalInsts = insts.filter(i => i.category === 'Criminal').map(i => i.name);
  const watchExists = instNames.some(n => /watch|guard|constable|patrol/i.test(n));
  const garrisonExists = instNames.some(n => /garrison|barracks|soldier|knight/i.test(n));

  // Economy — use compound.economyOutput (same source as EconomicsTab)
  const econScore    = Math.round(eco.compound?.economyOutput ?? scores.economic ?? 50);
  const chains       = eco.activeChains || [];
  const chainNames   = chains.map(c => chainPrintName(c, s).label || c.chainId).filter(Boolean).slice(0, 8); // COHERENCE-AGREE-6 (F1)
  const incomeCount  = via.incomeSources?.length || eco.incomeSources?.length || 0;
  const tradeRoute   = cfg.tradeRouteAccess || 'road';
  const terrain      = cfg.terrainOverride  || null;
  const culture      = cfg.culture || null;
  const magic        = cfg.priorityMagic || 0;
  const religion     = cfg.priorityReligion || 50;
  const pop          = s.population;

  // Key institutions by category (for context)
  const keyInsts = {};
  ['Economy','Crafts','Religious','Government','Defense','Magic','Entertainment','Infrastructure'].forEach(cat => {
    if (byCategory[cat]?.length) keyInsts[cat] = byCategory[cat].slice(0, 4);
  });

  // Prosperity — use authoritative generator value (same as Economics tab)
  const prospBand = (eco.prosperity || 'Unknown').toLowerCase();

  const militaryScore  = Math.round(eco.compound?.militaryEffective ?? scores.military ?? 50);
  const _magicScore     = Math.round(scores.magical   ?? 0);
  const magicDep       = dp.magicDependency ?? false;

  // All context descriptions computed here — on ctx object avoids TDZ in minified output
  const rawTerrainCtx  = TERRAIN_CONTEXT[terrain] || null;
  // New generations carry the exact seed-materialized cultural expression.
  // Legacy saves resolve through the same bounded profile corpus instead of a
  // second, stereotype-prone paragraph table.
  const rawCultureCtx  = s.culturalIdentity?.socialTexture
    || legacyCultureContext(culture)
    || null;
  const rawRouteCtx    = ROUTE_CONTEXT[tradeRoute] || null;

  // Magic band — uses computeEffectiveMagicPresence (single source of truth)
  const _magicPresence = computeEffectiveMagicPresence(insts, { ...cfg, nearbyResources: cfg.nearbyResources });
  const rawMagicBand  = _magicPresence.band;
  const rawMagicLabel = _magicPresence.label;
  const rawMagicScore = _magicPresence.score;

  const rawDefenseReadinessLabel = dp.readiness?.label || null;
  // CENSUS-1e unit 2 (Appendix B item 23, T): the readiness cell resolves through the one rule
  // against the settlement's facts (undeclared today: drawn as before, noted in the ledger).
  const rawDefenseCtx  = lineText(resolveDeclared(DEFENSE_CONTEXT[rawDefenseReadinessLabel] ?? null, { facts: () => factsOf(s), poolId: `dailyLife:DEFENSE_CONTEXT.${rawDefenseReadinessLabel}`, surface: 'daily_life', crisisScoped: true }).line) || null;

  return {
    tier, tierLabel: TIER_LABELS[tier] || tier,
    population: pop,
    culture,
    tradeRoute,
    terrain,
    stressTypes,
    govFaction,
    govCat,
    govPower,
    stability,
    // Conflict entries are { parties, issue, stakes, desc, … } (powerGenerator's
    // generateConflicts) — description/type exist only on legacy/edge shapes.
    conflicts: conflicts.slice(0, 3).map(c => c.desc || c.description || c.issue || c.type).filter(Boolean),
    // Unlike the conflicts line above, `t.title` was NOT a legacy-shape tolerance: a
    // currentTensions entry carries exactly {type, description, factions,
    // lastingEffects, plotHooks, severity} (historyData.HISTORICAL_EVENTS_DATA), the
    // user-edit allowlist admits only `description`, and the AI merge writes only
    // `description`. `title` is not even among the import-tolerance spellings
    // historyBeats declares (label/name/text), so the arm was deleted as writerless.
    tensions: tensions.slice(0, 3).map(t => t.type).filter(Boolean),
    foodDeficit,
    foodSurplus,
    safetyScore,
    safetyLabelFromProfile,
    crimeTypes: crimeTypes.slice(0, 5),
    criminalInsts: criminalInsts.slice(0, 3),
    watchExists,
    garrisonExists,
    econScore,
    militaryScore,
    chainNames,
    incomeCount,
    prospBand,
    keyInsts,
    magic,
    magicScore: rawMagicScore,
    magicDep,
    magicBand: rawMagicBand,
    magicLabel: rawMagicLabel,
    terrainCtx: rawTerrainCtx,
    cultureCtx: rawCultureCtx,
    routeCtx:   rawRouteCtx,
    defenseCtx: rawDefenseCtx,
    defenseReadinessLabel: dp.readiness?.label || rawDefenseReadinessLabel || null,
    defenseInstitutions: insts.filter(i => i.category === 'Defense').map(i => i.name),
    magicInstitutions: insts.filter(i => i.category === 'Magic').map(i => i.name),
    religion,
    historicalCharacter: hist.historicalCharacter || null,
  };
}

// ── Terrain daily-life context ──────────────────────────────────────────────
const TERRAIN_CONTEXT = {
  plains:   'Flat agricultural land. Daily life organised around the farming calendar: planting, harvest, and the market cycle. Weather is the primary topic of conversation. Little natural shelter means the settlement is exposed to the road and to anyone who travels it.',
  forest:   'Dense woodland presses close. Timber, charcoal, and game are the economic foundation. Movement beyond the settlement requires knowledge of tracks; strangers who appear unannounced are treated with suspicion. The forest provides and threatens in equal measure.',
  hills:    'Rolling terrain means walking uphill to fetch water, uphill to the market, uphill home. Livestock (sheep especially) dominate the economy more than grain. Isolated farmsteads are common; the settlement is a gathering point, not a continuous community.',
  riverside:'The river defines everything: the mill, the ferry crossing, the flood risk, the fish. The rhythm of the water sets the rhythm of the day. Seasonal floods are a shared memory and a shared threat. River traders bring news and goods; the landing is where things happen.',
  coastal:  'Salt air, tidal rhythms, the permanent smell of fish. The sea is both livelihood and existential risk. Weather is watched obsessively. The dock or quay is the social and economic center; what happens there happens first. Inland people are called "mudwalkers" and looked down on.',
  mountain: 'Altitude shortens the growing season and increases isolation. Water is managed carefully: springs, cisterns, snowmelt. The passes close in winter and the settlement turns inward. Self-sufficiency is a point of pride and a practical necessity. Outsiders arrive less often and are noticed more.',
  desert:   'Water is the central organising fact of daily life. Where it is, who controls it, how far to reach it. The heat governs the schedule: activity before midday and after dusk, stillness in between. Shade, shelter from sandstorms, and the oasis or well are social gathering points. Caravans are lifelines.',
};

// ── Trade route daily-life feel ───────────────────────────────────────────
const ROUTE_CONTEXT = {
  road:        'A main road means a steady trickle of travellers, merchants, and news. The inn and the stables see constant turnover. People here know more about what\'s happening in distant places than isolated settlements do. Strangers are normal.',
  crossroads:  'Multiple roads converging means constant movement: merchants, pilgrims, soldiers, refugees. The settlement sees a rotation of faces. News arrives from several directions simultaneously. The market is the heart of everything. Conflict between passing groups is a recurring management problem.',
  river:       'The river is a highway. Barges and boats bring bulk goods that no cart could carry economically. The landing, the dock, and the ferryman\'s house are where deals are made. The population is accustomed to travellers from upstream and downstream. Floods are a shared reference point for time ("the year of the big flood").',
  port:        'The sea brings the world to the door. The harbour is never quiet. Sailors from distant ports, foreign merchants, exotic goods, and foreign diseases all arrive by ship. The population is accustomed to the strange and is harder to shock. The dockside district has its own rough social order.',
  isolated:    'The same thirty or two hundred faces, every day of your life. Everyone knows everything about everyone. Strangers who arrive are noticed immediately and discussed at length. Self-sufficiency is both a necessity and a point of deep local pride. News from outside arrives weeks late and is received with enormous interest.',
  mountain_pass: 'The pass controls movement between regions. In season, a steady stream of merchants and travellers; in winter, near-total isolation. The settlement exists to service the pass: stabling, food, shelter, guides. Every resident has opinions about road conditions, weather, and the character of travellers.',
};

// ── Defense posture daily-life feel ──────────────────────────────────────────
// CENSUS-2e unit 2 (ledger docs/census/declarations/DAILY_LIFE_CONTEXT.json; CENSUS-1e wired the
// site): each cell declares what its text presumes, so the readiness label alone never prints a
// wall, a garrison or a watch the record lacks. Every cell is the ledger's `{crisis-scoped}` pool
// (the site passes the flag) and is sayable under a crisis (`crisis: any`) save the threat / unrest
// denials. 'Defensible' presumed a palisade AND a militia, true in 0 of 50 Defensible births on a
// 300-birth probe: reworded to its real presumption, the watch (R-W). No twin: `defenseCtx` prints
// on no page (R-D2), so a refused cell reads null and nothing renders differently.
const DEFENSE_CONTEXT = {
  'Fortress':       { text: 'The walls are thick and the garrison is visible everywhere. Gates are checked twice: entering and leaving. Soldiers are a constant social presence; they drink in the better taverns and their officers live in the good houses. Safety is real but so is the feeling of being watched.', needs: ['walls', 'garrison', 'gate', 'institution: tavern'], excludes: ['crisis: threat'], crisis: ['any'] },
  'Well-Defended':  { text: 'The settlement has real walls and a professional watch. People feel reasonably secure, which shows in how freely they move after dark. The garrison is present but not intrusive. Guard posts at the gates are routine, not threatening.', needs: ['walls', 'watch', 'garrison', 'gate'], excludes: ['crisis: threat', 'crisis: unrest'], crisis: ['any'] },
  'Defensible':     { text: 'There are defenses, but nobody would call this a fortress. The watch patrols the main streets at night. Most people feel safe enough, but they lock their doors and notice strangers.', needs: ['watch'], excludes: ['crisis: threat'], crisis: ['any'] },
  'Vulnerable':     { text: 'The settlement has minimal defenses. A determined raiding party could take it. People are aware of this and it shapes how they live. They know where to run, they keep their valuables hidden, they have arrangements with neighbours for emergencies. The watch exists mainly to deal with drunks.', needs: ['watch'], crisis: ['any'] },
  'Undefended':     { text: 'There are no walls, no garrison, no meaningful watch. The settlement is completely open. People have learned to live with this: some by forming informal neighbourhood watch arrangements, some by simply accepting that danger is a fact of life here. Strangers are watched carefully because there is no gate to watch them at.', excludes: ['walls', 'garrison', 'watch', 'gate'], crisis: ['any'] },
};
import { chainPrintName } from '../../domain/display/chainPrintName.js'; // COHERENCE-AGREE-6 (F1): what a chain prints under
