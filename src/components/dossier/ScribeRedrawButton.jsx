/**
 * components/dossier/ScribeRedrawButton.jsx — THE ONE AI BUTTON THE DOSSIER KEEPS (design §5c
 * rule 1; the owner, 2026-09-14 ~06:5x: "there should be an option to redo the AI narrative, to
 * redraw based on the current settlement's facts").
 *
 * ⛔ IT IS DARK BY DEFAULT AND SELF-GATING. Four conditions, and every one of them is checked
 * HERE as well as by the caller, because a button that bills is not a thing to gate in one place:
 *   1. `FLAGS.scribe` is lit. With the flag off this component renders null, and the band that
 *      composes it never even asks for its chunk (`OutputContainer` gates the lazy element too).
 *   2. There is a durable home (`saveId`). A redraw is billed, and nothing billed is spent on a
 *      settlement that cannot keep what it paid for (rule 14's condition, the chair's addition).
 *   3. The reader is the DM on their own editable dossier — never a player view, never the public
 *      gallery projection. The artefact is the owner's paid text and the redraw is the owner's
 *      paid act.
 *   4. There IS a current render to redraw. A town whose dossier has never been scribed has
 *      nothing to retire and nothing to compare against; the OPEN renders it, not this.
 *
 * ⛔ AND A FIFTH THAT DISABLES RATHER THAN HIDES (W5b car 3): this epoch has not already been
 * redrawn `SCRIBE_REDRAW_LIMIT` times. The redraw was UNCAPPED, and it is exactly the button a
 * reader who does not like a paragraph presses again. Where the other four conditions mean "this
 * control does not belong on this page", the cap means "it belongs here and is spent", so the
 * control STAYS and says so: a billed button that silently does nothing is a reader pressing it
 * again. The count is read off the artefact's past lane by `redrawsAt`, the same function the
 * trigger refuses with, so the page and the decision can never disagree.
 *
 * ⛔ IT NAMES THE PRICE BEFORE IT SPENDS, AND IT NAMES WHAT THE PRICE BUYS.
 * `getCost('dossierProse')` is the live resolver every other credited control on this page reads,
 * so the number on the label is the number the server charges and not a second copy of the table.
 * The words PER RENDER are load-bearing (W5b): a render is one call per dossier tab, and until the
 * render session of migration 203 every one of those calls charged, so this label said five and
 * the bill said thirty-five. The number is now true and the label says what it covers, because a
 * price with no unit is the shape the defect hid in.
 *
 * ⛔ IT IMPORTS NO SCRIBE MODULE STATICALLY. The trigger and the transport arrive through
 * `await import(...)` inside the click handler, exactly as the open trigger's hook reaches them,
 * so the dossier's chunk carries the button and not the render path.
 */
import { useState } from 'react';
import Button from '../primitives/Button.jsx';
import { flag } from '../../lib/flags.js';
import {
  SCRIBE_REDRAW_LIMIT, currentAdvanceSeq, proseOf, redrawsAt,
} from '../../lib/scribeArtefact.js';
import { useStore } from '../../store/index.js';
import { useLiveAiCostResolver } from '../../hooks/useLivePricing.js';

/**
 * @param {{saveId?: string|null, playerView?: boolean, publicDossier?: boolean}} props
 */
export default function ScribeRedrawButton({
  saveId = null, playerView = false, publicDossier = false,
}) {
  const [busy, setBusy] = useState(false);
  const getCost = useLiveAiCostResolver();
  // A PRIMITIVE selector, deliberately: the artefact is a large object and a selector returning it
  // would re-render this button on every unrelated write to the settlement. The epoch number is
  // the only fact the button needs, and it moves exactly when a render lands or is retired.
  const surveySeq = useStore((s) => currentAdvanceSeq(proseOf(s.settlement)));
  // ⭐ AND THE SECOND PRIMITIVE, for the same reason: how many times THIS epoch has already been
  // redrawn. Counted off the artefact's past lane by the same function the trigger refuses with, so
  // the button and the decision can never disagree about whether a press would be accepted.
  const redraws = useStore((s) => {
    const prose = proseOf(s.settlement);
    return redrawsAt(prose, currentAdvanceSeq(prose));
  });
  const campaignId = useStore((s) => {
    if (saveId == null || typeof s.getCampaignForSettlement !== 'function') return '';
    return String(s.getCampaignForSettlement(saveId)?.id || '');
  });
  const guidance = useStore((s) => {
    if (saveId == null) return '';
    const notes = s.savedSettlements?.find((x) => x.id === saveId)?.aiData?.dossierNotes;
    return typeof notes?.aiGuidance === 'string' ? notes.aiGuidance.trim() : '';
  });

  if (!flag('scribe')) return null;
  if (!saveId || playerView || publicDossier) return null;
  if (surveySeq === null) return null;

  const cost = getCost('dossierProse');
  // ⛔ THE CAP IS SHOWN, NOT DISCOVERED (W5b car 3). A billed button whose press is refused by the
  // trigger with no word on the page is a reader pressing again; so the control stays visible,
  // goes disabled, and says in plain words what happened and what makes it possible again.
  const capped = redraws >= SCRIBE_REDRAW_LIMIT;
  const left = Math.max(0, SCRIBE_REDRAW_LIMIT - redraws);

  async function redraw() {
    if (busy || capped) return;
    setBusy(true);
    try {
      // THE TRANSPORT REGISTERS ITSELF, and it is imported HERE rather than by the trigger, so the
      // trigger stays a pure decision with no edge client behind it.
      const [{ runScribeRedraw }, { registerScribeTransport }] = await Promise.all([
        import('../../store/scribeOpenTrigger.js'),
        import('../../store/scribeTransport.js'),
      ]);
      registerScribeTransport();
      await runScribeRedraw({
        state: useStore.getState(), saveId, campaignId, flagOn: true, guidance,
      });
    } catch (error) {
      // The hand corpus is always there, so a redraw that cannot even load is a silent non-event
      // on the page rather than an error the reader has to understand.
      console.warn('[scribe] redraw did not run', error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant="ai"
      size="sm"
      busy={busy}
      disabled={capped}
      onClick={redraw}
      title={capped
        ? `This survey has been redrawn ${SCRIBE_REDRAW_LIMIT} times for this epoch, which is the limit. Every one of them is kept and stays readable. Advance the world and the next survey starts fresh.`
        : `Writes this dossier's prose again from the settlement as it stands now. One render covers every tab of the dossier, and it is charged once: ${cost} credits per render, whatever it draws. The survey it replaces is kept and stays readable. ${left} of ${SCRIBE_REDRAW_LIMIT} redraws left for this epoch.`}
    >
      {capped
        ? 'Redrawn as often as this epoch allows'
        : (busy ? 'Redrawing the survey…' : `Redraw the survey (${cost} credits per render)`)}
    </Button>
  );
}
