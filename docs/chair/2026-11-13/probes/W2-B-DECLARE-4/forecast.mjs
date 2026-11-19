// F4 forecast. argv: <mine-root> <merged-root> <lane-name>. Prints one JSON line.
// For each banked row of MY registers (keyed by the whole literal), the merged tree's walker (my instrument) is
// asked: is the row still found? If not, the literal was edited/removed/declared there; each is classed.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const [mine, merged, lane] = process.argv.slice(2);
const shM = await import(join(mine, 'tests/lint/presumedThings.shared.mjs'));
const shX = await import(join(merged, 'tests/lint/presumedThings.shared.mjs'));
const rw = await import(join(merged, 'src/domain/facts/registeredWords.js'));
const ts = createRequire(join(mine, 'package.json'))('typescript');
const regs = ['tests/lint/presumedThings.register.json', 'tests/lint/presumedThings.widened.register.json'].map((r) => JSON.parse(readFileSync(join(mine, r), 'utf8')));
const hitsMine = shM.scanTree(mine);
const textByKey = new Map(hitsMine.map((h) => [shM.hitKey(h.file, h.thing, h.text), h.text]));
const hitsX = shX.scanTree(merged);
const foundX = new Set(hitsX.map((h) => shX.hitKey(h.file, h.thing, h.text)));
const freshX = hitsX.filter((h) => !regs.some((r) => shX.bankedKeys(r).has(shX.hitKey(h.file, h.thing, h.text))));
const banked = new Set(regs.flatMap((r) => [...shM.bankedKeys(r)]));
const literalsCache = new Map();
const literalsOf = (file) => {
  if (literalsCache.has(file)) return literalsCache.get(file);
  let src = ''; try { src = readFileSync(join(merged, file), 'utf8'); } catch { literalsCache.set(file, null); return null; }
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX); const out = [];
  const v = (n) => { if (ts.isJsxText(n)) out.push(n.text.replace(/\s+/g, ' ').trim()); else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) out.push(n.text); ts.forEachChild(n, v); };
  v(sf); literalsCache.set(file, out); return out;
};
const words = (x) => new Set(String(x).toLowerCase().match(/[a-z']+/g) || []);
const sim = (a, b) => { const A = words(a), B = words(b); let i = 0; for (const w of A) if (B.has(w)) i += 1; return i / Math.max(1, A.size + B.size - i); };
const names = (text, thing) => rw.sentencesOf(text).some((s) => [...rw.thingsNamedIn(s), ...rw.newWordsNamedIn(s), ...rw.thingsDeniedIn(s), ...rw.newWordsDeniedIn(s)].includes(thing));
const c = { lane, banked: banked.size, stillFound: 0, gone: 0, verbatimDeclared: 0, verbatimUnnamed: 0, fileGone: 0, removed: 0, editedFresh: 0, editedFreshOldKeyToo: 0, editedFreshNewKeyOnly: 0, editedDeclared: 0, editedWordGone: 0, otherFreshHits: 0, examples: [] };
const claimed = new Set();
for (const k of banked) {
  if (foundX.has(k)) { c.stillFound += 1; continue; }
  c.gone += 1;
  const [file, thing] = k.split('\t'); const X = textByKey.get(k);
  const lits = literalsOf(file);
  if (!lits) { c.fileGone += 1; continue; }
  if (lits.includes(X)) { if (names(X, thing)) c.verbatimDeclared += 1; else c.verbatimUnnamed += 1; continue; }
  let best = null; let bs = 0;
  for (const L of lits) { const s = sim(X, L); if (s > bs) { bs = s; best = L; } }
  if (!best || bs < 0.5) { c.removed += 1; continue; }
  const freshHit = freshX.find((h) => h.file === file && h.thing === thing && h.text === best);
  if (freshHit) {
    claimed.add(`${file}\t${thing}\t${best}`);
    c.editedFresh += 1;
    if (best.slice(0, 120) !== X.slice(0, 120)) c.editedFreshOldKeyToo += 1; else { c.editedFreshNewKeyOnly += 1; if (c.examples.length < 3) c.examples.push(`${file} :: ${thing} :: …${best.slice(110, 200)}`); }
  } else if (names(best, thing)) c.editedDeclared += 1; else c.editedWordGone += 1;
}
c.otherFreshHits = freshX.filter((h) => !claimed.has(`${h.file}\t${h.thing}\t${h.text}`)).length;
console.log(JSON.stringify(c));
