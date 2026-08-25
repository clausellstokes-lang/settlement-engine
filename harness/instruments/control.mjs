/**
 * harness/instruments/control.mjs — ⭐⭐ THE KIT · THE PLANTED-CONTROL SCAFFOLD (ODQ §634.3).
 *
 * **A GUARD THAT CANNOT FAIL PROVES NOTHING**, and a census that reads zero is worth nothing
 * until something has made it read non-zero. Every wave has hand-rolled the same four steps —
 * measure clean, plant, measure planted, restore and re-measure — and the fourth step is the one
 * lanes forget, which is how a mutated source survives into a later measurement.
 *
 * `plantedControl()` makes all four mandatory. It refuses to report a verdict unless:
 *   1. the CLEAN measurement was taken BEFORE the plant;
 *   2. the PLANTED measurement DIFFERS from it (else the census is pointed at nothing);
 *   3. the RESTORE is proved byte-identical to the original, not merely attempted.
 * Step 3 runs in a `finally`, so a throw inside the measurement cannot leave a planted file on
 * disk — the failure mode that silently poisons every later run in the same worktree.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const sha = (b) => createHash('sha256').update(b).digest('hex');

/**
 * Plant an edit into a real file, measure, and restore — with the restore PROVED.
 *
 * @param {object} o
 * @param {string} o.name        what this control is called in the report
 * @param {string} o.file        the file to plant into (read/written verbatim as a Buffer)
 * @param {(src:string)=>string} o.plant   returns the mutated source; MUST differ from the input
 * @param {()=>any} o.measure    the measurement, run once clean and once planted
 * @param {(clean:any, planted:any)=>boolean} [o.moved]  did the measurement move? default: JSON differs
 */
export function plantedControl({ name, file, plant, measure, moved }) {
  const original = readFileSync(file);
  const beforeSha = sha(original);
  const clean = measure();
  let planted = null, plantedApplied = false, error = null;
  try {
    const mutated = plant(original.toString('utf8'));
    if (mutated === original.toString('utf8')) {
      throw new Error(`PLANT_NOOP ${name} — the mutation changed nothing, so the control cannot fire`);
    }
    writeFileSync(file, mutated);
    plantedApplied = true;
    planted = measure();
  } catch (e) {
    error = e;
  } finally {
    // ⛔ the restore is unconditional, and it is PROVED, not attempted
    if (plantedApplied) writeFileSync(file, original);
  }
  const afterSha = sha(readFileSync(file));
  const restored = afterSha === beforeSha;
  if (error) return { name, file, ok: false, restored, error: String(error && error.message || error), clean, planted: null };
  const didMove = moved ? moved(clean, planted) : JSON.stringify(clean) !== JSON.stringify(planted);
  return {
    name, file, clean, planted, restored,
    ok: didMove && restored,
    verdict: !didMove
      ? `⛔ DEAD — the plant did not move the measurement; this census cannot convict`
      : !restored
        ? `⛔ NOT RESTORED — ${file} does not match its pre-plant sha; every later run in this tree is suspect`
        : `LIVE — the plant moved the measurement and the file restored byte-identical`,
  };
}

/** run several controls and fold them into one verdict line */
export function controlSuite(controls) {
  const rows = controls.map(plantedControl);
  const live = rows.filter((r) => r.ok).length;
  return {
    rows, live, of: rows.length,
    verdict: live === rows.length
      ? `CONTROLS LIVE ${live} of ${rows.length}`
      : `⛔ CONTROLS INCOMPLETE ${live} of ${rows.length} — ${rows.filter((r) => !r.ok).map((r) => r.name).join(', ')}`,
  };
}

/**
 * ⭐ THE IN-MEMORY VARIANT, for the many controls that do not need a file edit at all: run the
 * same measurement over a deliberately damaged INPUT. Preferred wherever it is expressible,
 * because nothing on disk is ever mutated and no sibling lane can read a broken file.
 */
export function inputControl({ name, damage, measure, moved }) {
  const clean = measure(null);
  const planted = measure(damage);
  const didMove = moved ? moved(clean, planted) : JSON.stringify(clean) !== JSON.stringify(planted);
  return {
    name, clean, planted, ok: didMove, restored: true,
    verdict: didMove ? 'LIVE — the damaged input moved the measurement' : '⛔ DEAD — the damaged input read the same',
  };
}
