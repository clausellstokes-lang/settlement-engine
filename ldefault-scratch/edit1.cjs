const fs = require('fs');
const Q = String.fromCharCode(39); // single quote
function sub(path, from, to) {
  const s = fs.readFileSync(path, 'utf8');
  const n = s.split(from).length - 1;
  if (n !== 1) { console.log('REFUSE', path, 'occurrences=', n); process.exit(1); }
  fs.writeFileSync(path, s.replace(from, to));
  console.log('OK  ', path);
}

const T = 'tests/domain/npc/livedExperienceSources.test.js';
sub(T,
  "  test('festival_kept is NOT dark: traditionsEnabled is lit in the same three presets as roads', () => {\n" +
  "    const lit = presetsLighting('traditionsEnabled');\n" +
  "    expect(lit).toEqual(['dramatic_campaign', 'full_simulation', 'living_realm']);",

  "  test('festival_kept is NOT dark: traditionsEnabled is lit in the same FOUR presets as roads', () => {\n" +
  "    // ⭐ DECLARED EDIT, NOT A RE-RECORD (lighting wave, L-DEFAULT hunk 1, 2026-09-06). The\n" +
  "    // roster read THREE — dramatic_campaign, full_simulation, living_realm — until hunk 1 lit\n" +
  "    // the DEFAULT preset with the ONE_REGEN fragment. The old membership is stated here rather\n" +
  "    // than erased. What this test actually protects is UNTOUCHED and still green: the two\n" +
  "    // assertions below say traditions, roads and the ladder light in the SAME presets, whatever\n" +
  "    // that set is, and they moved together precisely because they share one fragment.\n" +
  "    const lit = presetsLighting('traditionsEnabled');\n" +
  "    expect(lit).toEqual(['dramatic_campaign', 'full_simulation', 'living_realm', 'realistic_regional']);");

sub(T,
  '    // anchored: the lit list is pinned to three named presets two lines above',
  '    // anchored: the lit list is pinned to four named presets above');

const S = 'src/domain/npc/livedExperienceSources.js';
sub(S,
  '    ' + Q + 'festival_kept is NOT receipt-dark: traditionsEnabled sits in the ONE_REGEN fragment (simulationRules.js:499) and is lit in dramatic_campaign, living_realm and full_simulation — the same three presets as roads and the ladder' + Q + ',',
  '    ' + Q + 'festival_kept is NOT receipt-dark: traditionsEnabled sits in the ONE_REGEN fragment (simulationRules.js:666) and is lit in dramatic_campaign, living_realm, full_simulation AND, since the lighting wave lit the default preset (L-DEFAULT hunk 1, 2026-09-06), realistic_regional — the same FOUR presets as roads and the ladder, which share that one fragment and therefore move together. This row read THREE until that hunk. Its address read :499, which was ALREADY stale before the hunk and is corrected here by measurement' + Q + ',');
