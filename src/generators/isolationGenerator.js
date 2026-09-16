/**
 * isolationGenerator.js
 *
 * Isolated settlements are evaluated through an explainable support model.
 * Local food, hinterland production, reserves, seasonal access, and patronage
 * are considered first. Functional high magic may close a remaining gap, but
 * teleportation is no longer fabricated merely because the tier says "town".
 */

import { ARCANE_INST_KW as _ARCANE_KW } from '../domain/magicFilter.js';
import { buildStressEntry } from './stressGenerator.js';
import { STRESS_TYPE_MAP } from '../data/stressTypes.js';
import {
  nativeSemanticName,
} from '../domain/content/customContentSemanticAuthority.js';
import {
  isProtectedGenerationEntity,
} from '../domain/generationOwnership.js';
import {
  deriveIsolationSupport,
  shouldAddMagicalSubstitution,
} from './isolationSupport.js';
import { TIER_ORDER } from '../data/constants.js';

const MAINTAINER_DESC = {
  town:       'A hedge wizard maintains the settlement\'s load-bearing magical transit. Local production and irregular tracks carry part of the burden, but the support plan falls short without their work.',
  city:       'A resident wizard maintains the settlement\'s load-bearing magical transit. Their role is civic, not merely commercial, because the city falls below its support requirement without it.',
  metropolis: 'A tower of wizards maintains the settlement\'s load-bearing magical transit. Local systems carry much of the burden, but they cannot support the whole metropolis alone.',
};

// ─── 1. Evaluate support; add magical substitution only for a real gap ────────
export function applyTeleportationInfrastructure(
  institutions, tier, tradeRoute, effectiveConfig, catalogForTier, TOWN_PLUS_TIERS, _chance
) {
  let support = deriveIsolationSupport({
    tier,
    tradeRoute,
    institutions,
    config: effectiveConfig,
  });
  effectiveConfig._isolationSupport = support;
  delete effectiveConfig._magicTradeOnly;
  delete effectiveConfig._isolationInfraType;

  if (
    !TOWN_PLUS_TIERS.includes(tier)
    || tradeRoute !== 'isolated'
    || !shouldAddMagicalSubstitution(support, effectiveConfig)
  ) {
    return support;
  }

  const magicPriority = effectiveConfig.priorityMagic ?? 50;
  // Airship infrastructure is a metropolis-scale institution. Cities and
  // towns use a circle even at very high magic; bypassing the catalog's
  // min-tier gate here used to create an airship dock that the final validator
  // correctly rejected.
  const preferAirship = magicPriority >= 80 && tier === 'metropolis';

  // ── 1a. Force primary trade infrastructure ────────────────────────────────
  const hasTeleport = institutions.some(i =>
    /teleportation circle|airship/i.test(nativeSemanticName(i))
  );

  if (!hasTeleport) {
    const allMagic = { ...(catalogForTier?.Magic || {}), ...(catalogForTier?.Exotic || {}) };
    const tierIndex = TIER_ORDER.indexOf(tier);
    const eligibleTransit = Object.entries(allMagic).filter(([, definition]) => (
      !definition?.minTier
      || tierIndex >= TIER_ORDER.indexOf(definition.minTier)
    ));
    const infraEntry = preferAirship
      ? (eligibleTransit.find(([name]) => /airship/i.test(name))
         || eligibleTransit.find(([name]) => /teleportation circle/i.test(name)))
      : (eligibleTransit.find(([name]) => /teleportation circle/i.test(name))
         || eligibleTransit.find(([name]) => /airship/i.test(name)));

    if (infraEntry) {
      const [infraName, infraDef] = infraEntry;
      institutions.push({
        name: infraName, category: 'Magic',
        desc: infraDef.desc || `${infraName} provides load-bearing capacity where physical access is unreliable.`,
        tags: infraDef.tags || ['arcane', 'planar'],
        forcedByIsolation: true, source: 'forced',
      });
    } else {
      institutions.push({
        name: 'Teleportation circle', category: 'Magic',
        desc: 'A permanent teleportation circle provides load-bearing capacity where physical access is unreliable. Local production and irregular routes still contribute, but cannot carry the settlement alone.',
        tags: ['arcane', 'planar'], forcedByIsolation: true, source: 'forced',
      });
    }
  }

  // ── 1b. Force arcane maintainer ───────────────────────────────────────────
  const hasMaintainer = institutions.some(i =>
    /wizard|mage|hedge wizard|alchemist|academy/i.test(
      nativeSemanticName(i),
    )
  );

  if (!hasMaintainer) {
    const magicCat = catalogForTier?.Magic || {};
    // Prefer hedge wizard (self-sufficient). Skip anything with forbiddenTradeRoutes:["isolated"].
    const maintainerEntry =
      Object.entries(magicCat).find(([n, def]) =>
        /hedge/i.test(n) && !(def.forbiddenTradeRoutes || []).includes('isolated')
      ) ||
      Object.entries(magicCat).find(([n, def]) =>
        /wizard|mage/i.test(n) && !(def.forbiddenTradeRoutes || []).includes('isolated')
      );

    if (maintainerEntry) {
      const [mName, mDef] = maintainerEntry;
      institutions.push({
        name: mName, category: 'Magic',
        desc: mDef.desc || MAINTAINER_DESC[tier] || MAINTAINER_DESC.town,
        tags: mDef.tags || ['arcane'],
        forcedByIsolation: true, source: 'forced',
      });
    } else {
      institutions.push({
        name: 'Hedge wizard', category: 'Magic',
        desc: MAINTAINER_DESC[tier] || MAINTAINER_DESC.town,
        tags: ['arcane'], forcedByIsolation: true, source: 'forced',
      });
    }
  }

  // ── 1c. Re-evaluate and flag downstream systems ───────────────────────────
  // Persist the whole receipt, not merely a boolean. A magical path can be
  // redundant (mundane support is now enough after another rule adds capacity)
  // or truly load-bearing; only the latter earns _magicTradeOnly.
  support = deriveIsolationSupport({
    tier,
    tradeRoute,
    institutions,
    config: effectiveConfig,
  });
  effectiveConfig._isolationSupport = support;
  effectiveConfig._magicTradeOnly = support.magicDependent === true;
  return support;
}

// ─── 2. Subsistence mode (isolated thorp/hamlet) ──────────────────────────────
//
// Returns the (possibly new) stress container. When the famine roll fires it
// APPENDS a real famine entry to the container — the single channel every other
// stressor rides — instead of poking effectiveConfig.stressTypes. The old poke
// pushed 'famine' into the economics channel WITHOUT a container entry, so
// stressConfirmPass (which iterates the container) never re-weighed it and the
// settlement got famine ECONOMICS with no stress entry, no Active Crisis card,
// and no activeCondition — an invisible starvation. Routing it through the
// container makes stressConfirmPass re-weigh it against granaries like every
// other stressor, and assembleSettlement promotes it to an activeCondition.
export function applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chance, stress) {
  const SUBSISTENCE_TIERS = ['thorp', 'hamlet'];
  if (!SUBSISTENCE_TIERS.includes(tier) || tradeRoute !== 'isolated') return stress;

  const TRADE_TAGS = ['trade', 'market', 'guild', 'banking', 'luxury', 'port',
                      'transport', 'shipping', 'export', 'import', 'caravan',
                      'entertainment', 'planar', 'arcane', 'adventuring'];
  const TRADE_NAME_KEYWORDS = ['market', 'guild', 'inn', 'tavern', 'merchant',
                                'trader', 'caravan', 'banker', 'craftsman',
                                'blacksmith', 'smith', 'tanner', 'weaver',
                                'cooper', 'wheelwright', 'chandler', 'potter',
                                'jeweller', 'fletcher', 'bowyer', 'apothecary'];

  const isTradeInst = (inst) => {
    if (isProtectedGenerationEntity(inst)) return false;
    const tags = inst.tags || [];
    const name = (inst.name || '').toLowerCase();
    if (tags.some(t => TRADE_TAGS.includes(t))) return true;
    if (TRADE_NAME_KEYWORDS.some(kw => name.includes(kw))) return true;
    const keepTags = ['essential', 'water', 'housing', 'agriculture', 'food',
                      'religious', 'civic', 'infrastructure', 'criminal'];
    return !tags.some(t => keepTags.includes(t));
  };

  for (let i = institutions.length - 1; i >= 0; i--) {
    if (isTradeInst(institutions[i])) institutions.splice(i, 1);
  }

  // Isolated subsistence settlements risk famine. Build it as a REAL stress
  // entry and append it to the container so the downstream stressConfirmPass
  // weighs it against the roster (granaries/food institutions suppress it) like
  // every other emergent stressor, and assembleSettlement re-renders its summary
  // with the real name + promotes it to an activeCondition. The chance() draw
  // stays the FIRST operand (its rng position is unchanged vs the old poke), and
  // buildStressEntry draws no rng for famine (only 'wartime' consults the stream),
  // so the pipeline's downstream rng is byte-identical.
  const entries = Array.isArray(stress) ? stress : stress ? [stress] : [];
  const hasFamine = entries.some((e) => e?.type === 'famine');
  if (chance(0.35) && !hasFamine) {
    return [...entries, buildStressEntry('', 'famine', STRESS_TYPE_MAP.famine)];
  }
  return stress;
}

// ─── 2b. Planar institutions require a teleportation circle ───────────────────
// Planar traders and the Planar embassy exist BECAUSE goods and envoys arrive
// through a permanent circle; without one there is no channel for extraplanar
// commerce or contact. Removal-based enforcement (the GATE_FEATURES validator
// entry only reports). DM contract institutions (required/forced/custom) are
// spared — the validator flags those instead of deleting them.
export function cullPlanarWithoutCircle(institutions) {
  const hasCircle = institutions.some(
    (inst) => nativeSemanticName(inst)
      .toLowerCase()
      .includes('teleportation circle')
  );
  if (hasCircle) return [];
  const removed = [];
  for (let i = institutions.length - 1; i >= 0; i--) {
    const inst = institutions[i];
    const n = (inst.name || '').toLowerCase();
    if (!n.includes('planar trader') && !n.includes('planar embassy')) continue;
    if (isProtectedGenerationEntity(inst) || inst.forcedByIsolation) continue;
    removed.push(inst.name);
    institutions.splice(i, 1);
  }
  return removed;
}

// ─── 3. Safety-net arcane strip (magicExists===false) ─────────────────────────
export function stripArcaneInstitutions(institutions, effectiveConfig) {
  if (effectiveConfig.magicExists === false) {
    const ARCANE_TAGS = _ARCANE_KW;
    const ARCANE_KW   = _ARCANE_KW;
    for (let _i = institutions.length - 1; _i >= 0; _i--) {
      const _inst = institutions[_i];
      if (
        isProtectedGenerationEntity(_inst)
        || _inst.forcedByIsolation
      ) continue;
      const _n = nativeSemanticName(_inst).toLowerCase();
      const _cat = _inst.category || '';
      const _tags = _inst.tags || [];
      const _isArcane = _cat === 'Magic'
        || _tags.some(t => t && ARCANE_TAGS.includes(t))
        || ARCANE_KW.some(kw => _n.includes(kw));
      if (_isArcane) institutions.splice(_i, 1);
    }
  }
}
