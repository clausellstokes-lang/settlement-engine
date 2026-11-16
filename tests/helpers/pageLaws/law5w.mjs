// BAR6-AUDIT-G · LAW 5 WIDENED · THE LEXICON OF PRESUMPTION CLASSES and the per-class declaration reading.
// Shared by docs/chair/2026-11-16/bar6/AUDIT/law5w-inventory-g.mjs (the static inventory) and defaultDeny-g.mjs (the
// default-deny measure). A factory over the tree's own vocabulary (`makeLaw5w(await import(<tree>/src/domain/facts/
// factVocabulary.js))`), so the classes are read with the atoms of whichever tree is measured. Pure.
export function makeLaw5w({ parseAtom, STATE_MARK_DIMENSIONS }) {
// ---- THE LEXICON: one class a presumption can be false in
const W = (s) => new RegExp(s, 'i');
const CLASSES = {
  // law 5's six (BAR5-AUDIT-B), verbatim
  outside: W(String.raw`\b(from abroad|abroad|imported|caravans?|caravanserai|travell?ers?|pilgrims?|pilgrimage|merchants? from|foreign (merchants|traders|goods)|passing trade|outside (buyers|customers|trade)|from (distant|far)|trade routes?|the roads? (in|out|bring|brings)|ships? (come|call|arrive|bring)|coach(es)? (depart|arrive)|visitors (come|arrive))\b`),
  plenty: W(String.raw`\b(plenty|plentiful|abundan(t|ce)|feast(s|ing)?|well[- ]fed|never (goes |go )?hungry|without going hungry|fresh (meat|bread|fish|milk|produce|game)|full (larders|granaries|bellies|tables)|beef|pork|mutton|day's catch|piled (high|with)|heaped|overflow(s|ing)?|more than (the|a) (village|town|city|hamlet|place|settlement) (could|can) (ever )?(use|eat|wear)|surplus|to spare|laid in|nobody (here )?(talks|worries) about the price|does not empty the|poor year (in one )?does not|a bad season .{0,30}without)\b`),
  work: W(String.raw`\b(steady (work|trade|custom|living)|work never dries up|never (short of|without|wants for|lacks) (work|custom|trade)|always (has work|busy|in demand)|business is (good|brisk|steady)|plenty of work)\b`),
  animals: W(String.raw`\b(horse hire|rent(s|ing)? (horses|animals|mounts)|fresh mounts?|draught (animals|horses)|cart hire|wagons? for hire|pack animals)\b`),
  iron: W(String.raw`\b(reforge|mend(s|ing)? (tools|ironwork)|re-edge|tool manufacture|weapon smithing|ironwork|iron (tools|goods|bars))\b`),
  law: W(String.raw`\b(thief is known|thieves are (caught|known)|until they make it right|crime is (rare|unknown)|doors (are )?(left )?unlocked|nobody steals|no one steals|justice (is )?(swift|sure)|the courts? (sit|sits|hear|hears)|disputes are settled)\b`),
  // the widening (BRIEF-BAR6-AUDIT seat G)
  size: W(String.raw`\b(streets|(particular|main|back|side|narrow|crowded|busy|cobbled|paved|few|which) streets?|alley(way)?s?|quarters|(the|a|its|every|each|one|old|new|poor|rich|merchant|craft|artisan|temple|foreign|harbour|dock|river) quarter|districts?|neighbou?rhoods?|wards\b(?! off)|boroughs?|suburbs?|avenues?|boulevards?|plazas?|tenements?|city blocks?|thousands of|throngs?)\b`),
  goods: W(String.raw`\b(cloth|wool|linen|silk|bolts of|bales? of|pots|pottery|crockery|glassware|cut stone|chisels?|spices?|herbs|butter|cheeses?|cream|wine|ale|beer|mead|cider|leather|hides|furs|pelts|candles|beeswax|rope|barrels|casks|horseshoes|ironware|weapons|armou?r|blades|arrows|jewel(le)?ry|perfumes?|incense|dyes?|dyed|parchment|books|salt fish|sugar|carts? (of|loaded|piled)|crates of|sacks of|loads of|cartloads?|goods (piled|stacked|go out|leave)|road out|kilns?|looms?|forge|anvil|bellows)\b`),
  ease: W(String.raw`\b(nobody hurries|unhurried|no one hurries|at (their )?leisure|idle(ly)?|lazily|singing|sings|laughter|laughing|gossip(s|ing)?|feast day|dancing|celebrat(e|es|ing|ion)|music (drifts|carries|plays)|a poet holds|children (play|run|chase)|ordinary (day|way|times)|as (usual|ever)|the usual)\b`),
  threat: W(String.raw`\b(nothing (threatens|presses|troubles|disturbs)|no (one|body) (fears|threatens)|nothing to fear|without fear|no threat|safe (enough|here|place|roads?)|(is|feels|stays|remains) (safe|quiet|peaceful|calm)|peaceful|untroubled|in the ordinary way|the usual trouble|in (good|working) order|fresh repairs|kept up|raiders and rivals look elsewhere|would make any attack costly|nobody (worries|bothers))\b`),
  office: W(String.raw`\b(law ?courts?|courthouse|courts? of (law|justice)|hall of justice|the court (sits|hears|rules)|a hearing|justice (is|comes|here)|judges?|magistrates?|tribunal|the watch|watchm[ae]n|night watch|patrols?|garrison(ed)?|militia|soldiers|guardsmen|constables?|sheriffs?|bailiffs?|(are|is) (well |badly )?paid|forces are|troops|standing army|councillors?|aldermen|its members|members cannot|notar(y|ies)|lawyers?|tax collectors?)\b`),
  sovereign: W(String.raw`\b(lord(s|'s)?|liege|overlord|crown|king|king's|queen|monarch|throne|noble oversight|baron|duke|earl|vassals?|fealty|tribute to|emperor)\b`),
  // a resource WORKED, CUT, HELD OR TRADED (a bare 'stone', 'timber' or 'river' as material or landscape is no presumption)
  resource: W(String.raw`\b(ore|iron ore|quarr(y|ies|ied)|clay ?pits?|sand ?pits?|glass sand|raw sand|logging|lumber|sawn|timber (yard|stacked|cut|felled)|fishing (boats|nets|fleet)|nets|the catch|day's catch|herds?|flocks?|cattle|sheep|goats|pigs|swine|grapes|vines|vineyards?|orchards?|olive groves?|peat|coal|charcoal|salt pans?|honey|dairy|milk|wool|grazing|mines?|mining|miners|(works?|worked|working|cut|cutting|dressed) (the )?stone|stone ?(cutters?|masons?|yards?)|masons|deposits|seams?)\b`),
};
const CRISIS_CLASSES = new Set(['outside', 'plenty', 'work', 'animals', 'iron', 'law', 'ease', 'threat']);

// ---- which atom dimensions answer which class
const C = ['crisis', 'famine', 'starving', 'failed', 'danger coming', 'food', 'stores', 'war', 'migration', 'source spent', 'threat', 'hunger', 'succession', 'unrest'];
const GOODS = ['trade at work', 'institution', 'exports', 'imports', 'market', 'guild', 'iron at hand', 'timber at hand', 'timber reaches the saws', 'fish', 'grain', 'game', 'livestock', 'failed', 'enchanting', 'magic supply', 'docks', 'port', 'navigable', 'own plots', 'source spent'];
const CLASS_DIMS = {
  outside: [...C, 'route', 'imports', 'exports', 'port', 'navigable', 'docks', 'walls', 'gate'], // a market answers no outside trade
  plenty: [...C, 'prosperity', 'own plots', 'fish', 'grain', 'game', 'livestock'], // a market answers no plenty
  work: [...C, 'prosperity'],
  animals: [...C, 'institution', 'livestock'],
  iron: [...C, 'iron at hand', 'trade at work', 'institution'],
  law: [...C, 'crime', 'organised crime', 'criminal income', 'watch', 'court', 'prison', 'patrol', 'garrison', 'militia'],
  ease: [...C, 'prosperity'],
  threat: [...C, 'walls', 'palisade', 'gate', 'organised crime', 'crime', 'ruler', 'rival power', 'watch', 'garrison', 'patrol', 'militia', 'soldiers'],
  size: ['tier', 'population'],
  goods: GOODS,
  resource: [...GOODS, 'terrain', 'coast', 'river'],
  office: ['court', 'prison', 'watch', 'militia', 'garrison', 'patrol', 'soldiers', 'commander', 'mercenary', 'institution', 'ruling body', 'guild', 'ruler', 'rival power', 'walls', 'palisade', 'gate', 'tier', 'population', 'temple', 'church', 'priest', 'clergy', 'crime', 'organised crime'],
  sovereign: ['ruler', 'war', 'crisis'],
};

const MARK_DIM = new Map(); for (const [d, ws] of Object.entries(STATE_MARK_DIMENSIONS)) for (const w of ws) MARK_DIM.set(w, d);
/** the dimensions a list of atoms / mark words names; `crisis: any` alone is reported as the claim `any` */
function dimsOf(words) {
  const dims = new Set(); let anyOnly = false, real = 0;
  for (const raw of words) {
    const w = String(raw).trim(); if (!w || w === 'dm-only' || w === 'colour') continue;
    if (MARK_DIM.has(w)) { const d = MARK_DIM.get(w); if (['severity', 'deficit', 'anchor'].includes(d)) continue; dims.add(d); real++; continue; }
    const neg = /^no\s+(.+)$/i.exec(w); const a = parseAtom(neg ? neg[1] : w.replace(/^crisis:\s*/i, (m) => m));
    if (!a) { const cv = /^crisis:\s*(.+)$/i.exec(w) || (/^(any|calm|under_siege|famine|wartime|occupied)$/.test(w) ? [0, w] : null); if (cv) { if (/^\s*any\s*$/.test(cv[1]) && !neg) anyOnly = true; else { dims.add('crisis'); real++; } } continue; }
    if (a.dimension === 'crisis' && !neg && a.values && a.values.length === 1 && a.values[0] === 'any') { anyOnly = true; continue; }
    dims.add(a.dimension); real++;
  }
  return { dims, any: anyOnly, real };
}

// ---- one status per class
function statusFor(cls, d) {
  const { atoms = [], twin = false, scoped = false, colour = false, keyGate = false, tierKey = false, bound = false } = d;
  const { dims, any, real } = dimsOf(atoms);
  const ok = CLASS_DIMS[cls].some((x) => dims.has(x));
  if (ok) return 'declared';
  if (CRISIS_CLASSES.has(cls) && twin) return 'twin';
  if (CRISIS_CLASSES.has(cls) && scoped) return 'scoped';
  if (cls === 'size' && tierKey) return 'gate';
  if (['goods', 'resource', 'iron', 'animals'].includes(cls) && keyGate) return 'keyed';
  if (['goods', 'resource', 'iron', 'animals', 'office'].includes(cls) && bound) return 'bound';
  if (colour) return 'colour';
  if (CRISIS_CLASSES.has(cls) && any) return 'any';
  if (real || any || twin) return 'other';
  return 'none';
}
const DECLARED = new Set(['declared', 'twin', 'scoped', 'gate', 'keyed', 'bound']);
// a house's own description or service, a title's own line: drawn only where the house or the title stands, so the
// thing it names is answered by the binding (a goods, resource or office word; never a size or a crisis word)
const BOUND_FILES = /^src\/data\/(institutionServices|institutionDescVariants|institutionDescColour|institutionalCatalog|personHooksByTitle|people\/titleSecretsPresentations|institutionServiceKeys\.generated)\.js$|^src\/domain\/display\/institutionVocabulary\.js$/;
const TIER_KEY = /\b(thorp|hamlet|village|town|city|metropolis|small|large|tiny|tier)\b/i;
const classesOf = (t) => Object.entries(CLASSES).filter(([, re]) => re.test(t)).map(([k]) => k);

  return { CLASSES, CRISIS_CLASSES, CLASS_DIMS, dimsOf, statusFor, DECLARED, BOUND_FILES, TIER_KEY, classesOf };
}
