/**
 * domain/townMap/changeView.js — SM-5 (2) THE CHANGE VIEW.
 *
 * The chronicle's SPATIAL TWIN: a pure, view-time read of what recently changed on
 * the ground — rebuilt blocks, stressor scars, and the recent calamities — composed
 * from the SAME durable substrates the textual chronicle/dossier read, so the two
 * never disagree:
 *   • the urban-fabric MIRROR (fabricRead.js — scars + catastrophe rebirths), which
 *     is EMPTY-WHEN-DARK by contract (a dormant/pre-fabric save yields nothing);
 *   • the settlement's calamityHistory, projected through the existing dossier read
 *     model (calamityLedger.js) so the beats mirror the chronicle, never re-derived.
 *
 * IT DOES NOT FABRICATE DELTAS: prominence stocks are an absolute current reading
 * with no stored baseline, so the change view reports concrete recorded EVENTS
 * (rebuilt / scarred / struck), newest-first — never an invented "grew by N%". When
 * the fabric is dark AND no calamity is recorded, `hasAny` is false and the caller
 * shows a single whisper instead.
 *
 * PURE + deterministic (the townMap domain source-scan: no Date/Math.random/
 * localeCompare). No React, no store, no engine import.
 */

import { fabricScarsOf, fabricRebirthsOf, hasFabric as fabricPresent } from './fabricRead.js';
import { buildCalamityLedger } from '../display/calamityLedger.js';

/** @typedef {{ label: string, detail: string }} ChangeRow */

/**
 * @typedef {Object} ChangeView
 * @property {boolean} hasFabric        whether the urban-fabric mirror is lit
 * @property {boolean} hasAny           whether any concrete change is recorded
 * @property {ChangeRow[]} rebuilt      catastrophe rebirths (rebuilt quarters), newest-first
 * @property {string[]} rebuiltClasses  the district CLASSES rebuilt (for the map highlight)
 * @property {ChangeRow[]} scars        stressor scars, worst-first
 * @property {ChangeRow[]} calamities   recent calamities (dossier read model), newest-first
 */

/** Capitalize a lowercase enum token for display (no locale — the purity scan).
 *  @param {unknown} s */
function cap(s) {
  const str = typeof s === 'string' ? s : '';
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** A 0..1 severity → a coarse damage band (never a false-precision number).
 *  @param {unknown} v */
function severityBand(v) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  return n >= 0.66 ? 'severe' : n >= 0.33 ? 'heavy' : 'light';
}

/** How many rows of each kind the compact drawer shows. */
const MAX_ROWS = 5;

/**
 * Build the spatial change view for a settlement. Pure; tolerant of missing data.
 * @param {{ urbanFabric?: unknown, calamityHistory?: Array<Record<string, unknown>> } | null | undefined} settlement
 * @returns {ChangeView}
 */
export function buildChangeView(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : null;

  // ── Rebuilt blocks (catastrophe rebirths) — newest-first by week ──────────────
  const rebirths = fabricRebirthsOf(s).slice().sort((a, b) => b.week - a.week);
  /** @type {ChangeRow[]} */
  const rebuilt = [];
  /** @type {Set<string>} */
  const classSet = new Set();
  for (const r of rebirths.slice(0, MAX_ROWS)) {
    const classes = Array.isArray(r.classes) ? r.classes.filter((c) => typeof c === 'string' && c) : [];
    for (const c of classes) classSet.add(c);
    const label = classes.length > 0
      ? `${classes.map(cap).join(', ')} ${classes.length > 1 ? 'quarters' : 'quarter'}`
      : 'A quarter';
    const kind = typeof r.type === 'string' && r.type ? r.type : 'catastrophe';
    rebuilt.push({ label, detail: `rebuilt after ${kind}` });
  }

  // ── Stressor scars — worst-first (severity desc), tie-break newest ────────────
  const scarsRaw = fabricScarsOf(s).slice().sort((a, b) => (b.severity - a.severity) || (b.week - a.week));
  /** @type {ChangeRow[]} */
  const scars = [];
  for (const sc of scarsRaw.slice(0, MAX_ROWS)) {
    const kind = typeof sc.kind === 'string' && sc.kind ? sc.kind : 'damage';
    scars.push({ label: `${cap(kind)} damage`, detail: `${severityBand(sc.severity)} scarring` });
  }

  // ── Recent calamities — the dossier read model (mirror, never re-derive) ──────
  const ledger = buildCalamityLedger(s);
  const entries = Array.isArray(ledger.entries) ? ledger.entries : [];
  /** @type {ChangeRow[]} */
  const calamities = [];
  for (const e of entries.slice(0, MAX_ROWS)) {
    if (!e) continue;
    const label = e.flavorSuggestion || e.title;
    /** @type {string[]} */
    const parts = [];
    if (e.year != null) parts.push(`year ${e.year}`);
    if (e.deaths > 0) parts.push(`${e.deaths} dead`);
    if (e.institutionsLost > 0) parts.push(`${e.institutionsLost} lost`);
    calamities.push({ label: label || 'A calamity', detail: parts.join(' · ') || 'recorded' });
  }

  const hasAny = rebuilt.length > 0 || scars.length > 0 || calamities.length > 0;
  return {
    hasFabric: fabricPresent(s),
    hasAny,
    rebuilt,
    rebuiltClasses: [...classSet].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    scars,
    calamities,
  };
}
