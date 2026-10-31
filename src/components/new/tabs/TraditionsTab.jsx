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
 *    exist only where time exists, so the preview prints no owner or outcome row at all
 *    (chair ruling 2026-10-30: two placeholder dashes are labels with no content).
 *
 * Pure read: ZERO settlement-object writes, ZERO store writes. Lazy chunk
 * (OutputContainer lazy-imports this file via dossierLazyTabs) — zero first-paint
 * bytes; the genesis leaf + corpus ride this chunk, never the eager graph.
 */

import { useMemo } from 'react';
import { deriveFoundingTraditions, describeTraditionWindow, motifGlyph } from '../../../domain/traditions/genesis.js';
import { mergeCustomFoundingTraditions } from '../../../domain/traditions/customFounding.js';
import { useStore } from '../../../store/index.js';
import {
  BODY, BORDER, CARD, FS, GOLD, INK, MUTED, SECOND, sans,
} from '../../theme.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';

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

/** A tradition row: motif glyph, name, motif element, window phrase, and (engine mode
 *  only) owner, last outcome and provenance. Exported for the dossier search (W2-SEARCH U2). */
export function TraditionRow({ rec, preview }) {
  // THE PHONE PROSE FLOOR — the window phrase and the provenance line. The name,
  // the motif chip and the owner/outcome pair keep their own steps.
  const mobile = useIsMobile();
  const owner = rec.ownerLabel || rec.ownerKey || '–';
  const outcome = OUTCOME_LABEL[rec.lastOutcome] || rec.lastOutcome || '–';
  const glyph = motifGlyph(rec.coreMotif?.element);
  const log = Array.isArray(rec.mutationLog) ? rec.mutationLog : [];
  // The mutationLog as a provenance line (design §10): a count, then the most recent
  // changes as their own readable causes (the tradition's history, most recent last).
  const recentCauses = log.map((e) => (e && typeof e.cause === 'string' ? e.cause : '')).filter(Boolean).slice(-3);
  // The epithet stands in for an empty log on a lit mirror, and in the preview only for a
  // DM-authored custom tradition (R7): the six generated preview epithets were decoration
  // restating "founding" (chair ruling 2026-10-30).
  const provenance = log.length > 0
    ? `${log.length} ${log.length === 1 ? 'change' : 'changes'} recorded: ${recentCauses.join('; ')}`
    : ((preview && !rec.custom) ? null : (rec.expression?.epithet || null));
  // The motif chip names the ELEMENT; the act is printed only when the name does not
  // already end in it (every generated name does; an authored one may not).
  const element = humanizeMotif(rec.coreMotif?.element);
  const act = humanizeMotif(rec.coreMotif?.act);
  const actInName = !act || String(rec.name || '').toLowerCase().includes(act.toLowerCase());
  const motifChip = [element, actInName ? '' : act].filter(Boolean).join(' · ');
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
          marginLeft: 'auto', color: SECOND, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800,
 whiteSpace: 'nowrap',
        }}>
          {motifChip}
        </span>
      </div>
      <div style={{ marginTop: 5, color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>
        Kept in {describeTraditionWindow(rec.window)}.
      </div>
      {!preview && (
        <div style={{ marginTop: 6, display: 'flex', gap: 14, flexWrap: 'wrap', color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 750 }}>
          <span>Owner: {owner}</span>
          <span>Last held: {outcome}</span>
        </div>
      )}
      {provenance && (
        <div style={{ marginTop: 6, color: SECOND, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), fontStyle: 'italic', lineHeight: 1.5 }}>
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
  // THE PHONE PROSE FLOOR — the framing paragraph, the founding note and the
  // no-traditions line. Bound above the early return so the hook order is stable.
  const mobile = useIsMobile();
  // ENGINE mirror when present (T-2 writes it); otherwise the pure founding preview.
  const mirror = Array.isArray(settlement?.traditions) ? settlement.traditions : null;
  const preview = !mirror || mirror.length === 0;

  // WB-j genesis consumption — a DM's authored custom traditions merge into the
  // PREVIEW founding set (empty ⇒ the pure leaf's bytes, untouched). Never merged
  // into the engine mirror (the lit mirror is the tick mover's authored truth).
  const customTraditions = useStore(s => s.customContent?.traditions);
  const traditions = useMemo(
    () => (preview
      ? mergeCustomFoundingTraditions(deriveFoundingTraditions(settlement), customTraditions)
      : mirror),
    [preview, mirror, settlement, customTraditions],
  );

  const name = settlement?.name || settlement?.identity?.name || 'this settlement';

  if (!traditions || traditions.length === 0) {
    return (
      <div data-testid="traditions-tab" style={{ padding: '12px 14px', fontFamily: sans, color: MUTED, fontSize: proseFontSize(FS.sm, mobile) }}>
        No traditions are recorded for {name} yet.
      </div>
    );
  }

  return (
    <div data-testid="traditions-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <p style={{ margin: '0 0 12px', color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>
        {preview ? (
          <>The <strong style={{ color: INK }}>founding traditions</strong> of {name}.</>
        ) : (
          <>The traditions of {name}, as the years have shaped them.</>
        )}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {traditions.map((rec) => (
          <TraditionRow key={rec.id} rec={rec} preview={preview} />
        ))}
      </div>
    </div>
  );
}
