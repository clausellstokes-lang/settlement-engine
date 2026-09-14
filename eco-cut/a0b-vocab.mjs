// $SC/kit/eco-cut/a0b-vocab.mjs <dock> [--dump] — the A0b arm over the projected state leaves WITH
// the ratified synonym vocabulary applied, the way prose-wave-gate.mjs applies it (vocabularyOf ->
// fieldSynonymsFor(row)). The walker test's own reading passes NO vocabulary; this is the other one.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const dock = process.argv[2];
const { armA0b } = await import(join(dock, 'src/domain/prose/composedWalker.js'));
const { fieldSynonymsFor } = await import(join(dock, 'src/domain/prose/fieldSynonyms.js'));
const { loadStateLeaves } = await import(join(dock, 'tests/helpers/dossierCorpus.js'));
const census = JSON.parse(readFileSync(join(dock, 'docs/content/wiring-census.json'), 'utf8'));
const censusByPool = new Map(census.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
const corpus = await loadStateLeaves();
const tally = { 'over-claim': 0, 'under-claim': 0, 'implicit-negation': 0 };
const pools = new Set(); let notExecutable = 0; const dump = [];
for (const entry of corpus) {
  const row = censusByPool.get(`${entry.block} :: ${entry.pool}`);
  const out = armA0b({
    id: `${entry.block} :: ${entry.pool}`, text: entry.text,
    reads: row ? row.reads : [], universe: row ? row.fieldsRead : [], predicate: row ? row.predicate : [],
    vocabulary: row ? fieldSynonymsFor(row) : {},
  });
  for (const f of out.fails) { tally[f.subject] += 1; pools.add(f.id); dump.push(`${f.subject}\t${f.id}\t${f.value}`); }
  notExecutable += out.notExecutable.length;
}
console.log(`variants ${corpus.length} · over-claims ${tally['over-claim']} · under-claims ${tally['under-claim']} · implicit negations ${tally['implicit-negation']} · NOT-EXECUTABLE ${notExecutable} · pools carrying a finding ${pools.size}`);
if (process.argv.includes('--dump')) for (const l of dump) console.log(l);
