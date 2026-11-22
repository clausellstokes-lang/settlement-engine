/**
 * warCostsNews.js — WR-4's pure transition-to-news projection.
 *
 * War-cost receipts already hold the behavioral observation. This leaf speaks
 * only when that observation enters a reader-significant state: a directional
 * trajectory, worsening home-front evidence, the combined foreign/home-front
 * contradiction, or a newly-visible court misread. It owns no state, samples no
 * RNG, and never substitutes an engine id for a missing authored name.
 */

import { warCostReceipt } from './eventProse.js';
import { stablePart } from './stablePart.js';

const HOME_COMPONENT_KIND = Object.freeze({
  roads: 'home_front_roads',
  stores: 'home_front_stores',
  hands: 'home_front_hands',
  institutions: 'home_front_institutions',
  markets: 'home_front_markets',
});

const HOME_BAND_RANK = Object.freeze({
  quiet: 0,
  present: 1,
  pressing: 2,
  decisive: 3,
});

const TRAJECTORIES = new Set(['winning', 'losing']);
const MARGIN_BANDS = new Set(['narrow', 'clear']);

const HEADLINE = Object.freeze({
  war_trajectory_winning: (settlement, counterpart) => (
    `${settlement} believes the war against ${counterpart} is turning its way`
  ),
  war_trajectory_losing: (settlement, counterpart) => (
    `${settlement} believes the war against ${counterpart} is turning against it`
  ),
  home_front_roads: (settlement) => `Wartime strain deepens on ${settlement}'s roads`,
  home_front_stores: (settlement) => `Wartime strain deepens in ${settlement}'s stores`,
  home_front_hands: (settlement) => `The muster weighs more heavily on ${settlement}`,
  home_front_institutions: (settlement) => `${settlement}'s institutions thin under wartime demands`,
  home_front_markets: (settlement) => `${settlement}'s wartime markets lose more ground`,
  winning_abroad_losing_at_home: (settlement, counterpart) => (
    `${settlement} gains against ${counterpart} while its home front frays`
  ),
  trajectory_misread: (settlement, counterpart) => (
    `${settlement}'s court misreads the war against ${counterpart}`
  ),
});

const REASON = Object.freeze({
  war_trajectory_winning: "The court's latest reading has changed how it weighs peace now against peace later.",
  war_trajectory_losing: "The court's latest reading has changed how it weighs peace now against peace later.",
  home_front_roads: 'The recorded road condition has worsened while the deployment remains active.',
  home_front_stores: 'The recorded reserve condition has entered more serious wartime strain.',
  home_front_hands: 'The recorded burden on working hands has entered more serious wartime strain.',
  home_front_institutions: 'The recorded institutional condition has worsened while the deployment remains active.',
  home_front_markets: 'The recorded market condition has worsened while the deployment remains active.',
  winning_abroad_losing_at_home: 'Real gains in the war now coincide with serious strain behind the lines.',
  trajectory_misread: "The court's belief now points against the recorded course of the war.",
});

const HOME_BAND_WORD = Object.freeze({
  home_front_roads: Object.freeze({ present: 'a little', pressing: 'markedly', decisive: 'much' }),
  home_front_stores: Object.freeze({ present: 'modest reserves', pressing: 'little', decisive: 'almost nothing' }),
  home_front_hands: Object.freeze({ present: 'some', pressing: 'many', decisive: 'most' }),
  winning_abroad_losing_at_home: Object.freeze({
    present: 'modest reserves',
    pressing: 'little',
    decisive: 'almost nothing',
  }),
});

const MARGIN_WORD = Object.freeze({
  narrow: 'by uncertain report',
  clear: 'in every dispatch',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** A reader slot may not smuggle numeric/tuning or raw snake-case prose. */
function readerSlot(value) {
  const valueText = text(value);
  return valueText && !/[\d%\u00d7_]/u.test(valueText) ? valueText : '';
}

/** @param {unknown} value @returns {number|null} */
function receiptTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** Resolve a real settlement name; snapshot ids are never presentation fallbacks. */
function settlementName(snapshot, id) {
  const key = text(id);
  if (!key) return '';
  const byId = snapshot?.byId;
  const raw = typeof byId?.get === 'function' ? byId.get(key) : asObject(byId)[key];
  const row = asObject(raw);
  const save = asObject(row.save);
  const settlement = asObject(row.settlement || save.settlement);
  const candidates = [settlement.name, save.settlement && asObject(save.settlement).name, save.name, row.name];
  for (const candidate of candidates) {
    const name = readerSlot(candidate);
    if (name && name !== key) return name;
  }
  return '';
}

/** @param {unknown} band @returns {number} */
function homeBandRank(band) {
  const key = text(band);
  return Object.hasOwn(HOME_BAND_RANK, key) ? HOME_BAND_RANK[key] : -1;
}

/** @param {Record<string, unknown>} receipt */
function homeComponents(receipt) {
  return asObject(receipt.homeFrontComponents);
}

/** @param {Record<string, unknown>} component */
function hasStateRead(component) {
  return text(component.stateRead).length > 0;
}

/** @param {Record<string, unknown>} receipt */
function combinedCondition(receipt) {
  return receipt.trajectory === 'winning'
    && receipt.truthTrajectory === 'winning'
    && receipt.trajectoryMisread !== true
    && homeBandRank(receipt.homeFrontBand) >= HOME_BAND_RANK.pressing;
}

/** @param {string} kind @param {string} band */
function surfaceBand(kind, band) {
  if (kind === 'war_trajectory_winning') return MARGIN_WORD[band] || '';
  return HOME_BAND_WORD[kind]?.[band] || '';
}

/** @param {string} significance */
function presentationWeight(significance) {
  if (significance === 'major') return { severity: 0.76, score: 78 };
  if (significance === 'routine') return { severity: 0.34, score: 36 };
  return { severity: 0.56, score: 58 };
}

/**
 * Project WR-4 receipt transitions into governed Wizard News entries.
 *
 * @param {{
 *   current?:Record<string, unknown>|null,
 *   previous?:Record<string, unknown>|null,
 *   snapshot?:{byId?:Map<string, unknown>|Record<string, unknown>}|null,
 *   now?:string|null,
 * }} [input]
 * @returns {Array<Record<string, unknown>>}
 */
export function warCostTransitionNewsEntries(input = {}) {
  const current = asObject(input.current);
  const attackerId = text(current.attackerId);
  const targetId = text(current.targetId);
  const tick = receiptTick(current.tick);
  const attackerName = settlementName(input.snapshot, attackerId);
  const targetName = settlementName(input.snapshot, targetId);
  if (!attackerId || !targetId || tick == null || !attackerName || !targetName) return [];

  const suppliedPrevious = asObject(input.previous);
  const previous = text(suppliedPrevious.attackerId) === attackerId
    && text(suppliedPrevious.targetId) === targetId
    ? suppliedPrevious
    : {};
  const currentComponents = homeComponents(current);
  const previousComponents = homeComponents(previous);
  const entries = [];

  const emit = (kind, componentKey = '') => {
    const component = componentKey ? asObject(currentComponents[componentKey]) : {};
    const componentCounterpartId = text(component.counterpartId);
    const componentCounterpartName = componentCounterpartId
      ? settlementName(input.snapshot, componentCounterpartId)
      : '';
    const band = kind === 'war_trajectory_winning'
      ? text(current.trajectoryMarginBand)
      : kind === 'winning_abroad_losing_at_home'
        ? text(current.homeFrontBand)
        : text(component.band);
    const counterpart = componentKey === 'markets'
      ? componentCounterpartName
      : componentKey ? '' : targetName;
    const interp = {
      settlement: attackerName,
      ...(counterpart ? { counterpart } : {}),
      ...(surfaceBand(kind, band) ? { band: surfaceBand(kind, band) } : {}),
      ...(readerSlot(component.route) ? { route: readerSlot(component.route) } : {}),
      ...(readerSlot(component.good) ? { good: readerSlot(component.good) } : {}),
      ...(readerSlot(component.npc) ? { npc: readerSlot(component.npc) } : {}),
      ...(readerSlot(component.temple) ? { temple: readerSlot(component.temple) } : {}),
      ...(readerSlot(component.house) ? { house: readerSlot(component.house) } : {}),
    };
    const sourceEventId = `war_cost_transition.${stablePart(kind)}.${stablePart(attackerId)}.${stablePart(targetId)}.${tick}`;
    const receipt = warCostReceipt(kind, sourceEventId, interp);
    const headline = HEADLINE[kind];
    const reason = REASON[kind];
    if (!receipt || typeof headline !== 'function' || !reason) return;

    const settlementIds = [attackerId, targetId];
    const settlementNames = [attackerName, targetName];
    if (componentCounterpartId && componentCounterpartName
      && !settlementIds.includes(componentCounterpartId)) {
      settlementIds.push(componentCounterpartId);
      settlementNames.push(componentCounterpartName);
    }
    const section = kind === 'home_front_institutions' ? 'events' : receipt.section;
    const weight = presentationWeight(receipt.significance);
    entries.push({
      id: `wizard_news.${tick}.${stablePart(kind)}.${stablePart(attackerId)}.${stablePart(targetId)}`,
      tick,
      createdAt: input.now ?? null,
      scope: 'regional',
      significance: receipt.significance,
      severity: weight.severity,
      score: weight.score,
      headline: headline(attackerName, targetName),
      summary: receipt.line,
      kind: receipt.kind,
      impactKind: receipt.kind,
      channelType: null,
      settlementIds,
      settlementNames,
      impactIds: [],
      channelIds: [],
      sourceEventId,
      tags: ['world_pulse', 'war_costs', section],
      reasons: [reason],
      familyId: receipt.familyId,
      audience: receipt.audience,
      section,
      ...(receipt.audience === 'dm-only' ? { covert: true } : {}),
    });
  };

  const trajectory = text(current.trajectory);
  if (TRAJECTORIES.has(trajectory)
    && MARGIN_BANDS.has(text(current.trajectoryMarginBand))
    && trajectory !== text(previous.trajectory)) {
    emit(`war_trajectory_${trajectory}`);
  }

  for (const [componentKey, kind] of Object.entries(HOME_COMPONENT_KIND)) {
    const component = asObject(currentComponents[componentKey]);
    const prior = asObject(previousComponents[componentKey]);
    const currentRank = homeBandRank(component.band);
    const priorRank = homeBandRank(prior.band);
    if (hasStateRead(component)
      && currentRank > HOME_BAND_RANK.quiet
      && currentRank > Math.max(HOME_BAND_RANK.quiet, priorRank)) {
      emit(kind, componentKey);
    }
  }

  if (combinedCondition(current) && !combinedCondition(previous)) {
    emit('winning_abroad_losing_at_home');
  }

  if (current.trajectoryMisread === true && previous.trajectoryMisread !== true) {
    emit('trajectory_misread');
  }

  return entries;
}
