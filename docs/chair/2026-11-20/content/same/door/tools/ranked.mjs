#!/usr/bin/env node
/**
 * door/tools/ranked.mjs — SAME-2 brief D part 2 (and part 3's visitor table): writes RANKED.md and FULL.tsv from the
 * JSON reading.mjs wrote. Measure only: it reads the reading, the register (scripts/census/sameness-census.register.json)
 * and src/ (to find a pool row's symbol and key); it renders nothing.
 *
 * THE RANKED ROWS: every printed slot whose commonest sentence prints in more than BAR (15%) of ALL places of some size,
 * ranked by WEIGHT: the places printing the slot's commonest sentence, summed over the six sizes (the commonest
 * sentence is taken per size). A size over BOLD (20%, beyond sampling) is bold.
 * THE MANY-A-PLACE ROWS (the chair, 19:58): every slot whose meet is SEEN at some size, ranked by its highest SEEN,
 * against SEEN_BAR (30%: a second place repeats a third of the slot's sentences).
 * THE LANES: by the attribution path (or the composing module, or the session sheet's surface), each rule citing what it
 * matched; a match the rule is unsure of carries `?` and why; anything matching none is COVERED BY NOTHING YET.
 *
 * Usage: node .../door/tools/ranked.mjs <reading.json> <tree> <out dir> [--name=RANKED] [--beside=<reading.json>]
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SIZES, moduleIndex, moduleOf } from '../../../../../../../scripts/sameness-census.mjs';

const [readingPath, tree, outDir] = process.argv.slice(2);
const opt = (/** @type {string} */ k, /** @type {string} */ d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const NAME = opt('name', 'RANKED');
const BESIDE = opt('beside', '');
const BAR = 0.15; const BOLD = 0.2; const SEEN_BAR = 0.3;
const { slots, repeats } = JSON.parse(readFileSync(readingPath, 'utf8'));
const V = /** @type {any[]} */ (Object.values(slots));
const ROOT = new URL('../../../../../../../', import.meta.url).pathname;

// ── THE LANES (the brief's list; a rule is [lane, test on a path, sure?, why-if-unsure]) ──
/** @type {Array<[string, RegExp, boolean, string]>} */
const PATH_RULES = [
  ['PEOPLE', /^powerStructure\.factions\[\]\.desc$/, true, ''],
  ['PEOPLE', /^powerStructure\.factionRelationships\[\]\.narrative$/, true, ''],
  ['PEOPLE', /^npcs\[\]\.(structuralPosition|activeConstraint)$/, true, ''],
  ['PEOPLE', /^settlementReason(\[\])?$/, true, ''],
  ['PEOPLE', /^history\.founding\./, true, ''],
  ['PLACE', /^economicState\.safetyProfile\.(safetyDesc|economicDragDesc)$/, true, ''],
  ['PLACE', /^economicState\.activeChains\[\]\.entrepotNote$/, true, ''],
  ['PLACE', /^economicState\.safetyProfile\.plotHooks(\[\])?$/, true, ''],
  ['PLACE', /^economicState\.activeChains\[\]\.(externalMillNote|magicNote)$/, false, 'a chain\'s note beside entrepotNote: "the trade note" is not named by path'],
  ['PLACE', /^economicViability\.plotHooks\[\]\.hook$/, false, 'the viability\'s hooks: "the economy\'s hooks" is not named by path'],
  ['DEPTH', /^(powerStructure\.recentConflict|pressureSentence)$/, true, ''],
  ['DEPTH', /^npcs\[\]\.plotHooks(\[\])?$/, true, ''],
  ['DEPTH', /^relationships\[\]\.(description|tension)$/, true, ''],
  ['DEPTH', /^relationships\[\]\.npc[12]Role$/, false, 'a role word the line contains, not the tie\'s text'],
  ['DEPTH', /^prominentRelationship\./, false, 'the place\'s prominent tie, a person\'s tie read for the place'],
  ['TROUBLE', /^history\.currentTensions\[\]\.plotHooks(\[\])?$/, true, ''],
  ['TROUBLE', /^history\.currentTensions\[\]\.(description|specificIssue)$/, false, 'a trouble\'s sentence; PAGE-7\'s tensionCause is not in this tree'],
  ['TROUBLE', /^powerStructure\.conflicts\[\]\.plotHooks(\[\])?$/, false, 'a power conflict\'s hooks, not named a trouble'],
  ['GOALS', /^npcs\[\]\.goal\.(?!.*\.id$)/, true, ''],
  ['GOALS', /^npcs\[\]\.goal\..*\.id$/, false, 'a goal\'s target id, a name the line contains, not the goal\'s text'],
  ['PAGE-6', /^arrivalScene/, true, ''],
  ['PAGE-6', /^npcs\[\]\.secret\./, true, ''],
  ['PROSE', /^publicProse\.blocks\./, true, ''],
  ['FRAME', /^stress(\[\])?\.cast\.stakes\[\]\.reason$/, true, ''],
  ['DAILY', /dailyLife/i, true, ''],
  ['TRAD', /tradition/i, true, ''],
];
/** @type {Array<[string, RegExp, boolean, string]>} */
const MODULE_RULES = [
  ['FRAME', /src\/domain\/summary\/tonightSheet\.js$/, true, ''],
  ['DAILY', /DailyLife|dailyLife/, true, ''],
  ['TRAD', /[Tt]radition/, true, ''],
];
/**
 * The lanes of a slot: every rule its paths (or its module, or the session surface) match. Only the paths holding at least
 * half the places of its PRIMARY attribution (the path with the most places) are read; a lane is sure only on the primary
 * path, and a rule matched on another path is `?` (a stored string the line contains is not always the line's text).
 * @param {any} o
 */
function lanesOf(o) {
  const ranked = Object.entries(o.paths).sort((a, b) => b[1] - a[1]);
  const paths = ranked.filter(([, n]) => n >= 0.5 * ranked[0][1]).map(([p]) => p);
  /** @type {Map<string, string>} */ const hit = new Map();
  for (const p of paths) for (const [lane, re, rule, ruleWhy] of PATH_RULES) if (re.test(p)) {
    const sure = rule && p === paths[0];
    const why = rule ? `a secondary attribution (${o.paths[p]} places against the primary's ${ranked[0][1]})` : ruleWhy;
    const v = sure ? `${lane} (\`${p}\`)` : `${lane} ? (\`${p}\`: ${why})`;
    if (!hit.has(lane) || hit.get(lane).includes(' ? ')) hit.set(lane, v);
  }
  if (!paths.length && o.module) for (const [lane, re, sure, why] of MODULE_RULES) if (re.test(o.module)) hit.set(lane, sure ? `${lane} (composed by \`${o.module}\`)` : `${lane} ? (${why})`);
  if (!hit.size && o.slot.startsWith('session |')) hit.set('FRAME', paths.length ? `FRAME ? (the session sheet prints it; its field \`${paths[0]}\` is no lane's)` : 'FRAME (composed on the session sheet)');
  // only `?` marks and nothing sure: the row is covered by nothing for certain, and says so beside its guesses
  if (hit.size && [...hit.values()].every((v) => v.includes(' ? '))) return ['COVERED BY NOTHING YET', ...hit.values()];
  return hit.size ? [...hit.values()] : ['COVERED BY NOTHING YET'];
}
const nothing = (/** @type {string[]} */ l) => l[0] === 'COVERED BY NOTHING YET';

// ── cells ──
const cut = (/** @type {string} */ s, n = 140) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const md = (/** @type {string} */ s) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const pc = (/** @type {number} */ x) => `${(x * 100).toFixed(1)}%`;
const attribution = (/** @type {any} */ o) => {
  const p = Object.entries(o.paths).sort((a, b) => b[1] - a[1]).map(([k]) => `\`${k}\``);
  if (!p.length) return `COMPOSED ~ \`${o.module}\``;
  return `${p.slice(0, 3).join(', ')}${p.length > 3 ? ` +${p.length - 3}` : ''}${o.contained ? ' (by containment)' : ''}`;
};
const heaviest = (/** @type {any} */ o) => Object.values(o.sizes).sort((a, b) => b.topPlaces - a.topPlaces)[0];
const weightOf = (/** @type {any} */ o) => Object.values(o.sizes).reduce((a, e) => a + e.topPlaces, 0);

// ── THE RANKED ROWS ──
const ranked = V.filter((o) => Object.values(o.sizes).some((e) => e.shareAll > BAR)).map((o) => ({ o, w: weightOf(o), lanes: lanesOf(o) }))
  .sort((a, b) => b.w - a.w || (a.o.slot < b.o.slot ? -1 : 1));
const sizeCell = (/** @type {any} */ e) => {
  if (!e) return '—';
  const t = `${e.topPlaces}/${e.of} (${pc(e.shareAll)}) · ${pc(e.shareIn)}`;
  return e.shareAll > BOLD ? `**${t}**` : t;
};
const seenRows = V.filter((o) => Object.values(o.sizes).some((e) => e.by === 'seen')).map((o) => ({ o, top: Math.max(...Object.values(o.sizes).filter((e) => e.by === 'seen').map((e) => e.seen)), lanes: lanesOf(o) }))
  .sort((a, b) => b.top - a.top || (a.o.slot < b.o.slot ? -1 : 1));
const seenCell = (/** @type {any} */ e) => {
  if (!e) return '—';
  if (e.by !== 'seen') return `top ${pc(e.shareAll)}`;
  const t = `${pc(e.seen)} (${pc(e.shareAll)})`;
  return e.seen > SEEN_BAR ? `**${t}**` : t;
};

// ── the beside reading (part 3: the visitor's pool beside hxd), the move by the noise (4 SE of the share at hxd) ──
const beside = BESIDE ? JSON.parse(readFileSync(BESIDE, 'utf8')).slots : null;
const moved = (/** @type {any} */ o) => {
  if (!beside) return '';
  const b = beside[o.slot]; const marks = [];
  for (const s of SIZES) {
    const a = o.sizes[s]; const x = b?.sizes?.[s];
    const pa = a ? a.shareAll : 0; const px = x ? x.shareAll : 0; const n = (a || x).of || 150;
    const p = Math.min(Math.max(px, 0.5 / n), 1 - 0.5 / n); const se = Math.sqrt((p * (1 - p)) / n);
    if (Math.abs(pa - px) > 4 * se) marks.push(`${s} ${pc(px)}→${pc(pa)}`);
  }
  return marks.length ? `**MOVED** ${marks.join(', ')}` : '';
};
/** hxd's own ranking (the beside reading's slots over the bar, by weight), for the `beside #` column. */
const besideRank = new Map(beside ? Object.values(beside).filter((o) => Object.values(o.sizes).some((e) => e.shareAll > BAR))
  .map((o) => [o.slot, Object.values(o.sizes).reduce((a, e) => a + e.topPlaces, 0)]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([k], i) => [k, i + 1]) : []);

// ── the pool row of a sentence: the file, the symbol and the key that hold it (THE CARD'S SECRET) ──
const idx = moduleIndex();
/** @type {Map<string, string>} */ const srcText = new Map();
const walk = (/** @type {string} */ d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|jsx)$/.test(e.name) && !/\.test\./.test(e.name)) srcText.set(p.slice(ROOT.length), readFileSync(p, 'utf8')); } };
walk(join(ROOT, 'src'));
/** @param {string} sentence @returns {string} */
function poolRowOf(sentence) {
  const s = sentence.replace(/^Secret: /, '');
  let file = moduleOf(s, idx)?.file; let frag = moduleOf(s, idx)?.frag;
  let via = '';
  // crimeSignal.js :: withTownsOwnUnderworld rewords a pool row at display ("the thieves' guild" -> the town's own
  // underworld): the row is found by the words it keeps, outside the rewording module
  if (file && /crimeSignal\.js$/.test(file)) { via = ' (reworded at display by `src/domain/crimeSignal.js :: withTownsOwnUnderworld`)'; file = undefined; }
  if (!file) {
    const pieces = s.split(/#|\b0\b|\{[a-z]+\}|the local underworld/).map((x) => x.trim()).sort((a, b) => b.length - a.length);
    for (const piece of pieces) {
      if (piece.length < 15 || file) break;
      for (const [f, t] of srcText) if (!/crimeSignal\.js$|goalSecretRefusals\.js$/.test(f) && t.includes(piece)) { file = f; frag = piece; break; }
    }
  }
  if (!file || !frag) return 'unfound in src/';
  const text = srcText.get(file) || ''; const lines = text.split('\n');
  const probe = frag.slice(0, 40).replace(/0/g, '');
  let at = lines.findIndex((l) => l.replace(/\d/g, '').includes(probe.replace(/\d/g, '')));
  if (at < 0) at = lines.findIndex((l) => l.includes(frag.slice(0, 20)));
  if (at < 0) return `\`${file}\` (row not placed)`;
  let symbol = '?';
  for (let i = at; i >= 0; i--) { const m = /^(?:export\s+)?(?:const|let|function)\s+([A-Za-z_$][\w$]*)/.exec(lines[i]); if (m) { symbol = m[1]; break; } }
  let key = '';
  if (/titleSecretsPresentations\.js$/.test(file)) {
    // ROWS is `[title, cards, [S(secret, stakes), ...], [P(...)]]`, exported per title as TITLE_SECRETS
    for (let i = at, k = 0; i >= 0; i--) { const m = /^\s*\["([^"]+)",\s*\d+,/.exec(lines[i]); if (m) { key = `${m[1]}[${k}]`; break; } if (/^\s*S\(/.test(lines[i]) && i < at) k++; }
    symbol = 'TITLE_SECRETS';
  } else if (/goalSecretRefusals\.js$/.test(file)) {
    // a transcription, keyed by the pool it copies (its own test holds every row to its pool, key and text)
    let k = ''; for (let i = at; i >= 0 && !k; i--) k = /^\s*(['"])(.+?)\1:/.exec(lines[i])?.[2] || '';
    const t = /^title:(.+)$/.exec(k); const c = /^criminal\.(.+)$/.exec(k); const st = /^stress:(.+)$/.exec(k);
    if (t) return `\`src/data/people/titleSecretsPresentations.js :: TITLE_SECRETS\` key \`${t[1]}\` (found by its transcription in goalSecretRefusals.js)`;
    if (c) return `\`src/data/npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER\` key \`${c[1]}\` (found by its transcription in goalSecretRefusals.js)`;
    if (st) return `\`src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS\` key \`${st[1]}\` (found by its transcription in goalSecretRefusals.js)`;
    key = k;
  } else if (/npcGenerator\.js$/.test(file)) {
    const after = lines.slice(at, at + 40).join('\n'); const pool = /poolId: '([^']+)'/.exec(after)?.[1];
    let k = 0; for (let i = at - 1; i >= 0 && !/drawDeclared\(\[/.test(lines[i]); i--) if (/^\s*what: /.test(lines[i])) k++;
    key = pool ? `${pool} row ${k}` : '';
  } else {
    // a nested pool: the row's own `{`, its index among its siblings, then each enclosing key by indentation
    const ind = (/** @type {string} */ l) => /^\s*/.exec(l)[0].length;
    let r = at; while (r > 0 && !/^\s*\{/.test(lines[r])) r--;
    const ri = ind(lines[r]); let k = 0; let i = r - 1;
    for (; i >= 0; i--) { if (ind(lines[i]) < ri) break; if (ind(lines[i]) === ri && /^\s*\{/.test(lines[i])) k++; }
    const chain = []; let lim = ri;
    for (; i >= 0; i--) {
      if (/^(?:export\s+)?(?:const|let)\s/.test(lines[i])) break;
      const m = /^\s*['"]?([\w .:-]+?)['"]?\s*:\s*[[{]\s*$/.exec(lines[i]);
      if (m && ind(lines[i]) < lim) { chain.unshift(m[1]); lim = ind(lines[i]); }
    }
    key = chain.length ? `${chain.join('.')}[${k}]` : '';
  }
  return `\`${file} :: ${symbol}\`${key ? ` key \`${key}\`` : ''}${via}`;
}

// ── RANKED.md ──
const L = [];
const overBy = (/** @type {string} */ s) => ranked.filter((r) => r.o.sizes[s]?.shareAll > BAR).length;
const seenOverBy = (/** @type {string} */ s) => seenRows.filter((r) => r.o.sizes[s]?.by === 'seen' && r.o.sizes[s].seen > SEEN_BAR).length;
L.push(beside ? `# ${NAME} — the visitor's pool, a one-off measure beside hxd (SAME-2 brief D part 3)` : `# ${NAME} — the door's first reading (SAME-2 brief D part 2)`, '');
L.push(`Tree **${tree}**. Reading: \`${readingPath.split('/').slice(-1)[0]}\` from the run \`${slots && V[0] ? JSON.parse(readFileSync(readingPath, 'utf8')).dir.split('/').slice(-2).join('/') : '?'}\` (150 places a size, six sizes), measured with \`scripts/sameness-census.mjs :: measureSlots\` (the door's slot key and attribution); no new render. Classes are the register's (\`?\` = the rule's guess).`, '');
L.push('## SUMMARY LINES', '');
if (repeats) {
  L.push(`- **A SENTENCE REPEATED INSIDE ONE PLACE** (the owner's stop condition; first): places printing one sentence twice or more within one surface family, per size — ${SIZES.map((s) => { const r = repeats[s]; return `${s} ${r.places}/${r.of} (STORY ${r.story}; STORY at ONE position ${r.storyOnePosition})`; }).join(', ')}. STORY = a STATE or NARRATIVE position; the CATALOGUE/LABEL repeats (a house's name twice) are counted apart. "At one position" is two cards or ties in one list printing one wording.`);
}
L.push(`- Rows over the bar (commonest sentence on more than 15% of ALL places of a size): **${ranked.length}** slots; per size: ${SIZES.map((s) => `${s} ${overBy(s)}`).join(', ')}.`);
L.push(`- COVERED BY NOTHING YET: **${ranked.filter((r) => nothing(r.lanes)).length}** of the ${ranked.length} (of them, ${ranked.filter((r) => nothing(r.lanes) && r.lanes.length > 1).length} carry only an unsure \`?\` lane beside it); rows with any \`?\` lane: ${ranked.filter((r) => r.lanes.some((x) => x.includes(' ? '))).length}.`);
L.push(`- Many-a-place (meet is SEEN at some size): **${seenRows.length}** slots; over the 30% bar per size: ${SIZES.map((s) => `${s} ${seenOverBy(s)}`).join(', ')}.`);
const fam = (/** @type {string} */ c) => c.replace('?', '');
const byFam = (/** @type {any[]} */ rs) => ['LABEL', 'CATALOGUE', 'STATE', 'NARRATIVE'].map((c) => `${c} ${rs.filter((r) => fam(r.o.cls) === c).length}`).join(', ');
L.push(`- By class (\`?\` folded in): ${byFam(ranked)}; COVERED BY NOTHING YET by class: ${byFam(ranked.filter((r) => nothing(r.lanes)))}. LABEL and CATALOGUE are the same by design (the page's furniture, a house's own definition); the top five by weight are all furniture, so the STATE and NARRATIVE top five follow them.`);
if (!beside) {
  const card = V.find((o) => o.slot === 'web:World/NPCs | NPCsTab.0.0.3 > NPCCategoryGroup.*.0.1 > NPCInlineCard.*.0.2.10');
  if (card) { const n15 = (/** @type {string} */ z) => card.sizes[z].tops.filter((t) => t.places >= 0.15 * card.sizes[z].of).length; L.push(`- THE CARD'S SECRET (the web card's secret slot): sentences on 15% or more of cities **${n15('city')}**, of metropolises **${n15('metropolis')}** (PAGE-8: 169 and 259); "divine visions" ${card.sizes.metropolis.tops.find((t) => /divine visions/.test(t.s))?.places ?? '?'}/150 metropolises; SEEN ${SIZES.map((z) => `${z} ${pc(card.sizes[z].seen)}`).join(', ')}.`); }
}
L.push('- Top five by weight:');
ranked.slice(0, 5).forEach((r, i) => L.push(`  ${i + 1}. weight ${r.w} — \`${md(r.o.slot)}\` — ${r.o.cls} — ${attribution(r.o)} — "${md(cut(heaviest(r.o).sentence, 100))}" — ${r.lanes.join('; ')}`));
L.push('- Top five STATE and NARRATIVE rows by weight:');
ranked.filter((r) => /^(STATE|NARRATIVE)/.test(r.o.cls)).slice(0, 5).forEach((r) => L.push(`  ${ranked.indexOf(r) + 1}. weight ${r.w} — \`${md(r.o.slot)}\` — ${r.o.cls} — ${attribution(r.o)} — "${md(cut(heaviest(r.o).sentence, 100))}" — ${r.lanes.join('; ')}`));
L.push('');
if (beside) {
  const here = new Set(ranked.map((r) => r.o.slot));
  L.push(`- BESIDE (\`${BESIDE.split('/').slice(-1)[0]}\`): over the bar here **${ranked.length}**, there ${besideRank.size}; here only ${[...here].filter((k) => !besideRank.has(k)).length}, there only ${[...besideRank.keys()].filter((k) => !here.has(k)).length}. Rows whose commonest sentence MOVED beyond 4 SE at some size: **${ranked.filter((r) => moved(r.o)).length}** of the ${ranked.length}.`, '');
}
if (beside) L.push(`Beside: \`${BESIDE.split('/').slice(-1)[0]}\`. **MOVED** marks a size whose commonest-sentence share (over all places) differs between the two pools by more than 4 SE of a binomial share at the beside reading (150 places): the arrow reads beside → this.`, '');
if (repeats) {
  L.push('## A SENTENCE REPEATED INSIDE ONE PLACE (the chair, 20:14)', '');
  L.push('Measured by `scripts/sameness-census.mjs :: repeatsInPlace` over every place of the run: a sentence printed twice or more inside ONE place within one surface FAMILY (the web dossier is one family, each PDF form one, the session sheet one), at any positions, the same position included. Sentences are MASKED (each place\'s names to `#`, digits to `0`), so one wording printed twice with other names in it counts: the frame repeats. SIDE: STORY where a position\'s register class is STATE or NARRATIVE (the fault), FURNITURE where every position is CATALOGUE or LABEL (a house\'s name or a caption twice is not the fault), UNROWED where no position has a register row (fewer than 5 places print it). Every repeated sentence, per size, is in `REPEATS.tsv` beside this file.', '');
  L.push('| size | places with a repeat | at ONE position | with a STORY repeat | STORY at ONE position | sentences repeated (STORY / FURNITURE / UNROWED) |', '|---|---|---|---|---|---|');
  for (const s of SIZES) { const r = repeats[s]; const n = (/** @type {string} */ side) => r.sentences.filter((x) => x.side === side).length; L.push(`| ${s} | ${r.places}/${r.of} | ${r.onePosition} | ${r.story} | **${r.storyOnePosition}** | ${r.sentences.length} (${n('STORY')} / ${n('FURNITURE')} / ${n('UNROWED')}) |`); }
  L.push('', '### The STORY repeats, by the places that print them twice (at most 25 a size; one-position places first)', '');
  L.push('| size | places (at one position) | family | most in one place | class | positions | attribution | sentence (masked) |', '|---|---|---|---|---|---|---|---|');
  for (const s of SIZES) {
    const rows = repeats[s].sentences.filter((x) => x.side === 'STORY').sort((a, b) => b.onePosition - a.onePosition || b.places - a.places || (a.sentence < b.sentence ? -1 : 1)).slice(0, 25);
    for (const x of rows) L.push(`| ${s} | ${x.places} (${x.onePosition}) | ${x.family} | ${x.times} | ${x.classes.join(', ')} | ${x.positions.slice(0, 3).map((k) => `\`${md(k)}\``).join('<br>')}${x.positions.length > 3 ? ` +${x.positions.length - 3}` : ''} | ${x.paths.length ? x.paths.slice(0, 3).map((k) => `\`${k}\``).join(', ') : 'COMPOSED'} | ${md(cut(x.sentence))} |`);
  }
  L.push('');
}
L.push('## THE RANKED TABLE (by weight)', '');
L.push('Weight: the places printing the slot\'s commonest sentence, summed over the six sizes (the commonest sentence is taken per size; the sentence shown is the heaviest size\'s). A size cell: `top places/150 (shareAll) · shareIn`; **bold** over 20%.', '');
L.push(`| # | weight | ${SIZES.join(' | ')} | class | surface \\| position | attribution | commonest sentence (masked) | lane |${beside ? ' beside # | moved |' : ''}`);
L.push(`|---|---|${SIZES.map(() => '---').join('|')}|---|---|---|---|---|${beside ? '---|---|' : ''}`);
ranked.forEach((r, i) => L.push(`| ${i + 1} | ${r.w} | ${SIZES.map((s) => sizeCell(r.o.sizes[s])).join(' | ')} | ${r.o.cls} | \`${md(r.o.slot)}\` | ${md(attribution(r.o))} | ${md(cut(heaviest(r.o).sentence))} | ${md(r.lanes.join('; '))} |${beside ? ` ${besideRank.get(r.o.slot) ?? 'under the bar'} | ${moved(r.o)} |` : ''}`));
L.push('');
L.push('## MANY-A-PLACE (meet is SEEN), ranked by SEEN against the 30% bar', '');
L.push('A size cell: `SEEN (shareAll of the commonest sentence)`, **bold** over 30%; `top x%` where that size prints at most 1.5 sentences a place (its meet is shareAll).', '');
L.push(`| # | top SEEN | ${SIZES.join(' | ')} | class | surface \\| position | attribution | commonest sentence (masked) | lane |`);
L.push(`|---|---|${SIZES.map(() => '---').join('|')}|---|---|---|---|---|`);
seenRows.forEach((r, i) => L.push(`| ${i + 1} | ${pc(r.top)} | ${SIZES.map((s) => seenCell(r.o.sizes[s])).join(' | ')} | ${r.o.cls} | \`${md(r.o.slot)}\` | ${md(attribution(r.o))} | ${md(cut(heaviest(r.o).sentence))} | ${md(r.lanes.join('; '))} |`));
L.push('');
if (!beside) {
  // ── THE CARD'S SECRET ──
  const sec = V.filter((o) => Object.keys(o.paths).some((p) => /^npcs\[\]\.secret\./.test(p)));
  L.push('## THE CARD\'S SECRET, read as a many-a-place field (the check of PAGE-8\'s measure, by the door)', '');
  L.push(`Every slot attributed to \`npcs[].secret.*\` (${sec.length}), by size: its places, SEEN, and the number of its sentences on 15% or more of the size's places. PAGE-8 found 169 secret sentences on 15% or more of cities and 259 of metropolises ("divine visions" in 70.7% of metropolises).`, '');
  L.push(`| surface \\| position | ${SIZES.join(' | ')} |`, `|---|${SIZES.map(() => '---').join('|')}|`);
  for (const o of sec) L.push(`| \`${md(o.slot)}\` | ${SIZES.map((s) => { const e = o.sizes[s]; return e ? `${e.places} places · SEEN ${pc(e.seen)} · ${e.tops.filter((t) => t.places >= 0.15 * e.of).length} at 15%+` : '—'; }).join(' | ')} |`);
  L.push('');
  const card = sec.slice().sort((a, b) => Object.values(b.sizes).reduce((x, e) => x + e.places, 0) - Object.values(a.sizes).reduce((x, e) => x + e.places, 0))[0];
  if (card) {
    /** @type {Map<string, Record<string, number>>} */ const bySent = new Map();
    for (const s of SIZES) for (const t of card.sizes[s]?.tops || []) { if (t.places < 0.15 * card.sizes[s].of) continue; const m = bySent.get(t.s) || {}; m[s] = t.places; bySent.set(t.s, m); }
    const rows = [...bySent].sort((a, b) => (b[1].metropolis || 0) - (a[1].metropolis || 0) || (b[1].city || 0) - (a[1].city || 0) || (a[0] < b[0] ? -1 : 1));
    L.push(`### The card's own secret slot: \`${md(card.slot)}\``, '');
    L.push(`Its sentences on 15% or more of the places of some size: **${rows.length}** (city ${rows.filter(([, m]) => (m.city || 0) >= 0.15 * 150).length}, metropolis ${rows.filter(([, m]) => (m.metropolis || 0) >= 0.15 * 150).length}). Each with its places per size and the POOL ROW it comes from (the file and symbol holding its words, and the row's key; \`unfound\` = no literal of src/ holds it).`, '');
    L.push(`| # | ${SIZES.join(' | ')} | sentence (masked) | pool row |`, `|---|${SIZES.map(() => '---').join('|')}|---|---|`);
    rows.forEach(([s, m], i) => L.push(`| ${i + 1} | ${SIZES.map((z) => (m[z] ? `${m[z] >= 0.2 * 150 ? '**' : ''}${m[z]}/150${m[z] >= 0.2 * 150 ? '**' : ''}` : '<15%')).join(' | ')} | ${md(cut(s))} | ${md(poolRowOf(s))} |`));
    L.push('');
  }
}
writeFileSync(join(outDir, `${NAME}.md`), `${L.join('\n')}\n`);

// ── REPEATS.tsv ──
if (repeats && !beside) {
  const T = [['size', 'family', 'side', 'places', 'onePosition', 'mostInOnePlace', 'classes', 'positions', 'attribution', 'sentence (masked)'].join('\t')];
  for (const s of SIZES) for (const x of repeats[s].sentences) T.push([s, x.family, x.side, x.places, x.onePosition, x.times, x.classes.join('; '), `${x.positions.slice(0, 4).join(' ;; ')}${x.positions.length > 4 ? ` ;; +${x.positions.length - 4}` : ''}`, x.paths.slice(0, 4).join('; ') || 'COMPOSED', x.sentence].join('\t').replace(/\n/g, ' '));
  writeFileSync(join(outDir, 'REPEATS.tsv'), `# tree ${tree}; ${readingPath.split('/').slice(-1)[0]}; scripts/sameness-census.mjs :: repeatsInPlace; masked sentences\n${T.join('\n')}\n`);
}
// ── FULL.tsv ──
if (!beside) {
  const T = [['slot', 'size', 'places', 'of', 'distinct', 'perPlace', 'topPlaces', 'shareAll', 'shareIn', 'by', 'SEEN', 'class', 'attribution', 'lane', 'commonest sentence'].join('\t')];
  for (const o of V.slice().sort((a, b) => (a.slot < b.slot ? -1 : 1))) {
    const lanes = lanesOf(o).join('; '); const at = attribution(o).replace(/`/g, '');
    for (const s of SIZES) { const e = o.sizes[s]; if (!e) continue; T.push([o.slot, s, e.places, e.of, e.distinct, e.perPlace, e.topPlaces, e.shareAll, e.shareIn, e.by, e.by === 'seen' ? e.seen : '', o.cls, at, lanes.replace(/`/g, ''), cut(e.sentence)].join('\t').replace(/\n/g, ' ')); }
  }
  writeFileSync(join(outDir, 'FULL.tsv'), `# tree ${tree}; ${readingPath.split('/').slice(-1)[0]}; SEEN given where the meet is SEEN (by = seen)\n${T.join('\n')}\n`);
}
console.log(`${NAME}: ranked ${ranked.length} (per size ${SIZES.map((s) => overBy(s)).join('/')}); nothing ${ranked.filter((r) => nothing(r.lanes)).length}; unsure ${ranked.filter((r) => r.lanes.some((x) => x.includes(' ? '))).length}; seen ${seenRows.length} (over 30% ${SIZES.map((s) => seenOverBy(s)).join('/')})${beside ? `; moved ${ranked.filter((r) => moved(r.o)).length}` : ''}`);
