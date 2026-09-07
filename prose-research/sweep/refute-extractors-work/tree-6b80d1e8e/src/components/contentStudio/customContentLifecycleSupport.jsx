import { BODY, FS, swatch } from '../theme.js';

export function definitionIdOf(item) {
  return String(item?.definitionId || item?.id || '');
}

export function definitionName(item, fallback = 'Untitled definition') {
  return String(item?.name || fallback);
}

export function receiptIsConfirmed(receipt) {
  return (
    receipt?.ok === true
    && receipt?.status === 'applied'
    && receipt?.persistence?.state === 'confirmed'
  );
}

export function readableFailure(receipt, fallback) {
  if (receipt?.status === 'stale') {
    return 'This definition changed before the action completed. Reload it and try again.';
  }
  const reason = String(receipt?.reason || '').replaceAll('_', ' ').trim();
  return reason ? `${fallback}: ${reason}.` : `${fallback}.`;
}

export function StatusNotice({ children }) {
  if (!children) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        marginTop: 8,
        padding: '7px 9px',
        borderLeft: `3px solid ${swatch.success}`,
        background: `${swatch.success}0d`,
        color: BODY,
        fontSize: FS.xs,
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}

export function ErrorNotice({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      style={{
        marginTop: 8,
        padding: '7px 9px',
        borderLeft: `3px solid ${swatch.danger}`,
        background: `${swatch.danger}0d`,
        color: BODY,
        fontSize: FS.xs,
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}
