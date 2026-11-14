// flags-census.mjs <lane worktree> <pg module dir> <db>...      REVIEW-VEIL-7
// THE BOOLEANS A HIDDEN HOUSE STILL RAISES. For every stored share of each database, read as anon through the party
// link: every `has…` flag under economicState.compound.inst (and safetyProfile.compound.inst) that is sent TRUE, set
// beside what the ENGINE'S OWN getInstFlags(...).inst (priorityHelpers.js :: getInstitutionNames) derives from the houses the response still
// lists. A flag sent true that the listed houses do not raise is one a reader can only explain by a house not shown.
// For each such flag: the towns, and the stored houses (not listed in the response) whose lower-cased name raises it
// when added alone to the listed ones.
import { pathToFileURL } from 'node:url';
const [lane, pgdir, ...dbs] = process.argv.slice(2);
const pg = (await import(pathToFileURL(`${pgdir}/node_modules/pg/lib/index.js`).href)).default;
const { getInstFlags } = await import(pathToFileURL(`${lane}/src/generators/priorityHelpers.js`).href);
const getInstitutionNames = (institutions) => getInstFlags({}, institutions).inst; // the engine's own classification (not exported by itself)
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const rows = {}; let shares = 0, withGone = 0; const towns = new Set();
for (const dbname of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
  const list = (await db.query(`select name, unlisted_slug, data, gallery_share_dm dm, gallery_member_overrides ov from public.settlements where unlisted_slug is not null order by public_slug`)).rows;
  for (const sh of list) {
    await db.query(`select set_config('test.uid', '', false)`); await db.query('set role anon');
    const d = (await db.query(`select public.get_unlisted_dossier($1) -> 'dossier' as d`, [sh.unlisted_slug])).rows[0]?.d; await db.query('reset role');
    if (!isRec(d)) continue; shares += 1; towns.add(sh.name);
    const listed = (d.institutions || []).filter(isRec); const listedNames = new Set(listed.map(i => i.name));
    const gone = (sh.data.institutions || []).filter(i => isRec(i) && !listedNames.has(i.name)); if (gone.length) withGone += 1;
    const want = getInstitutionNames(listed);
    for (const [where, inst] of [['compound', d.economicState?.compound?.inst], ['safetyProfile.compound', d.economicState?.safetyProfile?.compound?.inst]]) {
      if (!isRec(inst)) continue;
      for (const [k, v] of Object.entries(inst)) {
        if (v !== true || want[k] === true || !(k in want)) continue;
        const raisers = gone.filter(g => getInstitutionNames([...listed, g])[k] === true).map(g => g.name);
        const key = `${where}.${k}`; const r = rows[key] = rows[key] || { towns: new Set(), shares: 0, raisers: new Set(), noRaiser: 0 };
        r.towns.add(sh.name); r.shares += 1; raisers.forEach(x => r.raisers.add(x)); if (!raisers.length) r.noRaiser += 1;
      }
      const sentNames = Array.isArray(inst.names) ? inst.names : [];
      const extra = sentNames.filter(n => typeof n === 'string' && !want.names.includes(n));
      if (extra.length) { const key = `${where}.names[] entries no listed house accounts for`; const r = rows[key] = rows[key] || { towns: new Set(), shares: 0, raisers: new Set(), noRaiser: 0 };
        r.towns.add(sh.name); r.shares += 1; extra.forEach(x => r.raisers.add(x)); }
    }
  }
  await db.end();
}
console.log(`flags census over ${dbs.join(',')}: ${towns.size} towns, ${shares} link reads, ${withGone} with a stored house the response does not list`);
for (const k of Object.keys(rows).sort()) { const r = rows[k]; console.log(`${k} | towns ${r.towns.size} | reads ${r.shares} | no hidden raiser found ${r.noRaiser} | by: ${[...r.raisers].slice(0, 12).join(' ; ')}`); }
