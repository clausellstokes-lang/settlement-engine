// BAR8-AUDIT-K · LAW 15 · A LINE THAT PRESUMES WHAT THE PLACE DOES NOT HOLD, OR A WORD ITS OWN ROW DENIES.
// A pure detector over one town read by `pageK.mjs :: readTownK`; returns instances
// { law: 15, rule, town, tab, line, against: { tab, line }, why, thing, writer }.
//   15a.endless  "Laden carts ... in a line that never seems to end" in a thorp or a hamlet (C15891; WEAK C16854);
//                `.kin`: the pool's other unending-work lines in a thorp or a hamlet, counted apart
//   15b.grazing  the stock recent-conflict line "A dispute over grazing rights and water access ..." where the place holds
//                no grazing (C31732; NEGATIVE C16138, C16460, C16877, C30951, C31349: common grazing or farming households)
//   15c.noneToSend "has none of its own to send" beside a running chain whose outputs are monster hunting through a house
//                of the town (C36003)
//   15d.bar      the line under a threat bar that denies the bar's own word ("no line and no force" under "Adequate")
//                (C18613; NEGATIVE C18612: the bar's word is not the instance)
//   15e.newBuild "nothing new goes up" beside a line that has new walls going up (C40806)
const DEF = 'Systems/Defense', ECO = 'Systems/Economics';

export function law15K(T, town) {
  const out = [];
  const push = (rule, at, against, why, thing, writer) => out.push({ law: 15, rule, town, tab: at.tab, i: at.i, line: at.line, s: at.s, against, why, thing, writer });
  const small = T.rank <= 1;
  const sizeLine = `${T.tier} · population ${T.pop} · prosperity ${T.record?.economicState?.prosperity || ''}`;

  // ---- 15a · an unending line of carts in a thorp or a hamlet
  if (small) {
    for (const x of T.findSent(/\bin a line that never seems to end\b/i)) push('15a.endless', x, { tab: 'record', line: sizeLine }, `an unending line of laden carts in a ${T.tier} of ${T.pop}`, 'carts', 'src/data/arrivalProse.js (the workings pool: needs trade at work: stone; no tier)');
    for (const x of T.findSent(/\bthe sound of the workings never quite stops\b|\bnever quite stops\b|\bhangs over everything\b/i, /^Summary\/Overview$/)) push('15a.endless.kin', x, { tab: 'record', line: sizeLine }, `unending work in a ${T.tier} of ${T.pop}`, 'work', 'src/data/arrivalProse.js');
  }

  // ---- 15b · a quarrel over grazing where there is no grazing
  const insts = (T.record?.institutions || []).map((x) => String(x?.name || ''));
  const chains = T.record?.economicState?.foodSecurity?.chains || {};
  const pastoral = chains && typeof chains === 'object' && (chains['Pastoral & livestock'] === true || (Array.isArray(T.record?.economicState?.foodSecurity?.activeChains) && T.record.economicState.foodSecurity.activeChains.some((c) => /pastoral|livestock/i.test(c))));
  const grazingHouse = insts.find((n) => /grazing|pasture|herd|shepherd|livestock|cattle|sheep|goat|ranch|dairy|stockyard|horse|stable|drover/i.test(n));
  const grazingLand = (T.record?.config?.nearbyResources || []).find((r) => /grass|pasture|meadow|steppe|plain|grazing/i.test(String(r)));
  // THE BOUNDARY IS THE SECOND CHECK'S (thin): C31732 STANDS in a coastal thorp whose only grounds are a harbour, timber and
  // ruins; C30951 and C31349, the same shape of record but for a foraging or a hunting ground, were EXPLAINED ("households of
  // a farming thorp ... can quarrel over grazing"). The rule reads a place with no grazing house, no pastoral chain AND no
  // ground of the land at all; the wider family (no grazing house) is the runner's census, not an instance.
  const landGround = (T.record?.config?.nearbyResources || []).find((r) => /forag|hunt|grass|pasture|meadow|plain|steppe|farm|fertile|grain|orchard|mill|herb|grove|forest|wood(?!.*ship)/i.test(String(r)));
  for (const x of T.findSent(/\bdispute over grazing rights\b|\bgrazing rights and water\b/i)) {
    if (grazingHouse || grazingLand || pastoral || landGround) continue;
    const rule = '15b.grazing';
    push(rule, x, { tab: 'record', line: `houses: no grazing, herd or stable house; foodSecurity Pastoral & livestock: ${chains['Pastoral & livestock']}; nearbyResources: ${(T.record?.config?.nearbyResources || []).join(', ')}` },
      'the quarrel presumes grazing; the place holds no grazing house, ground or pastoral chain', 'grazing',
      'src/generators/power/governanceNarrative.js (powerStructure.recentConflict, the stock pool of src/data/powerSiblings.js)');
  }

  // ---- 15c · none of its own to send, beside its own monster hunters
  const hunt = T.chains.find((ch) => /Running|Operational/.test(ch.state) && /Monster hunting|Dungeon clearance|monster/i.test(ch.outputs || '') && !ch.yieldsNormally);
  if (hunt) for (const x of T.findSent(/\bhas none of its own to send\b/i, /^Systems\/Defense$/)) {
    push('15c.noneToSend', x, { tab: ECO, i: hunt.headIdx, line: `${hunt.head} / Via ${hunt.via.join(' · ')} / Outputs ${hunt.outputs}` },
      'the line says the town has no specialists of its own; a chain the page prints running yields monster hunting through a house of the town', 'hunters',
      'src/data/dossierStateProse/defense.generated.js (charter hall ABSENT: no declaration) / the chain\'s outputs (src/domain/display/tradeListDisplay.js :: chainOutputsShown)');
  }

  // ---- 15d · the line under a bar denies the bar's word
  for (const b of T.bars) {
    if (b.label !== 'Invasion & War' || !/^(Adequate|Strong|Excellent|Formidable)$/.test(b.word)) continue;
    for (const u of b.under) {
      if (!/\bno line and no force\b|\bcould not hold off\b|\bcannot be resisted here\b/i.test(u.text)) continue;
      push('15d.bar', { tab: DEF, i: u.i, line: u.text, s: u.text }, { tab: DEF, i: b.i, line: `${b.label} · ${b.word}` },
        `the line says the place has no force; the bar over it prints "${b.word}"`, 'bar',
        'src/domain/display/defenseDisplay.js (the bar\'s word off defenseProfile.scores.military) beside src/data/dossierStateProse/defense.generated.js (Invasion & War: neither walls nor force)');
    }
  }

  // ---- 15e · nothing new goes up, beside new walls going up
  const building = T.findSent(/\bnew wall going up\b|\bwho is building what\b|\bnew (?:houses|walls) (?:are )?going up\b/i);
  if (building.length) for (const x of T.findSent(/\bnothing new goes up\b/i)) {
    push('15e.newBuild', x, { tab: building[0].tab, i: building[0].i, line: building.map((b) => b.s).join(' | ') },
      'the line says nothing new is built; a line of the page has new walls going up', 'building',
      'src/data/dossierStateProse/economy.generated.js (pools > POOR: crisis: any) beside src/data/people/titleSecretsPresentations.js (the brickmaker\'s "How they deal")');
  }
  return out;
}
