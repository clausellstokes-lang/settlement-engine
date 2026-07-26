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

const MAGIC_ROLE_PATTERN =
  /\b(?:archmag(?:e|ister)|artificer|druid|enchanter|hedge witch|mage|magister|sorcerer|warlock|witch|wizard)\b/i;

const MAGIC_ASSERTION_PATTERN =
  /\b(?:arcane|artificer|cantrips?|curses?|druid|enchant(?:ed|ing|ment)?|golems?|mage|magic|magical|necromanc(?:er|y|tic)|planar|runes?|scry(?:ing)?|sorcerer|spells?|teleport(?:ation)?|undead|warlock|witch|wizard)\b/i;

/**
 * Explicit denials of functional magic. These are clause-shaped instead of
 * deleting broad words such as "no" or "not": "no magic in it" is benign,
 * while "no ward stops the wizard" still retains its affirmative wizard claim.
 * The final certification receipt uses this same predicate as the producers.
 */
const NEGATED_MAGIC_PATTERNS = Object.freeze([
  /\bnon[- ]magical\b/gi,
  /\bno\s+(?:actual\s+|real\s+|functional\s+)?magic(?:al)?(?:\s+(?:ability|compound|effect|ingredient|power|properties|quality|value)s?)?(?:\s+(?:in|to|within)\s+(?:it|them|this|the\s+[a-z'-]+))?\b/gi,
  /\bnothing\s+magical(?:\s+(?:here|about\s+(?:it|this)))?\b/gi,
  /\brather than (?:any\s+)?(?:actual\s+|real\s+|functional\s+)?magic\b/gi,
  /\bwhere the alchemist deals in magical compounds? and acid, this trade does not\b/gi,
  /\b(?:mere|only|purely)\s+stage magic\b/gi,
  /\bstage magic\b/gi,
]);

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

function carriesExplicitMagicMetadata(entity, category = '') {
  if (!entity || typeof entity !== 'object') {
    return String(category).trim().toLowerCase() === 'magic';
  }
  const semanticCategory = String(
    category || entity.category || entity.priorityCategory || '',
  ).trim().toLowerCase();
  const tags = normalizedTags(entity);
  return (
    entity.magical === true
    || semanticCategory === 'magic'
    || tags.some(tag => (
      tag === 'magic'
      || tag === 'magical'
      || ARCANE_INST_TAGS.includes(tag)
    ))
  );
}

export function textAssertsFunctionalMagic(value) {
  let text = String(value || '');
  for (const pattern of NEGATED_MAGIC_PATTERNS) {
    text = text.replace(pattern, '');
  }
  return MAGIC_ASSERTION_PATTERN.test(text);
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

function nativeInstitutionRequiresMagic(institution) {
  const entity = typeof institution === 'string'
    ? { name: institution }
    : (institution || {});
  if (carriesExplicitMagicMetadata(entity)) return true;
  const name = String(entity.name || '').toLowerCase();
  return ARCANE_INST_KW.some(keyword => name.includes(keyword));
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
