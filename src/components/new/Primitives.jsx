import { useState } from 'react';
import { FS, BODY, swatch, MUTED } from '../theme.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';

export const serif = { fontFamily: 'Crimson Text, Georgia, serif' };
export const sans  = { fontFamily: 'Nunito, sans-serif' };

/**
 * TabIntro — one-line italic prose-l intro shown beneath every tab title.
 * Source: UI Redesign §18.9 — sets the tone for each tab in one line.
 *
 * Usage:
 *   <TabIntro tabKey="overview" />
 *
 * tabKey is the same key used in copy.tabs.* (overview, summary,
 * economics, power, defense, history, relationships, plotHooks,
 * dailyLife, services, resources, viability, npcs, dmCompass).
 */
export function TabIntro({ tabKey }) {
  const line = t(`tabs.${tabKey}`);
  // If the key is missing the t() helper returns the key string itself
  // ("tabs.overview"). Render nothing in that case rather than a broken
  // pseudo-string — keeps adoption safe.
  if (!line || line === `tabs.${tabKey}`) return null;
  return (
    // Quiet supporting caption, NOT a heading: demoted from FS.xl (near the
    // settlement-name size) to FS.sm muted so the scan hits the settlement
    // identity + state first and the tone line reads as a subordinate caption,
    // not the layer-cake's top headline. Shared by every tab. (P4 / P6.)
    <p style={{
      margin: '0 0 12px 0',
      fontFamily: 'Crimson Text, Georgia, serif',
      fontSize: FS.sm,
      fontStyle: 'italic',
      color: BODY,       // ink-600 — keeps AA on the readable caption
      lineHeight: 1.5,
    }}>
      {line}
    </p>
  );
}

// Safe string coercer
export const Ti = v => v == null ? '' : typeof v === 'string' ? v
  : typeof v === 'object' ? (v.product||v.name||v.chain||v.hook||v.description||v.title||JSON.stringify(v))
  : String(v);

// Collapsible section with Crimson header + ▲/▼ (Sn in original)
export function Collapsible({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 14, border: '1px solid #e0d0b0', borderRadius: 7, overflow: 'hidden' }}>
      <Button
        variant="secondary"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        fullWidth
        style={{
          justifyContent: 'space-between',
          padding: '9px 13px', background: open ? '#f5ede0' : '#faf8f4', border: 'none',
          textAlign: 'left', borderBottom: open ? '1px solid #e0d0b0' : 'none',
          borderRadius: 0, fontWeight: 600, WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.lg, fontWeight: 600, color: swatch.inkMag }}>{title}</span>
        <span style={{ fontSize: FS.xs, color: MUTED, fontWeight: 600 }}>{open ? '\u25b2' : '\u25bc'}</span>
      </Button>
      {open && <div style={{ padding: '12px 13px', background: swatch['#FAF8F4'] }}>{children}</div>}
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
        <Button
          variant="secondary"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          fullWidth
          style={{
            justifyContent: 'space-between',
            padding: '9px 13px', background: headerBg, border: 'none',
            textAlign: 'left', borderBottom: open ? `1px solid ${borderColor}` : 'none',
            borderRadius: 0, fontWeight: 600, WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.lg, fontWeight: 600, color: titleColor }}>{title}</span>
          <span style={{ fontSize: FS.sm, color: MUTED }}>{open ? '\u25b2' : '\u25bc'}</span>
        </Button>
        {open && <div style={{ padding: '12px 13px', background: swatch['#FAF8F4'] }}>{children}</div>}
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.xl, fontWeight: 600, color: swatch.inkMag, borderBottom: '1px solid #e0d0b0', paddingBottom: 5, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function SectionHeader({ title, count }) {
  return (
    <div style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.xl, fontWeight: 600, color: swatch.inkMag, borderBottom: '1px solid #e0d0b0', paddingBottom: 5, marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
      {title}
      {count !== undefined && <span style={{ fontSize: FS.sm, color: MUTED, fontFamily: 'Nunito, sans-serif', fontWeight: 400 }}>({count})</span>}
    </div>
  );
}

// Stat card with left border — Ma in original

// Accent card (left border) — Es in original

// Basic card
export function Card({ children, style }) {
  return (
    <div style={{ background: swatch['#FAF8F4'], border: '1px solid #e0d0b0', borderRadius: 7, padding: '10px 14px', ...style }}>
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
    <span style={{ fontSize: FS.xs, fontWeight: 600, color: c, background: bg || (c + '18'), border: '1px solid ' + (border || (c + '40')), borderRadius: 10, padding: '2px 9px', display: 'inline-block', margin: '2px 3px 2px 0' }}>
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
      <span style={{ color: c, flexShrink: 0, fontSize: FS.sm }}>\u2746</span>
      <div style={{ flex: 1 }}>
        {source && <div style={{ fontSize: FS.xxs, fontWeight: 700, color: c, marginBottom: 2 }}>{source}</div>}
        <p style={{ margin: 0, fontSize: FS.sm, color: swatch.inkMag, lineHeight: 1.45, fontStyle: 'italic' }}>{txt}</p>
      </div>
    </div>
  );
}

// Dark card

// Parchment left-border card

// Empty state
export function Empty({ message }) {
  return <div style={{ padding: '24px 0', textAlign: 'center', color: MUTED, fontSize: FS.md, fontStyle: 'italic' }}>{message}</div>;
}

// Summary accordion card — js in original (mobile=accordion, desktop=always open)
