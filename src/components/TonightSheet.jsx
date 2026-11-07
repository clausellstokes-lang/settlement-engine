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
import { TONIGHT_COPY } from '../domain/summary/tonightSheet.js';

const serif = '"Crimson Text", Georgia, serif';

/**
 * @typedef {Object} TonightPalette
 * @property {string} ink    names and the opening line
 * @property {string} body   reading text
 * @property {string} faint  labels
 * @property {string} rule   hairlines
 * @property {string} card   a lifted card's ground
 * @property {string} alarm  the crisis accent
 * @property {string} accent section eyebrows
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
  return (
    <section aria-label={TONIGHT_COPY.title} data-tonight-sheet="" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sheet.opening && (
        <div style={{
          padding: '10px 12px', background: palette.card,
          border: `1px solid ${palette.rule}`, borderLeft: `3px solid ${palette.alarm}`,
        }}>
          <Eyebrow color={palette.alarm}>{sheet.crisis ? TONIGHT_COPY.crisis : TONIGHT_COPY.urgent}</Eyebrow>
          <div style={{ fontFamily: serif, fontSize: proseFontSize(FS.lg, mobile), color: palette.ink, lineHeight: 1.4 }}>
            {sheet.opening}
          </div>
        </div>
      )}

      {sheet.people.length > 0 && (
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
                    {p.why === 'secret' ? p.line : p.sameAs
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
