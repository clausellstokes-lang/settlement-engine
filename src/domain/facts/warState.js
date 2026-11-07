/**
 * domain/facts/warState.js — THE WAR-STATE HOME (CENSUS-1 wave 0, fact 10; the design's §1 row
 * "war state (one record)": only the world-level `display/warStatus.js :: settlementWarStatus`).
 *
 * ONE reader, four values:
 *   front     the place is besieged (the world's live sieges name it as a target), or, on a lone
 *             record, it carries the `under_siege` crisis
 *   aggressor the place's own army is deployed against another (world only)
 *   at war    on a lone record, the `wartime` or `occupied` crisis
 *   peace     none of these
 * With the world (`options.worldState`, `options.settlementId`) the world's answer wins; a lone
 * record answers from the crisis home (`facts/crisisKind.js`). The record-side default is the
 * crisis record's, so a record and its world can disagree only where the pulse has moved the war
 * without a crisis entry — that is the war layer's business, reported, never guessed here.
 *
 * Pure: no randomness, no clock.
 */
import { settlementWarStatus } from '../display/warStatus.js';
import { crisisOf } from './crisisKind.js';

/** @type {ReadonlyArray<string>} */
export const WAR_STATES = Object.freeze(['front', 'aggressor', 'at war', 'peace']);

/**
 * THE ONE READER.
 * @param {object | null | undefined} record a settlement record
 * @param {{ worldState?: unknown, regionalGraph?: unknown, settlementId?: unknown }} [options]
 * @returns {'front'|'aggressor'|'at war'|'peace'}
 */
export function warStateOf(record, options = {}) {
  if (options.worldState && options.settlementId != null) {
    const status = settlementWarStatus(/** @type {Parameters<typeof settlementWarStatus>[0]} */ ({ settlementId: options.settlementId, worldState: options.worldState, regionalGraph: options.regionalGraph }));
    if (status?.besiegedBy?.length) return 'front';
    if (status?.besiegingTargets?.length) return 'aggressor';
  }
  const crisis = crisisOf(record);
  if (crisis.has('under_siege')) return 'front';
  if (crisis.has('wartime') || crisis.has('occupied')) return 'at war';
  return 'peace';
}
