/**
 * tests/config/modelRegistryAgreement.test.js - wave L-2b of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md: the ASSERTION LAYER over THE ONE MODEL REGISTRY
 * (src/domain/modelRegistry.js, wave L-2a).
 *
 * WHAT THIS IS. The tree carries THREE model lists that disagree and none of which imports
 * another (the Deno-to-src import barrier is the root cause):
 *
 *   A. ANTHROPIC_SUPPORTED_MODELS + ANTHROPIC_RETENTION_CLASS
 *      supabase/functions/ai-analyst/analystCore.ts   (the BYOK picker ceiling)
 *   B. ROUTING_CLASS_MODEL
 *      src/config/aiTaskConfig.js                     (the only tier statement in the tree)
 *   C. MODEL_PROFILES + MODEL_ALIASES + DEFAULT_MODEL_PREFERENCE
 *      supabase/functions/generate-narrative/index.ts (what actually gets served)
 *
 * L-2a wrote down, in one place, what those three lists say and where they disagree
 * (classes D1 through D8 in the registry docblock). L-2a changed no behavior, and neither
 * does this file. This file makes the drift MEASURABLE: it parses all three lists from
 * their real sources, binds each to the registry, and pins the known disagreements so that
 * the next movement in any direction is loud.
 *
 * SCOPE (hard). Read-only over sources. It changes no list membership and no runtime
 * behavior. Every divergence pinned below is a RECORDED OWNER-FACING FACT, not a defect
 * this layer is entitled to resolve. When one of them is resolved, the resolution is a
 * separate deliberate change and this pin shrinks to match it.
 *
 * SHRINK-ONLY SEMANTICS (the sizeBaseline honesty idiom, applied to disagreement):
 *   - a divergence that DISAPPEARS reds, demanding the pin be SHRUNK, so a silent
 *     resolution can never pass unnoticed and unbanked;
 *   - a divergence that APPEARS reds, demanding either a fix or a deliberate new pin;
 *   - a model id reachable from any list with no registry entry reds, so the registry can
 *     never go quietly incomplete.
 *   The pin therefore only ever moves DOWN, and never by accident in either direction.
 *
 * FAIL-CLOSED PARSING. Every extraction routes through tests/helpers/sourceContract.js
 * (which throws rather than returning an empty sentinel) plus explicit shape throws, and a
 * guard-the-guard block asserts the parses are non-vacuous. A renamed constant turns this
 * file ERROR, never green-on-nothing.
 *
 * WHY THE BASENAME IS "modelRegistryAgreement" AND NOT "...Parity" (implementer judgment,
 * vetoable, recorded because it deviates from the wave brief's suggested filename):
 * tests/config is NOT one of the seven ENFORCER_DIRS, but the E-A enumeration rule
 * (tests/lint/mutationCoverage.shared.mjs) ALSO matches on basename nomenclature, and
 * "parity" is one of its tokens. A file named ...Parity.test.js is therefore enumerated as
 * an enforcement-spine member and owes an entry in scripts/mutation-coverage-manifest.json.
 * Measured on this tree: E-A totality is GREEN today (wave L-2a's three entries landed
 * ahead of fold), and a ...Parity basename turns it RED. Adding the owed entry is out of
 * scope twice over: this wave's delta is one new file, and the manifest is a TRACKED file
 * that currently carries foreign uncommitted hunks, which is exactly the entanglement L-2b
 * was held back to avoid. So the name follows the L-1 precedent instead: stay outside the
 * enumeration, leave every gate exactly as found. If the owner would rather have this file
 * IN the spine, rename it and add a manifest entry in the same fold commit, together.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { mustExtract } from '../helpers/sourceContract.js';
import { AI_ROUTING_CLASSES, ROUTING_CLASS_MODEL } from '../../src/config/aiTaskConfig.js';
import { MODEL_REGISTRY, REGISTRY_VERSION, registryEntry } from '../../src/domain/modelRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const ANALYST_PATH = 'supabase/functions/ai-analyst/analystCore.ts';
const NARRATIVE_PATH = 'supabase/functions/generate-narrative/index.ts';
const REGISTRY_PATH = 'src/domain/modelRegistry.js';
/** Wave L-3a: the shared captured-model resolver, which carries a LITERAL MIRROR of the
 *  registry's anthropic tierClass projection because Deno cannot import from src/. */
const RESOLVER_PATH = 'supabase/functions/ai-analyst/modelResolver.ts';

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const analystSrc = read(ANALYST_PATH);
const narrativeSrc = read(NARRATIVE_PATH);
const registrySrc = read(REGISTRY_PATH);
const resolverSrc = read(RESOLVER_PATH);

/** Code-unit ordering, matching the registry's own comparator. Never localeCompare.
 *  @param {string} a @param {string} b @returns {number} */
const byText = (a, b) => (a < b ? -1 : (a > b ? 1 : 0));
/** @param {string[]} xs @returns {string[]} */
const uniqueSorted = (xs) => [...new Set(xs)].sort(byText);

// ── LIST A: the picker ceiling + the retention posture ───────────────────────

/** @param {string} src @returns {string[]} */
function parseSupportedModels(src) {
  const block = mustExtract(
    src,
    /export const ANTHROPIC_SUPPORTED_MODELS[^=]*=\s*Object\.freeze\(\[[\s\S]*?\]\)/,
    'ANTHROPIC_SUPPORTED_MODELS',
  );
  const ids = [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (ids.length === 0) throw new Error('modelRegistryParity: ANTHROPIC_SUPPORTED_MODELS parsed to zero ids');
  return ids;
}

/** @param {string} src @returns {string} */
function parseRetentionClass(src) {
  const decl = mustExtract(
    src,
    /export const ANTHROPIC_RETENTION_CLASS[^=]*=\s*'[a-z]+'/,
    'ANTHROPIC_RETENTION_CLASS',
  );
  return decl.match(/'([a-z]+)'/)[1];
}

/** Which providers declare a retention posture at all. The contract lives in analystCore
 *  (registerProviderAdapter throws without one), so the set of `<PROVIDER>_RETENTION_CLASS`
 *  exports there is the whole declaration surface.
 *  @param {string} src @returns {string[]} */
function parseProvidersWithRetentionPosture(src) {
  const decls = [...src.matchAll(/^export const ([A-Z0-9]+)_RETENTION_CLASS\b/gm)].map((m) => m[1].toLowerCase());
  if (decls.length === 0) throw new Error('modelRegistryParity: no <PROVIDER>_RETENTION_CLASS export found');
  return uniqueSorted(decls);
}

// ── LIST C: what generate-narrative actually serves ──────────────────────────

/**
 * @typedef {{ envVar: string|null, id: string }} PhaseId
 * @typedef {{ provider: string, costTier: string, phases: Record<string, PhaseId> }} Profile
 */

const PHASES = ['thesis', 'refinement', 'dailyLife'];

/** @param {string} src @returns {Record<string, Profile>} */
function parseModelProfiles(src) {
  const block = mustExtract(src, /^const MODEL_PROFILES[^=]*=\s*\{$[\s\S]*?^\};$/m, 'MODEL_PROFILES');
  /** @type {Record<string, Profile>} */
  const profiles = {};
  for (const m of block.matchAll(/^ {2}(\w+):\s*\{$([\s\S]*?)^ {2}\},$/gm)) {
    const key = m[1];
    const body = m[2];
    const provider = mustExtract(body, /provider:\s*'[a-z]+'/, `${key}.provider`).match(/'([a-z]+)'/)[1];
    const costTier = mustExtract(body, /costTier:\s*'[a-z]+'/, `${key}.costTier`).match(/'([a-z]+)'/)[1];
    /** @type {Record<string, PhaseId>} */
    const phases = {};
    const phaseRe = /^\s+(thesis|refinement|dailyLife):\s*(?:Deno\.env\.get\('([^']*)'\)\s*\|\|\s*)?'([^']+)',$/gm;
    for (const p of body.matchAll(phaseRe)) {
      phases[p[1]] = { envVar: p[2] ?? null, id: p[3] };
    }
    const missing = PHASES.filter((ph) => !(ph in phases));
    if (missing.length > 0) {
      throw new Error(`modelRegistryParity: profile ${key} yielded no id for ${missing.join(', ')}`);
    }
    profiles[key] = { provider, costTier, phases };
  }
  if (Object.keys(profiles).length === 0) throw new Error('modelRegistryParity: MODEL_PROFILES parsed to zero profiles');
  return profiles;
}

/** @param {string} src @returns {Record<string, string>} */
function parseModelAliases(src) {
  const block = mustExtract(src, /^const MODEL_ALIASES[^=]*=\s*\{$[\s\S]*?^\};$/m, 'MODEL_ALIASES');
  /** @type {Record<string, string>} */
  const out = {};
  for (const m of block.matchAll(/^\s+(\w+):\s*'([^']+)',$/gm)) out[m[1]] = m[2];
  if (Object.keys(out).length === 0) throw new Error('modelRegistryParity: MODEL_ALIASES parsed to zero aliases');
  return out;
}

/** @param {string} src @returns {string} */
function parseDefaultPreference(src) {
  const decl = mustExtract(src, /^const DEFAULT_MODEL_PREFERENCE\s*=\s*'[^']+';$/m, 'DEFAULT_MODEL_PREFERENCE');
  return decl.match(/'([^']+)'/)[1];
}

// ── THE EDGE MIRROR: modelResolver.ts's literal tierClass map (wave L-3a) ────

/** Parse the resolver's literal `{ id: tierClass }` mirror. Fail-closed: a renamed or
 *  reshaped export throws here rather than yielding an empty map that would compare
 *  equal to nothing and pass.
 *  @param {string} src @returns {Record<string, string>} */
function parseResolverTierMirror(src) {
  const block = mustExtract(
    src,
    /export const ANTHROPIC_TIER_CLASS[^=]*=\s*Object\.freeze\(\{[\s\S]*?\}\)/,
    'ANTHROPIC_TIER_CLASS',
  );
  /** @type {Record<string, string>} */
  const out = {};
  for (const m of block.matchAll(/'([^']+)':\s*'([^']+)'/g)) out[m[1]] = m[2];
  if (Object.keys(out).length === 0) {
    throw new Error('modelRegistryAgreement: ANTHROPIC_TIER_CLASS parsed to zero entries');
  }
  return out;
}

/** The rungs the resolver's own TierClass union declares.
 *  @param {string} src @returns {string[]} */
function parseResolverTierUnion(src) {
  const decl = mustExtract(src, /export type TierClass\s*=\s*[^;]+;/, 'TierClass');
  return uniqueSorted([...decl.matchAll(/'([a-z]+)'/g)].map((m) => m[1]));
}

/** The registry's raw entry ids, IN SOURCE ORDER and WITH duplicates preserved, so a
 *  duplicate id (which MODEL_REGISTRY's keying would silently collapse) stays visible.
 *  @param {string} src @returns {string[]} */
function parseRegistryEntryIdsRaw(src) {
  const ids = [...src.matchAll(/^\s*entry\('([^']+)'/gm)].map((m) => m[1]);
  if (ids.length === 0) throw new Error('modelRegistryParity: modelRegistry.js parsed to zero entry() calls');
  return ids;
}

// ── The parsed world ─────────────────────────────────────────────────────────

const supportedModels = parseSupportedModels(analystSrc);
const anthropicRetentionClass = parseRetentionClass(analystSrc);
const providersWithRetentionPosture = parseProvidersWithRetentionPosture(analystSrc);
const modelProfiles = parseModelProfiles(narrativeSrc);
const modelAliases = parseModelAliases(narrativeSrc);
const defaultPreference = parseDefaultPreference(narrativeSrc);
const rawRegistryIds = parseRegistryEntryIdsRaw(registrySrc);
const resolverTierMirror = parseResolverTierMirror(resolverSrc);
const resolverTierUnion = parseResolverTierUnion(resolverSrc);

const profileKeys = Object.keys(modelProfiles);
const routingClassIds = AI_ROUTING_CLASSES.map((cls) => ROUTING_CLASS_MODEL[cls]);
const profileIds = uniqueSorted(profileKeys.flatMap((k) => PHASES.map((ph) => modelProfiles[k].phases[ph].id)));
const listIds = uniqueSorted([...supportedModels, ...routingClassIds, ...profileIds]);
const registryIds = Object.keys(MODEL_REGISTRY);

/** provider(s) each served model id is served UNDER, per list C. @type {Map<string, Set<string>>} */
const providersByServedId = new Map();
/** costTier(s) each served model id carries, per list C. @type {Map<string, Set<string>>} */
const costTiersByServedId = new Map();
for (const key of profileKeys) {
  const { provider, costTier, phases } = modelProfiles[key];
  for (const ph of PHASES) {
    const id = phases[ph].id;
    if (!providersByServedId.has(id)) providersByServedId.set(id, new Set());
    if (!costTiersByServedId.has(id)) costTiersByServedId.set(id, new Set());
    providersByServedId.get(id).add(provider);
    costTiersByServedId.get(id).add(costTier);
  }
}

/** The dated-build suffix list C uses on one id (D2). @param {string} id @returns {string} */
const familyOf = (id) => id.replace(/-\d{8}$/, '');

// ── THE PIN ──────────────────────────────────────────────────────────────────
//
// SHRINK-ONLY. Each key is an exact set (or scalar) compared BOTH ways: an entry that
// vanishes reds asking for the win to be banked, an entry that appears reds asking for a
// fix or a deliberate pin. The comment on each names the registry docblock class it
// mirrors, so the two statements of the same fact can never drift apart silently.

const KNOWN_DIVERGENCES = Object.freeze({
  /** D2 - generate-narrative's dated Haiku literal remains outside the exact-id
   *  picker allowlist. D1's Sonnet 4.6 refusal was closed 2026-07-28. */
  narrativeServesWhatThePickerRefuses: Object.freeze(['claude-haiku-4-5-20251001']),

  /** D1 + D2, the mirror direction - the picker offers ids generate-narrative never serves. */
  pickerOffersWhatNarrativeNeverServes: Object.freeze(['claude-haiku-4-5', 'claude-sonnet-4-5']),

  /** D2 - one model family carried under two distinct literal ids. The chokepoint
   *  expression is a plain Array.includes, which is not family-aware. */
  familiesCarryingMoreThanOneLiteralId: Object.freeze(['claude-haiku-4-5 + claude-haiku-4-5-20251001']),

  /** D3 - a provider reachable from the lists that declares no retention posture anywhere.
   *  TODO-OWNER in the registry: the real posture is read at deploy, never from memory. */
  providersWithNoDeclaredRetentionPosture: Object.freeze(['openai']),

  /** D4 - list C's two-valued costTier cannot express the top rung, so an id the routing
   *  list calls 'deep' still reads 'standard' there. costTier identifies the BOTTOM rung only. */
  deepTierIdsWhoseCostTierCannotSaySo: Object.freeze(['claude-opus-4-8']),

  /** D5 - list C is keyed by preference token, not by model id. Flips to 'modelId' if the
   *  preference-key layer is ever collapsed into the id layer. */
  listCKeyedBy: 'preferenceToken',

  /** D7 - no list imports the registry yet. Becomes non-empty when L-3 wires the resolver,
   *  and the red at that moment is the point: the pin shrinks with the wiring. */
  edgeSourcesImportingTheRegistry: Object.freeze([]),

  /** D8 - a profile whose three phases name different ids. Empty today; all eight profiles
   *  set one id for all three phases. A first occurrence needs its own registry entry. */
  profilesWhosePhaseIdsDiverge: Object.freeze([]),

  /** Not a recorded D-class: empty today, pinned so a first occurrence is loud. A routing
   *  model outside the picker allowlist would be resolved and then refused at the wall. */
  routingModelsThePickerRefuses: Object.freeze([]),

  /** Not a recorded D-class: empty today. One model id served under two providers would
   *  make the registry's single provider field a lie. */
  idsServedUnderMoreThanOneProvider: Object.freeze([]),

  /** Not a recorded D-class: empty today. A registry entry no list can reach is a
   *  speculative id, and the registry's job is to describe the tree, not to anticipate it. */
  registryIdsNoListReaches: Object.freeze([]),
});

/** @returns {Record<string, string[]|string>} the same shape, computed from the sources. */
function observedDivergences() {
  const supportedSet = new Set(supportedModels);
  const profileIdSet = new Set(profileIds);

  /** @type {Map<string, string[]>} */
  const families = new Map();
  for (const id of listIds) {
    const fam = familyOf(id);
    families.set(fam, [...(families.get(fam) ?? []), id]);
  }

  const providersInPlay = uniqueSorted([
    'anthropic',
    ...profileKeys.map((k) => modelProfiles[k].provider),
  ]);

  return {
    narrativeServesWhatThePickerRefuses: uniqueSorted(
      profileIds.filter((id) => providersByServedId.get(id).has('anthropic') && !supportedSet.has(id)),
    ),
    pickerOffersWhatNarrativeNeverServes: uniqueSorted(
      supportedModels.filter((id) => !profileIdSet.has(id)),
    ),
    familiesCarryingMoreThanOneLiteralId: uniqueSorted(
      [...families.values()].filter((ids) => ids.length > 1).map((ids) => uniqueSorted(ids).join(' + ')),
    ),
    providersWithNoDeclaredRetentionPosture: uniqueSorted(
      providersInPlay.filter((p) => !providersWithRetentionPosture.includes(p)),
    ),
    deepTierIdsWhoseCostTierCannotSaySo: uniqueSorted(
      registryIds.filter((id) => MODEL_REGISTRY[id].tierClass === 'deep'
        && (costTiersByServedId.get(id)?.has('standard') ?? false)),
    ),
    listCKeyedBy: profileKeys.some((k) => registryIds.includes(k)) ? 'modelId' : 'preferenceToken',
    edgeSourcesImportingTheRegistry: uniqueSorted(
      [ANALYST_PATH, NARRATIVE_PATH].filter((p) => read(p).includes('modelRegistry')),
    ),
    profilesWhosePhaseIdsDiverge: uniqueSorted(
      profileKeys.filter((k) => new Set(PHASES.map((ph) => modelProfiles[k].phases[ph].id)).size > 1),
    ),
    routingModelsThePickerRefuses: uniqueSorted(routingClassIds.filter((id) => !supportedSet.has(id))),
    idsServedUnderMoreThanOneProvider: uniqueSorted(
      [...providersByServedId.entries()].filter(([, ps]) => ps.size > 1).map(([id]) => id),
    ),
    registryIdsNoListReaches: uniqueSorted(registryIds.filter((id) => !listIds.includes(id))),
  };
}

const observed = observedDivergences();

// ── Tests ────────────────────────────────────────────────────────────────────

describe('model registry - the parse is real (guard the guard)', () => {
  it('every list parsed to something, so nothing below can pass on emptiness', () => {
    expect(supportedModels.length, 'ANTHROPIC_SUPPORTED_MODELS').toBeGreaterThanOrEqual(3);
    expect(['zero', 'bounded', 'training']).toContain(anthropicRetentionClass);
    expect(providersWithRetentionPosture).toContain('anthropic');
    expect(AI_ROUTING_CLASSES.length, 'AI_ROUTING_CLASSES').toBeGreaterThanOrEqual(3);
    expect(routingClassIds.every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
    expect(profileKeys.length, 'MODEL_PROFILES').toBeGreaterThanOrEqual(8);
    expect(profileIds.length, 'distinct served model ids').toBeGreaterThanOrEqual(6);
    expect(Object.keys(modelAliases).length, 'MODEL_ALIASES').toBeGreaterThanOrEqual(4);
    expect(defaultPreference.length).toBeGreaterThan(0);
    expect(listIds.length, 'union of the three lists').toBeGreaterThanOrEqual(10);
    expect(registryIds.length, 'MODEL_REGISTRY').toBeGreaterThanOrEqual(10);
  });

  it('every served phase id is environment-overridable, so the registry records literal defaults only (D6)', () => {
    const withoutEnvOverride = [];
    for (const key of profileKeys) {
      for (const ph of PHASES) {
        if (modelProfiles[key].phases[ph].envVar === null) withoutEnvOverride.push(`${key}.${ph}`);
      }
    }
    expect(
      withoutEnvOverride,
      'a phase id with no Deno.env override changes what D6 says; update the registry docblock if this is deliberate',
    ).toEqual([]);
  });
});

describe('model registry - totality over the three lists', () => {
  it('every model id reachable from any list has a registry entry', () => {
    const orphans = listIds.filter((id) => !(id in MODEL_REGISTRY));
    expect(
      orphans,
      `\nModel id(s) a list can reach with NO entry in src/domain/modelRegistry.js.\n`
      + `Add an entry (provider, retentionClass, tierClass, sources) for each, and record the\n`
      + `inference rule that produced its tierClass:\n${orphans.join('\n')}\n`,
    ).toEqual([]);
    for (const id of listIds) expect(() => registryEntry(id)).not.toThrow();
  });

  it('each entry names exactly the lists that actually reach it', () => {
    const supportedSet = new Set(supportedModels);
    const routingSet = new Set(routingClassIds);
    const profileIdSet = new Set(profileIds);
    const drift = [];
    for (const id of listIds) {
      const actual = [];
      if (supportedSet.has(id)) actual.push('ANTHROPIC_SUPPORTED_MODELS');
      if (profileIdSet.has(id)) actual.push('MODEL_PROFILES');
      if (routingSet.has(id)) actual.push('ROUTING_CLASS_MODEL');
      const declared = [...registryEntry(id).sources];
      if (declared.join('|') !== actual.sort(byText).join('|')) {
        drift.push(`${id}: registry says [${declared.join(', ')}], sources say [${actual.join(', ')}]`);
      }
    }
    expect(drift, `\n${drift.join('\n')}\n`).toEqual([]);
  });
});

describe('model registry - per-entry parity where both sides declare it', () => {
  it('provider matches the profile that serves the id, and lists A and B are anthropic-only', () => {
    for (const [id, providers] of providersByServedId) {
      for (const provider of providers) {
        expect(registryEntry(id).provider, `${id} provider`).toBe(provider);
      }
    }
    for (const id of [...supportedModels, ...routingClassIds]) {
      expect(registryEntry(id).provider, `${id} provider`).toBe('anthropic');
    }
  });

  it('retentionClass matches ANTHROPIC_RETENTION_CLASS for every id the picker offers', () => {
    for (const id of supportedModels) {
      expect(registryEntry(id).retentionClass, `${id} retentionClass`).toBe(anthropicRetentionClass);
    }
  });

  it('tierClass matches ROUTING_CLASS_MODEL verbatim for every id it names (rule 1, measured)', () => {
    for (const cls of AI_ROUTING_CLASSES) {
      const id = ROUTING_CLASS_MODEL[cls];
      expect(registryEntry(id).tierClass, `${cls} routes ${id}`).toBe(cls);
    }
  });

  it('tierClass for a served id the routing list does not name follows the recorded inference rules', () => {
    const routingSet = new Set(routingClassIds);
    const problems = [];
    for (const id of profileIds) {
      if (routingSet.has(id)) continue;               // rule 1 already covered it above
      const tiers = costTiersByServedId.get(id);
      const tierClass = registryEntry(id).tierClass;
      // Rule 2: costTier 'fast' becomes tierClass 'fast'.
      if (tiers.has('fast') && tierClass !== 'fast') {
        problems.push(`${id}: costTier fast but tierClass ${tierClass} (rule 2)`);
      }
      // Rule 3: costTier 'standard' becomes 'balanced', never 'deep' (D4 conservatism).
      if (tiers.has('standard') && !tiers.has('fast') && tierClass !== 'balanced') {
        problems.push(`${id}: costTier standard but tierClass ${tierClass}, expected balanced (rule 3)`);
      }
    }
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  it('every alias target and the default preference resolve to registered ids', () => {
    const targets = uniqueSorted([defaultPreference, ...Object.values(modelAliases)]);
    for (const target of targets) {
      expect(profileKeys, `alias target ${target}`).toContain(target);
      for (const ph of PHASES) {
        expect(() => registryEntry(modelProfiles[target].phases[ph].id)).not.toThrow();
      }
    }
  });
});

describe('model registry - the edge tier mirror agrees with the registry (wave L-3a)', () => {
  // WHY A MIRROR EXISTS AT ALL. Wave L-3a extracted the nine-surface copy-pasted
  // captured-model expression into supabase/functions/ai-analyst/modelResolver.ts, and that
  // resolver reports the tierClass of the model it chose. Deno cannot import from src/, so
  // the repo's two sanctioned workarounds are a generated bundle or a literal mirror plus a
  // drift test. L-3a took the second, and this describe block IS that drift test.
  //
  // NOTE ON edgeSourcesImportingTheRegistry (pinned empty above): it stays empty and stays
  // correct. The resolver does not import the registry, it mirrors it, so the L-2b pin's
  // reading of the tree is unchanged. The resolver file is deliberately NOT added to that
  // scan, because that scan is a prose-inclusive mention test and the resolver's docblock
  // names the registry by path on purpose. What binds the two files is the assertion below,
  // which is the stronger statement anyway.

  /** The registry projection the mirror is required to equal. */
  const anthropicProjection = Object.fromEntries(
    Object.keys(MODEL_REGISTRY)
      .filter((id) => MODEL_REGISTRY[id].provider === 'anthropic')
      .map((id) => [id, MODEL_REGISTRY[id].tierClass]),
  );

  it('guard the guard: both sides parsed to something non-trivial', () => {
    expect(Object.keys(resolverTierMirror).length, 'ANTHROPIC_TIER_CLASS').toBeGreaterThanOrEqual(5);
    expect(Object.keys(anthropicProjection).length, 'anthropic registry entries').toBeGreaterThanOrEqual(5);
    expect(resolverTierUnion.length, 'resolver TierClass union').toBeGreaterThanOrEqual(3);
  });

  it('the mirror equals the registry anthropic projection, in BOTH directions', () => {
    const missing = Object.keys(anthropicProjection)
      .filter((id) => !(id in resolverTierMirror))
      .map((id) => `${id} (registry says ${anthropicProjection[id]}, mirror carries nothing)`);
    const extra = Object.keys(resolverTierMirror)
      .filter((id) => !(id in anthropicProjection))
      .map((id) => `${id} (mirror says ${resolverTierMirror[id]}, registry has no anthropic entry)`);
    const disagree = Object.keys(anthropicProjection)
      .filter((id) => id in resolverTierMirror && resolverTierMirror[id] !== anthropicProjection[id])
      .map((id) => `${id}: registry ${anthropicProjection[id]}, mirror ${resolverTierMirror[id]}`);
    expect(
      [...missing, ...extra, ...disagree],
      `\nThe edge tier mirror in ${RESOLVER_PATH} has drifted from ${REGISTRY_PATH}.\n`
      + `The mirror must be exactly { id: tierClass } for every registry entry whose provider\n`
      + `is 'anthropic'. Deno cannot import the registry, so this test is the only thing\n`
      + `holding the two statements together:\n`
      + `${[...missing, ...extra, ...disagree].join('\n')}\n`,
    ).toEqual([]);
  });

  it('the mirror is a mirror, not a second opinion: every value is a real registry tierClass', () => {
    for (const [id, tier] of Object.entries(resolverTierMirror)) {
      expect(registryEntry(id).tierClass, `${id} tierClass`).toBe(tier);
      expect(registryEntry(id).provider, `${id} provider`).toBe('anthropic');
    }
  });

  it('the resolver declares the same three rungs the registry uses', () => {
    const registryTiers = uniqueSorted(Object.keys(MODEL_REGISTRY).map((id) => MODEL_REGISTRY[id].tierClass));
    expect(resolverTierUnion).toEqual(uniqueSorted(['fast', 'balanced', 'deep']));
    for (const tier of registryTiers) {
      expect(resolverTierUnion, `registry uses rung "${tier}"`).toContain(tier);
    }
  });

  it('every id the picker can serve has a rung in the mirror (no untiered BYOK choice)', () => {
    for (const id of supportedModels) {
      expect(resolverTierMirror[id], `${id} has no rung in the edge mirror`).toBeTruthy();
    }
  });
});

describe('model registry - the known disagreements are pinned, and the pin only shrinks', () => {
  it('the pin and the sources agree exactly, in both directions', () => {
    const keys = uniqueSorted([...Object.keys(KNOWN_DIVERGENCES), ...Object.keys(observed)]);
    /** @type {string[]} */
    const resolved = [];
    /** @type {string[]} */
    const appeared = [];
    for (const key of keys) {
      const pinned = KNOWN_DIVERGENCES[key];
      const now = observed[key];
      if (typeof pinned === 'string' || typeof now === 'string') {
        if (pinned !== now) resolved.push(`${key}: pinned "${pinned}", sources say "${now}"`);
        continue;
      }
      const pinnedSet = new Set(pinned ?? []);
      const nowSet = new Set(now ?? []);
      for (const v of pinned ?? []) if (!nowSet.has(v)) resolved.push(`${key}: ${v}`);
      for (const v of now ?? []) if (!pinnedSet.has(v)) appeared.push(`${key}: ${v}`);
    }
    expect(
      resolved,
      `\nA pinned divergence NO LONGER EXISTS. Somebody resolved it, which is a real win and\n`
      + `must be banked: SHRINK KNOWN_DIVERGENCES in this file to match, and update the D-class\n`
      + `docblock in src/domain/modelRegistry.js so the two statements stay one statement.\n`
      + `${resolved.join('\n')}\n`,
    ).toEqual([]);
    expect(
      appeared,
      `\nA NEW divergence between the three model lists. The lists drifted further apart.\n`
      + `Either close it, or, if it is deliberate, add it to KNOWN_DIVERGENCES here AND record\n`
      + `it as a D-class in the src/domain/modelRegistry.js docblock. Never leave it unstated:\n`
      + `${appeared.join('\n')}\n`,
    ).toEqual([]);
  });

  it('the pin is frozen, so no test can quietly widen it at runtime', () => {
    expect(Object.isFrozen(KNOWN_DIVERGENCES)).toBe(true);
    for (const value of Object.values(KNOWN_DIVERGENCES)) {
      if (Array.isArray(value)) expect(Object.isFrozen(value)).toBe(true);
    }
  });

  it('the pinned D-classes are the list-observable ones, and each is still described in the registry', () => {
    // D6 (environment-overridable ids) and D7 (no list imports another) are asserted
    // structurally elsewhere in this file; D5 rides as a scalar in the pin above.
    for (const cls of ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']) {
      expect(registrySrc, `${cls} description`).toContain(`${cls}.`);
    }
  });
});

describe('model registry - the registry itself', () => {
  it('carries a version and is frozen top to bottom', () => {
    expect(typeof REGISTRY_VERSION).toBe('string');
    expect(REGISTRY_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(Object.isFrozen(MODEL_REGISTRY)).toBe(true);
    for (const id of registryIds) {
      const e = MODEL_REGISTRY[id];
      expect(Object.isFrozen(e), `${id} entry frozen`).toBe(true);
      expect(Object.isFrozen(e.sources), `${id} sources frozen`).toBe(true);
    }
  });

  it('every entry is well-formed and self-consistent', () => {
    const PROVIDERS = ['anthropic', 'openai'];
    const RETENTION = ['zero', 'bounded', 'training'];
    const TIERS = ['fast', 'balanced', 'deep'];
    const SOURCES = ['ANTHROPIC_SUPPORTED_MODELS', 'ROUTING_CLASS_MODEL', 'MODEL_PROFILES'];
    const problems = [];
    for (const id of registryIds) {
      const e = MODEL_REGISTRY[id];
      if (e.id !== id) problems.push(`${id}: entry.id is "${e.id}"`);
      if (!PROVIDERS.includes(e.provider)) problems.push(`${id}: provider "${e.provider}"`);
      if (!RETENTION.includes(e.retentionClass)) problems.push(`${id}: retentionClass "${e.retentionClass}"`);
      if (!TIERS.includes(e.tierClass)) problems.push(`${id}: tierClass "${e.tierClass}"`);
      if (e.sources.length === 0) problems.push(`${id}: names no source list`);
      for (const s of e.sources) if (!SOURCES.includes(s)) problems.push(`${id}: unknown source "${s}"`);
      if (new Set(e.sources).size !== e.sources.length) problems.push(`${id}: duplicate source`);
      if ([...e.sources].sort(byText).join('|') !== e.sources.join('|')) problems.push(`${id}: sources unsorted`);
    }
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  it('ids are unique, so no entry silently overwrites another', () => {
    const seen = new Set();
    const dupes = [];
    for (const id of rawRegistryIds) {
      if (seen.has(id)) dupes.push(id);
      seen.add(id);
    }
    expect(dupes, `duplicate entry() ids in ${REGISTRY_PATH}: ${dupes.join(', ')}`).toEqual([]);
    expect(rawRegistryIds.length, 'entry() calls vs MODEL_REGISTRY keys').toBe(registryIds.length);
    expect(uniqueSorted(rawRegistryIds)).toEqual(uniqueSorted(registryIds));
  });

  it('registryEntry throws on an unknown id rather than falling through to a default', () => {
    expect(() => registryEntry('claude-does-not-exist')).toThrow(/unknown model id/);
    expect(() => registryEntry('')).toThrow(/unknown model id/);
    expect(() => registryEntry(undefined)).toThrow(/unknown model id/);
    expect(() => registryEntry(null)).toThrow(/unknown model id/);
    expect(() => registryEntry(42)).toThrow(/unknown model id/);
    // The throw names the known ids, so a caller reads the fix off the message.
    expect(() => registryEntry('nope')).toThrow(/Known ids:/);
  });

  it('registryEntry returns the same frozen entry the map carries', () => {
    for (const id of registryIds) {
      expect(registryEntry(id)).toBe(MODEL_REGISTRY[id]);
    }
  });
});
