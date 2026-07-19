/**
 * components/townMap/SettlementMapCards — the town-map viewer's hover/pin popovers.
 *
 * Split out of SettlementMapPane (the pane holds the max-lines ceiling): the two
 * viewport-clamped popover surfaces the pane shows for the active (pinned ?? hovered)
 * element — a small FloatingLabel for buildings/overlays and a richer DistrictCard.
 * Pure presentational; theme tokens only. The district swatch uses the base
 * districtColor tint (a text popover, theme-adaptive) regardless of the map lens.
 */
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, CARD, CARD_ALT, ELEV, FS, INK, MUTED, SP, sans } from '../theme.js';
import { districtColor } from './palette.js';

/** Viewport-clamped popover position (offset from the anchor, kept on-screen). */
function clampAnchor(anchor, w, h) {
  if (typeof window === 'undefined') return { left: (anchor?.x || 0) + 14, top: (anchor?.y || 0) + 14 };
  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 768;
  const left = Math.min((anchor?.x || 0) + 14, vw - w - 12);
  const top = Math.min((anchor?.y || 0) + 14, vh - h - 12);
  return { left: Math.max(12, left), top: Math.max(12, top) };
}

/** @param {{ anchor:{x:number,y:number}, children: import('react').ReactNode }} props */
export function FloatingLabel({ anchor, children }) {
  const { left, top } = clampAnchor(anchor, 240, 44);
  return (
    <div
      role="tooltip"
      style={{
        position: 'fixed', left, top, zIndex: 260, pointerEvents: 'none',
        maxWidth: 260, padding: `${SP.xs}px ${SP.md}px`,
        background: CARD, border: `1px solid ${BORDER}`,
        boxShadow: ELEV[2], fontFamily: sans, fontSize: FS.sm, lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Map-native district card (deriveAllDistricts, joined by id). Kept at
 * InstitutionCard's visual weight but non-modal (a hover/pin popover).
 * @param {{ anchor:{x:number,y:number}, mapDistrict:any, profile:any, pinned:boolean,
 *   onClose:()=>void, provenance?: Array<{family:string, familyLabel:string, ref:string, effect:string, effectLabel:string}> }} props
 */
export function DistrictCard({ anchor, mapDistrict, profile, pinned, onClose, provenance }) {
  const { left, top } = clampAnchor(anchor, 320, 260);
  const name = profile?.name || mapDistrict?.name || 'District';
  const category = profile?.category || mapDistrict?.category || 'other';
  const color = districtColor(category);
  const insts = Array.isArray(profile?.institutions) ? profile.institutions : [];
  const causes = Array.isArray(provenance) ? provenance : [];
  return (
    <div
      role={pinned ? 'dialog' : 'tooltip'}
      aria-label={`${name} — district`}
      style={{
        position: 'fixed', left, top, zIndex: 260,
        width: 'min(92vw, 320px)', maxHeight: 'min(70vh, 420px)', overflow: 'auto',
        background: CARD, border: `1px solid ${BORDER}`, boxShadow: ELEV[3],
        pointerEvents: pinned ? 'auto' : 'none',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: SP.md,
        padding: `${SP.md}px ${SP.md}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, background: CARD_ALT,
      }}>
        <span style={{ width: 12, height: 12, background: color, marginTop: 4, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 900, lineHeight: 1.25 }}>{name}</div>
          <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
            {category}
          </div>
        </div>
        {pinned && (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close district card" style={{ minHeight: 0, padding: '2px 8px' }}>
            ×
          </Button>
        )}
      </div>
      <div style={{ padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        <Row label="Wealth" value={profile?.wealth || mapDistrict?.wealth} />
        <Row label="Safety" value={profile?.safety || mapDistrict?.safety} />
        {profile?.dominantFaction?.name && <Row label="Dominant faction" value={profile.dominantFaction.name} />}
        {insts.length > 0 && (
          <Row label="Institutions" value={insts.slice(0, 4).map((i) => i.label).join(', ') + (insts.length > 4 ? `, +${insts.length - 4} more` : '')} />
        )}
        {profile?.hook && (
          <div style={{ marginTop: 2, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45 }}>{profile.hook}</div>
        )}
        {!profile && (
          <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45 }}>
            An outlying cluster with no distinct quarter.
          </div>
        )}
        {/* THE MAP EXPLAINS ITSELF (SM-5) — the v2 engine's recorded cause(s) for why
            this quarter sits, drifts, or is scarred where it is. Rendered ONLY when the
            v2 model retained provenance (a v1 map passes []); the ref is the engine's
            own string, shown verbatim (invents nothing — the InstitutionCard honesty gate). */}
        {causes.length > 0 && (
          <div style={{ marginTop: SP.xs, paddingTop: SP.sm, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Why it sits here
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {causes.map((c, i) => (
                <li key={`prov-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: FS.xs, fontWeight: 700, color: INK, fontFamily: sans }}>
                    {c.ref || c.familyLabel}
                  </span>
                  <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>
                    {`${c.familyLabel} · ${c.effectLabel}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/** @param {{ label:string, value:any }} props */
function Row({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div style={{ display: 'flex', gap: SP.sm, alignItems: 'baseline' }}>
      <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 96, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm }}>{value}</span>
    </div>
  );
}
