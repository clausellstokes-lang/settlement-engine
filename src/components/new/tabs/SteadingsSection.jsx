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

const GRADE_LABEL = {
  relic_ruin: 'Relic ruin',
  abandoned_site: 'Abandoned site',
};

export default function SteadingsSection({ settlement }) {
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
  if (!steadings.length && !grade && !ancient) return null;

  return (
    <div style={{ marginTop: 14 }}>
      {grade ? (
        <div style={{ background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`, borderLeft: `3px solid ${swatch.danger}`, borderRadius: 6, padding: '8px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.danger, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {GRADE_LABEL[grade] || 'Remnant'}
          </div>
          <div style={{ fontSize: FS.sm, color: swatch.inkMag, lineHeight: 1.4 }}>
            {grade === 'relic_ruin'
              ? 'This settlement has died; its stones stand as a relic ruin. The last residents left with the wagons — their fates unresolved. The interior is yours.'
              : 'This settlement has died; a quiet site marks where it stood. The last residents left with the wagons — their fates unresolved.'}
          </div>
        </div>
      ) : null}

      {ancient ? (
        <div style={{ background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`, borderLeft: `3px solid ${swatch.inkMag3}`, borderRadius: 6, padding: '8px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.inkMag3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ancient ruin nearby
          </div>
          <div style={{ fontSize: FS.sm, color: swatch.inkMag, lineHeight: 1.4 }}>
            The relic ruin of {ancient.name} stands nearby — a city fallen {formatCount(ancient.yearsAgo)} years ago, superstition-attracting. Its interior is yours.
          </div>
        </div>
      ) : null}

      {steadings.length ? (
        <div>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.inkMag3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Steadings ({steadings.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {steadings.map(rec => (
              <div key={rec.id} style={{ flex: '1 1 180px', minWidth: 0, background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`, borderRadius: 6, padding: '7px 10px' }}>
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
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
