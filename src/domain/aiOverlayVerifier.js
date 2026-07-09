/**
 * domain/aiOverlayVerifier.js — runtime canon-preservation guard.
 *
 * Tier 6.4 of the roadmap. The AI overlay is supposed to refine prose
 * without inventing entities, renaming proper nouns, or contradicting
 * facts (per Tier 6.3 PRESERVATION_RULES + Tier 6.1 forbidden-changes
 * catalog). Models are statistical — sometimes they violate the
 * contract anyway. This module is the safety net that catches it:
 *
 *   verifyAiOverlay(original, refined) ->
 *     {
 *       ok: boolean,                    // false if any violation found
 *       violations: AiOverlayViolation[]
 *       summary: { invented, renamed, contradicted, removed }
 *     }
 *
 * Violations are typed so callers can decide what to do per-class:
 *   - 'invented_entity'    — a faction/NPC/institution exists in refined that wasn't in original.
 *   - 'removed_entity'     — an entity from original is missing in refined.
 *   - 'renamed_entity'     — same entity (by id/index/role) but new name.
 *   - 'changed_fact'       — a numerical or categorical field drifted (population, tier).
 *   - 'changed_canon'      — a locked or user-authored entity's canon tag changed.
 *   - 'removed_history_beat' — a derived history beat went missing.
 *
 * Pure read-only. No mutation, no async, no I/O — safe to call inside
 * the AI streaming response pipeline before committing the overlay
 * into store state.
 *
 * Architectural fit:
 *   - The store's `setAiSettlement` action (src/store/aiSlice.js)
 *     runs every overlay through this verifier before committing it.
 *   - The PDF appendix surfaces unflagged AI prose. Anything that
 *     would fail this check should NEVER reach the PDF.
 *   - The edge function (`supabase/functions/generate-narrative`)
 *     re-applies refinements onto a deep clone of the source. The
 *     clone-based merge is the FIRST defense; this verifier is the
 *     defense in depth that catches whatever the merge missed.
 */

import { tagEntityCanon } from './canonStatus.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { walkUserEdits } from './userEdits.js';

/**
 * An entity node the AI overlay might touch (npc / faction / institution /
 * hook / condition / supply chain). Identity is carried on `id`, `name`, or
 * the legacy `faction` alias; canon-status fields are inherited so the same
 * value can be handed to {@link tagEntityCanon}.
 * @typedef {import('./canonStatus.js').CanonTaggable & {
 *   id?: unknown,
 *   name?: unknown,
 *   faction?: unknown,
 * }} AiEntity
 */

/**
 * A single canon-preservation violation.
 * @typedef {Object} AiOverlayViolation
 * @property {string} kind
 * @property {string} field
 * @property {string} key
 * @property {unknown} label
 * @property {string} [detail]
 * @property {unknown} [newLabel]
 * @property {unknown} [before]
 * @property {unknown} [after]
 */

/**
 * Settlement view the verifier reads. An index signature lets the root
 * fact-key sweep read arbitrary keys; the named entity-array properties
 * keep the entity comparisons strongly typed.
 * @typedef {{
 *   [k: string]: unknown,
 *   institutions?: AiEntity[],
 *   npcs?: AiEntity[],
 *   hooks?: AiEntity[],
 *   supplyChains?: AiEntity[],
 *   activeConditions?: AiEntity[],
 *   powerStructure?: { factions?: AiEntity[] },
 * }} OverlaySettlement
 */

// ── Violation kinds (frozen vocabulary) ─────────────────────────────────

export const VIOLATION_KINDS = Object.freeze([
  'invented_entity',
  'removed_entity',
  'renamed_entity',
  'changed_fact',
  'changed_canon',
  'removed_history_beat',
  // Tier 6.6: user-edited prose is canon. The verifier checks that
  // every value still equals the user's authored string.
  'changed_user_field',
]);

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Stable identifier for an entity: explicit `id` first, then `name`,
 * then `faction` (legacy alias used by some power-structure entries).
 * The same identity function MUST be used for both sides so we don't
 * spuriously flag rename-as-id-change.
 */
/**
 * @param {AiEntity | null | undefined} e
 * @returns {string | null}
 */
function entityKey(e) {
  if (!e || typeof e !== 'object') return null;
  if (e.id != null) return `id:${String(e.id)}`;
  if (typeof e.name === 'string' && e.name.length) return `name:${e.name}`;
  if (typeof e.faction === 'string' && e.faction.length) return `name:${e.faction}`;
  return null;
}

/**
 * @param {AiEntity | null | undefined} e
 * @returns {unknown}
 */
function displayName(e) {
  return (e && typeof e === 'object' && (e.name || e.faction)) || null;
}

/**
 * @template T
 * @param {T[] | null | undefined | unknown} maybe
 * @returns {T[]}
 */
function asArray(maybe) {
  return Array.isArray(maybe) ? maybe : [];
}

/**
 * Compare two entity arrays from the same field (e.g. settlement.npcs).
 *
 * Returns violation objects for: invented (in refined, not original),
 * removed (in original, not refined), renamed (same key, different
 * displayName).
 *
 * The "same key" comparison matters: ids that survive both sides are
 * the same entity even if the human-visible name changed — which IS
 * what we want to flag. Without ids we fall back to name and can't
 * detect rename (a rename looks like remove + add).
 */
/**
 * @param {string} field
 * @param {AiEntity[] | null | undefined} originalArr
 * @param {AiEntity[] | null | undefined} refinedArr
 * @returns {AiOverlayViolation[]}
 */
function compareEntityArrays(field, originalArr, refinedArr) {
  const violations = [];
  const oMap = new Map();
  for (const e of asArray(originalArr)) {
    const k = entityKey(e);
    if (k) oMap.set(k, e);
  }
  const rMap = new Map();
  for (const e of asArray(refinedArr)) {
    const k = entityKey(e);
    if (k) rMap.set(k, e);
  }

  // Inventions — keys in refined that aren't in original.
  for (const [k, e] of rMap) {
    if (!oMap.has(k)) {
      violations.push({
        kind: 'invented_entity',
        field,
        key: k,
        label: displayName(e) || '(unnamed)',
        detail: `Refined ${field} contains an entity not present in the original.`,
      });
    }
  }

  // Removals — keys in original that aren't in refined.
  for (const [k, e] of oMap) {
    if (!rMap.has(k)) {
      violations.push({
        kind: 'removed_entity',
        field,
        key: k,
        label: displayName(e) || '(unnamed)',
        detail: `Entity present in original ${field} is missing from refined.`,
      });
    }
  }

  // Renames — keys present on both sides but displayName differs.
  for (const [k, oEntity] of oMap) {
    if (!rMap.has(k)) continue;
    const rEntity = rMap.get(k);
    const oName = displayName(oEntity);
    const rName = displayName(rEntity);
    if (oName && rName && oName !== rName) {
      violations.push({
        kind: 'renamed_entity',
        field,
        key: k,
        label: oName,
        newLabel: rName,
        detail: `Entity "${oName}" renamed to "${rName}" — proper-noun changes are forbidden.`,
      });
    }
  }

  return violations;
}

/**
 * Compare two entity arrays and flag canon-status changes on locked /
 * user-authored entities. (Drafts can become canon — that's a normal
 * promotion. The forbidden direction is locked/user → anything else.)
 */
/**
 * @param {string} field
 * @param {AiEntity[] | null | undefined} originalArr
 * @param {AiEntity[] | null | undefined} refinedArr
 * @returns {AiOverlayViolation[]}
 */
function compareCanonTags(field, originalArr, refinedArr) {
  const violations = [];
  const oMap = new Map();
  for (const e of asArray(originalArr)) {
    const k = entityKey(e);
    if (k) oMap.set(k, e);
  }
  for (const rEntity of asArray(refinedArr)) {
    const k = entityKey(rEntity);
    if (!k) continue;
    const oEntity = oMap.get(k);
    if (!oEntity) continue;
    const oTag = tagEntityCanon(oEntity);
    const rTag = tagEntityCanon(rEntity);
    // Locked → unlocked, or user → anything else, is a violation.
    if (oTag.locked && !rTag.locked) {
      violations.push({
        kind: 'changed_canon',
        field,
        key: k,
        label: displayName(oEntity) || '(unnamed)',
        before: { locked: oTag.locked, source: oTag.source, canonStatus: oTag.canonStatus },
        after:  { locked: rTag.locked, source: rTag.source, canonStatus: rTag.canonStatus },
        detail: 'Locked entity was unlocked in refined output.',
      });
    }
    if (oTag.source === 'user' && rTag.source !== 'user') {
      violations.push({
        kind: 'changed_canon',
        field,
        key: k,
        label: displayName(oEntity) || '(unnamed)',
        before: { locked: oTag.locked, source: oTag.source, canonStatus: oTag.canonStatus },
        after:  { locked: rTag.locked, source: rTag.source, canonStatus: rTag.canonStatus },
        detail: 'User-authored entity changed source in refined output.',
      });
    }
  }
  return violations;
}

/**
 * Compare scalar facts on the settlement root that the AI must NOT
 * touch: name, tier, population, schemaVersion, simulationVersion,
 * id, _seed.
 */
const ROOT_FACT_KEYS = Object.freeze([
  'id', 'name', 'tier', 'population', '_seed', 'schemaVersion', 'simulationVersion',
]);

/**
 * @param {OverlaySettlement} original
 * @param {OverlaySettlement} refined
 * @returns {AiOverlayViolation[]}
 */
function compareRootFacts(original, refined) {
  const violations = [];
  for (const key of ROOT_FACT_KEYS) {
    const o = original?.[key];
    const r = refined?.[key];
    // Both undefined → no change.
    if (o === undefined && r === undefined) continue;
    // Either present with different value → violation.
    if (o !== r) {
      violations.push({
        kind: 'changed_fact',
        field: key,
        key,
        label: key,
        before: o ?? null,
        after: r ?? null,
        detail: `Root-level fact "${key}" changed from ${JSON.stringify(o)} to ${JSON.stringify(r)}.`,
      });
    }
  }
  return violations;
}

/**
 * Verify that history beats derived from the refined settlement still
 * produce the same set as the original. The beats are derived from
 * history.founding + history.historicalEvents + history.currentTensions
 * — if the AI drops or rewrites one of those to the point that a beat
 * no longer derives, this catches it.
 */
/**
 * @param {OverlaySettlement} original
 * @param {OverlaySettlement} refined
 * @returns {AiOverlayViolation[]}
 */
function compareHistoryBeats(original, refined) {
  /** @type {AiOverlayViolation[]} */
  const violations = [];
  // deriveHistoryBeats is annotated `@returns {Object}` upstream; cast to an
  // indexable record so the beat-key sweep type-checks. See crossFileNeeds.
  /** @type {any} */
  const oBeats = deriveHistoryBeats(original);
  /** @type {any} */
  const rBeats = deriveHistoryBeats(refined);
  for (const key of Object.keys(oBeats)) {
    if (oBeats[key] && !rBeats[key]) {
      violations.push({
        kind: 'removed_history_beat',
        field: `history.${key}`,
        key,
        label: key,
        detail: `History beat "${key}" was present in the original but is missing after AI overlay.`,
      });
    }
  }
  return violations;
}

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Verify that every field the user has hand-edited in the ORIGINAL
 * settlement still carries the user's exact value in the REFINED
 * output. User-edited prose is canon — the AI must pass it through
 * verbatim. Tier 6.6.
 */
/**
 * @param {OverlaySettlement} original
 * @param {OverlaySettlement} refined
 * @returns {AiOverlayViolation[]}
 */
function compareUserFields(original, refined) {
  /** @type {AiOverlayViolation[]} */
  const violations = [];
  const edits = walkUserEdits(original);
  if (edits.length === 0) return violations;

  // Resolve the corresponding entity in `refined` for each edit:
  //   - settlement-root edits: refined itself
  //   - entity edits: walk the same array path + index
  // Index-based lookup matches the verifier's existing array
  // semantics (apply() in the edge function also matches by index).
  for (const { kind, entityIndex, path } of edits) {
    const expected = readUserExpectedValue(original, kind, entityIndex, path);
    const actual   = readUserExpectedValue(refined,  kind, entityIndex, path);
    if (expected === undefined) continue;
    if (expected === actual) continue;
    const ent = locateEntity(refined, kind, entityIndex) || locateEntity(original, kind, entityIndex);
    const label = ent?.name || ent?.faction || (kind === 'settlement' ? 'settlement' : `#${entityIndex}`);
    violations.push({
      kind: 'changed_user_field',
      field: kind === 'settlement' ? path : `${kind}[${entityIndex}].${path}`,
      key: `${kind}:${entityIndex}:${path}`,
      label,
      before: expected,
      after: actual,
      detail: `User-edited field "${path}" on ${kind} "${label}" was overwritten by the AI.`,
    });
  }
  return violations;
}

/** @type {Record<string, string[]>} */
const ENTITY_ARRAY_PATH_BY_KIND = {
  npc:            ['npcs'],
  institution:    ['institutions'],
  faction:        ['powerStructure', 'factions'],
  conflict:       ['powerStructure', 'conflicts'],
  hook:           ['hooks'],
  plotHook:       ['plotHooks'],
  condition:      ['activeConditions'],
  supplyChain:    ['supplyChains'],
  historicalEvent:['history', 'historicalEvents'],
  currentTension: ['history', 'currentTensions'],
};

/**
 * @param {unknown} settlement
 * @param {string} kind
 * @param {number} entityIndex
 * @returns {any}
 */
function locateEntity(settlement, kind, entityIndex) {
  if (kind === 'settlement') return settlement;
  const segs = ENTITY_ARRAY_PATH_BY_KIND[kind];
  if (!segs) return null;
  /** @type {any} */
  let ref = settlement;
  for (const seg of segs) {
    if (ref == null || typeof ref !== 'object') return null;
    ref = ref[seg];
  }
  if (!Array.isArray(ref)) return null;
  return ref[entityIndex] || null;
}

/**
 * @param {unknown} settlement
 * @param {string} kind
 * @param {number} entityIndex
 * @param {string} path
 * @returns {unknown}
 */
function readUserExpectedValue(settlement, kind, entityIndex, path) {
  const entity = locateEntity(settlement, kind, entityIndex);
  if (!entity) return undefined;
  const keys = path.split('.');
  let ref = entity;
  for (const k of keys) {
    if (ref == null || typeof ref !== 'object') return undefined;
    ref = ref[k];
  }
  return ref;
}

/**
 * Build a violations summary by kind for at-a-glance reporting.
 */
/**
 * @param {AiOverlayViolation[]} violations
 * @returns {{ invented: number, removed: number, renamed: number, contradicted: number, canonChanged: number, historyDropped: number, userFieldChanged: number }}
 */
function summariseViolations(violations) {
  return {
    invented:        violations.filter(v => v.kind === 'invented_entity').length,
    removed:         violations.filter(v => v.kind === 'removed_entity').length,
    renamed:         violations.filter(v => v.kind === 'renamed_entity').length,
    contradicted:    violations.filter(v => v.kind === 'changed_fact').length,
    canonChanged:    violations.filter(v => v.kind === 'changed_canon').length,
    historyDropped:  violations.filter(v => v.kind === 'removed_history_beat').length,
    userFieldChanged: violations.filter(v => v.kind === 'changed_user_field').length,
  };
}

/**
 * Run every check and return a violations report.
 *
 * @param {OverlaySettlement|null|undefined} original  The settlement BEFORE the AI overlay.
 * @param {OverlaySettlement|null|undefined} refined   The settlement AFTER the AI overlay.
 * @returns {{
 *   ok: boolean,
 *   violations: AiOverlayViolation[],
 *   summary: { invented: number, removed: number, renamed: number, contradicted: number, canonChanged: number, historyDropped: number, userFieldChanged: number },
 * }}
 */
export function verifyAiOverlay(original, refined) {
  /** @type {AiOverlayViolation[]} */
  const violations = [];

  // Null safety. If either side is null, we can't meaningfully verify —
  // return a neutral report (ok=true) so callers don't refuse a missing
  // overlay payload. This mirrors how the engine's other null-tolerant
  // derivations behave.
  if (!original || typeof original !== 'object') {
    return { ok: true, violations: [], summary: summariseViolations([]) };
  }
  if (!refined || typeof refined !== 'object') {
    return { ok: true, violations: [], summary: summariseViolations([]) };
  }

  // Root-level facts.
  violations.push(...compareRootFacts(original, refined));

  // Entity arrays — institutions, factions, npcs, hooks, chains, conditions.
  violations.push(...compareEntityArrays('institutions', original.institutions, refined.institutions));
  violations.push(...compareEntityArrays(
    'powerStructure.factions',
    original.powerStructure?.factions,
    refined.powerStructure?.factions,
  ));
  violations.push(...compareEntityArrays('npcs', original.npcs, refined.npcs));
  violations.push(...compareEntityArrays('hooks', original.hooks, refined.hooks));
  violations.push(...compareEntityArrays('supplyChains', original.supplyChains, refined.supplyChains));
  violations.push(...compareEntityArrays('activeConditions', original.activeConditions, refined.activeConditions));

  // Canon-tag drift on the same set of arrays.
  violations.push(...compareCanonTags('institutions', original.institutions, refined.institutions));
  violations.push(...compareCanonTags(
    'powerStructure.factions',
    original.powerStructure?.factions,
    refined.powerStructure?.factions,
  ));
  violations.push(...compareCanonTags('npcs', original.npcs, refined.npcs));
  violations.push(...compareCanonTags('activeConditions', original.activeConditions, refined.activeConditions));

  // History beat drop-out.
  violations.push(...compareHistoryBeats(original, refined));

  // Tier 6.6: user-edited prose must round-trip verbatim.
  violations.push(...compareUserFields(original, refined));

  return {
    ok: violations.length === 0,
    violations,
    summary: summariseViolations(violations),
  };
}

/**
 * Flat one-line strings suitable for logging / DM-facing toast.
 */
/**
 * @param {AiOverlayViolation[]} violations
 * @returns {string[]}
 */
export function summarizeViolations(violations) {
  return asArray(violations).map(v => `[${v.kind}] ${v.field}: ${v.detail}`);
}

/**
 * Filter violations to only the ones the caller cares about. Caller
 * passes a Set or array of kinds; any other kinds are dropped. Useful
 * for the AI streaming response pipeline that wants to refuse only on
 * the hardest violations (invented + renamed) while letting the user
 * decide what to do about softer ones (removed_history_beat).
 */
/**
 * @param {AiOverlayViolation[]} violations
 * @param {Iterable<string>} allowedKinds
 * @returns {AiOverlayViolation[]}
 */
export function filterViolations(violations, allowedKinds) {
  const allowed = new Set(allowedKinds);
  return asArray(violations).filter(v => allowed.has(v.kind));
}
