#!/usr/bin/env node
/**
 * TAIL-CLOSE-PRESUMED-1's MEASURE (the chair's ruling PT1 of 2026-11-15, case (B)): for every FRESH arm-1 hit of the
 * presumed-things walker (`tests/lint/presumedThings.shared.mjs :: scanTree`, less both registers' banked keys), the
 * towns where its line PRINTS and, of those, the towns where its thing is AGAINST it (absent for a naming line, present
 * for a denying one), over 1,080 births: the walker's own 360 (`corpusSeeds`, `corpusConfig`) and the page census's 720
 * (`tests/components/pageCensusWalk.shared.mjs :: censusPlan('r2')`, born as `scripts/census/page-census.mjs` births
 * them: `configOf(row, DEFAULT_CONFIG, birthConfig)`, then the public prose composed onto the record).
 *
 * A record is read as the walker's arm 2 reads one: every printed leaf (`isPrinted`; a licensed row is not read on the
 * naming side; a leaf under 15 characters, or under 20 on the naming side, is not read), split by `sentencesOf`. A line
 * PRINTS in a leaf when every static fragment of its literal (its text less `{token}` / `${…}` / `%s` holes, fragments of
 * 8 characters or more; the longest alone where none is) stands in that leaf, case and white space folded. The thing is
 * read in the printed SENTENCES of that leaf that carry a fragment, by the registered word's OWN reader
 * (`REGISTERED_WORDS[id].absent(factsOf(record), liveInstitutionNames(record), record, sentence)`; a denial of a thing by
 * `presentForDenial`), and only where the printed sentence still uses the word (named, or denied, in the matcher's
 * reading). Each word's `leaf` says which reading that is (a factsOf reader, the live roster, the record's config).
 *
 * Also, per fresh hit: whether its literal stood in its file at --base (default origin/master), folded as the door's
 * --bank folds it (case (A) vs (B) of PT1).
 *
 * Usage (run from the tree root): node docs/chair/2026-11-15/probes/TAIL-CLOSE-PRESUMED-1/measure-fresh-rows.mjs
 *   [--base <rev>] [--out <file.json>] [--limit <n>] [--landing <seed>] [--rows <earlier measure.json>]   (writes nothing in the tree unless --out points into it)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { register } from 'node:module';

import {
  REGISTER_REL, WIDENED_REGISTER_REL, bankedKeys, corpusConfig, corpusSeeds, hitKey, isLicensed, isPrinted, literalHash, scanTree,
} from '../../../../../tests/lint/presumedThings.shared.mjs';
import {
  REGISTERED_WORDS, THINGS, newWordsDeniedIn, newWordsNamedIn, presentForDenial, sentencesOf, thingsDeniedIn, thingsNamedIn,
} from '../../../../../src/domain/facts/registeredWords.js';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const opt = (name, dflt) => (args.includes(name) ? args[args.indexOf(name) + 1] : dflt);
const BASE = opt('--base', 'origin/master');
const OUT = opt('--out', null);
const LIMIT = Number(opt('--limit', '0')) || 0;
// --landing <seed>: ALSO read the landing fixture's own town (src/components/home/landingFixture.js is FROZEN engine output of
// this seed: scripts/generate-landing-fixture.mjs :: buildRegion, advanceRegion), as born and after its weeks: two more records,
// counted apart from the 1,080 (corpus 'landing')
const LANDING = opt('--landing', null);

// ── the fresh hits ───────────────────────────────────────────────────────────────────────────────
const main = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
const reg = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));
const banked = new Set([...bankedKeys(main), ...bankedKeys(reg)]);
// --rows <measure.json>: re-measure the rows of an earlier measure (banked since), not the fresh hits
const ROWS = opt('--rows', null);
const fresh = ROWS
  ? JSON.parse(readFileSync(ROWS, 'utf8')).rows.map((r) => ({ file: r.file, thing: r.thing, text: r.text }))
  : scanTree(ROOT).filter((h) => !banked.has(hitKey(h.file, h.thing, h.text)));
process.stderr.write(`fresh ${fresh.length}\n`);

// ── case (A) or (B): did the literal stand in its file at the base (the door's own fold) ────────────
const fold = (x) => x.replace(/\\[nrt]/g, ' ').replace(/\\(.)/g, '$1').replace(/\s+/g, ' ');
const atBase = new Map();
const srcAt = (file) => {
  if (!atBase.has(file)) { try { atBase.set(file, execFileSync('git', ['show', `${BASE}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 28 })); } catch { atBase.set(file, ''); } }
  return atBase.get(file);
};
const stoodAtBase = (h) => fold(srcAt(h.file)).includes(fold(h.text).trim().slice(0, 60));
/** the WHOLE literal stood at the base (the door's test reads its first 60 characters: a line reworded past them is the round's) */
const wholeAtBase = (h) => fold(srcAt(h.file)).includes(fold(h.text).trim());

// ── the line's static fragments and its side ───────────────────────────────────────────────────────
const norm = (s) => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
const fragmentsOf = (text) => {
  const parts = String(text).split(/\$\{[^}]*\}|\{[^{}]*\}|%s|\[[A-Z_]+\]/).map((p) => norm(p).trim()).filter(Boolean);
  const long = parts.filter((p) => p.length >= 8);
  if (long.length) return long;
  const best = parts.sort((a, b) => b.length - a.length)[0];
  return best ? [best] : [];
};
const sideOf = (h) => {
  const sents = sentencesOf(h.text);
  const names = sents.some((s) => [...thingsNamedIn(s), ...newWordsNamedIn(s)].includes(h.thing));
  return names ? 'names' : 'denies';
};
const usesHere = (thing, side, sentence) => (side === 'names'
  ? [...thingsNamedIn(sentence), ...newWordsNamedIn(sentence)].includes(thing)
  : [...thingsDeniedIn(sentence), ...newWordsDeniedIn(sentence)].includes(thing));
/** is the thing AGAINST the line in this town? naming: absent; denying: present */
const against = (thing, side, facts, names, record, sentence) => {
  const w = REGISTERED_WORDS[thing];
  if (side === 'names') return !!w.absent(facts, names, record, sentence);
  return Object.hasOwn(THINGS, thing) ? presentForDenial(thing, facts, names) : !w.absent(facts, names, record, sentence);
};

const rows = fresh.map((h) => ({
  file: h.file, thing: h.thing, text: h.text, hash: literalHash(h.text), side: sideOf(h), atBase: stoodAtBase(h), wholeAtBase: wholeAtBase(h),
  frags: fragmentsOf(h.text), leaf: REGISTERED_WORDS[h.thing]?.leaf || 'factsOf (the thing\'s own reader)',
  printed: 0, againstN: 0, printedSeeds: [], againstSeeds: [], paths: new Set(), samples: [],
}));

register('./jsx-hooks.mjs', import.meta.url);

// ── the births ───────────────────────────────────────────────────────────────────────────────────
const { generateSettlementPipeline } = await import('../../../../../src/generators/generateSettlementPipeline.js');
const { factsOf } = await import('../../../../../src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import('../../../../../src/domain/facts/institutions.js');
const { censusPlan, configOf } = await import('../../../../../tests/components/pageCensusWalk.shared.mjs');
const { birthConfig, loadGenerationLawPayloads } = await import('../../../../../src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import('../../../../../src/store/configSlice.js');
const { withPublicProse } = await import('../../../../../src/domain/display/publicProse.js');
const { composePublicProse } = await import('../../../../../src/components/new/publicProseCompose.js');
await loadGenerationLawPayloads();

const births = [
  ...corpusSeeds().map(({ tier, seed }) => ({ corpus: 'walker', seed, make: () => generateSettlementPipeline({ ...corpusConfig(tier) }, null, { seed, customContent: {} }) })),
  ...censusPlan('r2').map((row) => ({ corpus: 'census', seed: row.seed, make: () => {
    const town = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    return withPublicProse(town, composePublicProse(town));
  } })),
].slice(0, LIMIT || undefined);
if (LANDING) {
  const { buildRegion, advanceRegion } = await import('../../../../../scripts/generate-landing-fixture.mjs');
  const region = buildRegion(LANDING);
  // the PRINTED strings are the frozen fixture's own (the landing page prints them); the facts are its town's, as born and
  // after its weeks (the town the fixture was frozen from)
  const { fixture } = await import('../../../../../src/components/home/landingFixture.js');
  births.push({ corpus: 'landing', seed: `${LANDING} (the fixture, facts as born)`, print: fixture, make: () => region.town });
  births.push({ corpus: 'landing', seed: `${LANDING} (the fixture, facts after its weeks)`, print: fixture, make: () => advanceRegion(LANDING, region.saves, region.edges).saves[0].settlement });
}

/** @param {unknown} v @param {string} p @param {Array<[string, string]>} out */
function leaves(v, p, out) {
  if (typeof v === 'string') out.push([p, v]);
  else if (Array.isArray(v)) for (const x of v) leaves(x, `${p}[]`, out);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, `${p}.${k}`, out);
  return out;
}

let n = 0;
for (const b of births) {
  const record = b.make();
  const facts = factsOf(record);
  const names = liveInstitutionNames(record);
  const ls = leaves(b.print ?? record, '', []).filter(([p, t]) => t.length >= 15 && isPrinted(p)).map(([p, t]) => [p, t, norm(t)]);
  for (const r of rows) {
    let printedHere = false; let againstHere = false;
    for (const [path, text, low] of ls) {
      if (!r.frags.length || !r.frags.every((f) => low.includes(f))) continue;
      if (r.side === 'names' && (isLicensed(path) || text.length < 20)) continue;
      // a sentence of the line: it holds a fragment, or a fragment holds it (a literal of two sentences or more is one fragment
      // that spans them; the first measure missed this and read such a line's sentences as none: corrected 2026-11-15)
      const sents = sentencesOf(text).filter((s) => { const ns = norm(s).trim(); return ns.length >= 8 && r.frags.some((f) => ns.includes(f) || f.includes(ns)); });
      const live = sents.filter((s) => usesHere(r.thing, r.side, s));
      printedHere = true; r.paths.add(path);
      for (const s of live) if (against(r.thing, r.side, facts, names, record, s)) {
        againstHere = true;
        if (r.samples.length < 3) r.samples.push({ seed: b.seed, path, sentence: s.slice(0, 220) });
      }
    }
    if (printedHere) { r.printed += 1; if (r.printedSeeds.length < 3) r.printedSeeds.push(b.seed); }
    if (againstHere) { r.againstN += 1; if (r.againstSeeds.length < 3) r.againstSeeds.push(b.seed); }
  }
  n += 1;
  if (n % 60 === 0) process.stderr.write(`${n}/${births.length}\n`);
}

const result = {
  measuredAt: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), base: BASE, births: births.length,
  rows: rows.map((r) => ({ ...r, paths: [...r.paths].slice(0, 6), verdict: r.printed === 0 ? 'close-unprinted' : r.againstN === 0 ? 'close-true' : 'close-false' })),
};
const json = JSON.stringify(result, null, 1);
if (OUT) writeFileSync(OUT, `${json}\n`); else process.stdout.write(`${json}\n`);
const tally = {};
for (const r of result.rows) tally[r.verdict] = (tally[r.verdict] || 0) + 1;
process.stderr.write(`births ${births.length} · ${JSON.stringify(tally)} · at base (first 60) ${result.rows.filter((r) => r.atBase).length} · whole at base ${result.rows.filter((r) => r.wholeAtBase).length}\n`);
