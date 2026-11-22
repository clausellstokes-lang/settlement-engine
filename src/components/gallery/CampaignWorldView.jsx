/**
 * CampaignWorldView.jsx — the §807 shared-campaign gallery view.
 *
 * The owner's ruling, made a surface: the read-only realm map as INDEX
 * (pan/zoom/hover/click live; NO editing affordance exists on this surface at
 * all — it never mounts the owner map stack, so stripping is structural, not
 * conditional), ONE full-width READ-ONLY dossier mounted below it as CONTENT,
 * single-selection replace-on-click (never N mounted dossiers — §807(e): one
 * dossier at a time + the dossier's own lazy-tab machinery is the perf
 * posture), and the view scrolling to the DOSSIER HEAD on selection (§807(a),
 * the §777 head-first law extended to viewers).
 *
 * §807(c): the WAR and FAITH world tabs ride the MAP HEADER here — the map IS
 * the world surface in gallery view. They render the sharer's pre-sanitized
 * world snapshot slices (warNetwork / pantheon) through CampaignStatePanel,
 * and §807(d) binds their PRESENCE to the sharer's EXISTING WorldSectionToggles
 * consent (sections) — no new entitlement surface; a disabled or empty section
 * simply has no tab. The remaining shared sections (world clock / dashboard /
 * chronicle) keep their panel below the dossier, minus whichever sections the
 * header tabs already carry.
 *
 * THE INDEX'S HONESTY LINE: an image-backdrop share stores placements in the
 * backdrop's own pixel space ({imageUrl, w, h} — mapSlice.setMapBackdrop), so
 * pins render at their TRUE positions. A generated-terrain (FMG) share ships
 * only a viewport-framed raster whose camera is not in the payload, so pin
 * geography is NOT derivable — the map still pans/zooms, and the settlement
 * rail below it carries the click-to-open index instead of fabricated pins.
 * (Exact FMG pinning needs the capture frame in the share payload — a schema
 * change, recorded for the owner's desk, not built here.)
 */

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CampaignStatePanel, { sectionHasContent } from './CampaignStatePanel.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

// §807(e) — one dossier at a time IS the perf posture: the whole dossier stack
// (PublicDossierView → OutputContainer + its lazy tabs) loads only when a
// viewer actually selects a settlement, and the gallery chunk stays light.
const PublicDossierView = lazy(() => import('../PublicDossierView.jsx'));
import { navigate } from '../../hooks/useRoute.js';
import {
  BORDER, BORDER2, CARD, CARD_ALT, FS, MUTED, PARCH, SECOND, SP, sans,
} from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

const MIN_SCALE = 1;
const MAX_SCALE = 6;

/** The pan/zoom read-only map ground. Pins render only in image-backdrop mode
 *  (true positions); the FMG raster pans/zooms without pins (see header). */
function RealmIndexMap({ img, imageAlt, backdrop, pins, selectedId, onSelect }) {
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef(null);
  const dragRef = useRef(null);

  const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setView((v) => {
      const next = clampScale(v.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
      const k = next / v.scale;
      // Zoom toward the cursor: keep the point under it fixed.
      return { scale: next, tx: cx - k * (cx - v.tx), ty: cy - k * (cy - v.ty) };
    });
  }, []);

  // A wheel listener via ref so preventDefault works (React's onWheel is passive).
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    frame.addEventListener('wheel', onWheel, { passive: false });
    return () => frame.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, tx: view.tx, ty: view.ty };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    setView((v) => ({ ...v, tx: d.tx + (e.clientX - d.sx), ty: d.ty + (e.clientY - d.sy) }));
  };
  const endDrag = () => { dragRef.current = null; setDragging(false); };
  const zoomBy = (k) => setView((v) => {
    const frame = frameRef.current;
    const rect = frame ? frame.getBoundingClientRect() : { width: 0, height: 0 };
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const next = clampScale(v.scale * k);
    const kk = next / v.scale;
    return { scale: next, tx: cx - kk * (cx - v.tx), ty: cy - kk * (cy - v.ty) };
  });

  return (
    <div data-testid="campaign-realm-index" style={{ position: 'relative', background: CARD_ALT, borderBottom: `1px solid ${BORDER}` }}>
      <div
        ref={frameRef}
        role="presentation"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        style={{ overflow: 'hidden', height: 'min(52vh, 460px)', cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
      >
        <div style={{
          transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
          transformOrigin: '0 0', width: '100%', height: '100%', position: 'relative',
        }}>
          {img ? (
            <img src={img} alt={imageAlt || 'Realm map'} draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', userSelect: 'none' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm, background: PARCH }}>
              Generated terrain
            </div>
          )}
          {/* True-position pins — image-backdrop shares only (placements live in
              the backdrop's own pixel space). Counter-scaled so they stay a
              readable size at any zoom. The IconButton primitive keeps the
              focus ring, target floor, and aria-pressed selection channel. */}
          {backdrop && pins.map((pin) => (
            <div key={pin.id} style={{
              position: 'absolute',
              left: `${(pin.x / backdrop.w) * 100}%`,
              top: `${(pin.y / backdrop.h) * 100}%`,
              transform: `translate(-50%, -50%) scale(${1 / view.scale})`,
            }}>
              <IconButton
                glyph="◆"
                label={`Open the dossier for ${pin.name}`}
                size="sm"
                tone={pin.memberId === selectedId ? 'primary' : 'default'}
                pressed={pin.memberId === selectedId}
                onClick={() => onSelect(pin.memberId)}
                onPointerDown={(e) => e.stopPropagation()}
                data-testid="campaign-map-pin"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Zoom controls — the keyboard/coarse-pointer affordance beside the wheel. */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
        <Button variant="secondary" size="sm" aria-label="Zoom in" onClick={() => zoomBy(1.3)}>+</Button>
        <Button variant="secondary" size="sm" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.3)}>−</Button>
        <Button variant="secondary" size="sm" aria-label="Reset the map view" onClick={() => setView({ tx: 0, ty: 0, scale: 1 })}>Reset</Button>
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.detail  the get_gallery_map payload (slug, name, mapState,
 *   world, members, imageUrl, imageAlt).
 */
export default function CampaignWorldView({ detail }) {
  const mobile = useIsMobile();
  const d = detail || {};
  const members = useMemo(() => (Array.isArray(d.members) ? d.members : []), [d.members]);
  const snapshot = d.world?.snapshot || null;
  const sections = useMemo(() => (Array.isArray(d.world?.sections) ? d.world.sections.map(String) : []), [d.world]);

  // §807(c)+(d): the header WAR/FAITH tabs exist only where the sharer's
  // consent (sections) AND the snapshot's own content agree — presence answered
  // through the panel's own renderer gates (sectionHasContent).
  const warTab = sections.includes('warNetwork') && sectionHasContent(snapshot, 'warNetwork');
  const faithTab = sections.includes('pantheon') && sectionHasContent(snapshot, 'pantheon');
  const [headerTab, setHeaderTab] = useState('map');
  const activeHeaderTab = (headerTab === 'war' && warTab) || (headerTab === 'faith' && faithTab) ? headerTab : 'map';

  // §807: single selection, replace-on-click — ONE mounted dossier, ever.
  const [selectedId, setSelectedId] = useState(null);
  const dossierHeadRef = useRef(null);
  const selected = useMemo(
    () => members.find((m) => String(m.old_id) === String(selectedId)) || null,
    [members, selectedId],
  );

  const selectMember = useCallback((memberId) => {
    const member = members.find((m) => String(m.old_id) === String(memberId));
    if (!member) return;
    if (member.settlement) { setSelectedId(String(memberId)); return; }
    // A member with no shared dossier payload but a published slug of its own
    // cross-links to its standalone page (the legacy affordance, kept honest).
    if (member.public_slug) navigate('gallery', { params: { slug: member.public_slug } });
  }, [members]);

  // §807(a) — on selection the view scrolls to the DOSSIER HEAD (§777's
  // head-first law extended to viewers). Fires only on a real selection.
  useEffect(() => {
    if (!selectedId || !dossierHeadRef.current) return;
    try { dossierHeadRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch { /* no-op */ }
  }, [selectedId]);

  // The pin set: image-backdrop shares carry placements in backdrop pixels.
  const backdrop = d.mapState?.customBackdrop?.imageUrl
    && Number(d.mapState.customBackdrop.w) > 0 && Number(d.mapState.customBackdrop.h) > 0
    ? d.mapState.customBackdrop : null;
  const pins = useMemo(() => {
    if (!backdrop) return [];
    const placements = d.mapState?.placements && typeof d.mapState.placements === 'object' ? d.mapState.placements : {};
    const byId = new Map(members.map((m) => [String(m.old_id), m]));
    return Object.entries(placements)
      .map(([placementId, p]) => {
        const member = p && byId.get(String(p.settlementId));
        if (!member || typeof p.x !== 'number' || typeof p.y !== 'number') return null;
        return { id: placementId, memberId: String(member.old_id), name: member.name || 'Settlement', x: p.x, y: p.y };
      })
      .filter(Boolean);
  }, [backdrop, d.mapState, members]);

  const img = backdrop ? backdrop.imageUrl : (d.imageUrl || null);
  const belowSections = sections.filter((key) => !(key === 'warNetwork' && warTab) && !(key === 'pantheon' && faithTab));

  return (
    <div data-testid="campaign-world-view" style={{ display: 'grid', gap: SP.md }}>
      <div style={{ border: `1px solid ${BORDER}`, background: CARD, overflow: 'hidden' }}>
        {/* THE MAP HEADER — the world surface's own tab strip (§807(c)). */}
        {(warTab || faithTab) && (
          <div role="tablist" aria-label="World" data-testid="campaign-map-header-tabs" style={{ display: 'flex', gap: 4, padding: 6, background: PARCH, borderBottom: `1px solid ${BORDER}` }}>
            {[['map', 'Map'], ...(warTab ? [['war', 'War']] : []), ...(faithTab ? [['faith', 'Faith']] : [])].map(([id, label]) => (
              <Button key={id} role="tab" aria-selected={activeHeaderTab === id}
                variant={activeHeaderTab === id ? 'gold' : 'secondary'} size="sm"
                onClick={() => setHeaderTab(id)}>{label}</Button>
            ))}
          </div>
        )}
        {activeHeaderTab === 'map' && (
          <RealmIndexMap img={img} imageAlt={d.imageAlt} backdrop={backdrop} pins={pins} selectedId={selectedId} onSelect={selectMember} />
        )}
        {activeHeaderTab === 'war' && (
          <div data-testid="campaign-header-war" style={{ padding: SP.lg }}>
            <CampaignStatePanel snapshot={snapshot} sections={['warNetwork']} />
          </div>
        )}
        {activeHeaderTab === 'faith' && (
          <div data-testid="campaign-header-faith" style={{ padding: SP.lg }}>
            <CampaignStatePanel snapshot={snapshot} sections={['pantheon']} />
          </div>
        )}
        {/* The settlement rail — the index in words. Always present (it is the
            keyboard path in image mode and the WHOLE index for a terrain share). */}
        {members.length > 0 && (
          <div data-testid="campaign-member-rail" style={{ padding: SP.md, display: 'flex', flexWrap: 'wrap', gap: SP.xs, borderTop: `1px solid ${BORDER2}` }}>
            {members.map((m) => (m.settlement || m.public_slug) ? (
              <Button key={m.old_id} variant={String(m.old_id) === String(selectedId) ? 'gold' : 'ghost'} size="sm"
                aria-label={`Open the dossier for ${m.name || 'this settlement'}`}
                onClick={() => selectMember(m.old_id)}>
                {m.name || 'Settlement'}{m.tier ? ` · ${m.tier}` : ''}
              </Button>
            ) : (
              <span key={m.old_id} style={{ fontSize: chromeFontSize(FS.xs, mobile), color: SECOND, background: PARCH, border: `1px solid ${BORDER}`, padding: `2px ${SP.sm}px` }}>
                {m.name || 'Settlement'}{m.tier ? ` · ${m.tier}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ONE full-width READ-ONLY dossier — the CONTENT below the INDEX. Keyed
          by member so replace-on-click remounts clean (§807(e): a single mount;
          the dossier's own lazy tabs carry the rest of the perf posture). */}
      {selected && selected.settlement ? (
        <div ref={dossierHeadRef} data-testid="campaign-selected-dossier" style={{ border: `1px solid ${BORDER}`, background: CARD, padding: SP.lg }}>
          <Suspense fallback={<div style={{ padding: SP.lg, color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Opening the dossier…</div>}>
            <PublicDossierView
              key={String(selected.old_id)}
              showHeader={false}
              dossier={{
                settlement: selected.settlement,
                name: selected.name,
                tier: selected.tier,
                chronicle: selected.chronicle,
                // A campaign share carries no per-member DM opt-in, so the member
                // dossier renders in the player projection — never DM content
                // through a campaign link (fail closed).
                shareDm: false,
              }}
            />
          </Suspense>
        </div>
      ) : (
        <div ref={dossierHeadRef} style={{ border: `1px dashed ${BORDER}`, background: CARD_ALT, padding: SP.lg, color: MUTED, fontFamily: sans, fontSize: FS.sm, textAlign: 'center' }}>
          Choose a settlement on the map or the rail to open its dossier here.
        </div>
      )}

      {/* The rest of the sharer's living-world sections, unchanged, minus the
          ones the map header already carries. */}
      {snapshot && <CampaignStatePanel snapshot={snapshot} sections={belowSections} />}
    </div>
  );
}
