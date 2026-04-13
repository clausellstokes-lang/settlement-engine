/**
 * isolationGenerator.js
 * Design principle: ANY isolated town+ MUST have magical trade infrastructure.
 * Magic priority affects WHICH infrastructure and how capable the maintainer is
 * but the infrastructure itself is always mandatory.
 */

import { ARCANE_INST_KW as _ARCANE_KW } from '../components/magicFilter.js';

const MAINTAINER_DESC = {
  town:       'A hedge wizard maintains the teleportation circle — the settlement\'s only trade lifeline. Without them, the circle fails.',
  city:       'A resident wizard maintains the teleportation infrastructure. Their role is civic, not merely commercial.',
  metropolis: 'A tower of wizards maintains the teleportation circle. As critical to the settlement as a harbour master\'s office is to a port.',
};

// ─── 1. Force magic infrastructure for ANY isolated town+ ─────────────────────
export function applyTeleportationInfrastructure(
  institutions, tier, tradeRoute, effectiveConfig, catalogForTier, TOWN_PLUS_TIERS, chance
) {
  if (!TOWN_PLUS_TIERS.includes(tier) || tradeRoute !== 'isolated') return;

  const magicPriority = effectiveConfig.priorityMagic || 50;
  // Airship preferred at very high magic for city/metropolis; circle for town or lower magic
  const preferAirship = magicPriority >= 80 && ['city', 'metropolis'].includes(tier);

  // ── 1a. Force primary trade infrastructure ────────────────────────────────
  const hasTeleport = institutions.some(i =>
    /teleportation circle|airship/i.test(i.name)
  );

  if (!hasTeleport) {
    const allMagic = { ...(catalogForTier?.Magic || {}), ...(catalogForTier?.Exotic || {}) };
    const infraEntry = preferAirship
      ? (Object.entries(allMagic).find(([n]) => /airship/i.test(n))
         || Object.entries(allMagic).find(([n]) => /teleportation circle/i.test(n)))
      : (Object.entries(allMagic).find(([n]) => /teleportation circle/i.test(n))
         || Object.entries(allMagic).find(([n]) => /airship/i.test(n)));

    if (infraEntry) {
      const [infraName, infraDef] = infraEntry;
      institutions.push({
        name: infraName, category: 'Magic',
        desc: infraDef.desc || `${infraName} — the settlement's only connection to the outside world.`,
        tags: infraDef.tags || ['arcane', 'planar'],
        forcedByIsolation: true, source: 'forced',
      });
    } else {
      institutions.push({
        name: 'Teleportation circle', category: 'Magic',
        desc: "A permanent teleportation circle is this settlement's only connection to the outside world. All trade, supplies, and communication flow through it. If it fails, the settlement dies.",
        tags: ['arcane', 'planar'], forcedByIsolation: true, source: 'forced',
      });
    }
  }

  // ── 1b. Force arcane maintainer ───────────────────────────────────────────
  const hasMaintainer = institutions.some(i =>
    /wizard|mage|hedge wizard|alchemist|academy/i.test(i.name)
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

  // ── 1c. Flag downstream systems ───────────────────────────────────────────
  effectiveConfig._magicTradeOnly = true;
  effectiveConfig._isolationInfraType = preferAirship ? 'airship' : 'teleportation';
}

// ─── 2. Subsistence mode (isolated thorp/hamlet) ──────────────────────────────
export function applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chance) {
  const SUBSISTENCE_TIERS = ['thorp', 'hamlet'];
  if (!SUBSISTENCE_TIERS.includes(tier) || tradeRoute !== 'isolated') return;

  const TRADE_TAGS = ['trade', 'market', 'guild', 'banking', 'luxury', 'port',
                      'transport', 'shipping', 'export', 'import', 'caravan',
                      'entertainment', 'planar', 'arcane', 'adventuring'];
  const TRADE_NAME_KEYWORDS = ['market', 'guild', 'inn', 'tavern', 'merchant',
                                'trader', 'caravan', 'banker', 'craftsman',
                                'blacksmith', 'smith', 'tanner', 'weaver',
                                'cooper', 'wheelwright', 'chandler', 'potter',
                                'jeweller', 'fletcher', 'bowyer', 'apothecary'];

  const isTradeInst = (inst) => {
    if (inst.required || inst.source === 'forced') return false;
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

  if (chance(0.35) && !effectiveConfig.stressTypes?.includes('famine')) {
    institutions._isolationFoodStress = true;
  }
}

// ─── 3. Safety-net arcane strip (magicExists===false) ─────────────────────────
export function stripArcaneInstitutions(institutions, effectiveConfig) {
  if (effectiveConfig.magicExists === false) {
    const ARCANE_TAGS = _ARCANE_KW;
    const ARCANE_KW   = _ARCANE_KW;
    for (let _i = institutions.length - 1; _i >= 0; _i--) {
      const _inst = institutions[_i];
      if (_inst.source === 'forced' || _inst.forcedByIsolation) continue;
      const _n = (_inst.name || '').toLowerCase();
      const _cat = _inst.category || '';
      const _tags = _inst.tags || [];
      const _isArcane = _cat === 'Magic'
        || _tags.some(t => t && ARCANE_TAGS.includes(t))
        || ARCANE_KW.some(kw => _n.includes(kw));
      if (_isArcane) institutions.splice(_i, 1);
    }
  }
}
