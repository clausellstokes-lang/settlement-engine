/**
 * EconomyFreshnessNote.jsx — THE ONE rendering home for the economy
 * stale-window note (Wave R-4 structural cure, docs/CAPABILITY_REMEDIATION_PLAN.md).
 *
 * Wave R-3 shipped the note as three hand-copied paragraphs (EconomicsTab,
 * ServicesTab, SummaryTab). Three copies is a copy-drift class and a wiring
 * cost per new surface, so the sentence collapsed into
 * domain/display/economyFreshness.js (ECONOMY_FRESHNESS_SENTENCES) and the
 * paragraph collapsed here. Six surfaces now consume this leaf; a seventh is
 * one line, and the census walker
 * (tests/lint/economyReadModelCoverage.walker.test.js) reds if a new economy
 * reader lands without a classification.
 *
 * PURE PRESENTATION. No store, no state, no effects: it renders the detector's
 * answer or nothing at all. On a fresh settlement it returns null, so every
 * host renders byte-identically to its pre-note self — the detector must be
 * invisible except in the one shifted case.
 *
 * STYLE SEAM — `margin` and `color` are props, not constants, because the
 * hosts sit on different grounds: the parchment tabs take the theme MUTED on
 * cream; TableView's lantern-table body takes the field-ink faint tone on
 * umber (the contrast-proven dark ramp). Everything else about the paragraph
 * (size, italic, the sentence itself) is fixed here so the note reads as one
 * thing across the product.
 *
 * @enforced-by tests/components/economyFreshnessNote.test.jsx
 * @enforced-by tests/lint/economyReadModelCoverage.walker.test.js
 */

import { FS, MUTED } from '../theme.js';
import { economyFreshnessNote } from '../../domain/display/economyFreshness.js';

/**
 * @param {object} props
 * @param {any} props.settlement            the settlement whose trail is walked
 * @param {'tallies'|'catalog'} [props.variant]  which sentence this surface needs
 * @param {string} [props.margin]           host-specific vertical rhythm
 * @param {string} [props.color]            host-specific ink (dark surfaces override)
 * @returns {import('react').ReactElement | null}
 */
export default function EconomyFreshnessNote({
  settlement,
  variant = 'tallies',
  margin = '0 0 10px',
  color = MUTED,
}) {
  const text = economyFreshnessNote(settlement, variant);
  if (!text) return null;
  return <p style={{fontSize:FS.xxs,color,fontStyle:'italic',margin}}>{text}</p>;
}
