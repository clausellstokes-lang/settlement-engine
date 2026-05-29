/**
 * EditableInline.jsx — Click-to-edit primitive used everywhere a single
 * piece of dossier text becomes editable.
 *
 * The critique's E-1 ("the dossier is the artifact the DM edits, not a
 * read-only view") would otherwise force three or four bespoke
 * click-to-edit implementations across the codebase (NPC names,
 * faction labels, summary prose, the sample-card teaching fields).
 * Each would drift on focus management, commit semantics, escape
 * behavior. This component is the one place that gets right:
 *
 *   • Click → switch text → input with the same on-screen dimensions
 *     (no jump). Cursor goes to end of value.
 *   • Enter commits. Shift+Enter inserts a newline in multiline mode.
 *   • Esc cancels — value reverts to the prop, no commit fires.
 *   • Blur commits, unless `validate` rejected the value.
 *   • Empty commit reverts to last good value (no destructive empty
 *     unless `allowEmpty` is on).
 *   • Hover reveals a small gold pencil (matches the EditorInline
 *     mockup from the Editing & Map canvas). The pencil sits to the
 *     RIGHT of the text, not over it, so it doesn't shift content
 *     when it appears.
 *
 * Provenance:
 *   On a successful commit the component dispatches `trackEvent`
 *   through Funnel.track + records a `userEdit` via the existing
 *   domain/userEdits.js module IF `provenance` is provided. The
 *   provenance shape — { kind, entityId } — is the same one the
 *   AI-overlay verifier (P49) already consumes, so edits become
 *   traceable end-to-end without a new contract.
 *
 * Accessibility:
 *   - The trigger has role="button" + aria-label for screen readers.
 *   - Enter/Space on the trigger opens edit mode (keyboard parity).
 *   - The input/textarea preserves the text typography so the visual
 *     swap is dimensionally identical.
 *
 * Not used for:
 *   - Bulk renames (the existing Edit Names modal owns that)
 *   - Numeric inputs with steppers
 *   - Rich text (multiline supports newlines but not formatting)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { FS } from '../theme.js';

const GOLD = '#C9A24C';
const GOLD_DIM = '#D9B566';
const BORDER = '#E8D9B0';

/**
 * @typedef {Object} EditableInlineProps
 * @property {string} value                          — current text
 * @property {(v: string) => void} onCommit          — fires when committed
 * @property {() => void} [onCancel]                 — fires on Esc
 * @property {(v: string) => true | string} [validate]
 *   Return true to accept, or a string error message to block.
 * @property {boolean} [multiline=false]             — textarea instead of input
 * @property {string}  [placeholder]                 — shown when empty in edit mode
 * @property {string}  [ariaLabel]                   — required for a11y if no label nearby
 * @property {React.CSSProperties} [textStyle]       — typography for the read-only display
 * @property {React.CSSProperties} [editStyle]       — overrides for the input/textarea
 * @property {boolean} [disabled=false]              — read-only (tier-gated fields)
 * @property {boolean} [allowEmpty=false]            — allow committing empty
 * @property {string}  [trackEvent]                  — analytics event on commit
 * @property {Object}  [provenance]                  — { kind, entityId } for userEdits
 * @property {string}  [className]
 */

export default function EditableInline({
  value,
  onCommit,
  onCancel,
  validate,
  multiline = false,
  placeholder = '',
  ariaLabel,
  textStyle = {},
  editStyle = {},
  disabled = false,
  allowEmpty = false,
  trackEvent,
  provenance,
  className,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);

  // Keep draft in sync if the parent prop changes while we're NOT editing.
  // While editing, the user's keystrokes own the draft.
  useEffect(() => {
    if (!editing) setDraft(value ?? '');
  }, [value, editing]);

  // Focus the input when we enter edit mode + place cursor at end.
  useEffect(() => {
    if (!editing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    try { el.setSelectionRange(len, len); } catch { /* unsupported on some types */ }
  }, [editing]);

  const beginEdit = useCallback(() => {
    if (disabled) return;
    setDraft(value ?? '');
    setError(null);
    setEditing(true);
  }, [disabled, value]);

  const cancel = useCallback(() => {
    setDraft(value ?? '');
    setError(null);
    setEditing(false);
    if (typeof onCancel === 'function') onCancel();
    if (triggerRef.current) triggerRef.current.focus();
  }, [value, onCancel]);

  const commit = useCallback(() => {
    const next = draft;
    // Empty + !allowEmpty → cancel
    if (!allowEmpty && (!next || !String(next).trim())) {
      cancel();
      return;
    }
    if (typeof validate === 'function') {
      const result = validate(next);
      if (result !== true) {
        setError(typeof result === 'string' ? result : 'Invalid');
        return;
      }
    }
    setEditing(false);
    setError(null);

    // Only fire onCommit if the value actually changed.
    if (next !== (value ?? '')) {
      if (typeof onCommit === 'function') onCommit(next);
      // Analytics — fire-and-forget, never block the edit.
      if (trackEvent) {
        import('../../lib/analytics.js').then(({ Funnel }) => {
          Funnel.track(trackEvent, {
            kind: provenance?.kind,
            entityId: provenance?.entityId,
          });
        }).catch(() => { /* silent */ });
      }
      // Provenance — record into userEdits if the consumer wants tracking.
      if (provenance && provenance.kind && provenance.entityId) {
        import('../../domain/userEdits.js').then(mod => {
          if (typeof mod.recordEdit === 'function') {
            try {
              mod.recordEdit({
                kind: provenance.kind,
                entityId: provenance.entityId,
                oldValue: value,
                newValue: next,
                ts: Date.now(),
              });
            } catch { /* silent */ }
          }
        }).catch(() => { /* silent */ });
      }
    }
  }, [draft, value, allowEmpty, validate, onCommit, trackEvent, provenance, cancel]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
      return;
    }
    if (e.key === 'Enter') {
      // Multiline: Enter inserts newline; Shift+Enter / Cmd+Enter commits.
      // Single-line: Enter commits.
      if (!multiline) {
        e.preventDefault();
        commit();
      } else if (e.shiftKey || e.metaKey || e.ctrlKey) {
        e.preventDefault();
        commit();
      }
    }
  };

  // ── Render — edit mode ──────────────────────────────────────────────────
  if (editing) {
    const sharedInputStyle = {
      width: '100%',
      padding: '2px 4px',
      margin: '-2px -4px',
      background: '#fff',
      border: `1px solid ${error ? '#A23434' : GOLD}`,
      borderRadius: 3,
      outline: 'none',
      fontFamily: 'inherit',
      ...textStyle,
      ...editStyle,
    };
    return (
      <span className={className} style={{ display: multiline ? 'block' : 'inline-block', position: 'relative' }}>
        {multiline ? (
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setError(null); }}
            onBlur={commit}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label={ariaLabel}
            rows={Math.max(2, (draft.match(/\n/g) || []).length + 1)}
            style={{ ...sharedInputStyle, resize: 'vertical' }}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setError(null); }}
            onBlur={commit}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label={ariaLabel}
            style={sharedInputStyle}
          />
        )}
        {error && (
          <span style={{
            position: 'absolute',
            top: '100%', left: 0,
            marginTop: 2,
            fontSize: FS.xs,
            color: '#A23434',
            background: '#fff',
            padding: '2px 6px',
            border: `1px solid #A23434`,
            borderRadius: 3,
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}>
            {error}
          </span>
        )}
      </span>
    );
  }

  // ── Render — read-only display with hover pencil ────────────────────────
  const displayText = value ?? '';
  const isEmpty = !displayText || !String(displayText).trim();

  return (
    <span
      ref={triggerRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel || `Edit ${displayText || placeholder || ''}`}
      onClick={beginEdit}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          beginEdit();
        }
      }}
      className={className}
      style={{
        display: 'inline-block',
        cursor: disabled ? 'default' : 'text',
        borderBottom: disabled ? 'none' : `1px dashed transparent`,
        transition: 'border-color 0.15s',
        position: 'relative',
        color: isEmpty ? '#9C8068' : undefined,
        fontStyle: isEmpty ? 'italic' : undefined,
        ...textStyle,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.borderBottomColor = GOLD_DIM;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.borderBottomColor = 'transparent';
      }}
    >
      {isEmpty ? placeholder : displayText}
      {!disabled && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            marginLeft: 4,
            fontSize: '0.75em',
            color: GOLD,
            opacity: 0,
            transition: 'opacity 0.15s',
          }}
          className="editable-pencil"
        >
          ✎
        </span>
      )}
      <style>{`
        [role="button"]:hover > .editable-pencil,
        [role="button"]:focus-visible > .editable-pencil {
          opacity: 1;
        }
      `}</style>
    </span>
  );
}
