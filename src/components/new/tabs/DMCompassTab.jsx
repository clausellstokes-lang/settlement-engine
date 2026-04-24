/**
 * DMCompassTab — Consolidated DM-facing meta-guidance from the narrative layer.
 *
 * Four fields produced by the AI narrative pipeline (AI-3a) live here:
 *   • dmCompass       — 3 hooks, 2 red flags, 1 twist. Ready-to-run guidance.
 *   • identityMarkers — 4-6 concrete sensory/physical details.
 *   • frictionPoints  — 3-5 small-scale interpersonal grievances with named parties.
 *   • connectionsMap  — 4-8 named NPC↔faction↔institution edges.
 *
 * The tab is only registered in OutputContainer when at least one of these
 * fields is present on `aiSettlement`. Individual sections render only if
 * their field has content, so a partial narrative (e.g. a pass skipped
 * because the settlement has no factions) degrades gracefully.
 */

import React from 'react';
import { Sparkles, AlertTriangle, Shuffle, MapPin, Users, Network } from 'lucide-react';
import { Section } from '../Primitives';

// ── Small helpers ────────────────────────────────────────────────────────────

const has = (x) => x != null && (Array.isArray(x) ? x.length > 0 : typeof x === 'object' ? Object.keys(x).length > 0 : String(x).length > 0);

// A compass/identity-marker row: icon + prose.
function BulletRow({ icon: Icon, color, children }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '6px 0' }}>
      <span style={{ color, flexShrink: 0, marginTop: 3, display: 'flex' }}>
        <Icon size={13} />
      </span>
      <div style={{ flex: 1, fontSize: 12.5, color: '#1c1409', lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
        {children}
      </div>
    </div>
  );
}

// ── Sub-panels ───────────────────────────────────────────────────────────────

function CompassPanel({ compass }) {
  const hooks    = Array.isArray(compass?.hooks)    ? compass.hooks    : [];
  const redFlags = Array.isArray(compass?.redFlags) ? compass.redFlags : [];
  const twist    = typeof  compass?.twist === 'string' ? compass.twist : '';
  if (!hooks.length && !redFlags.length && !twist) return null;

  return (
    <Section title="DM Compass" accent="#6a2a9a">
      {hooks.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#6a2a9a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Adventure hooks
          </div>
          {hooks.map((h, i) => (
            <BulletRow key={i} icon={Sparkles} color="#6a2a9a">{h}</BulletRow>
          ))}
        </div>
      )}

      {redFlags.length > 0 && (
        <div style={{ marginBottom: twist ? 12 : 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#8b1a1a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Red flags
          </div>
          {redFlags.map((r, i) => (
            <BulletRow key={i} icon={AlertTriangle} color="#8b1a1a">{r}</BulletRow>
          ))}
        </div>
      )}

      {twist && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#a0762a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            If the session is dragging
          </div>
          <BulletRow icon={Shuffle} color="#a0762a">{twist}</BulletRow>
        </div>
      )}
    </Section>
  );
}

function IdentityMarkersPanel({ markers }) {
  if (!Array.isArray(markers) || !markers.length) return null;
  return (
    <Section title="Identity Markers" accent="#1a5a28">
      <div style={{ fontSize: 10, color: '#6b5340', marginBottom: 6, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
        Drop-in details the DM can sprinkle into description.
      </div>
      {markers.map((m, i) => (
        <BulletRow key={i} icon={MapPin} color="#1a5a28">{m}</BulletRow>
      ))}
    </Section>
  );
}

function FrictionPointsPanel({ points }) {
  if (!Array.isArray(points) || !points.length) return null;
  return (
    <Section title="Friction Points" accent="#a0762a">
      <div style={{ fontSize: 10, color: '#6b5340', marginBottom: 8, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
        Small-scale grievances between named parties — surface them in scenes to texture daily life.
      </div>
      {points.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 10px', marginBottom: 5, background: 'rgba(160,118,42,0.06)', border: '1px solid rgba(160,118,42,0.18)', borderRadius: 5 }}>
          <Users size={13} color="#a0762a" style={{ marginTop: 3, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1c1409', fontFamily: 'Nunito, sans-serif', marginBottom: 2 }}>
              {p.who}
            </div>
            <div style={{ fontSize: 12, color: '#3d2b1a', lineHeight: 1.5, fontFamily: 'Georgia, serif' }}>
              {p.what}
            </div>
          </div>
        </div>
      ))}
    </Section>
  );
}

function ConnectionsMapPanel({ edges }) {
  if (!Array.isArray(edges) || !edges.length) return null;
  return (
    <Section title="Connections Map" accent="#2a3a7a">
      <div style={{ fontSize: 10, color: '#6b5340', marginBottom: 8, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
        Explicit edges between named entities. Useful for navigating politics at the table.
      </div>
      {edges.map((e, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 10px', borderBottom: i < edges.length - 1 ? '1px solid #e0d0b0' : 'none', flexWrap: 'wrap' }}>
          <Network size={12} color="#2a3a7a" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1c1409', fontFamily: 'Nunito, sans-serif' }}>{e.from}</span>
          <span style={{ fontSize: 10, color: '#6b5340', fontStyle: 'italic', padding: '0 4px', fontFamily: 'Georgia, serif' }}>{e.nature}</span>
          {e.via && (
            <>
              <span style={{ fontSize: 10, color: '#9c8068' }}>via</span>
              <span style={{ fontSize: 11, color: '#3d2b1a', fontFamily: 'Nunito, sans-serif' }}>{e.via}</span>
            </>
          )}
          <span style={{ fontSize: 10, color: '#6b5340' }}>&rarr;</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1c1409', fontFamily: 'Nunito, sans-serif' }}>{e.to}</span>
        </div>
      ))}
    </Section>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function DMCompassTab({ settlement: s }) {
  if (!s) return null;

  const compass  = s.dmCompass;
  const markers  = s.identityMarkers;
  const points   = s.frictionPoints;
  const edges    = s.connectionsMap;

  const anyContent = has(compass) || has(markers) || has(points) || has(edges);
  if (!anyContent) {
    // Defensive — OutputContainer already gates visibility, but render a
    // gentle empty state just in case.
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#9c8068', fontSize: 12, fontFamily: 'Nunito, sans-serif' }}>
        No DM guidance yet. Generate the AI narrative to populate this tab.
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 18px' }}>
      <CompassPanel           compass={compass} />
      <IdentityMarkersPanel   markers={markers} />
      <FrictionPointsPanel    points={points} />
      <ConnectionsMapPanel    edges={edges} />
    </div>
  );
}
