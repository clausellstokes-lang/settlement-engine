/**
 * AnnotateToolbar — contextual toolbar for MAP_MODES.ANNOTATE.
 *
 * Lets the user pick a tool (select / label / marker / forest) and tune
 * the options for each tool (font size, color, marker icon, forest style).
 */

import { MousePointer2, Type, Pin, Trash2, Undo2, Redo2 } from 'lucide-react';
import { useStore } from '../../store';
import { ANNOTATE_TOOLS } from '../../store/mapSlice.js';
import { GOLD, INK, SECOND, BORDER, BORDER2, CARD, ELEV, sans, FS, SP, R } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

export default function AnnotateToolbar() {
  const annotateTool    = useStore(s => s.annotateTool);
  const setAnnotateTool = useStore(s => s.setAnnotateTool);
  const opts            = useStore(s => s.annotateOptions);
  const setOpt          = useStore(s => s.setAnnotateOption);
  const selectedId      = useStore(s => s.selectedAnnotationId);
  const selectedKind    = useStore(s => s.selectedAnnotationKind);
  const deleteLabel     = useStore(s => s.deleteLabel);
  const deleteMarker    = useStore(s => s.deleteMarker);
  const deleteForest    = useStore(s => s.deleteForest);
  const mapUndo         = useStore(s => s.mapUndo);
  const mapRedo         = useStore(s => s.mapRedo);
  const canUndo         = useStore(s => s.mapUndoStack.length > 0);
  const canRedo         = useStore(s => s.mapRedoStack.length > 0);

  function handleDelete() {
    if (!selectedId) return;
    // The selecting layer records which kind the id belongs to, so fire the
    // SINGLE correct deletion. Fallback to all-three only if the kind is
    // somehow absent (legacy selection) — deletes are id-scoped filters, so a
    // miss on the wrong layer is a harmless no-op.
    switch (selectedKind) {
      case 'label':  deleteLabel(selectedId); return;
      case 'marker': deleteMarker(selectedId); return;
      case 'forest': deleteForest(selectedId); return;
      default:
        deleteLabel(selectedId);
        deleteMarker(selectedId);
        deleteForest(selectedId);
    }
  }

  return (
    // Second row of the shared toolbar card (WorldMap.jsx) — no border/fill of
    // its own; a single top hairline divides it from the mode row without
    // re-introducing a stacked box (P5).
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap',
      padding: `${SP.sm}px ${SP.md}px`,
      borderTop: `1px solid ${BORDER}`,
    }}>
      {/* Tool selector */}
      <div style={{
        display: 'flex', gap: 2, padding: 2,
        background: BORDER2, borderRadius: R.md,
      }}>
        <ToolButton
          active={annotateTool === ANNOTATE_TOOLS.SELECT}
          onClick={() => setAnnotateTool(ANNOTATE_TOOLS.SELECT)}
          Icon={MousePointer2}
          label="Select"
        />
        <ToolButton
          active={annotateTool === ANNOTATE_TOOLS.LABEL}
          onClick={() => setAnnotateTool(ANNOTATE_TOOLS.LABEL)}
          Icon={Type}
          label="Text"
        />
        <ToolButton
          active={annotateTool === ANNOTATE_TOOLS.MARKER}
          onClick={() => setAnnotateTool(ANNOTATE_TOOLS.MARKER)}
          Icon={Pin}
          label="Marker"
        />
      </div>

      {/* Grouping via differential spacing, not a hairline: a single wide gap
          separates the tool picker from its option cluster (P5). */}
      <div style={{ width: SP.lg }} />

      {/* Per-tool options */}
      {annotateTool === ANNOTATE_TOOLS.LABEL && (
        <>
          <OptionLabel>Size</OptionLabel>
          <input
            type="range" min={8} max={48} step={1}
            value={opts.labelSize}
            onChange={e => setOpt('labelSize', Number(e.target.value))}
            aria-label="Size"
            style={{ width: 90, accentColor: GOLD }}
          />
          <span style={{ fontSize: FS.xs, color: SECOND, minWidth: 18 }}>{opts.labelSize}</span>
          <OptionLabel>Font</OptionLabel>
          <select
            value={opts.labelFont}
            onChange={e => setOpt('labelFont', e.target.value)}
            aria-label="Font"
            style={selectStyle}
          >
            <option value="serif">Serif</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Crimson Text', serif">Crimson</option>
            <option value="sans-serif">Sans</option>
            <option value="'Nunito', sans-serif">Nunito</option>
            <option value="fantasy">Fantasy</option>
          </select>
          <OptionLabel>Color</OptionLabel>
          <input
            type="color"
            value={opts.labelColor}
            onChange={e => setOpt('labelColor', e.target.value)}
            aria-label="Color"
            style={{ width: 28, height: 28, border: `1px solid ${BORDER}`, borderRadius: R.sm, cursor: 'pointer' }}
          />
        </>
      )}

      {annotateTool === ANNOTATE_TOOLS.MARKER && (
        <>
          <OptionLabel>Icon</OptionLabel>
          <select
            value={opts.markerIcon}
            onChange={e => setOpt('markerIcon', e.target.value)}
            aria-label="Marker icon"
            style={selectStyle}
          >
            <option value="pin">Pin</option>
            <option value="star">Star</option>
            <option value="skull">Skull</option>
            <option value="flag">Flag</option>
          </select>
          <OptionLabel>Color</OptionLabel>
          <input
            type="color"
            value={opts.markerColor}
            onChange={e => setOpt('markerColor', e.target.value)}
            aria-label="Color"
            style={{ width: 28, height: 28, border: `1px solid ${BORDER}`, borderRadius: R.sm, cursor: 'pointer' }}
          />
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Selection actions — destructive, so low-emphasis (P8): it must never be
          the loudest control in the row. It already renders only when an
          annotation is selected, so it needs no color emphasis to be found. */}
      {selectedId && annotateTool === ANNOTATE_TOOLS.SELECT && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          title="Delete selected annotation"
          icon={<Trash2 size={12} />}
        >
          Delete
        </Button>
      )}

      {/* Undo / Redo — disabled when their stack is empty so the available-action
          state is honest (P10), and sized up toward the at-the-table target (P7). */}
      <IconButton Icon={Undo2} label="Undo" onClick={mapUndo} size="lg" disabled={!canUndo} />
      <IconButton Icon={Redo2} label="Redo" onClick={mapRedo} size="lg" disabled={!canRedo} />
    </div>
  );
}

function ToolButton({ active, onClick, Icon, label }) {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onClick}
      title={label}
      icon={<Icon size={13} />}
      aria-pressed={active}
      // Inset shadow as the second active-state channel, matching ModeSwitch /
      // TerrainToolbar / the map IconButton so "selected" is one idiom (P11/P7).
      style={active ? { boxShadow: ELEV[1] } : undefined}
    >
      {label}
    </Button>
  );
}

function OptionLabel({ children }) {
  return (
    <span style={{
      fontSize: FS.xs, fontWeight: 700, color: SECOND,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  );
}

const selectStyle = {
  padding: '4px 8px',
  border: `1px solid ${BORDER}`,
  borderRadius: R.sm,
  background: CARD,
  fontSize: FS.xs, fontFamily: sans, color: INK,
  cursor: 'pointer',
};
