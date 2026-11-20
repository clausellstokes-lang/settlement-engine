// VEIL-19's builder, MEASURE FIRST for V10-5 (the seventh chair's addition to item B, 00:53 UTC): a criminal house born
// without `catalogId`, renamed by name alone and hidden whole, leaves its birth name in its own chain and in a mention. The
// proposed cure by positive account: a chain is kept only where a served house accounts for it, and a HIDEABLE CATALOGUE NAME
// that no served house bears is withheld (searched as a hidden name). This probe measures, through the client's twin of the
// tree (the server and the twin send the same document: the acceptance and the born runs), what that cure would ALSO drop on
// born towns: the 48 births of bcd-born.probe.jsx, both stored shapes, the default veil and every eye shut, Reveal DM off and
// on. On each read that hides a house whole: (1) every key and string the name search would take for the hideable catalogue
// names (cardVeil.js :: isHideableHouse over the catalogue's rows, its shelf as the category) that no house still listed bears
// (by its name in the one fold or its catalogue identity), the floors aside as the walk keeps them; (2) every chain of
// economicState.activeChains whose processing names some house still listed does not answer (the engine's processor match:
// the lowered name holds the name's first twelve characters, or a stamped house's identity holds its fold).
//   RV6_SRC=<tree> RV6_PROBE=v105-measure.probe.jsx V105_OUT=<file> R5_N=4 npx vitest run --config <this dir>/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
it('V10-5 measure: what a hideable catalogue name withheld where no served house bears it would drop', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { buildNameSearch, caseFold, foldName } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { institutionalCatalog } = await import(`${SRC}/src/data/institutionalCatalog.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const HIDEABLE = new Set();
  for (const shelves of Object.values(institutionalCatalog)) for (const [shelf, rows] of Object.entries(shelves || {})) for (const [name, row] of Object.entries(rows || {})) {
    if (isHideableHouse({ name, category: shelf, ...row })) HIDEABLE.add(name);
  }
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5_N || 4); const PFX = process.env.R5_SEED || 'v11-ties';
  const t = { reads: 0, readsHiding: 0, readsDrop: 0, leaves: 0, chains: 0, readsChain: 0 };
  const byName = {}; const byPath = {}; const ex = []; const chainEx = []; let towns = 0;
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const record = { ...born, publicProse: compose(born) };
    const text = JSON.stringify(record);
    for (const kind of ['default', 'all']) for (const dm of [false, true]) {
      let eyes = [];
      if (kind === 'all') {
        const m = veil.curateModelFor(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: {} }), []);
        eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
          ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
      }
      const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      const doc = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: ov }), ov);
      t.reads += 1;
      const listed = (Array.isArray(doc.institutions) ? doc.institutions : []).filter(isRec);
      if (listed.length === (born.institutions || []).filter(isRec).length) continue;
      t.readsHiding += 1;
      const bears = new Set(listed.flatMap((h) => [caseFold(str(h.name)), str(h.catalogId)]));
      const extra = [...HIDEABLE].filter((n) => !bears.has(caseFold(n)) && !bears.has(foldName(n)));
      const opens = [...listed.map((h) => (str(h.name) !== '' ? str(h.name) : str(h.label))), ...listed.map((h) => str(h.catalogId)).filter(Boolean),
        ...((doc.powerStructure && Array.isArray(doc.powerStructure.factions)) ? doc.powerStructure.factions : []).filter((f) => isRec(f) && f.hidden !== true).flatMap((f) => [str(f.faction), str(f.name)])];
      const search = buildNameSearch(new Set(extra), opens);
      let dropped = 0;
      const walk = (v, p) => {
        if (typeof v === 'string') { if (search && search.hit(v)) { dropped += 1; const k = p.replace(/\[\d+\]/g, '[]'); byPath[k] = (byPath[k] || 0) + 1;
          for (const n of extra) if (buildNameSearch(new Set([n]), opens)?.hit(v)) byName[n] = (byName[n] || 0) + 1;
          if (ex.length < 25) ex.push(`${settType}/${stress || 'calm'}/${i} ${kind} ${dm ? 'dm' : 'off'} ${p} = ${JSON.stringify(v.slice(0, 90))}`); } return; }
        if (Array.isArray(v)) { v.forEach((x, j) => walk(x, `${p}[${j}]`)); return; }
        if (isRec(v)) for (const [k, x] of Object.entries(v)) { if (search && search.hit(k)) { dropped += 1; const kp = `${p}.<KEY>`; byPath[kp] = (byPath[kp] || 0) + 1; } walk(x, `${p}.${k}`); }
      };
      // the floors stay as the walk keeps them: the town's name and each listed house's id and name
      walk({ ...doc, name: undefined, institutions: listed.map((h) => ({ ...h, id: undefined, name: undefined, label: undefined, catalogId: undefined })) }, '$');
      if (dropped) { t.readsDrop += 1; t.leaves += dropped; }
      // chains: a processing name no listed house answers (the engine's processor match)
      const answers = (x) => listed.some((h) => { const lx = x.toLowerCase().slice(0, 12); return str(h.name) === x || str(h.name).toLowerCase().includes(lx) || (str(h.catalogId) !== '' && foldName(x.slice(0, 12)) !== '' && str(h.catalogId).includes(foldName(x.slice(0, 12)))); });
      let ch = 0;
      for (const c of (doc.economicState && Array.isArray(doc.economicState.activeChains) ? doc.economicState.activeChains : []).filter(isRec)) {
        const names = (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).filter((x) => typeof x === 'string');
        if (names.some((x) => !answers(x))) { ch += 1; if (chainEx.length < 12) chainEx.push(`${settType}/${stress || 'calm'}/${i} ${kind} ${dm ? 'dm' : 'off'} ${str(c.label)}: ${JSON.stringify(names.filter((x) => !answers(x)))}`); }
      }
      if (ch) { t.readsChain += 1; t.chains += ch; }
    }
  }
  const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `    ${k}: ${v}`).join('\n');
  writeFileSync(process.env.V105_OUT, [`v105-measure: ${towns} towns; hideable catalogue names ${HIDEABLE.size}: ${JSON.stringify([...HIDEABLE])}`,
    `reads ${t.reads}; reads that hide a house whole ${t.readsHiding}`,
    `(1) THE NAMES: reads that would lose a key or string ${t.readsDrop}; keys and strings ${t.leaves}`, '  by path:', top(byPath), '  by name:', top(byName), '  e.g.:', ...ex.map((e) => `    ${e}`),
    `(2) THE CHAINS: reads with a chain whose processing names no listed house answers ${t.readsChain}; chains ${t.chains}`, ...chainEx.map((e) => `    ${e}`)].join('\n') + '\n');
}, 14_400_000);
