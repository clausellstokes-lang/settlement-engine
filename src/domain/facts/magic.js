/**
 * domain/facts/magic.js — THE MAGIC HOME (CENSUS-1 wave 0, fact 7; the design's §1 row "magic
 * functions / level", Appendix A competing reading 9).
 *
 * ONE DEFAULT: a missing `config.magicExists` reads ON — the engine's (`magicLedger.js`:
 * `cfg.magicExists !== false`) — and "does magic function here" is
 * `worldPulse/magicWorksAt.js :: magicWorksAt`. The level is the ledger's folded band (it folds the
 * legacy vocabulary — moderate, common, pervasive — that a raw `magicLevel ===` compare misses).
 *
 * The raw reads that spell `magicExists !== false` or `=== false` already agree with this default
 * and are left where they stand; the reader that disagreed was the soak's feature table
 * (`features.mjs`, which printed a missing value as 'off'), retired here.
 *
 * Pure: no randomness, no clock.
 */
import { magicLedger } from '../magicLedger.js';
import { magicWorksAt } from '../worldPulse/magicWorksAt.js';

/** @typedef {import('../magicLedger.js').MagicLedgerSource} MagicSource */

/**
 * THE ONE READER.
 * @param {MagicSource & { settlement?: MagicSource | null } | null | undefined} record a settlement record (or a
 *   `{ settlement }` snapshot item)
 * @returns {Readonly<{ functions: boolean, level: string, priority: number }>}
 */
export function magicOf(record) {
  const settlement = record?.settlement || record || null;
  const ledger = magicLedger(settlement);
  return Object.freeze({
    functions: magicWorksAt({ settlement }),
    level: String(ledger.magicLevel ?? 'none'),
    priority: Number(ledger.priorityMagic ?? 0),
  });
}
