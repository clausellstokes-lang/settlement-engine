/**
 * harness/instruments/crops.mjs — ⭐ THE KIT · RULE-FIRST CROP SELECTION + THE BOUNDED SHOT
 * (ODQ §634.3).
 *
 * ⭐⭐ **A CROP CHOSEN AFTER LOOKING IS A CROP CHOSEN TO FLATTER.** REG-2's `pickCrops.mjs` set
 * the precedent and REG-4's `crops.mjs` restated it: the RULE is written down before anything is
 * rendered, and the box is whatever the rule selects. `ruleBox()` makes that mechanical — a box
 * cannot be produced without a rule string travelling beside it, and `renderSheet()` prints the
 * rule next to every crop so a judging round shows its own selection method.
 *
 * ⚠⚠ **HEADLESS CHROME WRITES THE SCREENSHOT AND THEN DOES NOT EXIT.** Measured at REG-4: the
 * first crop's PNG landed at 708 KB and the process was still alive **5 min 40 s** later, with
 * `execFileSync` waiting on it forever and four more Chromes queued behind it. J-REG4-11 is the
 * law that came out of it and `shootBounded()` is that law made mechanical:
 *   · every shot is wall-clock bounded, TERM then KILL;
 *   · **the verdict is the PNG's existence and byte size, NEVER the exit status** — the file is
 *     already written when the zombie hangs, so an exit code is the one thing that cannot decide;
 *   · a shot below the byte floor is a FAILURE even if Chrome exited 0.
 * ⭐ TIER LAW (§634.2): `quicklook` (qlmanage, 0.5 s) for ITERATION passes; headless Chrome stays
 * THE INSTRUMENT for exit legs.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, statSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname } from 'node:path';

/** a square box centred on a point, rounded to whole units — the corpus's own crop shape */
export const box = (cx, cy, s) => `${Math.round(cx - s / 2)} ${Math.round(cy - s / 2)} ${Math.round(s)} ${Math.round(s)}`;

/**
 * A crop box that cannot exist without its rule.
 * @param {string} rule  the selection rule, written BEFORE anything was looked at
 * @param {{x:number,y:number}} at  the point the rule selected
 * @param {number} size  the frame, in map units
 * @param {object} [why] the evidence the rule used (counts, keys) — printed on the sheet
 */
export function ruleBox(rule, at, size, why = {}) {
  if (!rule || typeof rule !== 'string') throw new Error('RULE_REQUIRED — a crop box without its rule is a crop chosen to flatter');
  if (!at || !Number.isFinite(at.x) || !Number.isFinite(at.y)) throw new Error(`RULE_UNSATISFIED ${rule} — the rule selected nothing on this leaf`);
  return { rule, box: box(at.x, at.y, size), at: { x: at.x, y: at.y }, size, why };
}

/**
 * The densest window rule, which three waves have each re-written: the S×S window holding the
 * most of `points`. Returned as a ruleBox so the rule travels with the answer.
 */
export function densestWindow(points, S, rule = `the ${S}×${S} window holding the most members`, step = null) {
  if (!points.length) throw new Error(`RULE_UNSATISFIED ${rule} — no members to window`);
  const st = step || S / 2;
  let best = null;
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += st) {
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += st) {
      let n = 0;
      for (const p of points) if (p.x >= x && p.x < x + S && p.y >= y && p.y < y + S) n++;
      if (!best || n > best.n) best = { n, x, y };
    }
  }
  return ruleBox(rule, { x: best.x + S / 2, y: best.y + S / 2 }, S, { members: best.n });
}

export const SHOT_MS = 45000;
export const BYTE_FLOOR = 40000;

/**
 * Shoot an SVG to PNG under a wall-clock bound. **The verdict is the file, never the status.**
 * @returns {{ok:boolean, bytes:number, killed:boolean, verdict:string}}
 */
export function shootBounded(svgPath, pngPath, px = 2200, byteFloor = BYTE_FLOOR, ms = SHOT_MS) {
  mkdirSync(dirname(pngPath), { recursive: true });
  if (existsSync(pngPath)) unlinkSync(pngPath);
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  let killed = false;
  try {
    execFileSync(chrome, [
      '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--screenshot=${pngPath}`, `--window-size=${px},${px}`, `file://${svgPath}`,
    ], { timeout: ms, stdio: 'ignore' });
  } catch (e) {
    killed = true;   // ⛔ expected: the zombie is the normal case, not the exception
  }
  const bytes = existsSync(pngPath) ? statSync(pngPath).size : 0;
  const ok = bytes >= byteFloor;
  return {
    ok, bytes, killed,
    verdict: ok
      ? `SHOOT_OK ${bytes} bytes${killed ? ' (bounded; the zombie was killed AFTER the file landed)' : ''}`
      : `⛔ SHOOT_FAILED ${bytes} bytes < floor ${byteFloor} — the crop did not render`,
  };
}

/** the ITERATION tier (§634.2): qlmanage, ~0.5 s, same file-is-the-verdict law */
export function quicklook(svgPath, outDir, byteFloor = 4000, ms = 20000) {
  mkdirSync(outDir, { recursive: true });
  spawnSync('qlmanage', ['-t', '-s', '1600', '-o', outDir, svgPath], { timeout: ms, stdio: 'ignore' });
  const png = `${outDir}/${svgPath.split('/').pop()}.png`;
  const bytes = existsSync(png) ? statSync(png).size : 0;
  return { ok: bytes >= byteFloor, bytes, png, verdict: bytes >= byteFloor ? `QL_OK ${bytes}` : `⛔ QL_FAILED ${bytes}` };
}
