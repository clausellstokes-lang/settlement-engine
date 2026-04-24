/**
 * AnnotateToolbar — contextual toolbar for MAP_MODES.ANNOTATE.
 *
 * Lets the user pick a tool (select / label / marker / forest) and tune
 * the options for each tool (font size, color, marker icon, forest style).
 */

import React from 'react';
import { MousePointer2, Type, Pin, Trash2, Undo2, Redo2 } from 'lucide-react';
import { useStore } from '../../store';
import { ANNOTATE_TOOLS } from '../../store/mapSlice.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, sans, FS, SP, R } from '../theme.js';

export default function AnnotateToolbar() {
  const annotateTool    = useStore(s => s.annotateTool);
  const setAnnotateTool = useStore(s => s.setAnnotateTool);
  const opts            = useStore(s => s.annotateOptions);
  const setOpt          = useStore(s => s.setAnnotateOption);
  const selectedId      = useStore(s => s.selectedAnnotationId);
  const deleteLabel     = useStore(s => s.deleteLabel);
  const deleteMarker    = useStore(s => s.deleteMarker);
  const mapUndo         = useStore(s => s.mapUndo);
  const mapRedo         = useStore(s => s.mapRedo);

  function handleDelete() {
    if (!selectedId) return;
    // We don't know which layer the id is in — try both.
    deleteLabel(selectedId);
    deleteMarker(selectedId);
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      padding: `${SP.sm}px ${SP.md}px`,
      background: CARD, borderRadius: R.lg, border: `1px solid ${BORDER}`,
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

      <div style={{ width: 1, height: 24, background: BORDER2 }} />

      {/* Per-tool options */}
      {annotateTool === ANNOTATE_TOOLS.LABEL && (
        <>
          <OptionLabel>Size</OptionLabel>
          <input
            type="range" min={8} max={48} step={1}
            value={opts.labelSize}
            onChange={e => setOpt('labelSize', Number(e.target.value))}
            style={{ width: 90, accentColor: GOLD }}
          />
          <span style={{ fontSize: FS.xxs, color: SECOND, minWidth: 18 }}>{opts.labelSize}</span>
          <OptionLabel>Font</OptionLabel>
          <select
            value={opts.labelFont}
            onChange={e => setOpt('labelFont', e.target.value)}
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
            style={{ width: 26, height: 22, border: `1px solid ${BORDER}`, borderRadius: R.sm, cursor: 'pointer' }}
          />
        </>
      )}

      {annotateTool === ANNOTATE_TOOLS.MARKER && (
        <>
          <OptionLabel>Icon</OptionLabel>
          <select
            value={opts.markerIcon}
            onChange={e => setOpt('markerIcon', e.target.value)}
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
            style={{ width: 26, height: 22, border: `1px solid ${BORDER}`, borderRadius: R.sm, cursor: 'pointer' }}
          />
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Selection actions */}
      {selectedId && annotateTool === ANNOTATE_TOOLS.SELECT && (
        <button
          onClick={handleDelete}
          title="Delete selected annotation"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 10px',
            background: '#8a2a2a', color: '#fff',
            border: 'none', borderRadius: R.sm,
            fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
          }}
        >
          <Trash2 size={12} /> Delete
        </button>
      )}

      {/* Undo / Redo */}
      <button onClick={mapUndo} title="Undo" style={iconBtnStyle}>
        <Undo2 size={13} />
      </button>
      <button onClick={mapRedo} title="Redo" style={iconBtnStyle}>
        <Redo2 size={13} />
      </button>
    </div>
  );
}

function ToolButton({ active, onClick, Icon, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '5px 10px',
        background: active ? CARD : 'transparent',
        border: 'none', borderRadius: R.sm,
        color: active ? INK : SECOND,
        fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

function OptionLabel({ children }) {
  return (
    <span style={{
      fontSize: FS.xxs, fontWeight: 700, color: SECOND,
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
  fontSize: FS.xxs, fontFamily: sans, color: INK,
  cursor: 'pointer',
};

const iconBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 26,
  padding: 0,
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: R.sm,
  color: INK, cursor: 'pointer',
};
