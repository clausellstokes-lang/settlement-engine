// Assemble result.json: every family, its towns, the hand-read picks, the scripted faults (each verified above), verdicts.
const fs = require('fs');
const { lines, ctxOf, roster, dump, LV, T } = require('./ctx.js');
const pick = require('./handpick.json');
const fams = {}; for (const r of lines) (fams[r.fam] = fams[r.fam] || new Set()).add(r.seed);
const F = {}; // fam -> [{seed, sentence, fact, sev, kind}]
const add = (fam, seed, sentence, fact, sev, kind) => { (F[fam] = F[fam] || []); if (!F[fam].some((x) => x.seed === seed && x.fact === fact)) F[fam].push({ seed, sentence, fact, sev, kind }); };
const FG = { grain: ['grain_fields', 'fertile_floodplain'], livestock: ['grazing_land'], fish: ['fishing_grounds', 'river_fish'], mill: ['river_mills'], game: ['hunting_grounds'] };
const roadRE = /the road to it is long|too poor to mend its road|the road in is too poor|Little comes in by the road|road they leave by|No great road feeds|carts (waiting )?on the road out|wait for the carts on the road out|grind along the road|Pilgrims crowd the road in|between the road and the buyer|rutted deep|The army has the carts and the road|a closed road would stop its work|gatehouse arch frames the main road|reaches .* by road reaches it at a gate/;
const sentenceOf = (s, m) => { const x = s.match(new RegExp('[^.]*' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^.]*\\.?')); return x ? x[0].trim() : m; };
for (const r of lines) {
  const c = ctxOf(r); const R = c.R, lv = c.lv, cr = lv.crisis;
  // ---- counts
  if (/^Economic Flows: (Economic Flows \(|All \()/.test(r.fam)) {
    const ch = c.t.cards.filter((x) => x.kind === 'chain'), sv = c.t.cards.filter((x) => x.kind === 'svc');
    const ci = ch.filter((x) => x.chip === 'impaired').length, cv = ch.filter((x) => x.chip === 'vulnerable').length, si = sv.filter((x) => x.chip === 'impaired').length;
    if (r.fam.includes('active')) {
      const m = r.line.match(/\((\d+) active · (\d+) impaired\)/);
      if (+m[2] !== ci + si) add(r.fam, r.seed, r.line.replace(/▲.*/, ''), `the header counts ${m[2]} impaired; the section prints ${ci + si} Impaired chips (${ci} chain cards + ${si} service cards, e.g. "${sv.find((x) => x.chip === 'impaired').header}")`, 'MED', 'e');
    } else {
      const tb = {}; for (const mm of r.line.matchAll(/(All|Issues|✓ Productive|Entrepôt|Services) \((\d+)\)/g)) tb[mm[1]] = +mm[2];
      if (tb.Issues !== undefined && tb.Issues !== ci + cv + si) add(r.fam, r.seed, r.line, `Issues (${tb.Issues}) but ${ci + cv + si} cards print Impaired or Vulnerable: ${ci + cv} chain cards + ${si} service cards printed "Impaired" (All counts the service cards)`, 'MED', 'e');
    }
    continue;
  }
  // ---- service chips
  if (/Service(Export)?Impaired$/.test(r.fam) && c.card && c.card.kind === 'svc') {
    const d = dump(r.seed); const a = d.indexOf('== Systems/Institutions =='), b = d.findIndex((x, i) => i > a && x.startsWith('== '));
    const via = (c.card.lines.find((l) => l.startsWith('Via:')) || '').slice(4).split(' · ').map((s) => s.trim().toLowerCase()).filter(Boolean);
    for (const h of via) {
      const row = d.slice(a, b).find((x) => x.toLowerCase().startsWith(h) && /(Defense|Economy|Crafts|Religious|Magic|Healing|Education)(Impaired)?$/.test(x));
      if (row && !/Impaired$/.test(row)) add(r.fam, r.seed, r.line, `the Institutions tab prints "${row}" (not impaired), yet the service card runs through it and prints Impaired`, 'MED', 'g');
    }
    continue;
  }
  // ---- headers
  if (c.where === 'header' && c.card.kind === 'chain') {
    if (/Alchemy & Reagents|Planar Trade/.test(r.fam)) add(r.fam, r.seed, r.line, `Impaired under the siege on its ${c.rchain.resource || 'planar gate'} (${c.rchain.resourceInputKey || 'no ground'}): no field work or road trade carries it; the record cannot settle whether a land siege stops it`, 'LOW', 'c');
    continue;
  }
  if (!c.chain) continue;
  const rc = c.rchain, ros = roster(R);
  // ---- NEED sentences
  if (r.fam.startsWith('NEED')) {
    const d = dump(r.seed);
    if (/\bgate control\b/.test(r.line) && !ros.some((n) => /gate|wall|palisade|stockade/i.test(n)) && d.some((l) => /No perimeter walls/.test(l)))
      add(r.fam, r.seed, r.line, `no walls or gates on the roster (${rc.dependency.institution} is the only defence house); the Defense tab says "Unfortified. No perimeter walls. Defenders cannot control entry points"`, 'MED', 'a');
    if (/precious metals/.test(r.line) && !lv.trade.arriving.some((x) => /precious|gold|silver|bullion/i.test(x)))
      add(r.fam, r.seed, r.line, `the Imports list brings no precious metal (${lv.trade.arriving.filter((x) => /iron|luxury/i.test(x)).join(', ')}): the need is met only by reading Iron as a precious metal`, 'MED', 'c');
    if (/no trade road reaches|run on stored/.test(r.line)) {
      const hit = d.map((x) => x.match(roadRE)).find(Boolean);
      const goods = (r.line.match(/(?:stored|depend on) (.+?)(?: brought in by magic)?(?::|\.$)/) || [])[1] || '';
      if (hit) {
        if (/no trade road reaches/.test(r.line)) add(r.fam, r.seed, r.line, `the same page says "${sentenceOf(hit.input, hit[0])}", and its Imports list prints ${goods} arriving`, 'MED', 'g');
        else add(r.fam, r.seed, r.line, `the same tab's Imports list prints ${goods} arriving (and the page says "${sentenceOf(hit.input, hit[0])}"): not run on stores`, 'MED', 'g');
      }
    }
    // LOW: good both imported and printed as produced locally
    const m = r.line.match(/(?:depend on|stored) (.+?)(?: brought in| from outside|:|\.$)/);
    if (m) for (const g of m[1].split(/, | and /)) {
      const s = g.split(/ or | for /)[0].split(' ')[0].replace(/s$/, '');
      const pl = lv.trade.local.filter((a) => new RegExp('\\b' + s, 'i').test(a));
      if (pl.length) add(r.fam, r.seed, r.line, `${g} is also printed under "Produced locally" (${pl[0]}) as well as on the Imports list: "depend on ${g} brought in" overstates`, 'LOW', 'g');
    }
    if (/and supplies/.test(r.line) && !lv.trade.arriving.some((x) => /vessel|rigging|medical|bandage|surgical/i.test(x)) && lv.trade.arriving.some((x) => /scribal supplies/i.test(x)))
      add(r.fam, r.seed, r.line, 'the only "supplies" on the Imports list are "Alchemical reagents and scribal supplies"', 'LOW', 'c');
    continue;
  }
  // ---- magic notes
  if (/^Economic Flows: (Druid|Arcane [fq]|Blessed|Sacred|Temple|Conjured)/.test(r.fam)) {
    const chip = c.card.chip; const siege = cr.includes('under_siege') && !(R.economicState.tradeAccess === 'port' && rc.resourceInputKey === 'fishing_grounds');
    if (/Conjured game produces fish/.test(r.line)) add(r.fam, r.seed, r.line, `on the ${c.card.name} card (${rc.resource}): conjured "game" is the wrong kind of word for fish`, 'MED', 'h');
    if (/depleted farmland/.test(r.line) && rc.chainId === 'salt') add(r.fam, r.seed, r.line, `on the Salt & Preservation card: the depleted ground is ${rc.resource}, not farmland`, 'MED', 'h');
    if (/depleted farmland/.test(r.line) && rc.chainId === 'forage') add(r.fam, r.seed, r.line, `on the Foraging card: the depleted ground is ${rc.resource} (wild), not farmland`, 'LOW', 'h');
    if (/forest management/.test(r.line) && rc.chainId === 'reed_marsh') add(r.fam, r.seed, r.line, `on the Reed & Marsh Harvest card: the ground is ${rc.resource} (depleted), no forest`, 'MED', 'h');
    if (/quickening of growth/.test(r.line) && rc.chainId === 'salt') add(r.fam, r.seed, r.line, `on the Salt & Preservation card: salt flats grow nothing to quicken`, 'MED', 'h');
    if (/depleted catch/.test(r.line) && !rc.resourceDepleted && rc.resourceCondition !== 'depleted') add(r.fam, r.seed, r.line, `the record's ${rc.resource} is ${rc.resourceCondition} (a substitute is worked), not depleted`, 'LOW', 'c');
    if (siege && chip === 'magically_sustained') add(r.fam, r.seed, r.line, `under the siege the page says "Field work and trade have stopped" and "The siege has taken the outlying fields", yet this ${c.card.name} card prints ✦ Magically Sustained with the druids still working its ${rc.resource}`, 'MED', 'c');
    else if (siege) add(r.fam, r.seed, r.line, `under the siege ("Field work and trade have stopped") the note still claims the ${rc.resource} yields by magic; card chip ${chip}`, 'LOW', 'c');
    const fsrc = R.economicState?.foodSecurity?.foodRecord?.failedSource;
    if (cr.includes('famine') && (FG[fsrc] || []).includes(rc.resourceInputKey)) add(r.fam, r.seed, r.line, `the famine failed this very source (${fsrc}); the card still claims the magic provision`, 'LOW', 'c');
    continue;
  }
  // ---- pills
  if (c.where === 'body' && c.chain.outsShown.join('') === r.line) {
    const own = ros.filter((n) => !/^access to/i.test(n));
    const houses = rc.processingInstitutions.join(' · ');
    if (c.chain.outsShown.includes('Master-crafted weapons') && !own.some((n) => /smith|forge|weapon|armou?r|metalwork/i.test(n)))
      add(r.fam, r.seed, r.line, `${R.tier} of ${R.population}: the card's only houses are ${houses}; no smith, forge or weaponsmith stands on the roster`, rc.chainId === 'iron' ? 'HIGH' : 'LOW', 'a');
    if (c.chain.outsShown.includes('Milled lumber') && !own.some((n) => /sawmill|carpent|lumber|woodcut|joiner|wright/i.test(n)))
      add(r.fam, r.seed, r.line, rc.chainId === 'timber' ? `the card's only house is a Thatcher ("Lays roofs and mends them."); no sawmill on the roster` : `the only mill is a grain mill ("${own.find((n) => /mill/i.test(n))}"); no sawmill on the roster`, rc.chainId === 'timber' ? 'MED' : 'LOW', 'a');
    if (c.chain.outsShown.includes('Dyed cloth') && !own.some((n) => /dyer/i.test(n)))
      add(r.fam, r.seed, r.line, `the card's only house is a Fuller ("Finishes woven cloth by cleaning and thickening it"); no dyer on the roster`, 'MED', 'a');
    if (c.chain.outsShown.includes('Books and manuscripts') && rc.chainId === 'glass_print' && !own.some((n) => /print|scriptor|bookbind|librar|universit|scribe|sage|academ/i.test(n)))
      add(r.fam, r.seed, r.line, `the card's house is Glassmakers; the book-maker credited is only "${own.find((n) => /wizard|college/i.test(n))}"`, 'LOW', 'a');
    if (c.chain.outsShown.includes('Ship construction') && !ros.some((n) => /shipyard|shipwright|boat/i.test(n)))
      add(r.fam, r.seed, r.line, `no shipyard or shipwright on the roster (${houses})`, 'LOW', 'a');
    if (/Bulk food exports/.test(r.line) && ['thorp', 'hamlet'].includes(R.tier))
      add(r.fam, r.seed, r.line, `${R.tier} of ${R.population}; "bulk" exports from a surplus of ${R.economicState.foodSecurity.dailyProduction - R.economicState.foodSecurity.dailyNeed} lbs/day (Exports prints Grain surplus)`, 'LOW', 'd');
  }
}
// ---- verdicts
const NOTE = {
  'Economic Flows: Faith & WorshipReligion & civic': 'No chip in every town: the only house is an "Access to parish church" row (no church on the roster); no state is claimed. The card still counts as "active" in the section head.',
  'Economic Flows: Grain & BreadFood security': 'No chip: the only mill is "Access to external mill"; the grain fields are the town\'s own. True.',
  'Economic Flows: River Mill IndustryRaw materials & fuel': 'No chip: the only mill is an access row. True.',
  'Economic Flows: Pilgrimage & Holy SitesReligion & civic': 'No chip: the only church is an access row. True.',
  'Economic Flows: Normally yields': 'Prints only on Impaired cards (siege or famine-failed ground). True.',
  'Economic Flows: Transit trade profit': 'Every town is on a river, port or crossroads route with a toll, customs or coaching house; under siege the card is Impaired. True.',
  'Economic Flows: Legal services': 'Law & Governance card with a Town hall: the court outputs are already dropped; "Legal services" from a town hall that arbitrates. True.',
  'Economic Flows: Pilgrimage & Holy SitesReligion & civicImpaired': 'All under a siege (pilgrims cannot reach the hot springs). In 9 towns the only church is an access row; outside a siege the same card prints no chip. True.',
  'Economic Flows: FortificationsDefense & securityImpaired': 'All under a siege that has taken the quarry; the chip is the supply chain\'s, not the walls\'. True (a reader may take it for damaged walls).',
  'Economic Flows: Magical Items & EnchantingArcane & magicalImpaired': 'All under a siege; the chain is an entrepôt (trade stopped). True.',
};
const out = [];
for (const [fam, seeds] of Object.entries(fams)) {
  const f = F[fam] || []; const serious = f.filter((x) => x.sev !== 'LOW'); const low = f.filter((x) => x.sev === 'LOW');
  const falseSeeds = new Set(serious.map((x) => x.seed)); const lowSeeds = new Set(low.map((x) => x.seed));
  let verdict = 'TRUE', severity = null, kind = null;
  const sevs = ['HIGH', 'MED', 'LOW'];
  if (serious.length) { verdict = falseSeeds.size === seeds.size ? 'FALSE' : 'MIXED'; severity = sevs.find((s) => serious.some((x) => x.sev === s)); kind = [...new Set(serious.map((x) => x.kind))].join(','); }
  else if (low.length) { verdict = /Alchemy|Planar/.test(fam) ? 'UNSETTLED' : 'MIXED'; severity = 'LOW'; kind = [...new Set(low.map((x) => x.kind))].join(','); }
  const pickEx = (xs) => { const seen = new Set(); const o = []; for (const x of xs) { const k = x.fact.slice(0, 40); if (o.length < 5 && !seen.has(x.seed)) { seen.add(x.seed); o.push({ seed: x.seed, sentence: x.sentence, fact: x.fact }); } } return o; };
  const kinds = {}; for (const x of f) { const k = `${x.sev} ${x.kind}`; kinds[k] = kinds[k] || new Set(); kinds[k].add(x.seed); }
  out.push({ fam, towns: seeds.size, readByHand: pick[fam], scripted: true,
    trueTowns: seeds.size - falseSeeds.size, falseTowns: falseSeeds.size, verdict, severity, kind,
    examples: pickEx(serious.length ? serious : low),
    note: [NOTE[fam], low.length && serious.length ? `Also LOW in ${lowSeeds.size} towns (${[...new Set(low.map((x) => x.fact.replace(/\(.*?\)|"[^"]*"/g, '').slice(0, 70)))].slice(0, 2).join('; ')}).` : null,
      Object.keys(kinds).length ? 'Fault towns by severity/kind: ' + Object.entries(kinds).map(([k, v]) => `${k}=${v.size}`).join(', ') : null].filter(Boolean).join(' ') || null });
}
out.sort((a, b) => (a.verdict === 'TRUE') - (b.verdict === 'TRUE') || b.falseTowns - a.falseTowns);
fs.writeFileSync(__dirname + '/result.json', JSON.stringify({ families: out }, null, 1));
for (const x of out.filter((x) => x.verdict !== 'TRUE')) console.log(x.verdict, x.severity, x.kind, `${x.falseTowns}/${x.towns}`, x.fam, '|', x.note && x.note.slice(-80));
console.log('TRUE families', out.filter((x) => x.verdict === 'TRUE').length, 'of', out.length);
