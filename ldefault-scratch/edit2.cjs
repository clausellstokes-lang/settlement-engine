const fs = require('fs');
function sub(path, from, to) {
  const s = fs.readFileSync(path, 'utf8');
  const n = s.split(from).length - 1;
  if (n !== 1) { console.log('REFUSE', path, 'occurrences=', n); process.exit(1); }
  fs.writeFileSync(path, s.replace(from, to));
  console.log('OK  ', path);
}
sub('src/domain/npc/livedExperienceCatalog.js',
  "  // ⭐ NOT DARK — CORRECTED BY CAR L4's EXECUTED PRESET CENSUS. This row was drafted\n" +
  "  // `receiptDark: true`; running the real preset table shows `traditionsEnabled`\n" +
  "  // sits in the ONE_REGEN fragment (`simulationRules.js:499`) and is therefore lit\n" +
  "  // in dramatic_campaign, living_realm and full_simulation — the SAME three presets\n" +
  "  // as roads and the ladder. It is preset-gated, exactly like `captured_held` and\n" +
  "  // `promotion_won`, and not dark at all.",

  "  // ⭐ NOT DARK — CORRECTED BY CAR L4's EXECUTED PRESET CENSUS. This row was drafted\n" +
  "  // `receiptDark: true`; running the real preset table shows `traditionsEnabled`\n" +
  "  // sits in the ONE_REGEN fragment (`simulationRules.js:666`) and is therefore lit\n" +
  "  // in dramatic_campaign, living_realm and full_simulation — and, SINCE THE LIGHTING\n" +
  "  // WAVE LIT THE DEFAULT PRESET (L-DEFAULT hunk 1, 2026-09-06), in realistic_regional\n" +
  "  // too: the SAME four presets as roads and the ladder, which share that one fragment.\n" +
  "  // The count read THREE until that hunk and is kept visible here rather than erased;\n" +
  "  // the address read :499, already stale before the hunk, corrected by measurement.\n" +
  "  // It is preset-gated, exactly like `captured_held` and\n" +
  "  // `promotion_won`, and not dark at all.");
