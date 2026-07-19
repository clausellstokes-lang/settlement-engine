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
 * ENTITLEMENT (owner-ratified twice, 2026-07-18): the door and everything behind it are
 * SURVEYOR-gated and the marker RENDERS ONLY for Surveyor-tier users — no lock-tease, no
 * placeholder; the left margin is simply empty for everyone else. AI-tier discovery lives
 * on Pricing + tierFacts surfaces, never as in-app chrome.
 * ⚠ FINDING (recorded in the C13 report): the code ladder has NO Surveyor tier constant —
 * subscription tiers are 'anon' | 'free' | 'premium' (store/authSlice.js TIER_GATE), and
 * pricingDisplay.js states "Surveyor is NOT a subscription tier". `isSurveyorTier` below
 * is the ONE chokepoint mapping the ruling's "surveyor premium" onto the only paid tier
 * in the ladder ('premium', which elevated roles already resolve to). If the owner means
 * a different entitlement, this predicate is the single line to flip.
 *
 * Styling: shape/elevation/hover-reveal live in index.css (.sf-door-*) — the kill-list
 * ratchet (tests/design/deepCraftKillList.test.js) freezes inline borderRadius/boxShadow/
 * rgba( counts in src/components, so a NEW floating surface must carry its chrome in CSS.
 * Colors ride the theme's AI register (the slate conversion lands at the tokens chokepoint).
 * Lazy-only: rides the FloatingAffordances chunk — zero eager bytes.
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { CARD, VIOLET, VIOLET_DEEP, MUTED, sans, SP, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { AnchorChip, PromptArea } from './surveyorPanelKit.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { routeDoorPrompt } from '../../domain/intent/doorRouter.js';
import AiAnalystPanel from '../AiAnalystPanel.jsx';
import SurveyorWorkshop from './SurveyorWorkshop.jsx';

/** The ONE entitlement chokepoint (see the FINDING in the header). */
export function isSurveyorTier(tier) {
  return tier === 'premium';
}

export default function SurveyorDoor({ visible = true }) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [text, setText] = useState('');
  // The routed destination: null | { id: 'analyst', question } | { id: stageId, prompt, scope }.
  const [dest, setDest] = useState(null);
  // Remount destinations per routing so initial* props re-seed (panels stay dumb).
  const [nonce, setNonce] = useState(0);
  const tier = useStore((s) => s.auth.tier);
  const { anchorLabel } = useSurveyorContext();

  if (!visible || !isSurveyorTier(tier)) return null;

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
          aria-label regardless). Rendered only when no surface of the door is open. */}
      {!promptOpen && !dest && (
        <Button
          variant="ai"
          size="sm"
          className="sf-door-tab"
          onClick={() => setPromptOpen(true)}
          aria-label={t('surveyorDoor.label')}
          aria-haspopup="dialog"
        >
          <span className="sf-door-label" aria-hidden="true">{t('surveyorDoor.label')}</span>
        </Button>
      )}

      {promptOpen && (
        <div
          role="dialog"
          aria-label={t('surveyorDoor.heading')}
          className="sf-door-panel"
          style={{
            background: CARD, border: `1px solid ${VIOLET}`,
            display: 'flex', flexDirection: 'column', gap: SP.sm,
            padding: SP.lg, fontFamily: sans,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SP.sm }}>
            <span className="sf-smallcap" style={{ fontSize: FS.sm, fontWeight: 700, color: VIOLET_DEEP }}>
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
