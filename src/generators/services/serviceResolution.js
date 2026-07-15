/**
 * services/serviceResolution.js
 * Per-institution service resolution — split out of servicesGenerator.js.
 *
 * Resolves which services a given institution provides (key-precedence match
 * against INSTITUTION_SERVICES, locale overrides, fuzzy token overlap, and
 * custom-content `produces` declarations) and the domain-priority tier
 * multiplier for a service. The seeded _rng() call sequence inside these
 * helpers is part of the generation determinism contract — preserved exactly.
 */

import { random as _rng } from '../rngContext.js';
import { getInstFlags, getPriorities, priorityToMultiplier } from '../helpers.js';
import { INSTITUTION_SERVICES } from '../../data/tradeGoodsData.js';
import { LOCALE_SERVICE_OVERRIDES } from '../../data/servicesData.js';
// Custom-content dependency surface — institution.produces declarations
import { customDeps as _customDeps } from '../../lib/dependencyEngine.js';
import { SERVICE_TIER_CHANCE } from './serviceTierData.js';

// Tags that denote a pure physical structure with no purchasable service of
// its own (a well, dwellings, farmland, a pasture, a sewer). `essential` is a
// criticality MODIFIER, not a service axis, so it is ignored when deciding
// whether an institution is purely structural.
const _STRUCTURAL_TAGS = new Set(['housing', 'water', 'agriculture', 'sanitation']);
const _STRUCTURAL_TAG_MODIFIERS = new Set(['essential']);

/**
 * True when an institution is a pure physical structure that should surface NO
 * services: it has no dedicated INSTITUTION_SERVICES map keyed to its exact
 * name AND every one of its (non-modifier) tags is structural. Such entries
 * would otherwise fall through to the fuzzy fallback and be forced to advertise
 * an unrelated service (a Water source offering "Lodging", a "Sewage system"
 * offering piped water). An entry that carries any service-bearing tag, or that
 * DOES have an exact service map (an Aqueduct, a Courthouse), is not structural
 * and resolves normally.
 *
 * @param {{ name?: string, tags?: string[] }} institution
 * @returns {boolean}
 */
export function isPureStructuralInstitution(institution) {
  const tags = Array.isArray(institution?.tags) ? institution.tags : [];
  const meaningful = tags
    .map((t) => String(t).toLowerCase())
    .filter((t) => !_STRUCTURAL_TAG_MODIFIERS.has(t));
  // No tags at all is not enough to call it structural — many service-bearing
  // civic entries carry an empty tag list; leave those to normal resolution.
  if (meaningful.length === 0) return false;
  if (!meaningful.every((t) => _STRUCTURAL_TAGS.has(t))) return false;
  // A dedicated exact service map wins over the structural classification.
  const name = String(institution?.name || '');
  const hasExactMap = Object.keys(INSTITUTION_SERVICES).some(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return !hasExactMap;
}

// getServiceTierInfo
export const getServiceTierInfo = (serviceName, institutionName, settlement = {}, institutions = []) => {
    getPriorities(settlement);
    const svc = (serviceName || '').toLowerCase(),
      inst = (institutionName || '').toLowerCase(),
      flags = getInstFlags(settlement, institutions);
    return svc.includes('patrol') ||
      svc.includes('escort') ||
      svc.includes('garrison') ||
      svc.includes('military') ||
      svc.includes('guard') ||
      svc.includes('training yard') ||
      svc.includes('company contract') ||
      svc.includes('specialist warrior') ||
      svc.includes('hired muscle') ||
      svc.includes('siege') ||
      svc.includes('scouting') ||
      inst.includes('garrison') ||
      inst.includes('mercenary')
      ? priorityToMultiplier(flags.militaryEffective)
      : svc.includes('religious') ||
          svc.includes('sanctuary') ||
          svc.includes('poor relief') ||
          svc.includes('prayer') ||
          svc.includes('ritual') ||
          svc.includes('spiritual') ||
          svc.includes('hospitality (pilgrim') ||
          svc.includes('safe passage letters') ||
          inst.includes('church') ||
          inst.includes('temple') ||
          inst.includes('cathedral') ||
          inst.includes('monastery') ||
          inst.includes('parish')
        ? priorityToMultiplier(flags.religionInfluence)
        : svc.includes('spell') ||
            svc.includes('magic') ||
            svc.includes('scroll') ||
            svc.includes('enchant') ||
            svc.includes('arcane') ||
            svc.includes('planar') ||
            svc.includes('identification') ||
            svc.includes('curse') ||
            svc.includes('divination') ||
            svc.includes('magical') ||
            svc.includes('cantrip') ||
            svc.includes('prophetic') ||
            svc.includes('dream') ||
            svc.includes('memory retrieval') ||
            inst.includes('wizard') ||
            inst.includes('mage') ||
            inst.includes('alchemist') ||
            inst.includes('enchant') ||
            inst.includes('hedge')
          ? priorityToMultiplier(flags.magicInfluence)
          : svc.includes('gambling') ||
              svc.includes('fence') ||
              svc.includes('unofficial') ||
              svc.includes('black market') ||
              svc.includes('smuggl') ||
              inst.includes('thieves') ||
              inst.includes('criminal') ||
              inst.includes('underground')
            ? priorityToMultiplier(flags.criminalEffective)
            : svc.includes('price') ||
                svc.includes('trade') ||
                svc.includes('market') ||
                svc.includes('guild') ||
                svc.includes('money') ||
                svc.includes('loan') ||
                svc.includes('deposit') ||
                svc.includes('credit') ||
                svc.includes('insurance') ||
                svc.includes('wealth') ||
                svc.includes('financing') ||
                svc.includes('banking') ||
                svc.includes('currency') ||
                svc.includes('apprenticeship') ||
                svc.includes('certification') ||
                svc.includes('arbitration') ||
                svc.includes('quality control') ||
                svc.includes('regulation') ||
                inst.includes('bank') ||
                inst.includes('guild') ||
                inst.includes('market') ||
                inst.includes('merchant')
              ? priorityToMultiplier(flags.economyOutput)
              : 1;
  };

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
export const getServicesForInstitution = (institutionName, tier, overrides = {}) => {
  const catalogKeys = Object.keys(INSTITUTION_SERVICES);
  const localeOverride = LOCALE_SERVICE_OVERRIDES[institutionName.toLowerCase()];
  // Custom-content extension: any services declared via `produces` augment
  // (or, for unknown custom institutions, replace) the prebuilt service set.
  const _customServices = _customProducedServices(institutionName, tier, overrides);
  const exactKey = catalogKeys.find((k) => k.toLowerCase() === institutionName.toLowerCase());
  let resolvedKey = exactKey || (localeOverride && INSTITUTION_SERVICES[localeOverride] ? localeOverride : null);
  // Last-resort fuzzy match: score each catalog key by shared name tokens (exact
  // token = 2, prefix overlap = 1), pick the highest raw score, tie-broken by the
  // higher per-token normalized score.
  if (!resolvedKey) {
    const nameTokens = institutionName
      .toLowerCase()
      .split(/[\s'(),/-]+/)
      .filter((tok) => tok.length > 2);
    let bestKey = null,
      bestScore = 0;
    for (const candidate of catalogKeys) {
      const candidateTokens = candidate.toLowerCase()
        .split(/[\s'(),/-]+/)
        .filter((tok) => tok.length > 2);
      let score = 0;
      for (const ct of candidateTokens)
        for (const nt of nameTokens)
          nt === ct ? (score += 2) : ((ct.length > 3 && nt.startsWith(ct)) || (nt.length > 4 && ct.startsWith(nt))) && (score += 1);
      const normScore = score / (candidateTokens.length * 2),
        bestTokenCount = bestKey
          ? bestKey
              .toLowerCase()
              .split(/[\s'(),/-]+/)
              .filter((tok) => tok.length > 2).length
          : 1,
        normBest = bestScore / (bestTokenCount * 2);
      (score > bestScore || (score === bestScore && score > 0 && normScore > normBest)) && ((bestScore = score), (bestKey = candidate));
    }
    // Confidence gate: a score of 1 is a lone PREFIX overlap (no shared whole
    // token) — the flimsiest possible signal, and empirically always a wrong
    // hit (a "Fishing community" landing on "Fish market", a "Caravanserai" on
    // "Caravan masters' exchange"). Require at least one full shared token
    // (score ≥ 2) before force-mapping an institution to a foreign service map;
    // below that, surface no services rather than an unrelated one.
    resolvedKey = bestScore >= 2 ? bestKey : null;
  }
  if (!resolvedKey) {
    // No prebuilt service mapping, but custom institution may declare its own.
    return _customServices;
  }
  const serviceMap = INSTITUTION_SERVICES[resolvedKey],
    tierChance = SERVICE_TIER_CHANCE[tier] || 0.5,
    services = [],
    sortedEntries = Object.entries(serviceMap).sort((a, b) => b[1].p - a[1].p);
  if (
    (sortedEntries.forEach(([serviceName, serviceDef]) => {
      const instToggleKey = `${institutionName}_service_${serviceName}`,
        keyToggleKey = `${resolvedKey}_service_${serviceName}`,
        toggleRaw = overrides[instToggleKey] ?? overrides[keyToggleKey],
        toggle = toggleRaw !== undefined ? toggleRaw : serviceDef.on,
        allow = typeof toggle == 'object' ? (toggle.allow ?? true) : toggle,
        force = typeof toggle == 'object' ? (toggle.force ?? false) : false;
      if (!allow && !force) return;
      const chance = serviceDef.p * tierChance;
      (force || serviceDef.p >= 1 || _rng() < chance) &&
        (!serviceDef.requiredTradeRoute || (overrides._tradeRoute || '').includes(serviceDef.requiredTradeRoute)) &&
        services.push({
          name: serviceName,
          ...serviceDef,
          institution: institutionName,
          svcKey: resolvedKey,
          forced: force,
        });
    }),
    services.length === 0)
  ) {
    // Nothing rolled on: force at least one service (the highest-probability one
    // whose toggle allows it) so a live institution never renders serviceless.
    const fallbackEntry = sortedEntries.find(([serviceName, serviceDef]) => {
      const instToggleKey = `${institutionName}_service_${serviceName}`,
        keyToggleKey = `${resolvedKey}_service_${serviceName}`;
      return overrides[instToggleKey] ?? overrides[keyToggleKey] ?? serviceDef.on;
    });
    fallbackEntry &&
      services.push({
        name: fallbackEntry[0],
        ...fallbackEntry[1],
        institution: institutionName,
        svcKey: resolvedKey,
      });
  }
  // Augment matched results with custom-declared produced services
  for (const cs of _customServices) {
    if (!services.some(x => x.name === cs.name)) services.push(cs);
  }
  return services;
};
