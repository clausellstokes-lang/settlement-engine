import { RESOURCE_DATA } from '../../data/resourceData.js';

const RENEWABLE_PATTERNS = [
  /fish|fishing|river_fish/,
  /forest|timber|wood|grove/,
  /forag|herb|honey|hunting/,
  /grain|field|floodplain|grazing|pasture|livestock|camel|date/,
  /spring|water|oasis|marsh/,
];

const NONRENEWABLE_PATTERNS = [
  // ore/coal carry a leading \b so they match the standalone minerals ("iron ore",
  // "coal") and not the renewable words that contain them as a substring: "forest"
  // and "shore" (ore), "charcoal" (coal). Unanchored, those flag woodland as exhaustible.
  /iron|\bore|deposit|vein|metal|\bcoal|peat|quarry|stone|gem|crystal|salt|sand|clay|glass/,
  /ruin|artefact|artifact|relic/,
];

// \bley\b matches the standalone "ley" of a ley line, never the "ley" inside
// "barley" — the substring that used to mis-flag grain fields as magical.
const MAGICAL_PATTERNS = [/magic|arcane|\bley\b|planar/];

/** @param {any} resource */
function textFor(resource) {
  const key = String(resource || '').toLowerCase();
  const spec = /** @type {Record<string, any>} */ (RESOURCE_DATA)[key] || {};
  return [
    key,
    spec.label,
    spec.desc,
    spec.category,
    ...(spec.commodities || []),
    ...(spec.tradeGoods || []),
  ].filter(Boolean).join(' ').toLowerCase();
}

/** @param {import('../settlement.schema.js').SimSettlement} settlement */
function magicLevelScore(settlement = {}) {
  const level = String(settlement?.config?.magicLevel || settlement?.magicLevel || '').toLowerCase();
  if (level === 'pervasive') return 4;
  if (level === 'high') return 3;
  if (level === 'common') return 2;
  if (level === 'moderate') return 1;
  return 0;
}

/** @param {any} resource */
export function classifyResource(resource) {
  const key = String(resource || '').toLowerCase();
  const spec = /** @type {Record<string, any>} */ (RESOURCE_DATA)[key] || {};
  const text = textFor(resource);
  const magical = MAGICAL_PATTERNS.some(pattern => pattern.test(text));
  const nonrenewable = NONRENEWABLE_PATTERNS.some(pattern => pattern.test(text));
  // Subterranean bodies are mined mineral seams — inherently exhaustible. An
  // incidental renewable token in their trade goods (coal_deposits ships 'timber')
  // must not flip them to natural recovery, or a finite seam would regrow. For the
  // underground class, category wins over keyword.
  const renewable = spec.category !== 'subterranean'
    && RENEWABLE_PATTERNS.some(pattern => pattern.test(text));

  if (magical) {
    return {
      key,
      kind: 'magical',
      renewability: 'conditional',
      recoveryMode: 'requires_high_magic',
      label: spec.label || String(resource || '').replace(/_/g, ' '),
    };
  }
  if (nonrenewable && !renewable) {
    return {
      key,
      kind: spec.category === 'special' ? 'strategic' : 'nonrenewable',
      renewability: 'exhaustible',
      recoveryMode: 'manual',
      label: spec.label || String(resource || '').replace(/_/g, ' '),
    };
  }
  if (spec.category === 'special' && !renewable) {
    return {
      key,
      kind: 'strategic',
      renewability: 'limited',
      recoveryMode: 'manual',
      label: spec.label || String(resource || '').replace(/_/g, ' '),
    };
  }
  return {
    key,
    kind: spec.category === 'land' || spec.category === 'water' ? 'managed' : 'renewable',
    renewability: 'renewable',
    recoveryMode: 'natural',
    label: spec.label || String(resource || '').replace(/_/g, ' '),
  };
}

/**
 * @param {any} resource
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} [context]
 */
export function canRecoverResource(resource, settlement, context = {}) {
  const taxonomy = classifyResource(resource);
  if (context.forceRecovery) return { canRecover: true, taxonomy, reason: 'Recovery was explicitly forced.' };
  if (taxonomy.recoveryMode === 'natural') {
    return { canRecover: true, taxonomy, reason: 'Renewable or managed resource can recover when pressure drops.' };
  }
  if (taxonomy.recoveryMode === 'requires_high_magic') {
    const canRecover = magicLevelScore(settlement) >= 3 || context.magicRecovery === true;
    return {
      canRecover,
      taxonomy,
      reason: canRecover
        ? 'High magic can re-stabilize this magical resource.'
        : 'Magical resource recovery requires high or pervasive magic.',
    };
  }
  // E4-2b: exhaustible / strategic resources ('manual' recoveryMode) have no
  // natural regrowth — but a sustained calm (quietRecovery) lets prospecting
  // reopen seams and trade substitution slowly restore access. This is the
  // bounded, event-gated path that keeps a peaceful settlement's exhaustibles
  // from ratcheting to permanent depletion; the caller damps its probability
  // so it stays slow. A resource under real pressure never reaches here.
  if (context.quietRecovery) {
    return {
      canRecover: true,
      taxonomy,
      reason: 'A long quiet spell lets prospecting, reopened seams, or trade substitution slowly restore this exhaustible resource.',
    };
  }
  return {
    canRecover: false,
    taxonomy,
    reason: 'Exhaustible or strategic resources require manual recovery or a specific event.',
  };
}
