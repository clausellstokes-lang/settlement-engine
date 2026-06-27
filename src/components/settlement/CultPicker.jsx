/**
 * CultPicker — impose (or remove) CULT-level deities beneath the settlement's
 * patron. The cult counterpart of PrimaryDeityPicker: it dispatches the store
 * action `imposeCult(refId)` (which resolves the authored deity → a frozen
 * snapshot and commits it via the IMPOSE_CULT canon event) and `imposeCult(null,
 * ref)` to remove one. The pulse never sees the picker or the store — only the
 * embedded `config.cultDeitySnapshots`.
 *
 * A cult seats in its own niche (temperament × alignment); tier capacity caps how
 * many faiths a settlement sustains, the patron reserving one slot. The control
 * shows the remaining cult slots and the current cults, and the store refuses an
 * imposition that can't be seated (full settlement / patron-niche clash), so the
 * list only ever reflects what actually took root.
 *
 * Premium-gated by `canUseCustomContent()`, like the patron picker.
 */

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { buildRegistry, customRefIdFromItem } from '../../lib/customRegistry.js';
import { capacityForTier } from '../../domain/worldPulse/religionState.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { navigate } from '../../hooks/useRoute.js';

const CULT_ACCENT = swatch['#7A4AAA'];

export default function CultPicker() {
  const settlement    = useStore(s => s.settlement);
  const customContent = useStore(s => s.customContent);
  const imposeCult    = useStore(s => s.imposeCult);
  const canUseCustom  = useStore(s => typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);

  const deities = useMemo(() => {
    const registry = buildRegistry(customContent || {});
    return registry.listCustom('deities');
  }, [customContent]);

  if (!settlement) return null;

  const config = settlement.config || {};
  const cults = Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [];
  const patronRef = config.primaryDeityRef || (config.primaryDeitySnapshot?._deityRef) || '';
  const tier = settlement.tier || config.tier || 'village';
  const cultCapacity = Math.max(0, capacityForTier(tier) - (config.primaryDeitySnapshot ? 1 : 0));
  const cultRefs = new Set(cults.map(c => String(c._deityRef || c.name || '')));

  const wrap = {
    border: `1px solid ${BORDER}`, borderLeft: `3px solid ${CULT_ACCENT}`, borderRadius: 7,
    padding: '10px 12px', background: CARD, marginBottom: 10,
  };
  const heading = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
      <span style={{ fontSize: FS.xs, fontWeight: 700, color: CULT_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Cults
      </span>
      <span style={{ fontSize: FS.micro, color: MUTED }}>{cults.length} / {cultCapacity} slots</span>
    </div>
  );

  // ── Premium gate ──────────────────────────────────────────────────────────
  if (!canUseCustom) {
    return (
      <div style={wrap}>
        {heading}
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
          Impose minor cults beneath the patron to seed a contested pantheon.{' '}
          <Button variant="ghost" size="sm" onClick={() => setPurchaseModalOpen?.(true)}>
            Upgrade to premium
          </Button>{' '}
          to author and impose deities.
        </div>
      </div>
    );
  }

  // Options: authored deities that are neither the patron nor an existing cult.
  const options = deities.filter((d) => {
    const ref = d.refId || customRefIdFromItem(d.raw);
    return ref !== patronRef && !cultRefs.has(ref);
  });

  return (
    <div style={wrap}>
      {heading}
      {cults.length > 0 && (
        <div style={{ display: 'grid', gap: 4, marginBottom: 8 }}>
          {cults.map((c) => (
            <div key={String(c._deityRef || c.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: FS.micro, color: SECOND, lineHeight: 1.4 }}>
              <span>
                <strong style={{ color: INK }}>{c.name}</strong>{' · '}{c.alignmentAxis} · {c.temperamentAxis} · {c.rankAxis}
                {c.domain ? ` · ${c.domain}` : ''}
              </span>
              <Button variant="ghost" size="sm" aria-label={`Remove cult of ${c.name}`} onClick={() => imposeCult?.(null, String(c._deityRef || c.name || ''))}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
      {deities.length === 0 ? (
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
          No deities authored yet.{' '}
          <Button variant="ghost" size="sm" onClick={() => navigate('compendium', { search: '?mode=custom&cat=deities' })}>
            Author a deity
          </Button>{' '}
          to impose one here.
        </div>
      ) : cultCapacity === 0 ? (
        <div style={{ fontSize: FS.micro, color: MUTED, lineHeight: 1.5 }}>
          This settlement is too small to sustain a cult beneath its patron. Larger settlements hold more faiths.
        </div>
      ) : (
        <>
          <select
            id="cult-deity-select"
            aria-label="Impose a cult"
            value=""
            onChange={(e) => { if (e.target.value) imposeCult?.(e.target.value); }}
            disabled={options.length === 0}
            style={{ width: '100%', padding: '5px 8px', border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: FS.sm, fontFamily: sans, color: INK, outline: 'none', background: CARD }}
          >
            <option value="">{options.length ? 'Impose a cult…' : 'No more deities to impose'}</option>
            {options.map((d) => {
              const ref = d.refId || customRefIdFromItem(d.raw);
              return <option key={ref} value={ref}>{d.name}</option>;
            })}
          </select>
          <div style={{ fontSize: FS.micro, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>
            One faith per temperament × alignment niche; a cult that clashes with the patron, or that a full settlement can't seat, is turned away.
          </div>
        </>
      )}
    </div>
  );
}
