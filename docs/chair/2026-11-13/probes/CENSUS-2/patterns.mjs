// CENSUS-2 patterns: one test per KIND OF FAULT THE RECORD CAN CHECK. A test = a TRIGGER (words on one rendered line)
// + a FACT read from the same town's record that makes the line false. A hit is a CANDIDATE, not a fault, until read.
// Each test returns [{ pattern, sub, why }] for one line. The vocabulary of kind a was built from the cold readers'
// own sentences and facts (ROUND-3-CUT.json, ROUND-3-CUT-INCREMENT.json) and the tree's catalogue names through its
// display leaf (institutionDisplayName); each trigger word maps to the roster test that answers it.

// ---------- shared context guards ----------
// Text before the trigger in the same clause that makes the line NOT assert the house is here.
const NEG_BEFORE = /\b(no|not|without|nor|never|none|lacks?|lacking|absent|isn't|aren't|wasn't|nobody|nothing|neither|instead of|in place of|short of|want of|missing)\b[^.;:!?]{0,45}$/i;
const ELSEWHERE = /\b(foreign|nearest|next|neighbou?ring|nearby|another|other|outside|external|elsewhere|beyond|away|abroad|distant|walk to|walks? to|passing through|comes? through|travell?ing|visiting|itinerant|on circuit|travel(?:s|led)? to|ride to|carted to|sent to|go(?:es)? to|from the (?:city|town|village|capital)|in the (?:city|capital)|regional|a day's)\b/i;
const HYPOTHETICAL_BEFORE = /\b(if|would|could|should|might|may|wants? to|hopes? to|plans? to|dreams? of|needs?|seeks?|seeking|to build|to found|to establish|to open|to raise|once (?:had|was)|used to|former|old|ruined|abandoned)\b[^.;:!?]{0,40}$/i;
function guarded(line, idx, len, opts = {}) {
  const before = line.slice(Math.max(0, idx - 60), idx); const after = line.slice(idx + len, idx + len + 45);
  if (NEG_BEFORE.test(before)) return 'negated';
  const win = line.slice(Math.max(0, idx - 45), idx + len + 40);
  if (!opts.allowElsewhere && ELSEWHERE.test(win)) return 'elsewhere';
  if (HYPOTHETICAL_BEFORE.test(before)) return 'hypothetical';
  if (/^\s*\(?(?:a day away|elsewhere)/i.test(after)) return 'elsewhere';
  return '';
}

// ---------- kind a: NAMES WHAT THE TOWN LACKS ----------
// trigger (case-insensitive, word-bounded) -> roster regex over the institution names (catalogue key AND its display
// name); a name beginning "Access to" never counts as the house itself.
export const A_VOCAB = [
  { id: 'bakery', t: /\bbaker(?:y|ies|s)?\b/i, r: /baker/i },
  { id: 'mason', t: /\b(?:stone)?masons?\b|\bmason'?s'? yard\b/i, r: /mason|quarry/i },
  { id: 'mill', t: /\b(?<!saw)(?:mills?|millers?|watermills?|windmills?|millstones?|mill-?race)\b(?!-)/i, r: /^(?:mills?)\b/i, x: /\bsaw-?mill|\bmill(?:ing)? (?:at home|outside)|of its own\b/i },
  { id: 'sawmill', t: /\bsaw-?mill(?:s|ing)?\b|\bsawyers?\b/i, r: /sawmill/i },
  { id: 'guild:thieves', t: /\bthieves'? guilds?\b/i, r: /thieves' guild/i },
  { id: 'guild:mages', t: /\bmages'? guilds?\b/i, r: /mages' guild|mages' district|academy of magic|wizard/i },
  { id: 'guild:adventurers', t: /\badventurers'? (?:guilds?|charter hall|hall)\b/i, r: /adventurers'/i },
  { id: 'guild:assassins', t: /\bassassins'? guilds?\b/i, r: /assassins'/i },
  { id: 'guild:merchant', t: /\bmerchants?'? guilds?\b/i, r: /merchant guild|guild consortium/i },
  { id: 'guild', t: /\bguild(?:s|halls?|smen|smaster|-?masters?)?\b/i, r: /^(?!.*(?:thieves|mages|assassins|adventurers)).*guild/i,
    pre: /(?:thieves|mages|adventurers|assassins|merchants?)'?\s*$/i },
  { id: 'market', t: /\b(?<!black |whisper )(?:market(?:s|place|places| days?| squares?| halls?| stalls?)?)\b(?!\s*(?:value|price|rate|town))/i, r: /(?<!black )(?<!whisper )market|fair\b|bazaar/i, x: /black market|whisper market|\b(?:to|out to|at|for) market\b|market (?:value|price)/i },
  { id: 'fair', t: /\b(?:annual|yearly|seasonal|great|trade|horse|hiring|cattle|summer|autumn|spring) fairs?\b|\bthe fairs?\b|\bfairs\b|\bfair-?days?\b|\bfairground/i, r: /fair\b|market/i },
  { id: 'church', t: /\b(?:churche?s?|chapels?|temples?|houses? of worship|parish(?:es)?|minster|abbey|priory|religious houses?|bells|bell-?towers?|bell-?house)\b/i, r: /church|house of worship|houses of worship|cathedral|monaster|priest|friary|temple|abbey|chapel/i },
  { id: 'cathedral', t: /\bcathedrals?\b/i, r: /cathedral/i },
  { id: 'clergy', t: /\b(?:priests?|priesthood|priestly|clergy|clergyman|clerical|clerics?|vicars?|parsons?|curates?|chaplains?|abbots?|abbess|monks?|nuns?|friars?|deacons?|bishops?)\b/i, r: /church|house of worship|houses of worship|cathedral|monaster|priest|friary|temple|abbey|chapel|healer \(divine/i },
  { id: 'inn', t: /\b(?:inns?|taverns?|alehouses?|ale-houses?|innkeepers?|taprooms?|hostelr(?:y|ies)|caravanserai)\b/i, r: /\binns?\b|tavern|ale ?house|caravanserai|waystation|travelers' inn/i },
  { id: 'docks', t: /\b(?:docks?|dockside|dockyards?|harbou?rs?|quays?|quayside|wharf|wharves|piers?|jett(?:y|ies)|shipyards?|boatyards?)\b/i, r: /dock|harbou?r|port facilities|fisher's landing|shipyard|boatyard|river ferry|landing/i },
  { id: 'walls', t: /\b(?:town|city|village|its|their|the [a-z]+'s) walls\b|\bbehind (?:its|the) walls\b|\bon the walls\b|\bthe walls (?:hold|are|stand|of the)\b|\bramparts?\b|\bbattlements?\b|\bpalisades?\b|\bstockades?\b|\b(?:is|stands|sits) walled\b/i, r: /wall|palisade|fortification|citadel|earthwork/i },
  { id: 'gates', t: /\b(?:town|city) gates?\b|\bthe gates of\b|\bgate tally\b|\bgatekeepers?\b|\bgate-?wardens?\b/i, r: /gates|wall|palisade|fortification|citadel/i },
  { id: 'garrison', t: /\bgarrison(?:s|ed)?\b|\bbarracks\b/i, r: /garrison|barracks|citadel/i },
  { id: 'watch', t: /\b(?:the|town|city|village|night|its|a) watch\b(?!\s*(?:for|over|out|the|them|it|him|her))|\bwatch(?:men|man|house|-?captain|-?posts?)\b|\bconstables?\b/i, r: /watch|guard/i, x: /keep(?:s|ing)? watch|on watch|watch (?:over|for)|stand(?:s|ing)? watch/i },
  { id: 'healer', t: /\b(?:healers?|physicians?|doctors?|surgeons?|herbalists?|infirmar(?:y|ies)|hospitals?|leeches)\b/i, r: /healer|midwife|apothecar|hospital|physician|herbal|almshouse/i },
  { id: 'apothecary', t: /\bapothecar(?:y|ies)\b/i, r: /apothecar|alchemist/i },
  { id: 'midwife', t: /\bmidwi(?:fe|ves)\b/i, r: /midwife|healer|hospital/i },
  { id: 'alchemist', t: /\balchemists?\b|\balchemy\b/i, r: /alchem/i, x: /(?:where|unlike|as|than) the alchemist/i },
  { id: 'alchemical', t: /\balchemical\b/i, r: /alchem|apothecar/i },
  { id: 'tannery', t: /\btanner(?:y|ies|s)?\b|\btan-?yards?\b|\btan-?pits?\b/i, r: /tann/i },
  { id: 'smithy', t: /\b(?:smith(?:y|ies)|blacksmiths?|farriers?|smiths)\b|\b(?:the|a|its|their|every|each) forges?\b|\bforges\b/i, r: /smith|forge|metalworker|smelter/i },
  { id: 'court', t: /\bcourt-?houses?\b|\bcourts? of law\b|\bmagistrates?\b|\blaw-?courts?\b/i, r: /court|magistrat/i },
  { id: 'quarry', t: /\bquarr(?:y|ies|ying|ymen|ymen's)\b|\bdressed stone\b/i, r: /quarry|mine\b/i },
  { id: 'mine', t: /\b(?:the|a|its|their|open-?cast|deep) mines?\b|\bmines\b|\bminers?\b|\bmine-?shafts?\b|\bmining\b/i, r: /\bmine\b|smelter/i },
  { id: 'reeve', t: /\breeves?\b/i, r: /reeve/i },
  { id: 'fishing', t: /\bfisher(?:men|folk|s)\b|\bfishing (?:boats?|fleet|families|house)\b|\bmorning catch\b|\bfishmongers?\b/i, r: /fish/i },
  { id: 'alchemy-mage', t: /\bwizards?'? towers?\b|\bmages?'? (?:towers?|district)\b|\bacademy of magic\b/i, r: /wizard|mage|academy of magic/i },
  { id: 'adventurers', t: /\badventurers'\b/i, r: /adventur|hireling|charter hall|free company|dungeon/i },
  { id: 'merchant-house', t: /\b(?:merchant|trading) houses?\b/i, r: /merchant|trading|banking|guild consortium|warehouse|caravan/i },
  { id: 'customs', t: /\bcustoms(?:-| )house\b|\bcustoms (?:officers?|men|post)\b|\bthe customs\b/i, r: /customs/i },
  { id: 'prison', t: /\b(?:prisons?|gaols?|jails?|lock-?ups?)\b/i, r: /prison|stocks|citadel/i },
  { id: 'merchants', t: /\bmerchants?\b/i, r: /market|merchant|trad|caravan|warehouse|bazaar|fair\b|customs|exchange|consortium|banking|auction|money|pawn|chandler|oligarchy/i, pre: /(?:thieves|mages|adventurers|assassins)'?\s*$/i },
  { id: 'waterworks', t: /\bwaterworks\b|\baqueducts?\b|\bwater-?channels?\b|\bsewers?\b|\bcisterns?\b/i, r: /aqueduct|water system|water infrastructure|sewage|waterworks/i },
  { id: 'force', t: /\b(?:local|law) enforcement\b|\benforcement (?:is|keeps)\b|\bpaid hands\b|\bsoldiers\b|\bmen-at-arms\b|\bguardsmen\b|\bsentries\b/i, r: /watch|guard|garrison|militia|levy|warden|mercenar|company|blades|barracks|citadel|knight|sellsword|hireling|army|soldier|sheriff|constab/i },
  { id: 'court-generic', t: /\b(?:the|a|its) court\b|\bcourt only\b|\bcourts\b/i, r: /court|magistrat/i, x: /royal court|court intrigue|courtier|courtyard|holds? court|court of (?:the|a) |paying court|courted|courting|(?:enclosed|caravan|inner|outer|planted|open|tiled|paved) courts|courts (?:and|of) (?:gardens|planted|tiled)/i },
  { id: 'ships', t: /\bships?\b|\bship's\b|\bsea approaches\b|\bport facilit(?:y|ies)\b|\bnaval\b|\b(?:the|via the|its) port\b/i, r: /dock|harbou?r|port facilities|shipyard|boatyard|fisher's landing|landing/i, x: /\bships? (?:out|its|to)\b|\bshipped\b|airship|estates, ships/i },
  { id: 'textile', t: /\bfullers?\b|\bfulling\b|\bweavers?\b|\bdyers?\b/i, r: /fuller|weaver|textile|dyer|tailor/i },
  { id: 'workshops', t: /\bworkshops?\b|\bcraftsm[ae]n\b|\bartisans?\b/i, cat: 'Crafts' },
  { id: 'brewery', t: /\bbrewer(?:y|ies|s)?\b|\bbrewhouses?\b|\bmaltsters?\b/i, r: /brew|malt/i },
];
const SKIP_VIEW = /^Notes\//;
const LIST_LINE = /^(?:Needs|Draws on|Requires|Unexploited|Opportunity):/i;
export function rosterNames(s, displayName) {
  const out = []; for (const i of s.institutions || []) { const n = String(i.name || ''); if (!n || /^access to/i.test(n)) continue; out.push(n); const d = displayName ? displayName(n) : n; if (d && d !== n) out.push(d); }
  for (const f of s.powerStructure?.factions || []) { const n = String(f.faction || f.name || ''); if (n) out.push(n); }   // a power is a force or a house of the town too
  return out;
}
export function npcRoles(s) { return (s.npcs || []).map((n) => `${n.role || ''} ${n.title || ''}`.toLowerCase()); }
const PAST_ROW = /^(?:Founded by|Origin|Early trial|How survived|Founding):/i;
const SPENT = /\b(?:depleted|exhausted|worked out|cleared|abandoned|ruined|silted|fished out)\b/i;
const PROSE = (l) => (l.match(/\b[a-z][a-z'’-]{2,}\b/g) || []).length >= 3;
export function maskResources(line, s) {
  let out = line; const keys = [...(s.config?.nearbyResources || []), ...(s.config?.nearbyResourcesDepleted || [])];
  for (const k of keys) { const lab = String(k).replace(/_/g, ' '); out = out.replace(new RegExp(lab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => '~'.repeat(m.length)); }
  return out.replace(/\bMill Sites\b/g, '~~~~~~~~~~');
}
export function testA(line0, view, ctx) {
  if (SKIP_VIEW.test(view) || LIST_LINE.test(line0) || /^access to /i.test(line0) || /^access to /i.test(ctx.prev || '')) return [];
  if (line0.includes('✓') || PAST_ROW.test(line0)) return [];
  const line = maskResources(line0, ctx.s);
  const res = []; const names = ctx.roster;
  for (const v of A_VOCAB) {
    const re = new RegExp(v.t.source, 'gi'); let m;
    while ((m = re.exec(line))) {
      if (/\p{L}/u.test(line[m.index - 1] || '') || /\p{L}/u.test(line[m.index + m[0].length] || '')) continue;
      if (v.pre && v.pre.test(line.slice(0, m.index))) continue;
      if (v.x && v.x.test(line.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30))) continue;
      if (guarded(line, m.index, m[0].length)) continue;
      const win = line.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
      if (SPENT.test(win) || /\((?:local|its)[^)]*$/i.test(line.slice(Math.max(0, m.index - 40), m.index))) continue;
      const w = m[0].toLowerCase().replace(/s$/, '');
      if (ctx.npcRoles.some((r) => r.includes(w))) break;   // a person here holds that role: the line names them
      if (v.cat ? ctx.s.institutions?.some((i) => i.category === v.cat && !/^access to|subsistence/i.test(i.name)) : names.some((n) => v.r.test(n))) break;   // the roster (houses and powers) holds one
      res.push({ pattern: 'a', sub: v.id, why: `"${m[0]}" with no ${v.id} on the roster` }); break;
    }
  }
  // a catalogue house printed by its own (display) name where the roster holds no house of that exact name (a flow
  // card's "via" row, a list of houses). Names of two words or more, or with a parenthesis, matched case-sensitively;
  // a one-word name only when it stands alone or in a " · " list.
  if (ctx.catalog && !/\b(?:Operational|Running|Impaired|Vulnerable|Dormant|Collapsed|Idle|Failing|Disrupted)\b/.test(line)) { const own = new Set(ctx.roster); const list = / · /.test(line) || ctx.catalog.has(line.trim());
    let masked = null; const maskIt = () => { let m2 = line; for (const n of (ctx._rosterSorted ??= [...ctx.roster].sort((a, b) => b.length - a.length))) if (n.length > 3 && m2.includes(n)) m2 = m2.split(n).join('~'.repeat(n.length)); return m2; };
    const ownFam = ctx._ownFam ??= [...own].map(fam);
    for (const c of ctx.catalog.values()) { if (!c.multi && !list) continue; if (!line.includes(c.display)) continue; if (own.has(c.name) || own.has(c.display)) continue;
      const cf = c.fam; if (ownFam.some((o) => o.includes(cf) || cf.includes(o))) continue;   // another rung of a house the town has
      masked ??= maskIt(); const i = masked.indexOf(c.display); if (i < 0) continue; const pre = masked[i - 1], post = masked[i + c.display.length];
      if ((pre && /[\w(~'’]/.test(pre)) || (post && /[\w~'’]/.test(post)) || (post === ' ' && /^ [a-z]/.test(masked.slice(i + c.display.length, i + c.display.length + 2)) && !c.multi)) continue;
      if (guarded(line, i, c.display.length, { allowElsewhere: false })) continue;
      if (res.some((r) => r.sub === 'house')) break; res.push({ pattern: 'a', sub: 'house', why: `"${c.display}" printed, not on the roster` }); }
  }
  return res;
}
const fam = (n) => String(n).toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/(\w)s\b/g, '$1').trim();
export async function loadCatalog(R, displayName) {
  let cat; try { ({ institutionalCatalog: cat } = await import(R + '/data/institutionalCatalog.js')); } catch { return null; }
  const m = new Map(); for (const tier of Object.values(cat)) for (const catg of Object.values(tier || {})) for (const name of Object.keys(catg || {})) {
    const display = displayName(name); if (/^access to/i.test(name)) continue; m.set(display, { name, display, fam: fam(display), multi: /\s|\(/.test(display) }); }
  return m;
}

// ---------- kind b: NORMAL TIMES UNDER A CRISIS ----------
// The crisis in force is read from the record (stress, one or several). "Roads cut" = a siege in force, or a plague
// whose own record text closes the town (quarantine / nobody comes in or leaves).
const B_TRAFFIC = [
  { id: 'arrivals', t: /\b(?:caravans?|travell?ers|merchants|traders|pilgrims|visitors|carts|wagons|boats|barges|ships|coaches|pack-?trains?|drovers|pedlars|peddlers)\b[^.;]{0,40}\b(?:arrive|arrives|come|comes|pass|passes|bring|brings|call|calls|stop|stops|carry|carries|stay|stays|put in|unload|unloads|shelter|lodge|rest|haggle|gather|crowd)\b/i },
  { id: 'trade-flows', t: /\btrade (?:flows|moves|comes|goes|passes|runs|keeps|carries)\b|\bplenty passes through\b|\bthrough-?traffic\b|\bpassing trade\b|\btrade route (?:brings|carries|feeds)\b/i },
  { id: 'market-day', t: /\bmarket[- ]days?\b|\bon market day\b|\b(?:every|each) (?:morning|market day|week|day)\b[^.]{0,30}\b(?:available|sold|brought|open)|\bavailable (?:every|each) (?:morning|day|week)\b|\bsold (?:daily|weekly)\b/i },
  { id: 'brought-in', t: /\b(?:brings?|brought|carts?|boats?|ships?|barges?|caravans?) (?:in|bring in|brings in)\b[^.;]{0,30}|\bbought in\b|\bshipped in\b|\bcarted in\b|\bboats bring\b|\bcarts bring\b/i },
  { id: 'sold-out', t: /\bsold (?:out|on|abroad|downriver|to (?:the|other|neighbou?ring|regional|passing))\b|\bcarry the [a-z]+'s dealings outward\b|\bdealings outward\b|\bships? (?:out|its)\b[^.]{0,20}\b(?:goods|grain|wool|ore|timber)\b/i },
  { id: 'road-living', t: /\bmakes its living from (?:other people's )?journeys\b|\blives off (?:through-)?traffic\b|\btraffic moves\b|\bweighing and selling\b|\bcarted (?:to|in|out)\b|\bbrought back\b/i },
  { id: 'road-open', t: /\b(?:the )?roads? (?:in|is open|are open|stays? open|brings?)\b|\bopen roads?\b|\broad travell?ers\b|\bscheduled (?:coach )?departures?\b|\brelay horses\b|\bstabling for\b/i },
];
const B_FOOD = [
  { id: 'plenty', t: /\b(?:that )?feeds (?:it|itself|its people)\b(?! (?:badly|poorly|no longer))|\bgrows? (?:a little |far |much )?more than it eats\b|\bwith some to put by\b|\bfeeds itself\b|\bwell[- ]fed\b|\bplentiful\b|\bin plenty\b|\bsurplus\b|\beats well\b|\bno one (?:here )?goes hungry\b|\bnobody (?:here )?goes hungry\b|\bwell stocked\b|\bbusy and well stocked\b|\bstill hold\b/i },
  { id: 'hunger-later', t: /\b(?:would|could) bring (?:real )?hunger\b|\ba bad (?:season|year|harvest) would\b|\bif the harvest fail/i },
  { id: 'fresh-food', t: /\b(?:fruit|vegetables|dairy|eggs|fresh (?:bread|meat|fish))\b[^.]{0,30}\b(?:available every|every morning|sold daily|daily)\b/i },
];
const B_OCC = [
  { id: 'order-own', t: /\b(?:order|the peace)\b[^.;]{0,40}\bis kept by\b/i, unless: /occup/i },
  { id: 'rules-freely', t: /\b(?:governs?|rules?) (?:freely|unopposed|unchallenged|without (?:rival|challenge))\b|\bits own (?:officials|council|court) (?:decide|rule|govern)\b/i },
];
const B_EXCUSE_FAMINE = /famine|hunger is (?:already )?here|already hungry|ration|starv|lost (?:its|the) harvest|harvest (?:has )?failed|no longer feeds/i;
const B_EXCUSE = /\bstolen|smuggl|\bsiege|besieg|blockade|cut off|cut every|cuts every|severed|stopped|halted|no longer|closed|until|before the|used to|\bonce\b|\bsince the\b|would|could|might|when the (?:siege|roads?|war)|nothing comes|none come|no (?:trade|caravan|cart|traveller|boat|road)|quarantin|nobody (?:comes|leaves)|famine|hunger is (?:already )?here|go(?:es)? short|ration|starv|occup|lost (?:its|the) harvest/i;
export function crisisOf(s) {
  const st = Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [];
  const types = new Set(st.map((x) => x && x.type).filter(Boolean));
  const text = st.map((x) => `${x.summary || ''} ${x.viabilityNote || ''}`).join(' ');
  const famine = types.has('famine') || !!s.economicState?.foodSecurity?.hasFamine;
  const siege = types.has('under_siege');
  const quarantine = types.has('plague_onset') && /nobody (?:comes|leaves)|no one (?:comes|leaves)|(?:is|are) sealed|roads? (?:are|is) closed/i.test(text);
  return { types, siege, famine, occupied: types.has('occupied'), plague: types.has('plague_onset'), quarantine, roadsCut: siege || quarantine, text };
}
export function testB(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return [];
  const c = ctx.crisis; const res = [];
  const fire = (list, label) => { for (const v of list) { const m = line.match(v.t); if (!m) continue; if (v.unless && v.unless.test(line)) continue; if ((label === 'famine' ? B_EXCUSE_FAMINE : B_EXCUSE).test(line.replace(m[0], ' '))) continue; if (NEG_BEFORE.test(line.slice(Math.max(0, m.index - 50), m.index))) continue; res.push({ pattern: 'b', sub: `${label}:${v.id}`, why: `"${m[0]}" under ${label}` }); return; } };
  const seaOpen = /port|coast|sea/i.test(String(ctx.s.config?.tradeRouteAccess || '')) || (ctx.roster || []).some((n) => /dock|harbou?r/i.test(n));
  if (c.roadsCut && /^(?:Exports|Imports)$/.test(ctx.prev || '') && view === 'Systems/Economics') { if (!seaOpen && !/^No significant/i.test(line) && !/naval route only/i.test(line)) res.push({ pattern: 'b', sub: `${c.siege ? 'siege' : 'quarantine'}:trade-list`, why: `the ${ctx.prev} list printed while the roads are cut` }); }
  else if (c.roadsCut && !(seaOpen && /\b(?:port|ships?|boats?|sea|harbou?r|naval|quay|barges?)\b/i.test(line))) fire(B_TRAFFIC, c.siege ? 'siege' : 'quarantine');
  if (c.famine) fire(B_FOOD, 'famine');
  if (c.occupied) fire(B_OCC, 'occupied');
  return res;
}

// ---------- kind c: A SIZE WORD IN A SMALL PLACE ----------
// Bands from the tree's populationBand (thorp, hamlet, village = small). Thorp and hamlet: plural streets, an agora,
// a civic/market/town square or plaza, masonry, neighbourhoods, suburbs, crowds, dense populations. Thorp, hamlet,
// village: quarters, districts. Thorp: a cathedral, civic buildings.
const C_TH = [
  { id: 'streets', t: /\bstreets\b/i }, { id: 'agora', t: /\bagoras?\b/i },
  { id: 'square', t: /\b(?:civic|market|town|central|main|public|civic-ritual) (?:squares?|plazas?)\b|\bplazas?\b/i },
  { id: 'masonry', t: /\bmasonry\b/i }, { id: 'neighbourhoods', t: /\bneighbou?rhoods?\b/i }, { id: 'suburbs', t: /\bsuburbs?\b|\bsuburban\b/i },
  { id: 'crowds', t: /\bcrowds\b|\bthronged?\b|\bcrowded (?:streets|lanes|markets?|squares?|alleys)\b/i }, { id: 'dense', t: /\bdense populations?\b/i },
];
const C_SMALL = [
  { id: 'quarters', t: /\bquarters\b|\b(?:the|a|its|their|each|every|one|separate|own|riverside|old|poor|rich|merchant|craft|temple|foreign|trade) quarter\b(?! (?:of|past|hour|mile|day|year|the))/i, x: /\b(?:winter|living|sleeping|close|cramped|tight|their own|guest|servants'?|crew) quarters\b|\bheadquarters\b|\bthree[- ]quarters\b|\bno quarter\b|\bquarter[- ](?:day|staff|hour|mile)/i },
  { id: 'districts', t: /\bdistricts?\b/i, x: /\b(?:surrounding|rural|the whole|this) district\b/i },
  { id: 'wards', t: /\b(?:in|into|by) wards\b|\bwards and courtyards\b/i },
  { id: 'urban', t: /\burban\b/i },
];
const C_THORP = [{ id: 'cathedral', t: /\bcathedrals?\b/i }, { id: 'civic-buildings', t: /\bcivic (?:buildings?|halls?|centres?|centers?|offices)\b/i }];
export function testC(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return [];
  const tier = ctx.tier; const res = [];
  const lists = []; if (tier === 'thorp' || tier === 'hamlet') lists.push(C_TH); if (['thorp', 'hamlet', 'village'].includes(tier)) lists.push(C_SMALL); if (tier === 'thorp') lists.push(C_THORP);
  for (const L of lists) for (const v of L) { const m = line.match(v.t); if (!m) continue; if (v.x && v.x.test(line)) continue;
    const before = line.slice(Math.max(0, m.index - 60), m.index); if (NEG_BEFORE.test(before)) continue;
    if (/\b(?:of|in|to|from) (?:the )?(?:city|cities|capital|metropolis|towns)\b/i.test(line.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40))) continue;
    res.push({ pattern: 'c', sub: v.id, why: `"${m[0]}" in a ${tier} of ${ctx.population}` }); }
  return res;
}
