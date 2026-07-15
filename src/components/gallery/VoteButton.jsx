import Button from '../primitives/Button.jsx';
import { GOLD_TXT } from '../theme.js';

export default function VoteButton({ count = 0, voted = false, disabled = false, isSignedIn = true, onClick }) {
  const votes = Math.max(0, Number(count) || 0);
  // Signed-out awareness lives ON the control: a card-deep vote whose only
  // feedback (the page-top "Sign in to vote" banner) renders off-screen would
  // read as a no-op, so surface the requirement in the title/aria here.
  const action = voted ? 'Remove upvote' : 'Upvote';
  const label = isSignedIn ? action : 'Sign in to vote';
  return (
    <Button
      type="button"
      variant={voted ? 'success' : 'secondary'}
      size="sm"
      title={label}
      aria-pressed={voted}
      aria-label={`${label} (${votes} votes)`}
      disabled={disabled}
      // Button `sm` is 32px; this named vote control must clear the 44px
      // at-the-table touch floor, so override the undersized primitive here.
      style={{ minHeight: 44 }}
      onClick={event => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <span style={{ color: GOLD_TXT, fontWeight: 700 }}>{votes}</span>
    </Button>
  );
}
