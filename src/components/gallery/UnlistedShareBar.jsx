/**
 * UnlistedShareBar.jsx — the active party-link controls for an UNLISTED share
 * (Vision V-20). Presentational leaf extracted from ShareToGallery (hot-file
 * ceiling): copy the party link, rotate it (revoking every old copy), or stop
 * sharing. House voice + a11y (button titles); state + handlers live in the
 * parent.
 */
import { Link2, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER2, MUTED, RED, sans, SP, FS } from '../theme.js';

/**
 * @param {{
 *   copied?: boolean, busy?: boolean, error?: (string|null),
 *   onCopy: () => void, onRotate: () => void, onStop: () => void,
 * }} props
 */
export default function UnlistedShareBar({ copied = false, busy = false, error = null, onCopy, onRotate, onStop }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      flexWrap: 'wrap', fontFamily: sans, width: '100%',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 9px',
        background: 'transparent', color: BODY,
        border: `1px solid ${BORDER2}`,
        fontSize: FS.xs, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        <Link2 size={11} /> Unlisted
      </span>
      <Button
        variant="gold"
        size="sm"
        onClick={onCopy}
        icon={copied ? <Check size={12} /> : <Copy size={12} />}
      >
        {copied ? 'Copied' : 'Copy party link'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRotate}
        busy={busy}
        icon={<RefreshCw size={12} />}
      >
        Rotate link
      </Button>
      <Button variant="ghost" size="sm" onClick={onStop} busy={busy}>
        {busy ? 'Working…' : 'Stop sharing'}
      </Button>
      {error && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: FS.xs, color: RED }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
      <span style={{ flexBasis: '100%', fontSize: FS.xs, color: MUTED, fontStyle: 'italic' }}>
        Only people with this exact link can open it. It never appears in the public gallery.
        Rotate the link to revoke every copy you&apos;ve shared.
      </span>
    </div>
  );
}
