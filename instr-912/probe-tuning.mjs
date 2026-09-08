const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const { countBareDecimals, countUnregisteredNamed, discoverTables } = await import(`file://${D}/scripts/lib/tuning-inventory.mjs`);
const tables = discoverTables(D, null);
const bare = countBareDecimals(D, tables);
const named = countUnregisteredNamed(D, tables);
for (const [f,n] of Object.entries(bare)) if (f.includes('prose/')||f.includes('institutionTable')) console.log('BARE', f, n);
for (const [f,n] of Object.entries(named)) if (f.includes('prose/')||f.includes('institutionTable')) console.log('NAMED', f, n);
