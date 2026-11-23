// R5D-SSKIP's FIRST MEASURE (an instrument; no edit). node sskip-measure.mjs <stored-dir> | born-a | born-recent | actT
// The twin engine (projectShareVeil over galleryPayloadFor) at the owner's own setting, Reveal off and DM, both doors
// (rederiveForPage on a copy; rederiveServed) = the fidelity arm's twin half (N67: server sha = twin sha on every stored read).
import { readFileSync, readdirSync } from 'node:fs';
const W = process.env.SSKIP_TREE || '/home/user/wt/sskip';
const MODE = process.argv[2];
const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
const page = await import(`${W}/src/domain/veil/pageRederive.js`);
const imp = await import(`${W}/src/domain/veil/importRederive.js`);
const { standingBase } = await import(`${W}/src/domain/display/galleryWithholdAlways.js`);
const { SEAT_CONTESTED_STANDING } = await import(`${W}/src/generators/power/factionStanding.js`);
const { HIDDEN_POWER_MASK } = await import(`${W}/src/domain/display/publicSafe.js`);
const { isHideableHouse, isVeiledPower } = await import(`${W}/src/domain/people/cardVeil.js`);
const { seatKey } = await import(`${W}/src/domain/density/seatKey.js`);
const { compileRows, cutDesc, readTable } = await import(`${W}/scripts/veil/standingForms.mjs`);
// THE SEVEN, read from their one table's source text (an instrument's reading; the cure imports them)
const src = readFileSync(`${W}/src/generators/density/applyDensityLaw.js`, 'utf8');
const block = src.slice(src.indexOf('const A_SECOND_WATCH'), src.indexOf('].map((row) => Object.freeze(') + 1);
const table = new Function(`${block.replace(/\/\*\*[\s\S]*?\*\//g, '').replace('const RIVAL_DESC_OF_HOST =', 'return').replace(/Object\.freeze\(\[/, '([')})`)();
const SEVEN = new Set(table.map((r) => r[1]));
if (SEVEN.size !== 7) throw new Error(`the seven: ${SEVEN.size}`);

const ROWS = compileRows(readTable().forms);
const refCut = (d) => cutDesc(d, ROWS);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = JSON.stringify;
const nameOf = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');
const isCut = (f) => isRec(f) && (f.hidden === true || f.faction === HIDDEN_POWER_MASK || f.name === HIDDEN_POWER_MASK);
const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AT = '2026-11-01T00:00:00.000Z';
const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: AT });
const withheldOf = (stored, d) => { const s = new Set(listsOf(d).filter((f) => !isCut(f)).map(nameOf).filter(Boolean)); return [...new Set(listsOf(stored).map(nameOf).filter((n) => n && !s.has(n)))]; };
const hidesNothing = (stored, d) => !withheldOf(stored, d).length && !listsOf(d).some(isCut)
  && arr(stored.institutions).every((h) => arr(d?.institutions).some((x) => isRec(x) && x.name === h.name));
const hidesAny = (t) => arr(t.institutions).some((h) => isRec(h) && isHideableHouse(h)) || listsOf(t).some((f) => f.hidden === true);
const handHidesOf = (t) => {
  const fs = arr(t.powerStructure?.factions).filter(isRec); const out = [];
  const rival = fs.find((f) => typeof f.contestsNiche === 'string');
  const host = rival ? fs.find((f) => f !== rival && seatKey(f) === rival.contestsNiche && !f.hidden) : null;
  if (host) out.push({ kind: 'density host', name: nameOf(host) });
  const noble = fs.find((f) => !f.isGoverning && !f.hidden && (f.category === 'noble' || ['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household'].includes(nameOf(f))));
  if (noble && !out.some((x) => x.name === nameOf(noble))) out.push({ kind: 'noble power', name: nameOf(noble) });
  return out.map((h) => { const x = clone(t); x.powerStructure.factions = x.powerStructure.factions.map((f) => (nameOf(f) === h.name ? { ...f, hidden: true } : f)); return { ...h, t: x }; });
};

async function poolOf() {
  if (MODE.startsWith('/')) {
    const index = readdirSync(MODE).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${MODE}/${f}`, 'utf8')).index);
    return index.map((j) => ({ seed: j.seed, t: JSON.parse(readFileSync(`${MODE}/${j.seed}.json`, 'utf8')) }));
  }
  const { generateSettlementPipeline } = await import(`${W}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${W}/src/store/configSlice.js`);
  const { BIRTH_DIALS } = await import(`${W}/tests/security/veilChain.shared.mjs`);
  await loadGenerationLawPayloads();
  const gen = (cfg, seed) => { const t = clone(generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })); delete t.publicProse; return t; };
  const out = [];
  if (MODE === 'born-a') {
    const P_SIZES = ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis'];
    const P_CRISES = ['none', 'infiltrated', 'none', 'insurgency', 'occupied', 'indebted', 'none', 'under_siege', 'wartime', 'politically_fractured'];
    let idx = 0;
    for (let k = 0; k < 2; k += 1) for (const size of P_SIZES) for (const crisis of P_CRISES) {
      idx += 1; const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
      out.push({ seed, t: gen({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }, seed) });
    }
  } else if (MODE === 'born-recent') {
    for (const prefix of ['r5c2-m3', 'r5c2-m3b']) for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 40; i += 1) {
      const seed = `${prefix}-${size}-${i}`; out.push({ seed, t: gen({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }, seed) });
    }
  } else if (MODE === 'actT') {
    const { transferRulingPower } = await import(`${W}/src/domain/rulingPower.js`);
    const born = gen({ ...DEFAULT_CONFIG, settType: 'city' }, 'jp6-city-8');
    const fs = arr(born.powerStructure?.factions); const gov = fs.find((f) => f?.isGoverning);
    const A = nameOf(fs.find((f) => isRec(f) && f !== gov && !isVeiledPower(f)));
    const hid = clone(born); hid.powerStructure.factions = hid.powerStructure.factions.map((f) => (nameOf(f) === A ? { ...f, hidden: true } : f));
    const tr = transferRulingPower(hid, A, { cause: 'coup' });
    out.push({ seed: 'jp6-city-8 born', t: born });
    if (!tr.error) out.push({ seed: `jp6-city-8 act T (${A})`, t: clone(tr.settlement), actT: true });
  } else throw new Error(`mode ${MODE}`);
  return out;
}


// THE NEVER-THERE PAGE (the test's own construction, galleryVeilDesc.pglite.test.js :: neverThere, copied as an instrument)
const { buildNameSearch } = await import(`${W}/src/domain/display/gallerySecondHomes.js`);
const ci = (a, b) => typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();
const openNamesOf = (d) => [...new Set([...listsOf(d).filter((f) => !isCut(f)).map(nameOf), ...arr(d?.institutions).filter(isRec).map((h) => h.name)].filter((v) => typeof v === 'string' && v && v !== HIDDEN_POWER_MASK))];
function namesWithheld(text, withheld, d) {
  if (typeof text !== 'string' || text === '' || !withheld.length) return false;
  const search = buildNameSearch(withheld, openNamesOf(d).filter((n) => !withheld.some((w) => ci(w, n))));
  return !!search && search.hit(text);
}
function strings(v, p = '', out = []) {
  if (typeof v === 'string') out.push([p, v]); else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${p}[${i}]`, out));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) strings(x, p ? `${p}.${k}` : k, out);
  return out;
}
const withheldAllOf = (stored, d) => { const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name)); return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])]; };
const stampedOf = (t) => arr(t.powerStructure?.factions).filter((f) => isRec(f) && f.hidden === true).map(nameOf).filter(Boolean);
const maskAll = (v, names, isRoot = true) => {
  if (typeof v === 'string') return names.reduce((x, n) => x.split(n).join(HIDDEN_POWER_MASK), v);
  if (Array.isArray(v)) return v.map((x) => maskAll(x, names, false));
  if (isRec(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, (isRoot && k === 'name') || (k === 'id' && typeof x === 'string') ? x : maskAll(x, names, false)]));
  return v;
};
/** THE CHAIR's N63 CLOSURE (N101's condition): a density rival whose host is withheld is withheld too (every row whose stored
 * `contestsNiche` equals a withheld row's seatKey), closed over; this tree lacks R5D-RIVAL's server rule, so the count's
 * never-there builds it. Returns the closed set and the rows it added. */
const rivalClosure = (t, wh) => {
  const pw = new Set(wh); const added = []; let grew = true;
  while (grew) {
    grew = false;
    const keys = new Set(listsOf(t).filter((f) => pw.has(nameOf(f))).map((f) => seatKey(f)));
    for (const f of listsOf(t)) if (typeof f.contestsNiche === 'string' && keys.has(f.contestsNiche) && !pw.has(nameOf(f))) { pw.add(nameOf(f)); added.push(nameOf(f)); grew = true; }
  }
  return { wh: [...pw], added };
};
const neverThere = (t, wh0, dm = true) => {
  const { wh } = rivalClosure(t, wh0);
  let x = clone(t); const stamped = stampedOf(t).filter((n) => wh.includes(n));
  x.institutions = arr(x.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
  const keep = (f) => !(isRec(f) && wh.includes(nameOf(f)));
  if (isRec(x.powerStructure)) {
    x.powerStructure.factions = arr(x.powerStructure.factions).filter(keep);
    x.powerStructure.factionRelationships = arr(x.powerStructure.factionRelationships).filter((r) => !(isRec(r) && arr(r.pair).some((n) => wh.includes(String(n)))));
  }
  if (Array.isArray(x.factions)) x.factions = x.factions.filter(keep);
  const tensionNames = (c) => { const { factions: _p, ...own } = c; return strings(own).some(([, v]) => namesWithheld(v, wh, t)); };
  if (isRec(x.history)) x.history.currentTensions = arr(x.history.currentTensions).filter((c) => !(isRec(c) && tensionNames(c)))
    .map((c) => (isRec(c) && Array.isArray(c.factions) ? { ...c, factions: c.factions.filter((n) => !wh.includes(String(n))) } : c));
  if (!dm && stamped.length) x = maskAll(x, stamped);
  return x;
};
const NT = process.env.SSKIP_NT === '1';
/** N102's FOUR CLASSES of a nothing-hidden difference (my reading, vetoable): KIND = the standing's form ids, master's and the
 * history's wordings folded (M-/H- dropped); SLOTS = the served roster's names the standing text names, in order of first
 * appearance. (a) both carry a standing, same kinds and slots; (b) both carry one, another kind or other slots; (c) stored none,
 * S some; (d) stored some, S none. */
const cls = { rows: {}, reads: {}, ex: {} };
const kindsOf = (c) => J((c?.ids ?? []).map((id) => id.replace(/^[HM]-/, '')).sort());
const slotsOf = (text, names) => J(names.filter((n) => n && text.includes(n)).sort((a, b) => text.indexOf(a) - text.indexOf(b)));
const nt = { cells: {}, ex: [], closure: { reads: 0, rows: 0, places: new Set() } }; // kind|template|equal-or-not = rows (door-reads)
const pool = await poolOf();
// SSKIP_SHAS=<file>: each birth's sha256 (its JSON as generated), the same-seed byte check of births before and after
if (process.env.SSKIP_SHAS) {
  const { createHash } = await import('node:crypto'); const { writeFileSync } = await import('node:fs');
  writeFileSync(process.env.SSKIP_SHAS, pool.map(({ seed, t }) => `${seed}\t${createHash('sha256').update(J(t)).digest('hex')}`).join('\n') + '\n');
  if (process.env.SSKIP_SHAS_ONLY) process.exit(0);
}
const m = { places: pool.length, rows: 0, rivals: 0, rivalsBase7: 0, rivalsNot7: [], natural7: [], base7: 0, ii: [], cutDisagree: [],
  nh: { pages: 0, rows: 0, faults: [], faultRows: new Set(), faultPlaces: new Set(), i: [], iii: [], cureClass: 0, listedSeat: 0, veiled: 0 },
  hide: { recs: 0, reads: 0, rows: 0, iii: [], cureClass: 0, byHow: {}, places: new Set(), rowsU: new Set() } };
for (const { seed, t } of pool) {
  for (const f of listsOf(t)) {
    if (typeof f.desc !== 'string') continue;
    m.rows += 1;
    const base = standingBase(f.desc); const c = refCut(f.desc);
    if ((c ? c.base : f.desc) !== base) m.cutDisagree.push(`${seed} ${nameOf(f)}`);
    const b7 = SEVEN.has(base);
    if (typeof f.contestsNiche === 'string') { m.rivals += 1; if (b7) m.rivalsBase7 += 1; else if (m.rivalsNot7.length < 400) m.rivalsNot7.push(`${seed} ${nameOf(f)}: ${J(base).slice(0, 70)}`); }
    else if (b7) m.natural7.push(`${seed} ${nameOf(f)}`);
    if (b7) { m.base7 += 1; if (base !== f.desc) m.ii.push(`${seed} ${nameOf(f)}: ${J(f.desc).slice(-120)}`); }
  }
  // every read at the owner's own setting: the place itself (nothing hidden or its house hides), then its hand hides
  const recs = [{ how: hidesAny(t) ? 'house hide' : 'nothing hidden', t }, ...handHidesOf(t).map((h) => ({ how: `hand hide ${h.kind}`, t: h.t }))];
  for (const { how, t: r } of recs) {
    if (how !== 'nothing hidden') m.hide.recs += 1;
    const want = new Map(arr(r.powerStructure?.factions).filter(isRec).map((f) => [nameOf(f), f.desc]));
    for (const dm of [false, true]) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(r), { shareDm: dm, memberOverrides: ov }), ov);
      const nothing = hidesNothing(r, twin);
      let ntTwin = null;
      if (NT && !nothing) { const wh = withheldAllOf(r, twin); const cl = rivalClosure(r, wh).added; if (cl.length) { nt.closure.reads += 1; nt.closure.rows += cl.length; nt.closure.places.add(`${seed} (${how})`); } const ng = neverThere(r, wh, dm); ntTwin = veil.projectShareVeil(veil.galleryPayloadFor(clone(ng), { shareDm: dm, memberOverrides: ov }), ov); }
      for (const door of ['page', 'import']) {
        const p = door === 'page' ? page.rederiveForPage(clone(twin)) : imp.rederiveServed(twin);
        const tagr = `${seed} (${how}) ${door} dm=${dm}`;
        const pn = ntTwin ? new Map(arr((door === 'page' ? page.rederiveForPage(clone(ntTwin)) : imp.rederiveServed(ntTwin))?.powerStructure?.factions).filter((x) => isRec(x) && !isCut(x)).map((x) => [nameOf(x), x.desc])) : null;
        const sRow = new Map(arr(r.powerStructure?.factions).filter(isRec).map((x) => [nameOf(x), x]));
        if (nothing) m.nh.pages += 1; else m.hide.reads += 1;
        for (const f of arr(p?.powerStructure?.factions).filter((x) => isRec(x) && !isCut(x))) {
          const n = nameOf(f); const v = f.desc; const sd = want.get(n);
          const sHas = typeof sd === 'string' && standingBase(sd) !== sd;
          const b7 = typeof sd === 'string' && SEVEN.has(standingBase(sd));
          const adds = typeof v === 'string' && typeof sd === 'string' && !sHas && v !== sd; // S gives a row with no stored standing a tail
          if (nothing) {
            m.nh.rows += 1;
            if (v === undefined) { m.nh.veiled += 1; continue; }
            if (v !== sd) {
              if (typeof sd === 'string' && (refCut(sd)?.standing ?? '').includes(SEAT_CONTESTED_STANDING)) { m.nh.listedSeat += 1; continue; }
              m.nh.faults.push(`${tagr} ${n}`);
              {
                const a = typeof sd === 'string' ? refCut(sd) : null; const b = typeof v === 'string' ? refCut(v) : null;
                const names = arr(p?.powerStructure?.factions).filter((x) => isRec(x) && !isCut(x)).map(nameOf);
                const k = !a && b ? '(c) stored none, S some' : a && !b ? '(d) stored some, S none' : !a && !b ? '(e) neither has a standing (the base differs)'
                  : kindsOf(a) === kindsOf(b) && slotsOf(a.standing, names) === slotsOf(b.standing, names) ? '(a) same kind and slots' : '(b) another kind or other slots';
                cls.reads[k] = (cls.reads[k] || 0) + 1;
                if (!m.nh.faultRows.has(`${seed} ${n}`)) { cls.rows[k] = (cls.rows[k] || 0) + 1; (cls.ex[k] ||= []); if (cls.ex[k].length < 3) cls.ex[k].push(`${seed} ${n} (${door} dm=${dm}):\n      STORED ${J(sd)}\n      S ${J(v)}\n      stored kinds ${kindsOf(a)} slots ${a ? slotsOf(a.standing, names) : '[]'} | S kinds ${kindsOf(b)} slots ${b ? slotsOf(b.standing, names) : '[]'}`); }
              }
              m.nh.faultRows.add(`${seed} ${n}`); m.nh.faultPlaces.add(seed);
              if (!b7) m.nh.i.push(`${tagr} ${n}: stored ${J(sd).slice(-120)} | page ${J(v).slice(-120)}`);
            }
            if (adds) { if (b7) m.nh.cureClass += 1; else m.nh.iii.push(`${tagr} ${n}: stored ${J(sd).slice(-100)} | page ${J(v).slice(-120)}`); }
          } else {
            m.hide.rows += 1;
            if (adds && pn) {
              const tpl = b7 ? 'T12' : typeof sRow.get(n)?.contestsNiche === 'string' ? 'T13' : 'natural';
              const eq = pn.get(n) === v; const key = `${how}|${tpl}|${eq ? 'equal never-there' : pn.has(n) ? 'NOT equal' : 'NOT equal (the row is not on the never-there page: N63 dropped it)'}`;
              nt.cells[key] = (nt.cells[key] || 0) + 1;
              if (!eq && nt.ex.length < 40) nt.ex.push(`${tagr} ${n} [${tpl}]:\n      STORED ${J(sd)}\n      NEVER-THERE ${J(pn.get(n))}\n      S ${J(v)}`);
            }
            if (adds && !b7) { const k = how.replace(/ .*hide /, ' '); m.hide.byHow[how] = (m.hide.byHow[how] || 0) + 1; m.hide.places.add(seed); m.hide.rowsU.add(`${seed} (${how}) ${n}`); }
            if (adds) { if (b7) m.hide.cureClass += 1; else m.hide.iii.push(`${tagr} ${n}: stored ${J(sd).slice(-100)} | page ${J(v).slice(-120)}`); }
          }
        }
      }
    }
  }
}
const L = (xs, k = 12) => (xs.length ? `\n    ${xs.slice(0, k).join('\n    ')}` : '');
console.log(`SSKIP measure ${MODE} (tree ${W}): places ${m.places} | stored rows with a desc ${m.rows} | density rivals (contestsNiche) ${m.rivals}, base one of the seven ${m.rivalsBase7}, not ${m.rivalsNot7.length}`);
console.log(`  (c) NATURAL rows (no contestsNiche) whose base is one of the seven: ${m.natural7.length}${L(m.natural7)}`);
console.log(`  standingBase vs the reference cut disagree: ${m.cutDisagree.length}${L(m.cutDisagree)}`);
console.log(`  (ii) rows whose base is one of the seven (${m.base7}) that carry a STORED standing: ${m.ii.length}${L(m.ii)}`);
console.log(`  nothing-hidden twin door-pages ${m.nh.pages} | rows ${m.nh.rows} | veiled ${m.nh.veiled} | seat-contest listed ${m.nh.listedSeat} | FAULTS ${m.nh.faults.length} on rows ${m.nh.faultRows.size}, places ${m.nh.faultPlaces.size} ${J([...m.nh.faultRows])}`);
console.log(`  (i) faulting reads whose stored base is NOT one of the seven: ${m.nh.i.length}${L(m.nh.i)}`);
console.log(`  (iii) nothing-hidden: S gives a row with no stored standing a tail: base one of the seven ${m.nh.cureClass} | OTHER ${m.nh.iii.length}${L(m.nh.iii)}`);
console.log(`  (iii) hiding OTHER by kind ${J(m.hide.byHow)} | distinct record-rows ${m.hide.rowsU.size} | places ${m.hide.places.size}`);
console.log(`  (iii) hiding reads (house hides, hand hides; ${m.hide.recs} records, ${m.hide.reads} door-reads, ${m.hide.rows} rows): one of the seven ${m.hide.cureClass} | OTHER ${m.hide.iii.length}${L(m.hide.iii)}`);
if (m.rivalsNot7.length) console.log(`  rivals whose base is not one of the seven (copied host descs), first: ${L(m.rivalsNot7, 8)}`);
if (NT) console.log(`  N63 CLOSURE in the never-there: hiding (record x Reveal) reads where it dropped rows ${nt.closure.reads} | rows dropped ${nt.closure.rows} | records ${nt.closure.places.size}`);
if (NT) console.log(`  NEVER-THERE (rows S gives a tail, stored desc without one; per door-read): ${J(Object.fromEntries(Object.entries(nt.cells).sort()), null, 0)}${L(nt.ex, 40)}`);
console.log(`  N102 CLASSES of the nothing-hidden faults: rows ${J(cls.rows)} | door-reads ${J(cls.reads)}`);
for (const [k, xs] of Object.entries(cls.ex).sort()) console.log(`  ${k}:${L(xs, 3)}`);
