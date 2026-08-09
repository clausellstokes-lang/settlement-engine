/**
 * components/surveyor/SurveyorWorkshop.jsx — THE SURVEYOR SHELL for the WRITE stages
 * (DESIGN_AI_CONTROL_SURFACE §2c), now a DESTINATION of THE ONE DOOR (C13): SurveyorDoor
 * owns open state and routes prompts here with a pre-selected stage; the former floating
 * compass launcher is retired per the owner's ONE DOOR ruling. A docked panel (never a
 * modal — the world stays visible) hosts the write surfaces behind a stage switch: custom
 * content (S4) · style overhaul · construction (S5/S6) · accept→mint (S3) · autonomy (S7).
 * Each stage body is React.lazy, so its code + its heavy domain graph load only when its
 * stage is opened; the whole workshop rides the existing FloatingAffordances lazy chunk
 * (App.jsx mounts that once) so first paint pays zero. Every stage carries the §2b
 * early-access register and the visible §3c context anchor.
 *
 * JUDGMENT (vetoable): destinations dock along the LEFT edge (the door's margin) so the
 * one-door spatial story holds — the routed prompt seeds the stage's own prompt field
 * (initialPrompt/initialScope are initialization-only; absent ⇒ identical behavior).
 */

import { Suspense, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile.js';
import { INK, MUTED, BORDER, CARD, BODY, sans, SP, FS } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
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
const StyleOverhaulPanel = lazy(() => import('./StyleOverhaulPanel.jsx'));
const ConstructionPanel = lazy(() => import('./ConstructionPanel.jsx'));
const InterpretApplyPanel = campaignLazy(() => import('./InterpretApplyPanel.jsx'));
const AutonomyPanel = campaignLazy(() => import('./AutonomyPanel.jsx'));
const CorpusFactoryPanel = lazy(() => import('./CorpusFactoryPanel.jsx'));

const STAGES = [
  { id: 'content', label: 'Content', Body: CustomContentPanel },
  { id: 'style', label: 'Style', Body: StyleOverhaulPanel },
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

  const dockPos = {
    position: 'fixed', left: SP.lg, bottom: isMobile ? 136 : 76, zIndex: 60, fontFamily: sans,
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
        width: 360, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 160px)',
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
