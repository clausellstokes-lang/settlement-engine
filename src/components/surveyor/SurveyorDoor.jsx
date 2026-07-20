/**
 * components/surveyor/SurveyorDoor.jsx — THE ONE DOOR (C13, owner ruling 2026-07-18).
 *
 * The single AI entry point: one floating slate tab on the LEFT edge of the page (the
 * marginalia position), no text until hover/focus (the label reveals as a flag; AT always
 * hears the aria-label). It opens a prompt slip; every prompt routes through the S3 intent
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
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { t } from '../../copy/index.js';
import { CARD, SLATE, SLATE_DEEP, MUTED, sans, SP, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { AnchorChip, PromptArea } from './surveyorPanelKit.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { useSurveyorEntitled } from './useSurveyorEntitled.js';
import { routeDoorPrompt } from '../../domain/intent/doorRouter.js';
import AiAnalystPanel from '../AiAnalystPanel.jsx';
import SurveyorWorkshop from './SurveyorWorkshop.jsx';

// The ONE entitlement chokepoint lives in surveyorGate.js (a pure, import-free
// predicate, kept off the eager closure). Re-exported here so the C13 consumers
// and the door contract test keep importing it from the door module.
export { isSurveyorTier } from './surveyorGate.js';

export default function SurveyorDoor({ visible = true }) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [text, setText] = useState('');
  // The routed destination: null | { id: 'analyst', question } | { id: stageId, prompt, scope }.
  const [dest, setDest] = useState(null);
  // Remount destinations per routing so initial* props re-seed (panels stay dumb).
  const [nonce, setNonce] = useState(0);
  const surveyorEntitled = useSurveyorEntitled();
  const { anchorLabel } = useSurveyorContext();
  // Route the slip through the app's shared modal focus standard (the same
  // useDialogFocusTrap the 14+ sibling dialogs use): focus in on open, trap Tab,
  // Escape closes, focus restored to the trigger on close. The trigger Button is
  // kept mounted while the slip is open (tucked behind the panel via CSS) so the
  // hook has a live element to restore focus to — Button does not forward refs,
  // so the hook's native document.activeElement restore is the clean path.
  const doorRef = useDialogFocusTrap(promptOpen, () => setPromptOpen(false));

  if (!visible || !surveyorEntitled) return null;

  const openDestination = (routed, promptText) => {
    setDest(routed.destination === 'analyst'
      ? { id: 'analyst', question: promptText }
      : { id: routed.destination, prompt: promptText, scope: routed.scope });
    setNonce((n) => n + 1);
    setPromptOpen(false);
    setText('');
  };

  const route = () => {
    const q = text.trim();
    if (!q) return;
    openDestination(routeDoorPrompt(q), q);
  };

  return (
    <>
      {/* The marker: no text until hover/focus (the label is a reveal flag; AT reads the
          aria-label regardless). Kept mounted while the slip is open (tucked behind the
          panel via sf-door-tab--open) so useDialogFocusTrap can restore focus here on
          close; hidden only once a destination panel takes over. */}
      {!dest && (
        <Button
          variant="ai"
          size="sm"
          className={`sf-door-tab${promptOpen ? ' sf-door-tab--open' : ''}`}
          onClick={() => setPromptOpen(true)}
          aria-label={t('surveyorDoor.label')}
          aria-haspopup="dialog"
        >
          <span className="sf-door-label" aria-hidden="true">{t('surveyorDoor.label')}</span>
        </Button>
      )}

      {promptOpen && (
        <div
          ref={doorRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-label={t('surveyorDoor.heading')}
          className="sf-door-panel"
          style={{
            background: CARD, border: `1px solid ${SLATE}`,
            display: 'flex', flexDirection: 'column', gap: SP.sm,
            padding: SP.lg, fontFamily: sans,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SP.sm }}>
            <span className="sf-smallcap" style={{ fontSize: FS.sm, fontWeight: 700, color: SLATE_DEEP }}>
              {t('surveyorDoor.heading')}
            </span>
            <IconButton Icon={X} label={t('surveyorDoor.close')} size="sm" onClick={() => setPromptOpen(false)} />
          </div>

          {/* CONTEXT-FIRST made visible: the Surveyor reads what the page shows. */}
          <AnchorChip label={anchorLabel} />

          <PromptArea
            value={text}
            onChange={setText}
            label={t('surveyorDoor.promptLabel')}
            placeholder={t('surveyorDoor.placeholder')}
            rows={3}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SP.sm }}>
            <span style={{ fontSize: FS.xs, color: MUTED }}>{t('surveyorDoor.routeHint')}</span>
            <Button variant="aiSolid" size="sm" disabled={!text.trim()} onClick={route}>
              {t('surveyorDoor.route')}
            </Button>
          </div>

          {/* Promptless doors (capability retention: the retired launchers allowed opening
              the panels without a prompt — these quiet register links keep that path). */}
          <div style={{ display: 'flex', gap: SP.sm }}>
            <Button variant="ghost" size="sm" onClick={() => openDestination({ destination: 'analyst' }, '')}>
              {t('surveyorDoor.openAnalyst')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openDestination({ destination: 'content', scope: 'settlement' }, '')}>
              {t('surveyorDoor.openWorkshop')}
            </Button>
          </div>
        </div>
      )}

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
