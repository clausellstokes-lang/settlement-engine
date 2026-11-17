// BIRTH-2 item 11: how often each story comes up. TREE=<tree> node table.mjs <corpus> ; prints JSON
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const RS = await import(R + '/domain/resourceSemantics.js');
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
const HK = await import(R + '/domain/facts/houseKinds.js');
const SS = fs.existsSync(R + '/domain/facts/supplyStory.js') ? await import(R + '/domain/facts/supplyStory.js') : null;
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const { catalogIdForName } = await import(R + '/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(R + '/domain/tradeRouteSemantics.js');
const MAT = HK.MATERIAL_OF || { blacksmith:'ironOre',blacksmiths_3_10:'ironOre',resident_smith_part_time:'ironOre',specialized_metalworkers:'ironOre',smelter:'ironOre',mine:'ironOre',mine_open_cast:'ironOre',brewer:'grain',brewery:'grain',maltster:'grain',mill:'grain',mills_2_5:'grain',bakers_5_15:'grain',carpenter:'timber',carpenter_part_time:'timber',carpenters_5_15:'timber',cooper:'timber',woodcarver:'timber',shipyard:'timber',sawmill:'timber',sawmill_commercial:'timber',charcoal_burner:'timber',woodcutter_s_camp:'timber',cobbler:'hides',cobbler_s_guild:'hides',tanner_established:'hides',tanners:'hides',tannery:'hides',fuller:'wool',weavers_textile_workers:'wool',shepherd:'wool',glassmakers:'sand',glassblower:'sand',potter:'clay',brickmaker:'clay',vintner:'grapes',apothecary:'herbs',alchemist_shop:'herbs',luxury_goods_quarter:'luxury',fish_market:'fish',fishmonger:'fish',fisher_s_landing:'fish',fishing_community:'fish',dairy_farmer:'livestock',stone_quarry:'stone',peat_cutter:'peat',salt_works:'desertSalt' };
const KEYOF = { ironOre: 'ironOre', grain: 'grain', timber: 'timber', hides: 'hides', wool: 'wool', sand: 'sand', clay: 'clay', grapes: 'grapes', herbs: 'herbs', fish: 'fish', livestock: 'livestock', stone: 'stone', desertSalt: 'desertSalt' };
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const T = {}; const inc = (k, tier, mat, seed) => { const o = (T[k] ||= { houses: 0, towns: new Set(), tier: {}, mat: {} }); o.houses++; o.towns.add(seed); o.tier[tier] = (o.tier[tier] || 0) + 1; o.mat[mat] = (o.mat[mat] || 0) + 1; };
const shortWord = /\((?:local|ancient)[^)]*\)/i;
for await (const line of rl) {
  if (!line) continue; const { seed, s } = JSON.parse(line);
  const tier = s.tier; const besieged = (s.config?.stressTypes || []).includes('under_siege');
  const connected = hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''));
  const imports = (s.economicState?.primaryImports || []).map(String);
  const short = HI.housesShortOf(s); const v = HI.ventureHouseOf ? HI.ventureHouseOf(s) : null;
  const spent = HI.housesOnSpentGround(s);
  for (const inst of liveInstitutions(s)) {
    if (!inst || inst.isCustom) continue; const id = String(inst.catalogId || catalogIdForName(inst.name) || ''); const mat = MAT[id]; if (!mat) continue;
    let k;
    if (v && v.name === inst.name) k = 'the owner\'s fifth: a failed venture (' + v.venture + ')';
    else {
      const key = KEYOF[mat];
      const reach = key && HI.CHAIN_INPUTS[key] ? HI.houseInputAtHand(s, key, inst, { rawResource: HI.CHAIN_RAW_INPUT[key] }) : null;
      const st = SS && Object.prototype.hasOwnProperty.call(HK.SOURCE_GROUNDS, id) ? SS.sourceStoryOf(s, inst, RS.resourceShortageImport) : null;
      const isShort = short.has(inst.name);
      if (st) k = st.story === 'local' ? '2' : st.story === 'bought' ? (st.ground ? '1' : '3') : st.ground ? '4' : 'never-nobuy';
      else if (isShort) k = (spent.has(inst.name) || (SS && SS.usedGroundOf(s, mat))) ? '4' : 'short, no ground used up';
      else if (reach === 'imported') { const w = imports.find((x) => shortWord.test(x) && HI.houseInputAtHand({ ...s, economicState: { ...s.economicState, primaryImports: [x] } }, key, inst, { rawResource: HI.CHAIN_RAW_INPUT[key] }) === 'imported'); k = w ? '1' : '3'; }
      else if (reach === 'local' || reach === 'route') k = '2';
      else k = isShort ? '4' : '2';
      k = { '1': 'the owner\'s 1: used up, bought in', '2': 'the owner\'s 2: the land has it', '3': 'the owner\'s 3: never there, bought in', '4': 'the owner\'s 4: used up, not bought in (idle)' }[k] || k;
      if (!connected && /bought/.test(k)) k += ' [no route]';
      if (besieged && /bought/.test(k)) k += ' [under a siege: curtailed]';
    }
    inc(k, tier, mat, seed);
  }
}
const out = {}; for (const [k, o] of Object.entries(T)) out[k] = { houses: o.houses, towns: o.towns.size, tier: o.tier, mat: o.mat };
console.log(JSON.stringify(out, null, 1));
