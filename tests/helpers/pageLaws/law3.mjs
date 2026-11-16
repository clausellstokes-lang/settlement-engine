// BAR5-AUDIT-B · LAW 3 · ONE STATE ON EVERY TAB.
// A service, a house, a chain, a resource or a food source that ANY tab marks stopped, short, failed or impaired is
// not printed operational, available, running or eaten on another. Each rule reads the page's own mark (the
// `against`) and finds the unmarked contrary print elsewhere.
import { CHIP_MARK, MARK_LEAD, fold, economicsSections } from './pageB.mjs';

/** BAR5-FOOD: the failed food's chip mark (`display/commoditiesShown.js :: FAILED_MARK`). */
const FAILED_CHIP = /\(failed\)/;

const tok = (s) => fold(s).replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();

// what a failed food source puts on a list
const FAILED_FOOD = {
  grain: /\b(grain|flour)\b/i,
  livestock: /\b(livestock|dairy)\b/i,
  fish: /\b(fish)\b/i,
};
// a raw material whose work "stops half-way" -> the chains that would finish it
const HALFWAY_CHAIN = {
  'iron ore': /iron|metal|weapons|tool/i,
  iron: /iron|metal|weapons|tool/i,
  'animal hides': /leather|hide|cordwain/i,
  'camel herds': /leather|hide|cordwain/i,
  wool: /wool|textile|cloth|weav/i,
  timber: /timber|wood|charcoal|carpent/i,
  stone: /stone|mason/i,
  'medicinal herbs': /herb|remed|healing|apothec/i,
  clay: /clay|pottery|ceramic|brick/i,
};

// the houses that work several raw inputs (`RESOURCE_CHAINS`: the smelter's three ores), by the page's names for them
const SEVERAL_INPUTS = {
  smelter: ['iron ore', 'copper ore', 'gold and silver ore'],
};

// the finished goods a missing house would make
const FINISHED_BY = {
  smelter: /\b(tools|weapons|armou?r|blades)\b/i,
  'weaver|fulling|dyer': /\b(cloth|garments|textiles|woollens|dyed)\b/i,
  'tanner|leatherworker': /\b(boots|shoes|saddles|harness|leather armou?r|leather goods)\b/i,
  '^apothecary': /\b(remedies|medicines)\b/i,
  alchemist: /\b(potions|elixirs)\b/i,
  stonemason: /\b(dressed stone|carved stone|masonry|sculpture)\b/i,
  'charcoal burner': /\bcharcoal\b/i,
  potter: /\b(pottery|ceramics|fired)\b/i,
};

export function law3(T, town) {
  const out = [];
  const push = (rule, tab, i, line, against, why) => out.push({ law: 'L3', rule, town, tab, i, line, against, why });
  const inst = T.tabs['Systems/Institutions'] || [], svc = T.tabs['Systems/Services'] || [], eco = T.tabs['Systems/Economics'] || [], res = T.tabs['Systems/Resources'] || [];

  // ---- the marks the page prints: service names marked anywhere
  const markedSvc = new Map(); // folded name -> {tab,i,line}
  for (const c of T.cards) for (const ch of c.chips) if (ch.marked || (c.marked && /^Stopped by/.test(c.lines[0]?.text || ''))) {
    if (!markedSvc.has(tok(ch.name))) markedSvc.set(tok(ch.name), { tab: 'Systems/Institutions', i: c.chipIdx, line: c.chipLine });
  }
  for (const e of T.services) if (e.marked && /^(Stopped by|Curtailed by)/.test(e.desc)) {
    if (!markedSvc.has(tok(e.title))) markedSvc.set(tok(e.title), { tab: 'Systems/Services', i: e.descIdx, line: `${e.titleRaw} / ${e.desc}` });
  }

  // L3.outputs: an Operational/Running chain lists as its output or export a service the page marks stopped
  for (const ch of T.chains) {
    if (ch.marked || ch.yieldsNormally || !ch.outputs || !/Running|Operational/.test(ch.state)) continue;
    const items = ch.outputs.split(/ · |, | & | and /).map(tok).filter(Boolean);
    const blob = tok(ch.outputs);
    for (const [name, at] of markedSvc) {
      if (name.length < 6) continue;
      if (items.includes(name) || new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(blob)) {
        push('L3.outputs', 'Systems/Economics', ch.outIdx, ch.outputs, at, `chain ${ch.name} is printed ${ch.state} and lists "${name}", which the page marks stopped`);
        break;
      }
    }
  }

  // L3.chainOverStopped: a chain printed Running/Operational whose every house is stopped
  const houseStopped = (name) => {
    const c = T.cards.find((c) => c.name === name);
    if (!c) return null;
    if (/^Stopped by/.test(c.lines[0]?.text || '')) return true;
    return c.chips.length > 0 && c.chips.every((x) => /\((stopped)/.test(x.raw));
  };
  for (const ch of T.chains) {
    if (ch.marked || !/Running|Operational/.test(ch.state) || !ch.via.length) continue;
    const st = ch.via.map(houseStopped);
    if (st.every((x) => x === true)) {
      const c = T.cards.find((c) => c.name === ch.via[0]);
      push('L3.chainOverStopped', 'Systems/Economics', ch.headIdx, ch.head, { tab: 'Systems/Institutions', i: c.headIdx, line: `${c.head} / ${c.lines[0]?.text || c.chipLine}` }, `chain ${ch.name} is printed ${ch.state} over houses (${ch.via.join(', ')}) whose every service the page marks stopped`);
    }
  }

  // L3.failedFood: a failed food source among the commodities available / produced locally
  const failedIdx = res.findIndex((l) => /^✗ Failed this year · /.test(l));
  if (failedIdx >= 0) {
    const f = res[failedIdx].replace(/^✗ Failed this year · /, '').trim().toLowerCase();
    const re = FAILED_FOOD[f] || new RegExp(`\\b${f}\\b`, 'i');
    const ag = { tab: 'Systems/Resources', i: failedIdx, line: res[failedIdx] };
    const ca = res.findIndex((l) => l === 'Commodities available');
    if (ca >= 0) for (let i = ca + 1; i < res.length && !/▲$/.test(res[i]); i++) {
      // BAR5-FOOD (tightened): read item by item (a row's cells are joined by ` · `): one marked chip does not mark the
      // row's others; a chip's `(failed)` is the failed food's own mark (`display/commoditiesShown.js`).
      if (res[i].split(' · ').some((it) => re.test(it) && !CHIP_MARK.test(it) && !FAILED_CHIP.test(it))) { push('L3.failedFood', 'Systems/Resources', i, res[i], ag, `the page says ${f} failed this year; the commodities available list it unmarked`); }
    }
    const sec = economicsSections(eco);
    const tp = sec['Trade Profile'] || [];
    tp.forEach((x, k) => { if (tp[k - 1]?.text === 'Produced locally' && re.test(x.text)) push('L3.failedFood', 'Systems/Economics', x.i, x.text, ag, `the page says ${f} failed this year; "Produced locally" lists it unmarked`); });
  }

  // L3.foodLineStopped: the food line puts on the table a catch the page marks stopped
  const fishStopped = T.all.find((x) => /^Fish & Maritime Produce Stopped by|Fresh fish \(stopped/.test(x.text) || (/Fresh fish \(stopped/.test(x.text)));
  const huntStopped = T.all.find((x) => /^Hunting[^·]* Stopped by|Game meat \(stopped|Fresh game \(stopped/.test(x.text));
  for (const x of T.all) {
    if (!/puts on the table itself is/.test(x.text) || MARK_LEAD.test(x.text)) continue;
    if (fishStopped && /day's catch|fish from the local waters|salted fish|fresh fish/.test(x.text)) push('L3.foodLineStopped', x.tab, x.i, x.text, { tab: fishStopped.tab, i: fishStopped.i, line: fishStopped.text }, 'the food line puts the catch on the table; the page marks the fishing stopped');
    if (huntStopped && /hunters' game/.test(x.text)) push('L3.foodLineStopped', x.tab, x.i, x.text, { tab: huntStopped.tab, i: huntStopped.i, line: huntStopped.text }, "the food line puts the hunters' game on the table; the page marks the hunting stopped");
  }

  // L3.foodModel: the food line names game or fish as the table's own food beside a farmland house that sells its harvest
  const farm = T.cards.find((c) => /^(Farmland|Fields|Common fields|Farmsteads?|Croft(s|land)?|Arable)/i.test(c.name) && c.chips.some((ch) => /grain|harvest/i.test(ch.name) && !ch.marked) && !c.marked);
  // BAR5-FOOD (widened): every frame of the composer's line makes the same claim of the table (the one-source frame's
  // other index, "Its own food is …"; the two- and three-source frames, "… anchor the table", "The table is …"), any
  // source but grain; a line that names grain, the fields' grain (`foodways.js :: FRAMES.oneFarmed`, its clause) or the
  // holdings' own table (`FRAMES.oneTilled`) does not.
  if (farm) for (const x of T.all) {
    if (/^(Its own food is|What it puts on the table itself is|.* anchor the table|The table is )/.test(x.text) && !/\b(grain|grains|breads?|barley|rye|wheat|millet|rice|porridge|pottage|flour|mill)\b|What each holding grows|Each holding grows|Its own fields give it grain/i.test(x.text))
      push('L3.foodModel', x.tab, x.i, x.text, { tab: 'Systems/Institutions', i: farm.chipIdx, line: `${farm.head} / ${farm.chipLine}` }, 'the food line names another food as the table\'s own, beside a farmland house that sells its own grain');
  }

  // L3.needed: "Needed, and not brought in: X" with "when none comes, that work stands idle" -> an unmarked craft house that works X
  const need = T.all.find((x) => /^Needed, and not brought in: /.test(x.text));
  if (need) {
    const goods = need.text.replace(/^Needed, and not brought in: /, '').replace(/\.$/, '').split(/, | and /).map((g) => g.replace(/\(.*?\)/g, '').trim().toLowerCase()).filter(Boolean);
    const done = new Set();
    for (const g of goods) {
      const idle = T.all.find((x) => new RegExp(`part of the ${g} .{0,60}must come from elsewhere; when none comes, that work stands idle`, 'i').test(x.text));
      if (!idle) continue;
      const word = g.split(' ').pop().replace(/s$/, '');
      const re = new RegExp(`\\b${word}s?\\b`, 'i');
      for (const c of T.cards) {
        if (done.has(c.name) || !/^Crafts$/.test(c.cat.trim())) continue; // a craft that works the good (precision draw 2: a pasture is no work standing idle)
        // NAMED EXCLUSION (BAR5-CHAINS, 2026-11-16; the chair's ruling M-S of TAIL-DEFECON-R): A HOUSE IS SHORT ONLY IF NONE OF
        // ITS INPUTS REACHES IT. The smelter works iron, copper and gold or silver ore; where the page names one of them needed
        // and not another, the smelter smelts the other, and its rows stand true (7 rows of the instance towns: copper needed,
        // iron at hand).
        const several = SEVERAL_INPUTS[c.name.toLowerCase()];
        if (several && several.some((o) => !need.text.toLowerCase().includes(o))) continue;
        // NAMED EXCLUSION (BAR5-CHAINS, 2026-11-16; the chair's ruling R2 of 2026-11-16 09:27 UTC): A LADDER RUNG RUNS NO
        // CHAIN BUT THE SAWMILL'S. The need list names the house it requires ("Required by Apothecary"); a rung of that house
        // ("Apothecary (established)") is not asked of the chain by the record's one reader (`houseInputAtHand.js ::
        // houseRunsChain`, RUNG_HEADS), a MEASURED KIND R2 left for the next round (1 row of the 720, 0 of the 300).
        const reqd = Object.values(T.record?.resourceAnalysis?.imports?.reasons || {}).map((r) => /^Required by (.+?) but not available/.exec(String(r))?.[1]).filter(Boolean);
        if (reqd.length && !reqd.includes(c.name) && reqd.some((h) => c.name.startsWith(`${h} (`))) continue;
        if (c.marked || c.chips.some((ch) => ch.marked)) continue;
        if (!c.lines.some((l) => re.test(l.text))) continue;
        done.add(c.name);
        push('L3.needed', 'Systems/Institutions', c.headIdx, `${c.head} / ${c.lines.map((l) => l.text).join(' ')}`.slice(0, 400), { tab: need.tab, i: need.i, line: `${need.text} | ${idle.text}` }, `the page says ${g} is needed and not brought in, and that the work stands idle; this house works ${g} with no mark`);
      }
    }
  }

  // L3.halfway: the record's gap "cannot produce final goods" (printed: "stops half-way" / "semi-finished"), yet a
  // chain drawing on that material prints as its output a finished good of the missing house
  const said = T.all.find((x) => /stops half-way|worked only to semi-finished goods/.test(x.text));
  const gaps = (T.record?.resourceAnalysis?.gaps || []).filter((g) => /final goods/i.test(g.impact || ''));
  if (said) for (const g of gaps) {
    const r = String(g.chain || '').replace(/_/g, ' ').toLowerCase();
    const chainRe = HALFWAY_CHAIN[r] || HALFWAY_CHAIN[r.replace(/^alpine pasture$/, 'wool')];
    if (!chainRe) continue;
    const prod = (g.missing || []).map((h) => FINISHED_BY[Object.keys(FINISHED_BY).find((k) => new RegExp(k, 'i').test(h))]).filter(Boolean);
    if (!prod.length) continue;
    // the page must name THIS material: "Work on the <r> here stops half-way", or a Resources row "Partial · <r>" beside
    // the semi-finished line (the generic line alone does not say which material: precision draw 1, 2026-11-16)
    const res = T.tabs['Systems/Resources'] || [];
    const pi = res.findIndex((l) => new RegExp(`^Partial · ${r}\\b`, 'i').test(l));
    const ag = T.all.find((x) => new RegExp(`Work on the ${r} here stops half-way`, 'i').test(x.text))
      || (pi >= 0 && res.includes('Partial processing - worked only to semi-finished goods') ? { tab: 'Systems/Resources', i: pi, text: `${res[pi]} | Partial processing - worked only to semi-finished goods` } : null);
    if (!ag) continue;
    for (const ch of T.chains) {
      if (!ch.outputs || ch.yieldsNormally || !(chainRe.test(ch.name) || ch.from.some((f) => chainRe.test(f)))) continue;
      // NAMED EXCLUSION (BAR5-CHAINS, 2026-11-16): AN ENTREPÔT CARD WORKS NO MATERIAL HERE. "Silk & Luxury Textiles · Trade &
      // entrepôt" carries cloth made elsewhere through the town (`chainCarrier.js`: transit); its name holds "Textiles", not
      // the town's wool (6 rows of the instance towns, all of them this card).
      if (/entrep/i.test(ch.cat)) continue;
      const hit = prod.find((re) => re.test(ch.outputs));
      if (hit) push('L3.halfway', 'Systems/Economics', ch.outIdx, ch.outputs, { tab: ag.tab, i: ag.i, line: ag.text }, `the page says work on ${r} stops half-way (no ${g.missing.join(', ')}); chain ${ch.name} prints finished goods of the missing house`);
    }
  }
  return out;
}
