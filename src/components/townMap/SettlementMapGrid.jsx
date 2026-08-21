/**
 * components/townMap/SettlementMapGrid — the VTT coordinate grid layer.
 *
 * The functional lens's light coordinate grid, drawn beneath the map. Extracted from the
 * pane as its own leaf (the SettlementMapLandform precedent) so the max-lines-capped pane
 * grows by one call, not a block. Self-gating: renders nothing when there is no grid step
 * (every non-VTT lens), so the pane mounts it unconditionally. Static — pointer events off
 * — so the interactive layers stay reachable. Keeps `data-town-grid` for the lens tests.
 */

/**
 * @param {{ step: number, ink: string }} props
 */
export default function SettlementMapGrid({ step, ink }) {
  if (!(step > 0)) return null;
  /** @type {Array<{ x1: number, y1: number, x2: number, y2: number }>} */
  const lines = [];
  for (let x = step; x < 1000; x += step) lines.push({ x1: x, y1: 0, x2: x, y2: 1000 });
  for (let y = step; y < 1000; y += step) lines.push({ x1: 0, y1: y, x2: 1000, y2: y });
  return (
    <g data-town-grid style={{ pointerEvents: 'none' }}>
      {lines.map((ln, i) => (
        <line key={`grid.${i}`} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke={ink} strokeOpacity={0.14} strokeWidth={0.75} />
      ))}
    </g>
  );
}
