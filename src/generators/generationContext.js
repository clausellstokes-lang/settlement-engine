/**
 * generationContext.js — immutable world law for one settlement-generation run.
 *
 * A resolved config is data; it is not an eligibility policy. Historically each
 * producer interpreted `magicExists`, `priorityMagic`, route, and profile fields
 * independently. That allowed a later cascade, service description, NPC secret,
 * or history tension to reintroduce content an earlier producer had rejected.
 *
 * GenerationContext captures the resolved, run-scoped facts once. Its WorldLaw
 * is the only cross-producer eligibility API. The object is deliberately small
 * and immutable: it carries no RNG, no mutable config reference, and no catalog
 * data. Culture/content systems can resolve richer profiles independently and
 * pass their stable IDs here without coupling this policy boundary to profile
 * implementation.
 */

import {
  ARCANE_INST_KW,
  ARCANE_INST_TAGS,
} from '../domain/magicFilter.js';
import {
  allowsGeneratedContent as profileAllowsGeneratedContent,
  resolveGenerationContentProfile,
} from '../domain/generationContentProfile.js';
import {
  isGeneratorOwnedEntity,
} from '../domain/generationOwnership.js';
// MF-CH2b: the catalog's DECLARED magic licence. The adapter is the same one
// institutionProbability already reads, so no new module edge is created here — and it
// deliberately is NOT magicFilter, which is routed to the lazy generation bundle.
import { institutionCatalogMagicLicence } from '../domain/arcaneInstitutionIdentity.js';
import { magicLicenceAtLeast } from '../data/constants.js';
// MG-3h: the assertion vocabulary and its denial clauses moved to a domain leaf so the
// arcane-identity detector reads them too. Re-exported below — the world law's answers
// are unchanged; only the address of the patterns moved.
import {
  textAssertsFunctionalMagic,
} from '../domain/magicAssertionText.js';

export { textAssertsFunctionalMagic };

const MAGIC_ROLE_PATTERN =
  /\b(?:archmag(?:e|ister)|artificer|druid|enchanter|hedge witch|mage|magister|sorcerer|warlock|witch|wizard)\b/i;

const MAGIC_HISTORY_TYPES = new Set([
  'magical',
  'magical_controversy',
  'wild_magic',
]);

const MARITIME_ONLY_INSTITUTION =
  /\b(?:major port|navy|shipyard)\b/i;

const MARITIME_ASSERTION_PATTERN =
  /\b(?:deepwater|maritime|naval|ocean-going|seagoing|sea-going|seaport|war-vessels?)\b|\bcoastal\s+(?:districts?|ports?|raids?|shipping|trade|waters?)\b|\bsea\s+(?:access|lanes?|power|raids?|supply|trade|traffic|voyages?)\b/i;

const CONDITIONAL_MARITIME_PATTERNS = Object.freeze([
  // Culture profiles describe a repertoire. This phrase explicitly marks one
  // option as conditional rather than claiming it exists in the generated
  // settlement.
  /\bnaval assets? where relevant\b/gi,
]);

function normalizedTags(entity) {
  if (!entity || typeof entity !== 'object') return [];
  if (Array.isArray(entity.tags)) {
    return entity.tags.map(tag => String(tag).trim().toLowerCase());
  }
  if (typeof entity.tags === 'string') {
    return entity.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function isCustomEntity(entity) {
  return Boolean(
    entity
    && typeof entity === 'object'
    && (
      entity.source === 'custom'
      || entity.custom === true
      || entity.isCustom === true
      || entity.customDefinitionId
      || entity.customDefinitionCategory
    )
  );
}

/**
 * ⚠ THE TWO SHELF READS BELOW SURVIVE ON PURPOSE, AND ONLY FOR ENTITIES THE CATALOG DOES NOT
 * KNOW. Every caller that can reach a catalog row asks `nativeInstitutionRequiresMagic`
 * first, which answers from the declared licence and returns before this function is
 * consulted (MF-CH2b). What is left is the custom-content branch of `allowsInstitution` and
 * the service/secret readers, where `category: 'Magic'` is a player's own declaration about
 * their own content and IS the authored semantics. Both are marked so the shelf-gate census
 * can count them and refuse an unmarked one.
 */
function carriesExplicitMagicMetadata(entity, category = '') {
  if (!entity || typeof entity !== 'object') {
    return String(category).trim().toLowerCase() === 'magic'; // @non-catalog-fallback MF-CH2
  }
  const semanticCategory = String(
    category || entity.category || entity.priorityCategory || '',
  ).trim().toLowerCase();
  const tags = normalizedTags(entity);
  return (
    entity.magical === true
    || semanticCategory === 'magic' // @non-catalog-fallback MF-CH2
    || tags.some(tag => (
      tag === 'magic'
      || tag === 'magical'
      || ARCANE_INST_TAGS.includes(tag)
    ))
  );
}

export function textAssertsMaritimeCapability(value) {
  let text = String(value || '');
  for (const pattern of CONDITIONAL_MARITIME_PATTERNS) {
    text = text.replace(pattern, '');
  }
  return MARITIME_ASSERTION_PATTERN.test(text);
}

function generatedCandidateText(candidate) {
  if (typeof candidate === 'string') return candidate;
  if (!candidate || typeof candidate !== 'object') return String(candidate || '');
  return [
    candidate.role,
    candidate.secret,
    candidate.what,
    candidate.stakes,
    candidate.name,
    candidate.label,
    candidate.title,
    candidate.type,
    candidate.desc,
    candidate.description,
    candidate.summary,
  ].filter(Boolean).join(' ');
}

/**
 * P5 — THE WORLD LAW, and the path that actually decides a dead-magic world.
 *
 * This predicate runs at `assembleInstitutions.js:268/410/484`, `cascadePass`,
 * `coherenceRepairPass`, `factionCorrelationPass` and `cascadeGenerator.js:180` — BEFORE any
 * probability. Until MF-CH2b it answered from two things a row never said about itself: the
 * SHELF (every one of those call sites spreads `category` onto the record it passes, so
 * `carriesExplicitMagicMetadata` read `entity.category === 'magic'`), and an unanchored
 * substring scan of the NAME over `ARCANE_INST_KW`, which struck 26 of the 311 catalog rows.
 * That is the residual `docs/DESIGN_REALM_MAGIC_TOGGLE.md` recorded as live-but-unscheduled;
 * routing the catalog case through the declared licence is what discharges it.
 *
 * A catalog row's DECLARED licence is now the whole answer. `magicLicense: 'none'` means the
 * entry needs no functioning magic, so a dead-magic world keeps it — which is how the mundane
 * chemical trade comes back. Everything without a declaration — custom content, an imported
 * roster, a neighbour's invented org — falls to exactly the two tests it fell to before.
 */
function nativeInstitutionRequiresMagic(institution) {
  const entity = typeof institution === 'string'
    ? { name: institution }
    : (institution || {});
  const declaredLicence = institutionCatalogMagicLicence(entity.name);
  if (declaredLicence !== null) return magicLicenceAtLeast(declaredLicence, 'low');
  if (carriesExplicitMagicMetadata(entity)) return true;
  const name = String(entity.name || '').toLowerCase();
  return ARCANE_INST_KW.some(keyword => name.includes(keyword));
}

/**
 * THE SIXTH SURFACE THAT READ A SHELF AS A STATEMENT ABOUT THE WORLD (found by execution,
 * MF-CH2B). `generationCoherence.js` walks EVERY string in a finished settlement — including
 * its TAXONOMY fields, `category`, `priorityCategory` and `tags[]` — and asks
 * `allowsMagicClaim` about each one. `textAssertsFunctionalMagic` is a PROSE detector, so it
 * answers yes to the bare strings `'Magic'`, `'arcane'` and `'magic'`, and the moment a
 * magic-free world lawfully keeps a Magic-shelf row the settlement's own certification
 * convicts it of claiming magic — for the name of the shelf it is filed on.
 *
 * A bucket name is not a sentence. A field whose ENTIRE value is one token from the estate's
 * closed classification vocabulary is a filing decision, not an assertion, so it is not a
 * claim this or any world can breach. Anything longer — a description, a rumour, a service
 * line — is prose and is read exactly as before.
 *
 * ⚠️ SCOPE, stated because this predicate sits on a certification the owner reads:
 * `allowsMagicClaim` has exactly ONE consumer in `src/` (the world-law findings in
 * `generationCoherence.js:369`), so this narrows that certification and nothing else. The
 * vocabulary is DERIVED from `ARCANE_INST_TAGS` rather than re-typed.
 */
const CLASSIFICATION_TOKENS = new Set(['magic', 'magical', ...ARCANE_INST_TAGS]);

/** @param {unknown} value @returns {boolean} */
function isBareClassificationToken(value) {
  return CLASSIFICATION_TOKENS.has(String(value ?? '').trim().toLowerCase());
}

function normalizedPriority(config) {
  const priority = Number(config?.priorityMagic ?? 50);
  if (!Number.isFinite(priority)) return 50;
  return Math.max(0, Math.min(100, priority));
}

function nullableString(value) {
  if (value == null || value === '') return null;
  return String(value);
}

function immutableContentProfile(profileValue) {
  const source = profileValue || resolveGenerationContentProfile();
  return Object.freeze({
    id: String(source.id || 'grounded'),
    label: String(source.label || 'Grounded'),
    description: String(source.description || ''),
    boundaries: Object.freeze({ ...(source.boundaries || {}) }),
  });
}

/**
 * Build the immutable policy object for one resolved generation.
 *
 * `magicExists:false` is a hard world fact and therefore dominates every
 * priority value, including stale or contradictory `priorityMagic:100` input.
 * A priority of zero also means magic does not function, preserving the existing
 * resolved-config contract for the slider-only no-magic mode.
 *
 * @param {Record<string, unknown>} config
 * @param {{
 *   tier?:string|null,
 *   tradeRoute?:string|null,
 *   terrainType?:string|null,
 *   cultureProfileId?:string|null,
 *   contentProfileId?:string|null,
 *   generationContentProfile?:ReturnType<typeof resolveGenerationContentProfile>,
 * }} [resolved]
 */
export function createGenerationWorldLaw(config = {}, resolved = {}) {
  const magicPriority = normalizedPriority(config);
  const magicEnabled =
    config.magicExists !== false
    && magicPriority > 0;
  const tradeRoute = String(
    resolved.tradeRoute || config.tradeRouteAccess || 'road',
  ).toLowerCase();
  const terrainType = String(
    resolved.terrainType || config.terrainType || '',
  ).toLowerCase();
  // An explicit port route proves ocean access unless riverside terrain
  // disambiguates it as an inland river port. Hills and cliffs can still host
  // a seaport; requiring the coarse terrain label itself to be `coastal`
  // incorrectly invalidated those legitimate port configurations.
  const maritimeSupported =
    terrainType === 'coastal'
    || (tradeRoute === 'port' && terrainType !== 'riverside');
  const riverTradeSupported =
    tradeRoute === 'river'
    || terrainType === 'riverside';
  const portKind = maritimeSupported
    ? 'maritime'
    : riverTradeSupported
      ? 'river'
      : 'none';
  const generationContentProfile = immutableContentProfile(
    resolved.generationContentProfile
    || resolveGenerationContentProfile(config),
  );
  // Theme profiles are a promise about generated suggestions, never a censor
  // over explicit player/event/custom content. Hard world facts (for example,
  // no functioning magic) are evaluated separately below and retain their own
  // precedence.
  const profileAllowsCandidate = candidate => (
    !isGeneratorOwnedEntity(candidate)
    || profileAllowsGeneratedContent(generationContentProfile, candidate)
  );
  const allowsGeneratedContent = candidate => (
    profileAllowsCandidate(candidate)
    && (
      magicEnabled
      || !textAssertsFunctionalMagic(generatedCandidateText(candidate))
    )
  );

  const allowsInstitution = institution => {
    if (!profileAllowsCandidate(institution)) return false;
    if (
      !maritimeSupported
      && !isCustomEntity(institution)
      && MARITIME_ONLY_INSTITUTION.test(
        String(
          typeof institution === 'string'
            ? institution
            : institution?.name || '',
        ),
      )
    ) return false;
    if (magicEnabled) return true;
    if (isCustomEntity(institution)) {
      return !carriesExplicitMagicMetadata(institution);
    }
    return !nativeInstitutionRequiresMagic(institution);
  };

  const allowsRole = role => {
    const entity = typeof role === 'string' ? { role } : (role || {});
    const roleText = `${entity.role || entity.name || ''} ${entity.title || ''}`;
    if (
      isGeneratorOwnedEntity(entity)
      && !profileAllowsGeneratedContent(
        generationContentProfile,
        roleText || entity,
      )
    ) return false;
    if (
      !maritimeSupported
      && isGeneratorOwnedEntity(entity)
      && textAssertsMaritimeCapability(roleText)
    ) return false;
    if (magicEnabled) return true;
    if (carriesExplicitMagicMetadata(entity, entity.category)) return false;
    if (!isGeneratorOwnedEntity(entity)) return true;
    return !MAGIC_ROLE_PATTERN.test(roleText);
  };

  const allowsService = (service, provider = null, category = '') => {
    const entity = typeof service === 'string' ? { name: service } : (service || {});
    if (!profileAllowsCandidate(entity)) return false;
    if (
      isGeneratorOwnedEntity(entity)
      && !profileAllowsGeneratedContent(generationContentProfile, category)
    ) return false;
    if (provider && !allowsInstitution(provider)) return false;
    if (magicEnabled) return true;
    if (carriesExplicitMagicMetadata(entity, category)) return false;
    return !textAssertsFunctionalMagic(
      `${entity.name || ''} ${entity.desc || entity.description || ''}`,
    );
  };

  const allowsSecret = secret => {
    const entity = typeof secret === 'string' ? { secret } : (secret || {});
    const text = `${entity.secret || entity.what || ''} ${entity.stakes || ''}`;
    if (
      isGeneratorOwnedEntity(entity)
      && !profileAllowsGeneratedContent(generationContentProfile, text)
    ) return false;
    if (magicEnabled) return true;
    return (
      !textAssertsFunctionalMagic(text)
      && !/\b(?:binding pact|divine visions?|placed compulsion)\b/i.test(text)
    );
  };

  const allowsHistoryEvent = event => {
    const type = String(
      typeof event === 'string'
        ? event
        : (event?.templateType || event?.type || ''),
    ).toLowerCase();
    if (
      isGeneratorOwnedEntity(event)
      && (
        !profileAllowsGeneratedContent(generationContentProfile, event)
        || !profileAllowsGeneratedContent(generationContentProfile, type)
      )
    ) return false;
    if (magicEnabled) return true;
    return !MAGIC_HISTORY_TYPES.has(type);
  };

  return Object.freeze({
    version: 1,
    generationContentProfile,
    magicPriority,
    magicEnabled,
    magicFunctions: () => magicEnabled,
    allowsInstitution,
    allowsRole,
    allowsService,
    allowsSecret,
    allowsHistoryEvent,
    allowsGeneratedContent,
    allowsMagicClaim: candidate => (
      magicEnabled
      || isBareClassificationToken(generatedCandidateText(candidate))
      || !textAssertsFunctionalMagic(generatedCandidateText(candidate))
    ),
    allowsMaritimeClaim: candidate => (
      maritimeSupported
      || !textAssertsMaritimeCapability(generatedCandidateText(candidate))
    ),
    portKind,
    supportsMaritime: () => maritimeSupported,
    supportsRiverTrade: () => riverTradeSupported,
  });
}

/**
 * Build the run-scoped context retained by the pipeline. Only resolved scalar
 * facts and stable profile IDs cross this boundary; the caller's config remains
 * mutable by its owning pipeline steps and is never frozen or retained here.
 *
 * @param {{
 *   config?:Record<string, unknown>,
 *   tier?:string|null,
 *   tradeRoute?:string|null,
 *   terrainType?:string|null,
 *   cultureProfileId?:string|null,
 *   contentProfileId?:string|null,
 *   generationContentProfile?:ReturnType<typeof resolveGenerationContentProfile>,
 * }} [input]
 */
export function createGenerationContext(input = {}) {
  const config = input.config || {};
  const generationContentProfile = immutableContentProfile(
    input.generationContentProfile
    || resolveGenerationContentProfile(config),
  );
  const cultureProfileId =
    nullableString(
      input.cultureProfileId
      ?? config.cultureProfileId
      ?? config.culture,
    );
  const contentProfileId =
    nullableString(
      input.contentProfileId
      ?? generationContentProfile.id
      ?? config.contentProfileId
      ?? config.contentProfile,
    );
  const resolved = Object.freeze({
    tier: nullableString(input.tier ?? config.tier),
    tradeRoute: String(
      input.tradeRoute
      ?? config.tradeRouteAccess
      ?? 'road',
    ),
    terrainType: nullableString(
      input.terrainType
      ?? config.terrainType,
    ),
    cultureProfileId,
    contentProfileId,
  });
  const worldLaw = createGenerationWorldLaw(config, {
    ...resolved,
    generationContentProfile,
  });
  return Object.freeze({
    ...resolved,
    worldLaw,
  });
}

/**
 * Resolve an already-built GenerationContext/WorldLaw, or construct a fallback
 * for direct generator callers that do not run the pipeline.
 *
 * `resolved` carries facts the CALLER already holds as its own arguments — the
 * resolved route above all — which its `config` may not repeat. A generator
 * whose signature takes `tradeRoute` positionally must pass it here, or the
 * fallback law silently reads `config.tradeRouteAccess` (absent, or still the
 * pre-resolution request such as `random_trade`) and answers route questions
 * about a different world than the one the caller is generating. The override
 * applies only to the fallback: an existing context/law resolved these facts
 * when it was built and is already authoritative.
 *
 * @param {unknown} candidate
 * @param {Record<string, unknown>} [config]
 * @param {{tier?:string|null, tradeRoute?:string|null, terrainType?:string|null}} [resolved]
 */
export function resolveGenerationWorldLaw(candidate, config = {}, resolved = {}) {
  const maybe = /** @type {any} */ (candidate);
  if (
    maybe
    && typeof maybe.magicFunctions === 'function'
    && typeof maybe.allowsInstitution === 'function'
  ) return maybe;
  if (
    maybe?.worldLaw
    && typeof maybe.worldLaw.magicFunctions === 'function'
  ) return maybe.worldLaw;
  return createGenerationWorldLaw(config, resolved);
}
