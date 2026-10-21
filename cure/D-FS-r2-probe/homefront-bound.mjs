// D-FS-r2 probe 3 (FS-V1): the war-layer reach of the vault the hand fills. Master's readWarHomeFront averages its
// PRESENT components (roads · stores · hands · institutions · markets, + coffers when observed), amplifies by the
// duration gain (capped), and warTermination adds homeFront.score01 * HOME_FRONT_CONTINUE_W to the continuation
// pressure through addPressure01 (a share of the REMAINING headroom). The bound below is arithmetic over master's
// own constants: how far can the coffers component ALONE (score01 swinging 0 <-> 1) move the continuation pressure?
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const { WAR_TERMINATION_TUNING: T } = await import(M + '/src/domain/worldPulse/warTermination.js');
const C = await import(M + '/src/domain/worldPulse/warCosts.js');
const WC = C.WAR_COSTS_TUNING;
const out = [];
out.push(`HOME_FRONT_CONTINUE_W = ${T.HOME_FRONT_CONTINUE_W} · DURATION_GAIN_CAP = ${WC.DURATION_GAIN_CAP} · DURATION_GAIN_PER_TICK = ${WC.DURATION_GAIN_PER_TICK} (cap reached after ${WC.DURATION_GAIN_CAP / WC.DURATION_GAIN_PER_TICK} weeks)`);
const components = 6; // five always-present + coffers when observed
for (const others of [0, 0.25, 0.5]) {
  for (const gain of [0, WC.DURATION_GAIN_CAP]) {
    const hf = (coffers) => Math.min(1, ((others * 5 + coffers) / components) * (1 + gain));
    const lo = hf(0), hi = hf(1);
    for (const base of [0, 0.4]) {
      const add = (p) => Math.min(1, base + (1 - base) * p * T.HOME_FRONT_CONTINUE_W);
      out.push(`others=${others} gain=${gain} baseContinue=${base}: homeFront ${lo.toFixed(3)}..${hi.toFixed(3)} ⇒ continue01 ${add(lo).toFixed(4)}..${add(hi).toFixed(4)} (Δ from the vault alone ≤ ${(add(hi) - add(lo)).toFixed(4)})`);
    }
  }
}
out.push(`MAX Δ continue01 attributable to the vault (others 0, gain at cap, base 0) = ${(T.HOME_FRONT_CONTINUE_W * Math.min(1, (1 / components) * (1 + WC.DURATION_GAIN_CAP))).toFixed(4)} of the remaining headroom`);
console.log(out.join('\n'));
