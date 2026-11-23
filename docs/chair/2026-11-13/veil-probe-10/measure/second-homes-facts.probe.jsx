// VEIL-10, V7-2 measure: what the five second homes ARE on 240 born towns, before any rule is chosen: what each composer
// built them from, as the record shows it (a pressureSentence that is a tie's phrasing, the ends it names, the stress on
// the town, recentConflict; the tie a prominentRelationship is the copy of, and the form of its phrasing; the tensions
// behind a siege narrative; the event behind an annotation, and whether it holds a lasting effect; an impression against
// its person's appearance). Read-only; prints one file (V10_OUT). Run as second-homes-cost.probe.jsx is run, V10_N=20.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.V10_SRC;
vi.mock(`${process.env.V10_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('facts', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const N = Number(process.env.V10_N || 4);
  const out = []; const agg = { towns: 0, ps: 0, psTie: 0, psBothEnds: 0, psRecent: 0, psStress: 0, psOther: 0, pr: 0, prTriple: 0, prTripleMany: 0, prPhrDesc: 0, prPhrTen: 0, prPhrNeither: 0,
    siege: 0, siegeFirstDesc: 0, siegeFirstType: 0, siegeOther: 0, ann: 0, annByName: 0, annByNameMany: 0, annNoEvent: 0, annClause: 0, annNoClause: 0, annEvNoEffects: 0, imp: 0, impEmbedsOwn: 0, npcs: 0 };
  const low = (t) => String(t ?? '').toLowerCase();
  for (const settType of sizes) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let s; try { s = gen(density.birthConfig(cfg), null, { seed: `v72-facts-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch (e) { out.push(`BIRTH FAILED ${settType} ${i}: ${e.message}`); continue; }
    agg.towns += 1;
    const ties = (s.relationships || []).filter(isRec);
    const tail = (d) => (typeof d === 'string' && d.split('—')[1] ? d.split('—')[1].trim() : '');
    const p = s.pressureSentence;
    const hasStress = Array.isArray(s.stress) ? s.stress.length > 0 : !!s.stress;
    for (const t of ties) { agg.ties = (agg.ties || 0) + 1; const a = t.npc1Name && String(t.tension).includes(t.npc1Name); const b = t.npc2Name && String(t.tension).includes(t.npc2Name);
      const k = a && b ? 'tieTenBoth' : (a || b) ? 'tieTenOne' : 'tieTenNone'; agg[k] = (agg[k] || 0) + 1;
      const da = t.npc1Name && String(t.description).includes(t.npc1Name); const db = t.npc2Name && String(t.description).includes(t.npc2Name);
      const kd = da && db ? 'tieDescBoth' : (da || db) ? 'tieDescOne' : 'tieDescNone'; agg[kd] = (agg[kd] || 0) + 1; if (String(t.description).includes('\u2014')) agg.tieDescDash = (agg.tieDescDash || 0) + 1; }
    if (typeof p === 'string' && p) {
      agg.ps += 1;
      const tie = ties.some(t => (t.tension && low(p).includes(low(t.tension))) || (tail(t.description) && low(p).includes(low(tail(t.description)))));
      const both = ties.some(t => t.npc1Name && t.npc2Name && p.includes(t.npc1Name) && p.includes(t.npc2Name));
      const one = ties.some(t => (t.npc1Name && p.includes(t.npc1Name)) || (t.npc2Name && p.includes(t.npc2Name)));
      const rc = !!(s.powerStructure && s.powerStructure.recentConflict === p);
      const key = `ps:${tie ? 'tieWords' : 'notTie'}:${both ? 'bothEnds' : one ? 'oneEnd' : 'noEnd'}:${rc ? 'recentConflict' : 'x'}:${hasStress ? 'stress' : 'calm'}`;
      agg[key] = (agg[key] || 0) + 1;
      if (tie) agg.psTie += 1; if (both) agg.psBothEnds += 1; if (rc) agg.psRecent += 1;
      const pub = veil.galleryPayloadFor(s, { shareDm: false, memberOverrides: {} });
      const pk = `pub: stress=${pub.stress === undefined ? 'absent' : 'present'} recentConflict=${pub.powerStructure && pub.powerStructure.recentConflict !== undefined ? 'present' : 'absent'} ps=${pub.pressureSentence === undefined ? 'absent' : 'present'}`;
      agg[pk] = (agg[pk] || 0) + 1;
      if (!tie && !rc && !hasStress) out.push(`PSREM ${settType}/${stress || 'calm'}/${i} both=${both} one=${one} :: ${p.slice(0, 170)}`);
      if (tie) out.push(`PSTIE ${settType}/${stress || 'calm'}/${i} both=${both} stress=${hasStress} :: ${p.slice(0, 170)}`);
    }
    const pr = s.prominentRelationship;
    if (isRec(pr)) {
      agg.pr += 1;
      const m = ties.filter(t => t.npc1Name === pr.npc1 && t.npc2Name === pr.npc2 && t.typeName === pr.type);
      if (m.length) agg.prTriple += 1; if (m.length > 1) agg.prTripleMany += 1;
      const t0 = m[0];
      if (t0) { const d = tail(t0.description) && low(pr.phrasing).includes(low(tail(t0.description))); const tn = t0.tension && low(pr.phrasing).includes(low(t0.tension));
        if (d) agg.prPhrDesc += 1; if (tn) agg.prPhrTen += 1; if (!d && !tn) agg.prPhrNeither += 1;
        const f = pr.phrasing === t0.tension ? 'prForm:equalsTension' : String(pr.phrasing).endsWith(String(t0.tension)) ? 'prForm:endsWithTension' : 'prForm:other'; agg[f] = (agg[f] || 0) + 1;
        if (pr.full !== t0.description || pr.tension !== t0.tension) agg.prCopyDiffers = (agg.prCopyDiffers || 0) + 1; }
      if (agg.pr <= 3) out.push(`PR ${settType}/${i} match=${m.length} keys=${Object.keys(pr).join(',')} :: ${String(pr.phrasing).slice(0, 110)} || FULL ${String(pr.full).slice(0, 90)} || TEN ${String(pr.tension).slice(0, 90)}`);
    }
    const h = isRec(s.history) ? s.history : {};
    const tens = (h.currentTensions || []).filter(isRec);
    if (typeof h.siegeNarrative === 'string' && h.siegeNarrative) {
      agg.siege += 1; agg[`siegeTensions:${tens.length}`] = (agg[`siegeTensions:${tens.length}`] || 0) + 1;
      const first = tens.find(t => t.description || t.type);
      if (first && first.description && low(h.siegeNarrative).includes(low(String(first.description).trim()))) agg.siegeFirstDesc += 1;
      else if (first && !first.description && low(h.siegeNarrative).includes(low(first.type))) agg.siegeFirstType += 1; else agg.siegeOther += 1;
      if (agg.siege <= 3) out.push(`SIEGE ${settType}/${i} tensions=${tens.length} :: ${h.siegeNarrative.slice(0, 160)}`);
    }
    const evs = [...(h.historicalEvents || []), ...(h.eventsTimeline || [])].filter(isRec);
    for (const a of (h.legacyAnnotations || []).filter(isRec)) {
      agg.ann += 1;
      const m = (h.historicalEvents || []).filter(isRec).filter(e => e.name === a.eventName);
      if (m.length) agg.annByName += 1; else agg.annNoEvent += 1; if (m.length > 1) agg.annByNameMany += 1;
      if (String(a.annotation).includes('What it left behind (')) agg.annClause += 1; else agg.annNoClause += 1;
      if (m[0] && !(Array.isArray(m[0].lastingEffects) && m[0].lastingEffects.length)) agg.annEvNoEffects += 1;
      if (agg.ann <= 6) out.push(`ANN keys=${Object.keys(a).join(',')} evKeys=${m[0] ? Object.keys(m[0]).join(',') : '-'} :: ${String(a.annotation).slice(0, 200)}`);
    }
    if (agg.towns <= 2) out.push(`EVENT LISTS historicalEvents=${(h.historicalEvents || []).length} eventsTimeline=${(h.eventsTimeline || []).length} ids=${evs.slice(0, 3).map(e => e.id).join('|')} tensionIds=${tens.slice(0, 3).map(e => e.id).join('|')} tensionKeys=${tens[0] ? Object.keys(tens[0]).join(',') : ''} tieKeys=${ties[0] ? Object.keys(ties[0]).join(',') : ''}`);
    for (const n of (s.npcs || []).filter(isRec)) {
      agg.npcs += 1;
      const im = isRec(n.presentation) ? n.presentation.impression : null;
      if (typeof im === 'string' && im) { agg.imp += 1;
        const ph = isRec(n.physical) ? Object.values(n.physical).filter(x => typeof x === 'string') : [];
        if (ph.some(x => x.length >= 12 && low(im).includes(low(x)))) agg.impEmbedsOwn += 1; }
    }
    if (agg.towns <= 3 && ties[0]) out.push(`TIE ${JSON.stringify({ d: ties[0].description, t: ties[0].tension, n1: ties[0].npc1Name, n2: ties[0].npc2Name, ty: ties[0].typeName, type: ties[0].type, id: ties[0].id, from: ties[0].from })}`);
  }
  writeFileSync(process.env.V10_OUT, `${JSON.stringify(agg, null, 1)}\n${out.join('\n')}\n`);
}, 14400000);
