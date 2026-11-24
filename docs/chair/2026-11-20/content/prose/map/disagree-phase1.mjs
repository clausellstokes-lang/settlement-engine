// DISAGREE PHASE 1 (PROSE-6's builder; the brief at f86828e02): the measure on the UNCURED tree, read-only.
// Run: TREE=<tree> node docs/chair/2026-11-20/content/prose/map/disagree-phase1.mjs [N=150]  (N births a size, seeds dz-<size>-<i>)
// Every fact is read through its own reader: the pool keys through the desk's own key functions
// (defenseStateProse.js :: economicRowPoolKey, foodTradesPoolKey), eligibility through the kernel's own
// eligibleVariants with the desk's own entry answers (wallsAnswered, crisisAnswered, factsAnswered),
// pay through guardPay.js, stores through the vocabulary's atomHolds, the veil through cardVeil.js.
// THE NEW LINES are not yet in the tree: they are put at the END of their pools here as variants with the
// next vids and the marks of DISAGREE-LINES.md, and the kernel says which of them this record admits.
// WHICH GEN-17 VARIANT PRINTED: each variant's text (and any wordings) of the generated leaf, made a template
// (regex-escaped; each {slot} a lazy wildcard; "the town" any one word after "the", for the tier noun;
// first letter either case; final stop dropped), searched in every mount text of buildPrintProse(s, {}).
// The page may print a line CUT at a clause ("The town pays wages for its defense as well as keeping its walls."
// on dz-town-2), so each template also matches as each of its clause prefixes (cut at ", " "; " ": ") closed by a stop.
const R = (process.env.TREE || '/home/user/wt-disagree') + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { eligibleVariants } = await import(R + 'domain/display/stateProse/stateProseKernel.js');
const { economicRowPoolKey, foodTradesPoolKey } = await import(R + 'domain/display/stateProse/defenseStateProse.js');
const { factsAnswered } = await import(R + 'domain/facts/factsAnswered.js');
const { wallsAnswered } = await import(R + 'domain/defense/defenseFacts.js');
const { crisisAnswered } = await import(R + 'domain/crisis/crisisFacts.js');
const { atomHolds } = await import(R + 'domain/facts/factVocabulary.js');
const { guardPayOf, watchIsUnpaidRota } = await import(R + 'domain/facts/guardPay.js');
const { liveInstitutions } = await import(R + 'domain/institutions/institutionRoster.js');
const { partitionDefenseInstitutions } = await import(R + 'domain/institutions/defenseInstitutionBuckets.js');
const { isHideableHouse } = await import(R + 'domain/people/cardVeil.js');
const D = Object.values(await import(R + 'data/dossierStateProse/defense.generated.js'))[0];
const G = Object.values(await import(R + 'data/dossierStateProse/general.generated.js'))[0];
await loadGenerationLawPayloads();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (body) => {
  let src = '';
  for (const part of body.split(/(\{[a-zA-Z]+\}|the town)/)) {
    if (/^\{[a-zA-Z]+\}$/.test(part)) src += '.+?';
    else if (part === 'the town') src += 'the \\S+';
    else src += esc(part);
  }
  const c = src[0];
  return /[A-Za-z]/.test(c) ? `[${c.toUpperCase()}${c.toLowerCase()}]` + src.slice(1) : src;
};
const template = (text) => {
  const body = text.replace(/[.!?]\s*$/, '');
  const cuts = [...body.matchAll(/[,;:] /g)].map((m) => body.slice(0, m.index));
  return [new RegExp(pattern(body)), ...cuts.map((cut) => new RegExp(pattern(cut) + '\\.'))];
};
const GARR = G['DS-GEN-17'].pools.GARRISONED.map((v) => ({ vid: v.vid, full: [v.text, ...(v.wordings || [])].map((t) => template(t)[0]), res: [v.text, ...(v.wordings || [])].flatMap(template) }));

// The lines as the chair took them (DISAGREE-LINES.md), at the END of their pools with the next vids.
const appended = (pool, lines) => {
  let vid = Math.max(...pool.map((v) => v.vid));
  const added = lines.map(([name, angle, marks]) => ({ name, angle, marks, text: '{settlement} …', slots: ['settlement'], vid: ++vid }));
  return { pool: [...pool, ...added], added };
};
const WAGES = appended(D['DS-DEF-2'].pools['Economic Survival: WEAK'], [
  ['W1', 'ledger', ['guardPresence', 'force: paid', 'prosperity: ≤ comfortable']],
  ['W2', 'street', ['guardPresence', 'force: paid', 'prosperity: ≤ comfortable']],
  ['W3', 'threshold', ['guardPresence', 'force: paid', 'prosperity: ≤ comfortable']],
]);
const FOOD = appended(D['DS-DEF-2'].pools['CHAIN: food trades failing'], [
  ['F1', 'ledger', ['no crisis: under_siege', 'food: ≥ secure', 'stores: < 12']],
  ['F2', 'street', ['no crisis: under_siege', 'food: ≥ secure', 'stores: < 12']],
  ['F3', 'unfolding', ['no crisis: under_siege', 'food: ≥ secure', 'stores: < 12']],
  ['F4', 'visitor', ['no crisis: under_siege', 'food: ≥ secure']],
]);
const newEligible = (branch, read) => {
  const el = new Set(eligibleVariants(branch.pool, read));
  return branch.added.filter((v) => el.has(v)).map((v) => v.name);
};

const N = Number(process.argv[2] || 150);
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const COLS = ['n', 'G17v1', 'G17v2', 'v2full', 'i_v2short', 'ii_v2rota', 'iii_WEAKkey', 'iii_Welig', 'iii_Wshort', 'iv_CHAINkey', 'iv_Felig', 'iv_lt12', 'iv_ge12', 'v_rows', 'v_hideable'];
const tot = Object.fromEntries(COLS.map((k) => [k, 0]));
const seen = { i: [], ii: [], v: [], Fsets: {}, Wsets: {} };
console.log(['size', ...COLS].join('\t'));
for (const settType of sizes) {
  const c = Object.fromEntries(COLS.map((k) => [k, 0]));
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const pp = buildPrintProse(s, {});
    const texts = Object.values(pp).flatMap((mounts) => Object.values(mounts || {}).map(String));
    const printed = (res) => texts.some((t) => res.some((re) => re.test(t)));
    const garr = GARR.filter((g) => printed(g.res)).map((g) => g.vid);
    const pay = guardPayOf(s);
    const rota = watchIsUnpaidRota(liveInstitutions(s));
    c.n++;
    if (garr.includes(1)) c.G17v1++;
    if (garr.includes(2)) {
      c.G17v2++;
      if (printed(GARR.find((g) => g.vid === 2).full)) c.v2full++;
      if (pay === 'short') { c.i_v2short++; if (seen.i.length < 4) seen.i.push(seed); }
      if (rota) { c.ii_v2rota++; if (seen.ii.length < 4) seen.ii.push(seed); }
    }
    // The desk's own entry answers (defenseThreatProse: factsAnswered ∘ crisisAnswered ∘ wallsAnswered), its own slot.
    const read = factsAnswered(s, crisisAnswered(s, wallsAnswered(s, { slots: { settlement: s.name } })));
    if (economicRowPoolKey(s?.defenseProfile?.scores?.economic) === 'Economic Survival: WEAK') {
      c.iii_WEAKkey++;
      const w = newEligible(WAGES, read);
      if (w.length) { c.iii_Welig++; if (pay === 'short') c.iii_Wshort++; const k = w.join(','); seen.Wsets[k] = (seen.Wsets[k] || 0) + 1; }
    }
    if (foodTradesPoolKey(s?.defenseProfile?.chainModifiers) === 'CHAIN: food trades failing') {
      c.iv_CHAINkey++;
      const f = newEligible(FOOD, read);
      if (f.length) {
        c.iv_Felig++;
        const lt = atomHolds('stores: < 12', read.facts);
        if (lt === true) c.iv_lt12++; else if (atomHolds('stores: ≥ 12', read.facts) === true) c.iv_ge12++;
        const k = f.join(','); seen.Fsets[k] = (seen.Fsets[k] || 0) + 1;
      }
    }
    const b = partitionDefenseInstitutions(Array.isArray(s.institutions) ? s.institutions : []);
    for (const inst of new Set(['garrison', 'watch', 'militia', 'mercenary'].flatMap((k) => b[k] || []))) {
      c.v_rows++;
      if (isHideableHouse(inst)) { c.v_hideable++; if (seen.v.length < 4) seen.v.push(`${seed}:${inst?.name}`); }
    }
  }
  for (const k of COLS) tot[k] += c[k];
  console.log([settType, ...COLS.map((k) => c[k])].join('\t'));
}
console.log(['ALL', ...COLS.map((k) => tot[k])].join('\t'));
console.log('SEEDS (i):', seen.i.join(' ') || '-', '| (ii):', seen.ii.join(' ') || '-', '| (v):', seen.v.join(' ') || '-');
console.log('ELIGIBLE SETS W:', JSON.stringify(seen.Wsets), '| F:', JSON.stringify(seen.Fsets));
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${tot.n} births`);
