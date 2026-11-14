// tests/lint/legacyFactionReaders/noLegacyFactionReaders.core.mjs — promoted by PEOPLE-LAND (2026-11-07) from
// PEOPLE-5-PREP's draft (docs/chair/2026-11-07/people-5-prep/, measure-only). The landing's changes: the fixture
// moved beside it (fpz-list.json, three rows added with their reasons), `structuralRank` dropped from the refused
// fields (the brief: a real field, lane 2's), the drifted file:line rows re-keyed, new OTHER_SHAPES rows with
// their reasons, and the migration's one class (MIGRATION_FILES).
//
// The pure half of the FPZ walker PEOPLE-5 ends with (M-2's last sentence; PEOPLE-0 §5's last paragraph):
// every read in `src/` (non-test) of the NPC grouping `settlement.factions` (its `members[]`, its
// `dominantCategory`), of the six per-NPC faction fields, or of the two legacy helpers that read
// them, OUTSIDE the FPZ list (`fpz-list.json`), is a violation. PEOPLE-5 moves this file beside its
// walker under `tests/lint/` (with `ast-sites.mjs`), points `FPZ_LIST` at the fixture's new home, and
// deletes the `OTHER_SHAPES` rows whose files it rewires.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { filesUnder, sitesIn, FIELDS } from './ast-sites.mjs';

/** A receiver that IS the powers (`powerStructure.factions` and its local aliases): never a violation. */
export const POWERS_RECEIVER = /(powerStructure\)?|\bps|^power|politics|\.power|structure)$/;

/**
 * ⚠ CHAIR POINT (record §4.2): PEOPLE-2's brief keeps a real writer of `structuralRank` (npcStructure.js,
 * from the first-rank power) while M-2 lists it among the six the walker refuses. Until the chair rules,
 * the draft refuses all six; dropping `structuralRank` from this list is the one-line change a ruling makes.
 */
export const REFUSED_FIELDS = Object.freeze(FIELDS.filter((f) => f !== 'structuralRank'));

/** Helpers that read a refused field on the caller's behalf. `npcInFaction` is NOT here: PEOPLE-2 re-points
 *  its input to memberships, so a call is a membership read (its own body stays FPZ's). */
export const REFUSED_HELPERS = Object.freeze(['factionRosterOf', 'npcHomeInstitution']);

/**
 * `.factions` / `.members` / `dominantCategory` reads whose receiver is NOT the powers but which a read of
 * the site showed are ANOTHER shape (a tension's names, the ladder ledger, a search index, a palette, a
 * coalition). Keyed by file (or file:line); a row here is a reviewed exemption, never a silent one.
 */
export const OTHER_SHAPES = Object.freeze({
  'src/components/compendium/FactionEventBanner.jsx': 'the compendium palette',
  'src/components/home/HomeSampleDossier.jsx': 'a static sample dossier',
  'src/components/map/NpcTrailSection.jsx': 'the ladder record',
  'src/components/new/SummaryTab.jsx:36': 'w = powerStructure', 'src/components/new/SummaryTab.jsx:48': 'FactionBar(ps.factions)',
  'src/components/new/tabs/HistoryTab.jsx': 'a tension\'s faction names', 'src/components/new/tabs/OverviewTab.jsx': 'a tension\'s faction names',
  'src/components/new/tabs/PowerTab.jsx': 'r = powerStructure',
  'src/components/settlement/EventComposer.jsx:179': 'the DM\'s custom powers',
  'src/components/dossier/CascadePreviewPanel.jsx:288': 'the preview\'s powers count (MERGE-5AB ruling 1: the preview is the edit layer\'s)',
  'src/lib/editFingerprint.js:63': 'the preview\'s powers count (MERGE-5AB ruling 1)',
  'src/domain/dossier/plotHooks.js:462': 'a tension\'s camps', // re-keyed by identity 445 -> 452 at MERGE-WAVE's FIX-EXPORT-KEYS point: W7 HOOKS's conflict hooks (fdf41ee95) sit above it; 452 -> 462 at SW-6 CRISIS-SURFACES (91622ea6f): the import and `titleOfToken` sit above it
  'src/domain/aiGrounding.js': 'the powers\' profiles', 'src/domain/coherence/readerBattery.js:307': 'a tension',
  'src/domain/density/densityBands.js': 'the signed band', 'src/domain/display/defenseDisplay.js': 'the crime signal',
  'src/domain/dossier/dossierSearch.js:329': 'the search index', 'src/domain/dossier/realmEntityWeb.js:163': 'the search index',
  'src/domain/dossier/realmEntityWeb.js:233': 'index entries', 'src/domain/edit/recordInvariants.js': 'the power card',
  'src/domain/npc/regenIdentityFold.js': 'the ladder ledger', 'src/domain/townMap/ladderRead.js': 'the ladder ledger',
  'src/domain/worldPulse/gratitudeBonds.js': 'the ladder ledger', 'src/domain/worldPulse/npcLadderKernel.js': 'the ladder ledger',
  'src/domain/worldPulse/warPeaceDecision.js': 'the ladder ledger',
  'src/foundry/journalPages.js': 'vm.power', 'src/generators/aiLayer.js': 'power labels',
  'src/generators/density/densityRoll.js': 'the band', 'src/generators/historyGenerator.js': 'a tension',
  'src/generators/power/economyReconciliation.js': 'the power projection', 'src/generators/power/governanceNarrative.js': 'the powers (param)',
  // re-keyed by identity 337/500/682 -> 345/508/690 (MERGE-TRAIN at the ALLEGIANCE-CAR3 merge: the same three tension reads, moved 8 lines by car 3's dmPowerViewOf import and the opt-in dmView, composed over the integration's +3)
  // re-keyed by identity 345/508/690 -> 346/509/691 (COHERENCE-POWERS-4: the same three tension reads, moved one line by the third seat's seatKeeperOf import, F7)
  'src/pdf/lib/viewModel.js:346': 'a tension', 'src/pdf/lib/viewModel.js:509': 'a tension', 'src/pdf/lib/viewModel.js:691': 'a tension', // W4 PEOPLE second seat (merging the car): re-keyed +3 by line, #29's crisisSummaryForSurface import and cover/overview vantage lines above them
  'src/pdf/sections/PowerStructure.jsx': 'vm.power',
  // COHERENCE-POWERS-3 F2 (28c93c9da): a tension's parties, re-named for the final roster (settleTensionsToRoster); read as viewModel's are
  'src/generators/power/rosterText.js:123': 'a tension',
  // density plan / ladder rows that PEOPLE-1 retires with the roster (kept so the draft is exact at the base):
  'src/generators/density/applyDensityLaw.js:269': 'the density plan', 'src/generators/density/applyDensityLaw.js:375': 'a powerStructure copy',
  'src/generators/density/applyDensityLaw.js:476': 'the density plan',
});
/** `.members` is the grouping's only where the receiver is a grouping entry; these files were read and are. */
export const GROUPING_MEMBER_FILES = Object.freeze([
  'src/domain/coherence/hookTruthRecord.js', 'src/domain/edit/mergeConsequence.js', 'src/domain/factionRename.js',
  'src/generators/generationReceiptJudgments.js', 'src/generators/narrativeGenerator.js', 'src/generators/power/conflicts.js',
]);
const GROUPING_DOMINANT_FILES = Object.freeze(['src/components/settlementDetail/SettlementDetailEditNames.jsx', 'src/generators/crossSettlementConflicts.js', 'src/lib/instantWorld/factionDedup.js']);

/**
 * A refused FIELD read kept by a contract outside the car, keyed by file:line (or file), each with its reason —
 * reviewed by the landing (PEOPLE-LAND, 2026-11-07), never silent. Nothing generated feeds these on a v2 record.
 */
// FIX-EXPORT-KEYS (2026-11-07): the publicSafe.js rows (here and in OTHER_SHAPES) left with migration 205 — the
// public projection's allowlists and publicNpc no longer name the grouping or the two fields, so no exemption is owed.
export const FIELD_CONTRACTS = Object.freeze({
  'src/domain/customContent.js:393': 'a DM-authored custom-content library entity\'s legacy `controlledBy` fallback (not a generated card; no settlement migration covers that store)',
});

/**
 * ONE DECLARED CLASS, v1-migration-reads (the chair's ruling on MERGE-5AB's STOP, the same class the
 * observed-shape rung 31 admits): "the migration reads the five legacy fields once, by design, to move them".
 */
export const MIGRATION_FILES = Object.freeze({
  'src/domain/settlementMigrations.js': 'v1-migration-reads: the migration reads the five legacy fields once, by design, to move them',
});

const READ_KINDS = new Set(['read', 'destructure', 'string', 'path-string', 'call', 'import']);

/**
 * The violations in one file's source. Pure: the walker and the positive control both call it.
 * @param {string} file repo-relative path @param {string} source
 * @returns {{ parsed: boolean, violations: Array<{file: string, line: number, name: string, kind: string, receiver?: string}> }}
 */
export function violationsIn(file, source) {
  const r = sitesIn(source);
  if (!r.parsed) return { parsed: false, violations: [] };
  const exempt = (s) => OTHER_SHAPES[`${file}:${s.line}`] || OTHER_SHAPES[file];
  const violations = [];
  for (const s of r.sites) {
    if (!READ_KINDS.has(s.kind)) continue;
    let bad = false;
    if (REFUSED_FIELDS.includes(s.name)) bad = s.kind !== 'call' && s.kind !== 'import' && !(FIELD_CONTRACTS[`${file}:${s.line}`] || FIELD_CONTRACTS[file]);
    else if (REFUSED_HELPERS.includes(s.name)) bad = s.kind === 'call';
    else if (s.name === 'factions') bad = s.kind !== 'string' && !POWERS_RECEIVER.test(s.receiver || '') && !exempt(s);
    else if (s.name === 'members') bad = GROUPING_MEMBER_FILES.includes(file) && s.kind === 'read';
    else if (s.name === 'dominantCategory') bad = GROUPING_DOMINANT_FILES.includes(file) && s.kind === 'read';
    if (bad) violations.push({ file, line: s.line, name: s.name, kind: s.kind, receiver: s.receiver });
  }
  return { parsed: true, violations };
}

/** Walk `src/` minus the FPZ list. @returns {{ violations: object[], unparsed: string[], scanned: number, fpz: number }} */
export function walk(root, fpzListPath) {
  const fpz = new Set(JSON.parse(readFileSync(fpzListPath, 'utf8')).files.map((f) => f.file));
  const files = filesUnder(root, 'src');
  const violations = []; const unparsed = [];
  for (const f of files) {
    if (fpz.has(f) || MIGRATION_FILES[f]) continue;
    const r = violationsIn(f, readFileSync(join(root, f), 'utf8'));
    if (!r.parsed) unparsed.push(f);
    violations.push(...r.violations);
  }
  return { violations, unparsed, scanned: files.length, fpz: fpz.size };
}
