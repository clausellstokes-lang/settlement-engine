// BAR6-AUDIT-C · LAW 7 · AN ORDINARY DAY IS NOT PRINTED UNDER A CRISIS OR A STATED THREAT (it widens LAW 2's scene
// rules: law2.mjs). A line of ease, plenty, ordinary arrival or "nothing threatens", unmarked, under a siege, a famine,
// a war or an occupation in force, or beside the page's own threat words. Pure; reads one town read by
// `pageC.mjs :: readTownC`. A line that speaks of the crisis itself is the crisis's own account and is not read; a
// marked row is covered by its mark; a plot hook, a rumour and the history state their own facts.
//   { law: 'L7', rule, town, tab, i, line, against: { tab, line }, why }
import { sentencesOfPage, lineMarked, MARK_LEAD } from './pageC.mjs';

const OWN_FACT_TABS = /^(Summary\/Plot Hooks|World\/Rumors & News|World\/History|Notes\/)/;
const SELF_AWARE = /\b(siege|besieg\w*|famine|hunger|war\b|the army|armies|occupi\w*|before the|used to|no longer|until the\b|cut off|stopped|ration|short of|go short|goes short|shortage)\b/i;
const inst = (rule, town, x, against, why) => ({ law: 'L7', rule, town, tab: x.tab, i: x.i, line: x.s, against, why });

// 7a "nothing threatens" beside a stated threat
const NO_THREAT = /\b(nothing threatens it|nothing presses [A-Z][\w'-]* at present|raiders and rivals look elsewhere|nothing here to fear|no threat (to|worth))\b/i;
// 7b a calm defence line under a crisis, or beside walls the page calls impaired
const ORDINARY_DEFENCE = /\bdefended in the ordinary way\b/i;
const KEPT_WORKING = /\b(fresh repairs show on|keeps its defences in working order)\b/i;
// 7c plenty or ease under want
const PLENTY = /\b(handles more than the [a-z]+ could ever use|stalls are piled with|nobody (here )?talks about the price of bread|no one (here )?talks about the price of bread|does not empty the [a-z']+ tables|without going hungry|no one goes hungry|nobody goes hungry|tables are full|more than enough to eat)\b/i;
// 7d ordinary traffic in or out under a siege (nothing in or out), or into an isolated place that trades nothing
const TRAFFIC = /\b(heads? out( together)?|set(s)? out for the fields|file(s)? past|counts? them in|crowd(s)? the road|on the road in|come(s)? in by road|arriv(e|es|ing) (with|from|by|on)|loaded (frames|carts|mules)|pack trains?|porters|travell?ers (come|arrive|pass)|carts (roll|come|arrive)|caravans? (arrive|come|pass))\b/i;
const NEGATED = /\b(no|not|nobody|nothing|none|never|empty|nearly bare|gone|once)\b/i;

export function law7(T, town) {
  const out = [];
  const siege = T.crises.has('under_siege');
  const famine = T.crises.has('famine');
  const war = T.crises.has('wartime');
  const occ = T.crises.has('occupied');
  const anyCrisis = T.crises.size > 0;
  const monster = T.threats.find((t) => t.kind === 'monster');
  const S = sentencesOfPage(T).filter((x) => !OWN_FACT_TABS.test(x.tab) && !/^(Services · |Connection:|Backs · |Needs |Secret: |How they deal )/.test(x.s) && !MARK_LEAD.test(x.s));
  const marked = (x) => !!lineMarked(T, x.tab, x.i);
  const crisisLine = (c) => ({ tab: 'record', line: `stress.type = ${c}` });
  // the page's own want words (the food band, a short mark on bread, households going short)
  const foodWant = /Deficit|Pressured|Critical|famine/i.test(T.foodWord) ? { tab: 'Summary/Overview', line: `Food Security · ${T.foodWord}` } : null;
  const breadShort = T.pageHas(/^Short of grain\.|Fresh bread \(short\)|Bread production\. .*short|^Services · .*bread \(short\)/i);
  const goShort = T.pageHas(/\bSome households (still )?go short\b|\bPortions have got smaller\b|\bhouseholds go short\b/);
  const wallsImpaired = T.pageHas(/^(City walls and gates|Town walls|Massive walls and fortifications|Palisade or earthworks|Stone walls)[^·]* · Defense · Impaired$|critically impaired by siege: .*walls/i);

  for (const x of S) {
    if (marked(x)) continue;
    // 7a
    let m = NO_THREAT.exec(x.s);
    if (m) {
      // a wall keeps out a besieger, an army, an occupier or a beast; not a famine. A monster threat counts where the
      // page itself prints it (its Beasts & Monsters band Weak or Critical, or its own monster words).
      const pageMonster = monster && (T.threats.find((t) => t.kind === 'monster-weak') || T.threats.find((t) => t.kind === 'monster' && t.tab !== 'record'));
      const wallCrisis = [...T.crises].filter((c) => /under_siege|wartime|occupied/.test(c));
      const why = pageMonster ? { tab: pageMonster.tab, line: `${pageMonster.line} (${monster.line})` } : wallCrisis.length ? crisisLine(wallCrisis.join('+')) : null;
      if (why && !(monster && /raiders and rivals/i.test(m[0]) && !/nothing presses/i.test(x.s))) { out.push(inst('7a-nothreat', town, x, { tab: why.tab, line: why.line }, `"${m[0]}" beside the page's own threat`)); continue; }
    }
    // 7b
    if (ORDINARY_DEFENCE.test(x.s) && (siege || war || occ)) { out.push(inst('7b-defence', town, x, crisisLine([...T.crises].join('+')), 'a calm-times defence line under a crisis that has the town on a war footing')); continue; }
    if (KEPT_WORKING.test(x.s) && wallsImpaired) { out.push(inst('7b-defence', town, x, { tab: wallsImpaired.tab, line: wallsImpaired.text }, 'fresh repairs and defences in working order; the page calls the walls impaired')); continue; }
    // 7c
    m = PLENTY.exec(x.s);
    if (m && !SELF_AWARE.test(x.s)) {
      // the market's throughput and the piled stalls deny only a famine or a siege; the bread line denies bread marked short;
      // the tables' reassurance denies any want the page prints (a Pressured food word, households going short)
      const bread = /price of bread/i.test(m[0]);
      const tables = /tables|hungry/i.test(m[0]);
      const against = famine ? crisisLine('famine') : siege ? crisisLine('under_siege') : (bread && breadShort) ? { tab: breadShort.tab, line: breadShort.text } : (tables && goShort) ? { tab: goShort.tab, line: goShort.text } : (tables && foodWant) ? foodWant : null;
      if (against) { out.push(inst('7c-plenty', town, x, against, `"${m[0]}": plenty or ease, unmarked, where the page says there is want`)); continue; }
    }
    // 7d
    if (x.tab === 'Summary/Overview' || x.tab === 'World/Daily Life') {
      m = TRAFFIC.exec(x.s);
      if (m && !NEGATED.test(x.s) && !SELF_AWARE.test(x.s)) {
        if (siege) { out.push(inst('7d-traffic', town, x, crisisLine('under_siege'), `"${m[0]}": ordinary traffic in or out of a town the siege lets nobody in or out of`)); continue; }
        const isolated = String(T.record?.config?.tradeRouteAccess || '') === 'isolated' && !T.imports.length;
        const noGate = T.pageHas(/nobody counts who comes in/);
        if (isolated && /porters|loaded|counts? them in|pack train|carts|caravan/i.test(m[0])) { out.push(inst('7d-traffic', town, x, noGate ? { tab: noGate.tab, line: noGate.text } : { tab: 'record', line: 'trade access isolated; imports none' }, `"${m[0]}": laden arrivals at an isolated place that brings nothing in`)); continue; }
        if (famine || war || occ) { out.push(inst('7w-tone', town, x, crisisLine([...T.crises].join('+')), `"${m[0]}": ordinary traffic under ${[...T.crises].join('+')} (WEAK by the second check: the work goes on, the tone is off)`)); continue; }
      }
    }
  }
  return out;
}
