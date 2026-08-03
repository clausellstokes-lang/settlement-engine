import { useId } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import {
  BODY, BORDER, CARD, CARD_ALT, FS, GOLD, INK, MUTED, R, SP,
  RED, AMBER, sans,
} from '../theme.js';
import Button from './Button.jsx';
import { useDialogFocusTrap } from './useDialogFocusTrap.js';
import { useIconsOn } from './IconsContext.js';

function Shell({ open, title, body, children, onCancel, tone = 'default' }) {
  // Shared focus trap: focus-in on open, Tab cycling, Escape-to-cancel, and
  // focus restore on close. onCancel is read through a ref inside the hook so a
  // new handler identity on a parent re-render does NOT re-run focus-in
  // mid-typing.
  const dialogRef = useDialogFocusTrap(open, onCancel);

  const iconsOn = useIconsOn();
  if (!open) return null;
  const iconColor = tone === 'danger' ? RED : tone === 'warning' ? AMBER : GOLD;

  return (
    <div
      role="presentation"
      className="oc-m-warmdim"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SP.lg,
        // The room dims warm behind the plate (organic motion #10 warm-dim). The
        // rgba is the token warm-dim value (58% ink-deepest, matching oc-m-warmdim);
        // the class supplies the fade-in, reduced-motion-safe.
        background: 'rgba(27,20,8,0.58)',
      }}
      onMouseDown={event => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={{
          width: 'min(100%, 460px)',
          maxHeight: 'min(90vh, 680px)',
          overflow: 'auto',
          border: `1px solid ${BORDER}`,
          // The plate is rule-framed, not rounded, and holds no z-axis — depth is
          // the warm-dim ground, never elevation (organic craft §3/§6). The radius
          // and shadow lines are kept as value-swaps so the kill-list stays exact;
          // both are would-be burn-down deletions.
          borderRadius: 0,
          background: CARD,
          boxShadow: 'none',
        }}
      >
        <header style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`,
          background: CARD_ALT,
        }}>
          {iconsOn && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 0,
            border: `1px solid ${BORDER}`,
            background: CARD,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0,
          }}>
            <AlertTriangle size={16} />
          </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              margin: 0,
              color: INK,
              fontFamily: sans,
              fontSize: FS.lg,
              lineHeight: 1.25,
              fontWeight: 900,
            }}>
              {title}
            </h2>
            {body && (
              <p style={{
                margin: `${SP.xs}px 0 0`,
                color: BODY,
                fontFamily: sans,
                fontSize: FS.sm,
                lineHeight: 1.45,
              }}>
                {body}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            style={{
              border: 'none',
              background: 'transparent',
              color: MUTED,
              cursor: 'pointer',
              padding: SP.xs,
              display: 'inline-flex',
            }}
          >
            {iconsOn
              ? <X size={16} />
              : <span aria-hidden="true" style={{ fontSize: FS.xl, lineHeight: 1, fontWeight: 700 }}>×</span>}
          </button>
        </header>
        <div style={{ padding: SP.lg }}>
          {children}
        </div>
      </section>
    </div>
  );
}

export function ConfirmDialog({
  open,
  heading,
  title,
  body,
  // Optional extra content rendered ABOVE the action row — e.g. a toggle row or a
  // short scope list. Kept null by default so every existing call site renders
  // byte-identically (no extra DOM node when unused).
  extra = null,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  // Optional: disable the confirm action while a precondition is unmet (e.g. an
  // Advance dialog whose realm must be canonized first). Default false keeps every
  // existing call site unchanged.
  confirmDisabled = false,
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  const resolvedTitle = heading ?? title;
  return (
    <Shell open={open} title={resolvedTitle} body={body} tone={tone} onCancel={onCancel}>
      {extra}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: SP.sm, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</Button>
      </div>
    </Shell>
  );
}

export function ChoiceDialog({
  open,
  title,
  body,
  choices = [],
  // Optional: which choice takes focus when the dialog opens. Without it the
  // shared focus trap falls back to the first focusable, which is the header's
  // Close button — fine for a warning, wrong for a question whose recommended
  // answer should be one Enter away. Default null keeps every existing call site
  // rendering byte-identically (no autofocus attribute emitted).
  defaultChoiceId = null,
  cancelLabel = 'Cancel',
  // 'warning' is the shipped default (a fork the DM is being warned about);
  // 'default' is for a plain question that carries no hazard, e.g. the realm's
  // magic stance. Passed through to Shell's icon tone only.
  tone = 'warning',
  onChoose,
  onCancel,
}) {
  return (
    <Shell open={open} title={title} body={body} tone={tone} onCancel={onCancel}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        {choices.map(choice => (
          <button
            key={choice.id}
            type="button"
            // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: the recommended answer takes focus when the question opens
            autoFocus={defaultChoiceId != null && choice.id === defaultChoiceId}
            onClick={() => onChoose?.(choice.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: SP.md,
              border: `1px solid ${BORDER}`,
              borderRadius: R.lg,
              background: CARD_ALT,
              color: INK,
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: sans,
            }}
          >
            <div style={{ fontSize: FS.sm, fontWeight: 900 }}>{choice.label}</div>
            {choice.description && (
              <div style={{ marginTop: SP.xs, color: BODY, fontSize: FS.xs, lineHeight: 1.4 }}>
                {choice.description}
              </div>
            )}
          </button>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: SP.sm }}>
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        </div>
      </div>
    </Shell>
  );
}

export function TextInputDialog({
  open,
  title,
  body,
  label,
  initialValue = '',
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const inputId = useId();
  return (
    <Shell open={open} title={title} body={body} tone="default" onCancel={onCancel}>
      <form
        onSubmit={event => {
          event.preventDefault();
          const input = event.currentTarget.elements.namedItem('dialog-value');
          onConfirm?.(input?.value || '');
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}
      >
        {label && (
          // eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting the input would break the flex layout
          <label htmlFor={inputId} style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
            {label}
          </label>
        )}
        <input
          key={`${open}:${initialValue}`}
          id={inputId}
          name="dialog-value"
          defaultValue={initialValue || ''}
          aria-label={label || title}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: focus the prompt field when the modal opens
          autoFocus
          style={{
            minHeight: 38,
            padding: `${SP.sm}px ${SP.md}px`,
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
            background: CARD_ALT,
            color: INK,
            fontFamily: sans,
            fontSize: FS.sm,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: SP.sm, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="primary" type="submit">{confirmLabel}</Button>
        </div>
      </form>
    </Shell>
  );
}
