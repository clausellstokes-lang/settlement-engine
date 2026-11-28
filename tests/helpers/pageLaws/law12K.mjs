// BAR8-AUDIT-K · LAW 12 · AN ORDINARY-TIMES LINE UNDER THE CRISIS OR THE STATE THAT DENIES IT (LAW 8k widened).
// A pure detector over one town read by `pageK.mjs :: readTownK`; returns instances
// { law: 12, rule, town, tab, line, against: { tab, line }, why, thing, writer }.
//   12a.house    a house in the Via of a chain the page prints "Stopped by the <crisis>.", its card and chips bare (C0476)
//   12b.boom     a scene of a trade at full work ("day and night", racks of new ironwork) where every house of that trade
//                on the page carries a crisis mark ("Curtailed by the war.") (C7246, C7242; C7477 is the line that agrees)
//   12c.calm     a history line that calls the place's past steady or quiet, under a live hard crisis it does not name (C36585)
//   12d.enough   "covers what it must ... every essential is accounted for" beside the page's own unmet need (C39124)
//   12e.noRising "nobody ... stands ready to lead them" beside the record's live popular uprising (C16668)
//   12f.magic    the Magic tab's only supplier(s) of a reliance, every one a house the page marks Stopped (C19407)
// CONSERVATIVE FIRST: a line that itself carries a mark, or names the crisis, is not read.
import { MARK_LEAD } from './pageK.mjs';

const ECO = 'Systems/Economics', INST = 'Systems/Institutions', SVC = 'Systems/Services';
const CRISIS_WORD = { under_siege: /siege|besieg/i, wartime: /\bwar\b|fighting|armies|army/i, occupied: /occup/i, famine: /famine|hunger|starv/i, plague_onset: /plague|sickness/i };

// the trades a scene can show at work, by the house that works them (the card's name) and the scene's words
const TRADES = [
  ['iron', /\b(smith|smithy|blacksmiths?|metalworkers?|smelter|forge|armou?rer|weaponsmith|foundry)\b/i, /\b(forges?|anvils?|smithy|smithies|bellows|hammering|ironwork|new iron)\b/i],
  ['cloth', /\b(weavers?|textile|fuller|dyers?|cloth)\b/i, /\b(looms?|weaving|shuttles?|tenters?|fulling|bolts of (?:new )?cloth)\b/i],
  ['clay', /\b(potters?|brickmakers?|brickworks|kilns?|tile)\b/i, /\b(kilns?|potter's wheel|new bricks?|fresh bricks?)\b/i],
  ['timber', /\b(sawmill|sawyers?|lumber|woodcutters?|carpenters?)\b/i, /\b(sawpits?|sawdust|sawn timber|sawmill|the saws?)\b/i],
  ['hides', /\b(tanners?|tannery|leather)\b/i, /\b(tanning pits?|tanneries|tannery|tanning)\b/i],
  ['stone', /\b(quarry|quarries|mine|mines|stonemasons?|masons?)\b/i, /\b(workings|quarry|spoil heaps|laden carts)\b/i],
];
// a scene that already says the work is thin, or the goods are stock (law8H's QUIET, kept as it is)
const QUIET = /\b(quiet|quieter|idle|silent|cold|still|for want of|nothing to|no longer|little|few|brought in|from elsewhere|used to|once|stopped|short|mostly empty|empty)\b/i;
const BOOM = /\b(day and night|never (?:quite )?stops|new ironwork|running|ring|clang|echo(?:es)?|hangs over everything|waiting for the carts|busy|full swing|every quarter)\b/i;

export function law12K(T, town) {
  const out = [];
  const push = (rule, at, against, why, thing, writer) => out.push({ law: 12, rule, town, tab: at.tab, i: at.i, line: at.line, s: at.s, against, why, thing, writer });
  const hard = [...T.crises].filter((c) => CRISIS_WORD[c]);

  // ---- 12a · a bare house in the Via of a chain the crisis stopped
  for (const ch of T.chains) {
    const stop = ch.lines.find((l) => /^Stopped by the \w+/.test(l.text));
    if (!stop) continue;
    for (const v of ch.via) {
      const c = T.cards.find((x) => x.name === v);
      if (!c || T.cardMark(c) || c.chips.some((x) => x.marked)) continue;
      // read on the 720: a house of worship's rites go on when its pilgrimage stops (ruling CY1: the temple's chip is true),
      // and a house in the Via of a chain still running (merchant guilds) has work: only a house every chain of which the
      // page prints stopped ("Stopped by the …", or "Normally yields": not yielding now) is read
      // and the house must be a chain's ONE house (read on the 720: merchant guilds, a cooper, beast trainers named among
      // others in a stopped chain go on at their own trade; the furrier's district and the shipyard ARE their chains)
      const own = T.chains.some((o) => o.via.length === 1 && o.via[0] === v && (o.yieldsNormally || o.lines.some((l) => /^Stopped by the /.test(l.text))));
      if (!own || /^Religious$/.test(c.cat) || T.chains.some((o) => o !== ch && o.via.includes(v) && !o.yieldsNormally && !o.lines.some((l) => /^Stopped by the /.test(l.text)))) continue;
      const against = { tab: ECO, i: ch.headIdx, line: `${ch.head} / Via ${ch.via.join(' · ')} / ${ch.yieldsNormally ? 'Normally yields ' : ''}${ch.outputs || ''} / ${stop.text}` };
      push('12a.house', { tab: INST, i: c.headIdx, line: [c.head, c.chipLine || ''].filter(Boolean).join(' / ') }, against,
        `the chain ${ch.name} through ${c.name} is printed "${stop.text}"; the house's card and its chips carry no mark`, c.name,
        'src/data/crisisDependence.js (the crisis tables that mark a house; read by src/domain/display/crisisStoppedRow.js :: rowMarkText)');
    }
  }

  // ---- 12b · a scene of a trade at full work over houses the crisis marked
  for (const tab of ['Summary/Overview', 'World/Daily Life']) {
    for (const x of T.sents.filter((y) => y.tab === tab)) {
      if (MARK_LEAD.test(x.s) || QUIET.test(x.s) || !BOOM.test(x.s)) continue;
      for (const [key, houseRe, sceneRe] of TRADES) {
        if (!sceneRe.test(x.s)) continue;
        const hs = T.cards.filter((c) => houseRe.test(c.name) && !/^access to\b/i.test(c.name) && !/gold|silver/i.test(c.name));
        if (!hs.length) continue;
        const ms = hs.map((c) => T.cardMark(c));
        if (!ms.every((m) => m && /^(Stopped|Curtailed|Scarce) /.test(m))) continue; // the short mark is LAW 8k's (seat H)
        // FULL WORK ("day and night", "never quite stops", new ironwork waiting for the carts) under a crisis mark is the
        // fault the second check let stand; an ordinary line of work ("the clang carries", "the hammering echoes") under
        // "Curtailed" is a thin trade the second check's rule 1 does not deny: counted apart as `.mild` (LAW 8k's `.mild`)
        const full = /\b(day and night|never (?:quite )?stops|hangs over everything|new ironwork|waiting for the carts|full swing)\b/i.test(x.s);
        push(full ? '12b.boom' : '12b.boom.mild', x, { tab: INST, i: hs[0].headIdx, line: hs.map((c, k) => `${c.name}: ${ms[k]}`).join(' | ') },
          `a scene shows the ${key} trade at full work; every house of it on the page is marked by the crisis`, key,
          /running day and night/.test(x.s) ? 'src/generators/narrativeText.js (the war\'s "right side" pool, needs institution: smith)' : 'src/data/arrivalProse.js (needs trade at work: <trade>)');
      }
    }
  }

  // ---- 12c · a steady, quiet history under a live hard crisis it does not name
  if (hard.length) {
    // not "An ordinary place that has outlasted grander neighbours ..." (read on the thirty: it says how the place lasted, not
    // that its past was quiet, and a crisis now does not deny it)
    const CALM = /\b(long and steady|history here is (?:long|quiet|steady|uneventful)|little has ever happened|nothing much has ever happened|has always been (?:a )?(?:quiet|peaceful|steady))\b/i;
    for (const x of T.findSent(CALM, /^(Summary\/Overview|World\/History)$/)) {
      if (hard.some((c) => CRISIS_WORD[c].test(x.s))) continue;
      push('12c.calm', x, { tab: 'record', line: `stress.type = ${hard.join(', ')}` },
        `the line calls the place's past steady or quiet and names none of its live crises (${hard.join(', ')})`, hard.join('+'),
        'src/generators/narrativeText.js (history.historicalCharacter pool: crisis: any)');
    }
  }

  // ---- 12d · every essential covered, beside the page's own unmet need
  const ENOUGH = /\b(covers what it must and nothing beyond|Every essential is accounted for|wants for nothing|has all it needs)\b/i;
  // WHAT DENIES "every essential is accounted for" (read on the 720, 47 towns): the page's own food short, or a need list
  // that names food, salt, fuel or livestock (`12d.enough`); a need of plain stone, timber or metal is counted apart
  // (`.wide`: a poor place may honestly go without them); a need the list itself sets beyond the essential ("stone (for
  // major construction)", "timber (for large vessels)", luxury goods, hot springs) denies nothing and is not read
  const needs = String(T.needed || '').split(/,\s*|\s+and\s+(?=[a-z])/).map((x) => x.trim()).filter((x) => x && !/\(for /.test(x) && !/luxury|hot springs|spices|fine textiles|gold|silver|quality/i.test(x));
  const strongNeed = needs.find((x) => /\b(grain|food|flour|salt|fuel|charcoal|peat|livestock)\b/i.test(x));
  const wideNeed = needs.find((x) => /\b(timber|building wood|stone|metals?|copper|iron|ore|clay|wool|hides|tools|cloth)\b/i.test(x));
  const needLine = T.pageHas(/^Needed, and not brought in: /);
  const foodShort = T.pageHas(/falls (?:a little |well |far )?short of the food it needs|^Production .*Short: \d/);
  const ag = foodShort || (strongNeed && needLine) || (wideNeed && needLine);
  const rule12d = foodShort || strongNeed ? '12d.enough' : '12d.enough.wide';
  if (ag) for (const x of T.findSent(ENOUGH)) {
    push(rule12d, x, { tab: ag.tab, i: ag.i, line: [foodShort && foodShort.text, needLine && needLine.text].filter(Boolean).join(' | ') }, 'the line says every essential is covered; the page prints a need not met', 'need',
      'src/data/dossierStateProse/economy.generated.js (pools > POOR: crisis: any)');
  }

  // ---- 12e · no one to lead a rising, beside the record's live rising
  const tens = (T.record?.history?.currentTensions || []).filter((t) => /uprising|revolt|rebellion|riot|unrest/i.test(String(t?.type || '')));
  if (tens.length) for (const x of T.findSent(/\bnobody\b[^.]*\bstands ready to lead them\b|\bmay grumble, but nobody\b/i)) {
    push('12e.noRising', x, { tab: 'record', line: `history.currentTensions: ${tens.map((t) => `${t.type} (${[].concat(t.severity || []).join('/')})`).join(', ')}` },
      'the line says no one stands ready to lead the people; the record holds a live rising pressing those in charge', 'rising',
      'src/data/dossierStateProse/power.generated.js (pools > riskLabel: Stable: succession settled, no unrest)');
  }

  // ---- 12f · the Magic tab's supplier(s), every one stopped
  for (const x of T.findSent(/^Reliance on magic: .* · supplied by /, /^Systems\/Magic$/)) {
    const names = x.s.replace(/^.* · supplied by /, '').split(/, | and /).map((s) => s.trim()).filter(Boolean);
    const cards = names.map((n) => T.cards.find((c) => c.name.toLowerCase() === n.toLowerCase()));
    if (!cards.length || cards.some((c) => !c)) continue;
    const ms = cards.map((c) => T.cardMark(c));
    if (!ms.every((m) => m && /^Stopped by/.test(m))) continue;
    push('12f.magic', x, { tab: INST, i: cards[0].headIdx, line: cards.map((c, k) => `${c.name}: ${ms[k]}`).join(' | ') },
      'the reliance names its supplier(s); every one is a house the page marks stopped', names.join(', '),
      'src/domain/display/dossierViewModel.js :: deriveMagicSupplyView (over magicSourceOf: no house mark read; printed by src/components/new/tabs/MagicTab.jsx)');
  }
  return out;
}
