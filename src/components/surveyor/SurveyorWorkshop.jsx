/**
 * components/surveyor/SurveyorWorkshop.jsx — THE SURVEYOR SHELL for the WRITE stages
 * (DESIGN_AI_CONTROL_SURFACE §2c), now a DESTINATION of THE ONE DOOR (C13): SurveyorDoor
 * owns open state and routes prompts here with a pre-selected stage; the former floating
 * compass launcher is retired per the owner's ONE DOOR ruling. A docked panel (never a
 * modal — the world stays visible) hosts the write surfaces behind a stage switch: custom
 * content (S4) · construction (S5/S6) · accept→mint (S3) · autonomy (S7) · corpus (V-5).
 * ⚰ THE 'style' STAGE (AI style overhaul) WAS RETIRED HERE — ODQ §763.2, Q-STYLE arm 2.
 * The ONE DOOR's matching destination + cue row went in the SAME act (see the intent
 * fore-stage under src/domain/intent/, and its pins), because this shell falls back to
 * STAGES[0] for an unknown stage id: leaving the route behind would have mis-routed every
 * map-style prompt to the Content panel silently, without ever reddening.
 * ⚠ This shell may not NAME the router module — a prevention guard in
 * tests/components/surveyorProposalCard.test.jsx keeps the router reachable from exactly
 * one component, and it matches the bare module token in comments too.
 * Each stage body is React.lazy, so its code + its heavy domain graph load only when its
 * stage is opened; the whole workshop rides the existing FloatingAffordances lazy chunk
 * (App.jsx mounts that once) so first paint pays zero. Every stage carries the §2b
 * early-access register and the visible §3c context anchor.
 *
 * JUDGMENT (vetoable): destinations dock along the LEFT edge (the door's margin) so the
 * one-door spatial story holds — the routed prompt seeds the stage's own prompt field
 * (initialPrompt/initialScope are initialization-only; absent ⇒ identical behavior).
 *
 * ⭐ X-22 (the owner, 2026-10-30): WORKSHOP PROPOSALS ARRIVE AS MESSAGES. A session recap
 * the door routes to the accept→mint stage no longer opens this panel: the door asks
 * useWorkshopProposal() below to compile it, shows the proposed ops in its one log, and on
 * the DM's typed yes hands the approved ops to the DECREE REGISTRY through the existing
 * bridge (lib/intent/interpretApply.js stageSurveyorDecrees, injected with the registry's
 * one store write site, editSlice DECREE_ACTIONS.stage), BEHIND THE SAME GATE edit mode
 * reads (EM-D1: the store's canEditSettlement(); the chair's ruling, 2026-10-30: "confirmed
 * with the gate kept"). The chat is a CALLER of that gate, never a bypass: where the account's
 * tier does not admit edit mode, nothing is written and the proposal is noted until it does,
 * and a store without the gate reads as not admitted. The chat only hands off: every
 * staged entry is PENDING, and edit mode's registry page owns approval, order and
 * withdrawal. The protected-consent barrier is untouched: a typed yes approves without
 * consent, so reviewInterpretation holds every flagged op back, and the log says which.
 * The other stages keep this panel as their destination; the hook reads the same
 * transport, vocabulary and review modules the Apply stage reads, and mints nothing.
 */

import { Suspense, useCallback, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile.js';
import { INK, MUTED, BORDER, CARD, BODY, sans, SP, FS, FOOTER_INSET, BOTTOM_NAV_H, aboveFooter, aboveBottomNav } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
import { operationLabel } from '../../store/operationRegistry.js';
import { chromeFontSize } from '../../design/proseScale.js';
import Segmented from '../primitives/Segmented.jsx';
import { AnchorChip, EarlyAccessBadge } from './surveyorPanelKit.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { useStore } from '../../store/index.js';
import {
  createRetryableCampaignLazy,
  createRetryableLazy,
} from '../../store/campaignRuntimeView.js';
import FeatureErrorBoundary from '../FeatureErrorBoundary.jsx';

const stageLoading = (
  <p style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
    Loading…
  </p>
);
const campaignLazy = importer => createRetryableCampaignLazy(useStore, importer, {
  fallback: stageLoading,
});
// Drop-in lazy for the ordinary stages. Keeping the local `lazy` spelling also
// preserves the caller census's ordinary-vs-campaign root classification.
const lazy = importer => createRetryableLazy(importer, {
  fallback: stageLoading,
});

const CustomContentPanel = lazy(() => import('./CustomContentPanel.jsx'));
const ConstructionPanel = lazy(() => import('./ConstructionPanel.jsx'));
const InterpretApplyPanel = campaignLazy(() => import('./InterpretApplyPanel.jsx'));
const AutonomyPanel = campaignLazy(() => import('./AutonomyPanel.jsx'));
const CorpusFactoryPanel = lazy(() => import('./CorpusFactoryPanel.jsx'));

let reviewSequence = 0;

/** One compile, one review artifact: stable for the yes that accepts it, unique from a
 *  later compile of identical text (the Apply stage's own rule). */
function mintReviewRef() {
  const randomId = globalThis.crypto?.randomUUID?.();
  if (randomId) return `review:${randomId}`;
  reviewSequence += 1;
  return `review:${Date.now().toString(36)}:${reviewSequence.toString(36)}`;
}

/**
 * THE PROPOSAL HAND-OFF (X-22(d)). `compile(text)` turns a session recap into proposed
 * ops through the one compile lane; `accept(proposal)` stages the approvable ones as
 * pending decrees on the open save. Neither renders anything; the door's log does.
 * @returns {{
 *   compile: (text: string) => Promise<{ interpretation: { ops: object[] }, reviewRef: string } | { error: string }>,
 *   accept: (proposal: { interpretation: { ops: object[] }, reviewRef: string }) =>
 *     Promise<{ staged: readonly object[], blocked: object[], refused?: 'not_admitted'|'no_save' }>,
 * }}
 */
export function useWorkshopProposal() {
  const { ctx } = useSurveyorContext();
  const phase = useStore((s) => s.phase);

  const compile = useCallback(async (text) => {
    try {
      const [{ compileInterpretation }, { buildProtectedContext, applyIdentityConsentFlags }] = await Promise.all([
        import('../../lib/surveyorWrite.js'),
        import('../../domain/intent/opVocabulary.js'),
      ]);
      // The protected context rides the compile so the edge can flag named fates
      // (Wave R-1), and the identity flag is unioned locally, exactly as the Apply stage does.
      const res = await compileInterpretation({
        ...ctx, sessionText: text, protectedContext: buildProtectedContext(ctx?.settlement, phase),
      });
      if (!res?.ok) return { error: res?.error || 'The Surveyor could not read that recap.' };
      return {
        interpretation: applyIdentityConsentFlags(res.interpretation, { identityLockedPhase: phase === 'canon' }),
        reviewRef: mintReviewRef(),
      };
    } catch {
      return { error: 'The Surveyor is unavailable right now.' };
    }
  }, [ctx, phase]);

  const accept = useCallback(async (proposal) => {
    const interpretation = proposal?.interpretation;
    const ops = Array.isArray(interpretation?.ops) ? interpretation.ops : [];
    const [{ reviewInterpretation }, { stageSurveyorDecrees }, { DECREE_ACTIONS, selectDecrees }] = await Promise.all([
      import('../../domain/intent/interpretReview.js'),
      import('../../lib/intent/interpretApply.js'),
      import('../../store/editSlice.js'),
    ]);
    // A typed yes approves every op WITHOUT consent: the barrier holds the flagged ones.
    const decisions = Object.fromEntries(ops.map((_, i) => [i, { action: 'approve' }]));
    const { accepted, blocked } = reviewInterpretation(interpretation, decisions);
    const get = useStore.getState;
    const set = useStore.setState;
    // EM-D1'S TIER GATE, the one edit mode reads, asked before anything is written. Fail
    // closed: a store without the gate is not an admitted one.
    const state = get();
    const admitted = typeof state.canEditSettlement === 'function' ? state.canEditSettlement() === true : false;
    if (!admitted) return { staged: Object.freeze([]), blocked, refused: 'not_admitted' };
    const saveId = state.activeSaveId;
    if (saveId == null || accepted.length === 0) {
      return { staged: Object.freeze([]), blocked, ...(saveId == null && accepted.length > 0 ? { refused: 'no_save' } : {}) };
    }
    const { staged } = stageSurveyorDecrees({
      accepted, blocked, ops,
      registry: selectDecrees(get()),
      reviewRef: proposal.reviewRef,
      orderedAt: new Date().toISOString(),
      stageDecree: (rows, op, meta) => {
        const done = DECREE_ACTIONS.stage(get, set, { saveId, op, meta });
        return done.ok ? done.decrees : rows;
      },
    });
    return { staged, blocked };
  }, []);

  return { compile, accept };
}

/**
 * One proposal in the door's log: the proposed ops by their authored labels, a protected
 * op marked as such, and the one line that says how to accept. No control (X-22(d)).
 * @param {{ ops: object[], costLine?: string|null }} props
 */
export function ProposalMessage({ ops, costLine = null }) {
  const mobile = useIsMobile();
  const xs = chromeFontSize(FS.xs, mobile);
  const list = Array.isArray(ops) ? ops : [];
  return (
    <div data-testid="surveyor-proposal" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontFamily: sans }}>
      <span className="sf-smallcap" style={{ fontSize: xs, color: MUTED }}>Proposed changes</span>
      <ul style={{ margin: 0, paddingLeft: SP.lg, fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}>
        {list.map((op, i) => (
          <li key={i} data-op-type={op?.opType}>
            {operationLabel(op?.opType)}
            {Array.isArray(op?.protectedFlags) && op.protectedFlags.length > 0 && (
              <span style={{ color: MUTED }}> (protected)</span>
            )}
          </li>
        ))}
      </ul>
      <span style={{ fontSize: FS.sm, color: INK }}>Say yes to add {list.length === 1 ? 'it' : 'them'} to the decree registry.</span>
      {costLine && <span data-testid="surveyor-cost" style={{ fontSize: xs, color: MUTED }}>{costLine}</span>}
    </div>
  );
}

/**
 * The log's word on a typed yes. Pure.
 * @param {{ staged?: readonly object[], blocked?: Array<{ index: number }>, refused?: string }} out
 * @param {object[]} ops the proposal's ops, for the held-back names
 * @returns {string}
 */
export function acceptNote(out, ops) {
  if (out?.refused === 'not_admitted') {
    return 'Noted. This proposal becomes addable when edit mode opens for your account.';
  }
  if (out?.refused === 'no_save') {
    return 'The decree registry lives on a saved settlement. Save this one, then say yes again.';
  }
  const staged = Array.isArray(out?.staged) ? out.staged.length : 0;
  const held = (Array.isArray(out?.blocked) ? out.blocked : [])
    .map((row) => operationLabel(ops?.[row.index]?.opType))
    .filter(Boolean);
  const parts = [];
  if (staged > 0) {
    parts.push(`Added ${staged} to the decree registry. ${staged === 1 ? 'It waits' : 'They wait'} for your approval in edit mode.`);
  }
  if (held.length > 0) {
    parts.push(`Held back as protected: ${held.join(', ')}. Make ${held.length === 1 ? 'that change' : 'those changes'} yourself in edit mode.`);
  }
  return parts.length > 0 ? parts.join(' ') : 'Nothing was added.';
}

const STAGES = [
  { id: 'content', label: 'Content', Body: CustomContentPanel },
  { id: 'construct', label: 'Build', Body: ConstructionPanel },
  { id: 'apply', label: 'Apply', Body: InterpretApplyPanel },
  { id: 'autonomy', label: 'Run', Body: AutonomyPanel }, // S7 (additive registration)
  { id: 'corpus', label: 'Corpus', Body: CorpusFactoryPanel }, // V-5 (additive registration)
];

export default function SurveyorWorkshop({ open = false, onClose, initialStage = 'content', initialPrompt = '', initialScope }) {
  const [stage, setStage] = useState(initialStage);
  const { anchorLabel } = useSurveyorContext();
  const isMobile = useIsMobile();

  if (!open) return null;

  // Docked above the pinned desktop footer (owner order 2026-09-16), and from 640 to
  // 1023 px above the bottom bar (phones unchanged); the maxHeight below subtracts the
  // same lifts so the panel's top stays where it was.
  const dockPos = {
    position: 'fixed', left: SP.lg, bottom: aboveFooter(isMobile ? 136 : aboveBottomNav(76)), zIndex: 60, fontFamily: sans,
  };

  const active = STAGES.find((s) => s.id === stage) || STAGES[0];
  const Body = active.Body;
  // The routed prompt seeds ONLY the routed stage; switching stages starts clean.
  const seeded = active.id === initialStage;

  return (
    <div
      role="region"
      aria-label="The Surveyor's workshop"
      style={{
        ...dockPos,
        width: 360, maxWidth: 'calc(100vw - 32px)', maxHeight: `calc(100vh - 160px - ${FOOTER_INSET}${isMobile ? '' : ` - ${BOTTOM_NAV_H}`})`,
        background: CARD, color: BODY, border: `1px solid ${BORDER}`,
        padding: SP.lg, boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
        display: 'flex', flexDirection: 'column', gap: SP.sm, overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SP.sm }}>
        <span style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: INK }}>Surveyor's workshop</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
          <EarlyAccessBadge />
          <IconButton glyph="×" label="Close the workshop" size="sm" onClick={onClose} />
        </div>
      </div>

      <AnchorChip label={anchorLabel} />

      <Segmented options={STAGES.map((s) => ({ id: s.id, label: s.label }))} value={stage} onChange={setStage} size="sm" ariaLabel="Surveyor write stage" />

      <FeatureErrorBoundary
        label="SurveyorWorkshop.stage"
        kind="react.render.surveyor-stage"
        resetKeys={[stage]}
      >
        <Suspense fallback={stageLoading}>
          <Body initialPrompt={seeded ? initialPrompt : ''} initialScope={seeded ? initialScope : undefined} />
        </Suspense>
      </FeatureErrorBoundary>
    </div>
  );
}
