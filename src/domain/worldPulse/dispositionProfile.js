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

import { clamp } from '../../kernel/math.js';
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

/**
 * ⭐⭐ THE PER-DEITY PRECEDENCE LAW (ODQ §851, from the owner's own §797 "in place of
 * domains"), and this is the ONE site in the tree where it can be written.
 *
 * A deity carrying an AUTHORED boon or bane reads THOSE, and its legacy `domain` arm
 * goes silent FOR THAT DEITY. A deity carrying only the legacy `domain` keeps its
 * unchanged arm — THE PROMISE. One arm per deity, never both.
 *
 * WHY HERE AND NOWHERE ELSE. `supportedDomainOf` is the SOLE mechanical reader of
 * `domain` in the estate: every other `.domain` hit is an embed writer or a consumer
 * of `deityPressureOf`'s already-computed output. So the law is enforceable as a
 * property of one function rather than as a convention several callers must remember
 * — which is what makes it structural instead of documentary.
 *
 * ⚠ WHY IT MATTERS THAT THIS LANDS BEFORE F4c WIRES THE CHANNELS. `harvest` and
 * `war_readiness` are BOTH a `DEITY_DOMAIN_PRESSURE` key and a `DEITY_EFFECT_CHANNELS`
 * key. Wire the channels first and a deity authored `boon: harvest` would push the war
 * bar through this function AND through the field — the same intent counted twice,
 * which is precisely the collision §851 was raised to prevent. Landing the precedence
 * first makes that double-count unconstructible rather than merely unlikely.
 *
 * ⭐ DORMANT-BY-ABSENCE TODAY, and that is the safety argument: no deity in the estate
 * authors a boon or bane (the authoring surface is `ui:false`), so `authoredAspects`
 * is false everywhere and this function is byte-identical on the whole corpus. The law
 * is in place BEFORE the content that would trigger it exists.
 *
 * ⚠ BOTH HELPERS TAKE THE SNAPSHOT, NOT THE SETTLEMENT, and the observed-shape
 * ratchet is why: `primaryDeitySnapshot on config` carries a FROZEN CEILING OF ONE
 * READ for this file, and an earlier cut of this law read it in each helper — two
 * reads, refused. Resolving the snapshot ONCE in `deityPressureOf` and passing it
 * down is both the cure and the better shape: one place decides which deity the law
 * is about.
 *
 * @param {Record<string, unknown> | null | undefined} snapshot a committed deity embed
 * @returns {boolean} whether this deity's authored aspects supersede its legacy domain
 */
function authoredAspectsOf(snapshot) {
  // Keyed on the CHANNEL, not the strength: the channel is what names the effect, and
  // it is what `faithField.aspectTerm` keys on too — so "this deity has an authored
  // aspect" means the same thing on both sides of the split.
  const boon = snapshot?.boonChannel;
  const bane = snapshot?.baneChannel;
  return (typeof boon === 'string' && boon !== '') || (typeof bane === 'string' && bane !== '');
}

/** @param {Record<string, unknown> | null | undefined} snapshot */
function supportedDomainOf(snapshot) {
  if (authoredAspectsOf(snapshot)) return null;      // §851: one arm per deity
  const raw = snapshot?.domain;
  if (typeof raw !== 'string') return null;
  const domain = raw.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(DEITY_DOMAIN_PRESSURE, domain) ? domain : null;
}

/** @param {Record<string, unknown> | null | undefined} snapshot */
function domainSupersededBy(snapshot) {
  // Only a deity that WOULD otherwise have had a mechanical domain is "superseded";
  // one with an unsupported domain, or none at all, was always silent here and must
  // not claim a precedence that never fired.
  if (!authoredAspectsOf(snapshot)) return false;
  const raw = snapshot?.domain;
  if (typeof raw !== 'string') return false;
  return Object.prototype.hasOwnProperty.call(DEITY_DOMAIN_PRESSURE, raw.trim().toLowerCase());
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
  // ONE read of `config.primaryDeitySnapshot` for the whole function (the frozen
  // observed-shape ceiling for this file is exactly one).
  const snapshot = settlement?.config?.primaryDeitySnapshot;
  const domain = supportedDomainOf(snapshot);
  if (!domain) {
    return {
      domain: null,
      direction: 'neutral',
      pressure: 0,
      warPressure01: 0,
      thresholdFactor: 1,
      suppressed: false,
      contradictions: [],
      // ⚠ TWO REASONS, NOT ONE, AND THE READER MUST BE ABLE TO TELL THEM APART. "This
      // court has no war-moving patron" and "this court's patron moves war through its
      // authored blessing instead" are different facts about the world, and a single
      // receipt covering both would report the §851 precedence as an absence — the
      // exact confusion the law exists to remove.
      receipt: domainSupersededBy(snapshot)
        ? 'This patron\'s authored blessing and blight govern its influence; its older domain no longer moves this court\'s bar for war.'
        : 'No supported local patron domain changes this court\'s bar for war.',
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
