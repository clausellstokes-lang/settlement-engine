/**
 * CharterRoadCard — directive 3's door: charter a road between two settlements.
 *
 * The sibling card in this folder links settlements DIPLOMATICALLY. This one
 * builds infrastructure, and the difference is the whole design: the DM chooses
 * the two ends and nothing else, because everything else about a road is the
 * map's to decide. The preview says what the world answered, in words.
 *
 * LEGIBILITY: the derivation returns an integer cost and a typed reach band. The
 * integer never reaches the table. The band becomes a sentence a person can act
 * on, and an unreachable pair says so plainly rather than offering a button that
 * would fail.
 */

import { useMemo, useState } from 'react';
import { useStore } from '../../store/index.js';
import { validateUserRoute } from '../../domain/roads/userRoutes.js';
import { activeSpatialDigest } from '../../domain/spatial/distanceRead.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, FS, swatch } from '../theme';
import Button from '../primitives/Button.jsx';

/** Typed band to prose. The closed vocabulary is the domain's; the words are ours. */
const REACH_PROSE = Object.freeze({
  close: 'An easy run. Wagons could make it and be back inside a few days.',
  steady: 'A steady haul over open country. Carters will know the road by name within a year.',
  long: 'A long road. Goods will move, but slowly, and only when the season allows.',
  arduous: 'Hard country the whole way. This road will be earned, and it will cost to keep.',
});

const WATER_PROSE = 'A run of ships rather than a road: the water already carries this route.';

const REFUSAL_PROSE = Object.freeze({
  realm_not_canonized: 'This realm has no map yet, so there is no ground for a road to cross. Canonize the realm first.',
  endpoint_not_on_the_map: 'One of these settlements has not been placed on the realm map, so no path can be traced to it.',
  no_passable_path: 'No passable way runs between these two. Some places are simply too far, and that is part of what they are.',
  route_already_chartered: 'A road already runs between these two settlements.',
  endpoint_outside_the_realm: 'Both settlements must belong to the same realm.',
  endpoints_not_distinct: 'A road needs two different settlements.',
  charter_in_flight: 'That road is already being chartered. Give it a moment.',
});

function refusalText(reason) {
  return REFUSAL_PROSE[reason]
    || 'This road cannot be chartered right now.';
}

export default function CharterRoadCard({ currentSave, allSaves }) {
  const [selectedId, setSelectedId] = useState('');
  const [outcome, setOutcome] = useState(null);
  const [busy, setBusy] = useState(false);
  const campaigns = useStore(s => s.campaigns);
  const charterUserRoute = useStore(s => s.charterUserRoute);

  const saveId = currentSave?.saveData?.id == null
    ? ''
    : String(currentSave.saveData.id);
  const campaign = useMemo(() => (campaigns || []).find(
    c => (c.settlementIds || []).map(String).includes(saveId),
  ) || null, [campaigns, saveId]);
  const others = useMemo(
    () => (allSaves || []).filter(s => String(s.id) !== saveId),
    [allSaves, saveId],
  );
  const selected = others.find(s => String(s.id) === selectedId) || null;

  const preview = useMemo(() => {
    if (!selected || !campaign) return null;
    return validateUserRoute({
      digest: activeSpatialDigest(campaign.worldState),
      fromSaveId: saveId,
      toSaveId: String(selected.id),
      fromSettlement: currentSave?.settlement,
      toSettlement: selected.settlement,
      memberIds: (campaign.settlementIds || []).map(String),
    });
  }, [selected, campaign, saveId, currentSave]);

  async function confirm() {
    if (!selected || busy) return;
    setBusy(true);
    setOutcome(null);
    try {
      const result = await charterUserRoute(String(selected.id));
      setOutcome(result?.ok === false || result?.status === 'failed'
        ? { ok: false, reason: result?.reason || 'charter_refused' }
        : { ok: true, name: selected.name });
      if (result?.ok !== false) setSelectedId('');
    } catch {
      setOutcome({ ok: false, reason: 'charter_refused' });
    } finally {
      setBusy(false);
    }
  }

  if (!campaign) {
    return (
      <div style={{ padding: '10px 12px', fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
        Roads run between settlements of one realm. Add this settlement to a realm first.
      </div>
    );
  }
  if (!others.length) {
    return (
      <div style={{ padding: '10px 12px', fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
        There is nowhere to build a road to yet. Save another settlement first.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 700, color: SECOND, textTransform: 'uppercase',
        letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6,
      }}
      >
        Charter a road
      </div>
      <label
        htmlFor="charter-road-endpoint"
        style={{ fontSize: FS.xs, color: SECOND, fontFamily: sans, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        Where should the road run?
        <select
          id="charter-road-endpoint"
          value={selectedId}
          onChange={(e) => { setSelectedId(e.target.value); setOutcome(null); }}
          style={{
            fontSize: FS.sm, padding: '5px 8px', border: `1px solid ${BORDER}`,
            background: CARD, color: INK, fontFamily: sans,
          }}
        >
          <option value="">Choose a settlement…</option>
          {others.map(s => (
            <option key={s.id} value={String(s.id)}>
              {s.name}{s.tier ? ` (${s.tier})` : ''}
            </option>
          ))}
        </select>
      </label>

      {preview && (
        <div
          role="status"
          style={{
            padding: '8px 10px', border: `1px solid ${BORDER}`,
            background: swatch['#FAF8F4'], fontSize: FS.sm, color: INK,
            fontFamily: sans, lineHeight: 1.5,
          }}
        >
          {preview.ok
            ? (preview.mode === 'water' ? WATER_PROSE : REACH_PROSE[preview.band])
            : refusalText(preview.reason)}
        </div>
      )}

      {preview?.ok && (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="info" size="sm" onClick={confirm} disabled={busy}>
            {busy ? 'Chartering…' : `Charter the road to ${selected.name}`}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setSelectedId('')} disabled={busy}>
            Cancel
          </Button>
        </div>
      )}

      {outcome && (
        <div
          role="alert"
          style={{
            padding: '8px 10px', fontSize: FS.sm, fontFamily: sans, lineHeight: 1.5,
            border: `1px solid ${BORDER}`,
            color: outcome.ok ? INK : swatch.danger,
            background: outcome.ok ? swatch['#FAF8F4'] : swatch['#FAF8F4'],
          }}
        >
          {outcome.ok
            ? `The road to ${outcome.name} is chartered. Both settlements carry it now.`
            : refusalText(outcome.reason)}
        </div>
      )}
    </div>
  );
}
