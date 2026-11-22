// PEOPLE-1 seat M3 (2026-11-20): TODAY and THE PROJECTION for settlementReason[], history.founding.foundedBy and
// history.founding.overcoming, over the births m3-births.mjs cached (100 places a size, born as the chair's instrument
// births them; the same name mask: the place's name, its people's names and their words of more than three letters,
// its powers' names -> '#'; digits -> '0'; goods and houses NOT masked).
// It re-derives, for each place, the branch each field took (validated by reproducing today's stored line from the
// writer's own pools and keys), then the line the proposed selection would print (m3-pools.mjs), and counts by size:
//   share = places of the size whose field prints the sentence / places of the size holding the field.
// Usage: node m3-origins.mjs <checkout> <cache.json>   (prints count lines only)
import { readFileSync } from 'node:fs';

const [, , L, cachePath] = process.argv;
if (!L || !cachePath) throw new Error('usage: node m3-origins.mjs <checkout> <cache.json>');
const P = await import(new URL('./m3-pools.mjs', import.meta.url));
const O = await import(`${L}/src/generators/narrative/settlementOriginProse.js`);
const { SMALL_PLACE_TIER_LINES } = await import(`${L}/src/generators/narrativeGenerator.js`);
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
const { speakTierNoun } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { tierNounFor } = await import(`${L}/src/domain/display/stateProse/weaveBlock.js`);
const { FOUNDER_KIND } = await import(`${L}/src/domain/facts/founder.js`);
const V = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { textAssertsMaritimeCapability } = await import(`${L}/src/generators/generationContext.js`);
const C = JSON.parse(readFileSync(cachePath, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BANDS = { prosperity: V.PROSPERITY_WORDS, tier: V.TIER_WORDS, population: V.POPULATION_WORDS };

// ── the atoms, answered on a cached set of holding atoms ──────────────────────────────────────────────────────────
const EXPORT_KEYS = Object.keys(P.EXPORT_WORD);
const siegeOf = (p) => (p.inputs.stressTypes || []).includes('under_siege');
const foodImportOf = (p) => Number(p.inputs.foodBalance?.importCoverage) > 0;
const hasFoodDeficitOf = (p) => { const fb = p.inputs.foodBalance; if (!fb) return false; const gap = Math.max(fb.rawDeficit ?? 0, fb.deficit ?? 0); const need = fb.dailyNeed ?? 0; return gap > 0 && (need <= 0 || gap / need >= 0.05); };
const valueOf = (on, dim) => { for (const a of on) if (a.startsWith(`${dim}: `)) return a.slice(dim.length + 2); return null; };
function holds(atom, p, on) {
  if (atom === 'FOOD_IMPORT') return foodImportOf(p);
  if (atom === 'crisis: under_siege') return siegeOf(p);
  if (atom === 'exported') return EXPORT_KEYS.some((k) => on.has(`exported: ${k}`));
  if (atom === 'terrain' || atom === 'route') return valueOf(on, atom) != null;
  const m = /^(prosperity|tier|population): ([≥≤]) (.+)$/.exec(atom);
  if (m) { const order = BANDS[m[1]]; const v = valueOf(on, m[1]); if (v == null) return false; const a = order.indexOf(v), b = order.indexOf(m[3]); return m[2] === '≥' ? a >= b : a <= b; }
  return on.has(atom);
}
const eligible = (w, p, on) => (w.needs || []).every((a) => holds(a, p, on)) && !(w.excludes || []).some((a) => holds(a, p, on));
function fill(text, p, on) {
  let t = text;
  if (t.includes('{ground}')) t = t.split('{ground}').join(P.GROUND[valueOf(on, 'terrain')] || 'here');
  if (t.includes('{export}')) t = t.split('{export}').join(P.EXPORT_WORD[EXPORT_KEYS.find((k) => on.has(`exported: ${k}`))] || '?');
  if (t.includes('{routeWay}')) t = t.split('{routeWay}').join(P.ROUTE_WAY[valueOf(on, 'route')] || 'from outside');
  return t;
}
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const maskOf = (p) => { const list = [...p.names].sort((a, b) => b.length - a.length); const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null; return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0'); };

// ── today's line 0: which arm and row (reverse-matched on the pools, the tokens as wildcards) ────────────────────
const rowRe = (row) => new RegExp(`^${esc(row).replace(/\\\{(ground|holds|channels)\\\}/g, '(.+?)')}$`);
const ROWS = Object.entries(O.ORIGIN_POOLS).flatMap(([arm, pool]) => pool.map((row, i) => ({ arm, i, re: rowRe(row) })));
const armOfLine = (line) => { const hit = ROWS.find((r) => r.re.test(line)); return hit ? { arm: hit.arm, i: hit.i } : { arm: '?', i: -1 }; };
const onwardIndex = (arm, pool, at, state) => { const ad = O.ORIGIN_ROW_ADMITS[arm]; if (!ad) return at; for (let k = 0; k < pool.length; k++) { const i = (at + k) % pool.length; if (!ad[i] || ad[i](state)) return i; } return at; };

const tally = () => new Map();
const bump = (m, k, by = 1) => m.set(k, (m.get(k) || 0) + by);
const topOf = (m) => { let best = null, n = 0; for (const [s, c] of m) if (c > n) { n = c; best = s; } return { s: best, n }; };
const pct = (n, d) => `${n}/${d} ${d ? Math.round((100 * n) / d) : 0}%`;
const lines = [];
const out = (s) => { lines.push(s); };

const VALID = { line0: 0, line0Arm: 0, line1: 0, line1Of: 0, founderKnown: 0, overcomingKnown: 0, n: 0 };
const R = {};
for (const size of SIZES) {
  const places = C.sizes[size];
  const r = { holders: { sr: 0, by: 0, ov: 0 }, today: { sr: tally(), by: tally(), ov: tally() }, proj: { sr: tally(), by: tally(), ov: tally() }, branch0: tally(), branch1: tally(), entries0: tally(), byBranch: tally(), ovBranch: tally(), poolLen: { sr0: [], sr1: [], by: [], ov: [] }, pow2: 0, nobleNoLord: 0, noble: 0 };
  R[size] = r;
  for (const p of places) {
    VALID.n++;
    const mask = maskOf(p);
    const on = new Set(p.on);
    const birthOn = new Set(p.birthOn || p.on);
    const seed = p.recordSeed;
    // ── settlementReason ──
    const sr = p.settlementReason || [];
    if (sr.length) {
      r.holders.sr++;
      for (const s of new Set(sr.map(mask))) bump(r.today.sr, s);
      const proj = [];
      // line 0
      const terrainType = p.inputs.terrainType, hasFoodDeficit = hasFoodDeficitOf(p), siege = siegeOf(p);
      const state = { route: p.inputs.route, terrainType, hasFoodDeficit, hasDocks: p.inputs.hasDocks, hasFoodImport: p.inputs.foodBalance ? foodImportOf(p) : undefined, siege, tier: p.tier, hasTravellerHouse: p.inputs.tavern, specialResources: p.inputs.specialResources, seed };
      const armKey = O.originArmKey(state);
      const seen = armOfLine(sr[0]);
      if (seen.arm === armKey) VALID.line0Arm++;
      bump(r.branch0, armKey);
      const pool = O.ORIGIN_POOLS[armKey];
      const key = O.originVariantKey({ ...state, arm: armKey });
      const at = onwardIndex(armKey, pool, pool.indexOf(pickVariant(pool, key)), state);
      const todayRow = pool[at];
      const expect0 = armKey === 'ground' ? todayRow.split('{ground}').join(O.GROUND_PHRASE[terrainType]) : todayRow;
      if (expect0 === sr[0] || /\{(holds|channels)\}/.test(todayRow)) VALID.line0++;
      const vars = P.ORIGIN_VARIANTS[armKey];
      if (vars) {
        const admitted = pool.filter((row, i) => { const t = O.ORIGIN_ROW_ADMITS[armKey]?.[i]; return !t || t(state); });
        const list = [...admitted, ...vars.filter((w) => eligible(w, p, on)).map((w) => fill(w.text, p, on))];
        r.poolLen.sr0.push(list.length); if ((list.length & (list.length - 1)) === 0 && list.length > 1) r.pow2++;
        proj.push(pickVariant(list, key));
      } else proj.push(sr[0]);
      // line 1
      if (sr.length > 1) {
        let b = null, list = null, k1 = seed ? `${seed}::settlement-tier-line::${p.tier}` : null;
        if (p.tier === 'thorp' || p.tier === 'hamlet') {
          b = 'small-place'; VALID.line1Of++; if (pickVariant(SMALL_PLACE_TIER_LINES, k1) === sr[1]) VALID.line1++;
          list = [...SMALL_PLACE_TIER_LINES, ...P.SMALL_PLACE_VARIANTS.filter((w) => eligible(w, p, on)).map((w) => fill(w.text, p, on))];
        } else if (p.tier === 'city') {
          b = hasFoodDeficitOf(p) ? 'city-deficit' : 'city-fed'; VALID.line1Of++; if (/appetites outrun|feed itself/.test(sr[1])) VALID.line1++;
          list = b === 'city-deficit' ? [sr[1], ...P.CITY_DEFICIT_VARIANTS.filter((w) => eligible(w, p, on)).map((w) => fill(w.text, p, on))] : [sr[1]];
        } else if (p.tier === 'metropolis') {
          b = siegeOf(p) ? 'metropolis-siege' : 'metropolis'; VALID.line1Of++; if (/bought, sold or decided here/.test(sr[1])) VALID.line1++;
          list = b === 'metropolis-siege' ? [sr[1]] : [sr[1], ...P.METROPOLIS_VARIANTS.filter((w) => eligible(w, p, on)).map((w) => fill(w.text, p, on))]; // under a siege the twin stands alone (originSiegeHolds)
        }
        bump(r.branch1, b || `${p.tier}-?`);
        if (list) { r.poolLen.sr1.push(list.length); if ((list.length & (list.length - 1)) === 0 && list.length > 1) r.pow2++; proj.push(pickVariant(list, k1)); } else proj.push(sr[1]);
      }
      for (const s of new Set(proj.map(mask))) bump(r.proj.sr, s);
      bump(r.entries0, 'lines', sr.length);
    }
    // ── foundedBy ──
    const by = p.founding.foundedBy;
    if (by) {
      r.holders.by++; bump(r.today.by, mask(by)); bump(r.byBranch, by);
      if (Object.hasOwn(FOUNDER_KIND, by)) VALID.founderKnown++;
      if (/noble|crown/.test(by)) { r.noble++; if (!on.has('ruler: lord')) r.nobleNoLord++; }
      const vars = P.FOUNDER_VARIANTS[by] || [];
      const list = [by, ...vars.filter((w) => eligible({ needs: w.needs, excludes: w.excludes || [] }, p, birthOn)).map((w) => fill(w.text, p, birthOn))];
      r.poolLen.by.push(list.length);
      const picked = speakTierNoun(pickVariant(list, seed ? `${seed}::history.founding.foundedBy` : null), tierNounFor(p.tier));
      bump(r.proj.by, mask(picked));
    }
    // ── overcoming ──
    const ov = p.founding.overcoming;
    if (ov) {
      r.holders.ov++; bump(r.today.ov, mask(ov));
      const table = Object.keys(P.OVERCOMING_TABLES).find((t) => P.OVERCOMING_TABLES[t].includes(ov));
      if (table) VALID.overcomingKnown++;
      const kind = P.CHALLENGE_KIND[p.founding.initialChallenge] || '?';
      bump(r.ovBranch, `${table || '?'}·${kind}`);
      const vars = (P.OVERCOMING_VARIANTS[table] || {})[kind] || [];
      const list = [ov, ...vars.filter((w) => eligible({ needs: w.needs, excludes: w.excludes || [] }, p, birthOn)).map((w) => w.text)];
      r.poolLen.ov.push(list.length);
      bump(r.proj.ov, mask(speakTierNoun(pickVariant(list, seed ? `${seed}::history.founding.overcoming` : null), tierNounFor(p.tier))));
    }
  }
}

// ── the guards every new wording passes ─────────────────────────────────────────────────────────────────────────────
const TICS = /\b(arithmetic|the record|two different things|a separate question|nothing has broken yet|which is the kind of|rather than|a stranger)\b/i;
const CAUSE = /\b(because|founded for|exists because|on the reasoning that|for generations)\b/i;
const MINES = /\b(mines?|mining|ores?|deposits?|seams?|lodes?)\b/i;
const words = (s) => s.split(/\s+/).length;
const guard = { n: 0, miss: [] };
const allNeeds = [];
const check = (where, w, rules) => {
  guard.n++;
  for (const a of [...(w.needs || []), ...(w.excludes || [])]) { allNeeds.push(a); if (!['FOOD_IMPORT', 'exported', 'terrain', 'route'].includes(a) && !V.parseAtom(a)) guard.miss.push(`${where}: unknown atom ${a}`); }
  const t = w.text;
  if (TICS.test(t)) guard.miss.push(`${where}: a struck tic: ${t}`);
  if (words(t) > 30) guard.miss.push(`${where}: over 30 words: ${t}`);
  if (textAssertsMaritimeCapability(t) && !(w.needs || []).includes('coast')) guard.miss.push(`${where}: a maritime claim without coast: ${t}`);
  for (const [name, re] of rules) if (re.test(t)) guard.miss.push(`${where}: ${name}: ${t}`);
};
for (const [arm, ws] of Object.entries(P.ORIGIN_VARIANTS)) for (const w of ws) check(`origin.${arm}`, w, [['a founding cause on the WHERE rung', CAUSE], ['the deposit words (tailHouses3DefenceDeposit)', MINES], ['opens "Founded" (bar5WorldLines)', /^Founded\b/]]);
for (const w of P.SMALL_PLACE_VARIANTS) check('small-place', w, [['the deposit words', MINES]]);
for (const w of P.CITY_DEFICIT_VARIANTS) check('city-deficit', w, [['the deposit words', MINES], ['drops the gap', /^(?!.*(cannot|more than|less than|not enough|bought in|buy what|not grown)).*$/i]]);
for (const w of P.METROPOLIS_VARIANTS) check('metropolis', w, [['the deposit words', MINES]]);
for (const [row, ws] of Object.entries(P.FOUNDER_VARIANTS)) {
  if (!Object.hasOwn(FOUNDER_KIND, row)) guard.miss.push(`founder: canonical row not in FOUNDER_KIND: ${row}`);
  for (const w of ws) { check(`founder<${row.slice(0, 24)}>`, w, [['not a lowercase noun phrase', /^[^a-z]/]]); for (const tier of SIZES) { const t = w.text.split('{ground}').join('in the hills'); if (speakTierNoun(t, tierNounFor(tier)) !== t) guard.miss.push(`founder: speakTierNoun rewrites it at ${tier}: ${t}`); } }
}
const SOV = /\b(lord(s|'s)?|liege|overlord|crown|king|king's|queen|monarch|throne|noble oversight|baron|duke|earl|vassals?|fealty|tribute to|emperor|royal|imperial)\b/gi;
for (const [row, ws] of Object.entries(P.FOUNDER_VARIANTS)) { const own = new Set((row.match(SOV) || []).map((x) => x.toLowerCase())); for (const w of ws) for (const x of own) if (!w.text.toLowerCase().match(SOV)?.includes(x)) guard.miss.push(`founder: drops its row's sovereign word "${x}": ${w.text}`); }
out(`COUNTS: founder wordings ${Object.values(P.FOUNDER_VARIANTS).reduce((a, w) => a + w.length, 0)} over ${Object.keys(P.FOUNDER_VARIANTS).length} rows; overcoming wordings ${Object.values(P.OVERCOMING_VARIANTS).reduce((a, k) => a + Object.values(k).reduce((b, w) => b + w.length, 0), 0)}; settlementReason wordings ${Object.values(P.ORIGIN_VARIANTS).reduce((a, w) => a + w.length, 0) + P.SMALL_PLACE_VARIANTS.length + P.CITY_DEFICIT_VARIANTS.length + P.METROPOLIS_VARIANTS.length}`);
for (const [table, kinds] of Object.entries(P.OVERCOMING_VARIANTS)) for (const [kind, ws] of Object.entries(kinds)) for (const w of ws) check(`overcoming.${table}.${kind}`, w, [['not an adverbial opening', /^(?!(by|through|with|at|though|only|behind)\b)/]]); for (const [, kinds] of Object.entries(P.OVERCOMING_VARIANTS)) for (const ws of Object.values(kinds)) for (const w of ws) for (const tier of SIZES) if (speakTierNoun(w.text, tierNounFor(tier)) !== w.text) guard.miss.push(`overcoming: speakTierNoun rewrites it at ${tier}: ${w.text}`);

// ── print ───────────────────────────────────────────────────────────────────────────────────────────────────────────
out(`base ${C.base ?? '(unset)'} · n ${C.n} a size · sizes ${SIZES.join(', ')}`);
out('PRINTING SURFACES (read in the code; SAME-1\'s render of 300 places, per the chair at 16:30 UTC, saw settlementReason on the Overview and in the PDF, and the founding rows in the PDF only):');
out('  settlementReason[]: web Overview "Settlement Origin" (src/components/new/tabs/OverviewTab.jsx, every line), Summary tab (src/components/new/SummaryTab.jsx, every line), PDF Overview (src/pdf/lib/viewModel.js -> src/pdf/sections/Overview.jsx), campaign PDF (src/utils/generateCampaignPDF.js), Foundry journal (src/foundry/journalPages.js "## Settlement Origin"); line [0] alone: the spine (src/domain/simulationSpine.js :: deriveExistsBecause), the quick guide (src/domain/summary/settlementQuickGuide.js :: composeFoundationTruth), the AI grounding payload (supabase/functions/_shared/aiGroundingBundle.js)');
out('  history.founding.foundedBy / .overcoming: PDF chapter 08 (src/pdf/sections/HistoryFounding.jsx, via src/pdf/lib/viewModel.js); the code also holds the web History tab\'s Founding collapsible (src/components/new/tabs/HistoryTab.jsx) and the Foundry journal (src/foundry/journalPages.js), and composes from both in src/domain/historyBeats.js (foundingCause: "founded by <foundedBy>"; firstProsperitySource: "Prosperity came slowly, <overcoming>.", only where no top export)');
out(`VALIDATION: line 0 arm re-derived = arm read from the line: ${VALID.line0Arm}/${VALID.n}; line 0 reproduced from pool+key+onward walk: ${VALID.line0}/${VALID.n}; line 1 reproduced: ${VALID.line1}/${VALID.line1Of}; foundedBy a FOUNDER_KIND row: ${VALID.founderKnown}/${VALID.n}; overcoming a table row: ${VALID.overcomingKnown}/${VALID.n}`);
out(`GUARDS: ${guard.n} new wordings checked; misses ${guard.miss.length}`);
for (const m of guard.miss) out(`  MISS ${m}`);
for (const size of SIZES) {
  const r = R[size];
  out(`\n=== ${size}`);
  out(`branch settlementReason[0] (arm): ${[...r.branch0].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(' · ')}  (entries: ${r.entries0.get('lines') || 0} lines on ${r.holders.sr} places)`);
  out(`branch settlementReason[1] (tier line): ${[...r.branch1].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(' · ') || 'none (no tier line at this size)'}`);
  out(`branch foundedBy (resolved row): ${[...r.byBranch].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${c} "${k}"`).join(' · ')}`);
  out(`branch overcoming (table·challenge kind): ${[...r.ovBranch].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(' · ')}`);
  out(`noble/crown-grant founders ${r.noble}, of them where the ruler is not a lord ${r.nobleNoLord}`);
  const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : '-');
  out(`eligible pool length (mean): sr[0] ${avg(r.poolLen.sr0)} · sr[1] ${avg(r.poolLen.sr1)} · foundedBy ${avg(r.poolLen.by)} · overcoming ${avg(r.poolLen.ov)} · settlementReason lists of a power-of-two length ${r.pow2}`);
  for (const [f, label] of [['sr', 'settlementReason'], ['by', 'foundedBy'], ['ov', 'overcoming']]) {
    const t = topOf(r.today[f]), q = topOf(r.proj[f]);
    out(`TOP ${label} today ${pct(t.n, r.holders[f])} distinct ${r.today[f].size} :: ${t.s}`);
    out(`TOP ${label} projected ${pct(q.n, r.holders[f])} distinct ${r.proj[f].size} :: ${q.s}`);
    const next = [...r.proj[f]].sort((a, b) => b[1] - a[1]).slice(1, 4).map(([s, c]) => `${c} ${s.slice(0, 90)}`).join(' | ');
    out(`  next projected: ${next}`);
  }
}
out('\nSUMMARY (top share by size, today -> projected)');
for (const [f, label] of [['sr', 'settlementReason'], ['by', 'foundedBy'], ['ov', 'overcoming']]) out(`${label}: ${SIZES.map((s) => `${s} ${pct(topOf(R[s].today[f]).n, R[s].holders[f])} -> ${pct(topOf(R[s].proj[f]).n, R[s].holders[f])}`).join(' · ')}`);
out('\nAPPROXIMATIONS (where the projection is not the code path):');
out('1. settlementReason atoms are read on the FINAL record (factsOf). The writer runs at generateNarratives, after generatePopulation and economyReconcilePass: the economy, the roster, the government and the cast are in hand there, and the builder must hand them to factsOf at the step; a later pass that changes a read fact would differ. FOOD_IMPORT reads the writer\'s own input (economicViability.metrics.foodBalance.importCoverage > 0, its `hasFoodImport`).');
out('2. foundedBy and overcoming atoms are read through birthFactsOf over the FINAL roster and config (the founding state\'s own view); only birth-settled atoms are used (terrain, route, water, houses, walls, palisade, healer, market), each equal at birth and final on these 600 (m3-births cache, measured).');
out('3. The variant selection filters first and hashes over the eligible list (as M1 proposed), where today\'s origin pool hashes then walks onward from a refused row; the onward walk is what lifts road row 4 today (row 3, refused without an inn and in every city and metropolis, lands on it).');
out('4. 100 places a size: a swing of about 3 places is noise; a figure at 12-15% sits at the bar, not under it by a margin.');
out('5. The eligible lists vary in length per place, so some land on a power of two (counted above). On this seed family (hxd-<size>-<i>, the seed once in each key) fnv1a32 mod 2, 4 and 8 split 100 keys evenly (50/50, 25x4, 12-14x8: measured), so the projection is, if anything, kinder at those lengths than random seeds would be; the static pool law (settlementOriginProse.js law 3) is the chair\'s to extend to computed lists or not.');
console.log(lines.join('\n'));
