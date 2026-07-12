/**
 * RumorsTab — the dossier's "Rumors & News" World-area sub-tab (Phase 5.5
 * STEP 3.5): what THIS settlement has heard of the wider realm, as it believes
 * it — the trade-carrier rumor ledger projected through the settlementRumors
 * read-model.
 *
 * THE ASYMMETRY SEAM (mirrors WarFaithTab / FaithSection): every viewer sees
 * the PLAYER projection (whitelisted, value-scrubbed — no causeClass, no
 * fidelity internals, no provenance, deity names only via ACTIVATED public
 * snapshots). ONLY a premium/elevated OWNER view (never playerView, never a
 * public dossier) passes includeGroundTruth, adding the per-rumor DM truth
 * block (what actually happened, the relay chain, where the players' picture
 * is wrong). The share/gallery pipeline strips at the EXISTING publicSafe
 * seam — this surface renders from the campaign store only, never into a
 * public projection.
 *
 * Partition idiom (WizardNewsPanel): "Concerning this settlement" vs "Word
 * from the wider realm", split on whether the telling's subjects include this
 * settlement. Lazy chunk (OutputContainer lazy-imports this file) — zero
 * first-paint bytes. Fiction-not-internals copy throughout.
 */

import { useMemo } from 'react';
import { useStore } from '../../../store/index.js';
import {
  settlementRumors,
  activatedDeityNamesFrom,
} from '../../../domain/display/settlementRumors.js';
import {
  BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GOLD_BG, INK, MUTED, R, SECOND, sans,
} from '../../theme.js';

const CONFIDENCE_LABEL = {
  certain: 'Known here firsthand',
  corroborated: 'Told by more than one road',
  credible: 'Credible word',
  unverified: 'A single unverified telling',
};

const FRESHNESS_LABEL = { fresh: 'fresh', recent: 'recent', old: 'old news' };

function RumorCard({ rumor, nameFor }) {
  const major = rumor.significance === 'major';
  const truth = rumor.truth || null;
  return (
    <article style={{
      border: `1px solid ${major ? GOLD : BORDER}`,
      borderRadius: R.md,
      background: major ? GOLD_BG : CARD,
      padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <h4 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900, overflowWrap: 'anywhere' }}>
          {rumor.headline}
        </h4>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, whiteSpace: 'nowrap' }}>
          {FRESHNESS_LABEL[rumor.freshness] || rumor.freshness} · {rumor.distance}
        </span>
      </div>
      {rumor.detail && (
        <p style={{ margin: '5px 0 0', color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
          {rumor.detail}
        </p>
      )}
      <div style={{ marginTop: 6, color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
        {CONFIDENCE_LABEL[rumor.confidence] || rumor.confidence}
        {rumor.agoTicks > 0 && ` · heard ${rumor.agoTicks} ${rumor.agoTicks === 1 ? 'week' : 'weeks'} ago`}
      </div>
      {truth && (
        <details style={{ marginTop: 8, border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD_ALT, overflow: 'hidden' }}>
          <summary style={{ cursor: 'pointer', padding: '5px 9px', color: GOLD, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900 }}>
            DM truth
          </summary>
          <div style={{ padding: '7px 9px', color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.5 }}>
            {truth.trueHeadline && <div><strong style={{ color: INK }}>What happened:</strong> {truth.trueHeadline}</div>}
            <div>
              <strong style={{ color: INK }}>The road it took:</strong>{' '}
              {[truth.provenance.originId, ...truth.provenance.relayIds].map(nameFor).join(' → ')}
              {` (${truth.hopCount} ${truth.hopCount === 1 ? 'hop' : 'hops'})`}
            </div>
            <div>
              <strong style={{ color: INK }}>Independent tellings:</strong> {truth.independentSources}
            </div>
            {truth.divergence.length > 0 && (
              <div style={{ color: SECOND }}>
                <strong style={{ color: INK }}>Where they are wrong:</strong> {truth.divergence.join('; ')}
              </div>
            )}
            {truth.divergence.length === 0 && (
              <div style={{ color: SECOND }}>The tale arrived true.</div>
            )}
          </div>
        </details>
      )}
    </article>
  );
}

function Column({ title, rumors, emptyText, nameFor }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>{title}</h3>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>{rumors.length}</span>
      </div>
      {rumors.length === 0 ? (
        <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.md, padding: 14, color: MUTED, fontFamily: sans, fontSize: FS.xs, background: CARD_ALT }}>
          {emptyText}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rumors.map(rumor => <RumorCard key={rumor.id} rumor={rumor} nameFor={nameFor} />)}
        </div>
      )}
    </div>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function RumorsTab({ settlement, saveId = null, playerView = false, publicDossier = false }) {
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);

  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // DM truth is a premium/DM-owner reveal (the includeGroundTruth convention):
  // never on the player view, never on a public/shared dossier.
  const includeGroundTruth = (tier === 'premium' || elevated) && !playerView && !publicDossier;

  const nameFor = useMemo(() => {
    const byId = new Map();
    (savedSettlements || []).forEach(s => {
      const i = String(s?.id ?? s?.settlement?.id ?? '');
      if (i) byId.set(i, s?.settlement?.name || s?.name || i);
    });
    return (id) => byId.get(String(id)) || String(id);
  }, [savedSettlements]);

  // The ACTIVATED public deity names (embedded snapshots — the FaithSection
  // seam). The read-model scrubs every other deity name from player fiction.
  const activatedDeityNames = useMemo(
    () => activatedDeityNamesFrom(savedSettlements),
    [savedSettlements],
  );

  const view = useMemo(() => {
    if (!sid || !Array.isArray(campaigns)) return null;
    const campaign = campaigns.find(c =>
      (c.settlementIds || []).map(String).includes(sid) && c.worldState?.spatialLedgers?.rumorLedgers);
    if (!campaign) return null;
    const rumors = settlementRumors({
      worldState: campaign.worldState,
      settlementId: sid,
      includeGroundTruth,
      activatedDeityNames,
      nameFor,
      wizardNews: includeGroundTruth ? campaign.wizardNews : null,
    });
    // The WizardNewsPanel partition idiom: what concerns THIS settlement vs
    // word of the wider realm — split on the telling's subjects.
    const mine = [];
    const elsewhere = [];
    for (const rumor of rumors) {
      const touchesMine = rumor.whereId === sid || (rumor.subjectIds || []).includes(sid);
      (touchesMine ? mine : elsewhere).push(rumor);
    }
    return { mine, elsewhere };
  }, [sid, campaigns, includeGroundTruth, activatedDeityNames, nameFor]);

  if (!view) {
    return (
      <div data-testid="rumors-tab" style={{ padding: '12px 14px', fontFamily: sans, color: MUTED, fontSize: FS.sm }}>
        No word travels here yet — the realm's news reaches {settlement?.name || 'this settlement'} the moment it happens.
      </div>
    );
  }

  return (
    <div data-testid="rumors-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <p style={{ margin: '0 0 12px', color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
        What {settlement?.name || 'this settlement'} has heard, as it believes it — word travels the
        trade roads, and the roads are long.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 14,
        alignItems: 'start',
      }}>
        <Column
          title="Concerning this settlement"
          rumors={view.mine}
          emptyText="No word concerning this settlement has arrived."
          nameFor={nameFor}
        />
        <Column
          title="Word from the wider realm"
          rumors={view.elsewhere}
          emptyText="No word from the wider realm has arrived yet."
          nameFor={nameFor}
        />
      </div>
    </div>
  );
}
