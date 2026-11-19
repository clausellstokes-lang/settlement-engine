// BIRTH-2: the law L1-L3 over a corpus, by the tree's own readers. TREE=<tree> node law.mjs <corpus>
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const RS = await import(R + '/domain/resourceSemantics.js');
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
const SS = await import(R + '/domain/facts/supplyStory.js');
const HK = await import(R + '/domain/facts/houseKinds.js');
const CSR = await import(R + '/domain/display/crisisStoppedRow.js');
const VP = await import(R + '/domain/display/validationOnPage.js');
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const bad = {}; const add = (k, x) => (bad[k] ||= []).push(x);
const struck = (x) => String(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
let n = 0;
for await (const line of rl) {
  if (!line) continue; const { seed, s } = JSON.parse(line); n++;
  const imports = (s.economicState?.primaryImports || []).map(String);
  const short = HI.housesShortOf(s); const v = HI.ventureHouseOf(s);
  const besieged = (s.config?.stressTypes || []).includes('under_siege');
  const shown = HI.impliedGroundsOnPage(s);
  const lines = VP.resourceGapLines(s).map((l) => l.impact);
  for (const inst of liveInstitutions(s)) {
    if (!inst || inst.isCustom) continue;
    const id = SS.idOfHouse(inst);
    if (v && v.name === inst.name) {
      const mark = CSR.rowMarkText(s, 'house', inst);
      if (!mark || !/a failed venture\.$/.test(mark)) add('venture-mark', `${seed}:${inst.name}:${mark}`);
      if (!lines.some((l) => /stands abandoned|is failing/.test(l))) add('venture-line', `${seed}:${inst.name}`);
      const w = SS.familyWord(v.family); if (w && imports.some((x) => struck(x) === struck(w))) add('venture-import', `${seed}:${inst.name}`);
      continue;
    }
    const st = SS.sourceStoryOf(s, inst, RS.resourceShortageImport); if (!st) continue;
    const mark = CSR.rowMarkText(s, 'house', inst) || '';
    if (st.story === 'local' && short.has(inst.name)) add('local-short', `${seed}:${inst.name}:${short.get(inst.name)}`);
    if (st.story === 'bought') {
      if (!imports.some((x) => struck(x) === struck(st.word) || struck(x) === struck(HK.RUNS_ON_BOUGHT[id] || ''))) add('bought-noword', `${seed}:${inst.name}:${st.word}`);
      if (short.has(inst.name)) add('bought-short', `${seed}:${inst.name}:${short.get(inst.name)}`);
      if (besieged && !/siege/i.test(mark)) add('bought-siege-nomark', `${seed}:${inst.name}:${mark}`);
    }
    if (st.story === 'idle') {
      if (!short.has(inst.name)) add('idle-unmarked', `${seed}:${inst.name}`);
      if (!HK.TAKERS.has(id) && HK.RUNS_ON_BOUGHT[id] && imports.some((x) => struck(x) === struck(HK.RUNS_ON_BOUGHT[id]))) add('idle-word', `${seed}:${inst.name}`);
      if (st.ground && !(s.config?.nearbyResourcesDepleted || []).includes(st.ground) && !shown.used.includes(st.ground)) add('idle-noground', `${seed}:${inst.name}:${st.ground}`);
      if (!st.ground) add('never-nobuy', `${seed}:${inst.name}`);
    }
    if (HK.TAKERS.has(id) && st.story === 'idle') {
      for (const key of ['stone', 'ironOre', 'fish', 'timber', 'livestock']) if (HI.houseInputAtHand(s, key, inst, { rawResource: HI.CHAIN_RAW_INPUT[key] }) === 'imported') { add('L3-taker-fed', `${seed}:${inst.name}:${key}`); break; }
    }
  }
}
console.log('towns', n); for (const [k, v] of Object.entries(bad)) console.log(k, v.length, v.slice(0, 6).join(' | '));
