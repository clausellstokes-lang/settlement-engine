/**
 * FaithTab — the dossier's WORLD-group FAITH tab (§805: the faith half of the
 * old WarFaithTab, split out; the owner's layout landed in one act, content
 * deepening as the W-FAITH / W-LIVES trains land).
 *
 * The §805 layout, glance → sentence → table:
 *   • THE PATRON SEAT — who holds it and its legitimacy NOW (the seat's
 *     rightful claim banded, the contested marker, the seat security), derived
 *     from faithPanelModel's live ranks — nothing renders for a static embed
 *     or a deity-free town (honest absence, no fabricated seat).
 *   • NICHE OCCUPANCY — who occupies which niche of the pantheon (the
 *     religionState temperament × alignment niches, projected through
 *     faithProfile.deities[].niche). One row per creed; THESE ROWS are where
 *     the per-deity personality TOP-3 (W-LIVES), boon & bane, and the
 *     cumulative-field sentences (W-FAITH) slot in when those trains land —
 *     absent data renders as absent, never stubbed.
 *   • FAITHSECTION — the W-F6 CONSTITUTIONAL premium seam, UNCHANGED: free/anon
 *     see the generic true-neutral teaser and NEVER a deity name; an owned or
 *     shared embed renders the read-only panel to everyone. This file never
 *     adopts THEIRS' ungated WarFaithSection / useSettlementLiveWorld.
 *   • THE REALM PANTHEON — the PantheonPanel machinery (§805's named reuse),
 *     mounted for the owning DM alone: the live realm ledger names EVERY deity
 *     in the realm, so it rides the same premium ∧ ¬playerView ∧ ¬publicDossier
 *     wall the map surface's Cartographer gate expresses (P9), lazy like every
 *     other mount of the panel.
 */

import { Suspense, lazy, useMemo } from 'react';
import FaithSection from '../../settlement/FaithSection.jsx';
import { faithPanelModel } from '../../settlement/faithPanelModel.js';
import { hasPantheon } from '../../map/PantheonPanel.jsx';
import { useStore } from '../../../store/index.js';
import { BODY, BORDER, CARD, FS, GOLD, GREEN, INK, MUTED, RED, SECOND, sans } from '../../theme.js';

const PantheonPanel = lazy(() => import('../../map/PantheonPanel.jsx'));

const BAND_TONE = { good: GREEN, gold: GOLD, bad: RED };

/** A `temper:alignment` niche token in plain words ('warlike:good' → 'warlike · good'). */
function nicheWords(niche) {
  return String(niche).split(':').filter(Boolean).join(' · ');
}

/** The patron seat + its legitimacy NOW — the §805 glance. Renders only from
 *  live ranks (a static embed keeps its patron line inside FaithSection). */
function PatronSeatBlock({ patron, contested }) {
  return (
    <div data-testid="faith-patron-seat" style={{
      background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
      padding: '12px 14px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.xxs, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.07em' }}>The patron seat</span>
        {contested && (
          <span style={{ marginLeft: 'auto', fontSize: FS.xxs, fontWeight: 800, color: RED, textTransform: 'uppercase' }}>contested</span>
        )}
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5, marginTop: 6 }}>
        <strong style={{ color: INK }}>{patron.name}</strong>
        {' holds the seat — its claim is '}
        <strong style={{ color: BAND_TONE[patron.band.tone] || BODY }}>{patron.band.label}</strong>
        <span style={{ color: MUTED }}>{` (rightful claim ${Math.round(patron.legitimacy * 100)}%)`}</span>
        {contested && <span style={{ color: RED }}>{', and a rival creed presses the seat'}</span>}.
      </div>
    </div>
  );
}

/** Who occupies which niche of the pantheon. One row per creed — the future
 *  home of the per-deity top-3 / boon-bane / cumulative-field rows (W-LIVES /
 *  W-FAITH); until those trains land the row carries only what exists. */
function NicheOccupancyBlock({ ranks }) {
  return (
    <div data-testid="faith-niches" style={{ marginBottom: 14 }}>
      <div style={{ fontSize: FS.xxs, fontWeight: 800, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
        Niche occupancy
      </div>
      {ranks.map((d) => (
        <div key={d.name} data-testid="faith-niche-row" style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '8px 10px', marginBottom: 6 }}>
          <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, textTransform: 'capitalize' }}>
            {d.niche ? nicheWords(d.niche) : 'niche unrecorded'}
          </span>
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs }}>
            {' — '}{d.name}{d.isPatron ? ' (patron)' : ''} · {d.standing} · {d.share}%
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function FaithTab({ settlement, saveId = null, playerView = false, publicDossier = false }) {
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);

  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const isPremium = tier === 'premium' || elevated;
  const campaigns = useStore(s => s.campaigns);

  const model = useMemo(() => faithPanelModel(settlement), [settlement]);

  // The realm pantheon is DM-realm data (it names EVERY deity in the realm), so
  // it rides the map surface's own wall — premium/elevated (the P9 Cartographer
  // gate's spelling), never a player view or a public dossier.
  const dmRealmView = isPremium && !playerView && !publicDossier;
  const pantheonCampaign = useMemo(() => {
    if (!dmRealmView || !sid || !Array.isArray(campaigns)) return null;
    const campaign = campaigns.find(c => (c.settlementIds || []).map(String).includes(sid));
    return campaign && hasPantheon(campaign) ? campaign : null;
  }, [dmRealmView, sid, campaigns]);

  const patronRank = model.hasEmbed ? (model.ranks || []).find(d => d.isPatron) : null;
  // Honest-absence note: FaithSection renders SOMETHING unless the viewer is
  // premium/elevated AND the settlement carries no embed (its HIDDEN mode).
  const faithWillRender = !!model.hasEmbed || !isPremium;

  return (
    <div data-testid="faith-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {patronRank && <PatronSeatBlock patron={patronRank} contested={!!model.contested} />}
      {model.hasEmbed && model.ranks.length > 0 && <NicheOccupancyBlock ranks={model.ranks} />}
      {/* The gated faith surface — the constitutional seam, unchanged. */}
      <FaithSection settlement={settlement} publicDossier={publicDossier} />
      {pantheonCampaign && (
        <div data-testid="faith-realm-pantheon" style={{ marginTop: 16 }}>
          <Suspense fallback={<div style={{ padding: 12, color: MUTED, fontFamily: sans, fontSize: FS.xs }}>Loading the realm pantheon…</div>}>
            <PantheonPanel campaign={pantheonCampaign} />
          </Suspense>
        </div>
      )}
      {!faithWillRender && (
        <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.6 }}>
          This settlement keeps no named faith. Assign a patron deity to awaken its pantheon.
        </div>
      )}
    </div>
  );
}
