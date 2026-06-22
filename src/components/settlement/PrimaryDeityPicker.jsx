/**
 * PrimaryDeityPicker — assign (or clear) the current settlement's primary deity.
 * This is the UI half of the embed-on-assign bridge: the
 * picker dispatches the store action `setPrimaryDeity(refId)`, which resolves the
 * authored deity → a frozen snapshot and commits it on the settlement record via
 * the SET_PRIMARY_DEITY canon event. The pulse never sees this picker or the
 * store — only the embedded snapshot.
 *
 * Premium-gated by `canUseCustomContent()`: the simulation is the premium
 * gate, and deity authoring/assignment reuses the same client gate as the rest of
 * custom content). A non-premium user sees a short upsell line instead of the
 * control. With zero authored deities the picker explains how to author one.
 */

import { useMemo } from 'react';
import { Sun } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { buildRegistry, customRefIdFromItem } from '../../lib/customRegistry.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const DEITY_ACCENT = swatch['#7A5A1A'];

export default function PrimaryDeityPicker() {
  const settlement       = useStore(s => s.settlement);
  const customContent    = useStore(s => s.customContent);
  const setPrimaryDeity  = useStore(s => s.setPrimaryDeity);
  const canUseCustom     = useStore(s => typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);

  // Authored deities (the campaign's pantheon), resolved to registry entries so
  // their stable `custom:<localUid>` ref is the option value.
  const deities = useMemo(() => {
    const registry = buildRegistry(customContent || {});
    return registry.listCustom('deities');
  }, [customContent]);

  if (!settlement) return null;

  const currentRef = settlement.config?.primaryDeityRef || '';
  const currentSnap = settlement.config?.primaryDeitySnapshot || null;

  const wrap = {
    border: `1px solid ${BORDER}`, borderLeft: `3px solid ${DEITY_ACCENT}`, borderRadius: 7,
    padding: '10px 12px', background: CARD, marginBottom: 10,
  };
  const heading = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <Sun size={14} color={DEITY_ACCENT} />
      <span style={{ fontSize: FS.xs, fontWeight: 700, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Primary Deity
      </span>
    </div>
  );

  // ── Premium gate ──────────────────────────────────────────────────────────
  if (!canUseCustom) {
    return (
      <div style={wrap}>
        {heading}
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
          Assign a patron god to drive the religion layer.{' '}
          <Button variant="ghost" size="sm" onClick={() => setPurchaseModalOpen?.(true)}>
            Upgrade to premium
          </Button>{' '}
          to author and assign deities.
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      {heading}
      {deities.length === 0 ? (
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
          No deities authored yet. Create one in the Compendium’s Custom → Deities tab, then assign it here.
        </div>
      ) : (
        <>
          <select
            id="primary-deity-select"
            aria-label="Primary deity"
            value={currentRef}
            onChange={(e) => setPrimaryDeity?.(e.target.value || null)}
            style={{ width: '100%', padding: '5px 8px', border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: FS.sm, fontFamily: sans, color: INK, outline: 'none', background: CARD }}
          >
            <option value="">No primary deity (dormant)</option>
            {deities.map((d) => {
              const ref = d.refId || customRefIdFromItem(d.raw);
              return <option key={ref} value={ref}>{d.name}</option>;
            })}
          </select>
          {currentSnap && (
            <div style={{ fontSize: FS.micro, color: SECOND, marginTop: 6, lineHeight: 1.4 }}>
              {currentSnap.name}: {currentSnap.alignmentAxis} · {currentSnap.temperamentAxis} · {currentSnap.rankAxis}
              {currentSnap.lawAxis && currentSnap.lawAxis !== 'neutral' ? ` · ${currentSnap.lawAxis}` : ''}
              {currentSnap.domain ? ` · ${currentSnap.domain}` : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
}
