const { COLUMN_SOURCES } = await import('../skepINSTR2/src/domain/institutions/institutionTable.js');
for (const [col, rows] of Object.entries(COLUMN_SOURCES)) {
  const read = rows.filter(r => r.read).length;
  console.log(`${col.padEnd(18)} read ${read} of ${rows.length}`);
}
