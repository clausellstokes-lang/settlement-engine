import { SECOND, sans, FS, SP, PARCH } from '../theme.js';
import { SAMPLE_SETTLEMENTS } from '../../data/sampleSettlements.js';
import { SampleCard } from './SampleCard.jsx';

export function SampleDashboard({ onFork, forkingId }) {
  return (
    // Borderless tinted block — one elevation only. The three SampleCards inside
    // already carry their own borders; an outer bordered box would nest cards
    // inside a card (box-soup). Tint + the heading + spacing do the grouping.
    // Flat placeholder surface uses PARCH, distinct from the CARD fill the real
    // SampleCards carry, so the surface itself (not just a 1px border) marks the
    // elevation difference between a flat status block and a card (P5).
    <div style={{
      padding: '20px 16px',
      background: PARCH,
      borderRadius: 8,
    }}>
      {/* P1: the SampleCards are the hero of the empty state, not the chrome.
          The instruction recedes to ONE quiet subordinate caption — the heading
          is demoted from an uppercase layer-cake title to a plain prose lead at
          the same weight as its explainer, so the two no longer stack into a
          mini layer-cake that wins the squint over the dossiers they introduce.
          The cards pull up directly below. Copy text is unchanged (voice owns
          wording); only the visual hierarchy was restructured. */}
      <h2 style={{
        margin: '0 0 4px',
        fontSize: FS.sm, fontWeight: 600, color: SECOND, lineHeight: 1.5,
        textAlign: 'center', fontFamily: sans,
      }}>
        Start from a sample. Or roll your own
      </h2>
      <p style={{
        margin: '0 auto 14px', maxWidth: 460,
        fontSize: FS.sm, color: SECOND, lineHeight: 1.5,
        textAlign: 'center', fontFamily: sans,
      }}>
        Three hand-picked seeds you can fork into your own saves. Each forks
        with a unique character. Same setting, different settlement.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
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
