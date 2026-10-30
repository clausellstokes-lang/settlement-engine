/**
 * components/surveyor/SurveyorDoor.jsx — THE ONE DOOR (C13, owner ruling 2026-07-18).
 *
 * The single AI entry point: one floating slate tab on the LEFT edge of the page (the
 * marginalia position), no text until hover/focus (the label reveals as a flag; AT always
 * hears the aria-label). It opens the EPHEMERAL TEXT-INTENT SHELL
 * (SurveyorTextIntentShell.jsx — presentation only, kept mounted while the door is so a
 * close/reopen keeps the draft); every prompt routes through the S3 intent
 * compiler's client fore-stage (domain/intent/doorRouter.js) to a DESTINATION — the S1
 * analyst or a Surveyor workshop stage — so the stage panels are destinations, never entry
 * points. The dossier Polish/Narrate lane is the owner-named carve-out and does not route
 * through here.
 *
 * ENTITLEMENT (owner ruling 2026-07-19, FINAL — supersedes the premium-as-Surveyor
 * ratification): the door and everything behind it render ONLY for (a) a live Surveyor
 * entitlement, (b) Founders, or (c) elevated roles (dev/admin, who carry perpetual
 * premium and must reach the surface to test it). A CARTOGRAPHER 'premium' subscription
 * is EXCLUDED — it gets no door, not shown and not functional. No lock-tease, no
 * placeholder; the left margin is simply empty for everyone else. AI-tier discovery
 * lives on Pricing + tierFacts surfaces, never as in-app chrome.
 * THE DISCRIMINATOR (audit 2026-07-19): the client tier field ('anon'|'free'|'premium')
 * conflates Cartographer and Surveyor as 'premium', so bare tier==='premium' is
 * INSUFFICIENT. The Surveyor bit is surfaced separately via has_surveyor_entitlement()
 * (surveyor_entitlements, migration 139) — read LAZILY by useSurveyorEntitled (kept off
 * the eager auth closure to hold the first-paint budget at zero delta) and combined
 * with the eager is_founder / role through the isSurveyorTier chokepoint
 * (surveyorGate.js), re-exported here for the C13 consumers + contract test.
 *
 * Styling: shape/elevation/hover-reveal live in index.css (.sf-door-*) — the kill-list
 * ratchet (tests/design/deepCraftKillList.test.js) freezes the inline corner-radius /
 * shadow / translucent-wash counts in src/components, so a NEW floating surface must
 * carry its chrome as CSS classes (the ratchet counts raw line matches, comments included).
 * Colors ride the theme's AI register (the slate conversion lands at the tokens chokepoint).
 * Lazy-only: rides the FloatingAffordances chunk — zero eager bytes.
 *
 * ⭐ X-22 (the owner, 2026-10-30: "a simple chat interface floating as a pop-up"). The
 * door now owns THE CONVERSATION as well as the routing: the log's messages live here
 * (component memory, ids from a local counter, never persisted), the shell renders them.
 * The first send grows the one composer into the floating log; Escape folds the log to a
 * pill and the close retires the conversation for the visit. The chat is NON-MODAL (the
 * DM reads the dossier beside it), so the modal focus trap gave way to the shell's
 * non-modal dismiss; the tab stays mounted so focus always has a home.
 */

import { useMemo, useRef, useState } from 'react';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import { useDialogDismiss } from '../primitives/useDialogFocusTrap.js';
import SurveyorTextIntentShell from './SurveyorTextIntentShell.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { useSurveyorEntitled } from './useSurveyorEntitled.js';
import { routeDoorPrompt } from '../../domain/intent/doorRouter.js';
import { deriveAnchor, anchorSettlement } from '../../domain/ai/contextAnchor.js';
import { suggestedQuestions } from '../../domain/ai/suggestedQuestions.js';
import AiAnalystPanel from '../AiAnalystPanel.jsx';
import SurveyorWorkshop from './SurveyorWorkshop.jsx';

// The ONE entitlement chokepoint lives in surveyorGate.js (a pure, import-free
// predicate, kept off the eager closure). Re-exported here so the C13 consumers
// and the door contract test keep importing it from the door module.
export { isSurveyorTier } from './surveyorGate.js';

export default function SurveyorDoor({ visible = true }) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [folded, setFolded] = useState(false);
  // THE CONVERSATION: { id, from: 'you'|'surveyor', text?, node? }, oldest first.
  const [messages, setMessages] = useState([]);
  const nextId = useRef(1);
  // The routed destination: null | { id: 'analyst', question } | { id: stageId, prompt, scope }.
  const [dest, setDest] = useState(null);
  // Remount destinations per routing so initial* props re-seed (panels stay dumb).
  const [nonce, setNonce] = useState(0);
  const surveyorEntitled = useSurveyorEntitled();
  const { anchorLabel, ctx } = useSurveyorContext();
  // X-22: the first open is one composer whose placeholder rotates through the zero-cost
  // suggested questions for the page in view (no chips, no provider call).
  const suggestions = useMemo(() => {
    if (!ctx) return [];
    const anchor = deriveAnchor({ ...ctx, tick: ctx.worldState?.tick ?? null });
    const subject = anchorSettlement(anchor, { settlement: ctx.settlement, savedSettlements: ctx.savedSettlements }) || ctx.settlement;
    return suggestedQuestions(anchor, { settlement: subject, worldState: ctx.worldState });
  }, [ctx]);
  // THE NON-MODAL LIFECYCLE (useDialogDismiss, the coach's and the feedback panel's
  // half): Escape puts the composer away or folds the log, and focus goes home to the
  // tab. Nothing traps Tab: the DM reads the dossier beside the chat.
  const dialogRef = useDialogDismiss(promptOpen && !folded, () => (
    messages.length > 0 ? setFolded(true) : setPromptOpen(false)
  ));

  if (!visible || !surveyorEntitled) return null;

  /** Append one message to the log. */
  const say = (message) => {
    const id = nextId.current;
    nextId.current += 1;
    setMessages((prev) => [...prev, { id, ...message }]);
  };

  const openDestination = (routed, promptText) => {
    // 'analyst' is the QUESTION destination (it carries a question, not a prompt+scope);
    // every other destination is a workshop stage.
    setDest(routed.destination === 'analyst'
      ? { id: 'analyst', question: promptText }
      : { id: routed.destination, prompt: promptText, scope: routed.scope });
    setNonce((n) => n + 1);
    // A workshop stage docks at the same margin: the log folds to its pill beside it.
    if (routed.destination !== 'analyst') setFolded(true);
  };

  // The door still owns routing: the shell hands up the typed text and is told whether
  // the turn left the composer (true clears the draft). It never sees the router itself.
  const send = (raw) => {
    const q = String(raw ?? '').trim();
    if (!q) return false;
    say({ from: 'you', text: q });
    openDestination(routeDoorPrompt(q), q);
    return true;
  };

  // The close retires the conversation for the visit: the log and the fold go with it.
  const retire = () => {
    setPromptOpen(false);
    setFolded(false);
    setMessages([]);
  };
  const composing = promptOpen && !folded && messages.length === 0;

  return (
    <>
      {/* The marker: no text until hover/focus (the label is a reveal flag; AT reads the
          aria-label regardless). ALWAYS mounted, so the non-modal dismiss can hand focus
          back here; tucked under the composer while that is open (sf-door-tab--open).
          With a log open it brings the log back (unfolds it). */}
      <Button
        variant="ai"
        size="sm"
        className={`sf-door-tab${composing ? ' sf-door-tab--open' : ''}`}
        onClick={() => { setPromptOpen(true); setFolded(false); }}
        aria-label={t('surveyorDoor.label')}
        aria-expanded={promptOpen && !folded}
      >
        <span className="sf-door-label" aria-hidden="true">{t('surveyorDoor.label')}</span>
      </Button>

      {/* The shell stays MOUNTED while the door is, so a close/reopen keeps the draft;
          it renders nothing while `open` is false. */}
      <SurveyorTextIntentShell
        open={promptOpen} dialogRef={dialogRef} anchorLabel={anchorLabel} messages={messages} folded={folded}
        onFold={setFolded} onClose={retire}
        onSend={send} suggestions={suggestions}
      />

      {dest?.id === 'analyst' && (
        <AiAnalystPanel key={nonce} open initialQuestion={dest.question} onClose={() => setDest(null)} />
      )}
      {dest && dest.id !== 'analyst' && (
        <SurveyorWorkshop
          key={nonce}
          open
          initialStage={dest.id}
          initialPrompt={dest.prompt}
          initialScope={dest.scope}
          onClose={() => setDest(null)}
        />
      )}
    </>
  );
}
