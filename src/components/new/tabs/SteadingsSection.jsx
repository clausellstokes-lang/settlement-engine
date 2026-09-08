/**
 * SteadingsSection — W-LIFECYCLE stage 3: the "steadings" dossier section
 * (design §3: satellites as a section on the PARENT's dossier; remnants and
 * generation-seeded ancients as quiet banners).
 *
 * Reads the active campaign's `spatialLedgers.satellites` ledger (the RumorsTab
 * store-resolution pattern) — satellite steadings are SUB-SETTLEMENT records,
 * never saves, so this is their one dossier surface. Renders NOTHING for a
 * world without lifecycle state (zero footprint for every existing dossier).
 * Display-lazy: mounted only from the lazy dossier tab chunk.
 */
import { useMemo } from 'react';
import { useStore } from '../../../store/index.js';
import { FS, swatch, MUTED } from '../../theme.js';
import { formatCount } from '../../../domain/formatNumber.js';
import { generalDeskLines } from '../generalDeskRead.js'; // DS-GEN-8 · the general desk's ONE caller

const GRADE_LABEL = {
  relic_ruin: 'Relic ruin',
  abandoned_site: 'Abandoned site',
};

export default function SteadingsSection({ settlement, publicDossier = false, playerView = false }) {
  const sid = settlement?.id != null ? String(settlement.id) : null;
  const campaigns = useStore(s => s.campaigns);

  const steadings = useMemo(() => {
    if (!sid || !Array.isArray(campaigns)) return [];
    const campaign = campaigns.find(c =>
      (c.settlementIds || []).map(String).includes(sid) && c.worldState?.spatialLedgers?.satellites);
    const entry = campaign?.worldState?.spatialLedgers?.satellites?.[sid];
    const map = entry?.steadings || {};
    return Object.keys(map).sort().map(k => map[k]).filter(Boolean);
  }, [sid, campaigns]);

  const grade = settlement?.lifecycleStatus || settlement?.config?.lifecycleStatus || '';
  const ancient = settlement?.history?.ancientRuin || null;
  // DS-GEN-8 (`overview.steadings`) — the town's own account of its remnant grade, the
  // fallen city beside it and each steading it seeded, in the order this section already
  // renders those three things. The steadings come from the ledger resolved above, because
  // only this component holds it. Silent on a free dossier and silent where the record has
  // nothing to say (R-DST-K).
  // ⭐ MEMOISED, AND ABOVE THE EARLY RETURN (rules-of-hooks; ARCH §4.1, X-F9, SEAM car 3g):
  // from car 3 this call composes eleven of the desk's blocks through `composeStateProse`
  // rather than through a single kernel read, and the browser-side cost is unmeasured. Every
  // dependency below is stable — `steadings` is itself a memo, and the other three are the
  // props and two scalars read off the settlement.
  const desk = useMemo(
    () => generalDeskLines(settlement, {
      publicDossier, playerView, steadings, lifecycleStatus: grade, ancientRuin: ancient,
    }).steadings,
    [settlement, publicDossier, playerView, steadings, grade, ancient],
  );
  if (!steadings.length && !grade && !ancient) return null;

  return (
    <div style={{ marginTop: 14 }}>
      {grade ? (
        <div style={{ background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`, borderLeft: `3px solid ${swatch.danger}`, padding: '8px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.danger, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {GRADE_LABEL[grade] || 'Remnant'}
          </div>
          {desk.remnantLine && <div style={{ fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.45, fontStyle: 'italic', marginBottom: 4 }}>{desk.remnantLine}</div>}
          <div style={{ fontSize: FS.sm, color: swatch.inkMag, lineHeight: 1.4 }}>
            {grade === 'relic_ruin'
              ? 'This settlement has died; its stones stand as a relic ruin. The last residents left with the wagons, their fates unresolved. The interior is yours.'
              : 'This settlement has died; a quiet site marks where it stood. The last residents left with the wagons, their fates unresolved.'}
          </div>
        </div>
      ) : null}

      {ancient ? (
        <div style={{ background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`, borderLeft: `3px solid ${swatch.inkMag3}`, padding: '8px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.inkMag3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ancient ruin nearby
          </div>
          <div style={{ fontSize: FS.sm, color: swatch.inkMag, lineHeight: 1.4 }}>
            The relic ruin of {ancient.name} stands nearby, a city fallen {formatCount(ancient.yearsAgo)} years ago, superstition-attracting. Its interior is yours.
          </div>
          {desk.ruinLine && <div style={{ fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.45, fontStyle: 'italic', marginTop: 4 }}>{desk.ruinLine}</div>}
        </div>
      ) : null}

      {steadings.length ? (
        <div>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.inkMag3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Steadings ({steadings.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {steadings.map((rec, i) => (
              <div key={rec.id} style={{ flex: '1 1 180px', minWidth: 0, background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`, padding: '7px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.inkMag }}>{rec.name}</span>
                  <span style={{ fontSize: FS.xxs, color: MUTED }}>{rec.tier}</span>
                </div>
                <div style={{ fontSize: FS.xxs, color: MUTED, lineHeight: 1.5 }}>
                  {formatCount(rec.population)} folk
                  {rec.resourceKey ? ` · ${String(rec.resourceKey).replace(/_/g, ' ')}` : ''}
                  {rec.provenance === 'forced' ? ' · founded by decree' : ''}
                  {rec.charterPending ? ' · a charter awaits' : ''}
                </div>
                {/* INDEX-PAIRED with the desk's own list, which keeps a null in place. */}
                {desk.steadingLines[i] && <div style={{ fontSize: FS.xs, color: swatch.inkMag2, lineHeight: 1.45, fontStyle: 'italic', marginTop: 4 }}>{desk.steadingLines[i]}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
