/**
 * institutionRename.js — THE ONE INSTITUTION-RENAME WRITER (design §22.1 ruling 7).
 *
 * WHY THIS MODULE EXISTS. An institution's NAME is its join key. Before this
 * landed, no institution rename or removal writer existed anywhere in `src`, and
 * renaming the worst-case house of each generated settlement left 4,034 stored
 * handles pointing at a name nothing answered to, across 33 observed paths, on
 * 525 corpus rows. Nothing threw and nothing was logged; four of those surfaces
 * are ones a DM reads on the page.
 *
 * COPIED FROM factionRename.js, AND DELIBERATELY SIMPLER IN THREE WAYS, each
 * measured rather than assumed:
 *   1. AN INSTITUTION HAS ONE NAME SPELLING. 17,361 of 17,361 generated records
 *      carry `name`; none carries `id` or `localUid`. So there is no dual-write,
 *      no accessor, and the FACTION-ACCESS LAW has no counterpart here.
 *   2. NOT ONE CASCADE ROW IS PROSE. Every declared row is a stored key join,
 *      exact or case-folded, so `substituteWholeWord` is never imported and the
 *      word-boundary hazard class the faction cascade carries does not exist.
 *   3. THE ONLY RUNTIME IMPORTS ARE `deepClone` AND `NPC_HOMES`.
 *
 * ⛔ EVERY SURFACE IS RESOLVED FROM A DECLARED STRING PATH, never spelled as a
 * property access. That is a contract, not a style: `tests/lint/
 * ruinFilterRoster.walker.test.js` pins its `src/domain` discovery set EXACT, and
 * a roster read written as executable code would enrol this leaf and red it. The
 * declarative form is also what keeps the 36 rows a ledger rather than a program.
 *
 * ⛔ NO EM DASH AND NO EXCLAMATION POINT IN ANY STRING LITERAL HERE. The Tier 2
 * voice walker holds a file with no baseline row at ZERO; the replacement
 * separator is a colon or a comma.
 *
 * PURE. No store, no persistence, no React. Callers own the write-back.
 */

import { deepClone } from './clone.js';
import { NPC_HOMES as INSTITUTION_HOMES } from './factionRename.js';

/**
 * A stored record as this module sees one. Deliberately `unknown`-valued rather
 * than `any`: every read below is typeof-guarded anyway, so the precision is free.
 * @typedef {{ [key: string]: unknown }} StoredRecord
 */
/** @typedef {'chain-lost-its-last-processor'|'chain-label-names-a-removed-house'} OrphanKind */
/** @typedef {{ kind: OrphanKind, path: string, chainId: string|null }} OrphanNote */
/** ⛔ A CLOSED VOCABULARY OF TWO, in `OrphanKind`'s exact shape. @typedef {'verbatim'|'lower'} LabelRewrite */
/** @typedef {{ owner: StoredRecord, key: string, isList: boolean, holder: unknown[]|null, index: number, via: { owner: StoredRecord, key: string }|null }} Site */
/** One declared row of the cascade list. `rewrite` is present only on a `label` row. @typedef {{ path: string, match: 'exact'|'label', rewrite?: LabelRewrite, removal: string, why: string }} SurfaceRow */
/** One institution-name-bearing field an NPC record carries, before it is spread across the two homes. @typedef {{ parent: string|null, key: string, list: boolean, removal: string, why: string }} HandleField */
/** One row of the NON_CASCADED ledger. @typedef {{ path: string, kind: string, readable: boolean, why: string }} LedgerRow */

/** The settlement buckets the cascade can reach, for the immutable form's minimal clone. */
const CASCADE_BUCKETS = Object.freeze([
  'institutions', 'availableServices', 'economicState', 'resourceAnalysis',
  'defenseProfile', 'spatialLayout', 'npcs', 'factions',
]);

/** The eleven service categories `servicesGenerator` writes, each entry keyed by its own `institution`. */
const SERVICE_CATEGORIES = Object.freeze([
  'equipment', 'legal', 'healing', 'employment', 'entertainment', 'food',
  'lodging', 'magic', 'information', 'transport', 'criminal',
]);

/** The seven defense buckets, each holding institution RECORDS keyed by `name`. */
const DEFENSE_CATEGORIES = Object.freeze([
  'garrison', 'magicDef', 'walls', 'watch', 'charter', 'mercenary', 'militia',
]);

/**
 * ⭐ FIX-D5, RULED IN. `availableServices.*[].institution` may hold a parenthetical
 * PROVENANCE WORD instead of a house: a stress flag or a crime type for a service
 * with no building behind it. The dangle denominator excludes a sentinel BY THIS
 * DECLARED LIST, never by a `startsWith` shape guess, so the exclusion is
 * falsifiable. These are the eleven literals `src/generators/servicesGenerator.js`
 * actually writes as `addCrimeService`'s third argument, three of them live.
 * @type {ReadonlyArray<string>}
 */
export const SERVICE_PROVENANCE_SENTINELS = Object.freeze([
  '(arcane underground)', '(commercial crime)', '(covert)', '(criminal governance)',
  '(informal)', '(lawless)', '(religious fraud)', '(smuggling)', '(state apparatus)',
  '(street gang)', '(thieves guild)',
]);

/**
 * ⛔ THE REWRITE FORMS, FROZEN, AND THE VOCABULARY IS THIS MAP'S OWN KEY SET.
 * A `label` row declares which form its path takes; the cascade reads the form OFF
 * THE ROW and never spells one at a call site. A third form entering this map reds
 * A1 (vi) the day it is added rather than the day a DM reads a mangled label.
 * @type {Readonly<Record<LabelRewrite, (name: string) => string>>}
 */
export const LABEL_REWRITE = Object.freeze({
  verbatim: (name) => name,
  lower: (name) => name.toLowerCase(),
});

/**
 * Every institution-name-bearing field an NPC record carries, declared ONCE and
 * applied at BOTH homes. A character is stored twice (see `NPC_HOMES`), the alias
 * splits on reload, and a field added for one home can never be forgotten at the
 * other while the list lives here.
 * @type {ReadonlyArray<HandleField>}
 */
const INSTITUTION_HANDLE_FIELDS = Object.freeze([
  { parent: null, key: 'institution', list: false, removal: 'delete-key',
    why: 'the employing house a pipeline character is attached to' },
  { parent: null, key: 'secondaryAffiliation', list: false, removal: 'delete-key',
    why: 'the second attachment npcGenerator writes for a character with a criminal or civic tie' },
  { parent: 'corruptTies', key: 'thievesGuild', list: false, removal: 'delete-key',
    why: 'the corruption record names the guild house by its own name' },
  { parent: 'corruptTies', key: 'criminalInstitution', list: false, removal: 'delete-key',
    why: 'the second corruption tie, the criminal house itself' },
  { parent: null, key: 'linkedInstitutionIds', list: true, removal: 'drop-item',
    why: 'a generated institution has no id, so factionRoles stores the NAME here and calls the branch rename-sensitive; a mixed id and name list heals only its name half' },
]);

/**
 * The stored path of one handle field under one of the two homes.
 * @param {string} home @param {HandleField} field @returns {string}
 */
function handlePath(home, field) {
  const owner = field.parent ? `${home}.${field.parent}` : home;
  return `${owner}.${field.key}${field.list ? '[]' : ''}`;
}

/**
 * ⭐ THE ENUMERATED CASCADE DENOMINATOR: 36 declared rows, 33 of them observed
 * carrying an exact roster name. `match` is `exact` on 34 rows (trimmed both
 * sides, NOT case-folded, because two houses may legitimately differ only in
 * case) and `label` on the two DERIVED DISPLAY LABELS, whose producers write a
 * case-variant of the house's own name by construction. `removal` is the rule the
 * sweep applies, taken from the record's own measured ABSENCE shape rather than
 * from a null write.
 * @type {ReadonlyArray<SurfaceRow>}
 */
export const INSTITUTION_RENAME_SURFACES = Object.freeze([
  { path: 'institutions[].name', match: 'exact', removal: 'drop-record',
    why: 'the house record itself: the name IS the identity, so a removal drops the row' },
  ...SERVICE_CATEGORIES.map((category) => ({
    path: `availableServices.${category}[].institution`, match: /** @type {'exact'} */ ('exact'), removal: 'drop-entry',
    why: `the house that provides this ${category} service: present on every generated entry, so a removal drops the entry rather than minting an absence` })),
  { path: 'economicState.tradeDependencies[].institution', match: 'exact', removal: 'drop-entry',
    why: 'the house whose supply the dependency row is about' },
  { path: 'resourceAnalysis.gaps[].institution', match: 'exact', removal: 'delete-key',
    why: 'the processing house a gap row names, already absent on most rows, so a removal returns the row to a shape it carries' },
  { path: 'economicState.activeChains[].dependency.institution', match: 'exact', removal: 'delete-dependency-object',
    why: 'the chain dependency block is about ONE house: with the house gone the block states nothing, and it is already absent on most chains' },
  ...DEFENSE_CATEGORIES.map((category) => ({
    path: `defenseProfile.institutions.${category}[].name`, match: /** @type {'exact'} */ ('exact'), removal: 'drop-entry',
    why: `the ${category} entry IS the institution, so a removal drops it` })),
  { path: 'spatialLayout.quarters[].landmarks[]', match: 'exact', removal: 'drop-item',
    why: 'districtProfile joins a house to a quarter through this landmark haystack, so a stale landmark silently un-homes a renamed house' },
  { path: 'economicState.activeChains[].label', match: 'exact', removal: 'report-only',
    why: 'the chain label is present on every chain, so deleting it would mint a new shape: a removal REPORTS the loss and leaves the label standing' },
  { path: 'economicState.safetyProfile.criminalInstitutions[]', match: 'label', rewrite: 'verbatim', removal: 'drop-item',
    why: 'a DERIVED DISPLAY LABEL: safetyProfile Title-Cases the matched house through its frozen CRIMINAL_INST_LABELS table, so the stored value is a case-variant and never the exact name' },
  { path: 'economicState.institutionalServices[].institutions[]', match: 'label', rewrite: 'lower', removal: 'drop-item',
    why: 'the second DERIVED DISPLAY LABEL, rendered on Economics under a Via label: deriveInstitutionalServices stores the lowercased name, so the rewrite is lowercased too or the producer invariant breaks' },
  ...INSTITUTION_HOMES.flatMap((home) => INSTITUTION_HANDLE_FIELDS.map((field) => ({
    path: handlePath(home, field), match: /** @type {'exact'} */ ('exact'), removal: field.removal, why: field.why,
  }))),
]);

/**
 * ⭐ THE LEDGER OF PATHS THAT DO HOLD AN INSTITUTION NAME AND ARE DELIBERATELY
 * LEFT ALONE, each with the KIND that rules it and a written reason.
 *
 * ⛔ THE ESTATE RULE THIS LEDGER CARRIES: "never touched" means never WRITTEN. A
 * non-cascaded path may still be READ, and `readable` says which. EXACTLY ONE row
 * is readable, and the removal RESOLVES that path from this ledger rather than
 * spelling it, so flipping the flag throws at import instead of reading on.
 * @type {ReadonlyArray<LedgerRow>}
 */
export const NON_CASCADED_SURFACES = Object.freeze([
  { path: 'simulationTrace[].downstreamEffects[].target', kind: 'receipt', readable: false,
    why: 'the generation RECEIPT: it records what the generator decided while the house still bore its old name, so rewriting it would falsify the trace' },
  { path: 'generationCoherenceReceipt.repairs[].subject', kind: 'receipt', readable: false,
    why: 'design §22.3 item 1 classes the generation receipt BY PATH as HISTORY, and lived history is immutable' },
  { path: 'availableServices.legal[].name', kind: 'label', readable: false,
    why: 'the service label, not a handle: where it names a roster house it names a DIFFERENT house from the entry own institution field, which is the real handle' },
  { path: 'resourceAnalysis.resourceConditions[].label', kind: 'label', readable: false,
    why: 'a fixed condition word: the same literal appears both matching and non-matching a roster name' },
  { path: 'economicState.activeChains[].resource', kind: 'label', readable: false,
    why: 'the resource display label, keyed by its own resourceKey: the key is the identity' },
  { path: 'economicState.activeChains[].processingInstitutions[]', kind: 'matched-pattern', readable: true,
    why: 'computeActiveChains stores the static PATTERN that matched, joined catalogId-first with a prefix fallback, and every stored value still matches a present house: a by-name cascade would split one chain Via line into renamed and un-renamed halves. NON_CASCADED until the owner signs FIX-D3, and READ (never written) by the removal orphan report' },
  { path: 'resourceAnalysis.resourceChains[].processingInstitutions[]', kind: 'catalogue', readable: false,
    why: 'a CATALOGUE VOCABULARY: byte-identical to the static RESOURCE_CHAINS row on every array, and the roster is not an input to its producer' },
  { path: 'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]', kind: 'catalogue', readable: false,
    why: 'the same chain objects bucketed: the three exploitation arms PARTITION the parent, so rewriting one home would make a record disagree with itself' },
  { path: 'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]', kind: 'catalogue', readable: false,
    why: 'the second arm of that partition' },
  { path: 'resourceAnalysis.exploitation.unexploited[].processingInstitutions[]', kind: 'catalogue', readable: false,
    why: 'the third arm, and the one place the catalogue list reaches a reader: ResourcesTab prints it as a Needs line, where naming absent houses is CORRECT' },
  { path: 'resourceAnalysis.gaps[].missing[]', kind: 'catalogue', readable: false,
    why: 'what a chain needs and the town lacks: an authored vocabulary with zero exact matches, invisible to an exact-name walk' },
  { path: 'economicState.activeChains[].upstreamMissing[]', kind: 'catalogue', readable: false,
    why: 'the same needs-vocabulary on the economy chains' },
  { path: 'structuralSuggestions[].suggested[]', kind: 'catalogue', readable: false,
    why: 'the structural validator AUTHORED advice, rendered as a Consider line: a statement about what the town should build, never a reference to what it has' },
  { path: 'economicState.compound.inst.names[]', kind: 'frozen-stamp', readable: false,
    why: 'the LOWERCASED roster stamped once beside the booleans it produced and never recomputed on advance, owner-gated: rewriting the names would make them disagree with their own flags inside a frozen structure nothing reads' },
  { path: 'economicState.safetyProfile.compound.inst.names[]', kind: 'frozen-stamp', readable: false,
    why: 'the SECOND independent stamp, not an alias: economicState and safetyProfile each call getInstFlags, so the two arrays are never the same object. Aliased or duplicated stamps DECLARE ONCE PER PATH by design, because the walk addresses by path and a reloaded save has already split any alias' },
]);

/** @param {unknown} value @returns {value is StoredRecord} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {unknown[]|null} */
function listOf(value) {
  return Array.isArray(value) ? value : null;
}

/**
 * Resolve a DECLARED string path against a stored record, returning one SITE per
 * leaf it addresses. A site carries enough of its own lineage for either arm to
 * act: `owner`/`key` for a rewrite or a key delete, `holder`/`index` for a drop,
 * and `via` for the one row whose removal deletes the leaf's PARENT object.
 * @param {unknown} root @param {string} path @returns {Site[]}
 */
function resolveSites(root, path) {
  const segments = path.split('.');
  let frames = [{ node: root, holder: /** @type {unknown[]|null} */ (null), index: -1, via: /** @type {{ owner: StoredRecord, key: string }|null} */ (null) }];
  for (let step = 0; step < segments.length - 1; step += 1) {
    const segment = segments[step];
    const spread = segment.endsWith('[]');
    const key = spread ? segment.slice(0, -2) : segment;
    const next = [];
    for (const frame of frames) {
      if (!isRecord(frame.node)) continue;
      const value = frame.node[key];
      if (spread) {
        const rows = listOf(value);
        if (!rows) continue;
        for (let i = 0; i < rows.length; i += 1) next.push({ node: rows[i], holder: rows, index: i, via: null });
      } else if (value !== undefined && value !== null) {
        next.push({ node: value, holder: frame.holder, index: frame.index, via: { owner: frame.node, key } });
      }
    }
    frames = next;
  }
  const last = segments[segments.length - 1];
  const isList = last.endsWith('[]');
  const key = isList ? last.slice(0, -2) : last;
  const sites = [];
  for (const frame of frames) {
    if (!isRecord(frame.node)) continue;
    sites.push({ owner: frame.node, key, isList, holder: frame.holder, index: frame.index, via: frame.via });
  }
  return sites;
}

/**
 * The row's DECLARED match. `exact` is trimmed on both sides and NOT case-folded:
 * a power-structure FACTION handle can be a case-variant of a house name, and
 * folding would rewrite it on an institution rename, which is a live bug.
 * @param {unknown} value @param {'exact'|'label'} match @param {string} oldName
 */
function matchesName(value, match, oldName) {
  if (typeof value !== 'string') return false;
  const held = value.trim();
  return match === 'label' ? held.toLowerCase() === oldName.toLowerCase() : held === oldName;
}

/**
 * The replacement this row writes, through the frozen form the row DECLARES.
 * An `exact` row carries no `rewrite` field at all, so the fallback is the only
 * place `verbatim` is ever named outside the map itself.
 * @param {SurfaceRow} row @param {string} newName @returns {string}
 */
function rewrittenName(row, newName) {
  return LABEL_REWRITE[row.rewrite || 'verbatim'](newName);
}

/**
 * Apply an institution rename across every surface in
 * `INSTITUTION_RENAME_SURFACES`. MUTATES the settlement it is HANDED, which the
 * caller already owns as a draft, and never reaches outside it.
 * @param {unknown} settlement @param {string} oldName @param {string} newName
 * @returns {{ changed: boolean, touched: string[] }}
 */
export function applyInstitutionRenameToSettlement(settlement, oldName, newName) {
  /** @type {string[]} */
  const touched = [];
  if (!isRecord(settlement) || !oldName || !newName || oldName === newName) return { changed: false, touched };
  for (const row of INSTITUTION_RENAME_SURFACES) {
    let moved = false;
    for (const site of resolveSites(settlement, row.path)) {
      if (site.isList) {
        const list = listOf(site.owner[site.key]);
        if (!list) continue;
        for (let i = 0; i < list.length; i += 1) {
          if (!matchesName(list[i], row.match, oldName)) continue;
          list[i] = rewrittenName(row, newName);
          moved = true;
        }
      } else if (matchesName(site.owner[site.key], row.match, oldName)) {
        site.owner[site.key] = rewrittenName(row, newName);
        moved = true;
      }
    }
    if (moved && !touched.includes(row.path)) touched.push(row.path);
  }
  return { changed: touched.length > 0, touched };
}

/**
 * Build the minimal clone both immutable forms spread: only the top-level buckets
 * the settlement actually carries, so a rename never deep-copies the whole record.
 * @param {StoredRecord} settlement @returns {StoredRecord}
 */
export function cascadeDraftOf(settlement) {
  /** @type {StoredRecord} */
  const draft = {};
  for (const bucket of CASCADE_BUCKETS) {
    if (settlement[bucket] === undefined) continue;
    draft[bucket] = deepClone(settlement[bucket]);
  }
  return draft;
}

/**
 * The IMMUTABLE form: the touched buckets, deep-cloned, ready to spread.
 * @param {unknown} settlement @param {string} oldName @param {string} newName
 * @returns {{ changed: boolean, touched: string[], changes: StoredRecord, orphaned: OrphanNote[] }}
 */
export function institutionRenameChanges(settlement, oldName, newName) {
  if (!isRecord(settlement)) return { changed: false, touched: [], changes: {}, orphaned: [] };
  const draft = cascadeDraftOf(settlement);
  const { changed, touched } = applyInstitutionRenameToSettlement(draft, oldName, newName);
  if (!changed) return { changed: false, touched: [], changes: {}, orphaned: [] };
  return { changed: true, touched, changes: draft, orphaned: [] };
}

export { INSTITUTION_HOMES, isRecord, listOf, resolveSites, matchesName };
