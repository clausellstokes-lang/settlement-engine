import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
  const rows = JSON.parse(fs.readFileSync(f, 'utf8'));
  const grp = (r) => r.part === 'rand' ? (['thorp','hamlet'].includes(r.tier) ? 'rand:small' : 'rand:4') : 'forced';
  const out = {};
  const inc = (k) => { out[k] = (out[k] || 0) + 1; };
  for (const r of rows) {
    const G = grp(r);
    for (const g of r.g) inc(`${G} guard ${g}`);
    for (const x of r.faceless) inc(`${G} faceless ${x.cause}${x.cause==='governing'||x.cause==='roster'||x.cause==='rival'||x.cause==='criminal'?':'+x.nm:''}`);
    for (const x of r.houseless) if (!x.cause.startsWith('other')) inc(`${G} houseless ${x.cause}`);
    inc(`${G} capture ${r.capture}`);
    for (const nm of r.present) if (r.faceless.some((y) => y.nm === nm) || ["The Peerage","People's Council","War Council","Resistance Network","Quarantine Council","Occupation Authority","Reform Congregation","Grain Holders"].includes(nm)) inc(`${G} present ${nm}`);
  }
  console.log(`\n#### ${f}`);
  for (const k of Object.keys(out).sort()) console.log(k.padEnd(60), out[k]);
}
