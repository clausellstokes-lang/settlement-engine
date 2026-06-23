/**
 * DMCompassTab — Consolidated DM-facing meta-guidance from the narrative layer.
 *
 * Four fields produced by the AI narrative pipeline live here:
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

import { FS, swatch, MUTED } from '../../theme.js';
import { Section, TabIntro } from '../Primitives';

// ── Small helpers ────────────────────────────────────────────────────────────

const has = (x) => x != null && (Array.isArray(x) ? x.length > 0 : typeof x === 'object' ? Object.keys(x).length > 0 : String(x).length > 0);

// A compass/identity-marker row: an accent-led prose line. The leading rule
// carries the group's accent colour so the rows still read as a set.
function BulletRow({ color, children }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '6px 0' }}>
      <span aria-hidden="true" style={{ flexShrink: 0, marginTop: 6, width: 8, height: 2, borderRadius: 1, background: color }} />
      <div style={{ flex: 1, fontSize: FS['12.5'], color: swatch.inkMag, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
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
          <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.ai, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Adventure hooks
          </div>
          {hooks.map((h, i) => (
            <BulletRow key={i} color="#6a2a9a">{h}</BulletRow>
          ))}
        </div>
      )}

      {redFlags.length > 0 && (
        <div style={{ marginBottom: twist ? 12 : 0 }}>
          <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.danger, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Red flags
          </div>
          {redFlags.map((r, i) => (
            <BulletRow key={i} color="#8b1a1a">{r}</BulletRow>
          ))}
        </div>
      )}

      {twist && (
        <div>
          <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch['#A0762A'], textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            If the session is dragging
          </div>
          <BulletRow color="#a0762a">{twist}</BulletRow>
        </div>
      )}
    </Section>
  );
}

function IdentityMarkersPanel({ markers }) {
  if (!Array.isArray(markers) || !markers.length) return null;
  return (
    <Section title="Identity Markers" accent="#1a5a28">
      <div style={{ fontSize: FS.xxs, color: swatch.inkMag3, marginBottom: 6, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
        Concrete details to drop into a scene as you describe the place.
      </div>
      {markers.map((m, i) => (
        <BulletRow key={i} color="#1a5a28">{m}</BulletRow>
      ))}
    </Section>
  );
}

function FrictionPointsPanel({ points }) {
  if (!Array.isArray(points) || !points.length) return null;
  return (
    <Section title="Friction Points" accent="#a0762a">
      <div style={{ fontSize: FS.xxs, color: swatch.inkMag3, marginBottom: 8, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
        Small-scale grievances between named parties. Surface them in scenes to texture daily life.
      </div>
      {points.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 10px', marginBottom: 5, background: 'rgba(160,118,42,0.06)', border: '1px solid rgba(160,118,42,0.18)', borderRadius: 5 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: FS.xs, fontWeight: 700, color: swatch.inkMag, fontFamily: 'Nunito, sans-serif', marginBottom: 2 }}>
              {p.who}
            </div>
            <div style={{ fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.5, fontFamily: 'Georgia, serif' }}>
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
      <div style={{ fontSize: FS.xxs, color: swatch.inkMag3, marginBottom: 8, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
        Named ties between people, factions, and institutions. A map for the table's politics.
      </div>
      {edges.map((e, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 10px', borderBottom: i < edges.length - 1 ? '1px solid #e0d0b0' : 'none', flexWrap: 'wrap' }}>
          <span style={{ fontSize: FS['11.5'], fontWeight: 700, color: swatch.inkMag, fontFamily: 'Nunito, sans-serif' }}>{e.from}</span>
          <span style={{ fontSize: FS.xxs, color: swatch.inkMag3, fontStyle: 'italic', padding: '0 4px', fontFamily: 'Georgia, serif' }}>{e.nature}</span>
          {e.via && (
            <>
              <span style={{ fontSize: FS.xxs, color: MUTED }}>via</span>
              <span style={{ fontSize: FS.xs, color: swatch.inkMag2, fontFamily: 'Nunito, sans-serif' }}>{e.via}</span>
            </>
          )}
          <span style={{ fontSize: FS.xxs, color: swatch.inkMag3 }}>&rarr;</span>
          <span style={{ fontSize: FS['11.5'], fontWeight: 700, color: swatch.inkMag, fontFamily: 'Nunito, sans-serif' }}>{e.to}</span>
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
      <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontSize: FS.sm, fontFamily: 'Nunito, sans-serif' }}>
        No guidance yet. Run the Narrative Layer to draw it out.
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 18px' }}>
      <TabIntro tabKey="dmCompass" />
      <CompassPanel           compass={compass} />
      <IdentityMarkersPanel   markers={markers} />
      <FrictionPointsPanel    points={points} />
      <ConnectionsMapPanel    edges={edges} />
    </div>
  );
}
