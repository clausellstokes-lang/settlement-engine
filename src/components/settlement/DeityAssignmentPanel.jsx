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
 *   • LAPSED premium (not premium, but this settlement OWNS a live embed) — the
 *     owned patron/cults with SHED-ONLY controls (Remove patron, Remove cult,
 *     Remove all cults) and a renew prompt. Never an assign or change control:
 *     that direction the store seam refuses, so offering it would be a dead
 *     control. R-5b, owner-ratified 2026-07-27.
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
import {
  customContentForActiveContext,
} from '../../store/activeCustomContentContext.js';
import {
  DEITY_ALIGNMENT,
  DEITY_LAW,
  DEITY_TIER,
} from '../../domain/customContentSchema.js';
import { capacityForTier } from '../../domain/worldPulse/cultImpositionApply.js';
import { worldFaithsForSave } from '../../domain/deitySnapshot.js';
// MANIFEST PARITY (atlas Gap #14 cure): the panel lane runs the SAME availability
// predicates the composer runs. Legal import: this panel rides the lazy dossier
// chunk (dossierLazyTabs), and the manifest's lazy-leaf law only forbids EAGER /
// store importers (vendorPdfLazy sentinel guards it).
import { AFFORDANCE_MANIFEST } from '../../domain/events/affordanceManifest.js';
import { td } from '../../copy/deityAuthoring.js';
import { BORDER, CARD, FS, INK, MUTED, SECOND, sans } from '../theme.js';
import { RUBRIC } from '../../design/organic/rubrication.js';
import Button from '../primitives/Button.jsx';

// THE VOTIVE REGISTER (Deep Craft — the dossier's faith register voice): the
// patron/cult assignment reads as a rule-framed dedication plate, not a rounded
// SaaS card in the AI-content violet. The accent is the votive gold (RUBRIC.entry
// — the illuminated entry mark), which is contrast-PINNED as text on CARD /
// parchment (tests/design/contrast.test.js); the SaaS violet #7C3AED it replaces
// read below AA as a heading label on the light card.
const DEITY_ACCENT = RUBRIC.entry;

// The option-value prefix that marks a RESTORE-FROM-WORLD pick (Wave R-5b, item
// 13b). Authoring options carry `custom:<localUid>` refs and world options carry
// religion-state keys; the prefix keeps the two namespaces from ever colliding
// in one select, and the handler strips it before dispatching the key verbatim.
const WORLD_OPT = 'world::';

const wrapStyle = {
  border: `1px solid ${BORDER}`, borderLeft: `3px solid ${DEITY_ACCENT}`,
  padding: '10px 12px', background: CARD, marginBottom: 10, fontFamily: sans,
};
const selectStyle = {
  width: '100%', padding: '5px 8px', border: `1px solid ${BORDER}`,
  fontSize: FS.sm, fontFamily: sans, color: INK, outline: 'none', background: CARD,
};
const headingStyle = {
  fontSize: FS.xs, fontWeight: 700, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em',
};

/**
 * Resolve an enum through its canonical authoring vocabulary. Longer labels
 * carry an explanatory clause after an em dash; the register needs only the
 * canonical leading name. Unknown legacy values are omitted rather than
 * exposing a stored enum token.
 */
function compactAxisLabel(options, value) {
  const label = options.find((option) => option.key === value)?.label;
  return label ? label.split(/\s+—\s+/)[0] : null;
}

/** The one-line axis summary of an embedded snapshot (never invents a name). */
function snapLine(snap) {
  if (!snap) return '';
  const parts = [
    compactAxisLabel(DEITY_ALIGNMENT, snap.alignmentAxis),
    compactAxisLabel(DEITY_TIER, snap.rankAxis),
  ].filter(Boolean);
  if (snap.lawAxis && snap.lawAxis !== 'neutral') {
    parts.push(compactAxisLabel(DEITY_LAW, snap.lawAxis));
  }
  if (snap.domain) parts.push(snap.domain);
  return parts.filter(Boolean).join(' · ');
}

export default function DeityAssignmentPanel() {
  const settlement = useStore((s) => s.settlement);
  const customContent = useStore(customContentForActiveContext);
  const setPrimaryDeity = useStore((s) => s.setPrimaryDeity);
  const imposeCult = useStore((s) => s.imposeCult);
  const canUseCustom = useStore((s) => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const setPurchaseModalOpen = useStore((s) => s.setPurchaseModalOpen);
  const campaigns = useStore((s) => s.campaigns);
  const activeSaveId = useStore((s) => s.activeSaveId);

  const deities = useMemo(() => {
    const registry = buildRegistry(customContent || {});
    return registry.listCustom('deities');
  }, [customContent]);

  // RESTORE FROM WORLD (Wave R-5b, item 13b): the faiths this settlement's own
  // campaign record still carries. Read through the SAME pure reader the store
  // seam resolves with, so the panel can never offer a choice the seam refuses.
  // A standalone settlement has no campaign record and gets an empty list, which
  // renders no group at all.
  const worldFaiths = useMemo(
    () => worldFaithsForSave(campaigns, activeSaveId),
    [campaigns, activeSaveId],
  );

  if (!settlement) return null;

  const config = settlement.config || {};
  const currentSnap = config.primaryDeitySnapshot || null;
  const currentRef = config.primaryDeityRef || (currentSnap?._deityRef) || '';
  const cults = Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [];

  // ── LAPSED: not premium, but this settlement owns a live embed ──────────────
  // Read-only for the ASSIGN direction (no picker, ever) and WRITABLE for the SHED
  // direction (Wave R-5b, owner-ratified 2026-07-27). The store seam has always
  // allowed it: deityWriteGate({ shed: true }) passes for an unentitled account that
  // owns a live embed, on exactly the ownership test this branch condition runs — so
  // panel and seam agree by construction, and neither Remove control can ever be a
  // dead one. Hiding them was the last piece of the defect the seam already cured:
  // a lapsed subscriber was locked INTO deity content they could no longer take out.
  // Free tier (unentitled, no embed) never reaches here and stays refused both ways.
  if (!canUseCustom && (currentSnap || cults.length)) {
    return (
      <div data-testid="deity-assignment-panel" style={wrapStyle}>
        <div style={{ ...headingStyle, marginBottom: 6 }}>{td('assign.patronHeading')}</div>
        {currentSnap && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div data-testid="deity-assignment-readonly" style={{ fontSize: FS.sm, color: INK, lineHeight: 1.5 }}>
              <strong>{currentSnap.name}</strong>
              {snapLine(currentSnap) ? <span style={{ color: SECOND }}>{` · ${snapLine(currentSnap)}`}</span> : null}
            </div>
            {/* Clear the patron back to latent — the same setPrimaryDeity(null) shed
                write the premium picker's "No patron (latent)" option dispatches. */}
            <Button variant="ghost" size="sm" data-testid="lapsed-clear-patron" aria-label={`${td('assign.remove')} ${currentSnap.name}`} onClick={() => setPrimaryDeity?.(null)} style={{ minHeight: 0, padding: '0 6px', color: DEITY_ACCENT }}>
              {td('assign.remove')}
            </Button>
          </div>
        )}
        {cults.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: FS.xs, color: SECOND }}>{td('assign.cultHeading')}</span>
              <Button variant="ghost" size="sm" data-testid="cult-clear-all" aria-label={td('assign.clearAll')} onClick={() => imposeCult?.(null)} style={{ minHeight: 0, padding: '0 6px', color: DEITY_ACCENT }}>
                {td('assign.clearAll')}
              </Button>
            </div>
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

  // The restore-from-world group: every recorded faith EXCEPT the one already
  // seated. Option values carry a prefix so the change handler can never confuse
  // a world state key with an authoring `custom:` ref, whatever either namespace
  // grows into.
  const worldOptions = worldFaiths.filter((f) => f.deityRef !== String(currentRef));

  /** Dispatch a patron pick down whichever resolution lane its value names. */
  const onPatronPick = (value) => {
    if (value.startsWith(WORLD_OPT)) setPrimaryDeity?.(value.slice(WORLD_OPT.length), { fromWorld: true });
    else setPrimaryDeity?.(value || null);
  };

  // MANIFEST PARITY (Gap #14): evaluate the SAME availability predicates the
  // composer evaluates, with the composer's ctx shape, BEFORE offering a write.
  // Unavailability grays-with-reason in the manifest's own sentences (the
  // composer's `[...reasons, ...unlocks].join(' ')` idiom) — never a silent no-op.
  const verbCtx = { canUseCustom };
  const patronVerb = AFFORDANCE_MANIFEST.SET_PRIMARY_DEITY.predicate(settlement, verbCtx);
  const cultVerb = AFFORDANCE_MANIFEST.IMPOSE_CULT.predicate(settlement, verbCtx);

  return (
    <div data-testid="deity-assignment-panel" style={wrapStyle}>
      {/* Patron */}
      <div style={{ ...headingStyle, marginBottom: 6 }}>{td('assign.patronHeading')}</div>
      {deities.length === 0 && worldOptions.length === 0 ? (
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>{td('assign.noneAuthored')}</div>
      ) : (
        <>
          <select
            data-testid="patron-deity-select"
            aria-label={td('assign.patronHeading')}
            value={selectedPatron?.refId || ''}
            onChange={(e) => onPatronPick(e.target.value)}
            disabled={!patronVerb.available}
            style={selectStyle}
          >
            <option value="">{td('assign.noPatron')}</option>
            {options.map((d) => <option key={d.refId} value={d.refId}>{d.name}</option>)}
            {worldOptions.length > 0 && (
              <optgroup data-testid="world-faiths-group" label={td('assign.worldFaithsGroup')}>
                {worldOptions.map((f) => (
                  <option key={f.deityRef} value={`${WORLD_OPT}${f.deityRef}`}>{f.snapshot.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          {worldOptions.length > 0 && (
            <div data-testid="world-faiths-hint" style={{ fontSize: FS.micro, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>
              {td('assign.worldFaithsHint')}
            </div>
          )}
          {!patronVerb.available && (
            <div data-testid="patron-verb-unavailable" style={{ fontSize: FS.micro, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>
              {[...patronVerb.reasons, ...patronVerb.unlocks].join(' ')}
            </div>
          )}
          {currentSnap && (
            <div style={{ fontSize: FS.micro, color: SECOND, marginTop: 6, lineHeight: 1.4 }}>
              <strong style={{ color: INK }}>{currentSnap.name}</strong>
              {snapLine(currentSnap) ? ` · ${snapLine(currentSnap)}` : ''}
            </div>
          )}
        </>
      )}

      {/* Cults — once a patron is assigned (the impose direction), OR whenever
          the settlement already owns cults (the SHED direction, Wave R-2 atlas
          Gap 2b): clearing the patron or emptying the authored library must
          never strand owned cults out of reach of their Remove / Remove-all
          controls. */}
      {(cults.length > 0 || (deities.length > 0 && currentSnap)) && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
            <span style={headingStyle}>{td('assign.cultHeading')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: FS.micro, color: MUTED }}>{cults.length} / {cultCapacity}</span>
              {/* The clear-ALL-cults door (Wave R-2, atlas Gap 2b: the
                  imposeCult(null) path had no UI). Shed-direction write: the
                  store seam's deityWriteGate allows it for premium AND for a
                  lapsed account owning the embeds (this branch renders for
                  premium only — surfacing shed controls to lapsed users is the
                  owner-parked product call from Wave R-0). Hidden when no cults
                  exist (honest empty state — nothing to clear). */}
              {cults.length > 0 && (
                <Button variant="ghost" size="sm" data-testid="cult-clear-all" aria-label={td('assign.clearAll')} onClick={() => imposeCult?.(null)} style={{ minHeight: 0, padding: '0 6px', color: DEITY_ACCENT }}>
                  {td('assign.clearAll')}
                </Button>
              )}
            </span>
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
            // HARD capacity guard (Wave R-0 verifier fix #1) — unconditional,
            // checked BEFORE the manifest predicate. The IMPOSE_CULT probe's
            // niche-neutral test deity can report AVAILABLE at zero capacity
            // (a stale cult left in the probe's neutral:neutral niche — e.g.
            // after a tier demotion — makes reconcileCultImposition answer
            // 'replaced' before the no_cult_slots branch), which would re-open
            // the silent no-op this guard has always closed. Belt and braces
            // with the manifest-parity line below; existing cults keep their
            // Remove buttons above (removal is the shed direction).
            <div data-testid="cult-too-small" style={{ fontSize: FS.micro, color: MUTED, lineHeight: 1.5 }}>{td('assign.tooSmall')}</div>
          ) : !cultVerb.available ? (
            // Grayed-with-reason: the manifest's own refusal sentences (parity
            // with the composer's unavailable-verb line), replacing the panel's
            // former hand-derived capacity note.
            <div data-testid="cult-verb-unavailable" style={{ fontSize: FS.micro, color: MUTED, lineHeight: 1.5 }}>
              {[...cultVerb.reasons, ...cultVerb.unlocks].join(' ')}
            </div>
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
