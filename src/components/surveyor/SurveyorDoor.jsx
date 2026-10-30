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
 *
 * ⭐ X-22(d) THE ROUTING GOES INVISIBLE, NOT AWAY. Every prompt still goes through the one
 * router below; what changed is where the destination answers. An analyst question is
 * answered IN THE LOG (AiAnalystPanel.jsx useAnalyst + AnalystReply); a session recap
 * routed to the accept→mint stage is compiled into proposed ops and shown IN THE LOG
 * (SurveyorWorkshop.jsx useWorkshopProposal + ProposalMessage), and the DM's typed yes
 * (doorRouter isAcceptReply, asked only of the reply that follows a proposal) hands the
 * approvable ops to the decree registry, where edit mode owns approval. The remaining
 * write stages (content, construct, autonomy) keep the workshop panel as their
 * destination, opened BY PHRASE from the chat (the chair's ruling, 2026-10-30: accepted as
 * panels for now; a later wave folds them into messages); the log says the workshop is
 * opening and folds beside it. The Interview is opened the same way by its own phrase
 * ("interview", "ask the world"), its panel file untouched. The cost is one muted line under the
 * conversation's first reply, never a control.
 */

import { useRef, useState } from 'react';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import { useDialogDismiss } from '../primitives/useDialogFocusTrap.js';
import SurveyorTextIntentShell from './SurveyorTextIntentShell.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { useSurveyorEntitled } from './useSurveyorEntitled.js';
import { routeDoorPrompt, isAcceptReply } from '../../domain/intent/doorRouter.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import AnalystReply, { useAnalyst, costLineFor } from '../AiAnalystPanel.jsx';
import InterviewPanel from '../InterviewPanel.jsx';
import SurveyorWorkshop, { useWorkshopProposal, ProposalMessage, acceptNote } from './SurveyorWorkshop.jsx';

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
  // The panel destination: null | { id: 'interview', question } | { id: stageId, prompt, scope }.
  const [dest, setDest] = useState(null);
  const [busy, setBusy] = useState(false);
  // The proposal the next reply may accept with a typed yes (null: none pending).
  const pendingRef = useRef(null);
  // The cost line rides the conversation's first reply only.
  const costShownRef = useRef(false);
  // Bumped by the close, so a reply that lands after the conversation was retired is dropped.
  const epochRef = useRef(0);
  // Remount destinations per routing so initial* props re-seed (panels stay dumb).
  const [nonce, setNonce] = useState(0);
  const surveyorEntitled = useSurveyorEntitled();
  const { anchorLabel } = useSurveyorContext();
  // The analyst's reads (the rotating placeholder's suggested questions, the ask) and the
  // workshop's proposal hand-off. Neither routes; both answer the router's verdict.
  const analyst = useAnalyst();
  const proposals = useWorkshopProposal();
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

  /** The first reply of the conversation carries the one muted cost line. */
  const firstCost = (cost, unit) => {
    if (costShownRef.current) return null;
    costShownRef.current = true;
    return costLineFor(cost, analyst.creditBalance, unit);
  };

  /** Run one async turn; its reply is dropped if the conversation was retired meanwhile. */
  const turn = async (work) => {
    const epoch = epochRef.current;
    setBusy(true);
    try {
      const reply = await work();
      if (reply && epoch === epochRef.current) say(reply);
    } finally {
      if (epoch === epochRef.current) setBusy(false);
    }
  };

  const answer = (q) => turn(async () => {
    const result = await analyst.ask(q);
    const costLine = result?.error ? null : firstCost(analyst.cost, 'answer');
    return { from: 'surveyor', node: <AnalystReply result={result} costLine={costLine} /> };
  });

  const propose = (q) => turn(async () => {
    const res = await proposals.compile(q);
    if (res.error) return { from: 'surveyor', text: res.error };
    const ops = res.interpretation?.ops || [];
    if (ops.length === 0) return { from: 'surveyor', text: 'Nothing in that recap is a change the engine records.' };
    pendingRef.current = res;
    const costLine = firstCost(getSurveyorAiCost('interpret'), 'recap');
    return { from: 'surveyor', node: <ProposalMessage ops={ops} costLine={costLine} /> };
  });

  const accept = (proposal) => turn(async () => {
    const out = await proposals.accept(proposal);
    // No open save: the registry has nowhere to live yet, so the proposal stays open.
    if (out.refused === 'no_save') pendingRef.current = proposal;
    return { from: 'surveyor', text: acceptNote(out, proposal.interpretation?.ops || []) };
  });

  const openPanel = (routed, q) => {
    const interview = routed.destination === 'interview';
    setDest(interview ? { id: 'interview', question: q } : { id: routed.destination, prompt: q, scope: routed.scope });
    setNonce((n) => n + 1);
    // The panel docks at the same margin: the log folds to its pill beside it.
    setFolded(true);
    say({ from: 'surveyor', text: interview ? 'Opening the Interview.' : 'Opening the workshop.' });
  };

  // The door still owns routing: the shell hands up the typed text and is told whether
  // the turn left the composer (true clears the draft). It never sees the router itself.
  // One turn at a time: while a reply is on its way the box keeps the next draft.
  const send = (raw) => {
    const q = String(raw ?? '').trim();
    if (!q || busy) return false;
    say({ from: 'you', text: q });
    const pending = pendingRef.current;
    pendingRef.current = null; // a proposal is answered by the very next reply, or it lapses
    if (pending && isAcceptReply(q)) {
      accept(pending);
      return true;
    }
    const routed = routeDoorPrompt(q);
    if (routed.destination === 'analyst') answer(q);
    else if (routed.destination === 'apply') propose(q);
    else openPanel(routed, q);
    return true;
  };

  // The close retires the conversation for the visit: the log, the fold, a pending
  // proposal and any reply still on its way go with it.
  const retire = () => {
    epochRef.current += 1;
    pendingRef.current = null;
    costShownRef.current = false;
    setBusy(false);
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
        open={promptOpen} dialogRef={dialogRef} anchorLabel={anchorLabel} messages={messages} folded={folded} busy={busy}
        onFold={setFolded} onClose={retire}
        onSend={send} suggestions={analyst.suggestions}
      />

      {dest?.id === 'interview' && (
        <InterviewPanel key={nonce} open initialQuestion={dest.question} onClose={() => setDest(null)} />
      )}
      {dest && dest.id !== 'interview' && (
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
