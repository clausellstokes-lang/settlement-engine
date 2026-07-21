import { GOLD, INK, SECOND as SEC, BORDER as BOR, serif_, FS } from '../theme.js';

// ── Shared primitives ───────────────────────────────────────────────────────

export function Tag({ label, color=GOLD }) {
  return <span style={{ fontSize:FS.micro, fontWeight:800, color, background:`${color}18`, borderRadius:3, padding:'1px 6px', letterSpacing:'0.05em', textTransform:'uppercase', marginRight:4 }}>{label}</span>;
}

export function Row({ label, children, lw=130 }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
      <span style={{ fontSize:FS.sm, fontWeight:700, color:INK, minWidth:lw, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{children}</span>
    </div>
  );
}

export function Card({ title, sub, children, accent=GOLD }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${accent}`, borderRadius:7,
      padding:'10px 12px', background:'rgba(255,251,245,0.95)', marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:sub?2:6 }}>
        <span style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:700, color:INK, flex:1 }}>{title}</span>
        {sub && <span style={{ fontSize:FS.xxs, fontWeight:700, color:accent, background:`${accent}14`,
          borderRadius:8, padding:'1px 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{sub}</span>}
      </div>
      <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55 }}>{children}</div>
    </div>
  );
}

// BandLadder (W6) — render a banded concept's FULL ladder: every level named,
// each with a one-line reading of how to interpret a settlement at that band.
// Data comes from domain/compendium/bandLadders.js (a pure projection of the
// engine's typed band tables), so this component authors nothing — it only lays
// the rungs out in the same name+description row idiom the Tiers/Threat tables use.
export function BandLadder({ concept, blurb, levels = [], accent=GOLD }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${accent}`, borderRadius:7,
      padding:'10px 12px', background:'rgba(255,251,245,0.95)', marginBottom:8 }}>
      <div style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:700, color:INK, marginBottom:blurb?2:6 }}>{concept}</div>
      {blurb && <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, marginBottom:8 }}>{blurb}</div>}
      {levels.map((l) => (
        <div key={l.name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
          <span style={{ fontSize:FS.xs, fontWeight:700, color:accent, minWidth:104, flexShrink:0 }}>{l.name}</span>
          <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{l.reading}</span>
        </div>))}
    </div>
  );
}
