/**
 * CampaignPlayerView.jsx — V-25b THE CAMPAIGN PLAYER VIEW. The read-only player face a party
 * reaches by pasting a campaign's UNLISTED link (/gallery?slug=<hex>). It renders the world as
 * its inhabitants see it — the owner's opted-in living-world sections (CampaignStatePanel) — and
 * NEVER the DM's ledger.
 *
 * PLAYER-SAFE BY CONSTRUCTION: it is fed only the adapter's output (adaptUnlistedCampaign), whose
 * `world.snapshot` was projected through serializeWorldSnapshotPublic at share time (allowlist,
 * covert-off). This component reaches no store and no raw worldState — a pure presentational leaf,
 * store-free like FogPlayerView. It shows nothing the public map share does not already show.
 *
 * @enforced-by tests/lib/unlistedCampaignAdapter.test.js
 */
import CampaignStatePanel from './CampaignStatePanel.jsx';
import Button from '../primitives/Button.jsx';
import { BORDER, CARD, CARD_ALT, INK, INK_DEEP, MUTED, SECOND, PARCH, sans, serif_, SP, FS } from '../theme.js';

/**
 * @param {{ campaign: { name: string, description: string|null, realmArcSummary: string|null,
 *   imageUrl: string|null, world: { snapshot: any, sections: any } }, onBack?: () => void }} props
 */
export default function CampaignPlayerView({ campaign, onBack }) {
  if (!campaign || typeof campaign !== 'object') return null;
  const { name, description, realmArcSummary, imageUrl, world } = campaign;
  return (
    <div style={{ fontFamily: sans, display: 'grid', gap: SP.md }} data-testid="campaign-player-view">
      {typeof onBack === 'function' && (
        <Button variant="ghost" size="sm" onClick={onBack} style={{ justifySelf: 'start' }}>← Back to the gallery</Button>
      )}
      <div style={{ border: `1px solid ${BORDER}`, background: CARD, overflow: 'hidden' }}>
        {imageUrl && (
          <div style={{ background: CARD_ALT, maxHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={imageUrl} alt={name || 'A shared world'} style={{ maxWidth: '100%', maxHeight: 380, display: 'block' }} />
          </div>
        )}
        <div style={{ padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK_DEEP }}>{name || 'A shared world'}</div>
          {/* The party's frame: this is the world as its people know it, not the DM's notes. */}
          <div style={{ display: 'inline-flex', alignSelf: 'start', fontSize: FS.pico, fontWeight: 700, color: SECOND, background: PARCH, border: `1px solid ${BORDER}`, padding: '1px 6px' }}>
            A shared world, read as its people know it
          </div>
          {realmArcSummary && <div style={{ fontSize: FS.sm, color: INK, fontStyle: 'italic', lineHeight: 1.5 }}>{realmArcSummary}</div>}
          {description && <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>{description}</div>}
        </div>
      </div>
      {/* The living world — the owner's opted-in, pre-sanitized snapshot sections. */}
      <CampaignStatePanel snapshot={world?.snapshot} sections={world?.sections} />
      {!world?.snapshot && (
        <p style={{ color: MUTED, fontSize: FS.sm }}>This world&apos;s living state was not shared. Only its name and story travel with the link.</p>
      )}
    </div>
  );
}
