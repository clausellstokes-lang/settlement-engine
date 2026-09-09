/**
 * dispositionNews.js — WR-2's state-transition receipts.
 *
 * The ledger emits structural transitions; this pure leaf gives those transitions
 * a reader address and one of the governed SP-6 sentences. It never narrates a
 * quiet tick, invents a slot value, prints a stock/band token, or samples RNG.
 */

import { dispositionReceipt } from './eventProse.js';
import { deityPressureOf } from './dispositionProfile.js';
import { stablePart } from './stablePart.js';

const CROSSING_KIND = Object.freeze({
  martial: 'disposition_martial_crossed',
  mercantile: 'disposition_mercantile_crossed',
  diplomatic: 'disposition_diplomatic_crossed',
  insular: 'disposition_insular_crossed',
});

// Literal producer registry: the house impact-kind walkers source-scan literal
// mint sites, so every governed dynamic receipt resolves through this exact table.
const IMPACT_KIND = Object.freeze({
  disposition_martial_crossed: { impactKind: 'disposition_martial_crossed' },
  disposition_mercantile_crossed: { impactKind: 'disposition_mercantile_crossed' },
  disposition_diplomatic_crossed: { impactKind: 'disposition_diplomatic_crossed' },
  disposition_insular_crossed: { impactKind: 'disposition_insular_crossed' },
  disposition_reversal: { impactKind: 'disposition_reversal' },
  deity_war_pressure: { impactKind: 'deity_war_pressure' },
  deity_peace_pressure: { impactKind: 'deity_peace_pressure' },
  war_culture_suppressed: { impactKind: 'war_culture_suppressed' },
});

const TEMPLE_NAME = /\b(?:temple|shrine|chapel|abbey|monastery|chantry|church|cathedral)\b/i;

const TEMPER_WORD = Object.freeze({
  restrained: 'quiet',
  measured: 'guarded',
  settled: 'steady',
  marked: 'strong',
  dominant: 'deep',
});

const INWARD_WORD = Object.freeze({
  restrained: 'slightly',
  measured: 'warily',
  settled: 'steadily',
  marked: 'decidedly',
  dominant: 'deeply',
});

const HEADLINE = Object.freeze({
  disposition_martial_crossed: (name) => `${name}'s martial temper changes`,
  disposition_mercantile_crossed: (name) => `${name}'s market temper changes`,
  disposition_diplomatic_crossed: (name) => `${name}'s taste for parley changes`,
  disposition_insular_crossed: (name) => `${name}'s inward temper changes`,
  disposition_reversal: (name) => `${name} changes its learned temper`,
  deity_war_pressure: (name) => `${name}'s local rites press upon the court`,
  deity_peace_pressure: (name) => `${name}'s harvest rites counsel peace`,
  war_culture_suppressed: (name) => `${name}'s books refuse a warlike reading`,
});

const REASON = Object.freeze({
  disposition_martial_crossed: 'Resolved contests changed what this court expects force to accomplish.',
  disposition_mercantile_crossed: 'Resolved trade contests changed what this court expects commerce to accomplish.',
  disposition_diplomatic_crossed: 'Kept and broken agreements changed what this court expects a pact to accomplish.',
  disposition_insular_crossed: 'Outward outcomes changed how readily this court looks beyond its own walls.',
  disposition_reversal: 'Later outcomes carried the learned temper back across its old balance.',
  deity_war_pressure: 'Local worship makes a quicker resort to arms easier to defend in council.',
  deity_peace_pressure: 'The local harvest rites counsel another season before arms.',
  war_culture_suppressed: 'A peaceable history, a harvest patron, and the book of losses contradict a warlike reading.',
});

const SOURCE_REASON = Object.freeze({
  decay: 'A generation without reinforcing outcomes drew this learned temper back toward balance.',
  resolved_outcome: 'A resolved undertaking changed what this court expects the next attempt to accomplish.',
  war_resolution: 'A resolved campaign changed what this court expects force to accomplish.',
  trade_contest: 'A resolved supplier contest changed what this court expects commerce to accomplish.',
  occupation_outcome: 'A resolved occupation changed what this court expects force and resistance to accomplish.',
  treaty_held: 'An agreement reached its promised horizon intact.',
  treaty_default: 'An observed default taught this court what a broken agreement costs.',
  treaty_repudiated: 'An open repudiation taught this court what a discarded agreement is worth.',
  mediation_landed: 'A brokered settlement reached the table and held long enough to be signed.',
});

const CHANNEL_SURFACE = Object.freeze({
  martial: Object.freeze({
    aspect: 'martial', practice: 'the use of force',
    up: Object.freeze({ lean: 'toward force', answer: 'bolder', weight: 'more', welcome: 'more readily' }),
    down: Object.freeze({ lean: 'away from force', answer: 'more cautious', weight: 'less', welcome: 'more warily' }),
  }),
  mercantile: Object.freeze({
    aspect: 'mercantile', practice: 'commercial ventures',
    up: Object.freeze({ lean: 'toward commerce', answer: 'more eager', weight: 'more', welcome: 'more readily' }),
    down: Object.freeze({ lean: 'away from commerce', answer: 'more cautious', weight: 'less', welcome: 'more warily' }),
  }),
  diplomatic: Object.freeze({
    aspect: 'diplomatic', practice: 'agreements and parley',
    up: Object.freeze({ lean: 'toward parley', answer: 'more willing', weight: 'more', welcome: 'more readily' }),
    down: Object.freeze({ lean: 'away from parley', answer: 'more guarded', weight: 'less', welcome: 'more warily' }),
  }),
  insular: Object.freeze({
    aspect: 'inward', practice: 'outside ties',
    up: Object.freeze({ lean: 'toward its own walls', answer: 'more guarded', weight: 'less', welcome: 'more warily' }),
    down: Object.freeze({ lean: 'beyond its own walls', answer: 'more open', weight: 'more', welcome: 'more readily' }),
  }),
});

/** @param {unknown} value @returns {string|null} */
function labelOf(value) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = /** @type {{label?:unknown,name?:unknown,good?:unknown,faction?:unknown}} */ (value);
  for (const candidate of [row.label, row.name, row.good, row.faction]) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return null;
}

/** @param {Record<string, unknown>} settlement */
function truthfulSlots(settlement) {
  const power = settlement.powerStructure && typeof settlement.powerStructure === 'object'
    ? /** @type {Record<string, unknown>} */ (settlement.powerStructure)
    : {};
  const factions = Array.isArray(power.factions) ? power.factions : [];
  const governing = factions.find((f) => f && typeof f === 'object'
    && /** @type {{isGoverning?:unknown}} */ (f).isGoverning === true);
  const house = labelOf(power.governingName) || labelOf(governing);
  const economy = settlement.economicState && typeof settlement.economicState === 'object'
    ? /** @type {{primaryExports?:unknown[]}} */ (settlement.economicState)
    : {};
  const good = Array.isArray(economy.primaryExports) ? labelOf(economy.primaryExports[0]) : null;
  const temple = (Array.isArray(settlement.institutions) ? settlement.institutions : [])
    .map(labelOf).find((name) => name && TEMPLE_NAME.test(name)) || null;
  return { ...(house ? { house } : {}), ...(good ? { good } : {}), ...(temple ? { temple } : {}) };
}

/** @param {string} kind @param {string} band @param {number} deityPressure */
function surfaceBand(kind, band, deityPressure) {
  if (kind === 'deity_war_pressure' || kind === 'deity_peace_pressure') {
    return Math.abs(deityPressure) < 1 ? 'a little' : 'noticeably';
  }
  if (kind === 'disposition_insular_crossed') return INWARD_WORD[band] || 'steadily';
  return TEMPER_WORD[band] || 'steady';
}

/** @param {string} kind @param {{source?:string,sourceKinds?:string[],channel?:string}} transition */
function reasonsOf(kind, transition) {
  const sourceKinds = Array.isArray(transition.sourceKinds) && transition.sourceKinds.length
    ? transition.sourceKinds
    : [transition.source === 'decay' ? 'decay' : 'resolved_outcome'];
  const causes = sourceKinds.map((sourceKind) => SOURCE_REASON[sourceKind]).filter(Boolean);
  return [...new Set([...causes, REASON[kind]].filter(Boolean))];
}

/**
 * @param {string} kind
 * @param {{id:string,channel:string,fromBand?:string,toBand:string,direction?:string,source?:string,
 *   sourceKinds?:string[],sourceEventIds?:string[],tick:number}} transition
 * @param {Record<string, unknown>} item
 * @param {Record<string, unknown>} entry
 * @param {string|null} now
 */
function compose(kind, transition, item, entry, now) {
  const settlement = item.settlement && typeof item.settlement === 'object'
    ? /** @type {Record<string, unknown>} */ (item.settlement)
    : {};
  const name = String(item.name || settlement.name || '').trim();
  if (!name) return null;
  const deity = deityPressureOf(item, entry);
  const direction = transition.direction === 'down' ? 'down' : 'up';
  const channelSurface = CHANNEL_SURFACE[transition.channel] || CHANNEL_SURFACE.martial;
  const interp = {
    settlement: name,
    band: surfaceBand(kind, transition.toBand, deity.pressure),
    domain: deity.domain || '',
    aspect: channelSurface.aspect,
    practice: channelSurface.practice,
    ...channelSurface[direction],
    ...truthfulSlots(settlement),
  };
  // Stable event identity varies authored families across genuinely different
  // crossings without consuming RNG or using the clock. The required seed base
  // remains disposition:<settlementId>; direction, cause, and end states supply
  // the deterministic event suffix.
  const sourceKey = (Array.isArray(transition.sourceKinds) && transition.sourceKinds.length
    ? [...transition.sourceKinds].sort().join('-')
    : transition.source || 'outcome');
  const receiptSeed = `disposition:${transition.id}:${transition.channel}:${sourceKey}:${direction}:${transition.fromBand || 'none'}:${transition.toBand}`;
  const receipt = dispositionReceipt(kind, receiptSeed, interp);
  if (!receipt) return null;
  const impactKind = IMPACT_KIND[receipt.kind]?.impactKind;
  if (!impactKind) return null;
  return {
    id: `wizard_news.${transition.tick}.${receipt.kind}.${stablePart(transition.id)}.${stablePart(transition.channel)}.${stablePart(sourceKey)}.${stablePart(direction)}.${stablePart(transition.fromBand || 'none')}.${stablePart(transition.toBand)}`,
    tick: transition.tick,
    createdAt: now,
    scope: 'settlement',
    significance: receipt.significance,
    severity: receipt.significance === 'routine' ? 0.36 : 0.58,
    score: receipt.significance === 'routine' ? 38 : 62,
    headline: HEADLINE[receipt.kind](name),
    summary: receipt.line,
    kind: impactKind,
    impactKind,
    channelType: null,
    settlementIds: [transition.id],
    settlementNames: [name],
    impactIds: [],
    channelIds: [],
    sourceEventId: Array.isArray(transition.sourceEventIds) && transition.sourceEventIds.length === 1
      ? String(transition.sourceEventIds[0])
      : null,
    tags: ['world_pulse', 'disposition', transition.channel],
    reasons: reasonsOf(receipt.kind, transition),
    familyId: receipt.familyId,
    ...(receipt.audience === 'dm-only' ? { covert: true } : {}),
  };
}

/**
 * @param {{ transitions?:Array<{kind:string,id:string,channel:string,fromBand?:string,toBand:string,direction?:string,source?:string,sourceKinds?:string[],sourceEventIds?:string[],tick:number}>,
 *   snapshot?:{byId?:Map<string, Record<string, unknown>>}, worldState?:Record<string, unknown>,
 *   now?:string|null }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function dispositionTransitionNewsEntries(input = {}) {
  const transitions = Array.isArray(input.transitions) ? input.transitions : [];
  const stats = input.worldState?.dispositionStats && typeof input.worldState.dispositionStats === 'object'
    ? /** @type {Record<string, Record<string, unknown>>} */ (input.worldState.dispositionStats)
    : {};
  const seen = new Set();
  const out = [];
  const add = (kind, transition, item) => {
    const sourceKey = Array.isArray(transition.sourceKinds) && transition.sourceKinds.length
      ? [...transition.sourceKinds].sort().join(',')
      : transition.source || 'outcome';
    const key = `${transition.tick}|${transition.id}|${transition.channel}|${kind}|${sourceKey}|${transition.direction || 'up'}|${transition.fromBand || 'none'}|${transition.toBand}`;
    if (seen.has(key)) return;
    seen.add(key);
    const entry = compose(kind, transition, item, stats[transition.id] || {}, input.now ?? null);
    if (entry) out.push(entry);
  };
  for (const transition of transitions) {
    const item = input.snapshot?.byId?.get(String(transition.id));
    if (!item) continue;
    const crossing = transition.kind === 'reversal' ? 'disposition_reversal' : CROSSING_KIND[transition.channel];
    if (crossing) add(crossing, transition, item);
    if (transition.channel !== 'martial') continue;
    const deity = deityPressureOf(item, stats[transition.id]);
    if (deity.direction === 'war') add('deity_war_pressure', transition, item);
    if (deity.direction === 'peace') add('deity_peace_pressure', transition, item);
    if (deity.suppressed) add('war_culture_suppressed', transition, item);
  }
  return out.sort((a, b) => String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0);
}
