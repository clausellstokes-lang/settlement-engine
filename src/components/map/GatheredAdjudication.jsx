/**
 * GatheredAdjudication.jsx — THE GATHERED ADJUDICATION SCREEN (realm directive 7,
 * binding design ruling J-D7).
 *
 * "When auto-resolve is OFF: ONE gathered adjudication screen replaces the
 * advance-time popup (never a sequential modal chain)."
 *
 * ── ONE SURFACE, NEVER A CHAIN ──────────────────────────────────────────────
 * A saturated tick can raise several campaign-altering matters at once. The
 * failure this screen exists to prevent is the modal conga line: rule, dismiss,
 * another modal, rule again, with no way to see the shape of the whole tick or to
 * go back. So EVERY unresolved matter renders as a row in ONE list here, ruling
 * one row NEVER closes the screen, and the screen has exactly one exit (the DM's
 * own dismissal). The list is the surface; there is no second step.
 *
 * ── ONE VOCABULARY ──────────────────────────────────────────────────────────
 * Accept and set-aside route through the EXISTING proposal verbs
 * (applyWorldPulseProposal / dismissWorldPulseProposal) — the same two store
 * actions the Herald's decisions desk has always called, with the same receipts,
 * the same refusal dispositions, and the same undo. No store action is introduced
 * and no second adjudication path exists; this is a new WINDOW onto the one desk.
 *
 * ── NOTHING IS SILENTLY DROPPED ─────────────────────────────────────────────
 * Closing the screen writes NOTHING. The unruled rows are still `status:'pending'`
 * on campaign.worldState.proposals, which is durable (localStorage + the cloud
 * snapshot) and rehydrates verbatim — so a dismissed matter survives a reload and
 * re-surfaces at the next advance, oldest first. The screen says so out loud on
 * the way out (heldDocketPromise) rather than leaving the DM to infer it. That is
 * the coup-guarantee law extended to the UI: the one-shot verdict that cannot be
 * re-derived (proposalAdmission.ONE_SHOT_VERDICT_RULE_IDS) is exactly the row a
 * silent drop would destroy.
 *
 * ── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * A real dialog: role/aria-modal, labelled by its heading, and focus managed by
 * the shared primitive (useDialogFocusTrap) — focus in on open, Tab cycles inside,
 * Escape closes, focus returns to the trigger. Every verdict is a real Button, so
 * the whole docket is rulable from the keyboard without touching a pointer.
 *
 * LAZY LEAF: mounted through lazy() by WorldMapOverlays, so a session that never
 * withholds a decision never pays for this screen. @enforced-by
 * tests/build/gatheredAdjudicationLazy.test.js
 */

import { useMemo, useState } from 'react';
import { CheckCircle2, Gavel, XCircle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { ClerkNote } from '../generate/ClerkNote.jsx';
import { OutcomeCard, SmallButton } from './WorldPulsePrimitives.jsx';
import {
  collectSettlementIds,
  involvedEntities,
  nameMapFromSaves,
  outcomeSubjectDescriptor,
  proposalDetails,
} from './WorldPulseData.js';
import { gatheredDecisionRows, heldDocketPromise, judgmentPointerSentence } from './gatheredDocket.js';

const TITLE_ID = 'gathered-adjudication-title';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {any} props.campaign
 * @param {number|null} [props.sinceTick] the world clock BEFORE the reported advance
 * @param {() => void} props.onClose
 */
export default function GatheredAdjudication({ open, campaign, sinceTick = null, onClose }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);

  const [busyId, setBusyId] = useState(/** @type {string|null} */ (null));
  const [actionError, setActionError] = useState(/** @type {string|null} */ (null));

  const dialogRef = useDialogFocusTrap(open, onClose);
  const rows = gatheredDecisionRows(campaign, { sinceTick });
  const boundaryKnown = Number.isFinite(Number(sinceTick));

  if (!open || !campaign) return null;

  const runVerdict = async (proposalId, verdict) => {
    if (busyId) return;
    setBusyId(`${verdict}:${proposalId}`);
    setActionError(null);
    try {
      const fn = verdict === 'accept' ? applyProposal : dismissProposal;
      const updated = await fn(campaign.id, proposalId);
      // A null return is the writer reporting a stale no-op (the row moved under
      // us). Say so; never manufacture a receipt the record does not carry.
      if (!updated) setActionError(t('errors.proposalUpdateFail'));
    } catch {
      setActionError(t('errors.proposalUpdateFail'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      role="presentation"
      // The room dims warm behind the plate (organic motion #10). The COLOUR comes
      // from the class itself (.oc-m-warmdim mixes 58% of --oc-ink-deepest), so no
      // off-palette rgba wash is minted here — the ink ramp owns the tone.
      className="oc-m-warmdim"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: SP.lg,
      }}
      onMouseDown={event => { if (event.target === event.currentTarget) onClose?.(); }}
    >
      <section
        ref={dialogRef}
        data-testid="gathered-adjudication"
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        style={{
          width: 'min(100%, 720px)', maxHeight: 'min(90vh, 760px)',
          display: 'flex', flexDirection: 'column',
          border: `1px solid ${BORDER}`, background: CARD,
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'flex-start', gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          <Gavel size={16} color={GOLD} style={{ marginTop: 3, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id={TITLE_ID} style={{
              margin: 0, color: INK, fontFamily: sans,
              fontSize: FS.lg, lineHeight: 1.25, fontWeight: 900,
            }}>
              The realm awaits your judgment
            </h2>
            <p style={{ margin: `${SP.xs}px 0 0`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45 }}>
              {judgmentPointerSentence(rows.length)} Rule on them here, in any order.
              What you leave unruled stays on the docket.
            </p>
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: SP.lg, display: 'grid', gap: SP.sm }}>
          {actionError && <ClerkNote rubric="The realm balked" role="alert">{actionError}</ClerkNote>}
          {rows.length === 0 ? (
            <div style={{
              border: `1px dashed ${BORDER2}`, background: CARD_ALT, padding: SP.md,
              color: BODY, fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
            }}>
              Every matter is settled. The realm runs on its own for now.
            </div>
          ) : rows.map(({ id, proposal, held, raisedLabel }) => (
            <div key={id} data-testid="gathered-decision-row" data-held={held ? 'true' : 'false'}>
              {/* The standing line. It claims held-vs-fresh ONLY when the caller
                  supplied the advance's starting clock; with no boundary known
                  (the Herald pointer, a fresh mount) the row states the in-world
                  date it was raised and claims nothing it cannot know. */}
              {(boundaryKnown || raisedLabel) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
                  color: held ? SECOND : MUTED, fontFamily: sans,
                  fontSize: FS.micro, fontWeight: 850,
                }}>
                  {boundaryKnown && (held ? 'Still waiting from an earlier advance' : 'Raised this advance')}
                  {raisedLabel && <span style={{ color: MUTED, fontWeight: 700 }}>{boundaryKnown ? '· ' : ''}Raised in {raisedLabel}</span>}
                </div>
              )}
              <OutcomeCard
                heading={proposal.headline}
                summary={proposal.summary}
                severity={proposal.severity}
                reasons={proposal.reasons}
                details={proposalDetails(proposal.outcome)}
                involved={involvedEntities(proposal, nameById)}
                subject={outcomeSubjectDescriptor(proposal)}
                affectedIds={collectSettlementIds(proposal)}
                tone="major"
                actions={(
                  <>
                    <SmallButton
                      tone="good"
                      hint="Let this stand"
                      disabled={!!busyId}
                      onClick={() => runVerdict(id, 'accept')}
                    >
                      <CheckCircle2 size={13} /> {busyId === `accept:${id}` ? 'Ruling' : 'Let it stand'}
                    </SmallButton>
                    <SmallButton
                      tone="danger"
                      hint="Refuse this"
                      disabled={!!busyId}
                      onClick={() => runVerdict(id, 'veto')}
                    >
                      <XCircle size={13} /> {busyId === `veto:${id}` ? 'Refusing' : 'Refuse it'}
                    </SmallButton>
                  </>
                )}
              />
            </div>
          ))}
        </div>

        <footer style={{
          display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
          padding: `${SP.md}px ${SP.lg}px`, borderTop: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          <span
            data-testid="gathered-held-promise"
            style={{ flex: 1, minWidth: 0, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}
          >
            {heldDocketPromise(rows.length)}
          </span>
          <Button variant="secondary" onClick={onClose}>
            {rows.length === 0 ? 'Close' : 'Set the rest aside'}
          </Button>
        </footer>
      </section>
    </div>
  );
}
