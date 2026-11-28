// RANGE-MEASURE (E): what the declaration rules cost a writer, per key: how many of its lines name a THING
// (`facts/registeredWords.js :: thingsNamedIn`, the presumed-things walker's matcher) or hold a PRESUMPTION CLASS word
// (`tests/lint/presumptionClasses.shared.mjs :: classesOf`): each such line needs a declared atom (or a rule's exemption);
// a line with neither can be added freely, as far as these two walkers go. Also the byte leaf the key lives in.
// node cost.mjs <tree> <keys.json> <E-keys.json: [{ki, demo?: [lines]}]> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [TREE, KEYS, EK, OUT] = process.argv.slice(2);
const { keys } = JSON.parse(readFileSync(KEYS, 'utf8'));
const w = await import(join(TREE, 'src/domain/facts/registeredWords.js'));
const c = await import(join(TREE, 'tests/lint/presumptionClasses.shared.mjs'));
const bytes = JSON.parse(readFileSync(join(TREE, 'scripts/.prose-byte-baseline.json'), 'utf8')).leaves;
const need = (t) => { const s = t.replace(/\{[^}]*\}/g, 'X'); return { things: [...w.thingsNamedIn(s)], classes: c.classesOf(s) }; };
const out = JSON.parse(readFileSync(EK, 'utf8')).map((e) => {
  const k = keys[e.ki];
  const lines = k.lines.map((l) => ({ t: l.text, ...need(l.text), declared: (l.decl || []).some((d) => ['needs', 'excludes', 'marks', 'crisis'].includes(d)) }));
  const demo = (e.demo || []).map((t) => ({ t, ...need(t) }));
  const leaf = bytes[k.file];
  return { ki: e.ki, key: k.key, lines: lines.length, needAtom: lines.filter((l) => l.things.length || l.classes.length).length, declared: lines.filter((l) => l.declared).length,
    generated: /\.generated\.js$/.test(k.file), leaf: leaf ? { raw: leaf.raw, ceilingRaw: leaf.ceilingRaw, headroom: leaf.ceilingRaw - leaf.raw } : null, demo };
});
writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const o of out) console.log(`${o.key.slice(0, 90)}\tlines ${o.lines}\tneed an atom ${o.needAtom}\tdeclared ${o.declared}\t${o.generated ? 'generated' : ''}\t${o.leaf ? `headroom ${o.leaf.headroom}` : ''}\tdemo needing an atom ${o.demo.filter((d) => d.things.length || d.classes.length).length}/${o.demo.length}`);
