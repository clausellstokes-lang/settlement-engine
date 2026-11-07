// docs/chair/2026-11-07/people-5-prep/census.mjs — PEOPLE-5-PREP's reader census (measure-only, 2026-11-07).
//
// The syntax-tree pass (`ast-sites.mjs`, espree as `scripts/wiring-census.mjs :: astTokens` parses)
// over `src/` (non-test) and `tests/`, then the classification the record's §1 and §2 state:
//   - which `.factions` reads are the NPC GROUPING (not the powers `powerStructure.factions`, not a
//     tension's/ladder's/index's own `factions`), decided by receiver and then by a READ of each
//     ambiguous site (the EXCLUDED table below names every site the read set aside, with its shape);
//   - which `.members` reads are the grouping's (an allowlist: every other `.members` is another shape);
//   - each src site's class (FPZ · BIRTH · DISPLAY · EDIT), the replacement read, and the lane that owns it.
// Run: node docs/chair/2026-11-07/people-5-prep/census.mjs <out.json>   (prints the summary tables)
import { writeFileSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filesUnder, scan, FIELDS, HELPERS } from './ast-sites.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../..');

/** A receiver that IS the powers (powerStructure or a local alias of it). */
export const POWERS_RECEIVER = /(powerStructure\)?|\bps|^power|politics|\.power|structure)$/;

/** `.factions` reads whose receiver is not the powers but which a read showed are ANOTHER shape. */
export const EXCLUDED = Object.freeze({
  'src/components/compendium/FactionEventBanner.jsx': 'CATEGORY_BY_KEY: the compendium palette',
  'src/components/home/HomeSampleDossier.jsx': 'SAMPLE_DOSSIER: a static marketing sample',
  'src/components/map/NpcTrailSection.jsx': 'npcLadder.factions: the FPZ ladder record (keyed by fkey)',
  'src/components/new/SummaryTab.jsx:36': 'w = powerStructure (destructured at :30)',
  'src/components/new/SummaryTab.jsx:48': 'FactionBar param, fed ps.factions at :124/:248',
  'src/components/new/tabs/HistoryTab.jsx': 't = a current tension: its own faction-name list',
  'src/components/new/tabs/OverviewTab.jsx': 't = a current tension: its own faction-name list',
  'src/components/new/tabs/PowerTab.jsx': 'r = the powerStructure prop (PowerTab.jsx:157)',
  'src/components/settlement/EventComposer.jsx:178': 'customContent.factions: the DM\'s custom powers',
  'src/domain/aiGrounding.js': 'payload.factions = deriveAllFactionProfiles (the powers\' profiles)',
  'src/domain/coherence/readerBattery.js:391': 't = a tension',
  'src/domain/density/densityBands.js': 'b.factions: the signed per-tier band',
  'src/domain/display/defenseDisplay.js': 'signal.factions: crimeSignal over the powers',
  'src/domain/dossier/dossierSearch.js:328': 'index.factions: the search index\'s own entries',
  'src/domain/dossier/realmEntityWeb.js:163': 'index.factions: the search index\'s own entries',
  'src/domain/dossier/realmEntityWeb.js:233': 'bundle.factions: index entries (the helper call at :234 is counted)',
  'src/domain/edit/recordInvariants.js': 'card = the POWER record card',
  'src/domain/npc/regenIdentityFold.js': 'rec.factions: the ladder ledger (keyed by fkey)',
  'src/domain/townMap/ladderRead.js': 'm.factions: the ladder ledger',
  'src/domain/worldPulse/gratitudeBonds.js': 'rawPriorRecord.factions: the ladder ledger',
  'src/domain/worldPulse/npcLadderKernel.js': 'prior.factions: the ladder ledger',
  'src/domain/worldPulse/npcLadderState.js': 'o/rec.factions: the ladder ledger',
  'src/domain/worldPulse/warPeaceDecision.js': 'record.factions: the ladder ledger',
  'src/domain/worldPulse/warSeatBooks.js:184': 'record.factions: the ladder ledger',
  'src/domain/worldPulse/beliefMap.js:828@asObject(s.politics)': 'politics.factions',
  'src/foundry/journalPages.js': 'p = vm.power (the PDF view model\'s powers, which fall back at viewModel.js:750)',
  'src/generators/aiLayer.js': 'ctx.factions = ps.factions labels (aiLayer.js:171)',
  'src/generators/density/applyDensityLaw.js:269': 'plan.factions: the density plan',
  'src/generators/density/applyDensityLaw.js:375': 'copy.factions: a powerStructure copy',
  'src/generators/density/applyDensityLaw.js:476': 'plan.factions: the density plan',
  'src/generators/density/densityRoll.js': 'bands.factions: the band',
  'src/generators/historyGenerator.js': 'tension.factions',
  'src/generators/power/economyReconciliation.js': 'projected.factions: the power projection',
  'src/generators/power/governanceNarrative.js': 'a destructured param fed the powers',
  'src/pdf/lib/viewModel.js:331': 't = a tension', 'src/pdf/lib/viewModel.js:492': 't = a tension', 'src/pdf/lib/viewModel.js:666': 't = a tension',
  'src/pdf/sections/PowerStructure.jsx': 'p = vm.power',
});
/** INDIRECT grouping reads: a COUNT of the grouping computed elsewhere (the source site is counted too). */
export const INDIRECT = Object.freeze({
  'src/components/dossier/CascadePreviewPanel.jsx': 'downstreamCounts.factions ← pendingEditsPreview.js:422',
  'src/lib/editFingerprint.js': 'dc.factions ← the same downstream count',
});
/** The `.members` reads that are the grouping's `members[]` (every other `.members` is another shape: coalitions, blocs, route networks, subFactions, ownership, the density plan's roster). */
export const GROUPING_MEMBERS = Object.freeze([
  'src/domain/coherence/hookTruthRecord.js', 'src/domain/edit/mergeConsequence.js', 'src/domain/factionRename.js',
  'src/domain/worldPulse/npcCirculationTable.js', 'src/domain/worldPulse/npcLedger.js', 'src/domain/worldPulse/npcVerdictApply.js',
  'src/domain/worldPulse/npcVerdictTable.js', 'src/generators/generationReceiptJudgments.js', 'src/generators/narrativeGenerator.js',
  'src/generators/power/conflicts.js',
]);
/** `dominantCategory` read on a grouping entry (computeNetworkEcho's is a local variable, not a key). */
export const GROUPING_DOMINANT = Object.freeze(['src/components/settlementDetail/SettlementDetailEditNames.jsx', 'src/generators/crossSettlementConflicts.js', 'src/lib/instantWorld/factionDedup.js']);

/** PEOPLE-0 §5's FPZ list (the simulation), verbatim by file; `ADDED` are the files this census found that it missed. */
export const FPZ_PEOPLE0 = Object.freeze([
  'src/domain/worldPulse/npcLadderFactionMembership.js', 'src/domain/worldPulse/npcLadderState.js', 'src/domain/worldPulse/npcLadderKernel.js',
  'src/domain/worldPulse/npcVerdictApply.js', 'src/domain/worldPulse/npcVerdictTable.js', 'src/domain/worldPulse/npcLedger.js',
  'src/domain/worldPulse/npcCirculationTable.js', 'src/domain/worldPulse/npcAgency.js', 'src/domain/worldPulse/houseLedger.js',
  'src/domain/worldPulse/factionDensityKernel.js', 'src/domain/worldPulse/successorNpc.js', 'src/domain/worldPulse/causeLifecycle.js',
  'src/domain/worldPulse/oathHolder.js', 'src/domain/worldPulse/religionLegitimacy.js', 'src/domain/worldPulse/warSeatBooks.js',
  'src/domain/worldPulse/assizeKernel.js', 'src/domain/worldPulse/corruptionImpair.js', 'src/domain/worldPulse/causeVocabulary.js',
  'src/domain/worldPulse/warRulingsNews.js', 'src/domain/worldPulse/warPoliticalLoop.js', 'src/domain/worldPulse/settlementPolitics.js',
  'src/domain/worldPulse/supplyKernel.js', 'src/domain/worldPulse/beliefMap.js', 'src/domain/worldPulse/brokeragePatronage.js',
  'src/domain/worldPulse/factionCompetition.js', 'src/domain/worldPulse/thievesGuild.js', 'src/domain/worldPulse/factionCapture.js',
  'src/domain/corruption.js', 'src/domain/density/factionLifecycle.js', 'src/generators/density/densityAscension.js',
  'src/domain/events/mutateEntities.js', 'src/domain/events/mutateHelpers.js', 'src/domain/events/undoEvent.js', 'src/domain/events/registry.js',
  'src/domain/events/affordanceManifest.js', 'src/domain/events/batch.js', 'src/domain/events/factionResponses.js',
  'src/domain/entities/propagate.js', 'src/store/settlementSlice.js',
]);
/** Files the syntax-tree pass found under the simulation's own directories (or on its sole path) that PEOPLE-0's list missed. */
export const FPZ_ADDED = Object.freeze({});

/**
 * Every non-FPZ src file with a site: [class, owner, replacement read, note].
 * class: BIRTH (generation writes/reads at birth) · DISPLAY (a surface, search, veil, AI, PDF, Foundry, receipts read at render)
 *        · EDIT (the DM edit layer, the merge, the save) · RETIRED (a birth path PEOPLE-1 retires from birth).
 * replacement: rank-1 membership · any membership · the institution · the powers · delete.
 */
export const SRC_CLASS = Object.freeze({
  // ── BIRTH ──
  'src/generators/npcGenerator.js': ['BIRTH', 'PEOPLE-1', 'any membership (W memberships); factionGoal delete', 'the old affiliation writers; PEOPLE-1 writes memberships + the shim'],
  'src/generators/steps/corruptionPass.js': ['BIRTH', 'PEOPLE-5', 'the institution (corruptTies already carries the house) / delete', 'writes secondaryAffiliation = a criminal INSTITUTION name; the shim overwrites with rank-2 — PEOPLE-1 must order it'],
  'src/generators/npcStructure.js': ['BIRTH', 'PEOPLE-2', 'rank-1 membership', 'structuralRank/structuralPosition/goal.short from the first-rank power'],
  'src/generators/power/factionGrouping.js': ['BIRTH', 'PEOPLE-5', 'delete', 'the grouping\'s builder'],
  'src/generators/steps/assembleSettlement.js': ['BIRTH', 'PEOPLE-5', 'delete (grouping) · the powers (generateConflicts, PEOPLE-3)', ':347 writes the grouping; :351 conflicts over it (PEOPLE-3 re-pairs over powers); :139 the neighbour copy'],
  'src/generators/generateSettlementPipeline.js': ['BIRTH', 'PEOPLE-5', 'delete', ':449 relink + :579-584 the regen roster\'s grouping'],
  'src/generators/narrativeGenerator.js': ['BIRTH', 'PEOPLE-5', 'delete', 'relinkFactionMembers'],
  'src/generators/power/conflicts.js': ['BIRTH', 'PEOPLE-3', 'the powers', 'pairs from grouping members'],
  'src/generators/factionRoles.js': ['RETIRED', 'PEOPLE-1', 'delete', 'legacy office NPCs (pre-law worlds)'],
  'src/generators/density/applyDensityLaw.js': ['RETIRED', 'PEOPLE-1', 'delete', 'the density roster\'s affiliation'],
  'src/generators/density/titularSuccession.js': ['RETIRED', 'PEOPLE-1', 'any membership', 'rung reads via factionRosterOf (an FPZ helper)'],
  'src/domain/density/densityRungs.js': ['RETIRED', 'PEOPLE-1', 'delete', 'RUNG_ROLE_FIELD'],
  'src/generators/steps/resolveCrisisCast.js': ['BIRTH', 'PEOPLE-2', 'delete (the temp NPC carries memberships: [])', ''],
  'src/domain/crisis/crisisCast.js': ['BIRTH', 'PEOPLE-2', 'any membership, by rank', 'membersOf + exploiter/scapegoat/collaborator/brunt'],
  'src/domain/crisis/crisisHooks.js': ['BIRTH', 'PEOPLE-2', 'rank-1 membership', 'the "X of House" party'],
  'src/domain/dossier/seatHolder.js': ['BIRTH', 'PEOPLE-2', 'rank-1 membership (of the governing power)', 'through npcInFaction'],
  'src/domain/coherence/seatHolderFindings.js': ['BIRTH', 'PEOPLE-2', 'rank-1 membership', 'through npcInFaction'],
  'src/domain/coherence/crisisCastFindings.js': ['BIRTH', 'PEOPLE-2', 'any membership', ''],
  'src/generators/crossSettlementConflicts.js': ['BIRTH', 'PEOPLE-5', 'the powers', 'grouping + dominantCategory'],
  'src/generators/neighbourGenerator.js': ['BIRTH', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/generators/generationCoherence.js': ['BIRTH', 'PEOPLE-5', 'delete', 'the grouping copy in the receipt input'],
  'src/generators/generationReceiptJudgments.js': ['BIRTH', 'PEOPLE-5', 'any membership (each ∈ powers)', 'affiliation ∈ powers; grouping identity/members'],
  'src/generators/recordBatteryFindings.js': ['BIRTH', 'PEOPLE-5', 'the powers', 'grouping names; PEOPLE-3 touches this file for hook classes'],
  'src/domain/coherence/hookTruthRecord.js': ['BIRTH', 'PEOPLE-3', 'the powers / any membership', 'the hook-truth record\'s grouping copy'],
  'src/domain/coherence/readerBattery.js': ['BIRTH', 'PEOPLE-5', 'any membership (shared power)', ':320 two NPCs\' factions'],
  'src/data/foundingSeeds.js': ['BIRTH', 'PEOPLE-2', 'rank-1 membership (its rank)', 'a founding-seed causal row cites `npcs[].structuralRank` as its effect field (a path string); it moves with PEOPLE-2\'s writer'],
  'src/lib/structuralFingerprint.js': ['BIRTH', 'PEOPLE-5', 'rank-1 membership (rank distribution)', 'structural_rank_dist'],
  // ── DISPLAY ──
  'src/components/new/npcComponents.jsx': ['DISPLAY', 'PEOPLE-5', 'rank-1 membership (+ the rank list, the institution)', ':85 search (any membership), :337 the faction line'],
  'src/components/new/tabs/NPCsTab.jsx': ['DISPLAY', 'PEOPLE-5', 'rank-1 membership', 'group by first-rank power'],
  'src/components/new/tabs/power/PowerStrata.jsx': ['DISPLAY', 'PEOPLE-5', 'any membership', 'member count (+ the top three)'],
  'src/components/new/SummaryTab.jsx': ['DISPLAY', 'PEOPLE-5', 'delete', ':122 destructures the grouping as `_factionGroups` and never reads it'],
  'src/components/OutputContainer.jsx': ['DISPLAY', 'PEOPLE-5', 'the powers', 'grouping length'],
  'src/components/library/LibraryToolbar.jsx': ['DISPLAY', 'PEOPLE-5', 'the powers', 'search names'],
  'src/components/dossier/SettlementWorkbench.jsx': ['DISPLAY', 'PEOPLE-5', 'rank-1 membership', ''],
  'src/components/dossier/CascadePreviewPanel.jsx': ['DISPLAY', 'PEOPLE-5', 'the powers', 'a count (INDIRECT)'],
  'src/domain/ai/personaSlicer.js': ['DISPLAY', 'PEOPLE-5', 'rank-1 membership · the powers', ''],
  'src/domain/ai/suggestedQuestions.js': ['DISPLAY', 'PEOPLE-5', 'the powers', ''],
  'src/domain/npcProfile.js': ['DISPLAY', 'PEOPLE-5', 'rank-1 membership', 'factionLink + rank'],
  'src/domain/factionProfile.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/domain/dossier/plotHooks.js': ['DISPLAY', 'PEOPLE-3', 'rank-1 membership', 'the NPC sub-line (PEOPLE-3 keeps `links`; PEOPLE-5 reads `parties`)'],
  'src/domain/dossier/dossierSearch.js': ['DISPLAY', 'PEOPLE-5', 'any membership · the powers', ''],
  'src/domain/dossier/entityLinks.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/domain/dossier/realmEntityWeb.js': ['DISPLAY', 'PEOPLE-5', 'any membership', 'through npcInFaction'],
  'src/domain/display/dossierViewModel.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/domain/display/galleryVeil.js': ['DISPLAY', 'PEOPLE-5', 'veil `memberships` + `institution`', 'key lists by string'],
  'src/domain/display/publicSafe.js': ['DISPLAY', 'PEOPLE-5', 'veil `memberships` + `institution`', 'key lists + the projected copy'],
  'src/domain/districtProfile.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/domain/tableLedger.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/domain/state/deriveSystemState.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/domain/normalizeSettlement.js': ['EDIT', 'PEOPLE-5', 'the powers (delete the fallback)', 'the load path'],
  'src/domain/factions/factionCatalog.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', 'NOT in PEOPLE-0 §5 (the compendium\'s present-names read)'],
  'src/domain/content/contentSampleCategoryFixtures.js': ['DISPLAY', 'PEOPLE-5', 'the powers', 'NOT in PEOPLE-0 §5'],
  'src/domain/content/settlementContentProvenance.js': ['DISPLAY', 'PEOPLE-5', 'the powers', 'NOT in PEOPLE-0 §5'],
  'src/pdf/lib/viewModel.js': ['DISPLAY', 'PEOPLE-5', 'rank-1 membership (label) · the powers (fallbacks)', ''],
  'src/pdf/lib/viewModelBodySlices.js': ['DISPLAY', 'PEOPLE-5', 'the powers (delete the fallback)', ''],
  'src/lib/instantWorld/factionDedup.js': ['DISPLAY', 'PEOPLE-5', 'the powers', 'instant world dedup over the grouping'],
  'src/lib/editFingerprint.js': ['DISPLAY', 'PEOPLE-5', 'the powers', 'a count (INDIRECT)'],
  'src/components/settlement/EventComposer.jsx': ['EDIT', 'PEOPLE-5', 'rank-1 membership', ':215 the event\'s faction'],
  // ── EDIT ──
  'src/components/settlementDetail/SettlementDetailEditNames.jsx': ['EDIT', 'PEOPLE-5', 'the powers', 'the rename list over the grouping'],
  'src/domain/factionRename.js': ['EDIT', 'PEOPLE-5', 'delete (the second home) · the powers', 'NPC_FACTION_FIELDS + the grouping walks'],
  'src/domain/institutionRename.js': ['EDIT', 'PEOPLE-5', 'the institution', 'secondaryAffiliation as an institution handle + two faction-ledger label rows'],
  'src/store/settlementPendingEditWriters.js': ['EDIT', 'PEOPLE-5', 'memberships + institution (seat fields)', 'SEAT_FIELDS'],
  'src/domain/pendingEditIntents.js': ['EDIT', 'PEOPLE-5', 'memberships + institution (seat fields)', 'SEAT_FIELDS / SEAT_ARRAY_FIELDS'],
  'src/domain/npc/npcOps.js': ['EDIT', 'PEOPLE-5', 'memberships + institution (seat fields)', 'SEAT_HELD_FIELDS'],
  'src/domain/pendingEditsPreview.js': ['EDIT', 'PEOPLE-5', 'the powers', 'downstreamCounts.factions'],
  'src/domain/edit/mergeConsequence.js': ['EDIT', 'PEOPLE-5', 'delete', 'recomputeMirrors (the MIRROR row)'],
  'src/domain/intent/opVocabulary.js': ['EDIT', 'PEOPLE-5', 'the powers', 'protected ids'],
  'src/domain/entities/npcs.js': ['EDIT', 'PEOPLE-5', 'any membership', 'createNpc / kill / assign'],
  'src/domain/entities/successors.js': ['EDIT', 'PEOPLE-5', 'any membership · the powers', 'inferSuccessors'],
  'src/domain/factionRefs.js': ['EDIT', 'PEOPLE-5', 'any membership', 'entityLinksFaction'],
  'src/domain/customContent.js': ['EDIT', 'PEOPLE-5', 'rank-1 membership', 'controlledBy'],
  'src/domain/regenerationMode.js': ['EDIT', 'PEOPLE-5', 'the powers (delete the fallback)', 'NOT in PEOPLE-0 §5'],
  'src/domain/relationships/neighbourBackLink.js': ['EDIT', 'PEOPLE-5', 'delete', 'the back-link copies the grouping onto the partner save'],
});

const REPL_BY_NAME = { factions: 'the powers', members: 'any membership', dominantCategory: 'the powers (category)', factionAffiliation: 'rank-1 membership', secondaryAffiliation: 'any membership (rank 2)', linkedFactionIds: 'any membership', factionGoal: 'delete', densityRungRole: 'delete', structuralRank: 'rank-1 membership (its rank)', npcInFaction: 'any membership', factionRosterOf: 'any membership', npcHomeInstitution: 'the institution' };

function key(site) { return `${site.file}:${site.line}`; }
function excludedReason(site) {
  return EXCLUDED[`${site.file}:${site.line}@${site.receiver}`] || EXCLUDED[key(site)] || EXCLUDED[site.file] || null;
}

/** Keep the sites that touch the grouping, the six fields or the helpers; tag each. */
export function relevant(sites, { isTest = false } = {}) {
  const out = [];
  for (const s of sites) {
    if (FIELDS.includes(s.name) || HELPERS.includes(s.name)) { out.push({ ...s, subject: s.name }); continue; }
    if (s.name === 'factions') {
      if (POWERS_RECEIVER.test(s.receiver || '')) continue;
      if (s.kind === 'write' && s.receiver === '{literal}') continue; // literal keys: classified as writers by hand in the record (§1.4)
      if (!isTest) {
        if (INDIRECT[s.file]) { out.push({ ...s, subject: 'factions', indirect: INDIRECT[s.file] }); continue; }
        if (excludedReason(s)) continue;
      } else if (!TEST_GROUPING_RECEIVERS.has(s.receiver || '')) continue;
      out.push({ ...s, subject: 'factions' }); continue;
    }
    if (s.name === 'members' && !isTest && GROUPING_MEMBERS.includes(s.file)) { out.push({ ...s, subject: 'members' }); continue; }
    if (s.name === 'dominantCategory' && (isTest || GROUPING_DOMINANT.includes(s.file))) { out.push({ ...s, subject: 'dominantCategory' }); continue; }
  }
  return out;
}
/** In tests, the receivers that are a settlement record (PLAUSIBLE: a receiver rule, not a per-site read). */
export const TEST_GROUPING_RECEIVERS = new Set(['s', 'settlement', 'nextSettlement', 'birth.save.settlement', 'held', 'rec', 'value', 'pruned', 'found', 'parts', 'low', 'high', 'row.record', 'out', 'blob', 'record', 'merged', 'next', 'result', 'r', 'res', 'world', 'saved', 'loaded', 'migrated', 'normalized', 'gen', 'generated', 'a', 'b', 'base', 'fresh', 'regen', 'before', 'after', 'copy', 'clone', 'restored', 'entry.settlement', 'save.settlement', 'state.settlement', 'live', 'reloaded', 'roundTrip']);

export function classifySrc(site) {
  if (FPZ_PEOPLE0.includes(site.file) || FPZ_ADDED[site.file]) return { cls: 'FPZ', owner: 'FPZ', replacement: REPL_BY_NAME[site.subject], note: FPZ_ADDED[site.file] || '' };
  const row = SRC_CLASS[site.file];
  if (!row) return { cls: 'UNCLASSIFIED', owner: '?', replacement: REPL_BY_NAME[site.subject], note: '' };
  return { cls: row[0], owner: row[1], replacement: row[2], note: row[3] };
}

// ── tests ──
const GOLDEN_RE = /generator-golden-master|fence|preset-lighting-witness-golden|dossier-prose-manifest-golden|DormancyGolden|goldenRecordDoor/;
export function classifyTest(file, text) {
  if (GOLDEN_RE.test(file) || GOLDEN_RE.test(text)) return 'golden door\'s → bank';
  if (/worldPulse|\/events?\b|simulation\/|factionLifecycle|densityAscension|npcLadder|corruptionImpair|propagate/.test(file)
    || /from '[./]*\/src\/domain\/(worldPulse|events)\//.test(text)) return 'FPZ\'s → list';
  if (/^tests\/(components|ui|pdf|foundry|dossier|hooks)\//.test(file)
    || /from '[./]*\/src\/(components|pdf|foundry)\/|src\/domain\/(display|dossier)\//.test(text)) return 'asserts a surface → rewire';
  return 'pins a field by identity → re-key';
}

// ── run ──
const outPath = process.argv[2];
if (outPath) {
  const src = scan(ROOT, filesUnder(ROOT, 'src'));
  const testFiles = []; const walk = (d) => { for (const n of readdirSync(join(ROOT, d))) { const r = join(d, n); if (statSync(join(ROOT, r)).isDirectory()) walk(r); else if (/\.(m?js|jsx)$/.test(n)) testFiles.push(r); } }; walk('tests');
  const tst = scan(ROOT, testFiles);
  const srcSites = relevant(src.sites).map((s) => ({ ...s, ...classifySrc(s) }));
  const reads = srcSites.filter((s) => s.kind !== 'write' && s.kind !== 'delete' && s.kind !== 'def' && s.kind !== 'export');
  const writes = srcSites.filter((s) => s.kind === 'write' || s.kind === 'delete');
  const bySubject = {}; const byClass = {}; const filesByClass = {}; const byOwner = {};
  for (const s of reads) {
    bySubject[s.subject] = (bySubject[s.subject] || 0) + 1;
    byClass[s.cls] = (byClass[s.cls] || 0) + 1; (filesByClass[s.cls] ||= new Set()).add(s.file);
    byOwner[`${s.cls} · ${s.owner}`] = (byOwner[`${s.cls} · ${s.owner}`] || 0) + 1;
  }
  const testRel = relevant(tst.sites, { isTest: true }).filter((s) => /\.test\./.test(s.file));
  const testFilesHit = [...new Set(testRel.map((s) => s.file))].sort();
  const testRows = testFilesHit.map((f) => {
    const subjects = [...new Set(testRel.filter((s) => s.file === f).map((s) => s.subject))];
    return { file: f, subjects, cls: classifyTest(f, readFileSync(join(ROOT, f), 'utf8')) };
  });
  const testByClass = {}; for (const r of testRows) testByClass[r.cls] = (testByClass[r.cls] || 0) + 1;
  const fieldTests = testRows.filter((r) => r.subjects.some((x) => x !== 'factions')).length;
  const summary = {
    srcFilesScanned: filesUnder(ROOT, 'src').length, srcUnparsed: src.unparsed, testFilesScanned: testFiles.length, testUnparsed: tst.unparsed,
    srcReadSites: reads.length, srcWriteSites: writes.length,
    srcReadFiles: new Set(reads.map((s) => s.file)).size,
    readsBySubject: bySubject, readsByClass: byClass, readFilesByClass: Object.fromEntries(Object.entries(filesByClass).map(([k, v]) => [k, v.size])),
    readsByClassOwner: byOwner, unclassified: [...new Set(srcSites.filter((s) => s.cls === 'UNCLASSIFIED').map((s) => s.file))],
    testFiles: testRows.length, testFilesReadingAField: fieldTests, testFilesGroupingOnly: testRows.length - fieldTests, testByClass,
  };
  writeFileSync(outPath, JSON.stringify({ summary, srcSites, testRows }, null, 1));
  console.log(JSON.stringify(summary, null, 1));
}
