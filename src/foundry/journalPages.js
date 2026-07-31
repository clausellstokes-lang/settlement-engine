/**
 * journalPages.js — build Foundry VTT journal pages (markdown) from the
 * canonical PDF view model.
 *
 * Content parity by construction: pages consume the SAME buildViewModel slices
 * the PDF chapters render (src/pdf/lib/viewModel.js — "the single source of
 * truth for what the PDF renders"), and page inclusion honors the SAME
 * PDF_VARIANTS chapter map via shouldInclude. The Faith & War page is gated by
 * the LITERAL faithChapterVisible predicate the PDF uses (src/pdf/variants.js)
 * — the constitutional premium seam is shared, not mirrored: a free / lapsed /
 * anon export never emits the page, and therefore never a deity name
 * (tests/foundry/foundryFaithGate.test.js pins this string-level).
 *
 * Pages are JournalEntryPage `text.format = 2` (markdown — Foundry-native
 * since v10). Every interpolated value passes through esc(), which entity-
 * escapes HTML (markdown passes raw HTML through, so `<` must not survive)
 * and backslash-escapes markdown metacharacters.
 *
 * Pure module: no DOM, no store, no Date — node-testable.
 */

// THE ONE markdown/HTML escaper, shared with the standalone world importer. It
// lives under foundry-module/ because that folder IS the shipped Foundry module
// and must stay self-contained, so the dependency runs app → module.
import { escapeMarkdown } from '../../foundry-module/scripts/markdownEscape.js';
import { PDF_VARIANTS, shouldInclude, faithChapterVisible } from '../pdf/variants.js';
import { cap, humanize, hookText, label, stripZwnj } from '../pdf/lib/format.js';
import { gateFaithEvents } from '../domain/display/faithEventFilter.js';
import {
  overviewHeadline, powerHeadline, economicsHeadline, defenseHeadline,
  servicesHeadline, resourcesHeadline, viabilityHeadline, historyHeadline,
  npcsHeadline, hooksHeadline, relationshipsHeadline,
} from '../pdf/lib/headlines.js';

// ── markdown assembly helpers ────────────────────────────────────────────────

/**
 * Escape a value for interpolation into markdown page content. The escaping
 * itself is THE shared escaper both Foundry lanes use — this lane owns only the
 * ZWNJ (U+200C) strip that format.js's noLig() inserts as a PDF-renderer-only
 * fontkit workaround. Every helper-derived string funnels through here, so the
 * journal markdown never carries the F24 corruption class (invisible characters
 * that break Foundry text search and contaminate copy-paste).
 */
export function esc(v) {
  if (v == null) return '';
  return escapeMarkdown(stripZwnj(String(v)));
}

const has = (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0);

/** `**Label:** value` bullet — skipped when the value is empty. */
const kv = (labelText, value) => (has(value) ? `- **${labelText}:** ${esc(value)}` : null);

/**
 * Join lines into a markdown block. Empty strings are KEPT — they are the
 * blank-line separators markdown structure depends on (paragraph breaks, list
 * termination, blockquote ends); only null/undefined/false conditionals drop.
 * Runs of 3+ newlines collapse, but edges are preserved so a nested block's
 * leading '' spacer still separates it from the parent's previous line — the
 * final page trims its edges once, in buildJournalPages' push().
 */
const md = (...lines) => lines
  .flat()
  .filter(v => v || v === '')
  .join('\n')
  .replace(/\n{3,}/g, '\n\n');

const bullet = (v) => (has(v) ? `- ${esc(v)}` : null);

/** The italic section lede — emitted only when the headline has something to say. */
const lede = (headline) => (headline ? `*${esc(headline)}*` : null);

// NotableNPCs tiering rule (mirrors src/pdf/sections/NotableNPCs.jsx): the
// top 3 by power, plus anyone at power ≥ 80, get their own page.
const NOTABLE_POWER_FLOOR = 80;
function notableNpcs(sorted) {
  return sorted.filter((n, i) => i < 3 || (n?.power || 0) >= NOTABLE_POWER_FLOOR);
}

// ── page builders (each: vm → markdown string or null) ──────────────────────

function overviewPage(vm) {
  const o = vm.overview; const id = vm.identity;
  return md(
    lede(overviewHeadline(o, id)),
    '',
    kv('Tier', id.tier),
    kv('Population', id.population),
    kv('Dominant race', id.dominantRace),
    kv('Terrain', id.terrain),
    kv('Government', id.governmentType),
    kv('Prosperity', o.prosperity),
    kv('Safety', o.safety),
    kv('Viability', o.viabilityVerdict ? humanize(o.viabilityVerdict) : null),
    o.stress.length ? md('', '## Active crises', o.stress.map(x =>
      `- **${esc(x.label || 'Crisis')}** — ${esc(x.summary || '')}${x.hook ? ` *Hook: ${esc(x.hook)}*` : ''}`)) : null,
    o.arrivalScene ? md('', '## Arrival', `> ${esc(o.arrivalScene)}`) : null,
    o.pressureSentence ? md('', `*${esc(o.pressureSentence)}*`) : null,
    o.settlementReason ? md('', '## Why this place exists', esc(o.settlementReason)) : null,
    o.character ? md('', '## Character', esc(o.character)) : null,
  );
}

function statePage(vm) {
  const st = vm.systemState;
  if (!st) return null;
  const dims = [
    ['Resilience', st.resilience], ['Volatility', st.volatility],
    ['External threat', st.externalThreat], ['Resource pressure', st.resourcePressure],
  ].filter(([, d]) => d);
  if (!dims.length) return null;
  return md(
    '| Dimension | Value | Band |',
    '| --- | --- | --- |',
    dims.map(([name, d]) => `| ${name} | ${esc(d.value)} | ${esc(d.band || '')} |`),
    '',
    dims.map(([name, d]) => (d.drivers || []).length
      ? md(`## ${name} — drivers`, d.drivers.map(bullet)) : null),
  );
}

function tonightPage(vm) {
  const crisis = vm.summary.crisis;
  const figures = vm.summary.keyFigures || [];
  const hooks = (vm.hooks.all || []).slice(0, 4);
  return md(
    crisis.active ? md('## Crisis on the table', crisis.chips.map(c =>
      `- **${esc(c.label || 'Crisis')}** — ${esc(c.hook || c.summary || '')}`)) : null,
    figures.length ? md('', '## Faces they will meet', figures.map(f =>
      `- **${esc(f.name)}**${f.title ? ` (${esc(f.title)})` : ''}${f.faction ? ` — ${esc(f.faction)}` : ''}${f.sentence ? `. ${esc(f.sentence)}` : ''}`)) : null,
    hooks.length ? md('', '## Threads to pull', hooks.map(h =>
      `- ${esc(hookText(h.hook))} *(${esc(h.sourceName)})*`)) : null,
  ) || null;
}

function npcQuickRefPage(vm) {
  const npcs = vm.npcs.sorted || [];
  if (!npcs.length) return null;
  return md(
    lede(npcsHeadline(vm.npcs)),
    '',
    '| Name | Role | Faction | Power |',
    '| --- | --- | --- | --- |',
    npcs.map(n => `| ${esc(n.name)} | ${esc(n.title || '')} | ${esc(n.factionLabel || '')} | ${esc(n.power || 0)} |`),
  );
}

function notableNpcPage(n) {
  return md(
    kv('Role', n.title),
    kv('Race', n.race),
    kv('Faction', n.factionLabel),
    kv('Power', n.power),
    kv('Influence', n.influenceLabel),
    n.blurb ? md('', esc(n.blurb)) : null,
    n.appearance ? md('', '## Appearance', esc(n.appearance)) : null,
    n.personality ? md('', '## Personality', esc(n.personality)) : null,
    n.motivation ? md('', '## Wants', esc(n.motivation)) : null,
    n.secrets.length ? md('', '## Secrets (GM only)', n.secrets.map(s =>
      bullet(typeof s === 'string' ? s : (s.text || s.description || s.what || '')))) : null,
    n.plotHooks.length ? md('', '## Hooks', n.plotHooks.map(h => bullet(hookText(h)))) : null,
    n.relationships.length ? md('', '## Relationships', n.relationships.map(r =>
      bullet(typeof r === 'string' ? r : `${r.with || r.target || r.name || ''}${r.type ? ` — ${r.type}` : ''}${r.description ? `. ${r.description}` : ''}`)) ) : null,
  ) || null;
}

function plotHooksPage(vm) {
  const all = vm.hooks.all || [];
  if (!all.length) return null;
  const byCategory = new Map();
  for (const h of all) {
    const cat = h.category || h.source || 'other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(h);
  }
  return md(
    lede(hooksHeadline(vm.hooks)),
    [...byCategory.entries()].map(([cat, hooks]) => md(
      '', `## ${esc(cap(humanize(cat)))}`,
      hooks.map(h => `- ${esc(hookText(h.hook))} *(${esc(h.sourceName)}${h.priority ? ` · ${esc(h.priority)}` : ''})*`),
    )),
  );
}

function powerPage(vm) {
  const p = vm.power;
  return md(
    lede(powerHeadline(p, vm.identity)),
    '',
    kv('Government', p.governmentType),
    kv('Stability', typeof p.stability === 'object' ? (p.stability?.label ?? p.stability?.value) : p.stability),
    p.legitimacy?.score != null ? kv('Public legitimacy', p.legitimacy.score) : null,
    p.factions.length ? md('', '## Factions', p.factions.map(f =>
      `- **${esc(f.name)}**${f.isGoverning ? ' *(governing)*' : ''} — power ${esc(f.power)}${f.description ? `. ${esc(f.description)}` : ''}`)) : null,
    p.tensions.length ? md('', '## Tensions', p.tensions.map(tn =>
      `- **${esc(tn.label || 'Tension')}**${tn.severity ? ` (${esc(tn.severity)})` : ''}${tn.description ? ` — ${esc(tn.description)}` : ''}`)) : null,
    p.conflicts.length ? md('', '## Conflicts', p.conflicts.map(c =>
      `- **${esc((c.parties || []).join(' vs '))}**${c.intensity ? ` (${esc(c.intensity)})` : ''}${c.issue ? ` — ${esc(c.issue)}` : ''}${c.stakes ? ` Stakes: ${esc(c.stakes)}` : ''}`)) : null,
  );
}

function identityPage(vm) {
  const id = vm.identity;
  return md(
    kv('Layout', id.layout),
    kv('Age', id.age),
    kv('Trade access', id.tradeAccess ? humanize(id.tradeAccess) : null),
    kv('Governing faction', id.anchor.governingName),
    kv('Cultural notes', id.anchor.culturalNotes),
    id.quarters.length ? md('', '## Quarters', id.quarters.map(q =>
      `- **${esc(q.name)}**${q.description ? ` — ${esc(q.description)}` : ''}${(q.landmarks || []).length ? ` Landmarks: ${q.landmarks.map(esc).join(', ')}.` : ''}`)) : null,
  ) || null;
}

function servicesPage(vm) {
  const s = vm.services;
  const avail = Object.entries(s.available || {}).filter(([, v]) => v);
  return md(
    lede(servicesHeadline(s)),
    avail.length ? md('', '## Available services', avail.map(([k]) => bullet(humanize(k)))) : null,
    (s.notableAbsences || []).length ? md('', '## Notably absent for the tier',
      s.notableAbsences.map(a => bullet(typeof a === 'string' ? humanize(a) : (a?.label || a?.name || '')))) : null,
  ) || null;
}

function institutionsPage(vm) {
  const detailed = vm.services.detailed || [];
  if (!detailed.length) return null;
  const byCat = new Map();
  for (const inst of detailed) {
    if (!byCat.has(inst.category)) byCat.set(inst.category, []);
    byCat.get(inst.category).push(inst);
  }
  return md(
    [...byCat.entries()].map(([cat, list]) => md(
      `## ${esc(cap(humanize(cat)))}`,
      list.map(i => `- **${esc(i.name)}**${i.status && i.status !== 'healthy' ? ` *(${esc(i.status)})*` : ''}${i.description ? ` — ${esc(i.description)}` : ''}`),
      '',
    )),
  );
}

function economicsPage(vm) {
  const e = vm.economics;
  const fb = e.foodBalance || {};
  return md(
    lede(economicsHeadline(e)),
    '',
    kv('Prosperity', e.prosperity),
    kv('Complexity', e.economicComplexity),
    kv('Exports', (e.primaryExports || []).map(x => label(x)).filter(Boolean).join(', ')),
    kv('Imports', (e.primaryImports || []).map(x => label(x)).filter(Boolean).join(', ')),
    fb.display ? kv('Food', fb.display) : (fb.deficit ? kv('Food deficit', fb.deficit) : kv('Food surplus', fb.surplus)),
    (e.incomeSources || []).length ? md('', '## Income', e.incomeSources.map(s =>
      `- ${esc(label(s.source) || s.source)} — ${esc(Math.round(s.percentage))}%`)) : null,
    (e.chains || []).length ? md('', '## Supply chains', e.chains.map(c =>
      `- **${esc(c.name)}** *(${esc(c.status)})*${c.description ? ` — ${esc(c.description)}` : ''}`)) : null,
  );
}

function resourcesPage(vm) {
  const r = vm.resources;
  return md(
    lede(resourcesHeadline(r)),
    '',
    kv('Terrain', r.terrain),
    kv('Strategic value', typeof r.strategicValue === 'object' ? (r.strategicValue?.label ?? r.strategicValue?.value) : r.strategicValue),
    kv('Nearby resources', (r.nearbyAbundant || []).map(x => humanize(label(x) || x)).join(', ')),
    kv('Depleted', (r.nearbyDepleted || []).map(x => humanize(label(x) || x)).join(', ')),
    (r.chainRows || []).length ? md('', '## Exploitation',
      '| Resource | Status | Processing | Output |',
      '| --- | --- | --- | --- |',
      r.chainRows.map(c => `| ${esc(humanize(c.resource))} | ${esc(c.status)} | ${esc(c.processing || '—')} | ${esc(c.output || '—')} |`)) : null,
  );
}

function defensePage(vm) {
  const d = vm.defense;
  // deriveArmedForces returns GROUPED arrays (the PDF DefenseSecurity chapter
  // iterates the same keys); entries carry name/desc/source.
  const forces = ['fortifications', 'standing', 'contracted', 'charter', 'arcane']
    .flatMap(k => d.armedForces?.[k] || []);
  return md(
    lede(defenseHeadline(d, vm.identity)),
    '',
    kv('Readiness', d.readiness?.label),
    kv('Safety', d.safetyLabel),
    d.militaryStress ? kv('Military status', d.militaryStress.label || humanize(d.militaryStress.type)) : null,
    forces.length ? md('', '## Armed forces', forces.map(f =>
      bullet(typeof f === 'string' ? f : `${f.name || ''}${f.desc ? ` — ${f.desc}` : ''}${f.source ? ` (${f.source})` : ''}`)) ) : null,
    (d.criminalOps || []).length ? md('', '## Criminal operations', d.criminalOps.map(o =>
      `- **${esc(o.name)}**${o.note ? ` — ${esc(o.note)}` : ''}`)) : null,
    (d.vulnerabilities || []).length ? md('', '## Vulnerabilities',
      d.vulnerabilities.map(v => bullet(typeof v === 'string' ? v : (v?.label || v?.description || '')))) : null,
  );
}

function historyPage(vm) {
  const h = vm.history;
  const f = h.founding || {};
  return md(
    lede(historyHeadline(h)),
    '',
    kv('Age', h.age),
    kv('Founded by', f.foundedBy),
    kv('Origin', f.origin),
    f.summary ? md('', esc(f.summary)) : null,
    f.initialChallenge ? kv('Initial challenge', f.initialChallenge) : null,
    f.overcoming ? kv('How it was overcome', f.overcoming) : null,
    (h.events || []).length ? md('', '## Historical events', h.events.map(e =>
      `- **${esc(e.title || humanize(e.type || 'Event'))}**${e.yearsAgo != null ? ` *(${esc(e.yearsAgo)} years ago)*` : ''}${e.description ? ` — ${esc(e.description)}` : ''}`)) : null,
  );
}

function viabilityPage(vm) {
  const v = vm.viability;
  return md(
    lede(viabilityHeadline(v)),
    '',
    kv('Verdict', v.verdict ? humanize(v.verdict) : null),
    v.summary ? md('', esc(v.summary)) : null,
    (v.issues || []).length ? md('', '## Issues', v.issues.map(i =>
      `- **${esc(i.title || 'Issue')}**${i.severity ? ` (${esc(i.severity)})` : ''}${i.description ? ` — ${esc(i.description)}` : ''}`)) : null,
  );
}

function relationshipsPage(vm) {
  const r = vm.relationships;
  const pr = r.prominentRelationship;
  return md(
    lede(relationshipsHeadline(r)),
    (r.neighbours || []).length ? md('', '## Neighbours', r.neighbours.map(n =>
      `- **${esc(n.name)}**${n.type ? ` *(${esc(humanize(n.type))})*` : ''}${n.description ? ` — ${esc(n.description)}` : ''}`)) : null,
    pr ? md('', '## Prominent relationship',
      esc(pr.description || pr.summary || `${pr.otherSettlement || ''} — ${pr.type || ''}`)) : null,
  ) || null;
}

function timelinePage(vm, { faithUnlocked = false } = {}) {
  // THE faith seam applies to the event log too: the deity event kinds embed
  // the deity's name in their generated narration, so a free/lapsed/anon
  // export drops those entries (the Faith & War page gate alone would not
  // stop the Timeline page from carrying the name).
  const entries = gateFaithEvents(vm.eventLog, { faithUnlocked });
  if (!entries.length) return null;
  return md(entries.map(en => {
    const ev = en?.event || {};
    const title = ev.description || humanize(ev.type || 'event');
    const when = ev.inWorldDate ? ` *(${esc(ev.inWorldDate)})*` : '';
    const summary = en?.narrativeSummary ? ` — ${esc(en.narrativeSummary)}` : '';
    return `- **${esc(title)}**${when}${summary}`;
  }));
}

function faithWarPage(vm) {
  const lw = vm.liveWorld;
  if (!lw) return null;
  const deity = lw.deity;
  return md(
    kv('Posture', lw.posture ? `${lw.posture.label} (aggression ×${lw.posture.value.toFixed(2)})` : null),
    lw.exhaustion ? kv('War-weary', `${cap(lw.exhaustion.band)} (${lw.exhaustion.value.toFixed(2)})`) : null,
    lw.standing ? kv('Standing', `${lw.standing.wins}W / ${lw.standing.losses}L (net ${lw.standing.score > 0 ? '+' : ''}${lw.standing.score})`) : null,
    (lw.besiegingTargets || []).length ? kv('At war', `its army besieges ${lw.besiegingTargets.join(', ')}`) : null,
    (lw.besiegedBy || []).length ? kv('Under siege', `${lw.besiegedBy.join(', ')} at the walls`) : null,
    lw.occupied ? kv('Occupied', `held by ${lw.occupied.occupier}`) : null,
    lw.mobilization ? kv('Mobilization', lw.mobilization.phrase) : null,
    lw.army ? kv('Army in the field', `marching on ${lw.army.targetName} — ${lw.army.remainingPhrase}; ${lw.army.conditionPhrase}`) : null,
    (lw.tradeWars || []).length ? md('', '## Trade wars', lw.tradeWars.map(p =>
      bullet(p.role === 'supplier'
        ? `Now the primary supplier of ${p.commodityLabel} to ${p.buyer}.`
        : p.role === 'displaced'
          ? `Displaced as supplier of ${p.commodityLabel} to ${p.buyer}.`
          : `Contesting ${p.commodityLabel} (${p.buyer}).`))) : null,
    deity ? md('', `## Patron deity — ${esc(deity.name)}`,
      kv('Rank', deity.rankAxis ? cap(deity.rankAxis) : null),
      kv('Alignment', deity.alignmentAxis ? cap(deity.alignmentAxis) : null),
      kv('Temperament', deity.temperamentAxis ? cap(deity.temperamentAxis) : null),
      kv('Domain', deity.domain ? humanize(deity.domain) : null),
      (deity.effects || []).length ? md('', '### Faith effects', deity.effects.map(bullet)) : null,
    ) : null,
    (lw.livePantheon || []).length > 1 ? md('', '## Living pantheon', lw.livePantheon.map(d =>
      `- **${esc(d.name)}**${d.isPatron ? ' *(patron)*' : ''} — ${esc(d.share)}% · ${esc(cap(d.standing))}`)) : null,
    (lw.cults || []).length ? kv('Cults', lw.cults.map(c => `${c.name}${c.alignmentAxis ? ` (${c.alignmentAxis})` : ''}`).join(', ')) : null,
    lw.mandate ? kv('Divine mandate', lw.mandate.phrase || lw.mandate) : null,
    (lw.pantheon || []).length ? md('', '## Realm pantheon', lw.pantheon.map(p =>
      `- **${esc(p.name)}** — ${esc(cap(p.tier))}, ${esc(p.seats)} seat${p.seats === 1 ? '' : 's'}`)) : null,
    (lw.realmArcs || []).length ? md('', '## Realm arcs', lw.realmArcs.map(a => bullet(a))) : null,
  ) || null;
}

function aiAppendixPage(vm) {
  const a = vm.aiAppendix;
  if (!a) return null;
  return md(
    a.thesis ? md('## Thesis', esc(a.thesis)) : null,
    (a.identityMarkers || []).length ? md('', '## Identity markers', a.identityMarkers.map(bullet)) : null,
    (a.frictionPoints || []).length ? md('', '## Friction points', a.frictionPoints.map(x =>
      bullet(typeof x === 'string' ? x : (x?.label || x?.description || '')))) : null,
    a.dmCompass ? md('', '## DM compass', esc(typeof a.dmCompass === 'string' ? a.dmCompass : JSON.stringify(a.dmCompass))) : null,
  ) || null;
}

// ── page assembly ────────────────────────────────────────────────────────────

/**
 * Build the journal page list for a settlement export.
 *
 * @param {ReturnType<import('../pdf/lib/viewModel.js').buildViewModel>} vm
 * @param {{ variant?: string, faithUnlocked?: boolean }} [opts]
 *   `faithUnlocked` is the premium seam result the export surface passes
 *   (tier === 'premium' || isElevated()); the default (false) is the safe one.
 * @returns {Array<{ name: string, markdown: string }>}
 */
export function buildJournalPages(vm, { variant = 'canon_dossier', faithUnlocked = false } = {}) {
  const spec = PDF_VARIANTS[variant] || PDF_VARIANTS.canon_dossier;
  const ctx = { phase: vm.phase, narrated: vm.narrativeMode, eventCount: vm.eventLog?.length ?? 0 };
  const inc = (key) => shouldInclude(spec.chapters[key], ctx);

  const pages = [];
  const push = (name, markdown) => {
    const trimmed = typeof markdown === 'string' ? markdown.replace(/^\n+/, '').replace(/\n+$/, '') : markdown;
    if (trimmed) pages.push({ name, markdown: trimmed });
  };

  if (inc('overview'))            push('Overview', overviewPage(vm));
  if (inc('systemState'))         push('Settlement State', statePage(vm));
  if (inc('tonightAtTheTable'))   push('Tonight at the Table', tonightPage(vm));
  if (inc('npcQuickRef'))         push('NPC Quick Reference', npcQuickRefPage(vm));
  if (inc('notableNpcs')) {
    for (const n of notableNpcs(vm.npcs.sorted || [])) {
      push(`NPC — ${n.name}`, notableNpcPage(n));
    }
  }
  if (inc('plotHooks'))           push('Plot Hooks', plotHooksPage(vm));
  if (inc('powerStructure'))      push('Power & Factions', powerPage(vm));
  if (inc('identityDailyLife'))   push('Identity & Daily Life', identityPage(vm));
  if (inc('services'))            push('Services', servicesPage(vm));
  if (inc('institutions'))        push('Institutions', institutionsPage(vm));
  if (inc('economicsTrade'))      push('Economics & Trade', economicsPage(vm));
  if (inc('resourcesProduction')) push('Resources & Production', resourcesPage(vm));
  if (inc('defenseSecurity'))     push('Defense & Security', defensePage(vm));
  if (inc('historyFounding'))     push('History & Founding', historyPage(vm));
  if (inc('viabilityAssessment')) push('Viability Assessment', viabilityPage(vm));
  if (inc('relationships'))       push('Relationships & Neighbours', relationshipsPage(vm));
  if (inc('timeline'))            push('Timeline', timelinePage(vm, { faithUnlocked }));

  // THE premium faith seam — the same pure predicate the PDF uses, verbatim.
  // faithUnlocked defaults false (safe); dormant liveWorld (null) also gates.
  if (faithChapterVisible({
    variant, phase: vm.phase, hasLiveWorld: !!vm.liveWorld, faithUnlocked,
    narrated: ctx.narrated, eventCount: ctx.eventCount,
  })) {
    push('Faith & War', faithWarPage(vm));
  }

  if (inc('aiAppendix'))          push('AI Appendix', aiAppendixPage(vm));

  return pages;
}

export default buildJournalPages;
