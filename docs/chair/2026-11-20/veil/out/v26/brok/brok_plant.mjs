// SCRATCH (uncommitted) — VEIL-26 brok measurement: does hiding an illegal brokerage's `function` eye un-hide the house?
// Usage: node brok_plant.mjs [outDir]
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { bootChain, storeShare, BIRTH_DIALS } from './tests/security/veilChain.shared.mjs';
import { generateSettlementPipeline } from './src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from './src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from './src/store/configSlice.js';
import { composePublicProse } from './src/components/new/publicProseCompose.js';
import { withPublicProse } from './src/domain/display/publicProse.js';
import * as veil from './src/domain/display/galleryVeil.js';
import { brokerageLegalityOf } from './src/data/informationBrokerageTuning.js';
import { isHideableHouse, isCriminalInstitution, isClandestineInstitution } from './src/domain/people/cardVeil.js';

const OUT = process.env.BROK_OUT || '/var/tmp/v18/out/v26/brok';
mkdirSync(OUT, { recursive: true });
const clone = (v) => JSON.parse(JSON.stringify(v));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

await loadGenerationLawPayloads();
const t0 = Date.now();
const db = new PGlite({ extensions: { pgcrypto } });
const failed = await bootChain(db);
console.error(`chain booted in ${Math.round((Date.now() - t0) / 1000)}s; failed: ${JSON.stringify(failed)}`);
if (failed.length) throw new Error('chain failed');

const SEEDS = [['city', 'brok-city-6'], ['city', 'brok-city-9']];

/** Every hit of the house in a document: strings containing the bare name (case-blind), strings equal to the id, keys equal to the id or containing the name. */
function hits(doc, name, id) {
  const bare = name.replace(/\s*[([].*?[)\]]\s*/g, ' ').trim().toLowerCase();
  const out = [];
  const walk = (v, p) => {
    if (typeof v === 'string') {
      if (v.toLowerCase().includes(bare)) out.push(`${p} ~name: ${v.slice(0, 120)}`);
      if (v === id) out.push(`${p} =id`);
      return;
    }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`)); return; }
    if (!isRec(v)) return;
    for (const k of Object.keys(v)) {
      if (k === id) out.push(`${p}.${k} key=id`);
      else if (k.toLowerCase().includes(bare)) out.push(`${p}.${k} key~name`);
      walk(v[k], `${p}.${k}`);
    }
  };
  walk(doc, '');
  return out;
}
/** Paths whose JSON differs between a and b (leaf level). */
function diffPaths(a, b, p = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (isRec(a) && isRec(b)) return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => diffPaths(a[k], b[k], `${p}.${k}`));
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) return a.flatMap((x, i) => diffPaths(x, b[i], `${p}[${i}]`));
  return [p];
}

const report = { started: new Date().toISOString(), rows: [] };
let n = 0;
for (const [size, seed] of SEEDS) {
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size });
  const born = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  for (const variant of ['native', 'brokerage-only']) {
    const town = clone(born);
    const house = (town.institutions || []).find((i) => brokerageLegalityOf(i) === 'illegal');
    if (!house) { console.error(`${seed}: no illegal brokerage`); continue; }
    if (variant === 'brokerage-only') {
      // THE PLANT: the house is in the hideable class ONLY as an illegal brokerage (category/priorityCategory are floor
      // and would keep it criminal whatever the function eye takes): a custom-like house of the economy category.
      house.category = 'Economy';
      house.priorityCategory = 'economy';
    }
    const stored = clone(withPublicProse(town, composePublicProse(town)));
    const sh = stored.institutions.find((i) => i.name === house.name);
    const id = veil.CARD_KINDS.institution.idOf(sh);
    const cls = { criminal: isCriminalInstitution(sh), clandestine: isClandestineInstitution(sh), illegalBrokerage: brokerageLegalityOf(sh) === 'illegal', hideable: isHideableHouse(sh) };
    const defaults = veil.defaultVeilFor(veil.galleryPayloadFor(stored, {}));
    const defaultsForHouse = defaults.map((d) => d.address).filter((a) => a.includes(`:${id}`));
    const card = `card:institution:${id}`;
    const fn = `field:institution:${id}:function`;
    const CONFIGS = {
      A: [{ address: card, hidden: false }, { address: fn, hidden: false }],
      B: [{ address: card, hidden: true }, { address: fn, hidden: false }],
      C: [{ address: card, hidden: false }, { address: fn, hidden: true }],
      D: [{ address: card, hidden: true }, { address: fn, hidden: true }],
    };
    const docs = {};
    for (const [cname, deltas] of Object.entries(CONFIGS)) {
      const overrides = veil.writeShareVeil({}, deltas);
      for (const shareDm of [false, true]) {
        const slug = `brok-${n++}`;
        await storeShare(db, { town: stored, slug, overrides, shareDm });
        const g = (await db.query('select to_jsonb(g) as r from public.get_gallery_dossier($1) g', [slug])).rows[0]?.r;
        const l = shareDm ? null : (await db.query('select public.get_unlisted_dossier($1) as o', [`${slug}-link`])).rows[0]?.o;
        const twinG = veil.projectShareVeil(veil.galleryPayloadFor(stored, { shareDm, memberOverrides: overrides }), overrides);
        const twinL = shareDm ? null : veil.projectShareVeil(veil.galleryPayloadFor(stored, { shareDm: false, memberOverrides: overrides }), overrides);
        const reads = { 'server.gallery': g, 'twin.gallery': twinG, ...(shareDm ? {} : { 'server.link': l, 'twin.link': twinL }) };
        for (const [read, doc] of Object.entries(reads)) {
          const h = hits(doc, house.name, id);
          const listed = (read.endsWith('.gallery') && read.startsWith('server') ? doc?.data?.institutions : read === 'server.link' ? doc?.dossier?.institutions : doc?.institutions) || [];
          const row = listed.find((i) => i?.name === house.name);
          const key = `${seed}|${variant}|${cname}|dm=${shareDm}|${read}`;
          docs[key] = read === 'server.gallery' ? doc?.data : read === 'server.link' ? doc?.dossier : doc;
          report.rows.push({ seed, variant, config: cname, revealDm: shareDm, read, houseListed: !!row, rowKeys: row ? Object.keys(row).sort() : null, hitCount: h.length, hits: h });
        }
      }
    }
    // (C) vs (A), per read: which paths differ
    const cva = {};
    for (const dm of [false, true]) for (const read of ['server.gallery', 'twin.gallery', ...(dm ? [] : ['server.link', 'twin.link'])]) {
      cva[`dm=${dm}|${read}`] = diffPaths(docs[`${seed}|${variant}|A|dm=${dm}|${read}`], docs[`${seed}|${variant}|C|dm=${dm}|${read}`]);
    }
    report.rows.push({ seed, variant, house: house.name, id, cls, defaultsForHouse, CvsA: cva });
    writeFileSync(`${OUT}/docs-${seed}-${variant}.json`, JSON.stringify(docs));
  }
}
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
// summary table
const lines = [];
for (const r of report.rows) {
  if (r.config) lines.push(`${r.seed}\t${r.variant}\t${r.config}\tdm=${r.revealDm}\t${r.read}\tlisted=${r.houseListed}\thits=${r.hitCount}`);
  else lines.push(`# ${r.seed} ${r.variant} house=${r.house} id=${r.id} cls=${JSON.stringify(r.cls)} defaults=${JSON.stringify(r.defaultsForHouse)}\n#   C-vs-A diff paths: ${JSON.stringify(r.CvsA)}`);
}
writeFileSync(`${OUT}/summary.tsv`, lines.join('\n') + '\n');
console.log(lines.join('\n'));
