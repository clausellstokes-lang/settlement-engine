// node qabs.mjs <tree> <fresh-list> <births.ndjson.gz>... : per fresh (thing, text): towns printing a sentence of it that names the thing, and those where the thing is ABSENT by the rule book's own reader
import fs from 'node:fs'; import zlib from 'node:zlib';
const [T, LIST, ...FILES] = process.argv.slice(2);
const { REGISTERED_WORDS, sentencesOf, thingsNamedIn, newWordsNamedIn } = await import(T + '/src/domain/facts/registeredWords.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js'); const { liveInstitutionNames } = await import(T + '/src/domain/facts/institutions.js');
const rows = fs.readFileSync(LIST, 'utf8').split('\n').filter((l) => l.startsWith('fresh\t')).map((l) => l.split('\t'));
const { createHash } = await import('node:crypto'); const h = (t) => createHash('sha256').update(String(t)).digest('hex').slice(0, 16);
// the full texts: find by hash in the files
const ts = (await import('module')).createRequire(T + '/package.json')('typescript');
const full = new Map();
for (const f of new Set(rows.map((r) => r[1]))) { const src = fs.readFileSync(T + '/' + f, 'utf8'); const sf = ts.createSourceFile(f, src, 99, true, 2);
  const v = (n) => { if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) full.set(f + '\t' + h(n.text), n.text); ts.forEachChild(n, v); }; v(sf); }
const targets = rows.map((r) => { const text = full.get(r[1] + '\t' + r[3]); const sents = sentencesOf(text || '').filter((s) => [...thingsNamedIn(s), ...newWordsNamedIn(s)].includes(r[2]));
  return { file: r[1], thing: r[2], hash: r[3], text, sents: sents.map((s) => s.replace(/\{[a-z_]+\}/g, '\u0000').split('\u0000').sort((a, b) => b.length - a.length)[0].trim()), printed: new Set(), absent: [] }; });
const leaves = (v, out) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) for (const x of v) leaves(x, out); else if (v && typeof v === 'object') for (const x of Object.values(v)) leaves(x, out); return out; };
for (const F of FILES) for (const l of zlib.gunzipSync(fs.readFileSync(F)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const blob = leaves(s, []).join('\n'); let facts = null, names = null;
  for (const t of targets) { if (!t.sents.length || !t.sents.some((x) => x && blob.includes(x))) continue; t.printed.add(seed);
    facts ??= factsOf(s); names ??= liveInstitutionNames(s); const w = REGISTERED_WORDS[t.thing]; let a; try { a = w.absent(facts, names, s); } catch (e) { a = 'ERR ' + e.message; }
    if (a) t.absent.push(seed + (a === true ? '' : ':' + a)); } }
for (const t of targets) console.log(`${t.file.replace('src/data/', '')}\t${t.thing}\t${t.hash}\tprinted ${t.printed.size}\tABSENT ${t.absent.length}\t${t.absent.slice(0, 4).join(',')}\t${(t.text || 'NOTEXT').slice(0, 70)}${t.sents.length ? '' : ' [no sentence names it]'}`);
