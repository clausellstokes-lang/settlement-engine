// VEIL-15, ITEM 1, THE COST (the sub-brief's COST bullet): a person whose appearance and impression are each 300 KB, in
// Latin, in Greek (two bytes a code point) and in Han (three), stored on a LOCAL chain and read by the three server reads
// (gallery and party link as anon, import as a signed-in reader) and by the client's twin, with the appearance eye SHUT
// (the run test runs) against the same row with it OPEN (the veil record with no eye: the test not run). Each read must
// complete and must not raise. Two plants a script: the two strings share no run of twelve (drawn from the two halves of
// one table: the impression arrives) and share one (forty code points of the appearance at its head: it is withheld). Prints ms (the median of three) a read. LOCAL scratch cluster only (PGHOST, unix socket).
//   PGHOST=/var/tmp/rv7 node run12-cost.mjs <db> <tree> <pg module dir> > <file>
const [db, tree, pgmod] = process.argv.slice(2);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const veil = await import(`${tree}/src/domain/display/galleryVeil.js`);
const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: db });
await c.connect();
const KB = 300 * 1024;
/** Deterministic words from a syllable table, until the string is `bytes` long in UTF-8. */
function text(seed, syllables, bytes) {
  let s = seed >>> 0; let out = '';
  const rnd = () => { s = (s * 1103515245 + 12345) >>> 0; return s >>> 8; };
  while (Buffer.byteLength(out) < bytes) {
    let w = ''; const k = 1 + (rnd() % 3);
    for (let i = 0; i < k; i += 1) w += syllables[rnd() % syllables.length];
    out += `${w}${rnd() % 9 === 0 ? ', ' : ' '}`;
  }
  return Array.from(out).slice(0, Array.from(out).length - 2).join('');
}
const SCRIPTS = {
  latin: 'ba be bi bo bu ca ce ci co cu da de di do du fa fe fi ka ke ki ko la le li lo ma me mi mo na ne ni no ra re ri ro sa se si so ta te ti to'.split(' '),
  greek: 'βα βε βι βο γα γε γι δα δε δι κα κε κι κο λα λε λι μα με μι μο να νε νι πα πε πι ρα ρε ρι σα σε σι τα τε τι φα φε φι χα χε'.split(' '),
  han: Array.from('山水火木金土日月星風雲雨雪花草竹石田川海天地人心手口目耳足門車馬牛羊魚鳥米麦茶酒刀弓矢玉糸布衣食住城町村'),
};
const median = (xs) => xs.slice().sort((a, b) => a - b)[1];
const rows = [];
let n = 0;
for (const [script, syl] of Object.entries(SCRIPTS)) {
  // the two halves of the table share no syllable, so the two strings share no run of twelve (every window holds one)
  const half = Math.floor(syl.length / 2);
  const appearance = text(7, syl.slice(0, half), KB);
  const other = text(1234567, syl.slice(half), KB);
  for (const [plant, impression] of [['no shared run', other], ['a shared run', `${Array.from(appearance).slice(5000, 5040).join('')} ${Array.from(other).slice(0, Array.from(other).length - 60).join('')}`]]) {
    const person = { id: 'npc.big', name: 'Big Person', role: 'Smith', physical: { feature: appearance }, presentation: { impression, disposition: 'guarded' } };
    const town = { name: 'Bigton', tier: 'town', institutions: [{ name: 'Forge row', category: 'Economy', desc: 'Forges.' }], npcs: [person, { id: 'npc.other', name: 'Other Person', role: 'Miller' }] };
    for (const [eye, deltas] of [['shut', [{ address: `field:npc:${veil.CARD_KINDS.npc.idOf(person)}:physical`, hidden: true }]], ['open', []]]) {
      n += 1;
      const ov = { [veil.VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas } };
      const slug = `v15cost${n}`;
      await c.query("delete from public.settlements where public_slug like 'v15cost%' and public_slug = $1", [slug]);
      await c.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Bigton', 'town', $1::jsonb, true, $2, now(), $3, 'unlisted', $4::jsonb, false, true)`, [JSON.stringify(town), slug, `${slug}l`, JSON.stringify(ov)]);
      const read = async (uid, role, q, args) => {
        await c.query("select set_config('test.uid', $1, false)", [uid]); await c.query(`set role ${role}`);
        try { const t0 = process.hrtime.bigint(); const d = (await c.query(q, args)).rows[0]?.d ?? null; return { ms: Number(process.hrtime.bigint() - t0) / 1e6, d }; }
        catch (e) { return { ms: NaN, d: { ERROR: String(e.message).slice(0, 120) } }; }
        finally { await c.query('reset role'); await c.query("select set_config('test.uid', '', false)"); }
      };
      const READS = {
        gallery: () => read('', 'anon', 'select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug]),
        link: () => read('', 'anon', "select public.get_unlisted_dossier($1) -> 'dossier' as d", [`${slug}l`]),
        import: () => read('22222222-2222-2222-2222-222222222222', 'authenticated', 'select (select to_jsonb(g.data) from public.import_gallery_dossier($1) g) as d', [slug]),
        twin: async () => { const t0 = process.hrtime.bigint(); try { const d = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(JSON.stringify(town)), { shareDm: false, memberOverrides: ov }), ov); return { ms: Number(process.hrtime.bigint() - t0) / 1e6, d }; } catch (e) { return { ms: NaN, d: { ERROR: String(e.message).slice(0, 120) } }; } },
      };
      for (const [rd, f] of Object.entries(READS)) {
        const runs = [await f(), await f(), await f()];
        const d = runs[0].d; const p = (Array.isArray(d?.npcs) ? d.npcs : []).find((x) => x && x.id === 'npc.big');
        rows.push({ script, plant, eye, read: rd, ms: Math.round(median(runs.map((r) => r.ms))), raised: !!d?.ERROR, error: d?.ERROR ?? null,
          impression: p ? (typeof p.presentation?.impression === 'string' ? 'sent' : 'withheld') : 'no person', appearance: p ? (p.physical === undefined ? 'withheld' : 'sent') : '-' });
      }
    }
  }
  console.error(`${script}: appearance ${Buffer.byteLength(appearance)} bytes, ${Array.from(appearance).length} code points`);
}
await c.query("delete from public.settlements where public_slug like 'v15cost%'");
await c.end();
console.log(JSON.stringify(rows));
