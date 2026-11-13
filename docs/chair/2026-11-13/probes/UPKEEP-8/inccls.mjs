// UPKEEP-8, step 1: the income family's false lines, classed by the record (the brief's rulings: a line says only
// what the record holds; it names a trade only where the roster holds a house of it; under a siege nothing is
// bought in or sold out by road; an impaired chain is not described as working). Reads births.mjs's `full` rows.
// usage: node inccls.mjs <births.full.ndjson> [listOut.json]   prints the class counts; writes every false line.
import fs from 'node:fs'; import readline from 'node:readline';
const T = {
  ALCH: /^A thriving alchemical trade/, HERB: /The local alchemist supplements/, ORE: /^Local ore feeds the smithy/,
  IRONIN: /^Iron imported from mining regions/, COAL: /^Local coal fires the forges/, COALSOLD: /^Coal is dug here and sold/,
  GRAINBUY: /^Grain purchased from farming regions/, WOOL: /^Local flocks provide raw wool; weavers/, WOOLBUY: /^Wool bought from pastoral/,
  FISH: /salt fish are a major regional export/, QUARRY: /^Local quarry provides dressed stone/, MASON: /^Stone masons work imported/,
  TITHE: /dominating the local economy/,
  // the twins (UPKEEP-8), each read against its own conditions
  T_ALCHSIEGE: /^Alchemical preparations and curative potions, sold only/, T_REMEDIES: /^Remedies and simple preparations/,
  T_REMSHORT: /^Remedies and preparations are made here, but few/, T_METAL: /^Metal is smelted or worked here/,
  T_WOOLWORKED: /^Local flocks provide raw wool, and cloth/, T_CLOTHSHORT: /^Little cloth is made here/, T_CLOTH: /^Cloth is woven or finished here/,
  T_FISHLANDED: /^Catch landed here and sold/, T_FISHSOLD: /^Fish is sold here/, T_TITHE: /^Mandatory tithes, and rents from land the faith owns/,
};
export function factsOf(s) {
  const names = (s.institutions || []).map((i) => String(i.name || '').toLowerCase());
  const has = (re) => names.some((n) => re.test(n));
  const imp = (s.economicState?.primaryImports || []).map(String), exp = (s.economicState?.primaryExports || []).map(String);
  const chain = (re) => (s.economicState?.activeChains || []).filter((c) => re.test(c.label || '')).map((c) => c.status);
  return {
    siege: (s.config?.stressTypes || []).includes('under_siege'),
    forge: has(/smith|forge|foundr|smelt|metal|armor|armour|weapon/), smithy: has(/smith/), alch: has(/alchemist/), remedyHouse: has(/apothec|herbal|hedge wizard|alchemist/), fishSeller: has(/fish/),
    fishHouse: has(/fisher|fishing/), quarryHouse: has(/quarr/), mason: has(/mason|stonecut/), weaver: has(/weav/), fuller: has(/fuller/),
    ironIn: imp.some((x) => /\biron\b/i.test(x)), grainIn: imp.some((x) => /\bgrain\b/i.test(x)), woolIn: imp.some((x) => /\bwool\b/i.test(x)),
    stoneIn: imp.some((x) => /stone|masonry|marble/i.test(x)),
    fishOut: exp.some((x) => /fish/i.test(x)), saltFishOut: exp.some((x) => /\bsalt(?:ed)? fish\b/i.test(x)), oreOut: exp.some((x) => /iron ore/i.test(x)), coalOut: exp.some((x) => /^coal\b/i.test(x)),
    preciousOut: exp.some((x) => /precious metal/i.test(x)),
    magicImpaired: chain(/^(Alchemy|Herbalism)/).includes('impaired'), textileImpaired: chain(/^Textiles/).includes('impaired'),
  };
}
export function falseOf(cls, f, e, top) {
  switch (cls) {
    case 'ALCH': return [!f.alch && 'no alchemist', f.siege && 'siege', f.magicImpaired && 'impaired'].filter(Boolean);
    case 'HERB': return [!f.alch && 'no alchemist', f.magicImpaired && 'impaired'].filter(Boolean);
    case 'ORE': return [!f.smithy && 'no smithy'].filter(Boolean);
    case 'IRONIN': case 'COAL': return [!f.forge && 'no forge', !f.ironIn && 'no iron in', f.siege && 'siege'].filter(Boolean);
    case 'COALSOLD': return [f.siege && 'siege', !f.coalOut && 'no coal out'].filter(Boolean);
    case 'GRAINBUY': return [f.siege && 'siege', !f.grainIn && 'no grain in'].filter(Boolean);
    case 'WOOL': return [!(f.weaver && f.fuller) && 'no weavers and fullers', f.siege && 'siege', f.textileImpaired && 'impaired'].filter(Boolean);
    case 'WOOLBUY': return [f.siege && 'siege', f.textileImpaired && 'impaired', !f.woolIn && 'no wool in'].filter(Boolean);
    case 'FISH': return [!f.fishHouse && 'no fishing house', f.siege && 'siege', !f.saltFishOut && 'no salt fish out'].filter(Boolean);
    case 'QUARRY': return [!f.quarryHouse && 'no quarry house', f.siege && 'siege'].filter(Boolean);
    case 'MASON': return [!f.mason && 'no masons', !f.stoneIn && 'no stone in', f.siege && 'siege'].filter(Boolean);
    case 'TITHE': return [!top && 'not the largest'].filter(Boolean);
    case 'T_ALCHSIEGE': return [!f.alch && 'no alchemist', !f.siege && 'no siege', f.magicImpaired && 'impaired'].filter(Boolean);
    case 'T_REMEDIES': return [!f.remedyHouse && 'no remedy house', f.magicImpaired && 'impaired'].filter(Boolean);
    case 'T_REMSHORT': return [!f.magicImpaired && 'not impaired'].filter(Boolean);
    case 'T_METAL': return [!f.forge && 'no forge'].filter(Boolean);
    case 'T_WOOLWORKED': case 'T_CLOTH': return [!(f.weaver || f.fuller) && 'no weaver or fuller', f.textileImpaired && 'impaired'].filter(Boolean);
    case 'T_CLOTHSHORT': return [!f.textileImpaired && 'not impaired'].filter(Boolean);
    case 'T_FISHLANDED': return [!f.fishHouse && 'no fishing house', f.siege && 'siege'].filter(Boolean);
    case 'T_FISHSOLD': return [!f.fishSeller && 'no fish house', f.siege && 'siege'].filter(Boolean);
    case 'T_TITHE': return [];
  }
  return [];
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop()) && process.argv[2]) {
  const cnt = {}, why = {}, list = []; let births = 0, falseBirths = new Set();
  const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]) });
  for await (const line of rl) {
    const { seed, s } = JSON.parse(line); births++; const f = factsOf(s); const inc = s.economicState?.incomeSources || [];
    inc.forEach((e, i) => {
      for (const [cls, re] of Object.entries(T)) if (re.test(e.desc || '')) {
        const w = falseOf(cls, f, e, i === 0); cnt[cls] = cnt[cls] || [0, 0]; cnt[cls][0]++;
        if (w.length) { cnt[cls][1]++; falseBirths.add(seed); const k = cls + ': ' + w.join('+'); why[k] = (why[k] || 0) + 1; list.push({ seed, cls, why: w, source: e.source, desc: e.desc }); }
      }
    });
  }
  console.log('births', births, '| false lines', list.length, 'in', falseBirths.size, 'births');
  for (const [k, [n, bad]] of Object.entries(cnt)) console.log(k.padEnd(9), 'printed', n, 'false', bad);
  for (const [k, n] of Object.entries(why).sort()) console.log('   ', n, k);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(list));
}
