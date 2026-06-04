import { ThumbsUp } from 'lucide-react';

import { BORDER2, CARD, FS, GREEN, INK, R, sans, swatch } from '../theme.js';

export default function VoteButton({ count = 0, voted = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={event => {
        event.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      title={voted ? 'Remove upvote' : 'Upvote'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        minHeight: 28,
        padding: '4px 8px',
        border: `1px solid ${voted ? GREEN : BORDER2}`,
        borderRadius: R.sm,
        background: voted ? swatch.successBg : CARD,
        color: voted ? GREEN : INK,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 950,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.68 : 1,
      }}
    >
      <ThumbsUp size={13} /> {Math.max(0, Number(count) || 0)}
    </button>
  );
}
