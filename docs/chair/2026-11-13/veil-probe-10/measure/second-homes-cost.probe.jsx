// VEIL-10, V7-2 measure: what the identity rule costs the page. On born towns (the guard's four,
// tests/security/gallerySecondHomes.pglite.test.js :: TOWNS, in both stored shapes, the DM reveal off and on; and a
// wider sample of 240, new shape, reveal off), with the DEFAULT veil, with EVERY EYE SHUT, and with the ties'
// description switch alone shut: each of the five second homes that the projection carries, whether the client's
// twin sends it, and (by this probe's own reading of the record, not the rule's) whether the eye of the source the
// composer built it from is shut. Run once at the base bytes (V10_VEIL names a copy of the base's galleryVeil.js beside
// it, importing a copy of the base's gallerySecondHomes.js) and once after; `second-homes-cost.diff.mjs` compares.
// Read-only; writes one JSON file (V10_OUT). Run: V10_SRC=<worktree> V10_PROBE=second-homes-cost.probe.jsx
//   V10_OUT=<file> npx vitest run --config <a config whose root is the worktree and whose include is this file>
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.V10_SRC;
vi.mock(`${process.env.V10_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const low = (t) => String(t ?? '').toLowerCase();
const TOWNS = [
  { seed: 'rv5-plant-city-infiltrated-0', settType: 'city', stress: 'infiltrated' },
  { seed: 'rv5-plant-hamlet-infiltrated-0', settType: 'hamlet', stress: 'infiltrated' },
  { seed: 'cv6-proc-metropolis-infiltrated-0', settType: 'metropolis', stress: 'infiltrated' },
  { seed: 'cv6-proc-city-infiltrated-2', settType: 'city', stress: 'infiltrated' },
];
it('the five second homes on born towns', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/${process.env.V10_VEIL || 'galleryVeil.js'}`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (t) => gen(density.birthConfig({ ...DEFAULT_CONFIG, ...BROWSER, settType: t.settType, ...(t.stress ? { selectedStresses: [t.stress], selectedStressesRandom: false } : {}) }), null, { seed: t.seed, customContent: {} });
  const oldPerson = (p) => {
    const { memberships, allegiance, institution, ...rest } = p;
    const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
    const out = { ...rest };
    if (ms[0]) out.factionAffiliation = ms[0].power;
    if (ms[1]) out.secondaryAffiliation = ms[1].power;
    if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
    if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key;
    if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; }
    return out;
  };
  const oldTie = ({ from, to, id: _id, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
  const shapes = (born) => ({
    new: { ...born, publicProse: compose(born) },
    old: (() => { const s = structuredClone(born); s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p));
      s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t)); s.schemaVersion = 1; return s; })(),
  });
  const everyEyeShut = (pub) => veil.curateModelFor(pub, []).sections.flatMap((sec) => [...sec.groupings.map((g) => g.address), ...sec.switches.map((x) => x.address),
    ...sec.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
  const tail = (d) => (typeof d === 'string' && d.split('—')[1] ? d.split('—')[1].trim() : '');
  /** @type {Record<string, { sent: boolean, sourceShut: boolean, how: string }>} */
  const rows = {};
  const sameTie = (pr) => (t) => t.npc1Name === pr.npc1 && t.npc2Name === pr.npc2 && t.typeName === pr.type;
  const measure = (label, record, dm) => {
    const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
    const veils = { default: [], everyEye: everyEyeShut(pub).map((a) => ({ address: a, hidden: true })), tieDescOnly: [{ address: 'class:relationship:description', hidden: true }] };
    for (const [vn, deltas] of Object.entries(veils)) {
      const hidden = veil.resolveVeil(veil.defaultVeilFor(pub), deltas);
      const shut = (kind, card, eye) => { const id = veil.CARD_KINDS[kind].idOf(card); return hidden.has(`field:${kind}:${id}:${eye}`) || (hidden.has(`class:${kind}:${eye}`) && !hidden.has(`except:field:${kind}:${id}:${eye}`)); };
      const out = veil.projectShareVeil(pub, veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' }));
      const put = (home, sent, sourceShut, how) => { rows[`${label}|dm${dm ? 1 : 0}|${vn}|${home}`] = { sent, sourceShut, how }; };
      const h = isRec(pub.history) ? pub.history : {}; const ho = isRec(out.history) ? out.history : {};
      const events = [...(Array.isArray(h.historicalEvents) ? h.historicalEvents : []), ...(Array.isArray(h.eventsTimeline) ? h.eventsTimeline : [])].filter(isRec);
      (Array.isArray(h.legacyAnnotations) ? h.legacyAnnotations : []).forEach((a, i) => {
        if (!isRec(a) || typeof a.annotation !== 'string') return;
        const own = events.filter((e) => e.name === a.eventName);
        const clause = a.annotation.includes('What it left behind (');
        put(`annotation#${i}`, isRec(ho.legacyAnnotations?.[i]) && typeof ho.legacyAnnotations[i].annotation === 'string', own.some((e) => shut('event', e, 'lastingEffects')),
          `${own.length ? 'event by name' : 'NO EVENT'}; ${clause ? 'holds a lasting effect' : 'holds no lasting effect'}`);
      });
      const tens = (Array.isArray(h.currentTensions) ? h.currentTensions : []).filter(isRec);
      if (typeof h.siegeNarrative === 'string' && h.siegeNarrative) {
        const first = tens.find((t) => t.description || t.type);
        put('siegeNarrative', typeof ho.siegeNarrative === 'string', !!first && shut('tension', first, 'description'),
          `${tens.length} tension(s); another than the first shut: ${tens.some((t) => t !== first && shut('tension', t, 'description'))}`);
      }
      const ties = (Array.isArray(pub.relationships) ? pub.relationships : []).filter(isRec);
      const pr = pub.prominentRelationship; const pro = isRec(out.prominentRelationship) ? out.prominentRelationship : {};
      if (isRec(pr)) {
        const own = ties.filter(sameTie(pr));
        const stored = (Array.isArray(record.relationships) ? record.relationships : []).filter(isRec).filter(sameTie(pr));
        const orphan = own.length ? '' : stored.some((t) => t.covert === true) ? 'ORPHAN: its tie is covert, dropped from this projection by the public sanitiser' : 'ORPHAN: no such tie';
        const ds = own.some((t) => shut('relationship', t, 'description')); const ts = own.some((t) => shut('relationship', t, 'tension'));
        if (typeof pr.full === 'string') put('prominent.full', typeof pro.full === 'string', ds, orphan || 'tie by its ends and type');
        if (typeof pr.tension === 'string') put('prominent.tension', typeof pro.tension === 'string', ts, orphan || 'tie by its ends and type');
        if (typeof pr.phrasing === 'string') {
          const form = own.some((t) => t.tension === pr.phrasing) ? 'the tension alone' : own.some((t) => typeof t.tension === 'string' && pr.phrasing.endsWith(t.tension)) ? 'the names, the gloss, the tension'
            : own.some((t) => tail(t.description) && pr.phrasing.includes(tail(t.description))) ? 'the description' : 'OTHER';
          put('prominent.phrasing', typeof pro.phrasing === 'string', form === 'the description' ? ds : ts, orphan || `built from ${form}`);
        }
      }
      if (typeof pub.pressureSentence === 'string' && pub.pressureSentence) {
        const p = pub.pressureSentence;
        const src = ties.filter((t) => (t.tension && low(p).includes(low(t.tension))) || (tail(t.description) && low(p).includes(low(tail(t.description)))));
        const stress = Array.isArray(pub.stress) ? pub.stress.length > 0 : !!pub.stress;
        const covert = (Array.isArray(record.relationships) ? record.relationships : []).filter(isRec).filter((t) => t.covert === true && !ties.some(sameTie({ npc1: t.npc1Name, npc2: t.npc2Name, type: t.typeName })))
          .some((t) => t.tension && low(p).includes(low(t.tension)));
        const how = covert ? "ORPHAN: a covert tie's phrasing, its tie dropped from this projection by the public sanitiser" : src.length ? `a tie's phrasing (names both ends: ${src.some((t) => p.includes(t.npc1Name) && p.includes(t.npc2Name))})`
          : stress ? "the stress's line" : (isRec(pub.powerStructure) && pub.powerStructure.recentConflict === p) ? 'recentConflict' : 'another line (succession, a small place)';
        put('pressureSentence', typeof out.pressureSentence === 'string', src.some((t) => shut('relationship', t, 'description') || shut('relationship', t, 'tension')), how);
      }
      const people = (Array.isArray(pub.npcs) ? pub.npcs : []); const peopleOut = Array.isArray(out.npcs) ? out.npcs : [];
      people.forEach((n, i) => {
        if (!isRec(n) || !isRec(n.presentation) || typeof n.presentation.impression !== 'string') return;
        const ph = isRec(n.physical) ? Object.values(n.physical).filter((x) => typeof x === 'string' && x.length >= 12) : [];
        put(`impression#${i}`, isRec(peopleOut[i]) && isRec(peopleOut[i].presentation) && typeof peopleOut[i].presentation.impression === 'string', shut('npc', n, 'physical'),
          ph.some((x) => low(n.presentation.impression).includes(low(x))) ? 'holds a string of the appearance' : 'holds nothing of the appearance');
      });
    }
  };
  for (const t of TOWNS) { const born = birth(t); for (const [shape, record] of Object.entries(shapes(born))) for (const dm of [false, true]) measure(`guard:${t.seed}:${shape}`, record, dm); }
  const N = Number(process.env.V10_N || 20);
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    let born; try { born = birth({ seed: `v72-facts-${settType}-${stress || 'calm'}-${i}`, settType, stress }); } catch { continue; }
    measure(`wide:${settType}-${stress || 'calm'}-${i}:new`, shapes(born).new, false);
  }
  writeFileSync(process.env.V10_OUT, JSON.stringify(rows));
}, 14400000);
