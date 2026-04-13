import React, { useState } from 'react';

export const serif = { fontFamily: 'Crimson Text, Georgia, serif' };
export const sans  = { fontFamily: 'Nunito, sans-serif' };

// Safe string coercer
export const Ti = v => v == null ? '' : typeof v === 'string' ? v
  : typeof v === 'object' ? (v.product||v.name||v.chain||v.hook||v.description||v.title||JSON.stringify(v))
  : String(v);

// Collapsible section with Crimson header + ▲/▼ (Sn in original)
export function Collapsible({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 14, border: '1px solid #e0d0b0', borderRadius: 7, overflow: 'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 13px', background: open ? '#f5ede0' : '#faf8f4', border: 'none',
        cursor: 'pointer', textAlign: 'left', borderBottom: open ? '1px solid #e0d0b0' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <span style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: 15, fontWeight: 600, color: '#1c1409' }}>{title}</span>
        <span style={{ fontSize: 11, color: '#9c8068', fontWeight: 600 }}>{open ? '\u25b2' : '\u25bc'}</span>
      </button>
      {open && <div style={{ padding: '12px 13px', background: '#faf8f4' }}>{children}</div>}
    </div>
  );
}
// Alias for HistoryTab import

// Section header (Ra in original) - optionally collapsible
export function Section({ title, collapsible = false, defaultOpen = true, accent, children }) {
  const [open, setOpen] = useState(defaultOpen);
  if (collapsible) {
    const borderColor = accent ? `${accent}50` : '#e0d0b0';
    const headerBg   = accent ? `${accent}12` : (open ? '#f5ede0' : '#faf8f4');
    const titleColor = accent || '#1c1409';
    return (
      <div style={{ marginBottom: 16, border: `1px solid ${borderColor}`, borderLeft: accent ? `3px solid ${accent}` : '1px solid #e0d0b0', borderRadius: 7, overflow: 'hidden' }}>
        <button onClick={() => setOpen(v => !v)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 13px', background: headerBg, border: 'none',
          cursor: 'pointer', textAlign: 'left', borderBottom: open ? `1px solid ${borderColor}` : 'none',
          WebkitTapHighlightColor: 'transparent',
        }}>
          <span style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: 15, fontWeight: 600, color: titleColor }}>{title}</span>
          <span style={{ fontSize: 12, color: '#9c8068' }}>{open ? '\u25b2' : '\u25bc'}</span>
        </button>
        {open && <div style={{ padding: '12px 13px', background: '#faf8f4' }}>{children}</div>}
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: 17, fontWeight: 600, color: '#1c1409', borderBottom: '1px solid #e0d0b0', paddingBottom: 5, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function SectionHeader({ title, count }) {
  return (
    <div style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: 17, fontWeight: 600, color: '#1c1409', borderBottom: '1px solid #e0d0b0', paddingBottom: 5, marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
      {title}
      {count !== undefined && <span style={{ fontSize: 12, color: '#9c8068', fontFamily: 'Nunito, sans-serif', fontWeight: 400 }}>({count})</span>}
    </div>
  );
}

// Stat card with left border — Ma in original

// Accent card (left border) — Es in original

// Basic card
export function Card({ children, style }) {
  return (
    <div style={{ background: '#faf8f4', border: '1px solid #e0d0b0', borderRadius: 7, padding: '10px 14px', ...style }}>
      {children}
    </div>
  );
}

// Score bar — nl in original

// Power bar — j1 in original

// Stat row

// Inline badge

// Small pill tag
export function Tag({ color, bg, border, children }) {
  const c = color || '#6b5340';
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: c, background: bg || (c + '18'), border: '1px solid ' + (border || (c + '40')), borderRadius: 10, padding: '2px 9px', display: 'inline-block', margin: '2px 3px 2px 0' }}>
      {children}
    </span>
  );
}

// Role badge pill — u1 in original

// Influence dots — h1 in original

// Plot hook row
export function PlotHook({ text, source, color }) {
  const c = color || '#5a2a8a';
  const txt = Ti(text);
  return (
    <div style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid #f0e8d8' }}>
      <span style={{ color: c, flexShrink: 0, fontSize: 12 }}>\u2746</span>
      <div style={{ flex: 1 }}>
        {source && <div style={{ fontSize: 10, fontWeight: 700, color: c, marginBottom: 2 }}>{source}</div>}
        <p style={{ margin: 0, fontSize: 12, color: '#1c1409', lineHeight: 1.45, fontStyle: 'italic' }}>{txt}</p>
      </div>
    </div>
  );
}

// Dark card

// Parchment left-border card

// Empty state
export function Empty({ message }) {
  return <div style={{ padding: '24px 0', textAlign: 'center', color: '#9c8068', fontSize: 13, fontStyle: 'italic' }}>{message}</div>;
}

// Summary accordion card — js in original (mobile=accordion, desktop=always open)
