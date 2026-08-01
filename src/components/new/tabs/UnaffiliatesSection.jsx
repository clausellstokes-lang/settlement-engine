/**
 * UnaffiliatesSection.jsx — THE UNAFFILIATES, a settlement's half of the wanderer
 * register (design DESIGN_NPC_CONSEQUENCES.md §6c, wave W-H4).
 *
 * ONE TRUTH, TWO VIEWS. The Herald's Wanderers door shows the realm's whole roaming
 * pool; this shows the people resting HERE, and the people this settlement is holding.
 * They are the SAME projection with a settlement filter, through the SAME read model
 * (heraldWanderers), because §6c is explicit that the local view is a projection of the
 * world ledger rather than a second record. If the two ever disagree it will be because
 * somebody added a third door, not because these drifted.
 *
 * PRESENCE, NOT AN EMPTY BLOCK. The section renders nothing at all when the owning
 * campaign does not run the consequence economy, and nothing when this settlement is
 * hosting nobody — a dossier should not carry a permanent empty rubric for a system a
 * realm has switched off (the ai_notes presence lesson, applied inside a tab). A LIVE
 * realm with an empty list still gets its calm in-world sentence, because "nobody is
 * sheltering here" is a fact about the town rather than a blank.
 *
 * AUDIENCE, THROUGH THE ONE SPELLING. The covert half (whose leash a compromised official
 * was on) and the DM verbs are built ONLY for a DM-owner reading: never on a player view,
 * never on a public or shared dossier. The entitlement half of that reading is asked
 * through `viewerCanAuthor` (src/lib/viewerAuthority.js) rather than by re-spelling
 * `tier === 'premium' || elevated` here, because these verbs WRITE THE WORLD — settling,
 * killing and pardoning are authoring in the strongest sense the predicate names, and a
 * hand-copied gate on a paid surface is the exact drift the single-source law exists to
 * stop (tests/lint/premiumGateSingleSource.test.js; the resolveFaithUnlocked seam is the
 * same cure one lane over). The predicate additionally admits the `founder` tier, which no
 * code path produces today (authSlice resolveTier yields anon|free|premium and the founder
 * grant sets tier:'premium'), so the set of people who see this section is unchanged.
 * The playerView / publicDossier narrowing stays local: it is a question about the RENDER
 * PATH, which the authority predicate does not model.
 *
 * A STATIC CHILD of the already-lazy NPCs tab, per HeraldBody's rule for small children
 * of an open door: it rides the tab's chunk and costs first paint nothing.
 */

import { useMemo } from 'react';

import { useStore } from '../../../store/index.js';
import { viewerCanAuthor } from '../../../lib/viewerAuthority.js';
import { unaffiliateRows, wanderersDoorOpen } from '../../map/heraldWanderers.js';
import WandererVerbControls, { WandererUndoControl } from '../../map/WandererVerbControls.jsx';
import { FS, swatch, MUTED, BODY, BORDER, BORDER2, CARD_ALT, sans } from '../../theme.js';
import { serif } from '../Primitives';

/** One person, as a card. Deliberately quieter than the Herald's register row: this is
 *  a sidebar in somebody else's dossier, not the page the register owns. */
function UnaffiliateCard({ row, campaignId, seesSecrets }) {
  return (
    <div
      data-testid="unaffiliate-row"
      style={{
        display: 'grid', gap: 3,
        padding: '7px 9px',
        border: `1px solid ${BORDER2}`,
        borderLeft: `3px solid ${MUTED}`,
        background: CARD_ALT,
      }}
    >
      <div style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 900, color: swatch.inkMag }}>
        {row.name}
        <span style={{ fontWeight: 600, color: MUTED, marginLeft: 6 }}>({row.title})</span>
      </div>
      <div style={{ fontFamily: sans, fontSize: FS.xxs, color: BODY, lineHeight: 1.45 }}>
        {row.whyLine} {row.notorietyLine}
      </div>
      <div style={{ fontFamily: sans, fontSize: FS.xxs, color: MUTED }}>{row.whenLine}</div>
      {row.dmLine && (
        <div data-testid="unaffiliate-dm-line" style={{ fontFamily: sans, fontSize: FS.xxs, color: MUTED, fontStyle: 'italic' }}>
          {row.dmLine}
        </div>
      )}
      {seesSecrets && campaignId && (
        <WandererVerbControls
          campaignId={campaignId}
          wnpcId={row.key}
          name={row.name}
          doorsShut={!!row.doorsLine}
          places={[]}
          defaultPlaceId={row.restingId}
        />
      )}
    </div>
  );
}

/**
 * @param {{ saveId?: string|null, settlement?: any, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function UnaffiliatesSection({ saveId = null, settlement = null, playerView = false, publicDossier = false }) {
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);
  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  // ONE SPELLING of the authoring authority (see the header), narrowed by the render path.
  const canAuthor = useStore(viewerCanAuthor);
  const seesSecrets = canAuthor && !playerView && !publicDossier;

  const view = useMemo(() => {
    if (!sid || !Array.isArray(campaigns)) return null;
    const campaign = campaigns.find(c => (c.settlementIds || []).map(String).includes(sid));
    if (!campaign || !wanderersDoorOpen(campaign)) return null;
    const rows = unaffiliateRows({ campaign, settlementId: sid, saves: savedSettlements, seesSecrets });
    return { campaignId: campaign.id == null ? '' : String(campaign.id), rows };
  }, [sid, campaigns, savedSettlements, seesSecrets]);

  // The lane is dark for this realm: no rubric, no empty block, no tab noise.
  if (!view) return null;
  const { rows, campaignId } = view;

  return (
    <div data-testid="dossier-unaffiliates" style={{ marginTop: 18 }}>
      <div style={{ ...serif, fontSize: FS.lg, fontWeight: 600, color: swatch.inkMag, marginBottom: 6 }}>
        Without a place here
      </div>
      {/* The same recovery door the Herald's register carries: a ruling handed down from
          this dossier is walked back from this dossier, and a recorded death empties the
          card it was pressed in, so the control cannot live inside one. */}
      {seesSecrets && campaignId && <WandererUndoControl campaignId={campaignId} />}
      {rows.total === 0 ? (
        <div style={{ border: `1px dashed ${BORDER}`, padding: 12, fontFamily: sans, fontSize: FS.xs, color: BODY, background: CARD_ALT }}>
          Nobody is sheltering here who does not belong to something here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.roaming.map(row => (
            <UnaffiliateCard key={row.key} row={row} campaignId={campaignId} seesSecrets={seesSecrets} />
          ))}
          {rows.settled.map(row => (
            <UnaffiliateCard key={row.key} row={row} campaignId={campaignId} seesSecrets={seesSecrets} />
          ))}
        </div>
      )}
    </div>
  );
}
