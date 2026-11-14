const { lines, ctxOf, crisisOf, roster, ownRoster } = require('./ctx.js');
const W = new Set(['running', 'operational', 'entrepot']);
const FOOD_GROUND = { grain: ['grain_fields', 'fertile_floodplain'], livestock: ['grazing_land'], fish: ['fishing_grounds', 'river_fish'], mill: ['river_mills'], game: ['hunting_grounds'] };
const res = {};
for (const r of lines) {
  if (r.fam.startsWith('NEED')) continue;
  const c = ctxOf(r);
  if (c.where !== 'header' || c.card.kind !== 'chain') continue;
  const f = (res[r.fam] = res[r.fam] || { towns: 0, cases: {} });
  f.towns++;
  const ch = c.chain, rc = c.rchain, R = c.R, cr = crisisOf(c.lv);
  const heads = (rc.processingInstitutions || []).map((h) => h.toLowerCase().split(/[\s(]/)[0]);
  const ros = roster(R).map((n) => n.toLowerCase());
  const ownHit = heads.some((h) => ros.some((n) => !n.startsWith('access to') && n.includes(h)));
  const accHit = heads.some((h) => ros.some((n) => n.startsWith('access to') && n.includes(h)));
  const failed = R.economicState?.foodSecurity?.foodRecord?.failedSource;
  let why;
  if (c.card.chip !== ch.shown) why = 'CHIP!=SHOWN ' + c.card.chip + '/' + ch.shown;
  else if (c.card.chip === '') why = `nochip raw=${ch.raw} own=${ownHit} acc=${accHit} siege=${cr.has('under_siege')}`;
  else if (c.card.chip === 'impaired' && W.has(ch.raw)) {
    if (cr.has('under_siege')) why = `siege-impaired raw=${ch.raw} input=${rc.resourceInputKey} entrepot=${rc.entrepot} need=${rc.needKey}`;
    else if (cr.has('famine')) why = `famine-impaired failed=${failed} input=${rc.resourceInputKey} match=${(FOOD_GROUND[failed] || []).includes(rc.resourceInputKey)}`;
    else why = 'IMPAIRED-NO-CRISIS raw=' + ch.raw;
  } else why = `raw=${ch.raw} chip=${c.card.chip} own=${ownHit}`;
  const k = why.replace(/input=\S+/, 'input=*');
  f.cases[k] = f.cases[k] || []; f.cases[k].push(r.seed);
}
for (const [fam, f] of Object.entries(res)) {
  console.log('##', fam, f.towns);
  for (const [k, s] of Object.entries(f.cases)) console.log('   ', s.length, k, s.slice(0, 3).join(' '));
}
