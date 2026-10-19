// D-MN-r2b probe (read-only): MN §3.3's ONE presence composition (SEAMS-r2-7) on master's own
// embattlement tuning and step. Feeds each composed term to stepEmbattlement from a CALM ledger
// entry and reports whether the town latches. No file in the worktree is written.
const M = process.argv[2];
const emb = await import(`${M}/src/domain/spatial/embattlement.js`);
const T = emb.EMBATTLEMENT_TUNING;
const CAP = T.W_SIEGE; // PRESENCE_TERM_CAP = W_SIEGE (MN §3.3)
const wallsAtCap = Math.max(0, T.W_SIEGE - T.SECURITY_MAX_RELIEF); // a garrisoned town, relief at its cap
const RAID = 0.60; // MENACE_RAID_PRESENCE (DRAFT)
const COLUMN = 0.60; // PS12's enemy-column feeder (DRAFT)
function compose({ walls = 0, column = 0, raid = 0, site = 0, siteSup = 0, patrolSub = 0 }) {
  const w = Math.min(CAP, walls), c = Math.min(CAP, column);
  const rc = Math.min(CAP, Math.max(raid, site));
  const sigma = Math.min(0.25, siteSup + patrolSub);
  return Math.max(w, c, Math.max(0, rc - sigma));
}
// the "suppressible column" alternative the seams skeptic tested against PS's P14
function composeColumnSuppressed(a) {
  const w = Math.min(CAP, a.walls || 0);
  const rc = Math.min(CAP, Math.max(a.raid || 0, a.site || 0, a.column || 0));
  const sigma = Math.min(0.25, (a.siteSup || 0) + (a.patrolSub || 0));
  return Math.max(w, Math.max(0, rc - sigma));
}
const calm = { phase: 'calm', level: 0, sinceTick: 0 };
const rows = [
  ['menace at the walls, relief at cap, fort 0.20 + riders 0.15', { walls: wallsAtCap, siteSup: 0.20, patrolSub: 0.15 }],
  ['enemy column in the land, fort 0.20 + riders 0.15', { column: COLUMN, siteSup: 0.20, patrolSub: 0.15 }],
  ['raiding menace, fort 0.20 + riders 0.15', { raid: RAID, siteSup: 0.20, patrolSub: 0.15 }],
  ['raiding menace, nothing held', { raid: RAID }],
  ['column + raiding menace, fort 0.20 + riders 0.15', { column: COLUMN, raid: RAID, siteSup: 0.20, patrolSub: 0.15 }],
  ['raiding menace + untied den 0.45, riders 0.05', { raid: RAID, site: 0.45, patrolSub: 0.05 }],
];
const out = { ENTER_THRESHOLD: T.ENTER_THRESHOLD, W_SIEGE: T.W_SIEGE, SECURITY_MAX_RELIEF: T.SECURITY_MAX_RELIEF, CAP, rows: [] };
for (const [label, a] of rows) {
  const p = compose(a);
  const step = emb.stepEmbattlement(calm, p, 1);
  const alt = composeColumnSuppressed(a);
  const stepAlt = emb.stepEmbattlement(calm, alt, 1);
  out.rows.push({ label, presence: +p.toFixed(4), phase: step.phase, ifColumnSuppressed: +alt.toFixed(4), phaseIfColumnSuppressed: stepAlt.phase });
}
console.log(JSON.stringify(out, null, 2));
