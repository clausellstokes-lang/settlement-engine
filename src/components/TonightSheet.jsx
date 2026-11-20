/**
 * TonightSheet.jsx — THE ONE TONIGHT SHEET ON SCREEN (X-51, the owner 2026-11-03: "There should
 * be one consolidated dub it tonight sheet").
 *
 * The Table View and Session Mode both render this and nothing else of the old Quick Guide or
 * "Tonight at the table". It is handed the composed sheet (domain/summary/tonightSheet.js ::
 * composeTonightSheet) and a palette, so the lantern table and the parchment session screen
 * each keep their own colours while the words are one.
 */
import { FS } from './theme.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../design/proseScale.js';
import { TONIGHT_COPY, printsAsWant, seatLineOf, secretLeadOf, sideReadOf } from '../domain/summary/tonightSheet.js';

const serif = '"Crimson Text", Georgia, serif';

/**
 * @typedef {Object} TonightPalette
 * @property {string} ink    names and the opening line
 * @property {string} body   reading text
 * @property {string} faint  labels
 * @property {string} rule   hairlines
 * @property {string} card   a lifted card's ground
 * @property {string} alarm  the crisis accent (and a calm town's opening with no frame, as before)
 * @property {string} accent section eyebrows (and a framed opening's: FRAME-2 · B4, CF9)
 */

/** @param {{ children: import('react').ReactNode, color: string }} props */
function Eyebrow({ children, color }) {
  const mobile = useIsMobile();
  return (
    <div style={{
      fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 800,
      letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

/**
 * @param {{ sheet: import('../domain/summary/tonightSheet.js').TonightSheet, palette: TonightPalette }} props
 */
export default function TonightSheet({ sheet, palette }) {
  const mobile = useIsMobile();
  const why = { seat: TONIGHT_COPY.seat, secret: TONIGHT_COPY.secret, cleric: TONIGHT_COPY.cleric };
  // FRAME-2 · B4 (CF9, no drama added): an opening that is THE FRAME's (a calm town's trouble of weight) sits under the
  // sheet's neutral accent, as its other eyebrows do; a crisis keeps the alarm, and a calm town with no frame keeps
  // exactly the opening it had (CF1)
  const openingTone = sheet.frame && !sheet.crisis ? palette.accent : palette.alarm;
  return (
    <section aria-label={TONIGHT_COPY.title} data-tonight-sheet="" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sheet.opening && (
        <div style={{
          padding: '10px 12px', background: palette.card,
          border: `1px solid ${palette.rule}`, borderLeft: `3px solid ${openingTone}`,
        }}>
          <Eyebrow color={openingTone}>{sheet.crisis ? TONIGHT_COPY.crisis : sheet.frame ? TONIGHT_COPY.trouble : TONIGHT_COPY.urgent}</Eyebrow>
          <div style={{ fontFamily: serif, fontSize: proseFontSize(FS.lg, mobile), color: palette.ink, lineHeight: 1.4 }}>
            {sheet.opening}
          </div>
          {sheet.frame && sheet.frame.hooks.length > 0 && (
            <ul data-tonight-trouble-hooks="" style={{ margin: '6px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {sheet.frame.hooks.map((h) => (
                <li key={h} style={{ fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.45 }}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {sheet.frame && (
        <div data-tonight-sides="">
          <Eyebrow color={palette.accent}>{TONIGHT_COPY.sides}</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sheet.frame.sides.map((side) => {
              const read = sideReadOf(side);
              return (
                <div key={read.words} style={{ paddingLeft: 9, borderLeft: `2px solid ${palette.rule}` }}>
                  <div style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, color: palette.faint }}>{read.words}</div>
                  {read.who && <div style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: palette.ink }}>{read.who}</div>}
                  <div style={{ fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.45 }}>{read.why}</div>
                  {read.wants && <div style={{ fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.45 }}>{read.wants}</div>}
                </div>
              );
            })}
          </div>
          {/* FRAME-7 · F5R: the seat's holder, where the holder stands on no side, in the sheet's one seat line */}
          {sheet.seat && (
            <div data-tonight-seat="" style={{ marginTop: 8, fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.45 }}>
              {seatLineOf(sheet.seat)}
            </div>
          )}
        </div>
      )}

      {!sheet.frame && sheet.people.length > 0 && (
        <div>
          <Eyebrow color={palette.accent}>{TONIGHT_COPY.people}</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sheet.people.map((p) => (
              <div key={p.name} style={{ paddingLeft: 9, borderLeft: `2px solid ${palette.rule}` }}>
                <div style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: palette.ink }}>{p.name}</div>
                <div style={{ fontSize: chromeFontSize(FS.xs, mobile), color: palette.faint }}>
                  {[p.role, p.castLabel || why[p.why]].filter(Boolean).join(' · ')}
                </div>
                {p.line && (
                  <div style={{ fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.45 }}>
                    {!printsAsWant(p) ? <>{secretLeadOf(p) && <><span style={{ fontWeight: 800 }}>{secretLeadOf(p)}</span> </>}{p.line}</> : p.sameAs
                      ? <><span style={{ fontWeight: 800 }}>{TONIGHT_COPY.wantsSame}</span> {p.sameAs}.</>
                      : <><span style={{ fontWeight: 800 }}>{TONIGHT_COPY.wants}</span> {p.line}</>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sheet.facts.length > 0 && (
        <div>
          <Eyebrow color={palette.accent}>{TONIGHT_COPY.facts}</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {sheet.facts.map((f) => (
              <div key={f.id} style={{ fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.45 }}>
                <span style={{ fontWeight: 800, color: palette.ink }}>{f.label}</span> {f.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {sheet.hooks.length > 0 && (
        <div>
          <Eyebrow color={palette.accent}>{TONIGHT_COPY.hooks}</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sheet.hooks.map((h) => (
              <div key={h.text} style={{
                padding: '8px 10px', background: palette.card,
                border: `1px solid ${palette.rule}`,
              }}>
                {h.source && <div style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: palette.ink }}>{h.source}</div>}
                <div style={{ fontSize: proseFontSize(FS.sm, mobile), color: palette.body, lineHeight: 1.5 }}>{h.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
