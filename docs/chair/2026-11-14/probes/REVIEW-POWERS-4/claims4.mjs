// REVIEW-POWERS-4 claims4.mjs — CORPUS= TREE= node claims4.mjs : the statement's headline counts at one tree, by record.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE; const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const { isCriminalInstitution } = await import(T + '/src/domain/corruption.js');
const HELD = /taken against their will|buys and sells people|holding back the papers that would free them/;
const CHAIN = /Grain & Bread|Food Processing|Iron & Metalwork|&|Faith & Worship/;
const SIEGE = /^(Find a new source of supply|Bring in from outside|Find whoever can still supply|Find a second supplier|Lay in a season|Buy .* at the market in bulk|Take on more hands|Win new business|Get the most out|Grow the work at .* by one more)/;
const FAM = /^(Take on more hands|Get the most out|Grow the work at .* by one more)/;
const CLASS = /(Major church institutions hold structural influence|Militarised noble families|structurally embedded in governance|Standing army with genuine political weight|The ruling class and the merchant class are the same people)/;
const C = { heldCards: 0, heldTowns: new Set(), chainGoals: 0, chainTowns: new Set(), siegeTrade: 0, famineHiring: 0, charterGovHead: 0, charterCrim: 0, class122: 0, class122towns: new Set() };
for (const { seed, s } of rows) { const st = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type); const gov = s.powerStructure.factions.find((f) => f.isGoverning);
  const inst = new Map((s.institutions || []).map((i) => [String(i.name).toLowerCase(), i]));
  for (const c of s.npcs) { if (HELD.test(c.secret?.what || '') || HELD.test(c.presentation?.impression || '')) { C.heldCards++; C.heldTowns.add(seed); }
    for (const v of ['short', 'long']) { const t = c.goal?.[v] || ''; const i = c.goal?.intent?.[v];
      if (i?.family === 'SUPPLY' && /\b(Grain & Bread|[A-Z][a-z]+ & [A-Z][a-z]+|Food Processing|Mining & Coinage|Standing Garrison|Harbour and Maritime|Cloth Finishing & Clothing)\b/.test(t)) { C.chainGoals++; C.chainTowns.add(seed); }
      if (i?.family === 'SUPPLY' && st.includes('under_siege') && SIEGE.test(t)) C.siegeTrade++;
      if (i?.family === 'SUPPLY' && st.includes('famine') && FAM.test(t)) C.famineHiring++;
      if (i?.family === 'INSTITUTION' && i.kind === 'charter') { if (gov && (c.memberships || []).some((m) => m.power === gov.faction && Number(m.rank) === 1)) C.charterGovHead++;
        const h = c.institution?.kind === 'house' ? inst.get(String(c.institution.key).toLowerCase()) : null; if (h && isCriminalInstitution(h)) C.charterCrim++; } } }
  for (const f of s.powerStructure.factions) if (['Minor', 'Suppressed'].includes(f.powerLabel) && CLASS.test(f.desc || '')) { C.class122++; C.class122towns.add(seed); } }
for (const [k, v] of Object.entries(C)) console.log(k, v instanceof Set ? v.size : v);
