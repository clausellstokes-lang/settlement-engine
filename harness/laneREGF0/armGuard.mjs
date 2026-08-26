/**
 * harness/laneREGF0/armGuard.mjs — ⛔⛔ REG-F0 · **THE ARM THAT NEVER FIRED.**
 *
 * ⛔ THE DEFECT, MEASURED IN THIS LANE'S OWN FIRST THREE RUNS. `exemplars.mjs` captures
 * `REG_FABRIC_OPTS` into a module-scope `const ENV_OPTS` at MODULE-EVALUATION time. A harness
 * that writes `process.env.REG_FABRIC_OPTS = ...` in its own module body writes it AFTER its
 * static imports have already been evaluated, so `ENV_OPTS` is `null` and every subsequent
 * `buildOne(spec)` builds the DORMANT fabric — while the harness prints "arm: FULL".
 *   MEASURED on `town`: env-set-after-import → `marketRegister: false`, 1,197 parcels.
 *                       arms passed explicitly → `marketRegister: true`,  1,145 parcels.
 * The two are DIFFERENT DRAWINGS and the label said they were the same one.
 *
 * ⭐ WHY IT MATTERS BEYOND THIS FILE: `dressLeaf` calls `buildOne(spec)` with NO options, so the
 * SHELL ENVIRONMENT IS THE ONLY WAY TO ARM THE PARTITION DRESS PAGE'S FABRIC. There is no API
 * path. A dress-page census that does not export the variable before `node` starts measures the
 * dormant fabric, and nothing in the harness says so.
 *
 * ⭐ THE GUARD IS A LIVE PROBE, NOT A STRING CHECK. It BUILDS a leaf and looks for an arm's own
 * product, so it cannot be satisfied by a variable that is set but ignored.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { FABRIC_ARMS } from '../laneWORDS/wordsCensus.mjs';

export { FABRIC_ARMS };

/** The shell line a caller must use. Printed on failure so the fix is in the error. */
export const ARM_ENV = `REG_FABRIC_OPTS='${JSON.stringify(FABRIC_ARMS)}'`;

/**
 * @param {boolean} wantArmed
 * @returns {{armed:boolean, marketRegister:boolean, parcels:number, tier:string}}
 */
export function assertArm(wantArmed) {
  const probe = buildOne(CORPUS.find((s) => s.key === 'town'));
  const armed = !!probe.fabric.marketRegister;
  const state = { armed, marketRegister: armed, parcels: probe.fabric.parcels.length, tier: probe.fabric.meta.tier };
  if (wantArmed && !armed) {
    process.stderr.write(
      '\n⛔ ARM GUARD · the FULL arm was requested and the probe came back DORMANT.\n'
      + '   `exemplars.mjs` reads REG_FABRIC_OPTS at MODULE LOAD, so it must be exported\n'
      + '   BEFORE node starts. Re-run as:\n\n'
      + `     ${ARM_ENV} \\\n       node <this harness> ...\n\n`);
    process.exit(3);
  }
  if (!wantArmed && armed) {
    process.stderr.write('\n⛔ ARM GUARD · --dormant was requested but REG_FABRIC_OPTS is set in the environment.\n');
    process.exit(3);
  }
  return state;
}
