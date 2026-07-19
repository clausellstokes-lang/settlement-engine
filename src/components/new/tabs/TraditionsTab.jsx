/**
 * TraditionsTab — the dossier's "Traditions" World-area sub-tab (THE TRADITIONS
 * wave, Engine Lift #4, slice T-1). It voices a settlement's holidays, festivals,
 * and rites in the register: the singular founding observance and the customs the
 * town accrued as it grew.
 *
 * TWO MODES, ONE SURFACE (the town-map view-time-projection precedent):
 *  • ENGINE mode — a lit campaign carries `settlement.traditions` (the mirror the
 *    T-2 mover writes) with live ownership, last outcomes, and a mutation history.
 *    Rendered read-only. (No settlement carries the mirror yet in this slice; the
 *    branch is here so T-2 lights it with no tab change.)
 *  • PREVIEW mode — a draft/uncampaigned settlement has no mirror, so the tab calls
 *    the SAME pure `deriveFoundingTraditions` view-time and shows the FOUNDING
 *    traditions: what the town has kept since the beginning. Ownership and outcomes
 *    exist only where time exists, so those read "—".
 *
 * Pure read: ZERO settlement-object writes, ZERO store writes. Lazy chunk
 * (OutputContainer lazy-imports this file via dossierLazyTabs) — zero first-paint
 * bytes; the genesis leaf + corpus ride this chunk, never the eager graph.
 */

import { useMemo } from 'react';
import { deriveFoundingTraditions, describeTraditionWindow, motifGlyph } from '../../../domain/traditions/genesis.js';
import {
  BODY, BORDER, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, sans,
} from '../../theme.js';

const OUTCOME_LABEL = {
  triumph: 'a triumph', good: 'well kept', modest: 'modestly kept',
  troubled: 'a troubled year', failure: 'a failure', cancelled: 'set aside',
};

/** Humanize a motif id ("the-dead" → "The Dead", "long-sun" → "Long Sun"). */
function humanizeMotif(id) {
  return String(id || '')
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** A tradition row: motif glyph, name, motif chip, window phrase, owner, last outcome, provenance. */
function TraditionRow({ rec, preview }) {
  const owner = preview ? '—' : (rec.ownerLabel || rec.ownerKey || '—');
  const outcome = preview ? '—' : (OUTCOME_LABEL[rec.lastOutcome] || rec.lastOutcome || '—');
  const glyph = motifGlyph(rec.coreMotif?.element);
  const log = Array.isArray(rec.mutationLog) ? rec.mutationLog : [];
  // The mutationLog as a provenance line (design §10): a count, then the most recent
  // changes as their own readable causes (the tradition's history, most recent last).
  const recentCauses = log.map((e) => (e && typeof e.cause === 'string' ? e.cause : '')).filter(Boolean).slice(-3);
  const provenance = log.length > 0
    ? `${log.length} ${log.length === 1 ? 'change' : 'changes'} recorded — ${recentCauses.join('; ')}`
    : (rec.expression?.epithet || null);
  // Rule-framed plate (the composite kill-list reconciliation): the card and its
  // motif stamp fell to the flat idiom — radius struck, the gold tinted wash now a
  // gold-ruled ink stamp (the ResumeChip precedent). The motif tooltip is struck
  // too: its text is already VISIBLE as the row's small-cap motif chip, and a
  // native title= on an aria-hidden glyph is an AT-invisible affordance (the
  // title= census stays at its shrink-only baseline).
  return (
    <article style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '10px 12px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <span aria-hidden="true" style={{
          flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, border: `1px solid ${GOLD}`, color: GOLD,
          fontSize: FS.sm, fontWeight: 900, lineHeight: 1, alignSelf: 'center',
        }}>
          {glyph}
        </span>
        <h4 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900, overflowWrap: 'anywhere' }}>
          {rec.name}
        </h4>
        <span style={{
          marginLeft: 'auto', color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800,
          letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          {humanizeMotif(rec.coreMotif?.element)} · {humanizeMotif(rec.coreMotif?.act)}
        </span>
      </div>
      <div style={{ marginTop: 5, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
        Kept in {describeTraditionWindow(rec.window)}.
      </div>
      <div style={{ marginTop: 6, display: 'flex', gap: 14, flexWrap: 'wrap', color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
        <span>Owner: {owner}</span>
        <span>Last held: {outcome}</span>
      </div>
      {provenance && (
        <div style={{ marginTop: 6, color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic', lineHeight: 1.5 }}>
          {provenance}
        </div>
      )}
    </article>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null }} props
 */
export default function TraditionsTab({ settlement }) {
  // ENGINE mirror when present (T-2 writes it); otherwise the pure founding preview.
  const mirror = Array.isArray(settlement?.traditions) ? settlement.traditions : null;
  const preview = !mirror || mirror.length === 0;

  const traditions = useMemo(
    () => (preview ? deriveFoundingTraditions(settlement) : mirror),
    [preview, mirror, settlement],
  );

  const name = settlement?.name || settlement?.identity?.name || 'this settlement';

  if (!traditions || traditions.length === 0) {
    return (
      <div data-testid="traditions-tab" style={{ padding: '12px 14px', fontFamily: sans, color: MUTED, fontSize: FS.sm }}>
        No traditions are recorded for {name} yet.
      </div>
    );
  }

  return (
    <div data-testid="traditions-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <p style={{ margin: '0 0 12px', color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
        {preview ? (
          <>The <strong style={{ color: INK }}>founding traditions</strong> of {name} — the observances its
          people have kept since the beginning, reconstructed from what the town is. Ownership and outcomes
          come once the world turns.</>
        ) : (
          <>The traditions of {name}, as the years have shaped them.</>
        )}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {traditions.map((rec) => (
          <TraditionRow key={rec.id} rec={rec} preview={preview} />
        ))}
      </div>
      {preview && (
        <p style={{ marginTop: 12, color: MUTED, fontFamily: sans, fontSize: FS.xxs, background: CARD_ALT, border: `1px dashed ${BORDER}`, padding: '8px 10px' }}>
          These are <span style={{ color: GOLD, fontWeight: 800 }}>founding traditions</span> — the core each
          settlement carries from its origin. In a living campaign they gain owners, hold or fail by the year,
          and slowly change.
        </p>
      )}
    </div>
  );
}
