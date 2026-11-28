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

import CardVoice from '../../primitives/CardVoice.jsx';
import { traditionCardId } from '../../../domain/voices/cardIds.js';
import { useMemo } from 'react';
import { motifGlyph } from '../../../domain/traditions/genesis.js';
import { shownTraditionsOf, sameWindowPlan, calendarLineOf, motifChipOf, descriptionSetOf } from '../../../domain/traditions/shownTraditions.js';
import { describeTradition } from '../../../domain/traditions/traditionDescription.js';
import { publicProseOf } from '../../../domain/display/publicProse.js';
import { useStore } from '../../../store/index.js';
import {
  BODY, BORDER, CARD, FS, GOLD, INK, MUTED, SECOND, sans,
} from '../../theme.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { MentionText } from '../../ProseParagraph.jsx';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';

const OUTCOME_LABEL = {
  triumph: 'a triumph', good: 'well kept', modest: 'modestly kept',
  troubled: 'a troubled year', failure: 'a failure', cancelled: 'set aside',
};

/** A tradition row: motif glyph, name, motif element, window phrase, and (engine mode
 *  only) owner, last outcome and provenance. Exported for the dossier search (W2-SEARCH U2).
 *  `sameWindowAs` (the tab's plan, X-50 F2 REPEAT-ONCE): the name of an earlier tradition on
 *  the tab kept in the same weeks; the calendar line then names it instead of repeating. */
export function TraditionRow({ rec, preview, sameWindowAs = null, description = '', calendarLine = null }) {
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
  // A shared-page row (CTR9) carries its chip as the owner's save drew it.
  const motifChip = typeof rec.chip === 'string' ? rec.chip : motifChipOf(rec);
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
        {calendarLine ?? calendarLineOf(rec, sameWindowAs)}
      </div>
      {/* THE DESCRIPTION (TRAD-1): two or three plain sentences from the town's own record
          (domain/traditions/traditionDescription.js), composed for this page's audience. */}
      {description && (
        <p data-testid="tradition-description" style={{ margin: '5px 0 0', color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {/* THE CARD'S ONE QUOTE (S-G1): under the description */}
      <CardVoice kind="tradition" id={traditionCardId(rec, !preview)} />
      {!preview && (
        <div style={{ marginTop: 6, display: 'flex', gap: 14, flexWrap: 'wrap', color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 750 }}>
          <span>Owner: <MentionText text={owner} structural /></span>
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

/** A row of the shared page (CTR9): the owner's save drew its chip, calendar line and the reader's description as text. */
function SharedTraditionRow({ row }) {
  const description = typeof row.text === 'string' ? row.text : '';
  const calendarLine = typeof row.when === 'string' ? row.when : '';
  return (
    <TraditionRow rec={{ id: row.id, name: row.name, chip: row.chip, coreMotif: { element: row.element } }}
      preview description={description} calendarLine={calendarLine} />
  );
}

/** A row of the owner's page (or the owner's player view): the description is composed here for this page's audience,
 *  over the audience's set (`descriptionSet`, TRAD-4 unit 10: no town prints the same sentence in two of its rites). */
function OwnTraditionRow({ rec, preview, sameWindowAs, settlement, audience, descriptionSet }) {
  const described = describeTradition(rec, settlement, { audience, set: descriptionSet });
  return <TraditionRow rec={rec} preview={preview} sameWindowAs={sameWindowAs} description={described ? described.text : ''} />;
}

/**
 * @param {{ settlement: any, saveId?: string|null, publicDossier?: boolean, playerView?: boolean }} props
 *   `publicDossier` (a shared page: the record has no seed): the tab prints the traditions the OWNER's save drew as text
 *   (`publicProse`, site `traditions`, CTR9) and never derives a set. `playerView`: the owner's own page read as the
 *   players read it; the description is composed for the reader. Neither given: the owner's page.
 */
export default function TraditionsTab({ settlement, publicDossier = false, playerView = false }) {
  // THE PHONE PROSE FLOOR — the framing paragraph, the founding note and the
  // no-traditions line. Bound above the early return so the hook order is stable.
  const mobile = useIsMobile();

  // WB-j genesis consumption — a DM's authored custom traditions merge into the PREVIEW founding set; the lit mirror
  // is the tick mover's authored truth. The set, the admissible rows (CENSUS-3b unit 5) and the calendar plan are the
  // one helper's (domain/traditions/shownTraditions.js), which the save-time composer of the shared page also reads.
  const customTraditions = useStore(s => s.customContent?.traditions);
  const shown = useMemo(
    () => (publicDossier ? null : shownTraditionsOf(settlement, customTraditions)),
    [publicDossier, settlement, customTraditions],
  );
  // THE SHARED PAGE (CTR9): the owner's set and the reader's descriptions, as the owner's save drew them. A page saved
  // before the traditions were drawn carries none, and prints no set the owner never saw.
  const sharedRows = publicDossier ? publicProseOf(settlement, 'traditions') : null;
  const preview = publicDossier ? true : !!shown?.preview;
  const traditions = publicDossier ? (Array.isArray(sharedRows) ? sharedRows : []) : (shown?.recs || []);
  const audience = playerView ? 'reader' : 'owner';
  // THE SET THE DESCRIPTIONS ROTATE OVER (TRAD-4 unit 10; shownTraditions.js :: descriptionSetOf): the owner's set for the
  // owner's page; in the player view the drawn set the shared page serves (CTR11), so the town reads the same on both.
  const descriptionSet = useMemo(
    () => (publicDossier ? null : descriptionSetOf(settlement, audience, customTraditions)),
    [publicDossier, settlement, audience, customTraditions],
  );

  const name = settlement?.name || settlement?.identity?.name || 'this settlement';
  // ONE CALENDAR LINE PER WINDOW (X-50, F2 REPEAT-ONCE): two traditions kept in the same weeks
  // are two facts and both stand; the window prints once, on the first, and a later card names it.
  const windowPlan = publicDossier ? new Map() : sameWindowPlan(traditions);

  if (!traditions || traditions.length === 0) {
    return (
      <div data-testid="traditions-tab" style={{ padding: '12px 14px', fontFamily: sans, color: MUTED, fontSize: proseFontSize(FS.sm, mobile) }}>
        {publicDossier ? <>No traditions are shared for {name}.</> : <>No traditions are recorded for {name} yet.</>}
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
        {traditions.map((rec, i) => (publicDossier
          ? <SharedTraditionRow key={rec.id || i} row={rec} />
          : <OwnTraditionRow key={rec.id} rec={rec} preview={preview} sameWindowAs={windowPlan.get(rec.id) ?? null} settlement={settlement} audience={audience} descriptionSet={descriptionSet} />
        ))}
      </div>
    </div>
  );
}
