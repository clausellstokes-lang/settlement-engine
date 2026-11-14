import { execFileSync } from 'node:child_process';
const keys = (rev, f) => { try { const r = JSON.parse(execFileSync('git', ['show', `${rev}:${f}`], { maxBuffer: 1 << 28 })); return new Set(Object.entries(r.arm1).flatMap(([p, rs]) => rs.map((x) => `${p}\t${x[0]}\t${x[2]}`))); } catch { return new Set(); } };
for (const b of process.argv.slice(2)) {
  const mb = execFileSync('git', ['merge-base', 'HEAD', `origin/lane/${b}`]).toString().trim();
  for (const f of ['tests/lint/presumedThings.register.json', 'tests/lint/presumedThings.widened.register.json']) {
    const a = keys(mb, f); const t = keys(`origin/lane/${b}`, f);
    const rm = [...a].filter((x) => !t.has(x)).length; const ad = [...t].filter((x) => !a.has(x)).length;
    if (rm || ad) console.log(`${b}\t${f.split('/').pop()}\tbase ${a.size}\ttip ${t.size}\tremoved ${rm}\tadded ${ad}`);
  }
}
