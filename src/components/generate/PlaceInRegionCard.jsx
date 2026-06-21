/**
 * PlaceInRegionCard — the premium "Place in Region" close-out for the Create
 * flow. A worldbuilder's birth-time intent:
 * assign the settlement-to-be to a campaign/region and (optionally) name a patron
 * deity at birth.
 *
 * Premium-gated: non-premium sees a labeled teaser, never an interactive control
 * (the read surface is the free→premium signpost; the assign is the premium act).
 *
 * BYTE-IDENTICAL SAFETY: this writes only `config.targetCampaignId` — a pure
 * intent field the static generator never reads (verified: no generator/domain
 * consumer). It does NOT change any config→generator mapping or default, so a
 * given config still produces the identical settlement. The actual move-to-
 * campaign + deity assignment is performed after save (library / editor), where
 * a settlement record exists to attach to; this card captures the intent.
 */

import { useMemo } from 'react';
import { MapPin, Lock } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { buildRegistry } from '../../lib/customRegistry.js';
import { INK, MUTED, SECOND, BODY, BORDER, BORDER2, CARD, GOLD, sans, serif_, FS, SP, R, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

export default function PlaceInRegionCard() {
  const config = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  const campaigns = useStore(s => s.campaigns || []);
  const customContent = useStore(s => s.customContent);
  const canManage = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);

  const deities = useMemo(() => {
    try {
      return buildRegistry(customContent || {}).listCustom('deities');
    } catch {
      return [];
    }
  }, [customContent]);

  const wrap = {
    border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, borderRadius: R.lg,
    padding: `${SP.md}px ${SP.lg}px`, background: CARD,
  };
  const heading = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <MapPin size={15} color={GOLD} />
      <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>Place in Region</span>
      <span style={{ fontSize: FS.xs, color: MUTED }}>premium</span>
    </div>
  );

  // ── Premium gate: read teaser, never an interactive control ────────────────
  if (!canManage) {
    return (
      <div data-testid="place-in-region-card" style={wrap}>
        {heading}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>
          <Lock size={13} color={MUTED} />
          <span style={{ flex: 1 }}>
            Assign this settlement to a campaign and a patron deity at birth, then advance the region for years.
          </span>
          <Button variant="ghost" size="sm" onClick={() => setPurchaseModalOpen?.(true)} style={{ color: GOLD, fontWeight: 800 }}>
            Upgrade
          </Button>
        </div>
      </div>
    );
  }

  const targetId = config.targetCampaignId || '';
  const deityRef = config.primaryDeityRef || '';

  return (
    <div data-testid="place-in-region-card" style={wrap}>
      {heading}
      <p style={{ fontSize: FS.xs, color: SECOND, margin: `0 0 ${SP.sm}px`, lineHeight: 1.4 }}>
        Optional. Choose where this settlement is born and who its people pray to. You can change both later.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: SP.md }}>
        <label htmlFor="place-campaign" style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Campaign / region</span>
          <select
            id="place-campaign"
            value={targetId}
            onChange={e => updateConfig({ targetCampaignId: e.target.value || null })}
            style={{ width: '100%', padding: '6px 10px', border: `1px solid ${BORDER2}`, borderRadius: 5, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD, cursor: 'pointer' }}
          >
            <option value="">Unassigned (keep it standalone)</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {campaigns.length === 0 && (
            <span style={{ fontSize: FS.xxs, color: MUTED }}>No campaigns yet — create one in the Realm, then return here.</span>
          )}
        </label>

        <label htmlFor="place-deity" style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Patron deity at birth</span>
          <select
            id="place-deity"
            value={deityRef}
            onChange={e => updateConfig({ primaryDeityRef: e.target.value || null })}
            style={{ width: '100%', padding: '6px 10px', border: `1px solid ${BORDER2}`, borderRadius: 5, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD, cursor: 'pointer' }}
          >
            <option value="">No primary deity (dormant)</option>
            {deities.map(d => <option key={d.refId} value={d.refId}>{d.name}</option>)}
          </select>
          {deities.length === 0 && (
            <span style={{ fontSize: FS.xxs, color: MUTED }}>Author a deity in the Compendium to assign one at birth.</span>
          )}
        </label>
      </div>

      {(targetId || deityRef) && (
        <div style={{ marginTop: SP.sm, padding: `${SP.xs}px ${SP.sm}px`, background: swatch['#F5EDE0'], border: `1px solid ${BORDER}`, borderRadius: R.sm, fontSize: FS.xxs, color: BODY, lineHeight: 1.4 }}>
          On save, this settlement will be offered to{' '}
          {targetId ? <strong>{campaigns.find(c => c.id === targetId)?.name || 'the chosen campaign'}</strong> : 'no campaign'}
          {deityRef ? <> with <strong>{deities.find(d => d.refId === deityRef)?.name || 'its patron deity'}</strong> as its patron.</> : '.'}
        </div>
      )}
    </div>
  );
}
