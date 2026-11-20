import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const dir = process.argv[2];
const rows = fs.readdirSync(dir).filter((f) => f.endsWith('.ndjson.gz')).flatMap((f) => zlib.gunzipSync(fs.readFileSync(path.join(dir, f))).toString().trim().split('\n').map((l) => JSON.parse(l)));
for (const r of rows) for (const f of r.factions) {
  if (/Minor|Suppressed/.test(f.l) && /^(Standing army with genuine|Militarised noble|Hereditary great families|The ruling class and the merchant)/.test(f.d || '')) {
    const arms = r.inst.filter((n) => /watch|garrison|militia|guard|barracks|citadel|mercenar/i.test(n));
    const merch = r.factions.filter((x) => x !== f && (x.c === 'economy' || /Merchant|Trade|Commercial/.test(x.n))).map((x) => `${x.n} ${x.p}${x.g ? ' (gov)' : ''}`);
    console.log(`${r.key} ${r.tier} [${r.stress}] ${f.n} ${f.p} ${f.l} :: ${f.d.slice(0, 40)} | gov ${r.factions.find((x) => x.g)?.n} | arms ${arms.join(', ')} | merch ${merch.join(', ')}`);
  }
}
