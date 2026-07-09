import { random as _rng } from '../../kernel/rngContext.js';
import { INSTITUTION_SERVICES } from '../../data/tradeGoodsData.js';
import { LOCALE_SERVICE_OVERRIDES } from '../../data/servicesData.js';
// Custom-content dependency surface — institution.produces declarations.
import { customDeps as _customDeps } from '../../lib/dependencyEngine.js';

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
 * refIds. Each produced trade-good NAME becomes a service entry with a
 * tier-scaled probability roll. Returns [] if the institution is not a
 * custom one or has no `produces` declarations.
 */
function _customProducedServices(institutionName, tier, opts = {}) {
  const produced = _customDeps.servicesProducedBy(institutionName);
  if (!produced.length) return [];
  const tierChance = SERVICE_TIER_CHANCE[tier] || 0.5;
  const out = [];
  for (const goodName of produced) {
    const overrideKey = `${institutionName}_service_${goodName}`;
    const allow = opts[overrideKey];
    const enabled = allow !== undefined ? allow : true;
    if (!enabled) continue;
    // Custom-declared production fires more reliably than a random match.
    if (_rng() < Math.max(0.6, tierChance)) {
      out.push({
        name: goodName,
        desc: `${institutionName} produces ${goodName}`,
        p: 0.7,
        institution: institutionName,
        svcKey: institutionName,
        custom: true,
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
export const getServicesForInstitution = (instName, tier, overrides = {}) => {
  const serviceCatalogKeys = Object.keys(INSTITUTION_SERVICES),
    localeKey = LOCALE_SERVICE_OVERRIDES[instName.toLowerCase()];
  // Custom-content extension: any services declared via `produces` augment
  // (or, for unknown custom institutions, replace) the prebuilt service set.
  const _customServices = _customProducedServices(instName, tier, overrides);
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
  // Augment matched results with custom-declared produced services
  for (const cs of _customServices) {
    if (!results.some((existing) => existing.name === cs.name)) results.push(cs);
  }
  return results;
};
