import { RESOURCE_DATA } from '../../data/resourceData.js';

const RENEWABLE_PATTERNS = [
  /fish|fishing|river_fish/,
  /forest|timber|wood|grove/,
  /forag|herb|honey|hunting/,
  /grain|field|floodplain|grazing|pasture|livestock|camel|date/,
  /spring|water|oasis|marsh/,
];

const NONRENEWABLE_PATTERNS = [
  /iron|ore|deposit|vein|metal|coal|peat|quarry|stone|gem|crystal|salt|sand|clay|glass/,
  /ruin|artefact|artifact|relic/,
];

const MAGICAL_PATTERNS = [/magic|arcane|ley|planar/];

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
  const renewable = RENEWABLE_PATTERNS.some(pattern => pattern.test(text));

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
  return {
    canRecover: false,
    taxonomy,
    reason: 'Exhaustible or strategic resources require manual recovery or a specific event.',
  };
}
