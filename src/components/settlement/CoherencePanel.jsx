/**
 * CoherencePanel — Surfaces draft-mode coherence warnings.
 *
 * Hidden in canon mode (changes are diegetic; the engine doesn't
 * second-guess what the DM said happened). Hidden in draft mode too if
 * the settlement has zero warnings.
 */

import { useStore } from '../../store/index.js';
import { checkDraftEdit } from '../../domain/coherence/checkDraftEdit.js';
import { GOLD, INK, MUTED, BORDER, RED, sans, FS, SP, R, swatch } from '../theme.js';

export default function CoherencePanel() {
  const phase      = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);

  if (phase !== 'draft' || !settlement) return null;

  const warnings = checkDraftEdit(settlement);
  if (!warnings.length) return null;

  return (
    <div style={{
      background: swatch['#FFF7EC'], border: `1px solid ${GOLD}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: swatch['#7A4F0F'], letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.xs,
      }}>
        Coherence checks · {warnings.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {warnings.map((w, i) => <Warning key={i} w={w} />)}
      </div>
    </div>
  );
}

function Warning({ w }) {
  // Severity in two channels (P7) without an icon: a leading text tag plus its
  // colour (mirrored on the left border) so a hard mismatch reads heavier than a
  // gentle suggestion. Defaults to "Check" for any unlabelled severity.
  const sev = w.severity === 'mismatch'
    ? { tag: 'Error', color: RED }
    : w.severity === 'suggestion'
      ? { tag: 'Suggestion', color: MUTED }
      : { tag: 'Check', color: swatch['#7A4F0F'] };
  return (
    <div style={{
      padding: SP.xs,
      background: swatch.white, border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${sev.color}`, borderRadius: R.sm,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <span style={{
          flexShrink: 0, marginTop: 1,
          fontSize: FS.pico, fontWeight: 800, fontFamily: sans, color: sev.color,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {sev.tag}
        </span>
        <div style={{ fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5 }}>
          {w.message}
        </div>
      </div>
      {w.suggestedFixes?.length > 0 && (
        <div style={{
          marginTop: 4, paddingLeft: 18,
          fontSize: FS.xxs, color: MUTED, fontFamily: sans, fontStyle: 'italic',
        }}>
          Suggestions: {w.suggestedFixes.join(' · ')}
        </div>
      )}
    </div>
  );
}
