import { readRun, sentencesOf, SIZES } from '../../../../../../../scripts/sameness-census.mjs';
const [, , dir] = process.argv;
const run = readRun(dir);
const PATHS = ['economicState.safetyProfile.safetyDesc','economicState.safetyProfile.economicDragDesc','economicViability.dependencies[].title','economicViability.dependencies[].description','economicViability.dependencies[].impact','economicViability.dependencies[].suggestedFixes','economicViability.warnings[].description','economicState.tradeDependencies[].impact','economicState.activeChains[].entrepotNote','npcs[].activeConstraint','npcs[].structuralPosition','spatialLayout.quarters[].desc','settlementReason[]','history.founding.foundedBy','history.founding.overcoming','powerStructure.factionRelationships[].narrative','powerStructure.factions[].desc','history.currentTensions[].plotHooks[]','history.currentTensions[].lastingEffects[]','stress.cast.stakes[].reason'];
const match = (p, P) => p === P || p.startsWith(P + '.') || p.startsWith(P + '[]');
for (const P of PATHS) {
  const cells = [];
  for (const size of SIZES) {
    const rows = run[size] || [];
    let holdStored = 0; const printBy = new Map(); const surf = new Set(); let printers = 0; let held = 0;
    rows.forEach((row, i) => {
      const mine = new Set(Object.entries(row.stored).filter(([, ps]) => ps.some((p) => match(p, P))).map(([s]) => s));
      if (mine.size) held++;
      let printed = false;
      for (const [surface, lines] of Object.entries(row.surfaces)) for (const [l] of lines) for (const s of sentencesOf(l)) if (mine.has(s)) { printed = true; surf.add(surface.replace(/^web:/, '').replace(/^pdf:.*/, 'pdf')); const set = printBy.get(s) || new Set(); set.add(i); printBy.set(s, set); }
      if (printed) printers++;
    });
    let top = 0; for (const st of printBy.values()) top = Math.max(top, st.size);
    cells.push({ size, held, printers, top, distinct: printBy.size, surf: [...surf] });
  }
  const anyP = cells.some((c) => c.printers);
  console.log(`${P}\t${anyP ? 'PRINTED' : 'NOT PRINTED'}\t${cells.map((c) => `${c.size[0]}${c.size === 'metropolis' ? 'm' : ''}:${c.printers}/${c.held}${c.printers ? ` top${Math.round(100 * c.top / c.printers)}%` : ''}`).join(' ')}\t${[...new Set(cells.flatMap((c) => c.surf))].join(',')}`);
}
