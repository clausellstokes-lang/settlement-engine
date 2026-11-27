// R-MEASURE analysis: node analyze.mjs <corpus.jsonl> <label> <out.json>
// Reads each birth's printed owner views, share views, per-snapshot repeats and its stamped record; applies one
// scripted test per item; writes per-item fault / innocent seed lists with one example each.
import { createReadStream, writeFileSync } from 'node:fs';
import readline from 'node:readline';
const [FILE, LABEL, OUT] = process.argv.slice(2);
const L = await import(new URL('../lib.mjs', import.meta.url).href);
await L.loadGenerationLawPayloads();

const R = {}; // item -> { fault: {size: n}, innocent: {size: n}, faultSeeds: [], innocentSeeds: [], ex: [] , sub: {} }
const item = (k) => (R[k] ||= { fault: {}, innocent: {}, faultSeeds: [], innocentSeeds: [], ex: [], sub: {} });
const mark = (k, kind, j, ex) => {
  const it = item(k); it[kind][j.size] = (it[kind][j.size] || 0) + 1;
  it[`${kind}Seeds`].push(j.seed);
  if (kind === 'fault' && ex && it.ex.length < 4) it.ex.push({ seed: j.seed, ...ex });
  if (kind === 'innocent' && ex && !it.innEx) it.innEx = { seed: j.seed, ...ex };
};
const sub = (k, key, j, ex) => { const it = item(k); const e = (it.sub[key] ||= { n: 0, bySize: {}, ex: null }); e.n++; e.bySize[j.size] = (e.bySize[j.size] || 0) + 1; if (!e.ex) e.ex = { seed: j.seed, ...ex }; };
const pairs = new Map(); // `A ## B` -> pages
const all = (views) => Object.entries(views || {}).flatMap(([v, ls]) => ls.map((l) => [v, l]));
const sentences = (l) => l.split(/(?<=[.!?])\s+(?=[A-Z"“])/);

// ── R2: doubled sentence ends
const DOUBLE = /(?<![.…])\.\.(?![.…])|(?<![.…])\.\s+\.(?![.…])|[?!]\.(?!\.)|[;:,]\.(?!\.)|\.[,;]/;
// ── R4: imminent threat lines by kind
const IMMINENT = {};
for (const [branch, lines] of Object.entries(L.RECENT_CHANGES)) {
  const m = /^threat\.([a-z_]+)\.[a-z]+\.imminent$/.exec(branch); if (!m) continue;
  for (const l of lines) (IMMINENT[m[1]] ||= []).push(l.text);
}
const CRISIS_OF = { plague: ['plague_onset', 'plague'], famine: ['famine'], siege: ['under_siege'], monster_pressure: ['monster_pressure'], insurgency: ['insurgency'], war: ['wartime'], rebellion: ['insurgency', 'slave_revolt'] };
// ── R7
const R7 = [/of things you hear about .+ cannot all be true at once/, /says about itself does not match the rest in/, /A handful of things about this (town|city|village|hamlet|thorp|metropolis|place) cannot all be true at once/, /^Not every account of .+ squares with every other/, /'s story has more than loose ends: on some points it contradicts itself outright/, /Set side by side, the accounts of .+ disagree on points that matter/, /will come away with answers that do not fit together/];
// ── R8
const WOOD_RES = new Set(['managed_forest', 'ancient_grove', 'shipbuilding_timber', 'mountain_timber']);
const WOOD_WORD = /\b(woods?|woodlands?|forests?|groves?|the trees|timber stands?|copses?|thickets?)\b/i;
// ── R5/R10/R12 classes (on a sentence with the town's name as {S}; a sentence naming a person is a person's)
const A_CLASSES = [
  ['A money laid by (DL purse)', /there is money laid by behind it/],
  ['A purse closes ahead (DL)', /purse closes every year ahead/],
  ['A pays its way (Outlook)', /pays its way/],
  ['A owes no one', /owes no one/],
  ['A puts things by (DL)', /put things by, and can/],
  ['A had money laid by', /had money laid by/],
];
const B_CLASSES = [
  ['B would have to borrow (Defense)', /would have to borrow the money first/],
  ['B Economic Resilience Weak (Overview)', /^Economic ResilienceWeak$/],
  ['B Economic Survival Weak (Defense)', /^__ECONSURV_WEAK__$/],
  ['B indebted crisis in force', /^__INDEBTED__$/],
  ['B tension: owes a heavy debt to an outside power', /owes a heavy debt to an outside power/],
  ['B DS-ECO-8 v5 pays the most pressing debt', /pays the most pressing debt/],
  ['B DS-POW-6 v2 the town\'s debts start in one house', /debts start in one house/],
  ['B history: borrowed from a foreign power / debt called in', /borrowed heavily from a foreign power|debt to an outside power came due|call the debt in/],
  ['B hook: creditor / loan / collectors', /creditor|loan documents|accounts of the loans|collectors are due|debt could be voided|against the debt/],
  ['B daily life: what the place owes', /what the place owes|What is owed to outsiders/],
  ['B nothing laid by for a defence', /nothing laid by/],
  ['B present place debt (other homes)', /owes an outside power more than|the debt is one more reason|Every year the debt stands|lenders now own much of it|owes more than it owns|soon learn who the [a-z]+ owes|interest on \{S\}'s debt|on borrowed money|took the loans and is now repaying|debt owed to an outside power|^External Debt$|The debt comes before everything|remit what it owes/],
  ['B other place debt (borrow/debt/owes, no person)', /\b(debts?|owes|borrow\w*|in arrears)\b/i],
];

for await (const raw of readline.createInterface({ input: createReadStream(FILE), crlfDelay: Infinity })) {
  if (!raw) continue;
  const j = JSON.parse(raw);
  if (j.error) { mark('ERR', 'fault', j, { line: j.error.slice(0, 200) }); continue; }
  const T = j.town; const V = j.views; const SV = j.shareViews || {}; const reps = j.reps || {};
  const lines = all(V); const slines = all(SV);
  const sAll = slines.map(([, l]) => l).join('\n');
  let pdfAll = '';
  try { const nz = L.normalizeSettlement(T); const pp = L.buildPrintProse(nz, {});
    pdfAll = Object.values(pp).flatMap((m) => Object.values(m)).join('\n');
    for (const k of L.DAILY_LIFE_PAGE_SLOTS) pdfAll += `\n${L.deriveDailyLifeSlot(k, nz)?.text || ''}`;
    try { pdfAll += `\n${JSON.stringify(L.composeCrisisPage(nz))}`; } catch { /* */ }
  } catch (e) { sub('PDF-err', String(e.message).slice(0, 80), j, {}); }
  const onPdf = (k, text) => { if (text && pdfAll.includes(String(text).replace(/^[^:]+ :: /, ''))) sub('PDF-ALSO', k, j, { line: String(text).slice(0, 160) }); };
  const onShare = (k, text) => { onPdf(k, text); if (text && sAll.includes(String(text).replace(/^[^:]+ :: /, ''))) sub('SHARE-ALSO', k, j, { line: String(text).slice(0, 160) }); };
  const npcs = (T.npcs || []).filter((p) => p && p.name);
  const names = npcs.map((p) => p.name).sort((a, b) => b.length - a.length);
  const norm = (s) => { let t = s.split(T.name || '\u0000').join('{S}'); for (const nm of names) t = t.split(nm).join('{N}'); return t; };
  const stressTypes = [T.stress].flat().filter(Boolean).map((e) => e.type).filter(Boolean);
  item('PAGES').fault[j.size] = (item('PAGES').fault[j.size] || 0) + 1;

  // R1
  { const hit = lines.find(([, l]) => l.includes('next in line, the first choice already holding a role that contradicts this one'));
    const shit = slines.find(([, l]) => l.includes('next in line, the first choice'));
    if (hit) { mark('R1', 'fault', j, { view: hit[0], line: hit[1] }); if (pdfAll.includes('next in line, the first choice')) sub('PDF-ALSO', 'R1', j, {}); }
    if (shit) sub('R1', 'on share', j, { view: shit[0], line: shit[1] });
    if (Object.keys(V).some((v) => /Crisis/.test(v))) sub('R1', 'pages with a Crisis tab', j, {}); }

  // R2
  { const f = lines.filter(([, l]) => DOUBLE.test(l)); const sf = slines.filter(([, l]) => DOUBLE.test(l));
    if (f.length) { mark('R2', 'fault', j, { view: f[0][0], line: f[0][1] }); for (const [v, l] of f) { const m = l.match(DOUBLE); const i = l.indexOf(m[0]); sub('R2', `${v} :: …${norm(l.slice(Math.max(0, i - 70), i + 6))}`, j, { line: l }); } }
    else mark('R2', 'innocent', j);
    for (const [v, l] of sf) { const m = l.match(DOUBLE); const i = l.indexOf(m[0]); sub('R2share', `${v} :: …${norm(l.slice(Math.max(0, i - 70), i + 6))}`, j, { line: l }); } }

  // R2 on the PDF's state prose + daily life + crisis page, and on the Tonight sheet's strings
  { let tn = ''; try { tn = JSON.stringify(L.composeTonightSheet(T)); } catch { /* */ }
    for (const [tag, txt] of [['PDF', pdfAll], ['TONIGHT', tn]]) for (const x of txt.split(/\n|","/)) if (DOUBLE.test(x)) { const m = x.match(DOUBLE); const i = x.indexOf(m[0]); sub('R2other', `${tag} :: …${norm(x.slice(Math.max(0, i - 70), i + 6))}`, j, { line: x.slice(0, 200) }); } }

  // R3: a person's name with its second word lower-cased (case-sensitive), anywhere
  { let hit = null; const subs = new Set(); let printedNames = false;
    for (const nm of names) {
      const w = nm.split(' '); if (w.length < 2 || !/^[A-Z]/.test(w[1])) continue;
      const bad = [w[0], w[1].toLowerCase(), ...w.slice(2)].join(' ');
      const re = new RegExp(`(^|[^A-Za-z])${bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^A-Za-z])`);
      for (const [v, l] of [...lines, ...slines.map(([v2, l2]) => [`SHARE:${v2}`, l2])]) {
        if (re.test(l)) { hit ||= { view: v, line: l, name: nm }; subs.add(v); }
        if (v === 'Summary/Plot Hooks' && l.includes(nm)) printedNames = true;
      }
    }
    if (hit) { mark('R3', 'fault', j, hit); for (const v of subs) sub('R3', v, j, hit); }
    else if (printedNames) mark('R3', 'innocent', j); }

  // R3 on the SESSION SHEET (components/session/SessionMode.jsx: "Threads to pull", tokenCase(hook.source) over
  // collectPlotHooks less the Tonight sheet's hooks, first twelve), measured through the same view models
  { try { const sheet = L.composeTonightSheet(T); const shown = new Set(sheet.hooks.map((h) => h.text.replace(/[.!?]$/, '')));
      const hk = L.collectPlotHooks(T).filter((h) => !shown.has(String(h.text || '').replace(/[.!?]$/, ''))).slice(0, 12);
      const heads = hk.map((h) => L.tokenCase(h.source));
      const bad = heads.filter((h) => names.some((n) => n !== h && n.split(' ').length > 1 && n.toLowerCase() === String(h).toLowerCase()));
      if (bad.length) mark('R3session', 'fault', j, { heading: bad[0], of: heads.length });
      else if (heads.some((h) => names.includes(h))) mark('R3session', 'innocent', j);
      else if (heads.length) mark('R3session-noNameHeads', 'fault', j, { heads: heads.slice(0, 3) });
    } catch (e) { sub('R3session-err', String(e.message).slice(0, 80), j, {}); } }

  // R4
  { const dl = (V['World/Daily Life'] || []).join(' \n ');
    for (const [kind, texts] of Object.entries(IMMINENT)) for (const t of texts) if (dl.includes(t)) {
      const active = (CRISIS_OF[kind] || [kind]).some((c) => stressTypes.includes(c));
      if (active) { onShare('R4', t); mark('R4', 'fault', j, { kind, crisis: stressTypes.join(','), line: (V['World/Daily Life'] || []).find((l) => l.includes(t)) }); sub('R4', `${kind} imminent beside its crisis in force`, j, { line: t }); }
      else { mark('R4', 'innocent', j, { kind, line: t }); sub('R4', `${kind} imminent, no such crisis`, j, { line: t }); }
    } }

  // R5/R10/R12 pair table
  { const sents = [];
    for (const [v, l] of lines) for (const s of sentences(l)) sents.push([v, s, norm(s)]);
    const A = new Set(); const B = new Set(); const Aex = {}; const Bex = {};
    for (const [v, s, n] of sents) {
      if (n.includes('{N}') || /^Wants |holds a tie to them|Outstanding Debt|Debt Crisis/.test(n)) continue;
      for (const [k, re] of A_CLASSES) if (re.test(n)) { A.add(k); Aex[k] ||= `${v} :: ${s}`; break; }
      for (const [k, re] of B_CLASSES) if (re.test(n)) { if (k.startsWith('B other') && [...B].length && false) break; B.add(k); Bex[k] ||= `${v} :: ${s}`; if (k.startsWith('B other')) sub('R5-Bother', `${v} :: ${n.slice(0, 170)}`, j, {}); break; }
    }
    // the two grades read as their own pair of lines
    const def = V['Systems/Defense'] || []; const ei = def.indexOf('Economic Survival');
    if (ei >= 0 && /^Weak/.test(def[ei + 1] || '')) { B.add('B Economic Survival Weak (Defense)'); Bex['B Economic Survival Weak (Defense)'] ||= 'Systems/Defense :: Economic Survival / Weak'; }
    if (stressTypes.includes('indebted')) { B.add('B indebted crisis in force'); Bex['B indebted crisis in force'] ||= `stress: indebted`; }
    for (const a of A) for (const b of B) { const k = `${a} ## ${b}`; const e = pairs.get(k) || { n: 0, ex: null }; e.n++; if (!e.ex) e.ex = { seed: j.seed, a: Aex[a], b: Bex[b] }; pairs.set(k, e); }
    for (const a of A) { sub('R5-A', a, j, { line: Aex[a] }); if (B.size) mark(`R5:${a}`, 'fault', j, { a: Aex[a], b: [...B].map((k) => Bex[k]).slice(0, 3) }); else mark(`R5:${a}`, 'innocent', j, { a: Aex[a] }); }
    for (const b of B) sub('R5-B', b, j, { line: Bex[b] });
    // THE FAULT (one clause): a SAVINGS line beside a line that says there are no savings / it must borrow, or ANY
    // solvency line beside a PRESENT debt of the place. A Weak grade beside either is counted apart (soft pair).
    const SAVINGS = ['A money laid by (DL purse)', 'A purse closes ahead (DL)', 'A puts things by (DL)'];
    const NOSAVE = ['B would have to borrow (Defense)', 'B nothing laid by for a defence'];
    const PRESENT = ['B indebted crisis in force', 'B tension: owes a heavy debt to an outside power', 'B DS-ECO-8 v5 pays the most pressing debt', 'B DS-POW-6 v2 the town\'s debts start in one house', 'B hook: creditor / loan / collectors', 'B daily life: what the place owes', 'B history: borrowed from a foreign power / debt called in', 'B present place debt (other homes)'];
    const WEAK = ['B Economic Resilience Weak (Overview)', 'B Economic Survival Weak (Defense)'];
    const hard = [...A].flatMap((a) => [...B].filter((b) => (SAVINGS.includes(a) && NOSAVE.includes(b)) || PRESENT.includes(b)).map((b) => [a, b]));
    if (hard.length) { if (sAll.includes(Aex[hard[0][0]].replace(/^[^:]+ :: /, '')) && sAll.includes(Bex[hard[0][1]].replace(/^[^:]+ :: /, ''))) sub('SHARE-ALSO', 'R5R10R12 (both lines)', j, {}); if (pdfAll.includes(Aex[hard[0][0]].replace(/^[^:]+ :: /, '')) && pdfAll.includes(Bex[hard[0][1]].replace(/^[^:]+ :: /, ''))) sub('PDF-ALSO', 'R5R10R12 (both lines, state prose + daily life)', j, {}); mark('R5R10R12', 'fault', j, { a: Aex[hard[0][0]], b: Bex[hard[0][1]] }); }
    else if (A.size) { const soft = [...B].filter((b) => WEAK.includes(b)); if (soft.length) mark('R5R10R12-softWeak', 'fault', j, { a: Aex[[...A][0]], b: Bex[soft[0]] }); else mark('R5R10R12', 'innocent', j, { a: Aex[[...A][0]] }); }
    if (A.size && hard.length === 0) mark('R5R10R12-innocentAll', 'fault', j);
    const r10a = [...B].filter((b) => /DS-ECO-8|DS-POW-6/.test(b));
    for (const b of r10a) { if (A.size) mark(`R10:${b}`, 'fault', j, { a: [...A].map((k) => Aex[k]), b: Bex[b] }); else mark(`R10:${b}`, 'innocent', j, { b: Bex[b] }); }
  }

  // R6 (a): the scarcity tension unnamed, where the page names the short good; (b) a tension led into more than one hook
  { const ten = lines.find(([, l]) => /critical resource (is running short|became scarce)/.test(l));
    if (ten) {
      const named = [];
      for (const [v, l] of lines) {
        let m;
        if ((m = /brings up enough ([a-z][a-z ]*?) for what/.exec(l))) named.push(`${v}: enough ${m[1]}`);
        if ((m = /\bno ([a-z][a-z ]*?) lies near\b/.exec(l))) named.push(`${v}: no ${m[1]} lies near`);
        if ((m = /^([A-Z][a-z]+(?: [a-z]+)?) is short this season/.exec(l))) named.push(`${v}: ${m[1]} is short`);
        if ((m = /running short of ([a-z][a-z ]+)/.exec(l))) named.push(`${v}: short of ${m[1]}`);
        if ((m = /'s ([a-z]+) supply is tighter/.exec(l))) named.push(`${v}: ${m[1]} supply tighter`);
      }
      if (named.length) onShare('R6a', ten[1]); if (named.length) mark('R6a', 'fault', j, { tension: `${ten[0]} :: ${ten[1].slice(0, 90)}`, named: named.slice(0, 3) });
      else mark('R6a', 'innocent', j, { tension: ten[1].slice(0, 90) });
    }
    const descs = (T.history?.currentTensions || []).map((t) => t?.description).filter(Boolean);
    let rep = null;
    for (const [v, m] of Object.entries(reps)) for (const [l, c] of Object.entries(m)) if (descs.some((d) => l.includes(d.slice(0, 60)))) rep ||= { view: v, line: l.slice(0, 120), count: c };
    if (rep) mark('R6b', 'fault', j, rep);
    else if (descs.length) mark('R6b', 'innocent', j);
    // any long line repeated within one snapshot (a garble/repeat census)
    for (const [v, m] of Object.entries(reps)) for (const [l, c] of Object.entries(m)) if (l.length > 50) sub('REPEATS', `${v} :: ${norm(l).slice(0, 110)}`, j, { count: c }); }

  // R7
  { const hit = lines.find(([, l]) => R7.some((re) => re.test(l)));
    const v = T.economicViability || {}; const crit = L.criticalIssuesOf(v); const nonStress = crit.filter((i) => i.type !== 'stress_consequence');
    const judg = (T.generationCoherenceReceipt?.judgments || []).find((x) => x?.id === 'record_coherence_battery')?.status;
    const cause = crit.length === 0 ? `count 0, battery ${judg}` : nonStress.length ? 'a non-stress critical issue' : 'only stress consequences';
    if (hit) { sub('R7', cause, j, { line: hit[1], titles: crit.map((i) => i.title) });
      const viewNames = (V['Systems/Outlook'] || []).join(' | ');
      if (nonStress.length && nonStress.some((i) => viewNames.includes(i.title || '\u0000'))) mark('R7', 'innocent', j, { line: hit[1], titles: nonStress.map((i) => i.title) });
      else { onShare('R7', hit[1]); } if (!(nonStress.length && nonStress.some((i) => viewNames.includes(i.title || '\u0000')))) mark('R7', 'fault', j, { line: hit[1], cause, titles: crit.map((i) => i.title) }); } }

  // R8 (a) woodland words where the record holds no woodland
  { const res = [...(T.config?.nearbyResources || [])]; const terr = String(T.config?.terrainType || '');
    const wood = res.some((r) => WOOD_RES.has(r)) || /forest|jungle|wood/.test(terr);
    const wl = lines.filter(([, l]) => WOOD_WORD.test(l));
    const game = lines.find(([, l]) => l.includes('game from the woods'));
    if (game) { if (!wood) onShare('R8a', game[1]); if (!wood) mark('R8a', 'fault', j, { line: game[1], terrain: terr, res }); else mark('R8a', 'innocent', j, { line: game[1] }); }
    if (!wood) for (const [v, l] of wl) for (const s of sentences(l)) if (WOOD_WORD.test(s)) sub('R8a-other', `${v} :: ${norm(s).slice(0, 140)}`, j, { terrain: terr });
    // (b) a commodity chip under a category the page says is needed and not brought in
    const need = lines.find(([, l]) => l.startsWith('Needed, and not brought in: '));
    if (need) {
      const nn = need[1].replace(/^Needed, and not brought in: /, '').replace(/\.$/, '').split(', ').map((x) => x.trim().toLowerCase());
      const canon = (x) => x.replace(/ goods$/, '').replace(/s$/, '');
      let chips = []; try { chips = L.commoditiesShown(T).map((c) => String(c.label).toLowerCase()); } catch { /* */ }
      const both = chips.filter((c) => nn.some((n) => canon(n) === canon(c)));
      if (both.length) { onShare('R8b', need[1]); mark('R8b', 'fault', j, { need: need[1], chips: both }); for (const b of both) sub('R8b', b, j, { need: need[1] }); }
      else if (chips.length) mark('R8b', 'innocent', j);
    } }

  // R11 date palms
  { const res = T.config?.nearbyResources || [];
    if (res.includes('date_palms')) {
      const src = T.economicState?.foodSecurity?.foodRecord?.foodSources || [];
      const g = lines.filter(([v, l]) => /Desert grain/.test(l) || (v === 'Systems/Economics' && /^grain$/i.test(l)) || (v === 'Systems/Resources' && /^grain$/i.test(l)));
      if (!src.includes('grain') && g.length) onShare('R11', g[0][1]); if (!src.includes('grain') && g.length) mark('R11', 'fault', j, { sources: src, lines: g.slice(0, 3).map(([v, l]) => `${v}: ${l}`) });
      else mark('R11', 'innocent', j, { sources: src });
    } }

  // R13: a bare role title (a card's `role` with no article, capitalised) standing in a person's place in a sentence that
  // names a person in full (the second-mention rule's role rung); a title before a name ("Elder Anna X") or inside a
  // power's name ("Headman's Authority", "Elder Council") is not one.
  { const titles = new Set();
    for (const p of npcs) { const w = String(p.role || '').trim(); if (w && /^[A-Z]/.test(w) && !/^(the|a|an) /i.test(w)) titles.add(w); }
    const nameWords = new Set(names.flatMap((n) => n.split(' ')));
    const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const check = (ls, tag) => { const hits = [];
      for (const [v, l] of ls) { if (/^Connection:|^Backs/.test(l)) continue;
        for (const sn of sentences(l)) { if (!names.some((n) => sn.includes(n)) || sn.includes(' · held by')) continue;
          for (const t of titles) { if (nameWords.has(t.split(' ')[0])) continue;
            const re = new RegExp(`(?<![A-Za-z’'])(?<![A-Z][a-z]+ )(?<!\\bthe )(?<!, the [^,]+ and )\\b${esc(t)}\\b(?!'s [A-Z])(?! [A-Z])(?!'s (Authority|Council|Hall))`);
            if (re.test(sn) && !names.some((n) => sn.includes(`${t} ${n}`))) hits.push({ view: `${tag}${v}`, line: sn, title: t });
          } } }
      return hits; };
    const h = check(lines, ''); const sh = check(slines, 'SHARE:');
    if (h.length) { mark('R13', 'fault', j, h[0]); for (const x of h) sub('R13', `${x.view} :: ${norm(x.line).slice(0, 120)}`, j, x); }
    else if ((T.relationships || []).length) mark('R13', 'innocent', j);
    if (sh.length) mark('R13share', 'fault', j, sh[0]); }

  // VACUOUS ROW: printed Famine over production >= adequate, holding fish
  { try { const facts = L.factsOf(T); const fam = L.atomHolds('food: = famine', facts) === true;
      if (fam) { const cap = L.deriveAllCapacities(T); const band = cap?.capacities?.food_production?.band; const fish = L.atomHolds('fish', facts);
        if (['adequate', 'surplus'].includes(band)) {
          const slots = L.deriveDailyLife(T, { audience: 'owner' }).slots;
          (fish === true ? mark : (k, kind, jj, ex) => mark('VACUOUS-nofish', 'fault', jj, ex))('VACUOUS', 'fault', j, { band, fish, dawn: slots.dawn_work?.text, fare: slots.food_culture?.text });
        } } } catch (e) { sub('VACUOUS-err', String(e.message).slice(0, 80), j, {}); } }

  // OVERVIEW-NAMES-THE-SEAT
  { const ov = (V['Summary/Overview'] || []).find((l) => / ?Governed by /.test(l));
    const pw = (V['Systems/Power'] || []).find((l) => l.startsWith('The seat'));
    const gov = ov ? ov.replace(/^.*Governed by /, '').split(' · ')[0] : null;
    const holder = pw ? pw.replace(/^The seat/, '').split(',')[0].trim() : null;
    const person = holder && names.includes(holder);
    if (gov && person) {
      const spw = (SV['Systems/Power'] || []).find((l) => l.startsWith('The seat'));
      const sHolder = spw ? spw.replace(/^The seat/, '').split(',')[0].trim() : null;
      const npc = npcs.find((p) => p.name === holder);
      const veiled = L.cardInstitutionVeilOf(npc) === 'veiled';
      const shareNames = slines.some(([, l]) => l.includes(holder));
      onShare('SEAT (Governed by)', ov); mark('SEAT', 'fault', j, { overview: `Governed by ${gov}`, power: pw });
      if (veiled || sHolder !== holder) { mark('SEAT-veiled', 'fault', j, { holder, veiled, shareSeat: spw || null, shareNamesHolderAnywhere: shareNames });
        if (shareNames) mark('SEAT-veiled-named-on-share', 'fault', j, { holder, where: slines.filter(([, l]) => l.includes(holder)).slice(0, 2) }); }
    } else if (gov) mark('SEAT', 'innocent', j, { overview: `Governed by ${gov}`, power: pw || null });
  }
}

const out = { label: LABEL, items: R, pairs: Object.fromEntries([...pairs].sort((a, b) => b[1].n - a[1].n)) };
for (const it of Object.values(R)) { it.faultN = it.faultSeeds.length; it.innocentN = it.innocentSeeds.length; }
writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const [k, it] of Object.entries(R).sort()) console.log(k.padEnd(60), 'fault', String(it.faultN).padStart(4), JSON.stringify(it.fault), 'innocent', it.innocentN);
