import { ThumbsUp } from 'lucide-react';

import Button from '../primitives/Button.jsx';

export default function VoteButton({ count = 0, voted = false, disabled = false, onClick }) {
  return (
    <Button
      type="button"
      variant={voted ? 'success' : 'secondary'}
      size="sm"
      icon={<ThumbsUp size={13} />}
      title={voted ? 'Remove upvote' : 'Upvote'}
      disabled={disabled}
      onClick={event => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      {Math.max(0, Number(count) || 0)}
    </Button>
  );
}
