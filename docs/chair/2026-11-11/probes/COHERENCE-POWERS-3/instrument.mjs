// node instrument.mjs <tree> — a PROBE TREE's density law logs its plan and its fold into globalThis.__probe (never committed)
import fs from 'node:fs'; import path from 'node:path';
const f = path.join(process.argv[2], 'src/generators/density/applyDensityLaw.js');
let t = fs.readFileSync(f, 'utf8');
const a = 'const plan = planFor(input, { massOverride: input.massOverride ?? null });';
if (!t.includes(a)) throw new Error('no plan line');
t = t.replace(a, `${a}\n  if (globalThis.__probe) (globalThis.__probe.plans ||= []).push({ mass: input.massOverride ?? null, factionCount: plan.factionCount, namedMass: plan.namedMass, bonus: plan.bonusSeatTaken, roster: (input.powerStructure?.factions || []).map((x) => x.faction || x.name), gov: ((input.powerStructure?.factions || []).find((x) => x.isGoverning) || {}).faction || null });`);
const b = 'const { folded, dropped } = settleHouselessPowers(factions, institutions);';
if (t.includes(b)) t = t.replace(b, `${b}\n  if (globalThis.__probe) (globalThis.__probe.folds ||= []).push({ folded, dropped });`);
fs.writeFileSync(f, t); console.log('instrumented', f);
// the names each crisis pushes onto the roster, at the power step
const g = path.join(process.argv[2], 'src/generators/power/rulingStructure.js');
let u = fs.readFileSync(g, 'utf8');
const c = '  applyStressEventFactions(factions, hasStress, governingFaction, hasNobleInst, config, institutions, stressEntries || []);';
if (!u.includes(c)) throw new Error('no stress call');
u = u.replace(c, `  const __before = factions.map((x) => x.faction);\n${c}\n  if (globalThis.__probe) (globalThis.__probe.pushed ||= []).push({ stresses: stressTypes, names: factions.map((x) => x.faction).filter((n) => !__before.includes(n)) });`);
fs.writeFileSync(g, u); console.log('instrumented', g);
