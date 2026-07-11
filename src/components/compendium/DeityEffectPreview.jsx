/**
 * DeityEffectPreview — the "This god will…" panel on the deity authoring form
 * (Phase 5 W-C4). It renders the EXACT couplings the engine applies plus the
 * stance geometry / government synergy, read live from ONE source
 * (deityDraftPreview.describeDeityDraft → the shared domain/display/deityEffects
 * single source + the deityAxes / deityStance vocabulary) — never hand-copied
 * numbers, never duplicated prose. As the author sets the axes the preview
 * updates, because the draft carries the same `alignmentAxis` / `lawAxis` /
 * `rankAxis` field names the engine snapshot uses.
 *
 * A fully-neutral / unranked draft yields no couplings (the dormancy guarantee),
 * and we say so — teaching that a neutral god does nothing to the substrate. The
 * panel also reminds the author the effects are INERT until the deity is assigned
 * to a settlement and the realm advances (the embed-on-assign bridge).
 *
 * Pure presentational; no store reads. Lives in the lazy Compendium chunk (its
 * copy + deityEffects imports never reach first paint).
 */

import { describeDeityDraft } from './deityDraftPreview.js';
import { td } from '../../copy/deityAuthoring.js';
import { BODY, BORDER, FS, GOLD, MUTED, SECOND, sans, swatch } from '../theme.js';

const DEITY_ACCENT = swatch['#7C3AED'];

/**
 * @param {{ draft: { alignmentAxis?: string, lawAxis?: string, rankAxis?: string,
 *   domain?: string, portfolio?: string } }} props
 */
export default function DeityEffectPreview({ draft }) {
  const { couplings, stance, synergy } = describeDeityDraft(draft || {});
  const hasEffects = couplings.length > 0;

  return (
    <div
      data-testid="deity-effect-preview"
      style={{
        marginTop: 8, padding: '10px 12px',
        border: `1px solid ${BORDER}`, borderLeft: `3px solid ${DEITY_ACCENT}`,
        borderRadius: 7, background: `${DEITY_ACCENT}0A`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: FS.xxs, fontWeight: 800, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {td('preview.heading')}
        </span>
      </div>

      {!hasEffects ? (
        <div style={{ fontSize: FS.xs, color: MUTED, fontStyle: 'italic', lineHeight: 1.5 }}>
          {td('preview.empty')}
        </div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {couplings.map((e, i) => (
            <li key={i} style={{ fontSize: FS.xs, color: SECOND, lineHeight: 1.5 }}>{e}</li>
          ))}
        </ul>
      )}

      {/* Stance geometry — how it treats other gods (only when it takes a side). */}
      {stance && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: FS.micro, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {td('preview.stanceHeading')}
          </div>
          <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5 }}>{stance}</div>
        </div>
      )}

      {/* Government synergy — under a traditional ruler (only when law-axial). */}
      {synergy && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: FS.micro, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {td('preview.synergyHeading')}
          </div>
          <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5 }}>{synergy}</div>
        </div>
      )}

      <div style={{ fontSize: FS.micro, color: MUTED, fontStyle: 'italic', marginTop: 8, lineHeight: 1.4, borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>
        <span style={{ color: GOLD, fontWeight: 900 }}>·</span>{' '}
        <span style={{ fontFamily: sans }}>{td('preview.dormant')}</span>
      </div>
    </div>
  );
}
