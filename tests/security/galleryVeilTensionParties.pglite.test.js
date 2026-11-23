/**
 * galleryVeilTensionParties.pglite.test.js — R5-TENSION (VEIL-41's V41-TEN; the chair's N85 (2) and N96 (2), the reader's
 * row 21, E115 (6): "the masked party is WITHHELD, not masked"), the party-list half.
 *
 * THE RULE: on every read the veil runs on that does not serve a hidden power's name (a powerStructure.factions[] row the
 * owner stamped `hidden: true`, which the projection masks as "an unseen interest" in every string leaf: 210 ::
 * _gallery_sanitize_public_json, publicSafe.js :: maskHiddenNames), a tension (history.currentTensions[]) whose party list
 * names it LEAVES WHOLE, as a withheld power's tension already does. No mask word in a served party list; no party list
 * shortened (the never-there place has no such tension). BOTH ENGINES: 212 through the server on a pglite chain of every
 * migration on disk (the three doors: the gallery read, the party link, the import as a non-owner reader), the twin
 * (projectShareVeil over galleryPayloadFor) beside it.
 *
 * THE PLACES: two born villages under the infiltrated crisis (BIRTH_DIALS; the stored pool's t2p-village-infiltrated-261
 * and -311 are the same shape), whose succession tension names the infiltrator "The Independent Bloc" (hidden: true).
 * THE READS: every setting of the owner's switch (own, g:000..g:111, allOpen, off) and the unmarked share, Reveal DM off and on.
 *
 * THE ARMS:
 *   (i)   where the veil runs and the name is not served: no served party list holds the mask word, and the tension that
 *         names the hidden power is not served (RED at the base 79e94d633: served masked);
 *   (ii)  no served party list is shorter than, or other than, a stored one's (wherever the veil runs);
 *   (iii) Reveal DM on the gallery read and the import still serves the tension with the name; the party link drops it
 *         on both Reveals (the link sends gallery_share_dm false) (RED at the base: the link serves it masked);
 *   (iv)  THE UNMARKED GALLERY READ and its import, Reveal off, are served AS BEFORE (211's design: the veil does not run
 *         there): the mask stands in the party list. LISTED, not cured (N85 (2)); this arm holds it so;
 *   (v)   server = twin on the served tensions (type and party list, in order), the gallery read and the import, every read.
 * The description path (a third power's standing sentence naming the hidden one, powerStructure.factions[].desc) is not
 * this unit's (N96 (1): chain A's R5-DESC); nothing here reads it.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { HIDDEN_POWER_MASK } from '../../src/domain/display/publicSafe.js';

const ARM_TIMEOUT_MS = 1_800_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);
/** The born places: an infiltrated village whose tension names the hidden power (found by the seat's birth search). */
const SEEDS = Object.freeze(['ten-village-infiltrated-20', 'ten-village-infiltrated-29']);
const tensOf = (d) => (Array.isArray(d?.history?.currentTensions) ? d.history.currentTensions.filter(isRec) : []);
const partiesOf = (t) => (Array.isArray(t.factions) ? t.factions : []);
const masked = (t) => partiesOf(t).some((v) => typeof v === 'string' && v.includes(HIDDEN_POWER_MASK));
const shape = (d) => tensOf(d).map((t) => [t.type, partiesOf(t)]);

describe('R5-TENSION: a tension naming a hidden power leaves whole where the name is not served, both engines', () => {
  let db; let veil; let sw;
  const places = [];
  let m = 0;
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  const settingsOf = (stored, dm) => {
    const pub = veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pub, []);
    const present = sw.presentCriminalGroupings(pub);
    const out = { own: opened(OPEN) };
    for (let b = 0; b < 7; b += 1) {
      const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join('');
      out[`g:${bits}`] = opened(['tab:plot_hooks', ...CRIM.filter((_g, i) => bits[i] === '1')]);
    }
    out.allOpen = sw.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
    out.off = sw.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
    return out;
  };
  /** Every read of one place: [{ setting, dm, door, eng, unmarked, doc }]. */
  const readAll = async (stored) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of [...Object.entries(settingsOf(stored, dm)), ['unmarked', null]]) {
      m += 1;
      const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const unmarked = !veil.readShareVeil(ov).marked;
      const id = `7e8c9100-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `tnx${m}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
      await db.exec(`set test.uid = '';`);
      const page = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
      const link = (await db.query('select public.get_unlisted_dossier($1) d', [`${slug}-link`])).rows[0]?.d?.dossier;
      await db.exec(`set test.uid = '${READER}';`);
      const imp = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
      await db.exec(`set test.uid = '';`);
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: ov }), ov);
      out.push({ setting, dm, unmarked, door: 'page', eng: 'server', doc: page }, { setting, dm, unmarked, door: 'import', eng: 'server', doc: imp },
        { setting, dm, unmarked, door: 'link', eng: 'server', doc: link }, { setting, dm, unmarked, door: 'page', eng: 'twin', doc: twin });
    }
    return out;
  };
  const tag = (p, r) => `${p.seed} ${r.eng} ${r.door} ${r.setting} dm=${r.dm}`;
  /** The veil runs on every marked read and on every party-link read (an unmarked link takes the default veil). */
  const veilRuns = (r) => !r.unmarked || r.door === 'link';
  /** The read serves the hidden power's name: Reveal DM on the gallery read, the import and their twin (the link never). */
  const nameServed = (r) => r.dm && r.door !== 'link';

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    await loadGenerationLawPayloads();
    for (const seed of SEEDS) {
      const cfg = { ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: 'village', selectedStresses: ['infiltrated'], selectedStressesRandom: false };
      let t = { ...generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }) };
      delete t.publicProse; t = clone(withPublicProse(t, composePublicProse(t)));
      const hidden = (t.powerStructure?.factions || []).filter((f) => isRec(f) && f.hidden === true).map((f) => f.faction);
      const named = tensOf(t).filter((x) => partiesOf(x).some((v) => hidden.includes(v)));
      places.push({ seed, stored: t, hidden, named, reads: await readAll(t) });
    }
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { await db?.close(); });

  it('the plant reaches the gate: each place stores a tension naming its hidden power, and every read returns a document', () => {
    for (const p of places) {
      expect(p.hidden.length, p.seed).toBeGreaterThan(0);
      expect(p.named.length, p.seed).toBeGreaterThan(0);
      for (const r of p.reads) expect(isRec(r.doc), tag(p, r)).toBe(true);
    }
  }, ARM_TIMEOUT_MS);

  it('(i) where the veil runs and the name is not served: no mask word in a party list, the naming tension not served', () => {
    const bad = [];
    for (const p of places) for (const r of p.reads.filter((x) => veilRuns(x) && !nameServed(x))) {
      for (const t of tensOf(r.doc)) if (masked(t)) bad.push(`${tag(p, r)} [${t.type}] ${J(partiesOf(t))}`);
      for (const t of tensOf(r.doc)) if (partiesOf(t).some((v) => p.hidden.includes(v))) bad.push(`${tag(p, r)} [${t.type}] names ${J(partiesOf(t))}`);
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('(ii) wherever the veil runs, every served party list is a stored one whole: none shortened, none rewritten', () => {
    const bad = [];
    for (const p of places) {
      const stored = new Set(tensOf(p.stored).map((t) => J([t.type, partiesOf(t)])));
      for (const r of p.reads.filter(veilRuns)) for (const t of tensOf(r.doc)) if (!stored.has(J([t.type, partiesOf(t)]))) bad.push(`${tag(p, r)} [${t.type}] ${J(partiesOf(t))}`);
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('(iii) Reveal DM serves the tension with the name on the gallery read and the import; the link drops it on both Reveals', () => {
    const bad = [];
    for (const p of places) {
      const want = p.named.map((t) => J([t.type, partiesOf(t)]));
      for (const r of p.reads) {
        const got = new Set(shape(r.doc).map((x) => J(x)));
        if (nameServed(r) && !want.every((w) => got.has(w))) bad.push(`${tag(p, r)}: the naming tension not served with the name`);
        if (r.door === 'link' && (tensOf(r.doc).some(masked) || want.some((w) => got.has(w)))) bad.push(`${tag(p, r)}: the link serves it`);
      }
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('(iv) LISTED, not cured: the unmarked gallery read and its import, Reveal off, are served as before (the mask stands)', () => {
    const bad = [];
    for (const p of places) for (const r of p.reads.filter((x) => x.unmarked && x.door !== 'link' && !x.dm)) {
      if (!tensOf(r.doc).some(masked)) bad.push(`${tag(p, r)}: not served as before`);
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('(v) server = twin on the served tensions (type and party list, in order), the gallery read and the import, every read', () => {
    const bad = [];
    for (const p of places) {
      const twins = new Map(p.reads.filter((r) => r.eng === 'twin').map((r) => [`${r.setting}|${r.dm}`, J(shape(r.doc))]));
      for (const r of p.reads.filter((x) => x.eng === 'server' && x.door !== 'link')) {
        if (J(shape(r.doc)) !== twins.get(`${r.setting}|${r.dm}`)) bad.push(`${tag(p, r)}: ${J(shape(r.doc))} against the twin's ${twins.get(`${r.setting}|${r.dm}`)}`);
      }
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
