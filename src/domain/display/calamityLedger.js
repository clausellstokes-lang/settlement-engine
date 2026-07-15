/**
 * display/calamityLedger.js — THE CALAMITY LEDGER, a settlement's dossier read of its
 * own calamity history (W-UPSWING stage 0d).
 *
 * settlement.calamityHistory is a PERSISTED stamp trail (the M11b strike record + the
 * cooldown record) that until now was read by NOTHING in the UI. This leaf projects it
 * into a dossier-ready ledger: bucket-neutral titles ("The Great Calamity of …") with
 * the terrain flavor offered only as a DM SUGGESTION (never asserted by the engine), and
 * the losses/fates surfaced for the chronicle. Stage 1's reconstruction arc references
 * this ledger ("rebuilt in the year …").
 *
 * FIRST-PAINT LAW: a DISPLAY-LAZY leaf. Its only import is the lazy spatial calamity
 * leaf (for the DM flavor label — single source, no duplicated table). It must be
 * imported ONLY from lazy display/dossier surfaces, never from the first-paint entry
 * closure. @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */
import { disasterFlavorLabel } from '../spatial/calamity.js';

/** @typedef {{ type?: string, name?: string, year?: number, tick?: number,
 *   deaths?: number, exodus?: number, k?: number, targets?: string[],
 *   flavorText?: string }} CalStampLike */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/**
 * Project ONE calamity stamp into a dossier ledger row. The engine TITLE is bucket-
 * neutral; `flavorSuggestion` is the OPTIONAL DM-facing kind label (a suggestion, not a
 * fact); `flavorText` is the DM's own freetext (if authored via FORCE_CALAMITY). Pure.
 * @param {CalStampLike | null | undefined} stamp
 * @returns {{ title: string, year: number|null, tick: number|null, deaths: number,
 *   exodus: number, institutionsLost: number, targets: string[],
 *   flavorSuggestion: string, flavorText: string|null } | null}
 */
export function projectCalamityStamp(stamp) {
  if (!stamp || typeof stamp !== 'object') return null;
  const year = Number.isFinite(Number(stamp.year)) ? Number(stamp.year) : null;
  return {
    title: String(stamp.name || (year != null ? `The Great Calamity of year ${year}` : 'A great calamity')),
    year,
    tick: Number.isFinite(Number(stamp.tick)) ? Number(stamp.tick) : null,
    deaths: Math.max(0, Math.floor(num(stamp.deaths, 0))),
    exodus: Math.max(0, Math.floor(num(stamp.exodus, 0))),
    institutionsLost: Math.max(0, Math.floor(num(stamp.k, Array.isArray(stamp.targets) ? stamp.targets.length : 0))),
    targets: Array.isArray(stamp.targets) ? stamp.targets.map(String) : [],
    // The DM flavor SUGGESTION (never engine-asserted): "Great Fire", etc.
    flavorSuggestion: disasterFlavorLabel(stamp.type),
    flavorText: stamp.flavorText ? String(stamp.flavorText) : null,
  };
}

/**
 * The full calamity ledger for a settlement's dossier — the persisted stamps projected
 * newest-first, plus a small summary (count, most-recent year, total dead/displaced).
 * An empty/absent history ⇒ an empty ledger (no dossier section renders). Pure.
 * @param {{ calamityHistory?: CalStampLike[] } | null | undefined} settlement
 * @returns {{ entries: Array<ReturnType<typeof projectCalamityStamp>>, count: number,
 *   lastYear: number|null, totalDeaths: number, totalExodus: number }}
 */
export function buildCalamityLedger(settlement) {
  const hist = Array.isArray(settlement?.calamityHistory) ? settlement.calamityHistory : [];
  const rows = hist.map(projectCalamityStamp).filter((r) => r != null);
  // Newest first (descending year, then tick) for the dossier read.
  const entries = rows.slice().sort((a, b) => (num(b?.year, -Infinity) - num(a?.year, -Infinity))
    || (num(b?.tick, -Infinity) - num(a?.tick, -Infinity)));
  let lastYear = null;
  let totalDeaths = 0;
  let totalExodus = 0;
  for (const r of rows) {
    if (r && r.year != null && (lastYear == null || r.year > lastYear)) lastYear = r.year;
    totalDeaths += r ? r.deaths : 0;
    totalExodus += r ? r.exodus : 0;
  }
  return { entries, count: entries.length, lastYear, totalDeaths, totalExodus };
}
