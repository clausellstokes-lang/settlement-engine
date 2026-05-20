/**
 * primitives/EditableText — click-to-edit prose primitive.
 *
 * Tier 5.4 of the roadmap. Premium users can hand-write any
 * registered prose field (NPC secret, plot hook, history beat, etc.)
 * in place. The primitive is purely presentational — it owns the
 * draft state and the keyboard/blur handling, but the parent owns
 * persistence (onSave) and revert (onRevert) and decides which
 * fields to render as editable.
 *
 * Behavior:
 *   - When `editMode` is false, renders plain text. The Edited badge
 *     still surfaces if `isEdited` is true so readers see provenance.
 *   - When `editMode` is true, clicking the text opens a textarea.
 *     Enter (without Shift) commits via onSave. Esc cancels. Blur
 *     commits.
 *   - When `isEdited`, a small "↺ Revert" affordance shows next to
 *     the text in edit mode (or via the badge tooltip).
 *
 * Keyboard:
 *   - Enter           commit (multiline: Shift+Enter for newline)
 *   - Esc             cancel
 *   - Tab             commit + advance (browser default)
 *
 * Single-line mode (`multiline={false}`) uses an <input>; multi-line
 * (default) uses a <textarea> that auto-grows to its content.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = Object.freeze({
  inkDeep:    '#1c1409',
  muted:      '#9c8068',
  border:     '#d2bd96',
  edited:     '#5a2a8a',
  editedBg:   'rgba(90,42,138,0.08)',
  editedBdr:  'rgba(90,42,138,0.35)',
  focusBdr:   '#a0762a',
  focusBg:    '#fffbf5',
});

export function EditableText({
  value,
  originalValue,    // string | null — the pre-edit value (for Revert tooltip)
  isEdited = false,
  editMode = false,
  multiline = true,
  placeholder = 'Click to edit',
  onSave,
  onRevert,
  style = {},
  textStyle = {},
  // a11y label for screen readers — pass the field name (e.g. "NPC secret")
  ariaLabel,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  // The draft state is initialized to the live `value` on every
  // entry into edit mode (see `enterEdit` below), so a sync effect
  // would be redundant — and the React 19 set-state-in-effect lint
  // rule rightly flags an `if (!editing) setDraft(value)` effect as
  // a cascading-render risk. Read mode reads `value` directly, so
  // external updates surface immediately without any sync state.

  // Auto-focus + auto-grow on edit-open.
  useEffect(() => {
    if (!editing || !inputRef.current) return;
    const el = inputRef.current;
    el.focus();
    // Select-all on open so the user can replace immediately.
    try { el.select?.(); } catch { /* not all inputs support select */ }
    if (multiline) autoGrow(el);
  }, [editing, multiline]);

  // Open editing for the current `value` (snapshot, not a subscription).
  // Centralized so click + Enter + Space all go through the same path.
  const enterEdit = useCallback(() => {
    setDraft(value ?? '');
    setEditing(true);
  }, [value]);

  const commit = useCallback(() => {
    const next = draft;
    setEditing(false);
    if (next !== value && typeof onSave === 'function') onSave(next);
  }, [draft, value, onSave]);

  const cancel = useCallback(() => {
    setDraft(value ?? '');
    setEditing(false);
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
      return;
    }
    if (e.key === 'Enter') {
      if (multiline && e.shiftKey) return; // allow newline
      e.preventDefault();
      commit();
    }
  };

  const handleChange = (e) => {
    setDraft(e.target.value);
    if (multiline && inputRef.current) autoGrow(inputRef.current);
  };

  const handleClick = () => {
    if (editMode && !editing) enterEdit();
  };

  // ── Render ────────────────────────────────────────────────────────────

  // Read mode
  if (!editing) {
    const baseStyle = {
      whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
      cursor: editMode ? 'text' : 'default',
      borderRadius: 3,
      padding: editMode ? '2px 4px' : 0,
      margin: editMode ? '-2px -4px' : 0,
      background: isEdited && editMode ? COLORS.editedBg : 'transparent',
      border: isEdited && editMode ? `1px dashed ${COLORS.editedBdr}` : '1px solid transparent',
      transition: 'background 0.15s, border-color 0.15s',
      ...style,
    };
    const textProps = {
      onClick: handleClick,
      role: editMode ? 'button' : undefined,
      tabIndex: editMode ? 0 : -1,
      'aria-label': ariaLabel,
      onKeyDown: editMode ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          enterEdit();
        }
      } : undefined,
      style: { ...baseStyle, ...textStyle },
      title: isEdited ? 'User-edited. Click to edit, or use Revert to restore.' : (editMode ? 'Click to edit' : undefined),
    };
    return (
      <span {...textProps}>
        {value || (editMode ? <span style={{ color: COLORS.muted, fontStyle: 'italic' }}>{placeholder}</span> : '')}
        {isEdited && editMode && (
          <RevertChip
            originalValue={originalValue}
            onClick={(e) => { e.stopPropagation(); if (onRevert) onRevert(); }}
          />
        )}
      </span>
    );
  }

  // Edit mode
  const inputStyle = {
    width: '100%',
    minHeight: multiline ? 60 : undefined,
    boxSizing: 'border-box',
    border: `1px solid ${COLORS.focusBdr}`,
    borderRadius: 4,
    padding: '6px 8px',
    background: COLORS.focusBg,
    color: COLORS.inkDeep,
    font: 'inherit',
    lineHeight: 1.55,
    resize: multiline ? 'vertical' : 'none',
    outline: 'none',
    ...style,
  };
  const InputTag = multiline ? 'textarea' : 'input';
  return (
    <span style={{ display: 'inline-block', width: '100%' }}>
      <InputTag
        ref={inputRef}
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        aria-label={ariaLabel}
        placeholder={placeholder}
        style={inputStyle}
      />
      <span style={{ fontSize: 10, color: COLORS.muted, marginTop: 3, display: 'block' }}>
        Enter to save · Esc to cancel{multiline ? ' · Shift+Enter for newline' : ''}
        {isEdited && (
          <>
            {' · '}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} // don't blur the input
              onClick={onRevert}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: COLORS.edited, cursor: 'pointer', fontSize: 10,
                textDecoration: 'underline', fontWeight: 600,
              }}
              title={originalValue ? `Revert to: "${truncate(originalValue, 60)}"` : 'Revert to generated value'}
            >
              ↺ Revert
            </button>
          </>
        )}
      </span>
    </span>
  );
}

// ── Small auxiliary surfaces ─────────────────────────────────────────

/**
 * Pill-shaped indicator that a field is user-edited. Renders inline.
 */
export function EditedBadge({ count = null, style = {} }) {
  return (
    <span
      title="This dossier contains user-edited prose. The engine will preserve these edits across rerolls; the AI overlay will pass them through verbatim."
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 10, fontWeight: 700, color: COLORS.edited,
        background: COLORS.editedBg, border: `1px solid ${COLORS.editedBdr}`,
        borderRadius: 3, padding: '2px 6px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        ...style,
      }}
    >
      ✎ Edited{count != null && count > 0 ? ` · ${count}` : ''}
    </span>
  );
}

function RevertChip({ originalValue, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={originalValue ? `Revert to: "${truncate(originalValue, 60)}"` : 'Revert to generated value'}
      style={{
        marginLeft: 6,
        background: 'none',
        border: `1px solid ${COLORS.editedBdr}`,
        borderRadius: 3,
        padding: '0 5px',
        color: COLORS.edited,
        fontSize: 9,
        fontWeight: 700,
        cursor: 'pointer',
        lineHeight: 1.6,
        verticalAlign: 'middle',
      }}
    >
      ↺
    </button>
  );
}

function autoGrow(el) {
  if (!el || el.tagName !== 'TEXTAREA') return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function truncate(s, n) {
  if (typeof s !== 'string') return '';
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

export default EditableText;
