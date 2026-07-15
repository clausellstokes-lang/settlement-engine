import { GOLD, INK, SECOND as SEC, serif_, FS } from '../theme.js';

// ── Shared primitives ───────────────────────────────────────────────────────

// Long-form card/row bodies hold to the prose reading measure (~62ch) rather
// than filling the full content column, so multi-sentence reference copy stays
// in the 45–75ch band P12 mandates even when the frame is wider.
const PROSE_MEASURE = '36em';

export function Tag({ label, color=GOLD, title }) {
  // FS.xs (not FS.micro) so the category/label pill clears the small-text floor
  // — it is a two-channel state carrier (P7), not decorative chrome.
  // `title` is an optional native tooltip for jargon labels (Core, Local) a
  // first-time reader cannot decode from the word alone.
  return <span title={title} style={{ fontSize:FS.xs, fontWeight:800, color, background:`${color}18`, borderRadius:3, padding:'1px 6px', letterSpacing:'0.05em', textTransform:'uppercase', marginRight:4 }}>{label}</span>;
}

// Rows group on the same whitespace rhythm the prose tabs use — no per-row
// hairline (the preceding SectionHeading's top margin supplies the separator),
// so a Row block reads as a clean ledger, not a spreadsheet grid (P5).
export function Row({ label, children, lw=130 }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'6px 0' }}>
      <span style={{ fontSize:FS.sm, fontWeight:700, color:INK, minWidth:lw, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5, maxWidth:PROSE_MEASURE }}>{children}</span>
    </div>
  );
}

// Card — one elevation, left-accent only (no full box). The card tint is gone:
// it was byte-identical to the content ground and did zero grouping work, so it
// only contributed box-soup. Accent rule + vertical spacing carry the unit (P5),
// matching the grid-tab cards on the same surface.
//
// `lead` promotes the FIRST card of a prose tab to a focal tier (larger serif
// title + a faint accent wash) so each tab has exactly one dominant entry point
// (P4) instead of a wall of co-equal cards. Use it for at most one card per tab.
export function Card({ title, sub, children, accent=GOLD, lead=false }) {
  return (
    <div style={{ borderLeft:`3px solid ${accent}`, borderRadius:7,
      padding: lead ? '12px 14px' : '10px 12px',
      background: lead ? `${accent}0d` : 'transparent',
      marginBottom: lead ? 12 : 8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:sub?2:6 }}>
        <span style={{ fontFamily:serif_, fontSize: lead ? FS.xl : FS['14'], fontWeight:700, color:INK, flex:1 }}>{title}</span>
        {sub && <span style={{ fontSize:FS.xxs, fontWeight:700, color:accent, background:`${accent}14`,
          borderRadius:8, padding:'1px 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{sub}</span>}
      </div>
      <div style={{ fontSize: lead ? FS.md : FS.sm, color:SEC, lineHeight:1.55, maxWidth:PROSE_MEASURE }}>{children}</div>
    </div>
  );
}
