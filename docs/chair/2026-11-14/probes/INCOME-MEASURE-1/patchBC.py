import sys
mode=sys.argv[2]; p=sys.argv[1]+'/src/generators/economy/economicState.js'; s=open(p).read()
anchor="  incomeNormalized.sort((a, b) => b.percentage - a.percentage || compareCodepoint(a.source, b.source));\n"
assert s.count(anchor)==1
common='''  // CANDIDATE %s (INCOME-MEASURE-1, scratch only): the resource rows read the finished record.
  {
    const _rosterHas = (re) => instNamesLower.some((n) => re.test(n));
    const _ground = (keys) => nativeAvailableResources.filter((r) => keys.some((k) => r.startsWith(k)));
    const _sold = (re) => primaryExports.some((x) => re.test(String(x)));
    const _TRADE = {
      'Iron & Metalwork': { house: /\\bmines?\\b|mining|smith|smelt|forge|foundr|metal|armou?r|weapon/, goods: [
        { keys: ['iron_deposit'], title: 'Iron Ore Sales', sold: /\\biron\\b|\\bore\\b/i },
        { keys: ['coal_deposit'], title: 'Coal Sales', sold: /^coal\\b/i },
        { keys: ['precious_metal'], title: 'Precious Metal Sales', sold: /silver|gold|precious/i }] },
      'Stone Quarrying': { house: /quarr|mason|stonecut/, goods: [
        { keys: ['stone_quarry'], title: 'Building Stone Sales', sold: /stone|marble|granite/i },
        { keys: ['river_clay', 'clay'], title: 'Clay Sales', sold: /\\bclay\\b|potter/i }] },
      'Timber Trade': { house: /woodcut|lumber|sawmill|logging|forester/, goods: [
        { keys: ['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber'], title: 'Timber Trade', sold: /timber|lumber|plank/i }] },
      'Fish & Preserved Produce': { house: /fish/, goods: [
        { keys: ['river_fish', 'fishing_grounds'], title: null, sold: /fish|herring|seafood/i },
        { keys: ['salt_flat', 'desert_salt'], title: 'Salt Sales', sold: /salt/i }] },
    };
    _TRADE['Fish & Maritime Produce'] = _TRADE['Fish & Preserved Produce'];
'''%mode
if mode=='B':
    body='''    for (const e of incomeNormalized) {
      const t = _TRADE[e.source]; if (!t || _rosterHas(t.house)) continue;
      const g = t.goods.find((x) => _ground(x.keys).length) || null;
      if (g && g.title) e.source = g.title;
      else if (!g && /^Fish/.test(e.source)) e.source = 'Salt Sales'; // the dock's salt: no fish ground stands
      e.desc = ''; // the title and share alone: no trade the town lacks is named
    }
  }
'''
else:
    body='''    const _keep = (e) => { const t = _TRADE[e.source]; if (!t || _rosterHas(t.house)) return true;
      return t.goods.some((x) => _ground(x.keys).length && _sold(x.sold)); };
    const _kept = incomeNormalized.filter(_keep);
    if (_kept.length !== incomeNormalized.length) {
      const _total = _kept.reduce((sum, e) => sum + e.weight, 0) || 1;
      for (const e of _kept) e.percentage = Math.round((e.weight / _total) * 100);
      const _sum = _kept.reduce((sum, e) => sum + e.percentage, 0);
      if (_kept.length && _sum !== 100) { let bi = 0; _kept.forEach((e, i) => { if (e.percentage > _kept[bi].percentage) bi = i; }); _kept[bi].percentage += 100 - _sum; }
      incomeNormalized.length = 0; incomeNormalized.push(..._kept);
    }
  }
'''
s=s.replace(anchor, common+body+anchor)
open(p,'w').write(s)
