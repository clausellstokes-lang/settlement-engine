// D-PR-r3 probe (5): PR-V3's fork trigger, and the refinement that gates it on EFFECT
// (the riders the posture adds beyond the default share), so two towns fielding the same riders never differ in grievance.
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const courts = [
  { name: 'bold', a: 1, h: 0 }, { name: 'median', a: 0.5, h: 0 }, { name: 'wary', a: 0, h: 0 },
  { name: 'lawful-cruel', a: 0.5, h: 1 }, { name: 'wary+harsh', a: 0.25, h: 0.5 },
];
const PS0 = 0.6, W = 0.10;
let forkRows = 0, forkZeroExcess = 0, refinedRows = 0;
const lines = [];
for (const c of courts) {
  const ps = clamp(PS0 + 0.4 * (0.5 - c.a) + 0.2 * c.h, 0.4, 1.0);
  for (let max = 1; max <= 12; max++) {
    const fielded = Math.ceil(max * ps), dflt = Math.ceil(max * PS0), excess = fielded - dflt;
    const fork = ps > PS0; if (fork) forkRows++; if (fork && excess <= 0) forkZeroExcess++;
    const input = fork && excess > 0 ? W * clamp(excess / (max - dflt), 0, 1) : 0; if (input > 0) refinedRows++;
    if (fork) lines.push(`${c.name.padEnd(13)} ps=${ps.toFixed(2)} max=${String(max).padStart(2)} fielded=${String(fielded).padStart(2)} default=${String(dflt).padStart(2)} excess=${excess} input=${input.toFixed(3)}`);
  }
}
console.log(lines.filter((l) => l.startsWith('wary ')).join('\n'));
console.log(`fork rows=${forkRows} · fork rows with ZERO riders beyond the default (same riders as a median court; the bare fork would grieve them)=${forkZeroExcess} · rows the refined input fires=${refinedRows} · every bold/median row=0 (no fork)`);
