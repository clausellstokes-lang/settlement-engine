// BAR5-AUDIT-B · LAW 2 · WHAT THE CRISIS STOPS IS NOT ON OFFER UNMARKED ANYWHERE.
// For each crisis the page prints its own reach; a line on ANY dossier tab that asserts what the reach denies,
// whose row, chip, entry, card or chain carries no mark, is an instance. CONSERVATIVE FIRST: a rule fires only
// when (1) the town has the crisis, (2) the page itself prints the reach sentence the rule names (the `against`),
// and (3) the line is unmarked. Plot hooks and rumours state their own facts and are not read.
import { sentences, lineMarked, cardAt, entryAt, MARK_LEAD } from './pageB.mjs';

// the history tells of the past (precision draw 2: "drew more pilgrims" 38 years ago is no claim of today)
const SKIP_TABS = /^(Summary\/Plot Hooks|World\/Rumors & News|World\/History|Notes\/)/;
// a sentence that speaks of the crisis or of before it is the crisis's own account, not an ordinary-times claim
export const SELF_AWARE = /\b(siege|besieg|famine|war\b|the army|armies|before the|used to|no longer|until the\b|cut off|stopped|nothing comes|remember|could bring|would bring|might bring|supplements? (mundane )?(treatment|medicine)|no (camels|caravans?|traders?|pilgrims?) )/i;

// medicinal goods the page can say come from outside (rule S2: the page's own "depend on <good> from outside, which the siege has cut off")
export const CUT_GOODS = {
  'medicinal herbs': /\b(medications|medicines|antidotes|remedies|tinctures|salves|herbalism kits|medicinal herbs)\b/i, // plural: an offer of goods, not "mundane medicine"
};

export const RULES = [
  {
    id: 'L2.siege.abroad', crisis: 'under_siege',
    reach: /nothing comes in by road|Trade by road, gate and water has stopped/,
    claim: /\b(brought from abroad|from abroad|from distant (lands|parts)|from far (away|off)|imported from|the caravans\b|caravans (buy|come|arrive|stop|pass)|caravan masters|merchants from (abroad|afar)|foreign (merchants|traders)|passing trade|(road |coach )?travell?ers\b|pilgrims?\b)/i,
    why: 'the siege stops everything coming in by road, gate or water; this unmarked line offers what comes from outside',
  },
  {
    id: 'L2.siege.cutgood', crisis: 'under_siege',
    reach: /depend on (medicinal herbs) from outside, which the siege has cut off/,
    claimFrom: (m) => CUT_GOODS[m[1]],
    rowsOnly: true,
    why: 'the page says this good comes from outside and the siege has cut it off; this unmarked row offers it',
  },
  {
    id: 'L2.famine.meat', crisis: 'famine',
    reachFn: (T) => {
      const fr = T.record?.economicState?.foodSecurity;
      const failed = fr?.foodRecord?.failedSource;
      const failLine = T.pageHas(/✗ Failed this year · Livestock|The herds failed this year/);
      if (failLine) return failLine;
      if (failed && /livestock|herd/i.test(String(failed))) return { tab: 'record', i: -1, text: `foodRecord.failedSource=${failed}` };
      if (fr && fr.chains && fr.chains['Pastoral & livestock'] === false && (fr.importCoverage || 0) === 0 && (T.crises.has('under_siege'))) {
        const l = T.pageHas(/No food comes in(to [A-Z][\w-]*)? by trade/);
        return l || { tab: 'record', i: -1, text: 'foodSecurity: no pastoral chain, import coverage 0, under siege' };
      }
      return null;
    },
    claim: /\b(fresh meat|beef|pork|mutton|veal|fresh milk|cheese|butter)\b/i,
    rowsOnly: true,
    why: 'the herds failed (or the town has none and nothing comes in); this unmarked row offers meat or dairy',
  },
  {
    id: 'L2.famine.grain', crisis: 'famine',
    reach: /✗ Failed this year · Grain|The (grain|harvest) failed this year/,
    claim: /\b(fresh bread|bread|flour|grain at harvest|grain sold|grain grinding|pastries)\b/i,
    rowsOnly: true,
    why: 'the grain failed this year; this unmarked row offers grain, flour or bread',
  },
  {
    id: 'L2.famine.work', crisis: 'famine',
    reach: /No one can earn a normal living while the famine lasts/,
    claim: /\b(work never dries up|never (short of|without|wants for|lacks) (work|custom|trade)|always (has work|busy|in demand)|steady (work|trade|custom|living)|business is (good|brisk|steady)|plenty of work)\b/i,
    why: 'the page says no one earns a normal living while the famine lasts; this unmarked line promises steady work',
  },
  {
    id: 'L2.war.iron', crisis: 'wartime',
    reach: /War has taken the iron|the smiths have nothing to mend tools with/,
    chip: /^(Repairs|Tool manufacture|Weapon smithing|Tool repair|Blade sharpening)$/i,
    chipHouse: /smith|forge|metal|farrier/i,
    claim: /\b(Reforge broken tools|mend ironwork|re-edge blades)\b/i,
    rowsOnly: true,
    why: 'the page says war has taken the iron and the smiths have nothing to mend tools with; this unmarked smith row offers ironwork',
  },
  {
    id: 'L2.war.animals', crisis: 'wartime',
    // the page's own word that the army holds the animals (not "the army has the carts and the road", which the
    // second check read as a matter of degree: C7834 WEAK)
    reach: /Every sound animal of working age has a receipt|horses in .{1,40} are old, or lame/,
    chip: /^(Horse hire|Cart hire|Wagon hire|Mount hire|Draught animals)$/i,
    claim: /\b(rent horses|horse hire|fresh mount|cart hire|wagons? for hire|mounts for hire)\b/i,
    why: 'the page says the army holds every sound working animal and the carts; this unmarked line hires them out',
  },
  {
    id: 'L2.law.collapsed', crisis: null,
    reach: /^Law & order · Collapsed$/,
    claim: /\b(thief is known by name|shun(s|ned)? them until|until they make it right|crime is (rare|unknown)|doors (are )?(left )?unlocked|nobody steals|no one steals|justice (is )?(swift|sure))\b/i,
    why: 'the page says law and order has collapsed; this unmarked line says theft is answered',
  },
];

const ROW_TABS = new Set(['Systems/Institutions', 'Systems/Services', 'Systems/Economics']); // Resources' lists are LAW 3's
/** An income row's title (a few words, no full stop), then a mark. */
const INCOME_TITLE_MARK = /^[A-Z][^.:]{2,48}? (Stopped by the|Curtailed by the|Scarce in the|Short of) /;

export function law2(T, town) {
  const out = [];
  // a house's NAME is not a claim ("Caravan masters' exchange" on a Power row): strip the names before reading
  // and a person's name ("Pilgrim Fuchs" is a man, not a pilgrim)
  const people = (T.record?.npcs || []).flatMap((n) => [n.name, ...String(n.name || '').split(' ')]).filter((n) => n && n.length > 2);
  const names = [...T.houseNames, ...people].filter((n) => n.length > 2).sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const nameRe = names.length ? new RegExp(names.join('|'), 'gi') : null;
  const stripNames = (s) => (nameRe ? s.replace(nameRe, ' ') : s);
  // BAR5-MARKS (2026-11-16), A NAMED EXCLUSION of `L2.siege.abroad`: the record's own account of the past, printed on the
  // Overview as a tension (`history.currentTensions[]`, `historicalEvents[]`: "A claimed miracle or relic drew pilgrims …
  // and the flood of coin and strangers changed it for good"): the past states its own fact (the measure's rule 2), as the
  // History tab's lines do (`SKIP_TABS`); one instance in the census's 720 at 600b7683a (r2s-under_siege-city-2)
  const hist = [...(T.record?.history?.historicalEvents || []), ...(T.record?.history?.currentTensions || [])]
    .map((e) => String(e?.description || '')).filter((t) => t.length > 20);
  const pastOfRecord = (s) => hist.some((h) => h.includes(s.replace(/\.$/, '')));
  for (const r of RULES) {
    if (r.crisis && !T.crises.has(r.crisis)) continue;
    let against = null, claim = r.claim;
    if (r.reachFn) against = r.reachFn(T);
    else {
      for (const x of T.all) { const m = x.text.match(r.reach); if (m) { const sen = sentences(x.text).find((y) => r.reach.test(y)) || x.text; against = { ...x, text: sen }; if (r.claimFrom) claim = r.claimFrom(m); break; } }
    }
    if (!against || !claim) continue;
    const seen = new Set();
    const push = (tab, i, line, extra = '') => {
      const e = tab === 'Systems/Services' ? entryAt(T, i) : null; // one instance a Services entry (title and description)
      const k = e ? `svc#${e.titleIdx}` : `${tab}#${i}`; if (seen.has(k)) return; seen.add(k);
      out.push({ law: 'L2', rule: r.id, town, tab, i, line, against: { tab: against.tab, i: against.i, line: against.text }, why: r.why + extra });
    };
    // chips under Institutions cards
    if (r.chip) {
      for (const c of T.cards) {
        if (c.marked || c.chipIdx < 0) continue;
        if (r.chipHouse && !r.chipHouse.test(c.name)) continue;
        const bad = c.chips.filter((ch) => !ch.marked && r.chip.test(ch.name));
        if (bad.length) push('Systems/Institutions', c.chipIdx, c.chipLine, ` (chips: ${bad.map((b) => b.name).join(', ')}; card ${c.name})`);
      }
      for (const e of T.services) {
        if (e.marked || !r.chip.test(e.title)) continue;
        if (r.chipHouse && !r.chipHouse.test(e.house)) continue;
        const c = T.cards.find((c) => c.name === e.house); if (c?.marked) continue;
        push('Systems/Services', e.titleIdx, e.titleRaw, ` (entry ${e.title} @ ${e.house})`);
      }
    }
    for (const x of T.all) {
      if (SKIP_TABS.test(x.tab)) continue;
      if (r.rowsOnly && !ROW_TABS.has(x.tab)) continue;
      if (x.tab === against.tab && x.i === against.i) continue;
      if (/^(Services · |Needs |Backs · |Connection:)/.test(x.text) && !r.rowsOnly) {
        // chips only through r.chip; Needs/Backs never claim
        if (!/^Services · /.test(x.text)) continue;
      }
      // a person's manner ("How they deal") is no offer (precision draw 3, WEAK; 8 towns of the fresh 300)
      if (/^(Needs |Backs · |Connection:|Secret: |How they deal )/.test(x.text)) continue;
      if (x.tab === 'Systems/Economics' && T.chains.some((c) => c.headIdx === x.i)) continue; // a chain's name and state
      if (x.tab === 'Systems/Economics' && /^(Produced locally|Exports|Imports)$/.test(T.tabs[x.tab][x.i - 1] || '')) continue; // the trade lists are LAW 3's
      if (x.tab === 'Systems/Services' && T.services.some((e) => e.houseIdx === x.i)) continue; // a house's name
      if (lineMarked(T, x.tab, x.i)) continue;
      // BAR5-MARKS (2026-11-16), A DETECTOR CORRECTION: an Economics income row prints its title, then its mark, then its
      // description ("Apothecary & Alchemy Curtailed by the siege. Remedies …", `economicsCrisisMarks.js :: incomeDescShown`):
      // the mark after the title is the row's own (the PDF prints the same mark leading the row). No control rests on it.
      if (x.tab === 'Systems/Economics' && INCOME_TITLE_MARK.test(x.text)) continue;
      if (r.chipHouse && x.tab === 'Systems/Institutions' && !r.chipHouse.test(cardAt(T, x.i)?.name || '')) continue;
      if (r.chipHouse && x.tab === 'Systems/Services' && !r.chipHouse.test(entryAt(T, x.i)?.house || '')) continue;
      if (/^Services · /.test(x.text)) {
        // a chip line: only its unmarked chips count
        const c = cardAt(T, x.i);
        const bad = (c?.chips || []).filter((ch) => !ch.marked && claim.test(ch.name));
        if (bad.length) push(x.tab, x.i, x.text, ` (chips: ${bad.map((b) => b.name).join(', ')})`);
        continue;
      }
      for (const s0 of sentences(x.text)) {
        const s = stripNames(s0);
        if (!claim.test(s) || SELF_AWARE.test(s) || MARK_LEAD.test(s)) continue;
        if (r.id === 'L2.siege.abroad' && pastOfRecord(s0)) continue; // BAR5-MARKS: the named exclusion above
        // BAR5-MARKS (2026-11-16), A NAMED EXCLUSION of `L2.siege.cutgood`: a line that itself says its herbs run short
        // (`economy/incomeLineSiblings.js :: REMEDIES_SHORT_LINE`, "… made here, but few, while the herbs and reagents they need
        // run short"): it offers few remedies and says why, true beside the siege's cut (1 instance in the read's 300 at tip)
        if (r.id === 'L2.siege.cutgood' && /\bbut few\b.*\brun short\b/.test(s0)) continue;
        push(x.tab, x.i, s0);
        break;
      }
    }
  }
  return out;
}
