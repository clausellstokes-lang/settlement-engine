import { random as _rng } from '../../kernel/rngContext.js';
import { INSTITUTION_SERVICES } from '../../data/tradeGoodsData.js';
import { LOCALE_SERVICE_OVERRIDES } from '../../data/servicesData.js';
// Custom-content dependency surface — institution.produces declarations.
import { customDeps as _customDeps } from '../../lib/dependencyEngine.js';
import {
  projectCustomDefinitionIdentity,
} from '../../domain/content/customDefinitionIdentityProjection.js';
import { passesTierGate } from '../../domain/customContentSchema.js';
import {
  isMaterializedCustomContent,
} from '../../domain/content/customContentSemanticAuthority.js';

/**
 * institutionServices.js — resolve an institution to the concrete list of
 * services it offers, applying tier-scaled probability rolls, toggle overrides
 * (allow/force), required-trade-route gates, and custom-content `produces`.
 *
 * Split out of servicesGenerator.js (F31). SERVICE_TIER_CHANCE and
 * _customProducedServices are module-private; only getServicesForInstitution
 * is consumed by the orchestrator.
 */
// SERVICE_TIER_CHANCE — base probability modifier per settlement tier
const SERVICE_TIER_CHANCE = { thorp: 0.25, hamlet: 0.35, village: 0.5, town: 0.65, city: 0.8, metropolis: 0.95 };

/**
 * Build a synthetic services array from a custom institution's `produces`
 * references. Each declared service or trade-good output becomes a service
 * entry with a tier-scaled probability roll. Returns [] if the institution is
 * not custom or has no `produces` declarations.
 */
function _customProducedServices(institution, tier, opts = {}) {
  const institutionName = typeof institution === 'string'
    ? institution
    : String(institution?.name || '');
  const produced = _customDeps.contentProducedBy(institution, tier);
  if (!produced.length) return [];
  const tierChance = SERVICE_TIER_CHANCE[tier] || 0.5;
  const out = [];
  for (const producedEntry of produced) {
    const producedName = producedEntry.name;
    // `settType` can still be the random/custom sentinel when the store builds
    // its coarse eligible library. Re-check the resolved generator tier here
    // so a present institution cannot smuggle a city-only service into a
    // hamlet through its `produces` relationship.
    if (
      producedEntry.source === 'custom'
      && !passesTierGate(producedEntry.raw || {}, tier)
    ) continue;
    const target = producedEntry.raw || {};
    const activationRef = producedEntry.category === 'services'
      ? target.providedBy
      : producedEntry.category === 'tradeGoods'
        ? target.requiredInstitution
        : null;
    if (
      activationRef
      && !_customDeps.institutionRequirementIsPresent(
        activationRef,
        [institution],
        tier,
      )
    ) continue;
    const overrideKey = `${institutionName}_service_${producedName}`;
    const allow = opts[overrideKey];
    const enabled = allow !== undefined ? allow : true;
    if (!enabled) continue;
    // Custom-declared production fires more reliably than a random match.
    if (_rng() < Math.max(0.6, tierChance)) {
      out.push({
        name: producedName,
        desc: `${institutionName} produces ${producedName}`,
        p: 0.7,
        institution: institutionName,
        svcKey: institutionName,
        category: target.category,
        custom: true,
        source: 'custom',
        // Internal compatibility address used only while the service
        // orchestrator deduplicates exact projections. The persisted entity
        // receives `localUid` below and never exposes this private key.
        _customServiceLocalUid: target.localUid || producedEntry.refId,
        ...(producedEntry.source === 'custom'
          ? {
              customDefinitionCategory: producedEntry.category,
              ...projectCustomDefinitionIdentity(producedEntry.raw),
            }
          : {}),
      });
    }
  }
  return out;
}

// getServicesForInstitution
// Key resolution precedence: a dedicated INSTITUTION_SERVICES entry (exact
// name, case-insensitive) always wins; LOCALE_SERVICE_OVERRIDES only redirects
// institutions with NO dedicated entry; the token-overlap fuzzy match is the
// last resort. All paths share one roll block so toggle objects (allow/force),
// guaranteed p>=1 services, and requiredTradeRoute gates apply uniformly
// regardless of how the key was resolved.
export const getServicesForInstitution = (
  institution,
  tier,
  overrides = {},
) => {
  const instName = typeof institution === 'string'
    ? institution
    : String(institution?.name || '');
  const serviceCatalogKeys = Object.keys(INSTITUTION_SERVICES),
    localeKey = LOCALE_SERVICE_OVERRIDES[instName.toLowerCase()];
  // Custom-content extension: any services declared via `produces` augment
  // (or, for unknown custom institutions, replace) the prebuilt service set.
  const _customServices = _customProducedServices(
    institution,
    tier,
    overrides,
  );
  // A current custom institution has an explicit dependency vocabulary.
  // Never let its presentation label fuzzy-match a native service catalog
  // entry; authored `produces` is its sole service authority. Unstamped legacy
  // string callers retain the historical compatibility matcher below.
  if (isMaterializedCustomContent(institution)) return _customServices;
  const _exactKey = serviceCatalogKeys.find((k) => k.toLowerCase() === instName.toLowerCase());
  let resolvedKey = _exactKey || (localeKey && INSTITUTION_SERVICES[localeKey] ? localeKey : null);
  if (!resolvedKey) {
    const queryTokens = instName
      .toLowerCase()
      .split(/[\s'(),/-]+/)
      .filter((token) => token.length > 2);
    let bestKey = null,
      bestScore = 0;
    for (const candidateKey of serviceCatalogKeys) {
      const candidateTokens = candidateKey
        .toLowerCase()
        .split(/[\s'(),/-]+/)
        .filter((token) => token.length > 2);
      let score = 0;
      for (const candidateToken of candidateTokens)
        for (const queryToken of queryTokens)
          queryToken === candidateToken
            ? (score += 2)
            : ((candidateToken.length > 3 && queryToken.startsWith(candidateToken)) ||
                (queryToken.length > 4 && candidateToken.startsWith(queryToken))) &&
              (score += 1);
      const candidateCoverage = score / (candidateTokens.length * 2),
        bestKeyTokenCount = bestKey
          ? bestKey
              .toLowerCase()
              .split(/[\s'(),/-]+/)
              .filter((token) => token.length > 2).length
          : 1,
        bestCoverage = bestScore / (bestKeyTokenCount * 2);
      (score > bestScore || (score === bestScore && score > 0 && candidateCoverage > bestCoverage)) &&
        ((bestScore = score), (bestKey = candidateKey));
    }
    resolvedKey = bestScore > 0 ? bestKey : null;
  }
  if (!resolvedKey) {
    // No prebuilt service mapping, but custom institution may declare its own.
    return _customServices;
  }
  const serviceDefs = INSTITUTION_SERVICES[resolvedKey],
    tierChance = SERVICE_TIER_CHANCE[tier] || 0.5,
    results = [],
    sortedServices = Object.entries(serviceDefs).sort((a, b) => b[1].p - a[1].p);
  if (
    (sortedServices.forEach(([svcName, def]) => {
      const overrideKeyByName = `${instName}_service_${svcName}`,
        overrideKeyByResolved = `${resolvedKey}_service_${svcName}`,
        override = overrides[overrideKeyByName] ?? overrides[overrideKeyByResolved],
        toggle = override !== undefined ? override : def.on,
        allow = typeof toggle == 'object' ? (toggle.allow ?? true) : toggle,
        force = typeof toggle == 'object' ? (toggle.force ?? false) : false;
      if (!allow && !force) return;
      const rollThreshold = def.p * tierChance;
      (force || def.p >= 1 || _rng() < rollThreshold) &&
        (!def.requiredTradeRoute || (overrides._tradeRoute || '').includes(def.requiredTradeRoute)) &&
        results.push({
          name: svcName,
          ...def,
          institution: instName,
          svcKey: resolvedKey,
          forced: force,
        });
    }),
    results.length === 0)
  ) {
    const fallbackEntry = sortedServices.find(([svcName, def]) => {
      const overrideKeyByName = `${instName}_service_${svcName}`,
        overrideKeyByResolved = `${resolvedKey}_service_${svcName}`;
      return overrides[overrideKeyByName] ?? overrides[overrideKeyByResolved] ?? def.on;
    });
    fallbackEntry &&
      results.push({
        name: fallbackEntry[0],
        ...fallbackEntry[1],
        institution: instName,
        svcKey: resolvedKey,
      });
  }
  // A display label is never an identity join. A native catalog service and an
  // authored service with the same name are two real entities, as are two
  // authored definitions that intentionally share a name. The orchestrator
  // deduplicates repeated projections by immutable definition identity.
  results.push(..._customServices);
  return results;
};
