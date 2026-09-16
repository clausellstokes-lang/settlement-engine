import {
  BODY,
  BORDER,
  CARD,
  FS,
  INK,
} from '../../theme.js';
import Button from '../../primitives/Button.jsx';
import { OVERRIDE_MODES } from '../../../lib/townScene/adaptiveQuality.js';

const QUALITY_LABELS = Object.freeze({
  auto: 'Automatic',
  high: 'High ceiling',
  medium: 'Medium ceiling',
  low: 'Low ceiling',
});

const controlStyle = {
  width: '100%',
  minHeight: 40,
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  background: CARD,
  color: INK,
  padding: '7px 9px',
  font: 'inherit',
  fontSize: FS.xs,
  fontWeight: 750,
  cursor: 'pointer',
};

/**
 * Non-gesture alternatives for the renderer's two global display decisions.
 *
 * Quality modes are ceilings, not fixed presets: the automatic governor may
 * still lower fidelity to preserve interaction. Plan is a first-class escape
 * hatch rather than an error-only recovery path.
 */
export default function TownSceneViewerControls({
  qualityMode,
  effectiveQuality,
  onQualityModeChange,
  onZoomIn,
  onZoomOut,
  onUsePlan,
}) {
  const effectivePercent = Math.round(
    Math.max(0, Math.min(1, Number(effectiveQuality) || 0)) * 100,
  );

  return (
    <aside
      aria-label="Portrait display controls"
      style={{
        display: 'grid',
        gap: 8,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD,
        color: INK,
        padding: 12,
      }}
    >
      <label
        htmlFor="town-scene-quality-mode"
        style={{ display: 'grid', gap: 4, fontSize: FS.xs, fontWeight: 750 }}
      >
        Rendering quality
        <select
          id="town-scene-quality-mode"
          value={qualityMode}
          aria-describedby="town-scene-quality-help"
          onChange={(event) => onQualityModeChange?.(event.target.value)}
          style={controlStyle}
        >
          {OVERRIDE_MODES.map((mode) => (
            <option key={mode} value={mode}>{QUALITY_LABELS[mode] || mode}</option>
          ))}
        </select>
      </label>
      <p
        id="town-scene-quality-help"
        aria-live="polite"
        aria-atomic="true"
        style={{ margin: 0, color: BODY, fontSize: FS.xs, lineHeight: 1.45 }}
      >
        This sets a ceiling. Portrait can reduce detail further to stay responsive.
        {' '}
        Current detail is {effectivePercent}%.
      </p>
      <div
        role="group"
        aria-label="Portrait zoom"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}
      >
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onZoomIn}
        >
          Zoom in
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onZoomOut}
        >
          Zoom out
        </Button>
      </div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={onUsePlan}
        fullWidth
      >
        Use 2D plan
      </Button>
    </aside>
  );
}
