// The probe's P0 / P1 construction (pages.probe.mjs, V43's, verbatim in kind): P0 = toPublicSafe(rec); P1 = the gallery page
// of the veiled share with nothing hidden: veilPublicPayload(rederiveForPage(projectServedVeil(twin, served marker))).
const SRC = process.env.RV6_SRC || '/home/user/pages53';
export async function loadPages() {
  const W = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { toPublicSafe, veilPublicPayload } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const GV = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  await loadGenerationLawPayloads();
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
  const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
  const opened = (a) => a.map((x) => ({ address: x, hidden: false }));
  const allShown = (doc) => {
    const pub = GV.galleryPayloadFor(clone(doc), { shareDm: false, memberOverrides: null });
    const model = GV.curateModelFor(pub, []);
    const cards = (doc.institutions || []).filter((h) => isHideableHouse(h)).map((h) => ({ address: `card:institution:${GV.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
    const crim = sw.setCriminalVeil(opened(OPEN), model.defaults, false, sw.presentCriminalGroupings(pub), model);
    const defs = model.defaults.map((d) => ({ address: typeof d === 'string' ? d : d.address, hidden: false }));
    return [...crim, ...defs, ...cards];
  };
  const markerOf = (body) => ({ [GV.VEIL_OVERRIDE_KEY]: { v: GV.VEIL_LIMITS.servedVersion, mode: 'live', at: AT.at, groupings: Array.isArray(body?.galleryVeil?.hidden) ? body.galleryVeil.hidden : [] } });
  const plan = W.censusPlan(W.BANKED_PREFIX, 1);
  const birth = (seed) => {
    const row = plan.find((r) => r.seed === seed);
    let town = generateSettlementPipeline(W.configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    return clone(town);
  };
  const pagesOf = (rec) => {
    const P0 = toPublicSafe(clone(rec));
    const ov = GV.writeShareVeil({}, allShown(rec), AT);
    const twin = GV.projectShareVeil(GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov }), ov);
    const pre = GV.projectServedVeil(twin, markerOf(twin));
    const P1 = veilPublicPayload(rederiveForPage(clone(pre), { unveiled: false }));
    return { P0, P1 };
  };
  return { birth, pagesOf, clone };
}
