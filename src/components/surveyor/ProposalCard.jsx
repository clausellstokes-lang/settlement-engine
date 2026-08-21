/**
 * components/surveyor/ProposalCard.jsx — ONE PROPOSED TYPED OP's review row (SC-1B).
 *
 * Extracted verbatim in behavior from InterpretApplyPanel's nested OpCard so the S3→S4
 * review row has ONE home instead of being sealed inside the accept→mint panel. Nothing
 * about the review changed: the same authored label + raw opType, the same params table,
 * the same classification badge, the same PROTECTED-CONSENT BARRIER with its identity
 * note and its consent sentence.
 *
 * IT IS A CONTROLLED PRESENTATION AND NOTHING ELSE. It owns no state, holds no decision
 * map, and never compiles, validates, applies, tracks, charges, persists, or calls a
 * provider — the decision map stays behind InterpretApplyPanel's `decide`, and canon
 * still reaches the world only through `applyAccepted` and the application-command
 * boundary. The card emits the NEXT decision; the caller closes over the index, so
 * `onDecide` takes one argument and this module never learns where the op sits in a list.
 *
 * `labels` overrides only ACCESSIBLE COPY. "dismiss" is the copy word for the existing
 * internal action `'reject'` — the domain enum, the review reducer, and the analytics
 * vocabulary are untouched.
 */

import { operationLabel } from '../../store/operationRegistry.js';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, RED, SLATE, sans, SP, FS } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
import Badge from '../primitives/Badge.jsx';
import { identityConsentNote } from '../../domain/intent/opVocabulary.js';

const OP_LABEL_TONE = { required: 'gold', inferred: 'info', optional: 'muted', uncertain: 'warning' };

/** The three decisions a DM can record. Anything else normalizes to `pending`. */
const ACTIONS = Object.freeze(['approve', 'edit', 'reject']);

/** Accessible copy for the action trio. Overridable per call site; never renames the enum. */
const DEFAULT_LABELS = Object.freeze({
  approve: 'Approve this op',
  edit: 'Edit this op',
  dismiss: 'Reject this op',
});

const CONSENT_SENTENCE = 'This op touches a protected constraint. Tick to consent, or it will not apply.';

export default function ProposalCard({ id, op, labels = {}, protectedFlags, decision, onDecide }) {
  const requested = decision?.action;
  const action = ACTIONS.includes(requested) ? requested : 'pending';
  const flags = Array.isArray(protectedFlags)
    ? protectedFlags
    : (Array.isArray(op?.protectedFlags) ? op.protectedFlags : []);
  const isProtected = flags.length > 0;
  const params = (op?.params && typeof op.params === 'object') ? op.params : {};
  const editedType = decision?.editedType ?? op?.opType;
  const copy = { ...DEFAULT_LABELS, ...labels };
  // Each event shallow-copies the CONTROLLED decision and changes only its own field —
  // consent never approves, and approve never silently consents.
  const emit = (patch) => onDecide?.({ ...decision, ...patch });

  // Wave R-1 (named-fate consent): a verb that DELETES a named character says so before
  // the tick — consent to a party-caused kill is informed consent to the roster deletion
  // its world-pulse linkage triggers. Generic copy is unchanged for every other protected op.
  const consentNote = identityConsentNote(op);

  return (
    <div
      data-testid={id}
      // The NORMALIZED action, surfaced so the normalization is observable: an
      // unrecognized action renders identically to `pending` in every other respect,
      // which would make the rule true but unprovable (and free to rot).
      data-action={action}
      style={{
        border: `1px solid ${action === 'reject' ? BORDER : action === 'approve' ? GOLD : SLATE}`, padding: SP.sm,
        background: action === 'reject' ? CARD_ALT : '#fff', opacity: action === 'reject' ? 0.6 : 1,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        {/* The authored, human label for the proposed verb (falls back to the raw
            opType for an unregistered/edited verb); the opType stays as a small
            monospace reference since it is the verb actually dispatched. */}
        <span style={{ fontSize: FS.sm, color: INK, fontFamily: sans, fontWeight: 700 }}>{operationLabel(op?.opType)}</span>
        <code style={{ fontSize: FS.xxs, color: MUTED, fontFamily: 'monospace' }}>{op?.opType}</code>
        {op?.label && <Badge tone={OP_LABEL_TONE[op.label] || 'muted'} size="sm">{op.label}</Badge>}
        {isProtected && <Badge tone="danger" size="sm">protected</Badge>}
        <span style={{ flex: 1 }} />
        <IconButton glyph="✓" label={copy.approve} size="sm" tone={action === 'approve' ? 'active' : 'default'}
          pressed={action === 'approve'} onClick={() => emit({ action: 'approve' })} />
        <IconButton glyph="✎" label={copy.edit} size="sm" tone={action === 'edit' ? 'active' : 'default'}
          pressed={action === 'edit'} onClick={() => emit({ action: 'edit' })} />
        <IconButton glyph="×" label={copy.dismiss} size="sm" tone={action === 'reject' ? 'active' : 'default'}
          pressed={action === 'reject'} onClick={() => emit({ action: 'reject' })} />
      </div>

      {action === 'edit' && (
        <input
          aria-label="Edit op type"
          value={editedType}
          onChange={(e) => emit({ action: 'edit', editedType: e.target.value })}
          style={{ fontSize: FS.xs, fontFamily: sans, color: INK, border: `1px solid ${BORDER}`, padding: `2px ${SP.xs}px` }}
        />
      )}

      {Object.keys(params).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(params).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: SP.xs }}>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, minWidth: 78 }}>{k}</span>
              <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {isProtected && (
        <label htmlFor={`${id}-consent`} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, fontSize: FS.xs, color: RED, fontFamily: sans }}>
          <input
            id={`${id}-consent`}
            type="checkbox"
            checked={decision?.consented === true}
            onChange={(e) => emit({ consented: e.target.checked })}
            aria-label={`Consent to the protected op ${operationLabel(op?.opType)}`}
          />
          {consentNote ? `${consentNote} ${CONSENT_SENTENCE}` : CONSENT_SENTENCE}
        </label>
      )}
    </div>
  );
}
