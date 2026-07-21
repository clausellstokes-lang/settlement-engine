/**
 * ChroniclersLetterPanel — VISION V-2 THE CHRONICLER'S LETTER. Session prep in five
 * minutes: the deterministic letter composed from the campaign's news since its
 * lastReadTick, grouped and prioritized, in the house voice. "Mark as read" advances
 * the floor (and records the R-16 flags-seen baseline); "Export" downloads the letter
 * as portable text (R-17 — the downloadBlob idiom, never react-pdf bytes).
 *
 * A new lazy chunk (mounted in RealmInspector under Suspense). Zero eager.
 *
 * @enforced-by tests/domain/chroniclersLetter.test.js + tests/property/chroniclersLetterGolden.test.js
 */

import { useMemo } from 'react';
import { Mail, Check, Download, Sparkles } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { composeChroniclersLetter, letterToPlainText } from '../../domain/display/chroniclersLetter.js';
import { tickCalendarLabel } from '../../domain/display/humanizeEngineTokens.js';
import { BODY, BORDER, BORDER2, CARD_ALT, FS, GOLD, INK, MUTED, RED, SECOND, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';

/** The R-17 export: a portable, house-voiced text file (the downloadBlob idiom,
 *  inlined so the panel drags no heavy export module). C2 (bar 18): the filename
 *  speaks the calendar, not the engine's tick counter — "spring-of-year-2", via
 *  the humanizer chokepoint. */
function downloadLetter(text, tick) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const when = tickCalendarLabel(tick).replace(/^the /, '').replace(/ /g, '-');
  a.download = `chroniclers-letter-${when}.txt`;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 */
export default function ChroniclersLetterPanel({ campaign }) {
  const markCampaignLettersRead = useStore((s) => s.markCampaignLettersRead);

  const letter = useMemo(() => composeChroniclersLetter({
    wizardNews: campaign?.wizardNews,
    lastReadTick: campaign?.lastReadTick,
    simulationRules: campaign?.worldState?.simulationRules,
    flagsSeen: campaign?.flagsSeen ?? null,
  }), [campaign]);

  if (!campaign) return null;

  return (
    <div data-testid="chroniclers-letter" style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
          <Mail size={13} /> The Chronicler’s Letter
        </div>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
          tick {letter.sinceTick} → {letter.throughTick}
        </span>
      </div>

      {/* The letter body (parchment card). */}
      <div style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: SP.sm, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 650, lineHeight: 1.5, fontStyle: 'italic' }}>
          {letter.greeting}
        </p>

        {letter.deepened && (
          <div data-testid="letter-deepened" style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850 }}>
              <Sparkles size={10} color={GOLD} /> {letter.deepened.lead}
            </div>
            <ul style={{ margin: '3px 0 0', paddingLeft: 16, color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.5 }}>
              {letter.deepened.flags.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        )}

        {letter.sections.map((s) => (
          <div key={s.id} data-testid={`letter-section-${s.id}`}>
            <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {s.heading}
            </div>
            <ul style={{ margin: '3px 0 0', paddingLeft: 16, display: 'grid', gap: 3 }}>
              {s.lines.map((l) => (
                <li key={l.id} style={{ color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: l.significance === 'major' ? 800 : 650 }}>{l.headline}</span>
                  {l.significance === 'major' && <span style={{ color: RED, fontSize: FS.micro, fontWeight: 800 }}> · of great moment</span>}
                  {(l.repeats || 1) > 1 && <span style={{ color: MUTED, fontSize: FS.micro }}> · so noted {l.repeats} times</span>}
                  {l.summary ? <div style={{ color: BODY, fontSize: FS.micro, lineHeight: 1.4 }}>{l.summary}</div> : null}
                  {l.recalls ? (
                    <div style={{ color: MUTED, fontSize: FS.micro, fontStyle: 'italic', lineHeight: 1.4 }}>
                      In this my earlier record returns, from {l.recalls.when}: {l.recalls.headline}.
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {letter.truncationNote ? (
          <p data-testid="letter-truncation-note" style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.micro, fontStyle: 'italic', lineHeight: 1.4 }}>
            {letter.truncationNote}
          </p>
        ) : null}
        <p style={{ margin: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontStyle: 'italic', borderTop: `1px solid ${BORDER2}`, paddingTop: 6 }}>
          {letter.closing}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
        <Button data-testid="letter-mark-read" variant="secondary" size="sm"
          onClick={() => markCampaignLettersRead(campaign.id)}
          aria-label="Mark the chronicle read up to now. The next letter starts here"
          style={{ minHeight: undefined }}>
          <Check size={12} /> Mark as read
        </Button>
        <Button data-testid="letter-export" variant="ghost" size="sm"
          onClick={() => downloadLetter(letterToPlainText(letter), letter.throughTick)}
          aria-label="Export this letter as a portable text file"
          style={{ minHeight: undefined }}>
          <Download size={12} /> Export
        </Button>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
          {letter.counts.total} new · {letter.counts.major} of moment
        </span>
      </div>
    </div>
  );
}
