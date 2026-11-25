// BIRTH-1, unit D5: R13 score by score over a birth (`defenceWillHoldOf`, D5's reader), and the old points-only bound beside it.
const ARMED = new Set(['garrison', 'militia', 'watch', 'company', 'charter', 'households', 'wardens']);
let M = null;
export async function measure(town, { tree }) {
  M ||= await import(`${tree}/src/generators/defenseGenerator.js`);
  const { n, willHold, parts } = M.defenceWillHoldOf(town);
  if (!Object.keys(willHold).length) return { held: false };
  let breaks = 0, onFloor = 0, after = 0;
  for (const [d, h] of Object.entries(willHold)) {
    const armedNow = parts.filter((p) => ARMED.has(p.id)).reduce((a, p) => a + Math.max(0, p.dims[d] || 0), 0);
    if (h.after > Math.max(h.armed, h.floor) + 1e-9 || h.after > h.before + 1e-9 || h.floor > h.before + 1e-9 || h.armed + 1e-9 < armedNow) breaks++;
    if (h.after > h.armed + 1e-9) onFloor++;
    after += h.after;
  }
  const list = M.defencePartsOf(town); const will = list.find((p) => p.id === 'will');
  const armedPts = list.filter((p) => ARMED.has(p.id)).reduce((a, p) => a + p.points, 0);
  return { held: true, breaks, onFloor, pageOver: (will?.points ?? 0) > after / n + 0.1 + 1e-9, oldBoundRed: !!will && will.held !== undefined && will.points > armedPts + 0.1 * list.length };
}
