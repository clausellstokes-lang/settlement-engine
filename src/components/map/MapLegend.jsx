/**
 * MapLegend — persistent, collapsible legend overlaying the map (UX Phase 5, §4.5).
 *
 * Documents what the map's lines and glyphs mean: relationship-edge colors, the
 * pulse-minted war/faith channel colors, the new spatial war glyphs (deployment
 * arrow, siege ring + coalition badge, occupation shading, trade-war prize), and
 * an impact-magnitude scale. DEFAULT-COLLAPSED so a first view stays clean; the
 * open/closed state persists in component state for the session.
 *
 * Pure presentational — no store writes, no read-models. It is a static key, so it
 * renders regardless of campaign state (the glyphs it documents self-gate on the
 * map itself). Positioned bottom-left so it never collides with the right-dock
 * Realm Inspector.
 */

import { useState } from 'react';
import { Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { BORDER, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, R, SP, sans } from '../theme.js';

// Relationship edge colors — mirror RelationshipEdges STYLE / LayersPanel REL_TYPES.
const REL_KEYS = [
  { label: 'Trade partner', color: '#0f766e' },
  { label: 'Allied',        color: '#2563eb' },
  { label: 'Patron / vassal', color: '#7c3aed', dash: '6 3' },
  { label: 'Rival',         color: '#ea580c', dash: '2 3' },
  { label: 'Hostile',       color: '#991b1b' },
];

// Pulse-minted war/faith channels (RelationshipEdges WAR_FAITH_STYLE).
const CHANNEL_KEYS = [
  { label: 'War front', color: '#b91c1c' },
  { label: 'Religious authority', color: '#9333ea', dash: '5 3' },
];

function Swatch({ color, dash }) {
  return (
    <svg width="22" height="10" style={{ flexShrink: 0 }} aria-hidden="true">
      <line x1="1" y1="5" x2="21" y2="5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeDasharray={dash || undefined} />
    </svg>
  );
}

function Row({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, minHeight: 18 }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.2 }}>
      {children}
    </span>
  );
}

function GroupTitle({ children }) {
  return (
    <div style={{
      color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900,
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2,
    }}>
      {children}
    </div>
  );
}

export default function MapLegend() {
  const [open, setOpen] = useState(false); // default-collapsed — clean first view

  return (
    <div
      data-testid="map-legend"
      style={{
        position: 'absolute', left: SP.sm, bottom: SP.sm, zIndex: 20,
        width: open ? 232 : 'auto',
        border: `1px solid ${BORDER}`, borderRadius: R.md,
        background: CARD, boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
        overflow: 'hidden', fontFamily: sans,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={open ? 'Collapse legend' : 'Expand legend'}
        icon={<MapIcon size={13} color={GOLD} />}
        style={{
          display: 'flex', alignItems: 'center', gap: 7, width: '100%',
          borderRadius: 0,
          background: CARD_ALT, color: INK, fontSize: FS.xs, fontWeight: 850,
          justifyContent: 'flex-start',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>Legend</span>
        {open ? <ChevronDown size={13} color={MUTED} /> : <ChevronUp size={13} color={MUTED} />}
      </Button>

      {open && (
        <div style={{ padding: SP.sm, display: 'grid', gap: SP.sm }}>
          <div style={{ display: 'grid', gap: 3 }}>
            <GroupTitle>Relationships</GroupTitle>
            {REL_KEYS.map(k => (
              <Row key={k.label}><Swatch color={k.color} dash={k.dash} /><Label>{k.label}</Label></Row>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 3 }}>
            <GroupTitle>War &amp; Faith</GroupTitle>
            {CHANNEL_KEYS.map(k => (
              <Row key={k.label}><Swatch color={k.color} dash={k.dash} /><Label>{k.label}</Label></Row>
            ))}
            <Row>
              <svg width="22" height="14" aria-hidden="true" style={{ flexShrink: 0 }}>
                <line x1="1" y1="7" x2="17" y2="7" stroke="#b91c1c" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M16,3 L21,7 L16,11 Z" fill="#b91c1c" />
              </svg>
              <Label>Deployment (home → target)</Label>
            </Row>
            <Row>
              <svg width="22" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="9" cy="8" r="6" fill="none" stroke="#b91c1c" strokeWidth="1.6" strokeDasharray="3 2" />
                <circle cx="16" cy="3" r="4.5" fill="#b91c1c" />
                <text x="16" y="5.4" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fffbf5">2</text>
              </svg>
              <Label>Siege + coalition count</Label>
            </Row>
            <Row>
              <svg width="22" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="8" r="7" fill="#6d28d9" fillOpacity="0.18" stroke="#6d28d9" strokeOpacity="0.5" strokeDasharray="3 2" />
              </svg>
              <Label>Occupied (conquered)</Label>
            </Row>
            <Row>
              <svg width="22" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M11,2 L16,8 L11,14 L6,8 Z" fill="#a0762a" stroke="#fffbf5" strokeWidth="0.8" />
              </svg>
              <Label>Trade-war prize</Label>
            </Row>
            <Row>
              <svg width="22" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M5,11 A5,5 0 1 1 13,11" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <Label>Mobilizing (covert: dashed, DM-only)</Label>
            </Row>
          </div>

          <div style={{ display: 'grid', gap: 4 }}>
            <GroupTitle>Impact magnitude</GroupTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="80" height="16" aria-hidden="true">
                {[3, 5, 7, 9].map((r, i) => (
                  <circle key={r} cx={8 + i * 20} cy="8" r={r * 0.7} fill="#c98500" fillOpacity="0.7" stroke="#fffbf5" strokeWidth="1" />
                ))}
              </svg>
              <Label>low → high</Label>
            </div>
            <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.3 }}>
              Ring size scales with an impact&apos;s severity.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
