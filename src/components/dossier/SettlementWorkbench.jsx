/**
 * SettlementWorkbench — the reversible G-2 proof shell.
 *
 * The dossier remains the primary artifact. This module adds only the two tools
 * that need a stable home outside the scrolling article:
 *
 *   - Entity Inspector: a contextual read/edit surface for the entity selected
 *     through the dossier's existing stable entity web.
 *   - Change Dock: a save-scoped projection of staged work and recent receipts.
 *
 * It deliberately does not introduce a second entity index or mutation path.
 * Navigation reuses DossierEntityContext, edits reuse the existing store actions,
 * and the pending-change component remains the sole queue-review surface. The
 * whole module is lazy-mounted behind `settlementWorkbench`, so turning the flag
 * off returns to the legacy dossier without migrating or rewriting saved data.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useStore } from '../../store/index.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { activeEdits } from '../../domain/pendingEdits.js';
import {
  pendingEditOwnerScope,
  selectPendingEditOwnerScope,
} from '../../domain/pendingEditIntents.js';
import { useDossierEntities } from './DossierEntityContext.jsx';
import PendingChangesBar from './PendingChangesBar.jsx';
import Button from '../primitives/Button.jsx';
import EntityLink from '../primitives/EntityLink.jsx';
import {
  BORDER,
  FS,
  SP,
  swatch,
  sans,
  serif_,
} from '../theme.js';

const PAPER = swatch['#FFFBF5'];
const MUTED = swatch.inkMag3;

function words(value) {
  const text = String(value || '').replace(/[_-]+/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function firstText(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function entitySummary(entry) {
  const raw = entry?.raw || {};
  if (entry?.type === 'npc') {
    return firstText(raw.description, raw.structuralPosition, raw.title, raw.role)
      || 'A named person in this settlement.';
  }
  if (entry?.type === 'faction') {
    return firstText(raw.description, raw.agenda, raw.goal)
      || 'A faction participating in the settlement’s balance of power.';
  }
  if (entry?.type === 'institution') {
    return firstText(raw.description, raw.function, raw.type)
      || 'An institution serving this settlement.';
  }
  return firstText(raw.description, raw.summary, raw.text)
    || `A recorded ${words(entry?.type) || 'dossier item'}.`;
}

function recordedWhy(entry) {
  const raw = entry?.raw || {};
  const cause = raw.causeReceipt || raw.cause || raw.provenance?.cause
    || raw.compromiseLifecycle?.reason || raw.lifecycle?.reason;
  if (typeof cause === 'string' && cause.trim()) {
    return { available: true, text: cause.trim() };
  }
  if (cause && typeof cause === 'object') {
    const text = firstText(cause.summary, cause.reason, cause.label, cause.description);
    if (text) return { available: true, text };
  }
  return {
    available: false,
    text: 'No recorded cause is attached to this dossier record. SettlementForge will not infer one from correlation.',
  };
}

function connectionsFor(entry, index) {
  const raw = entry?.raw || {};
  const candidates = [
    raw.factionAffiliation,
    raw.faction,
    raw.institutionName,
    raw.institutionId,
    raw.settlementName,
    raw.neighbourName,
  ];
  const labels = [...new Set(candidates
    .filter(value => typeof value === 'string' && value.trim())
    .map(value => value.trim()))];
  const entries = index?.byId instanceof Map
    ? [...new Set(index.byId.values())]
    : [];

  return labels.map((label) => {
    const direct = index?.resolve?.(label);
    if (direct?.id && direct.id !== entry?.id) {
      return { label, id: String(direct.id), type: direct.type || null };
    }
    const normalized = label.toLowerCase();
    const matches = entries.filter(candidate => (
      candidate?.id !== entry?.id
      && String(candidate?.currentName || candidate?.label || '').trim().toLowerCase() === normalized
    ));
    // Name-based display data becomes a route only when the live dossier index
    // proves one unambiguous stable target. Zero or multiple matches stay text.
    return matches.length === 1
      ? { label, id: String(matches[0].id), type: matches[0].type || null }
      : { label, id: null, type: null };
  });
}

function receiptValues(receipts) {
  if (Array.isArray(receipts)) return receipts;
  if (receipts && typeof receipts === 'object') return Object.values(receipts);
  return [];
}

function normalizedSaveId(value) {
  return value == null || String(value).trim() === '' ? null : String(value);
}

function recordOf(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? value
    : {};
}

function receiptOutcomeDetail(receipt) {
  const domain = recordOf(receipt?.domainReceipt);
  return firstText(
    receipt?.summary,
    domain.narrativeSummary,
    domain.summary,
    domain.receipt,
  );
}

function receiptOutcomeStatus(receipt) {
  const recorded = firstText(receipt?.status);
  if (recorded) return words(recorded);
  if (receipt?.ok === true) return 'Applied';
  if (receipt?.ok === false) return 'Failed';
  return 'Recorded';
}

function receiptExplanation(receipt) {
  const domain = recordOf(receipt?.domainReceipt);
  const before = recordOf(domain.before);
  const veto = recordOf(domain.veto);
  return firstText(
    receipt?.reason,
    domain.reason,
    before.reason,
    veto.reason,
    veto.code,
  );
}

function undoButtonLabel(status) {
  if (status === 'working') return 'Undoing…';
  if (status === 'succeeded') return 'Undone';
  if (status === 'failed') return 'Try Undo again';
  return 'Undo last batch';
}

/**
 * Resolve one undo token for the most recent successful batch in this exact
 * owner/save namespace. A commit emits one receipt per intent, but every intent
 * in that batch shares the same snapshot token; returning one token here keeps
 * Undo a batch action rather than falsely presenting per-item reversals.
 */
function latestBatchUndo(receipts, ownerKey, saveId) {
  const scopedSaveId = normalizedSaveId(saveId);
  for (const receipt of receipts) {
    if (receipt?.ownerRef?.id !== ownerKey) continue;
    if (receipt.status !== 'applied' && receipt.status !== 'queued') continue;
    const token = receipt.undoToken;
    if (token?.kind !== 'snapshot' || !String(token.snapshotId || '').trim()) continue;
    if (normalizedSaveId(token.saveId) !== scopedSaveId) continue;
    return {
      key: `${ownerKey}:${scopedSaveId || 'draft'}:${String(token.snapshotId)}`,
      saveId: scopedSaveId,
      snapshotId: String(token.snapshotId),
    };
  }
  return null;
}

function EntityInspector({ readOnly = false }) {
  const mobile = useIsMobile();
  const focusedEntity = useStore(state => state.focusedEntity);
  const clearFocusedEntity = useStore(state => state.clearFocusedEntity);
  const setEditMode = useStore(state => state.setEditMode);
  const { index, navigateToEntity } = useDossierEntities();
  const entry = focusedEntity?.id ? index?.resolve?.(focusedEntity.id) : null;
  const why = useMemo(() => recordedWhy(entry), [entry]);
  const connections = useMemo(() => connectionsFor(entry, index), [entry, index]);
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!entry) return undefined;
    const active = globalThis.document?.activeElement;
    if (globalThis.HTMLElement && active instanceof globalThis.HTMLElement) {
      returnFocusRef.current = active;
    }
    panelRef.current?.focus?.({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      clearFocusedEntity?.();
      globalThis.queueMicrotask?.(() => returnFocusRef.current?.focus?.());
    };
    globalThis.window?.addEventListener?.('keydown', onKeyDown);
    return () => globalThis.window?.removeEventListener?.('keydown', onKeyDown);
  }, [entry, clearFocusedEntity]);

  if (!entry) return null;

  const label = entry.currentName || entry.label || 'Selected item';
  const interactive = entry?.identity?.interactive !== false;
  const beginAuthoring = () => {
    setEditMode?.(true);
    navigateToEntity?.(entry.id);
  };
  const closeInspector = () => {
    clearFocusedEntity?.();
    globalThis.queueMicrotask?.(() => returnFocusRef.current?.focus?.());
  };

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal={mobile ? 'true' : undefined}
      aria-labelledby="settlement-workbench-inspector-title"
      aria-describedby="settlement-workbench-inspector-purpose"
      tabIndex={-1}
      style={mobile ? {
        position: 'fixed',
        inset: 0,
        // Full-screen mobile inspection is a takeover layer, matching the
        // registered palette/takeover band in the UI stacking contract.
        zIndex: 1100,
        overflowY: 'auto',
        padding: SP.lg,
        background: PAPER,
        fontFamily: sans,
      } : {
        position: 'fixed',
        top: 88,
        right: SP.lg,
        // Desktop inspection is a floating tool, below drawers and dialogs.
        zIndex: 60,
        width: 340,
        maxHeight: 'calc(100dvh - 112px)',
        overflowY: 'auto',
        background: PAPER,
        border: `1px solid ${BORDER}`,
        fontFamily: sans,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: SP.sm,
        padding: SP.md,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: FS.xxs,
            color: MUTED,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {words(entry.type)} · Entity Inspector
          </div>
          <h2
            id="settlement-workbench-inspector-title"
            style={{ margin: '3px 0 0', fontFamily: serif_, fontSize: FS.xl, color: swatch.inkMag }}
          >
            {label}
          </h2>
          <span
            id="settlement-workbench-inspector-purpose"
            style={{
              display: 'block',
              marginTop: 2,
              color: MUTED,
              fontSize: FS.xxs,
            }}
          >
            Inspect recorded state, provenance, connections, and available actions.
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={closeInspector} aria-label="Close Entity Inspector">
          Close
        </Button>
      </div>

      <div style={{ padding: SP.md, display: 'grid', gap: SP.lg }}>
        <section aria-labelledby="workbench-story-state">
          <h3 id="workbench-story-state" style={{ margin: '0 0 5px', fontFamily: serif_, fontSize: FS.lg }}>
            Story and state
          </h3>
          <p style={{ margin: 0, color: swatch.inkMag2, fontSize: FS.sm, lineHeight: 1.55 }}>
            {entitySummary(entry)}
          </p>
        </section>

        <section aria-labelledby="workbench-why">
          <h3 id="workbench-why" style={{ margin: '0 0 5px', fontFamily: serif_, fontSize: FS.lg }}>
            Why
          </h3>
          <p style={{
            margin: 0,
            color: why.available ? swatch.inkMag2 : MUTED,
            fontSize: FS.sm,
            lineHeight: 1.55,
            fontStyle: why.available ? 'normal' : 'italic',
          }}>
            {why.text}
          </p>
        </section>

        <section aria-labelledby="workbench-connections">
          <h3 id="workbench-connections" style={{ margin: '0 0 5px', fontFamily: serif_, fontSize: FS.lg }}>
            Connections
          </h3>
          {connections.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, color: swatch.inkMag2, fontSize: FS.sm }}>
              {connections.map(connection => (
                <li key={`${connection.id || 'plain'}:${connection.label}`}>
                  {connection.id
                    ? (
                      <EntityLink
                        id={connection.id}
                        type={connection.type}
                        fallback={words(connection.label)}
                      />
                    )
                    : words(connection.label)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, color: MUTED, fontSize: FS.sm, fontStyle: 'italic' }}>
              No stable connection is recorded for this item.
            </p>
          )}
        </section>

        <section aria-labelledby="workbench-actions">
          <h3 id="workbench-actions" style={{ margin: '0 0 7px', fontFamily: serif_, fontSize: FS.lg }}>
            Actions
          </h3>
          {interactive ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm }}>
              <Button variant="secondary" size="sm" onClick={() => navigateToEntity?.(entry.id)}>
                Show in dossier
              </Button>
              {!readOnly && !mobile && entry.type === 'npc' && (
                <Button variant="primary" size="sm" onClick={beginAuthoring}>
                  Edit NPC details
                </Button>
              )}
            </div>
          ) : (
            <p
              role="note"
              style={{ margin: 0, color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}
            >
              More than one legacy record shares this identity. It remains readable,
              but navigation and editing are disabled so SettlementForge does not guess.
            </p>
          )}
          {interactive && !readOnly && mobile && entry.type === 'npc' && (
            <p
              role="note"
              style={{ margin: `${SP.sm}px 0 0`, color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}
            >
              NPC authoring remains available from this dossier on desktop.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}

function ChangeDock() {
  const queue = useStore(state => state.pendingEditsQueue || []);
  const receipts = useStore(state => state.pendingEditReceipts || []);
  const ownerKey = useStore(state => pendingEditOwnerScope(state).ownerKey);
  const saveId = useStore(state => pendingEditOwnerScope(state).saveId);
  const revertToSnapshot = useStore(state => state.revertToSnapshot);
  const [undoState, setUndoState] = useState(null);
  const undoInFlightRef = useRef(null);
  const completedUndoKeysRef = useRef(new Set());
  const pending = activeEdits(selectPendingEditOwnerScope(queue, ownerKey));
  const ownerReceipts = selectPendingEditOwnerScope(
    receiptValues(receipts),
    ownerKey,
  );
  const recentReceipts = ownerReceipts.slice(-3).reverse();
  const batchUndo = latestBatchUndo(recentReceipts, ownerKey, saveId);
  const undoStatus = batchUndo && undoState?.key === batchUndo.key
    ? undoState.status
    : null;
  const undoAvailable = batchUndo && typeof revertToSnapshot === 'function';

  const undoLastBatch = async () => {
    if (!undoAvailable
      || undoInFlightRef.current === batchUndo.key
      || completedUndoKeysRef.current.has(batchUndo.key)) return;
    undoInFlightRef.current = batchUndo.key;
    setUndoState({ key: batchUndo.key, status: 'working' });
    try {
      const result = await revertToSnapshot({
        saveId: batchUndo.saveId,
        snapshotId: batchUndo.snapshotId,
      });
      if (!result || result.ok === false) {
        setUndoState({ key: batchUndo.key, status: 'failed' });
        return;
      }
      completedUndoKeysRef.current.add(batchUndo.key);
      setUndoState({ key: batchUndo.key, status: 'succeeded' });
    } catch {
      setUndoState({ key: batchUndo.key, status: 'failed' });
    } finally {
      undoInFlightRef.current = null;
    }
  };

  if (pending.length === 0 && recentReceipts.length === 0) return null;

  return (
    <section
      aria-labelledby="settlement-workbench-dock-title"
      style={{
        margin: `${SP.md}px auto 0`,
        maxWidth: 760,
        border: `1px solid ${BORDER}`,
        background: PAPER,
        fontFamily: sans,
      }}
    >
      <div style={{ padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
          <h2
            id="settlement-workbench-dock-title"
            style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, color: swatch.inkMag }}
          >
            Change Dock
          </h2>
          <span style={{ color: MUTED, fontSize: FS.xxs }}>
            This settlement only · each visible scope applies separately
          </span>
        </div>
      </div>

      {pending.length > 0 && <PendingChangesBar />}

      {recentReceipts.length > 0 && (
        <div style={{ padding: `${SP.sm}px ${SP.md}px ${SP.md}px` }}>
          <div style={{
            marginBottom: 5,
            color: MUTED,
            fontSize: FS.xxs,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Recent results
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: swatch.inkMag2, fontSize: FS.sm }}>
            {recentReceipts.map((receipt, index) => {
              // One intent may yield more than one retained attempt receipt.
              // Include the attempt (and final positional fallback) so retries
              // never produce duplicate React keys in the recent-results list.
              const key = `${receipt?.id || receipt?.intentId || 'receipt'}:${receipt?.attempt || 0}:${index}`;
              const status = receiptOutcomeStatus(receipt);
              const outcomeDetail = receiptOutcomeDetail(receipt);
              const explanation = receiptExplanation(receipt);
              return (
                <li key={key} style={{ marginBottom: 5 }}>
                  <div>
                    <strong>Outcome</strong>{' '}
                    {status}
                    {outcomeDetail ? `: ${outcomeDetail}` : ''}
                  </div>
                  {explanation && (
                    <div style={{ color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}>
                      <strong>Explanation</strong>{' '}
                      {words(explanation)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {undoAvailable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', marginTop: SP.sm }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={undoLastBatch}
                disabled={undoStatus === 'working' || undoStatus === 'succeeded'}
              >
                {undoButtonLabel(undoStatus)}
              </Button>
              {undoStatus === 'succeeded' && (
                <span role="status" style={{ color: swatch.success, fontSize: FS.xxs }}>
                  The last applied batch was undone. The settlement now reflects its earlier snapshot.
                </span>
              )}
              {undoStatus === 'failed' && (
                <span role="alert" style={{ color: swatch.danger, fontSize: FS.xxs }}>
                  Undo was not completed. The applied result remains on record; you can try again.
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function SettlementWorkbench({ readOnly = false }) {
  return (
    <>
      <EntityInspector readOnly={readOnly} />
      {!readOnly && <ChangeDock />}
    </>
  );
}
