import { GOLD, GOLD_DEEP, INK, MUTED, BORDER, CARD, FS, SP, sans } from '../theme.js';
import { COPY } from '../../copy/strings.js';

/**
 * primitives/LifecycleSpine — the settlement's journey, shown once.
 *
 * Draft -> Saved -> Canon -> In the Realm -> Shared. A settlement moves
 * along this spine; the stepper makes the place's current standing legible
 * at a glance and gives the next step strong information scent (P3 / P9).
 *
 * Presentational only: pass the resolved `stage`. Derivation from save
 * metadata (phase, saved, clock-bound, published) lives at the call site,
 * reusing the existing selectors — this primitive owns no state machine.
 *
 * Two channels carry each step (P7): a numbered/filled marker AND a label,
 * plus color. The current step is announced with aria-current="step".
 *
 * @param {Object} props
 * @param {'draft'|'saved'|'canon'|'simulated'|'shared'} [props.stage='draft']
 * @param {(stageId: string) => void} [props.onStep]  makes reached steps actionable
 * @param {boolean} [props.compact=false]  dot-only, for dense rows (library cards)
 */
const STAGES = ['draft', 'saved', 'canon', 'simulated', 'shared'];

function Step({ id, index, here, active, compact, onStep, label, hint }) {
  const dot = compact ? 20 : 26;
  const interactive = !!onStep && (active || index === 0);
  const marker = (
    <span
      aria-hidden="true"
      style={{
        width: dot, height: dot, borderRadius: '50%', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: here ? GOLD : active ? 'rgba(201,162,76,0.18)' : CARD,
        border: `1.5px solid ${active ? GOLD : BORDER}`,
        color: here ? INK : active ? GOLD_DEEP : MUTED,
        fontFamily: sans, fontSize: compact ? FS.micro : FS.xs, fontWeight: 800,
      }}
    >
      {index + 1}
    </span>
  );
  const content = (
    <>
      {marker}
      {!compact && (
        <span style={{
          fontFamily: sans, fontSize: FS.sm,
          fontWeight: here ? 800 : 600,
          color: here ? INK : active ? INK : MUTED,
          whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      )}
    </>
  );
  const shared = {
    display: 'inline-flex', alignItems: 'center', gap: SP.sm,
    'aria-current': here ? 'step' : undefined,
  };
  if (interactive) {
    return (
      <button
        type="button"
        onClick={() => onStep(id)}
        aria-current={here ? 'step' : undefined}
        aria-label={`${label}. ${hint}`}
        title={hint}
        style={{
          ...shared, background: 'transparent', border: 'none', padding: 0,
          cursor: 'pointer', minHeight: compact ? undefined : 44,
        }}
      >
        {content}
      </button>
    );
  }
  return (
    <span {...shared} title={hint} aria-label={compact ? `${label}. ${hint}` : undefined}>
      {content}
    </span>
  );
}

export default function LifecycleSpine({ stage = 'draft', onStep, compact = false }) {
  const idx = Math.max(0, STAGES.indexOf(stage));
  const labels = COPY.lifecycle?.labels || {};
  const hints = COPY.lifecycle?.hints || {};
  return (
    <ol
      aria-label="Settlement lifecycle"
      style={{
        listStyle: 'none', margin: 0, padding: 0,
        display: 'flex', alignItems: 'center',
        gap: compact ? SP.xs : SP.sm, flexWrap: 'wrap',
      }}
    >
      {STAGES.map((s, i) => (
        <li key={s} style={{ display: 'flex', alignItems: 'center', gap: compact ? SP.xs : SP.sm }}>
          <Step
            id={s}
            index={i}
            here={i === idx}
            active={i <= idx}
            compact={compact}
            onStep={onStep}
            label={labels[s] || s}
            hint={hints[s] || ''}
          />
          {i < STAGES.length - 1 && (
            <span aria-hidden="true" style={{
              width: compact ? 12 : 20, height: 2, borderRadius: 2,
              background: i < idx ? GOLD : BORDER,
            }} />
          )}
        </li>
      ))}
    </ol>
  );
}
