/**
 * ManageGallery.jsx — "Manage gallery", one panel per share link (RULINGS-CROSS X-24 (c), X-24b).
 *
 * Mounted by ShareToGallery once a dossier is exported. Carries: snapshot or live (and
 * "Refresh snapshot now"), the hidden-items list with its counter and the door into
 * "Curate for visitors" (CurateMode), the gallery details ShareToGallery hands in, and
 * "Remove from gallery". Presentational: ShareToGallery owns the share state and the writes.
 */

import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import CurateMode from './CurateMode.jsx';
import { VEIL_MODES } from '../../domain/display/galleryVeil.js';
import { BORDER2, CARD_ALT, INK, BODY, RED, sans, SP, FS } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

/** The two modes as the toggle names them (X-24), snapshot first (the default). */
const MODE_OPTIONS = Object.freeze([
  { id: VEIL_MODES[0], label: 'Snapshot' },
  { id: VEIL_MODES[1], label: 'Live' },
]);

/** The snapshot-or-live toggle, shared by the export row and the Manage panel. */
export function GalleryModeToggle({ mode, onChange }) {
  return <Segmented options={MODE_OPTIONS} value={mode} onChange={onChange} size="sm" ariaLabel="Snapshot or live" />;
}

export default function ManageGallery({
  mode, onMode, share, veil, veilModel, visitorCopy,
  curating, setCurating, onCurateDone, onRefresh, onRemove, busy, details,
}) {
  const mobile = useIsMobile();
  const lineStyle = { fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), color: INK };
  const snapshotWhen = share.at ? new Date(share.at).toLocaleString() : '';
  return (
    <div role="region" aria-label="Manage gallery" style={{
      width: '100%', display: 'grid', gap: SP.sm, padding: SP.sm,
      border: `1px solid ${BORDER2}`, background: CARD_ALT, marginTop: SP.xs,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
        <GalleryModeToggle mode={mode} onChange={onMode} />
        <span style={lineStyle}>
          {mode === 'live'
            ? 'Live: the gallery page follows every save and every advance.'
            : (share.snapshot && snapshotWhen ? `Snapshot taken ${snapshotWhen}.` : 'Snapshot: the gallery page shows the copy taken at export.')}
        </span>
        {mode !== 'live' && (
          <Button variant="secondary" size="sm" onClick={onRefresh} busy={busy}>Refresh snapshot now</Button>
        )}
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
          <strong style={lineStyle}>
            {veilModel ? `Hidden from visitors (${veilModel.count})` : 'Hidden from visitors'}
          </strong>
          <Button variant="secondary" size="sm" aria-expanded={curating} onClick={() => setCurating(v => !v)}>
            Curate for visitors
          </Button>
        </div>
        {veil.marked
          ? (veilModel && veilModel.lines.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.45 }}>
              {veilModel.lines.map(l => <li key={l.address}>{l.text}{l.byDefault ? ' (by default)' : ''}</li>)}
            </ul>
          ))
          : <span style={{ ...lineStyle, color: BODY }}>Exported before the visitor veil: every public fact shows until you curate.</span>}
      </div>
      {curating && visitorCopy && (
        <CurateMode payload={visitorCopy} deltas={veil.deltas} onDone={onCurateDone} onCancel={() => setCurating(false)} />
      )}
      {details}
      <Button variant="ghost" size="sm" onClick={onRemove} busy={busy} style={{ justifySelf: 'start', color: RED }}>
        Remove from gallery
      </Button>
    </div>
  );
}
