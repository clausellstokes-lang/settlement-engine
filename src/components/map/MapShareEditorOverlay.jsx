/**
 * MapShareEditorOverlay.jsx — the world-map mount point for MapShareEditor.
 *
 * A thin store-reading wrapper so WorldMap stays under the size ratchet: the
 * toolbar's "Share to gallery…" sets an open flag, and this overlay sources the
 * active campaign, its live world, and its member settlements straight from the
 * store, then renders the share editor inside a floating panel. The only props
 * the parent threads are the open flag, the close callback, and the FMG bridge
 * ref (the bridge lives on a ref in WorldMap, not the store, so it can't be
 * derived here; the ref value is snapshotted on mount for cover capture).
 *
 * Self-gating: renders nothing when closed or when there is no synced active
 * campaign to publish. The editor itself self-gates anon / unsaved campaigns.
 */

import { useMemo, useState, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { isCanonSave } from '../../domain/campaign/canon.js';
import MapShareEditor from '../gallery/MapShareEditor.jsx';
import { IconButton } from './IconButton.jsx';
import {
  BORDER, CARD, CARD_HDR, ELEV, INK, R, SP, sans, serif_, FS,
} from '../theme.js';

/**
 * @param {Object} props
 * @param {boolean} props.open    whether the share editor panel is mounted.
 * @param {() => void} props.onClose  clear the open flag in the parent.
 * @param {{ current: any }} [props.bridgeRef]  the FMG map bridge ref (cover capture).
 */
export default function MapShareEditorOverlay({ open, onClose, bridgeRef = null }) {
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const campaigns = useStore(s => s.campaigns);
  const saves = useStore(s => s.savedSettlements);
  const ownerId = useStore(s => s.auth?.user?.id);

  // Snapshot the bridge value on mount (outside render) so the editor can seed a
  // cover from the rendered map. Reading bridgeRef.current here, not in the JSX,
  // keeps render free of ref access.
  const [bridge, setBridge] = useState(null);
  useEffect(() => {
    setBridge(bridgeRef?.current || null);
  }, [bridgeRef]);

  const activeCampaign = useMemo(
    () => (campaigns || []).find(c => c.id === activeCampaignId) || null,
    [campaigns, activeCampaignId],
  );

  // The member view the editor reads: the campaign's member settlements shaped
  // as { name, tier, settlement }. A save row already carries name/tier and the
  // settlement payload, so the shape is a straight projection. Canon-only so the
  // member list matches what the campaign map actually deploys.
  const members = useMemo(() => {
    if (!activeCampaign) return [];
    const ids = new Set(activeCampaign.settlementIds || []);
    return (saves || [])
      .filter(s => ids.has(s.id) && isCanonSave(s))
      .map(s => ({ name: s.name, tier: s.tier, settlement: s.settlement }));
  }, [activeCampaign, saves]);

  if (!open || !activeCampaign) return null;

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed', inset: 0, zIndex: 120,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: SP.lg, background: 'rgba(27,20,8,0.42)', overflowY: 'auto',
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Share this map to the gallery"
        tabIndex={-1}
        style={{
          width: '100%', maxWidth: 620, marginTop: SP.xl,
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg,
          boxShadow: ELEV[2], overflow: 'hidden',
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: SP.sm, padding: `${SP.sm}px ${SP.md}px`,
          background: CARD_HDR, borderBottom: `1px solid ${BORDER}`,
        }}>
          <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.lg, fontWeight: 750 }}>
            Share to gallery
          </h2>
          <IconButton onClick={onClose} title="Close the share editor" aria-label="Close the share editor">
            <XIcon size={14} />
          </IconButton>
        </header>
        <div style={{ padding: SP.md, fontFamily: sans }}>
          <MapShareEditor
            campaign={activeCampaign}
            worldState={activeCampaign?.worldState}
            regionalGraph={activeCampaign?.regionalGraph}
            members={members}
            bridge={bridge}
            ownerId={ownerId}
            galleryImageUrl={activeCampaign?.galleryImageUrl}
            galleryImageAlt={activeCampaign?.galleryImageAlt}
            galleryImportable={activeCampaign?.galleryImportable}
            galleryWorldSections={activeCampaign?.galleryWorldSections}
          />
        </div>
      </section>
    </div>
  );
}
