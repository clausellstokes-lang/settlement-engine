/**
 * components/surveyor/SurveyorWorkshop.jsx — THE SURVEYOR SHELL for the WRITE stages
 * (DESIGN_AI_CONTROL_SURFACE §2c). One floating sigil (right side, the Surveyor's compass) →
 * a docked panel (never a modal — the world stays visible) hosting the four write surfaces
 * behind a stage switch: custom content (S4) · style overhaul · construction (S5/S6) ·
 * accept→mint (S3). Each stage body is React.lazy, so its code + its heavy domain graph load
 * only when its stage is opened; the whole workshop rides the existing FloatingAffordances lazy
 * chunk (App.jsx mounts that once) so first paint pays zero. Every stage carries the §2b
 * early-access register and the visible §3c context anchor.
 *
 * JUDGMENT (vetoable): a SINGLE launcher + stage switch (not four floating sigils, not the full
 * §2c docked shell with Cmd+K / ambient glyphs — S3 deferred that polish as least-verifiable
 * headless). Placement + the compass sigil are cosmetic and vetoable.
 */

import { lazy, Suspense, useState } from 'react';
import { Compass, X } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile.js';
import { INK, MUTED, BORDER, CARD, BODY, sans, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Segmented from '../primitives/Segmented.jsx';
import { AnchorChip, EarlyAccessBadge } from './surveyorPanelKit.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';

const CustomContentPanel = lazy(() => import('./CustomContentPanel.jsx'));
const StyleOverhaulPanel = lazy(() => import('./StyleOverhaulPanel.jsx'));
const ConstructionPanel = lazy(() => import('./ConstructionPanel.jsx'));
const InterpretApplyPanel = lazy(() => import('./InterpretApplyPanel.jsx'));
const AutonomyPanel = lazy(() => import('./AutonomyPanel.jsx'));

const STAGES = [
  { id: 'content', label: 'Content', Body: CustomContentPanel },
  { id: 'style', label: 'Style', Body: StyleOverhaulPanel },
  { id: 'construct', label: 'Build', Body: ConstructionPanel },
  { id: 'apply', label: 'Apply', Body: InterpretApplyPanel },
  { id: 'autonomy', label: 'Run', Body: AutonomyPanel }, // S7 (additive registration)
];

export default function SurveyorWorkshop({ visible = true }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState('content');
  const { anchorLabel } = useSurveyorContext();
  const isMobile = useIsMobile();

  if (!visible) return null;

  const dockPos = {
    position: 'fixed', right: SP.lg, bottom: isMobile ? 136 : 76, zIndex: 60, fontFamily: sans,
  };

  if (!open) {
    return (
      <div style={dockPos}>
        <Button
          variant="ai"
          size="sm"
          icon={<Compass size={14} />}
          onClick={() => setOpen(true)}
          aria-label="Open the Surveyor's workshop"
        >
          Surveyor's workshop
        </Button>
      </div>
    );
  }

  const active = STAGES.find((s) => s.id === stage) || STAGES[0];
  const Body = active.Body;

  return (
    <div
      role="region"
      aria-label="The Surveyor's workshop"
      style={{
        ...dockPos,
        width: 360, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 160px)',
        background: CARD, color: BODY, border: `1px solid ${BORDER}`, borderRadius: R.lg,
        padding: SP.lg, boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
        display: 'flex', flexDirection: 'column', gap: SP.sm, overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SP.sm }}>
        <span style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: INK }}>Surveyor's workshop</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
          <EarlyAccessBadge />
          <IconButton Icon={X} label="Close the workshop" size="sm" onClick={() => setOpen(false)} />
        </div>
      </div>

      <AnchorChip label={anchorLabel} />

      <Segmented options={STAGES.map((s) => ({ id: s.id, label: s.label }))} value={stage} onChange={setStage} size="sm" ariaLabel="Surveyor write stage" />

      <Suspense fallback={<p style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontFamily: sans }}>Loading…</p>}>
        <Body />
      </Suspense>
    </div>
  );
}
