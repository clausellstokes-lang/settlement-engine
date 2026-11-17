import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { law8MarksInstances } = await import(T + '/tests/helpers/pageLaws/law8Marks.mjs');
const HI = await import(T + '/src/domain/facts/houseInputAtHand.js');
const RS = await import(T + '/src/domain/resourceSemantics.js');
const SS = fs.existsSync(T + '/src/domain/facts/supplyStory.js') ? await import(T + '/src/domain/facts/supplyStory.js') : null;
const { liveInstitutions } = await import(T + '/src/domain/institutions/institutionRoster.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const zero = []; const mild = [];
for await (const line of rl) { if (!line) continue; const { seed, s } = JSON.parse(line);
  for (const i of law8MarksInstances(s)) zero.push(`${seed} · ${i.rule} · ${i.house}`);
  if (!SS || !seed.startsWith('r2r-')) continue;
  const blind = law8MarksInstances(s, { blind: true }).filter((i) => i.rule === '8a.mild');
  for (const b of blind) { const inst = liveInstitutions(s).find((x) => x.name === b.house); if (!inst) continue;
    const st = SS.sourceStoryOf(s, inst, RS.resourceShortageImport); const spent = HI.housesOnSpentGround(s).has(b.house);
    const short = HI.housesShortOf(s).has(b.house);
    if (short && HI.ventureHouseOf(s)?.name !== b.house && (st ? st.story === 'idle' : (spent || SS.usedGroundOf(s, (await import(T + '/src/domain/facts/houseKinds.js')).MATERIAL_OF[SS.idOfHouse(inst)] || '')))) mild.push(`${seed} · ${b.house} · ${st ? st.story + ':' + st.ground : 'buyer'}${spent ? ' (own spent)' : ''}`); }
}
console.log('ZERO', zero.length, zero.join(' | ')); console.log('MILD idle', mild.length); console.log(mild.slice(0, 30).join('\n'));
