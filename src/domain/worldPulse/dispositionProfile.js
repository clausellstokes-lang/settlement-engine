/**
 * domain/worldPulse/dispositionProfile.js — WR-2's deliberately narrow read side.
 *
 * This module cannot choose a target: it imports only the disposition-ledger leaf,
 * never a regional graph, relationship edge, candidate list, or selector. Consumers
 * receive bounded BAR modifiers and local-patron pressure; they remain responsible for
 * deciding whether an otherwise-valid action clears its ordinary constraints.
 *
 * Pure, rng-free, store-blind, and state-free. dispositionLedger.js remains the ONE
 * writer of worldState.dispositionStats.
 */

import {
  DISPOSITION_CHANNELS,
  DISPOSITION_CHANNEL_TUNING,
  readDispositionChannel,
} from './dispositionLedger.js';

export const DEITY_THRESHOLD_CAP = 0.12;
export const DEITY_DOMAIN_PRESSURE = Object.freeze({
  war: 1,
  conquest: 1,
  hunt: 0.5,
  harvest: -1,
});

/** @param {number} value @param {number} lo @param {number} hi */
const clamp = (value, lo, hi) => (value < lo ? lo : value > hi ? hi : value);
/** @param {number} value */
const round6 = (value) => Math.round(value * 1_000_000) / 1_000_000;

/**
 * Bounded threshold multiplier for one settlement's persisted channel entry.
 * Neutral/absent is EXACTLY 1. Positive stock lowers the corresponding action bar;
 * negative stock raises it. A consumer applying insularity to an OUTWARD act uses the
 * reciprocal direction, but still reads this one bounded value rather than raw stock.
 *
 * @param {any} dispositionEntry worldState.dispositionStats[settlementId]
 * @param {string} channel one of the four closed WR-2 channels
 * @returns {{factor:number,receipt:string,channel:string,direction:'lower'|'raise'|'neutral'}}
 */
export function thresholdFactorOf(dispositionEntry, channel) {
  if (!DISPOSITION_CHANNELS.includes(channel)) {
    return {
      factor: 1,
      receipt: 'No supported disposition channel changes this court\'s action bar.',
      channel: String(channel || ''),
      direction: 'neutral',
    };
  }
  const stock01 = readDispositionChannel(dispositionEntry, channel).stock01;
  if (stock01 === DISPOSITION_CHANNEL_TUNING.NEUTRAL_STOCK01) {
    return {
      factor: 1,
      receipt: `${channel[0].toUpperCase()}${channel.slice(1)} outcomes remain balanced and leave this court's action bar unchanged.`,
      channel,
      direction: 'neutral',
    };
  }
  const signed = clamp((stock01 - DISPOSITION_CHANNEL_TUNING.NEUTRAL_STOCK01) * 2, -1, 1);
  const rising = signed > 0;
  const stateReceipt = {
    martial: rising
      ? 'Resolved contests have taught this court confidence in force.'
      : 'Resolved contests have taught this court caution about force.',
    mercantile: rising
      ? 'Resolved market contests have taught this court confidence in commerce.'
      : 'Resolved market contests have taught this court caution about commerce.',
    diplomatic: rising
      ? 'Kept agreements have taught this court confidence in parley.'
      : 'Broken agreements have taught this court caution about parley.',
    insular: rising
      ? 'Outward outcomes have turned this court toward its own walls.'
      : 'Outward outcomes have taught this court to look beyond its walls.',
  }[channel];
  return {
    factor: round6(1 - signed * DISPOSITION_CHANNEL_TUNING.THRESHOLD_FACTOR_CAP),
    receipt: stateReceipt,
    channel,
    direction: rising ? 'lower' : 'raise',
  };
}

/** @param {any} settlementOrItem */
function settlementOf(settlementOrItem) {
  return settlementOrItem?.settlement || settlementOrItem || {};
}

/** @param {any} settlement */
function supportedDomainOf(settlement) {
  const raw = settlement?.config?.primaryDeitySnapshot?.domain;
  if (typeof raw !== 'string') return null;
  const domain = raw.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(DEITY_DOMAIN_PRESSURE, domain) ? domain : null;
}

/**
 * Local patron-domain pressure on the general war bar. Only the four ratified domains
 * have mechanics: war/conquest lower the bar, hunt lowers it weakly, harvest raises it.
 * Every arbitrary authored domain is presentation-only and returns the neutral record.
 *
 * The record also carries the incoherence proof needed by the DM-only suppression
 * receipt. A harvest patron + a below-neutral martial culture + more recorded losses
 * than wins can never be interpreted as positive war pressure: warPressure01 is pinned
 * to zero and all three contradicting facts are named. The signed peace pressure still
 * raises the threshold; suppression prevents only the incoherent positive reading.
 *
 * @param {any} settlementOrItem settlement or world-snapshot item
 * @param {any} [dispositionEntry] worldState.dispositionStats[settlementId]
 * @returns {{domain:string|null, direction:'war'|'peace'|'neutral', pressure:number, warPressure01:number, thresholdFactor:number, suppressed:boolean, contradictions:string[],receipt:string}}
 */
export function deityPressureOf(settlementOrItem, dispositionEntry = null) {
  const settlement = settlementOf(settlementOrItem);
  const domain = supportedDomainOf(settlement);
  if (!domain) {
    return {
      domain: null,
      direction: 'neutral',
      pressure: 0,
      warPressure01: 0,
      thresholdFactor: 1,
      suppressed: false,
      contradictions: [],
      receipt: 'No supported local patron domain changes this court\'s bar for war.',
    };
  }

  const pressure = /** @type {Record<string, number>} */ (DEITY_DOMAIN_PRESSURE)[domain];
  const martial = readDispositionChannel(dispositionEntry, 'martial');
  const peaceableCulture = martial.stock01 < DISPOSITION_CHANNEL_TUNING.NEUTRAL_STOCK01;
  const lossHistory = (Number(dispositionEntry?.losses) || 0) > (Number(dispositionEntry?.wins) || 0);
  const harvestPatron = domain === 'harvest';
  const suppressed = peaceableCulture && harvestPatron && lossHistory;
  const contradictions = suppressed
    ? ['peaceable_culture', 'harvest_patron', 'loss_history']
    : [];
  const receipt = suppressed
    ? 'A peaceable martial history, harvest patronage, and more losses than victories suppress any warlike reading.'
    : {
      war: 'War-domain worship lowers this court\'s bar for war.',
      conquest: 'Conquest-domain worship lowers this court\'s bar for war.',
      hunt: 'Hunt-domain worship lowers this court\'s bar for war slightly.',
      harvest: 'Harvest-domain worship raises this court\'s bar for war.',
    }[domain];

  return {
    domain,
    direction: pressure > 0 ? 'war' : pressure < 0 ? 'peace' : 'neutral',
    pressure,
    warPressure01: suppressed ? 0 : Math.max(0, pressure),
    thresholdFactor: round6(1 - pressure * DEITY_THRESHOLD_CAP),
    suppressed,
    contradictions,
    receipt,
  };
}
