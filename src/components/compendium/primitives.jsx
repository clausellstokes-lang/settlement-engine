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
  return <span title={title} style={{ fontSize:FS.xs, fontWeight:800, color, background:`${color}18`, padding:'1px 6px', letterSpacing:'0.05em', textTransform:'uppercase', marginRight:4 }}>{label}</span>;
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

// Card — the lexicon entry: a left-accent RULE, no rounded box (law §3). The
// accent rule + vertical spacing carry the unit; ink density ranks it. The card
// tint was gone already; the rounded corner is gone now too.
//
// `lead` promotes the FIRST card of a prose tab to a focal tier (larger serif
// title + a faint accent wash) so each tab has exactly one dominant entry point
// (P4) instead of a wall of co-equal cards. Use it for at most one card per tab.
export function Card({ title, sub, children, accent=GOLD, lead=false }) {
  return (
    <div style={{ borderLeft:`3px solid ${accent}`,
      padding: lead ? '12px 14px' : '10px 12px',
      background: lead ? `${accent}0d` : 'transparent',
      marginBottom: lead ? 12 : 8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:sub?2:6 }}>
        <span style={{ fontFamily:serif_, fontSize: lead ? FS.xl : FS['14'], fontWeight:700, color:INK, flex:1 }}>{title}</span>
        {sub && <span style={{ fontSize:FS.xxs, fontWeight:700, color:accent, background:`${accent}14`,
          padding:'1px 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{sub}</span>}
      </div>
      <div style={{ fontSize: lead ? FS.md : FS.sm, color:SEC, lineHeight:1.55, maxWidth:PROSE_MEASURE }}>{children}</div>
    </div>
  );
}

// BandLadder — a banded concept's FULL ladder: every level NAMED with a one-line
// reading of how to interpret a settlement at that band. Data comes from
// COMPENDIUM_DATA.bandLadders (the generated drift-contract artifact), so this
// component authors nothing — it lays the rungs out in the same accent-rule idiom
// Card uses, with each rung a name + reading row (the Tiers/Threat table rhythm).
export function BandLadder({ concept, blurb, levels = [], accent=GOLD }) {
  return (
    <div style={{ borderLeft:`3px solid ${accent}`, padding:'10px 12px', marginBottom:8 }}>
      <div style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:700, color:INK, marginBottom:blurb?2:6 }}>{concept}</div>
      {blurb && <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, maxWidth:PROSE_MEASURE, marginBottom:8 }}>{blurb}</div>}
      {levels.map((l) => (
        <div key={l.name} style={{ display:'flex', gap:10, padding:'4px 0' }}>
          <span style={{ fontSize:FS.xs, fontWeight:700, color:accent, minWidth:104, flexShrink:0 }}>{l.name}</span>
          <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5, maxWidth:PROSE_MEASURE }}>{l.reading}</span>
        </div>))}
    </div>
  );
}
