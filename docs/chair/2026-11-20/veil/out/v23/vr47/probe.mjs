// VR47 probe (VEIL-23's VR47 brief): TREE=<tree> OUT=<file.json> node probe.mjs
// The render-twice harness's three born towns (tests/security/shareRenderTwice.pglite.test.jsx: BIRTHS, BIRTH_DIALS, seeds),
// read on the owner's page (the stored record) and on the shared page (veil.galleryPayloadFor, the default veil, Reveal off),
// each with every person's id RE-KEYED by two different id maps (VR10's per-read re-key, emulated: every string equal to a
// person's id, and every key, replaced). Per card with an institution: the printed honorific (seatKeeperDisplay.js ::
// shownHonorificOf), the house's honorific (cardDoor.js :: cardHonorificOf) and the keeper's (seatKeeper.js ::
// keeperHonorificOf); per town the seat row's keeper line. (a) the two id maps; (b) the card's institution key alone moved.
// Also: each birth's sha256 (no generator figure may move) and styledTitleOf's table's sha256 (it takes no seed).
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const TREE = process.env.TREE; const imp = (p) => import(path.join(TREE, p));
const sha = (v) => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const clone = (v) => JSON.parse(JSON.stringify(v));

const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { composePublicProse } = await imp('src/components/new/publicProseCompose.js');
const { withPublicProse } = await imp('src/domain/display/publicProse.js');
const veil = await imp('src/domain/display/galleryVeil.js');
const { shownHonorificOf } = await imp('src/domain/people/seatKeeperDisplay.js');
const { cardHonorificOf } = await imp('src/domain/people/cardDoor.js');
const { keeperHonorificOf, seatKeeperLineOf } = await imp('src/domain/people/seatKeeper.js');
const { FACE_HONORIFICS, styledTitleOf } = await imp('src/data/faceHonorifics.js');
await loadGenerationLawPayloads();

const BIRTH_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const BIRTHS = [['town', null], ['city', 'infiltrated'], ['metropolis', null]];

/** VR10 emulated: every person's id re-keyed by `tag` (every string value equal to an id, and every object key). */
function rekey(doc, tag) {
  const ids = new Set((doc.npcs || []).map((c) => c && c.id).filter((x) => typeof x === 'string' && x));
  const map = new Map([...ids].map((id) => [id, `p_${sha(`${tag}:${id}`).slice(0, 12)}`]));
  const walk = (v) => {
    if (typeof v === 'string') return map.has(v) ? map.get(v) : v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [map.has(k) ? map.get(k) : k, walk(x)]));
    return v;
  };
  return { doc: walk(doc), map };
}
/** The page's honorifics for every card with an institution, by the card's ORIGINAL id. */
function read(doc, back) {
  const rows = {};
  for (const c of doc.npcs || []) {
    if (!c || !c.institution) continue;
    const id = back ? back.get(c.id) : c.id;
    rows[id] = { name: c.name, title: c.institution.title || '', shown: shownHonorificOf(c, doc), card: cardHonorificOf(c, doc), keeper: keeperHonorificOf(c, doc) };
  }
  return { rows, line: seatKeeperLineOf(doc) };
}
const inv = (m) => new Map([...m].map(([k, v]) => [v, k]));

const out = { tree: TREE, towns: [], styledTitleTable: null };
const overrides = veil.writeShareVeil({}, []);
const styled = [];
for (const [i, [size, crisis]] of BIRTHS.entries()) {
  const seed = `render-twice-${size}-${crisis || 'calm'}-${i}`;
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  const born = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  const stored = clone(withPublicProse(born, composePublicProse(born)));
  const shared = clone(veil.galleryPayloadFor(stored, { shareDm: false, memberOverrides: overrides }));
  const t = { seed, birthSha256: sha(born), storedSha256: sha(stored), cards: 0, multiFormCards: 0, owner: null, a: {}, b: { moved: [] }, ownerVsShared: [] };
  for (const c of stored.npcs || []) {
    styled.push([c.title, c.gender, styledTitleOf(c.title, c.gender)], [c.role, c.gender, styledTitleOf(c.role, c.gender)]);
    if (!c.institution) continue;
    t.cards += 1;
    if ((FACE_HONORIFICS[String(c.institution.title || '').trim()] || []).length > 1) t.multiFormCards += 1;
  }
  t.owner = read(stored, null);
  // (a) two id maps, on the owner's page and on the shared page
  for (const [page, doc] of [['owner', stored], ['shared', shared]]) {
    const A = rekey(doc, 'A'); const B = rekey(doc, 'B');
    const ra = read(A.doc, inv(A.map)); const rb = read(B.doc, inv(B.map));
    const differ = Object.keys(ra.rows).filter((id) => JSON.stringify(ra.rows[id]) !== JSON.stringify(rb.rows[id]))
      .map((id) => ({ id, name: ra.rows[id].name, title: ra.rows[id].title, A: ra.rows[id].shown, B: rb.rows[id]?.shown, keeperA: ra.rows[id].keeper, keeperB: rb.rows[id]?.keeper }));
    t.a[page] = { cards: Object.keys(ra.rows).length, differ, lineA: ra.line, lineB: rb.line, lineDiffers: ra.line !== rb.line, rowsA: ra.rows };
  }
  // owner's page vs shared page (shared re-keyed by map A), card by card, where the shared page serves the card's house
  for (const [id, sh] of Object.entries(t.a.shared.rowsA)) {
    const ow = t.a.owner.rowsA[id];
    if (!ow) continue;
    if (sh.shown !== ow.shown) t.ownerVsShared.push({ id, name: sh.name, title: sh.title, owner: ow.shown, shared: sh.shown });
  }
  delete t.a.owner.rowsA; delete t.a.shared.rowsA;
  // (b) the card's institution key alone moved
  for (const c of stored.npcs || []) {
    if (!c || !c.institution || !c.institution.key) continue;
    const before = { shown: t.owner.rows[c.id].shown, card: t.owner.rows[c.id].card, keeper: t.owner.rows[c.id].keeper };
    // several other keys: a two-form pool's pick by fnv1a32 % 2 reads only the parity of the seed's odd bytes, so one
    // suffix of even parity would hide the dependence; the card counts as moved if ANY other key moves it
    for (const other of [`${c.institution.key}#1`, `${c.institution.key}#2`, `${c.institution.key}#3`, 'Another house', String(c.institution.key).toUpperCase()]) {
      if (other === c.institution.key) continue;
      const moved = clone(stored);
      const m = moved.npcs.find((x) => x && x.id === c.id);
      m.institution.key = other;
      const after = { shown: shownHonorificOf(m, moved), card: cardHonorificOf(m, moved), keeper: keeperHonorificOf(m, moved) };
      if (JSON.stringify(before) !== JSON.stringify(after)) { t.b.moved.push({ id: c.id, name: c.name, title: c.institution.title, key: other, before, after }); break; }
    }
  }
  t.b.cardsTried = (stored.npcs || []).filter((c) => c && c.institution && c.institution.key).length;
  out.towns.push(t);
}
for (const title of Object.keys(FACE_HONORIFICS)) for (const g of ['male', 'female', null, undefined]) styled.push([title, g, styledTitleOf(title, g)]);
out.styledTitleTable = { rows: styled.length, sha256: sha(styled) };
out.summary = out.towns.map((t) => ({ seed: t.seed, cards: t.cards, multiFormCards: t.multiFormCards,
  a_owner_differ: t.a.owner.differ.length, a_shared_differ: t.a.shared.differ.length, a_line_differs: t.a.owner.lineDiffers || t.a.shared.lineDiffers,
  b_moved: t.b.moved.length, ownerVsShared: t.ownerVsShared.length, birthSha256: t.birthSha256 }));
fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ summary: out.summary, styled: out.styledTitleTable }, null, 1));
