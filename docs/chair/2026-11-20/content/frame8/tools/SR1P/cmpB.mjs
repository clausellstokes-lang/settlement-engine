// SR1-P proof (b), the comparison. usage: node cmpB.mjs <tip-tree/> <base.jsonl> <tip.jsonl>
// Per cast: roles byte for byte (a moved role is a STOP), absences, stake keys (TIP's stakeReasonKey on both sides), each
// stake's power and stake, and the cast with its stake reasons blanked; the reasons that differ are counted.
import fs from 'node:fs';
const [R, A, B] = process.argv.slice(2);
const { stakeReasonKey } = await import(R + 'src/data/crisis/stakeReasonLines.js');
const read = (f) => new Map(fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((d) => [d.seed, d]));
const a = read(A), b = read(B);
const J = JSON.stringify;
const c = { towns: 0, err: 0, casts: 0, forcedBoth: 0, entryMoved: 0, rolesSame: 0, rolesMoved: 0, absentMoved: 0, stakeCountMoved: 0,
  keyMoved: 0, powerOrStakeMoved: 0, castBlankedMoved: 0, reasonsDiffer: 0, stakeRows: 0, castsWithLosesOrSplit: 0, townsWithLosesOrSplit: 0, kindsWithout: new Set() };
const byKey = {}; const moved = [];
const blankCast = (cast) => cast && { ...cast, stakes: (cast.stakes || []).map((k) => ({ ...k, reason: '' })) };
for (const [seed, x] of a) {
  const y = b.get(seed); c.towns++;
  if (x.err || !y || y.err) { c.err++; continue; }
  if (J(x.entries.map((e) => [e.kind, e.forced])) !== J(y.entries.map((e) => [e.kind, e.forced]))) { c.entryMoved++; moved.push(`${seed} entries`); continue; }
  if (x.entries.length === 2 && x.entries.every((e) => e.forced)) c.forcedBoth++;
  let town = false;
  x.entries.forEach((e, i) => {
    const f = y.entries[i]; c.casts++;
    const ca = e.cast || {}, cb = f.cast || {};
    if (J(ca.roles) === J(cb.roles)) c.rolesSame++; else { c.rolesMoved++; moved.push(`${seed} ${e.kind} ROLES`); }
    if (J(ca.absent) !== J(cb.absent)) { c.absentMoved++; moved.push(`${seed} ${e.kind} absent`); }
    if (J(blankCast(ca)) !== J(blankCast(cb))) { c.castBlankedMoved++; moved.push(`${seed} ${e.kind} cast(blanked)`); }
    const sa = ca.stakes || [], sb = cb.stakes || [];
    if (sa.length !== sb.length) { c.stakeCountMoved++; return; }
    let has = false;
    sa.forEach((k, j) => {
      const t = sb[j]; c.stakeRows++;
      const ka = stakeReasonKey(k.reason), kb = stakeReasonKey(t.reason);
      if (ka === 'loses' || ka === 'split') has = true;
      if (ka !== kb) c.keyMoved++;
      if (k.factionId !== t.factionId || k.stake !== t.stake) c.powerOrStakeMoved++;
      if (k.reason !== t.reason) { c.reasonsDiffer++; byKey[ka] = (byKey[ka] || 0) + 1; }
    });
    if (has) { c.castsWithLosesOrSplit++; town = true; }
  });
  if (town) c.townsWithLosesOrSplit++;
}
// kinds that never hold a loses or split row anywhere in the pool (base)
const kindHas = {};
for (const [, x] of a) for (const e of x.entries || []) { kindHas[e.kind] ||= false; if ((e.cast?.stakes || []).some((k) => ['loses', 'split'].includes(stakeReasonKey(k.reason)))) kindHas[e.kind] = true; }
c.kindsWithout = Object.entries(kindHas).filter(([, v]) => !v).map(([k]) => k);
console.log(J({ ...c, reasonsDifferByKey: byKey, kindsSeen: Object.keys(kindHas).length }, null, 1));
for (const m of moved.slice(0, 30)) console.log('MOVED', m);
