// ladder.mjs <govdir>: each baseline-conflict line that names a market, court, guild, temple or force: towns printing it, and those lacking the thing
import fs from 'node:fs'; import zlib from 'node:zlib';
const dir = process.argv[2];
const LINES = [
  ['levies', /debating market levies/, ['market']],
  ['merchants murdered', /merchants have been found murdered.*the guard/, ['force', 'market']],
  ['merchant class', /merchant class is outbuying/, ['market']],
  ['market day', /market day/, ['market']],
  ['at market', /sells the most at market/, ['market']],
  ['market territory', /traditional market territory/, ['market']],
  ['civilian courts', /authority over civilian courts/, ['court', 'force']],
  ['church veto', /demanding veto power over council appointments/, ['temple']],
  ['new market', /claim authority over the new market/, ['market', 'guild']],
  ['ecclesiastical court', /ecclesiastical court/, ['court', 'temple']],
  ['church court', /before the church court/, ['court', 'temple']],
  ['guild masters robbed', /Two guild masters are having/, ['guild']],
  ['rival guilds', /Two rival guilds are contesting/, ['guild']],
  ['garrison mobilizing', /is mobilizing/, ['force']],
  ['incursion', /monster incursion last season/, ['force']],
  ['tax audit', /tax audit/, ['force']],
  ['private soldiers', /private soldiers arrested|hired guards arrested/, ['guild', 'force']],
  ['church market', /The church wants approval rights/, ['temple']],
  ['militia captain', /militia captain is pushing/, ['force']],
];
const has = (r, t) => {
  const I = new Set(r.inst);
  if (t === 'market') return I.has('hasMarket');
  if (t === 'court') return I.has('hasCourtSystem');
  if (t === 'guild') return I.has('hasGuild') || I.has('hasMerchantGuild');
  if (t === 'temple') return I.has('hasChurch') || I.has('hasCathedral') || I.has('hasMonastery');
  if (t === 'force') return ['hasGarrison', 'hasWatch', 'hasMilitia', 'hasMercenary', 'hasFreeCompany'].some((k) => I.has(k));
};
const out = Object.fromEntries(LINES.map(([k]) => [k, { prints: 0, lacking: {}, ex: [] }]));
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.gz'))) for (const l of zlib.gunzipSync(fs.readFileSync(dir + '/' + f)).toString().split('\n')) {
  if (!l) continue; const r = JSON.parse(l);
  for (const [k, re, things] of LINES) if (re.test(r.rc || '')) {
    const o = out[k]; o.prints++;
    const lack = things.filter((t) => !has(r, t));
    for (const t of lack) o.lacking[t] = (o.lacking[t] || 0) + 1;
    if (lack.length && o.ex.length < 4) o.ex.push(`${r.key}(${lack.join('+')})`);
  }
}
for (const [k, o] of Object.entries(out)) console.log(k.padEnd(22), 'prints', String(o.prints).padStart(3), 'lacking', JSON.stringify(o.lacking), o.ex.join(' '));
