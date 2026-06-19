/**
 * MagicTab — the Magic sub-tab (UX overhaul Phase 2, plan §4.1). Renders the
 * 10-facet MagicProfile via the previously-unused deriveMagicPosture read-model,
 * plus the deity⇄magic-legality coupling explainer (a MAJOR patron deity
 * regulates a realm's magic; a warlike/evil major orthodoxy tightens harder).
 *
 * Honest in a dead-magic world (config.magicExists === false): it says so rather
 * than pricing a magic economy that does not exist. Pure read-models only.
 */

import { deriveMagicPosture } from '../../../domain/display/dossierViewModel.js';
import { describeDeityEffects } from '../../../domain/display/deityEffects.js';
import { FS, INK, MUTED, BODY, BORDER, CARD, CARD_HDR, VIOLET, VIOLET_BG, sans, SP, R } from '../../theme.js';

const FACET_LABEL = {
  availability: 'Availability',
  legality: 'Legality',
  institutionalControl: 'Institutional control',
  cost: 'Service cost',
  risk: 'Risk',
  religiousAcceptance: 'Religious acceptance',
};
const FACET_ORDER = ['availability', 'legality', 'institutionalControl', 'cost', 'risk', 'religiousAcceptance'];

function Facet({ label, value }) {
  return (
    <div data-facet style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: SP.sm, padding: `${SP.xs}px 0`, borderBottom: `1px solid ${BORDER}`,
    }}>
      <span style={{ fontSize: FS.sm, fontWeight: 600, color: INK }}>{label}</span>
      <span style={{ fontSize: FS.sm, fontWeight: 800, color: VIOLET, textTransform: 'capitalize' }}>{value}</span>
    </div>
  );
}

/**
 * @param {{ settlement: any }} props
 */
export default function MagicTab({ settlement }) {
  if (!settlement) return <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>No settlement.</div>;
  const posture = deriveMagicPosture(settlement);

  if (!posture.available) {
    return <div style={{ padding: 24, color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Magic not assessed for this settlement.</div>;
  }

  const deity = settlement?.config?.primaryDeitySnapshot || null;
  // The magic-legality coupling line, surfaced only when a MAJOR deity regulates.
  const magicCoupling = deity?.rankAxis === 'major'
    ? describeDeityEffects(deity).filter(e => /magic legality/i.test(e))
    : [];

  return (
    <div data-testid="magic-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <div style={{
        fontSize: FS.lg, fontWeight: 800, color: INK, marginBottom: 4,
      }}>Magic</div>
      <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5, margin: '0 0 12px' }}>{posture.display}</p>

      {posture.magicExists ? (
        <>
          {/* The 6 envelope facets. */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md, overflow: 'hidden', marginBottom: 12,
          }}>
            <div style={{
              fontSize: FS.xs, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em',
              background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
            }}>Envelope</div>
            <div style={{ padding: `0 ${SP.md}px` }}>
              {FACET_ORDER.map(key => (
                <Facet key={key} label={FACET_LABEL[key]} value={posture[key]} />
              ))}
            </div>
          </div>

          {/* The 4 role lines. */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md, overflow: 'hidden', marginBottom: 12,
          }}>
            <div style={{
              fontSize: FS.xs, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em',
              background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
            }}>Roles</div>
            <div style={{ padding: `${SP.xs}px ${SP.md}px` }} data-testid="magic-roles">
              {posture.roleLines.map((line, i) => (
                <div key={i} data-role-line style={{ fontSize: FS.sm, color: BODY, padding: `${SP.xs}px 0` }}>{line}</div>
              ))}
            </div>
          </div>

          {/* Deity ⇄ magic-legality coupling (self-gates to nothing without a major deity). */}
          {magicCoupling.length > 0 && (
            <div data-testid="magic-deity-coupling" style={{
              background: VIOLET_BG, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${VIOLET}`,
              borderRadius: R.md, padding: `${SP.sm}px ${SP.md}px`,
            }}>
              <div style={{ fontSize: FS.xxs, fontWeight: 800, color: VIOLET, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Deity &amp; magic
              </div>
              {magicCoupling.map((line, i) => (
                <div key={i} style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
                  {deity.name}: {line}.
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
