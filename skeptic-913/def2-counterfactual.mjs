const TIP = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT/src';
const PRE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skeptic-913/revert/src';
for (const [label, base] of [['PRE-CURE (7d96e2b72)', PRE], ['TIP (f46ba7846)', TIP]]) {
  const b = await import(base + '/domain/density/densityCreateBoundary.js');
  const K = (await import(base + '/domain/content/livingContentLawVersion.js')).LIVING_CONTENT_LAW_CONFIG_KEY;
  const lcr = await import(base + '/domain/content/livingContentRoster.js');
  const hydrated = { settType: 'town', culture: 'norse', [K]: 2 };
  const born = b.birthConfig(hydrated);
  const pack = { deities: [{ localUid: 'lu-clamp', name: 'Hydrated Patron' }] };
  console.log(label, '| marker on born config =', JSON.stringify(born[K]),
    '| roster minted from born config =', lcr.buildLivingContentRoster(pack, born) === null ? 'null' : 'ROSTER');
}
