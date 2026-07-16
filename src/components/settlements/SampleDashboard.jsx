import { useState } from 'react';
import { X } from 'lucide-react';
import { MUTED, SECOND, BORDER, sans, FS, SP } from '../theme.js';
import { SAMPLE_SETTLEMENTS } from '../../data/sampleSettlements.js';
import { SampleCard } from './SampleCard.jsx';
import SurveyorNote from '../guidance/SurveyorNote.jsx';
import Button from '../primitives/Button.jsx';
import { isGuidanceDismissed, markGuidanceDismissed } from '../../lib/guidance.js';

// content-immersion-r2-3: the registered library_empty_invitation whisper — its
// dismissal now rides the unified sf:guidance store (a mount-site concern per
// SurveyorNote's contract), so a keeper who hides it stays un-nagged.
const WHISPER_ID = 'library_empty_invitation';

export function SampleDashboard({ onFork, forkingId }) {
  const [invited, setInvited] = useState(() => !isGuidanceDismissed(WHISPER_ID));
  return (
    <div style={{
      padding: '20px 16px',
      background: 'rgba(255,251,245,0.96)',
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
    }}>
      {/* W-GUIDE-2 §8: the empty library greets the keeper in the Surveyor's
          note register (registered whisper library_empty_invitation). A margin
          rest-point invitation — it never blocks or floats. */}
      {invited && (
        <div style={{ marginBottom: SP.md, display: 'flex', alignItems: 'flex-start', gap: 4 }}>
          <div style={{ flex: 1 }}>
            <SurveyorNote topic="library" moment="empty" id="library-empty-invitation" compact />
          </div>
          <Button
            variant="ghost" size="sm" icon={<X size={11} />}
            aria-label="Dismiss the library note"
            onClick={() => { markGuidanceDismissed(WHISPER_ID); setInvited(false); }}
          />
        </div>
      )}
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
