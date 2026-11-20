/**
 * tests/generators/power/powerLinesVoiced.test.js — PEOPLE-2 builder B2 (2026-11-20): the powers' descriptions and the
 * relations between them, voiced (`src/data/powerLineVariants.js :: voicePowerLines`, called once on the final record by
 * `generateSettlementPipeline.js`; the chair's verdict of 17:21 UTC on PEOPLE-1 seat M4's proposals).
 *
 * THE SAMPLE is the chair's instrument's: 150 places a size, seeds `hxd-<size>-0..149`, born through the real pipeline
 * (`birthConfig({ ...DEFAULT_CONFIG, settType })`, `customContent: {}`), the place's own names masked to `#` and digits to
 * `0`. THE UNIT is the sentence as printed, over ALL places of the size (the verdict's item 3): a description's OPENING
 * wording is cut into its sentences; a relation narrative is counted whole (the unit PEOPLE-2 seat M6 measured the verdict
 * by: every wording of a branch keeps its branch's own closing claim, "Each needs the other.", "Each props up the other.").
 *
 * 1. THE BAR: no POOLED opening sentence, no POOLED coda sentence (the chair's ruling of 18:14 UTC: the second tranche is
 *    in this unit) and no POOLED relation narrative prints in more than 20% of a size's places (the verdict: about 15%, a
 *    top to 20% passes as sampling). Not pooled, so not counted here: the occupier's row ("<the seat> carries out what
 *    <the occupier> decides."), the capture rows (`captureState`), the conflict twins (the quarrel named), every opening
 *    and coda no pool voices (worthBuying's two wordings are left out). A NAMED SURVIVOR (18:14): the four standings that
 *    stand in 83-96% of metropolises (the arcane orders under the clergy, the force beside the clergy, a third power at
 *    the table, the clergy ahead of the arcane orders) are the roster's sameness, the dark laws' to cure; a coda sentence
 *    over the bar is listed against them, never hidden.
 * 2. A SEEDLESS record: the pass changes no byte where today's line is eligible; where it is not (closingGap, eligible
 *    nowhere; a tie on arcaneInShadow or noblesAhead), the record takes the first eligible wording (18:14).
 * 3. Every printed wording: its `needs` hold and its `excludes` do not, read the declared draw's way (`declarationAdmits`
 *    over `factsOf`), and every note the pass leaves in the presumption ledger was admitted as drawn; the village priest's
 *    line never prints where the `priest` atom is false; closingGap's line never prints; on a tie (the branch's own
 *    computed `level`, `factionStanding.js :: standingLevelOf`) arcaneInShadow's line and its wordings 2 and 3, and
 *    noblesAhead's line, never print; no struck clause appears in any new wording.
 * 4. THE HIDEABLE RULE: no wording needs a house `cardVeil.js :: isHideableHouse` marks, nor a fact about crime.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf, parseAtom, atomHolds } from '../../../src/domain/facts/factVocabulary.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { isHideableHouse } from '../../../src/domain/people/cardVeil.js';
import { institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import { standingLevelOf } from '../../../src/generators/power/factionStanding.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const BAR = 0.2;
const PRIEST_LINE = 'The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.';
const CLOSING_GAP = 'The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down.';
/** the named survivor (the chair, 18:14): the metropolis's four standings, by the coda that says each */
const SURVIVOR_CODAS = new Set(['arcaneInShadow', 'bodiesMinds', 'atTable', 'clergyAhead']);
const STRUCK = ['quietly resented', 'neither likes it', 'resent it', 'on purpose', 'by choice', 'worth having', 'know it', 'catching up', 'closing on'];
const CRIME_WORDS = /crim|thie|smuggl|black market|gang|outlaw|rings|crime/i;

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const maskerOf = (names) => {
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
  return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
};
const sentencesOf = (s) => String(s).match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) || [String(s).trim()];
/** a wording's template as a pattern: `{…}` a power's name or a verb, `$n` a coda's carried words */
const patternOf = (text, anchored) => new RegExp(`${anchored ? '^' : ''}${esc(text).replace(/\\\{[^}]*\\\}/g, '.+?').replace(/\\\$\d/g, '.+?')}${anchored ? '$' : ''}`, 'i');

/** @type {any} */ let V;
/** @type {Record<string, any>} */ const SAMPLE = {};

beforeAll(async () => {
  V = await import('../../../src/data/powerLineVariants.js');
  await loadGenerationLawPayloads();
  const relationPatterns = Object.entries(V.RELATION_POOLS).flatMap(([branch, rows]) => rows.map((row) => ({ branch, row, re: patternOf(row.text, true) })));
  const codaPatterns = V.CODA_POOLS.flatMap((c) => c.rows.map((row) => ({ coda: c.id, row, re: patternOf(row.text, false) })));
  for (const size of SIZES) {
    const openings = new Map(); const codas = new Map(); const relations = new Map();
    const misses = []; const ledgerMisses = []; const priestMisses = []; const truthMisses = []; const codaOf = new Map();
    let ledgerNotes = 0; let voicedPlaces = 0;
    const add = (m, s, i) => { let st = m.get(s); if (!st) { st = new Set(); m.set(s, st); } st.add(i); };
    for (let i = 0; i < N; i++) {
      const seed = `hxd-${size}-${i}`;
      const { result: t, ledger } = withPresumptionLedger(() => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
      for (const e of ledger) {
        if (!String(e.pool).startsWith('powerLineVariants:')) continue;
        ledgerNotes++;
        if (e.resolvedBy !== 'drawn') ledgerMisses.push(`${seed} ${e.pool} ${e.lineId} ${e.resolvedBy}`);
      }
      const names = new Set();
      const addName = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
      addName(t.name);
      for (const p of t.npcs || []) { addName(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) addName(w); }
      for (const f of t.powerStructure?.factions || []) { addName(f.name); addName(f.faction); }
      const mask = maskerOf(names);
      const facts = factsOf(t);
      const admits = (row) => declarationAdmits(declarationOf(row), facts).admitted;
      let voiced = false;
      for (const f of t.powerStructure?.factions || []) {
        const desc = typeof f.desc === 'string' ? f.desc : '';
        if (desc.startsWith(PRIEST_LINE) && atomHolds('priest', facts) !== true) priestMisses.push(`${seed} ${f.faction}`);
        for (const [open, pool] of Object.entries(V.DESC_POOLS)) {
          const printed = [{ text: open, needs: pool.todayNeeds }, ...pool.rows].find((w) => desc === w.text || desc.startsWith(`${w.text} `));
          if (!printed) continue;
          if (printed.text !== open) voiced = true;
          if (!admits(printed)) misses.push(`${seed} opening ${printed.id ?? '(today)'}`);
          for (const s of sentencesOf(printed.text)) add(openings, mask(s), i);
        }
        if (desc.includes(CLOSING_GAP)) truthMisses.push(`${seed} ${f.faction} closingGap today`);
        for (const c of V.CODA_POOLS) {
          if (!c.rows.length) continue;
          const m = c.re.exec(desc);
          if (!m) continue;
          if (c.today === 'excludesLevel' && standingLevelOf(t.powerStructure.factions, f, c.id)) truthMisses.push(`${seed} ${f.faction} ${c.id} today at a tie`);
          for (const s of sentencesOf(m[0])) { add(codas, mask(s), i); codaOf.set(mask(s), c.id); }
        }
        for (const { coda, row, re } of codaPatterns) {
          const m = re.exec(desc);
          if (!m) continue;
          voiced = true;
          if (!admits(row)) misses.push(`${seed} coda ${row.id}`);
          if (row.excludesLevel && standingLevelOf(t.powerStructure.factions, f, coda)) truthMisses.push(`${seed} ${f.faction} ${row.id} at a tie`);
          for (const s of sentencesOf(m[0])) { add(codas, mask(s), i); codaOf.set(mask(s), coda); }
        }
      }
      for (const row of t.powerStructure?.factionRelationships || []) {
        const n = typeof row.narrative === 'string' ? row.narrative : '';
        const today = V.relationBranchOf(row);
        const hits = relationPatterns.filter((p) => p.re.test(n));
        if (!today && !hits.length) continue;
        if (hits.length) {
          voiced = true;
          if (!hits.some((h) => admits(h.row))) misses.push(`${seed} relation ${hits.map((h) => h.row.id).join('/')}`);
        }
        add(relations, mask(n), i);
      }
      if (voiced) voicedPlaces++;
    }
    const top = (m) => { let best = ''; let k = 0; for (const [s, st] of m) if (st.size > k) { k = st.size; best = s; } return { share: k / N, count: k, sentence: best }; };
    const over = (m) => [...m].filter(([, st]) => st.size / N > BAR).map(([s, st]) => `${st.size}/${N} ${s}`);
    SAMPLE[size] = {
      openings: top(openings), codas: top(codas), relations: top(relations),
      overOpenings: over(openings), overRelations: over(relations),
      overCodas: [...codas].filter(([sentence, st]) => st.size / N > BAR && !(size === 'metropolis' && SURVIVOR_CODAS.has(codaOf.get(sentence)))).map(([sentence, st]) => `${st.size}/${N} ${sentence}`),
      survivors: [...codas].filter(([sentence, st]) => st.size / N > BAR && size === 'metropolis' && SURVIVOR_CODAS.has(codaOf.get(sentence))).map(([sentence, st]) => `${st.size}/${N} ${sentence}`),
      codasOverHalf: [...codas].filter(([, st]) => st.size / N > 0.5).map(([s, st]) => `${st.size}/${N} ${s}`),
      misses, ledgerMisses, priestMisses, truthMisses, ledgerNotes, voicedPlaces,
    };
    // the codas are measured, not pinned: printed for the hand-back
    if (SAMPLE[size].survivors.length) console.log(`B2 ${size}: the named survivor over the bar: ${SAMPLE[size].survivors.join(' | ')}`);
    console.log(`B2 ${size}: opening top ${SAMPLE[size].openings.count}/${N} · coda top ${SAMPLE[size].codas.count}/${N} | ${SAMPLE[size].codas.sentence} · relation top ${SAMPLE[size].relations.count}/${N} · places voiced ${voicedPlaces}/${N}`);
  }
}, 1_200_000);

describe('the bar, by the sentence, over 150 places a size (the verdict\'s item 3)', () => {
  for (const size of SIZES) {
    it(`${size}: no pooled opening sentence, coda sentence or relation narrative prints in more than 20% of places`, () => {
      expect(SAMPLE[size].overOpenings).toEqual([]);
      expect(SAMPLE[size].overCodas).toEqual([]);
      expect(SAMPLE[size].overRelations).toEqual([]);
    });
  }
});

describe('every printed wording holds its declaration (through the declared draw)', () => {
  it('each new wording printed: its needs hold and its excludes do not', () => {
    expect(SIZES.flatMap((s) => SAMPLE[s].misses)).toEqual([]);
  });
  it('every note the pass leaves in the presumption ledger was admitted as drawn', () => {
    expect(SIZES.reduce((a, s) => a + SAMPLE[s].ledgerNotes, 0)).toBeGreaterThan(1000);
    expect(SIZES.flatMap((s) => SAMPLE[s].ledgerMisses)).toEqual([]);
  });
  it('the village priest\'s line never prints where the record holds no priest', () => {
    expect(SIZES.flatMap((s) => SAMPLE[s].priestMisses)).toEqual([]);
  });
  it('closingGap\'s line never prints, and on a tie arcaneInShadow\'s line and its wordings 2 and 3, and noblesAhead\'s line, never print', () => {
    expect(SIZES.flatMap((s) => SAMPLE[s].truthMisses)).toEqual([]);
  });
  it('the pass voices lines at every size that prints a pooled line', () => {
    for (const s of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) expect(SAMPLE[s].voicedPlaces).toBeGreaterThan(N / 2);
  });
});

describe('the wordings themselves', () => {
  const all = () => [
    ...Object.values(V.DESC_POOLS).flatMap((p) => p.rows),
    ...V.CODA_POOLS.flatMap((c) => c.rows),
    ...Object.values(V.RELATION_POOLS).flat(),
  ];
  it('no struck clause appears in any new wording', () => {
    expect(all().filter((r) => STRUCK.some((w) => r.text.toLowerCase().includes(w))).map((r) => r.id)).toEqual([]);
  });
  it('the census declaration (docs/census/declarations/powerLineVariants.json) holds every wording, one row each, as the data file declares it', () => {
    const ledger = JSON.parse(readFileSync(new URL('../../../docs/census/declarations/powerLineVariants.json', import.meta.url), 'utf8'));
    const shape = (r) => ({ id: r.id, text: r.text, needs: [...(r.needs || [])], excludes: [...(r.excludes || [])], excludesLevel: r.excludesLevel === true });
    expect(ledger.rows.map(shape)).toEqual(all().map(shape));
  });
  it('every atom a wording declares is the vocabulary\'s', () => {
    expect(all().flatMap((r) => [...(r.needs || []), ...(r.excludes || [])]).filter((a) => !parseAtom(a))).toEqual([]);
  });
  it('the cast regen\'s vote matcher knows every vote wording: each keeps "who keeps the profit"', () => {
    for (const r of [...V.RELATION_POOLS['MC.vote'], ...V.RELATION_POOLS['MC.vote-against']]) expect(r.text).toMatch(/ who keeps the profit\b/);
  });
  it('THE HIDEABLE RULE: no wording needs a house isHideableHouse marks, nor a fact about crime', () => {
    const needs = [...new Set(all().flatMap((r) => r.needs || []))];
    expect(needs.filter((a) => CRIME_WORDS.test(a))).toEqual([]);
    /** every house of the catalogue the veil hides */
    const hideable = [];
    for (const cats of Object.values(institutionalCatalog)) for (const [category, insts] of Object.entries(cats)) for (const [name, v] of Object.entries(insts)) {
      const inst = { name, category, ...v };
      if (isHideableHouse(inst) && !hideable.some((h) => h.name === name)) hideable.push(inst);
    }
    expect(hideable.length).toBeGreaterThan(10);
    const flips = [];
    for (const tier of SIZES) {
      const base = factsOf({ tier, population: 5000, institutions: [] });
      const veiled = factsOf({ tier, population: 5000, institutions: hideable.map((h) => ({ name: h.name, category: h.category })) });
      for (const a of needs) if (atomHolds(a, veiled) === true && atomHolds(a, base) !== true) flips.push(`${tier}: ${a}`);
    }
    expect(flips).toEqual([]);
  });
});

describe('a seedless record', () => {
  const born = () => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'metropolis' }), null, { seed: 'hxd-metropolis-3', customContent: {} });
  it('where today\'s line is eligible the pass changes no byte; the same record with its seed is voiced', () => {
    const t = born();
    // put today's lines back: a pooled opening, a coda and a relation as their writers printed them
    const ps = t.powerStructure;
    const opens = Object.keys(V.DESC_POOLS);
    ps.factions[0].desc = `${opens.find((o) => o.startsWith('Clergy are present'))} They are always at the table, but cannot set their own terms.`;
    const pair = ps.factionRelationships[0].pair;
    Object.assign(ps.factionRelationships[0], { type: 'subordinate', narrative: `The ${pair[1]} carries out what the ${pair[0]} decides.` });
    for (const seedless of ['', null, undefined, 0]) {
      const rec = structuredClone({ ...t, _seed: seedless });
      const before = JSON.stringify(rec);
      expect(V.voicePowerLines(rec)).toBe(rec);
      expect(JSON.stringify(rec)).toBe(before);
    }
    expect(V.voicePowerLines(null)).toBe(null);
    const seeded = structuredClone(t);
    const before = JSON.stringify(seeded);
    V.voicePowerLines(seeded, standingLevelOf);
    expect(JSON.stringify(seeded)).not.toBe(before);
  });
  it('where today\'s line is not eligible (closingGap; a tie) a seedless record takes the first eligible wording', () => {
    const rec = { _seed: '', tier: 'city', population: 9000, institutions: [{ name: 'Parish church', category: 'Religious' }], powerStructure: { factions: [
      { faction: 'Merchant Guilds', power: 30, desc: 'Merchants.' },
      { faction: 'Noble Families', power: 25, desc: `Old families. ${CLOSING_GAP}` },
      { faction: 'Religious Authorities', power: 20, desc: "Clergy. The arcane orders are present but operate in the clergy's shadow. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved." },
      { faction: 'Arcane Orders', power: 20, desc: 'Mages.' },
    ], factionRelationships: [] } };
    V.voicePowerLines(rec, standingLevelOf);
    // the first eligible: the pool's first wording the record admits and the tie does not refuse
    const facts = factsOf(rec);
    const first = (id, level) => V.CODA_POOLS.find((c) => c.id === id).rows.find((r) => declarationAdmits(declarationOf(r), facts).admitted && !(level && r.excludesLevel)).text;
    const closing = first('closingGap', false);
    const arcane = first('arcaneInShadow', true);
    expect(rec.powerStructure.factions[1].desc).toBe(`Old families. ${closing}`);
    expect(rec.powerStructure.factions[2].desc).toBe(`Clergy. ${arcane}`);
    // not level: today's line stays for a seedless record
    rec.powerStructure.factions[3].power = 15;
    rec.powerStructure.factions[2].desc = "Clergy. The arcane orders are present but operate in the clergy's shadow. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved.";
    V.voicePowerLines(rec, standingLevelOf);
    expect(rec.powerStructure.factions[2].desc).toMatch(/operate in the clergy's shadow/);
  });
});
