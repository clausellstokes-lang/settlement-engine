import { BODY, MUTED, BORDER, GOLD, FS, SP, sans } from '../theme.js';
import { FieldLabelBadge, Eyebrow } from '../surveyor/surveyorPanelKit.jsx';

const LABELS = Object.freeze([
  'mechanical',
  'conditional',
  'presentation',
  'unsupported',
]);

/**
 * Render the compiler's locally reconstructed truth report.
 *
 * Provider prose never decides these labels. The report is derived from the
 * canonical manifest after compilation, so a field cannot acquire mechanical
 * force merely because a model described it confidently.
 */
export default function ContentInterpretation({ interpretation }) {
  if (!interpretation) return null;
  const percent = Math.round((interpretation.mappingRate ?? 0) * 100);
  return (
    <section
      data-testid="content-interpretation"
      aria-labelledby="content-interpretation-title"
      style={{
        border: `1px solid ${BORDER}`,
        borderLeft: `3px solid ${GOLD}`,
        padding: SP.sm,
        display: 'flex',
        flexDirection: 'column',
        gap: SP.xs,
      }}
    >
      <Eyebrow>
        <span id="content-interpretation-title">
          Interpretation · {percent}% mapped to registered vocabulary
        </span>
      </Eyebrow>
      <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
        {LABELS.map((label) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: FS.xs,
              color: BODY,
              fontFamily: sans,
            }}
          >
            <FieldLabelBadge kind={label} />
            {interpretation.totals?.[label] || 0}
          </span>
        ))}
      </div>
      {interpretation.entries.map((entry) => (
        <div
          key={`${entry.bucket}:${entry.index}`}
          style={{
            fontSize: FS.xs,
            color: BODY,
            fontFamily: sans,
            lineHeight: 1.45,
          }}
        >
          <strong>{entry.name}</strong>
          <span>
            {' · mechanics: '}
            {entry.mechanicalConsumers.length > 0
              ? entry.mechanicalConsumers.join(', ')
              : 'none registered'}
          </span>
          {entry.presentationConsumers?.length > 0 && (
            <span>
              {' · presentation: '}
              {entry.presentationConsumers.join(', ')}
            </span>
          )}
        </div>
      ))}
      {interpretation.assumptions.length > 0 && (
        <div style={{
          fontSize: FS.xs,
          color: MUTED,
          fontFamily: sans,
          lineHeight: 1.45,
        }}>
          <strong>Assumptions:</strong> {interpretation.assumptions.join(' · ')}
        </div>
      )}
    </section>
  );
}
