/**
 * DeityAssignmentPanel — the settlement editor's control for assigning an authored
 * deity as a settlement's PATRON (and imposing CULTS beneath it) (Phase 5 W-C4).
 *
 * This is the UI half of OUR embed-on-assign bridge. It dispatches the store
 * actions `setPrimaryDeity(refId)` / `imposeCult(refId)` (settlementDeityHelpers),
 * which resolve the authored deity → a frozen snapshot and commit it via the
 * SET_PRIMARY_DEITY / IMPOSE_CULT canon events (undo-clean: undoEvent restores the
 * prior config.primaryDeityRef/Snapshot + cultDeitySnapshots). The pulse and
 * derivers read ONLY the embedded snapshot, never this control or the store — the
 * headless-determinism contract. "No patron (latent)" clears the assignment back
 * to the dormant/latent ground state.
 *
 * TIER MATRIX (constitutional walls, verified in-component + tests):
 *   • PREMIUM / elevated (canUseCustomContent) — the full write picker.
 *   • LAPSED premium (not premium, but this settlement OWNS a live embed) —
 *     READ-ONLY view of the owned patron/cults, no write control, a renew prompt.
 *   • FREE / ANON with no embed — the in-place UPSELL (never a dead control),
 *     naming NO deity (it reads config.primaryDeitySnapshot only, never
 *     config.latentPantheon, so a latent seed is never named to a free viewer).
 *
 * Lazy-loaded from the dossier (OutputContainer), so its registry/copy imports
 * never reach first paint.
 */

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { buildRegistry, mintDeityRef } from '../../lib/customRegistry.js';
import { capacityForTier } from '../../domain/worldPulse/cultImpositionApply.js';
import { td } from '../../copy/deityAuthoring.js';
import { BORDER, CARD, FS, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const DEITY_ACCENT = swatch['#7C3AED'];

const wrapStyle = {
  border: `1px solid ${BORDER}`, borderLeft: `3px solid ${DEITY_ACCENT}`, borderRadius: 7,
  padding: '10px 12px', background: CARD, marginBottom: 10, fontFamily: sans,
};
const selectStyle = {
  width: '100%', padding: '5px 8px', border: `1px solid ${BORDER}`, borderRadius: 4,
  fontSize: FS.sm, fontFamily: sans, color: INK, outline: 'none', background: CARD,
};
const headingStyle = {
  fontSize: FS.xs, fontWeight: 700, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em',
};

/** The one-line axis summary of an embedded snapshot (never invents a name). */
function snapLine(snap) {
  if (!snap) return '';
  const parts = [snap.alignmentAxis, snap.rankAxis].filter(Boolean);
  if (snap.lawAxis && snap.lawAxis !== 'neutral') parts.push(snap.lawAxis);
  if (snap.domain) parts.push(snap.domain);
  return parts.join(' · ');
}

export default function DeityAssignmentPanel() {
  const settlement = useStore((s) => s.settlement);
  const customContent = useStore((s) => s.customContent);
  const setPrimaryDeity = useStore((s) => s.setPrimaryDeity);
  const imposeCult = useStore((s) => s.imposeCult);
  const canUseCustom = useStore((s) => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const setPurchaseModalOpen = useStore((s) => s.setPurchaseModalOpen);

  const deities = useMemo(() => {
    const registry = buildRegistry(customContent || {});
    return registry.listCustom('deities');
  }, [customContent]);

  if (!settlement) return null;

  const config = settlement.config || {};
  const currentSnap = config.primaryDeitySnapshot || null;
  const currentRef = config.primaryDeityRef || (currentSnap?._deityRef) || '';
  const cults = Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [];

  // ── LAPSED read-only: not premium, but this settlement owns a live embed ────
  // Show the owned faith read-only (never a dead write control); no upsell that
  // implies they can write here — a renew prompt instead.
  if (!canUseCustom && (currentSnap || cults.length)) {
    return (
      <div data-testid="deity-assignment-panel" style={wrapStyle}>
        <div style={{ ...headingStyle, marginBottom: 6 }}>{td('assign.patronHeading')}</div>
        {currentSnap && (
          <div data-testid="deity-assignment-readonly" style={{ fontSize: FS.sm, color: INK, lineHeight: 1.5 }}>
            <strong>{currentSnap.name}</strong>
            {snapLine(currentSnap) ? <span style={{ color: SECOND }}>{` · ${snapLine(currentSnap)}`}</span> : null}
          </div>
        )}
        {cults.length > 0 && (
          <div style={{ fontSize: FS.xs, color: SECOND, marginTop: 4, lineHeight: 1.4 }}>
            {td('assign.cultHeading')}: {cults.map((c, i) => (
              <span key={String(c._deityRef || c.name || i)}>{i > 0 ? ', ' : ''}<strong style={{ color: INK }}>{c.name}</strong></span>
            ))}
          </div>
        )}
        <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 8, lineHeight: 1.45 }}>
          {td('assign.lapsedNote')}{' '}
          <Button variant="ghost" size="sm" onClick={() => setPurchaseModalOpen?.(true)} style={{ background: 'none', border: 'none', padding: 0, minHeight: 0, color: DEITY_ACCENT, fontWeight: 800 }}>
            {td('assign.upsellCta')}
          </Button>
        </div>
      </div>
    );
  }

  // ── FREE / ANON, no embed: the in-place upsell (names NO deity) ─────────────
  if (!canUseCustom) {
    return (
      <div data-testid="deity-assignment-panel" style={wrapStyle}>
        <div style={{ ...headingStyle, marginBottom: 6 }}>{td('assign.patronHeading')}</div>
        <div data-testid="deity-assignment-upsell" style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
          {td('assign.upsellPatron')}{' '}
          <Button variant="ghost" size="sm" onClick={() => setPurchaseModalOpen?.(true)} style={{ background: 'none', border: 'none', padding: 0, minHeight: 0, color: DEITY_ACCENT, fontWeight: 800 }}>
            {td('assign.upsellCta')}
          </Button>{' '}
          {td('assign.upsellTail')}
        </div>
      </div>
    );
  }

  // ── PREMIUM: the full write picker ──────────────────────────────────────────
  // Match the current patron by its MINTED identity ref (setPrimaryDeity embeds
  // `deity:<scope>:<slug>`, while option values are the `custom:<localUid>` refs),
  // so the select round-trips to the assigned option.
  const optionOf = (d) => ({ ...d, minted: mintDeityRef(d.raw) || d.refId });
  const options = deities.map(optionOf);
  const selectedPatron = options.find((d) => d.minted === currentRef || d.refId === currentRef) || null;

  const tier = settlement.tier || config.tier || 'village';
  const cultCapacity = Math.max(0, capacityForTier(tier) - (currentSnap ? 1 : 0));
  const cultRefSet = new Set(cults.map((c) => String(c._deityRef || c.name || '')));
  const cultOptions = options.filter((d) => d.minted !== (selectedPatron?.minted) && !cultRefSet.has(d.minted));

  return (
    <div data-testid="deity-assignment-panel" style={wrapStyle}>
      {/* Patron */}
      <div style={{ ...headingStyle, marginBottom: 6 }}>{td('assign.patronHeading')}</div>
      {deities.length === 0 ? (
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>{td('assign.noneAuthored')}</div>
      ) : (
        <>
          <select
            data-testid="patron-deity-select"
            aria-label={td('assign.patronHeading')}
            value={selectedPatron?.refId || ''}
            onChange={(e) => setPrimaryDeity?.(e.target.value || null)}
            style={selectStyle}
          >
            <option value="">{td('assign.noPatron')}</option>
            {options.map((d) => <option key={d.refId} value={d.refId}>{d.name}</option>)}
          </select>
          {currentSnap && (
            <div style={{ fontSize: FS.micro, color: SECOND, marginTop: 6, lineHeight: 1.4 }}>
              <strong style={{ color: INK }}>{currentSnap.name}</strong>
              {snapLine(currentSnap) ? ` · ${snapLine(currentSnap)}` : ''}
            </div>
          )}
        </>
      )}

      {/* Cults — only once a patron is assigned and the tier can sustain one */}
      {deities.length > 0 && currentSnap && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
            <span style={headingStyle}>{td('assign.cultHeading')}</span>
            <span style={{ fontSize: FS.micro, color: MUTED }}>{cults.length} / {cultCapacity}</span>
          </div>
          {cults.length > 0 && (
            <div style={{ display: 'grid', gap: 4, marginBottom: 8 }}>
              {cults.map((c) => (
                <div key={String(c._deityRef || c.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: FS.micro, color: SECOND, lineHeight: 1.4 }}>
                  <span><strong style={{ color: INK }}>{c.name}</strong>{snapLine(c) ? ` · ${snapLine(c)}` : ''}</span>
                  <Button variant="ghost" size="sm" aria-label={`${td('assign.remove')} ${c.name}`} onClick={() => imposeCult?.(null, String(c._deityRef || c.name || ''))} style={{ minHeight: 0, padding: '0 6px', color: DEITY_ACCENT }}>
                    {td('assign.remove')}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {cultCapacity === 0 ? (
            <div style={{ fontSize: FS.micro, color: MUTED, lineHeight: 1.5 }}>{td('assign.tooSmall')}</div>
          ) : (
            <>
              <select
                data-testid="cult-deity-select"
                aria-label={td('assign.cultHeading')}
                value=""
                onChange={(e) => { if (e.target.value) imposeCult?.(e.target.value); }}
                disabled={cultOptions.length === 0}
                style={selectStyle}
              >
                <option value="">{cultOptions.length ? td('assign.imposePlaceholder') : td('assign.noneToImpose')}</option>
                {cultOptions.map((d) => <option key={d.refId} value={d.refId}>{d.name}</option>)}
              </select>
              <div style={{ fontSize: FS.micro, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>{td('assign.cultHint')}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
