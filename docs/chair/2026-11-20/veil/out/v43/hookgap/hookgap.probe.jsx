// V33-JOINPROBE step 5: E35's HOOK GAP, measured BOTH ENGINES on births of the joined tree (a measure; changes nothing).
// Run as the lane's probes run: RV6_SRC=<worktree> RV6_PGMOD=/var/tmp/v18/pgmod RV9_PROBE=<this file> RV9_SERVER_TPL=<tpl: v27x211 + the tree's 212>
//   RV9_SERVER_DB=<prefix> RV9_N=<births per size> RV9_SHARD=<s>/<n> RV9_OUT=<json> npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs
// THE READ (arm (D) of tests/domain/display/troubleHooksShared.test.js, on born places): the DM door open (gallery_share_dm true), the
// hooks' eyes opened (tab:plot_hooks, class:tension:hooks written shown), every hideable house at its default (veiled whole).
// TWIN: projectShareVeil(galleryPayloadFor(record, { shareDm: true, memberOverrides: eyes }), eyes). SERVER: a share row on the local
// cluster (the R3 gate's harness's insert, out/v25/r3c5/measure/gate.probe.jsx), read by public.get_gallery_dossier.
// A hook's NEED: its composed pool row (troubleHooksOf.js :: troubleHookPool); an atom's class as tests/lint/samenessHideable.walker.test.js
// :: atomClass reads it (its two home lists copied below, unchanged): 'crime' or 'hideable' is a hideable need (the eleven).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const N = Number(process.env.RV9_N || 40); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const CRIME_HOMES = ['crime', 'rivalRings', 'criminalIncome', 'crimeWave'];
const HOUSE_HOMES = ['defence', 'courtSits', 'courtOrGaol', 'legalHouse', 'paidWatch', 'guardPresence', 'soldiers', 'commander', 'market', 'guild', 'faith', 'sacredHouse', 'hasInstitution'];
const clone = (v) => JSON.parse(JSON.stringify(v));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const troubleHooksIn = (doc) => (doc?.history?.currentTensions ?? []).flatMap((t) => (Array.isArray(t?.plotHooks) ? t.plotHooks : []));
const powerName = (f) => String(f?.faction ?? f?.name ?? '');

it('V33-JOINPROBE hook gap', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse, isVeiledPower } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { FACT_DIMENSIONS, parseAtom } = await import(`${SRC}/src/domain/facts/factVocabulary.js`);
  const { TROUBLE_HOOKS } = await import(`${SRC}/src/data/troubleHooks.js`);
  const { troubleHookPool } = await import(`${SRC}/src/generators/history/troubleHooksOf.js`);
  const { collectPlotHooks } = await import(`${SRC}/src/domain/dossier/plotHooks.js`);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const houseOfKind = (kind) => ({ name: kind, category: kind, priorityCategory: kind });
  const atomClass = (written) => {
    const atom = parseAtom(written); if (!atom) return null;
    const { home } = FACT_DIMENSIONS[atom.dimension];
    if (CRIME_HOMES.includes(home)) return 'crime';
    if (!HOUSE_HOMES.includes(home)) return null;
    return atom.key && isHideableHouse(houseOfKind(atom.key)) ? 'hideable' : 'house';
  };
  // the hideable-need rows of every composed pool (the eleven), by text
  const need = new Map();
  for (const kind of Object.keys(TROUBLE_HOOKS)) (troubleHookPool(kind) || []).forEach((row, at) => {
    const hide = (row.needs || []).filter((a) => ['crime', 'hideable'].includes(String(atomClass(a))));
    need.set(row.text, { kind, line: at + 1, needs: [...(row.needs || [])], hideable: hide });
  });
  const eleven = [...need.entries()].filter(([, v]) => v.hideable.length).map(([text, v]) => ({ text, ...v }));
  const eyes = veil.writeShareVeil({}, [{ address: 'tab:plot_hooks', hidden: false }, { address: 'class:tension:hooks', hidden: false }]);
  let nrow = 0;
  const server = async (rec) => {
    nrow += 1; const id = `abcd9f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `j${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(eyes), true]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const twin = (rec) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: true, memberOverrides: eyes }), eyes);
  const read = (rec, doc) => {
    const stored = troubleHooksIn(rec); const text = JSON.stringify(doc ?? null);
    const collected = new Set(collectPlotHooks(doc ?? {}).map((h) => h.text));
    const served = stored.filter((h) => troubleHooksIn(doc).includes(h) || text.includes(h) || collected.has(h));
    const servedInst = new Set((doc?.institutions || []).map((i) => String(i?.name ?? '')));
    const hiddenHouses = (rec.institutions || []).filter((i) => isHideableHouse(i) && !servedInst.has(String(i?.name ?? ''))).map((i) => String(i.name));
    const servedPowers = new Set((doc?.powerStructure?.factions || []).map(powerName));
    const withheldPowers = (rec.powerStructure?.factions || []).filter((f) => isRec(f) && isVeiledPower(f) && !servedPowers.has(powerName(f))).map(powerName);
    const search = buildNameSearch([...hiddenHouses, ...withheldPowers], [...servedInst, ...servedPowers]);
    return {
      served: served.sort(), hiddenHouses: hiddenHouses.sort(), withheldPowers: withheldPowers.sort(), servedInst: [...servedInst].sort(),
      gap: served.filter((h) => need.get(h)?.hideable.length && (hiddenHouses.length || withheldPowers.length)).map((h) => ({ hook: h, ...need.get(h) })),
      naming: search ? served.filter((h) => search.hit(h)) : [],
    };
  };
  const rows = [];
  for (const size of SIZES) for (let i = 0; i < N; i += 1) {
    if (((SIZES.indexOf(size) * N) + i) % SHARD[1] !== SHARD[0]) continue;
    const seed = `jp5-${size}-${i}`;
    let rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    rec = { ...rec }; delete rec.publicProse; rec = clone(withPublicProse(rec, composePublicProse(rec)));
    const troubled = (rec.history?.currentTensions ?? []).some((t) => Object.hasOwn(TROUBLE_HOOKS, t?.type) && t.plotHooks?.length);
    const hideable = (rec.institutions || []).some((x) => isHideableHouse(x));
    const row = { seed, size, troubled, hideable, kinds: (rec.history?.currentTensions ?? []).map((t) => t?.type) };
    if (troubled && hideable) {
      row.twin = read(rec, twin(rec));
      row.server = read(rec, await server(rec));
    }
    rows.push(row);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ shard: SHARD, N, sizes: SIZES, eleven, rows }, null, 1));
});
