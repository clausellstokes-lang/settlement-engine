/**
 * primitives/AiOverlayViolations — surface for the runtime verifier's findings.
 *
 * Tier 6.7 of the roadmap. The aiOverlayVerifier (Tier 6.4) catches
 * AI overlay drift at runtime — invented entities, renamed proper
 * nouns, contradicted facts, user-edited fields the AI overrode. The
 * verifier's report lives on `state.aiViolations` (Tier 6.5 wiring),
 * but until this component lands the findings are invisible to the
 * DM.
 *
 * Renders a single dismissible card grouped by kind. Hard violations
 * (invented / renamed / contradicted / canon-changed / user-field-
 * changed) lead because they directly compromise canon. Soft
 * violations (history-beat dropped, plain removed_entity) follow and
 * are visually de-emphasised.
 *
 * Pure presentational component. Caller owns:
 *   - the violations payload (typically state.aiViolations)
 *   - the dismiss handler (typically a `set` on aiSlice)
 *
 * The component returns null when violations is falsy or ok=true so
 * callers can render it unconditionally:
 *
 *   <AiOverlayViolations
 *     violations={aiViolations}
 *     onDismiss={() => store.setState(s => { s.aiViolations = null; })}
 *   />
 */

import { useState } from 'react';
import { FS, CARD, swatch } from '../theme.js';

const HARD_KINDS = new Set([
  'invented_entity',
  'renamed_entity',
  'changed_fact',
  'changed_canon',
  'changed_user_field',
]);

const KIND_LABELS = {
  invented_entity:      'Invented entity',
  renamed_entity:       'Renamed entity',
  changed_fact:         'Contradicted fact',
  changed_canon:        'Changed canon status',
  changed_user_field:   'Overwrote user edit',
  removed_entity:       'Removed entity',
  removed_history_beat: 'Dropped history beat',
};

const COLORS = Object.freeze({
  hardBg:    'rgba(139,26,26,0.05)',
  hardBdr:   'rgba(139,26,26,0.32)',
  hardText:  '#8b1a1a',
  softBg:    'rgba(196,128,60,0.06)',
  softBdr:   'rgba(196,128,60,0.25)',
  softText:  '#8a5a20',
  muted:     '#9c8068',
  ink:       '#1c1409',
  headerBg:  'rgba(139,26,26,0.10)',
});

export function AiOverlayViolations({ violations, onDismiss }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!violations || violations.ok || !Array.isArray(violations.violations) || violations.violations.length === 0) {
    return null;
  }

  const hard = violations.violations.filter(v => HARD_KINDS.has(v.kind));
  const soft = violations.violations.filter(v => !HARD_KINDS.has(v.kind));
  const hardCount = hard.length;
  const softCount = soft.length;
  const totalCount = hardCount + softCount;

  return (
    <div
      role="region"
      aria-label="AI overlay violations"
      style={{
        margin: '8px 18px',
        background: CARD,
        border: `1px solid ${COLORS.hardBdr}`,
        borderRadius: 6,
        boxShadow: '0 1px 3px rgba(139,26,26,0.05)',
        overflow: 'hidden',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px',
          background: COLORS.headerBg,
          borderBottom: collapsed ? 'none' : `1px solid ${COLORS.hardBdr}`,
        }}
      >
        <span style={{
          fontSize: FS.xs, fontWeight: 800, color: COLORS.hardText,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          ⚠ AI overlay drift detected
        </span>
        <span style={{ fontSize: FS.xs, color: COLORS.muted, flex: 1 }}>
          {totalCount} issue{totalCount === 1 ? '' : 's'}
          {hardCount > 0 && (
            <> · <strong style={{ color: COLORS.hardText }}>{hardCount} hard</strong></>
          )}
          {softCount > 0 && (
            <> · <span style={{ color: COLORS.softText }}>{softCount} soft</span></>
          )}
        </span>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          aria-expanded={!collapsed}
          aria-controls="ai-violations-body"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: FS.xxs, fontWeight: 700, color: COLORS.muted,
            padding: '2px 6px',
          }}
        >
          {collapsed ? 'Show' : 'Hide'}
        </button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            title="Dismiss this notice. Violations will resurface if the AI overlay regenerates."
            style={{
              background: 'none', border: `1px solid ${COLORS.hardBdr}`,
              borderRadius: 3, cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: 700, color: COLORS.hardText,
              padding: '2px 7px',
            }}
          >
            ✕
          </button>
        )}
      </header>

      {!collapsed && (
        <div id="ai-violations-body" style={{ padding: '8px 12px 10px' }}>
          {hardCount > 0 && (
            <Group
              violations={hard}
              tone="hard"
              caption="Hard violations — canon was directly compromised. The DM should inspect these before accepting the refined output."
            />
          )}
          {softCount > 0 && (
            <Group
              violations={soft}
              tone="soft"
              caption={hardCount > 0
                ? 'Soft violations — informational. The simulation is still valid; some derived prose simply went missing.'
                : 'Drift was detected but is informational only. The simulation is still valid.'}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Group({ violations, tone, caption }) {
  const isHard = tone === 'hard';
  return (
    <section style={{ marginBottom: 6 }}>
      <p style={{
        fontSize: FS.xs, color: isHard ? COLORS.hardText : COLORS.softText,
        margin: '0 0 6px', lineHeight: 1.4,
      }}>
        {caption}
      </p>
      <ul style={{
        listStyle: 'none', margin: 0, padding: 0,
        background: isHard ? COLORS.hardBg : COLORS.softBg,
        border: `1px solid ${isHard ? COLORS.hardBdr : COLORS.softBdr}`,
        borderRadius: 4,
      }}>
        {violations.map((v, idx) => (
          <li
            key={`${v.kind}-${v.key}-${idx}`}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '5px 8px',
              borderBottom: idx === violations.length - 1 ? 'none' : `1px solid ${isHard ? COLORS.hardBdr : COLORS.softBdr}`,
            }}
          >
            <span style={{
              flexShrink: 0,
              fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: isHard ? COLORS.hardText : COLORS.softText,
              background: swatch.white,
              border: `1px solid ${isHard ? COLORS.hardBdr : COLORS.softBdr}`,
              borderRadius: 3, padding: '1px 5px',
              marginTop: 1,
            }}>
              {KIND_LABELS[v.kind] || v.kind}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: FS['11.5'], color: COLORS.ink, fontWeight: 600 }}>
                {v.label || v.field || v.key}
              </div>
              <div style={{ fontSize: FS['10.5'], color: COLORS.muted, lineHeight: 1.4 }}>
                {v.detail}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AiOverlayViolations;
