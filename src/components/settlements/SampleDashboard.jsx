import { MUTED, SECOND, BORDER, sans, FS } from '../theme.js';
import { SAMPLE_SETTLEMENTS } from '../../data/sampleSettlements.js';
import { SampleCard } from './SampleCard.jsx';

export function SampleDashboard({ onFork, forkingId }) {
  return (
    <div style={{
      padding: '20px 16px',
      background: 'rgba(255,251,245,0.96)',
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
    }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 800, color: MUTED,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        marginBottom: 10,
        textAlign: 'center',
      }}>
        Start from a sample. Or roll your own
      </div>
      <p style={{
        margin: '0 auto 14px', maxWidth: 460,
        fontSize: FS.sm, color: SECOND, lineHeight: 1.5,
        textAlign: 'center', fontFamily: sans,
      }}>
        Three hand-picked seeds you can fork into your own saves. Each forks
        with a unique character. Same setting, different settlement.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SAMPLE_SETTLEMENTS.map(sample => (
          <SampleCard
            key={sample.id}
            sample={sample}
            onFork={onFork}
            forking={forkingId === sample.id}
          />
        ))}
      </div>
    </div>
  );
}
