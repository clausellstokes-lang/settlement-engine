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
export const getServicesForInstitution = (r, s, o = {}) => {
  const d = Object.keys(INSTITUTION_SERVICES),
    l = LOCALE_SERVICE_OVERRIDES[r.toLowerCase()];
  // Custom-content extension: any services declared via `produces` augment
  // (or, for unknown custom institutions, replace) the prebuilt service set.
  const _customServices = _customProducedServices(r, s, o);
  const _exactKey = d.find((k) => k.toLowerCase() === r.toLowerCase());
  let w = _exactKey || (l && INSTITUTION_SERVICES[l] ? l : null);
  if (!w) {
    const m = r
      .toLowerCase()
      .split(/[\s'(),/-]+/)
      .filter((C) => C.length > 2);
    let h = null,
      g = 0;
    for (const C of d) {
      const T = C.toLowerCase()
        .split(/[\s'(),/-]+/)
        .filter((v) => v.length > 2);
      let M = 0;
      for (const v of T)
        for (const j of m)
          j === v ? (M += 2) : ((v.length > 3 && j.startsWith(v)) || (j.length > 4 && v.startsWith(j))) && (M += 1);
      const A = M / (T.length * 2),
        S = h
          ? h
              .toLowerCase()
              .split(/[\s'(),/-]+/)
              .filter((v) => v.length > 2).length
          : 1,
        y = g / (S * 2);
      (M > g || (M === g && M > 0 && A > y)) && ((g = M), (h = C));
    }
    w = g > 0 ? h : null;
  }
  if (!w) {
    // No prebuilt service mapping, but custom institution may declare its own.
    return _customServices;
  }
  const p = INSTITUTION_SERVICES[w],
    b = SERVICE_TIER_CHANCE[s] || 0.5,
    k = [],
    f = Object.entries(p).sort((C, T) => T[1].p - C[1].p);
  if (
    (f.forEach(([C, T]) => {
      const M = `${r}_service_${C}`,
        A = `${w}_service_${C}`,
        S = o[M] ?? o[A],
        y = S !== void 0 ? S : T.on,
        v = typeof y == 'object' ? (y.allow ?? !0) : y,
        j = typeof y == 'object' ? (y.force ?? !1) : !1;
      if (!v && !j) return;
      const z = T.p * b;
      (j || T.p >= 1 || _rng() < z) &&
        (!T.requiredTradeRoute || (o._tradeRoute || '').includes(T.requiredTradeRoute)) &&
        k.push({
          name: C,
          ...T,
          institution: r,
          svcKey: w,
          forced: j,
        });
    }),
    k.length === 0)
  ) {
    const C = f.find(([T, M]) => {
      const A = `${r}_service_${T}`,
        S = `${w}_service_${T}`;
      return o[A] ?? o[S] ?? M.on;
    });
    C &&
      k.push({
        name: C[0],
        ...C[1],
        institution: r,
        svcKey: w,
      });
  }
  // Augment matched results with custom-declared produced services
  for (const cs of _customServices) {
    if (!k.some(x => x.name === cs.name)) k.push(cs);
  }
  return k;
};
