const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/';
const { economyStateProse } = await import(D + 'src/domain/display/stateProse/economyStateProse.js');
const { drawnAtMount } = await import(D + 'src/domain/display/stateProse/dossierMounts.js');

function show(tag, s, readings) {
  const d = economyStateProse(s, readings || {}, { seed: String(s?._seed ?? s?.id ?? '') });
  const hdr = drawnAtMount('economics.prosperityHeader', d.prosperityHeader);
  const food = drawnAtMount('economics.foodSecurity', d.foodSecurityRung);
  console.log(`--- ${tag}`);
  console.log('  headerSentence:', JSON.stringify(hdr?.sentence ?? null));
  console.log('  foodSecSentence:', JSON.stringify(food?.sentence ?? null));
}

const base = (pros, access, extra = {}) => ({
  id: 'forge_town', name: 'Forge Town', _seed: 'forge_town',
  economicState: { prosperity: pros, economicComplexity: 'a market town', tradeAccess: access, ...extra },
});

show("existing test ECO prosperity='modest'", base('modest', 'road'));
for (const p of ['Subsistence','Struggling','Poor','Moderate','Comfortable','Prosperous','Wealthy']) {
  show(`prosperity='${p}' access=road`, base(p, 'road'));
}
show("Comfortable + foodSecurity label 'Secure'", base('Comfortable','road',{ foodSecurity: { label: 'Secure', stockpile: {} } }));
show("Comfortable + BLOCKADED", base('Comfortable','road',{ foodSecurity: { label: 'Secure', stockpile: { blockaded: true } } }));
