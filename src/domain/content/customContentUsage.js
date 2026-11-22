/**
 * customContentUsage.js — reverse, read-only evidence for authored definitions.
 *
 * Usage echo is a projection, never simulation truth. Exact stable references
 * outrank name-only legacy evidence, and every result carries its confidence so
 * the UI cannot turn a historical name match into a false provenance claim.
 * Content hashes and fingerprints corroborate a known identity; they are never
 * identities by themselves because distinct definitions can share a digest.
 */

import { getCustomContentCategory } from './customContentManifest.js';

const MAX_WALK_DEPTH = 24;
const MAX_RESULTS_PER_KIND = 100;
const DEPENDENCY_FIELD_KEYS = new Set([
  'produces',
  'requires',
  'subsumes',
  'providedBy',
  'yields',
  'enables',
  'disablesInstitutions',
  'disablesGoods',
  'requiredInstitution',
  'requiredResources',
  'controls',
  'rivals',
]);

/**
 * The usage projection intentionally accepts persisted records from several
 * schema generations. Keep the boundary unknown and narrow fields as they are
 * inspected instead of pretending every historical snapshot has today's
 * shape.
 *
 * @typedef {Record<string, unknown>} JsonRecord
 * @typedef {'exact'|'legacy-name'} EvidenceConfidence
 * @typedef {{
 *   bucket:string,
 *   item:JsonRecord,
 *   localUid:string,
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   fingerprint:string,
 *   refId:string,
 *   name:string,
 * }} DefinitionIdentity
 * @typedef {{
 *   kind:string,
 *   index:number,
 *   result:string|null,
 *   confidence:EvidenceConfidence,
 * }} ActivationEvidence
 * @typedef {ActivationEvidence & {settlementId:string}} SettlementActivation
 * @typedef {{
 *   source:string,
 *   id:string|null,
 *   headline:string|null,
 *   confidence:EvidenceConfidence,
 * }} HeraldEvidence
 * @typedef {HeraldEvidence & {campaignId:string}} CampaignHeraldEvidence
 * @typedef {{
 *   id:string,
 *   name:string,
 *   confidence:EvidenceConfidence,
 *   evidence:string[],
 *   mechanicallyActive:boolean,
 * }} SettlementUsage
 * @typedef {{
 *   id:string,
 *   name:string,
 *   bound:boolean,
 *   mentionCount:number,
 * }} CampaignUsage
 * @typedef {{
 *   bucket:string,
 *   localUid:string|null,
 *   name:string,
 *   field:string,
 * }} DependentUsage
 * @typedef {{
 *   settlementId:string,
 *   settlementName:string,
 *   path:string,
 * }} MapStructureUsage
 * @typedef {(value:unknown, path:string) => void} JsonVisitor
 */

/**
 * @param {unknown} value
 * @returns {JsonRecord}
 */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {JsonRecord} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {string} */
function normalized(value) {
  return text(value).toLocaleLowerCase();
}

/**
 * @param {unknown} definition
 * @returns {DefinitionIdentity}
 */
function definitionIdentity(definition) {
  const record = plainRecord(definition);
  const item = plainRecord(record.item ?? definition);
  const revision = plainRecord(item.contentRevision);
  const bucket = text(record.bucket ?? record.categoryKey);
  const localUid = text(item.localUid);
  const definitionId = text(
    item.definitionId
    || item.customDefinitionId
    || revision.definitionId,
  );
  const revisionId = text(
    item.revisionId
    || item.customDefinitionRevisionId
    || item.versionId
    || revision.id,
  );
  const contentHash = text(
    item.contentHash
    || item.customDefinitionContentHash
    || revision.contentHash,
  );
  const fingerprint = text(
    item.fingerprint
    || item.customDefinitionFingerprint
    || item.contentFingerprint
    || revision.fingerprint,
  );
  return {
    bucket,
    item,
    localUid,
    definitionId,
    revisionId,
    contentHash,
    fingerprint,
    refId: localUid ? `custom:${localUid}` : '',
    name: text(item.name),
  };
}

/**
 * @param {DefinitionIdentity} identity
 * @returns {Set<string>}
 */
function exactTokens(identity) {
  return new Set([
    identity.localUid,
    identity.refId,
    identity.definitionId,
    identity.revisionId,
  ].filter(Boolean));
}

/** @param {string} character @returns {boolean} */
function identifierContinuation(character) {
  return typeof character === 'string'
    && character.length > 0
    && /[\p{L}\p{N}_-]/u.test(character);
}

/** @param {string} value @param {number} index @returns {string} */
function codePointBefore(value, index) {
  if (index <= 0) return '';
  const trailing = value.charCodeAt(index - 1);
  if (
    trailing >= 0xDC00
    && trailing <= 0xDFFF
    && index > 1
  ) {
    const leading = value.charCodeAt(index - 2);
    if (leading >= 0xD800 && leading <= 0xDBFF) {
      return value.slice(index - 2, index);
    }
  }
  return value[index - 1] || '';
}

/** @param {string} value @param {number} index @returns {string} */
function codePointAt(value, index) {
  const point = value.codePointAt(index);
  return point == null ? '' : String.fromCodePoint(point);
}

/**
 * Match an opaque identity as either the complete stored value or one complete
 * segment of a structured identifier such as `institution.<localUid>`.
 *
 * A raw substring is never evidence. In particular, `lu_a` must not match
 * `lu_ab`, and JSON serialization punctuation must not manufacture a hit. We
 * also refuse segment matching inside prose: exact provenance belongs in a
 * structured value; prose remains explicitly labelled legacy-name evidence.
 */
/**
 * @param {string} value
 * @param {string} token
 * @returns {boolean}
 */
function exactTokenInString(value, token) {
  if (value === token) return true;
  if (!value || !token || /\s/u.test(value)) return false;

  let from = 0;
  while (from <= value.length - token.length) {
    const index = value.indexOf(token, from);
    if (index < 0) return false;
    const before = codePointBefore(value, index);
    const afterIndex = index + token.length;
    const after = codePointAt(value, afterIndex);
    if (!identifierContinuation(before) && !identifierContinuation(after)) {
      return true;
    }
    from = index + 1;
  }
  return false;
}

/**
 * Exact evidence must live in a field that actually carries identity. Without
 * this gate, an opaque token pasted into notes or prose would be upgraded to a
 * provenance claim merely because it happened to equal a definition id.
 *
 * Historical records use several prefixes, so the rule follows semantic field
 * suffixes rather than one current object shape. Explicit anchor fields cover
 * composite TownMap identities such as `uid:<localUid>`.
 *
 * @param {string} path
 * @returns {boolean}
 */
function identityBearingPath(path) {
  const match = path.match(/\.([^.[\]]+)(?:\[\d+\])?$/u);
  const field = match?.[1] || '';
  return /(?:id|ids|uid|uids|ref|refs|reference|references|hash|fingerprint)$/iu
    .test(field)
    || [
      'anchor',
      'anchors',
      'anchorKey',
      'mapAnchor',
      'sourceKey',
      'targetKey',
    ].includes(field);
}

/**
 * Visit primitive leaves without serializing arbitrary snapshots. The ancestor
 * set is path-local: repeated references in sibling branches remain visible,
 * while true cycles terminate safely.
 *
 * @param {unknown} root
 * @param {JsonVisitor} visitor
 * @param {string} [path]
 * @param {number} [depth]
 * @param {Set<object>} [ancestors]
 */
function walkJson(root, visitor, path = '$', depth = 0, ancestors = new Set()) {
  if (depth > MAX_WALK_DEPTH || root == null) return;
  if (typeof root !== 'object') {
    visitor(root, path);
    return;
  }
  if (ancestors.has(root)) return;
  ancestors.add(root);
  if (Array.isArray(root)) {
    root.forEach((entry, index) => walkJson(
      entry,
      visitor,
      `${path}[${index}]`,
      depth + 1,
      ancestors,
    ));
  } else {
    for (const [key, value] of Object.entries(root)) {
      walkJson(value, visitor, `${path}.${key}`, depth + 1, ancestors);
    }
  }
  ancestors.delete(root);
}

/**
 * @param {unknown} root
 * @param {ReadonlySet<string>} tokens
 * @returns {string[]}
 */
function exactMatches(root, tokens) {
  /** @type {string[]} */
  const paths = [];
  if (tokens.size === 0) return paths;
  walkJson(root, (value, path) => {
    if (
      identityBearingPath(path)
      && typeof value === 'string'
      && [...tokens].some(token => exactTokenInString(value, token))
    ) paths.push(path);
  });
  return paths.slice(0, MAX_RESULTS_PER_KIND);
}

/**
 * @param {unknown} root
 * @param {string} wanted
 * @returns {boolean}
 */
function containsNormalizedText(root, wanted) {
  if (!wanted) return false;
  let found = false;
  walkJson(root, value => {
    if (!found && typeof value === 'string' && normalized(value).includes(wanted)) {
      found = true;
    }
  });
  return found;
}

/**
 * Flatten the bounded display-label containers used by generated economy
 * projections. This intentionally is not the general JSON walker: legacy name
 * evidence should come only from known materialization surfaces.
 *
 * @param {unknown} value
 * @returns {unknown[]}
 */
function displayEntries(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(displayEntries);
  if (!value || typeof value !== 'object') return [];
  const item = plainRecord(value);
  if (typeof item.name === 'string' || typeof item.label === 'string') {
    return [item.name ?? item.label];
  }
  return Object.values(item).flatMap(displayEntries);
}

/**
 * @param {unknown} settlement
 * @param {DefinitionIdentity} identity
 * @returns {string[]}
 */
function legacyNameEvidence(settlement, identity) {
  if (!identity.name) return [];
  const wanted = normalized(identity.name);
  /** @type {string[]} */
  const evidence = [];
  /**
   * @param {string} kind
   * @param {unknown} value
   */
  const add = (kind, value) => {
    const candidate = typeof value === 'string'
      ? value
      : plainRecord(value).name;
    if (normalized(candidate) === wanted) evidence.push(kind);
  };

  const value = plainRecord(settlement);
  const config = plainRecord(value.config);
  for (const entry of Array.isArray(value.institutions) ? value.institutions : []) {
    add('institution-name', entry);
  }
  // Exact resource entities now live beside the compatibility label sidecar.
  // The generic identity walker handles their immutable ids; this branch
  // remains only for explicitly-labelled legacy name evidence.
  const customResources = Array.isArray(config.nearbyResourceDefinitions)
    ? config.nearbyResourceDefinitions
    : Array.isArray(config.nearbyResourcesCustom)
      ? config.nearbyResourcesCustom
      : Array.isArray(value.nearbyResourcesCustom)
        ? value.nearbyResourcesCustom
        : [];
  for (const entry of customResources) {
    add('custom-resource-name', entry);
  }
  for (const entries of Object.values(plainRecord(value.availableServices))) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) add('custom-service-name', entry);
  }
  for (const entry of Array.isArray(value.traditions) ? value.traditions : []) {
    add('tradition-name', entry);
  }
  const economy = plainRecord(value.economicState);
  for (const key of ['primaryExports', 'primaryImports', 'customTradeLabels']) {
    for (const entry of displayEntries(economy[key])) {
      add(`economy-${key}`, entry);
    }
  }
  return [...new Set(evidence)];
}

/** @param {unknown} save @returns {JsonRecord} */
function savedSettlementBody(save) {
  const record = plainRecord(save);
  return plainRecord(record.settlement ?? record.data ?? save);
}

/**
 * @param {unknown} save
 * @param {number} index
 * @returns {{id:string, name:string}}
 */
function savedSettlementLabel(save, index) {
  const record = plainRecord(save);
  const settlement = savedSettlementBody(save);
  return {
    id: text(record.id ?? settlement.id) || `settlement-${index + 1}`,
    name: text(record.name ?? settlement.name) || `Settlement ${index + 1}`,
  };
}

/**
 * @param {unknown} settlement
 * @param {DefinitionIdentity} identity
 * @returns {ActivationEvidence[]}
 */
function activationEvidence(settlement, identity) {
  const record = plainRecord(settlement);
  const wantedName = normalized(identity.name);
  const tokens = exactTokens(identity);
  /** @type {ActivationEvidence[]} */
  const hits = [];
  const traces = Array.isArray(record.simulationTrace)
    ? record.simulationTrace
    : [];

  traces.forEach((traceValue, index) => {
    const trace = plainRecord(traceValue);
    const causes = Array.isArray(trace.causes) ? trace.causes : [];
    const firstCause = plainRecord(causes[0]);
    const source = normalized(firstCause.source ?? trace.source);
    const exact = exactMatches(trace, tokens).length > 0;
    const byName = containsNormalizedText(trace, wantedName);
    if ((source === 'custom' || exact) && (exact || byName)) {
      hits.push({
        kind: 'simulation-trace',
        index,
        result: text(trace?.result) || null,
        confidence: exact ? 'exact' : 'legacy-name',
      });
    }
  });
  return hits.slice(0, MAX_RESULTS_PER_KIND);
}

/**
 * @param {unknown} campaign
 * @param {DefinitionIdentity} identity
 * @returns {HeraldEvidence[]}
 */
function heraldEvidence(campaign, identity) {
  if (!identity.name && !identity.localUid) return [];
  const record = plainRecord(campaign);
  const wizardNews = plainRecord(record.wizardNews);
  const tokens = exactTokens(identity);
  const wantedName = normalized(identity.name);
  /** @type {Array<{source:string, entry:unknown}>} */
  const candidates = [
    ...(Array.isArray(wizardNews.entries)
      ? wizardNews.entries.map((entry) => ({ source: 'Herald', entry }))
      : []),
    ...(Array.isArray(record.chronicles)
      ? record.chronicles.map((entry) => ({ source: 'Chronicle', entry }))
      : []),
  ];
  /** @type {HeraldEvidence[]} */
  const hits = [];
  for (const candidate of candidates) {
    const entry = plainRecord(candidate.entry);
    const exact = exactMatches(candidate.entry, tokens).length > 0;
    const byName = containsNormalizedText(candidate.entry, wantedName);
    if (!exact && !byName) continue;
    hits.push({
      source: candidate.source,
      id: text(entry.id) || null,
      headline: text(entry.headline ?? entry.title) || null,
      confidence: exact ? 'exact' : 'legacy-name',
    });
  }
  return hits.slice(0, MAX_RESULTS_PER_KIND);
}

/** @param {unknown} bucket @returns {string[]} */
function dependencyFields(bucket) {
  const category = getCustomContentCategory(bucket);
  if (!category) return [];
  return category.fields
    .map(field => field.key)
    .filter(field => DEPENDENCY_FIELD_KEYS.has(field));
}

/**
 * @param {unknown} value
 * @param {DefinitionIdentity} identity
 * @returns {boolean}
 */
function referencesIdentity(value, identity) {
  const tokens = exactTokens(identity);
  const values = Array.isArray(value) ? value : [value];
  return values.some((entry) => (
    typeof entry === 'string'
    && (tokens.has(entry) || entry === identity.refId)
  ));
}

/**
 * @param {unknown} customContent
 * @param {DefinitionIdentity} identity
 * @returns {DependentUsage[]}
 */
function dependentsOf(customContent, identity) {
  /** @type {DependentUsage[]} */
  const out = [];
  for (const [bucket, items] of Object.entries(plainRecord(customContent))) {
    if (!Array.isArray(items)) continue;
    const fields = dependencyFields(bucket);
    if (fields.length === 0) continue;
    items.forEach((itemValue) => {
      const item = plainRecord(itemValue);
      for (const field of fields) {
        if (!referencesIdentity(item[field], identity)) continue;
        out.push({
          bucket,
          localUid: text(item.localUid) || null,
          name: text(item.name) || 'Unnamed definition',
          field,
        });
      }
    });
  }
  return out.slice(0, MAX_RESULTS_PER_KIND);
}

/**
 * @param {DefinitionIdentity} identity
 * @returns {{
 *   bucket:string,
 *   category:string,
 *   tierMin:string|null,
 *   tierMax:string|null,
 *   activation:'conditional'|'always',
 * }}
 */
function eligibility(identity) {
  const category = getCustomContentCategory(identity.bucket);
  return {
    bucket: identity.bucket,
    category: category?.label || identity.bucket,
    tierMin: text(identity.item.tierMin) || null,
    tierMax: text(identity.item.tierMax) || null,
    activation: category?.fields.some(field => (
      field.effect === 'mechanical' && field.activation === 'conditional'
    ))
      ? 'conditional'
      : 'always',
  };
}

/**
 * @param {{
 *   bucket:string,
 *   item:unknown,
 *   customContent?:unknown,
 *   savedSettlements?:unknown[],
 *   campaigns?:unknown[],
 * }} input
 */
export function buildCustomContentUsage(input) {
  const identity = definitionIdentity(input);
  const tokens = exactTokens(identity);
  /** @type {SettlementUsage[]} */
  const settlements = [];
  /** @type {MapStructureUsage[]} */
  const mapStructures = [];
  /** @type {SettlementActivation[]} */
  const activations = [];

  (Array.isArray(input?.savedSettlements) ? input.savedSettlements : [])
    .forEach((save, index) => {
      const settlement = savedSettlementBody(save);
      const exactPaths = exactMatches(settlement, tokens);
      const legacyEvidence = exactPaths.length === 0
        ? legacyNameEvidence(settlement, identity)
        : [];
      if (exactPaths.length === 0 && legacyEvidence.length === 0) return;
      const label = savedSettlementLabel(save, index);
      const active = activationEvidence(settlement, identity);
      settlements.push({
        ...label,
        confidence: exactPaths.length > 0 ? 'exact' : 'legacy-name',
        evidence: exactPaths.length > 0 ? exactPaths : legacyEvidence,
        mechanicallyActive: active.length > 0,
      });
      activations.push(...active.map((entry) => ({ ...entry, settlementId: label.id })));
      exactPaths
        .filter((path) => (
          path.includes('townMap')
          || path.includes('placements')
          || path.includes('scene')
          || path.includes('buildings')
        ))
        .forEach((path) => mapStructures.push({
          settlementId: label.id,
          settlementName: label.name,
          path,
        }));
    });

  /** @type {CampaignHeraldEvidence[]} */
  const heraldMentions = [];
  /** @type {CampaignUsage[]} */
  const campaigns = [];
  (Array.isArray(input?.campaigns) ? input.campaigns : []).forEach((campaignValue, index) => {
    const campaign = plainRecord(campaignValue);
    const exactPaths = exactMatches(
      campaign.contentBinding ?? campaign.contentEnvironment ?? {},
      tokens,
    );
    const mentions = heraldEvidence(campaign, identity);
    if (exactPaths.length > 0 || mentions.length > 0) {
      campaigns.push({
        id: text(campaign?.id) || `campaign-${index + 1}`,
        name: text(campaign?.name) || `Campaign ${index + 1}`,
        bound: exactPaths.length > 0,
        mentionCount: mentions.length,
      });
    }
    heraldMentions.push(...mentions.map((entry) => ({
      ...entry,
      campaignId: text(campaign?.id) || `campaign-${index + 1}`,
    })));
  });

  const dependents = dependentsOf(input?.customContent, identity);
  return {
    definition: {
      bucket: identity.bucket,
      localUid: identity.localUid || null,
      definitionId: identity.definitionId || null,
      revisionId: identity.revisionId || null,
      contentHash: identity.contentHash || null,
      fingerprint: identity.fingerprint || null,
      name: identity.name || null,
    },
    eligibility: eligibility(identity),
    settlements,
    campaigns,
    dependents,
    mapStructures: mapStructures.slice(0, MAX_RESULTS_PER_KIND),
    heraldMentions: heraldMentions.slice(0, MAX_RESULTS_PER_KIND),
    activations: activations.slice(0, MAX_RESULTS_PER_KIND),
    counts: {
      settlements: settlements.length,
      campaigns: campaigns.length,
      dependents: dependents.length,
      mapStructures: mapStructures.length,
      heraldMentions: heraldMentions.length,
      activations: activations.length,
    },
  };
}
