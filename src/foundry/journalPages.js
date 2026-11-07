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
import {
  cap, humanize, hookText, label, stripZwnj,
  prominentPair, prominentType, prominentProse,
} from '../pdf/lib/format.js';
import { gateFaithEvents } from '../domain/display/faithEventFilter.js';
import { composeTonightSheet, printsAsWant, secretLeadOf, TONIGHT_COPY } from '../domain/summary/tonightSheet.js';
import { composeCrisisPage, CRISIS_PAGE_COPY } from '../domain/crisis/crisisPage.js';
import { institutionDisplayName } from '../domain/display/institutionDisplayName.js';
import { resourceDisplayName } from '../domain/display/resourceDisplayName.js';
import { displayTradeList, revenuesOffTheLists } from '../domain/display/tradeListDisplay.js';
import { foodwaysLineOf } from '../domain/foodways.js';
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
      `- **${esc(x.label || 'Crisis')}**: ${esc(x.summary || '')}${x.hook ? ` *Hook: ${esc(x.hook)}*` : ''}`)) : null,
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
      ? md(`## ${name}: drivers`, d.drivers.map(bullet)) : null),
  );
}

/**
 * THE ONE TONIGHT SHEET (X-51) as a journal page: the same composer the screen and the PDF
 * read (domain/summary/tonightSheet.js), over the settlement itself. The settlement is passed
 * in, not read off `vm.raw`: the two are the same object, but a composer handed `vm.raw` reads
 * as fed by two record shapes, which hides its reads from the observed-shape instrument.
 */
function tonightPage(settlement) {
  const sheet = composeTonightSheet(settlement);
  const why = { seat: TONIGHT_COPY.seat, secret: TONIGHT_COPY.secret, cleric: TONIGHT_COPY.cleric };
  return md(
    sheet.opening ? md(`## ${sheet.crisis ? TONIGHT_COPY.crisis : TONIGHT_COPY.urgent}`, esc(sheet.opening)) : null,
    sheet.people.length ? md('', `## ${TONIGHT_COPY.people}`, sheet.people.map(p =>
      `- **${esc(p.name)}** (${esc([p.role, p.castLabel || why[p.why]].filter(Boolean).join(' · '))})${p.line ? `: ${!printsAsWant(p) ? esc([secretLeadOf(p), p.line].filter(Boolean).join(' ')) : p.sameAs ? `${TONIGHT_COPY.wantsSame} ${esc(p.sameAs)}.` : `${TONIGHT_COPY.wants} ${esc(p.line)}`}` : ''}`)) : null,
    sheet.facts.length ? md('', `## ${TONIGHT_COPY.facts}`, sheet.facts.map(f => `- **${esc(f.label)}**: ${esc(f.text)}`)) : null,
    sheet.hooks.length ? md('', `## ${TONIGHT_COPY.hooks}`, sheet.hooks.map(h =>
      `- ${esc(h.text)}${h.source ? ` *(${esc(h.source)})*` : ''}`)) : null,
  ) || null;
}

/**
 * THE CRISIS PAGE as a journal page (docs/DESIGN_CRISIS_TAB.md): the Crisis tab's sections from the
 * same composer (domain/crisis/crisisPage.js), one per active crisis, worst first; none for a calm
 * town. Rides the Tonight chapter's inclusion.
 */
function crisisJournalPage(settlement) {
  const sections = composeCrisisPage(settlement);
  if (!sections.length) return null;
  return md(...sections.map(s => md(
    '', `## ${esc(s.line)}`,
    s.summary ? esc(s.summary) : null,
    '', `### ${CRISIS_PAGE_COPY.cast}`,
    s.cast.length ? s.cast.map(r => `- **${esc(r.roleLabel)}**: ${esc(r.name)}. ${esc(r.reason)}.`) : `- ${CRISIS_PAGE_COPY.nobody}`,
    s.stakes.length ? md('', `### ${CRISIS_PAGE_COPY.stakes}`, s.stakes.map(k => `- **${esc(k.factionId)}** ${CRISIS_PAGE_COPY.stake[k.stake]}: ${esc(k.reason)}.`)) : null,
    '', `### ${CRISIS_PAGE_COPY.levers}`,
    s.levers.length ? s.levers.map(l => `- ${esc(l.institution)}${l.holderName ? `, held by ${esc(l.holderName)}` : ''}`) : `- ${CRISIS_PAGE_COPY.noLevers}`,
    s.seeFirst.length ? md('', `### ${CRISIS_PAGE_COPY.seeFirst}`, s.seeFirst.map(f => `- **${esc(f.label)}**: ${esc(f.text)}`)) : null,
    s.ifNothingIsDone ? md('', `### ${CRISIS_PAGE_COPY.ifNothing}`, esc(s.ifNothingIsDone)) : null,
  ))) || null;
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
    n.personality ? md('', '## Personality', esc(n.personality)) : null,
    n.motivation ? md('', '## Wants', esc(n.motivation)) : null,
    n.secrets.length ? md('', '## Secrets (GM only)', n.secrets.map(s =>
      bullet(typeof s === 'string' ? s : (s.text || s.description || s.what || '')))) : null,
    n.plotHooks.length ? md('', '## Hooks', n.plotHooks.map(h => bullet(hookText(h)))) : null,
    n.relationships.length ? md('', '## Relationships', n.relationships.map(r =>
      bullet(typeof r === 'string' ? r : `${r.with || r.target || r.name || ''}${r.type ? `: ${r.type}` : ''}${r.description ? `. ${r.description}` : ''}`)) ) : null,
  ) || null;
}

/** The hook groups a reader knows, for the catalogue's category keys. */
const HOOK_GROUP_WORDS = Object.freeze({ npc: 'People', npcs: 'People' });

function plotHooksPage(vm) {
  const all = vm.hooks.all || [];
  if (!all.length) return null;
  const byCategory = new Map();
  for (const h of all) {
    const cat = h.category || h.source || 'other';
    // The category key is the catalogue's ("npc"); the page prints the group a reader knows.
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(h);
  }
  return md(
    lede(hooksHeadline(vm.hooks)),
    [...byCategory.entries()].map(([cat, hooks]) => md(
      '', `## ${esc(HOOK_GROUP_WORDS[String(cat).toLowerCase()] || cap(humanize(cat)))}`,
      // The source in words, no priority key (the owner's style law of 2026-11-07: the machinery out).
      hooks.map(h => `- ${esc(hookText(h.hook))}${h.sourceName ? ` *(${esc(cap(humanize(h.sourceName)))})*` : ''}`),
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
      // No "power N": the score is the engine's, not the reader's (the owner's style law of 2026-11-07).
      `- **${esc(f.name)}**${f.isGoverning ? ' *(governing)*' : ''}${f.description ? `: ${esc(f.description)}` : ''}`)) : null,
    p.tensions.length ? md('', '## Tensions', p.tensions.map(tn =>
      // The tension's key in words ("Resource scarcity"), no severity range ("minor / major").
      `- **${esc(tn.label ? cap(humanize(tn.label)) : 'Tension')}**${tn.description ? `: ${esc(tn.description)}` : ''}`)) : null,
    p.conflicts.length ? md('', '## Conflicts', p.conflicts.map(c =>
      `- **${esc((c.parties || []).join(' vs '))}**${c.intensity ? ` (${esc(c.intensity)})` : ''}${c.issue ? `: ${esc(c.issue)}` : ''}${c.stakes ? ` Stakes: ${esc(c.stakes)}` : ''}`)) : null,
  );
}

function identityPage(vm, settlement = vm.raw) {
  const id = vm.identity;
  return md(
    kv('Layout', id.layout),
    kv('Age', id.age),
    kv('Trade access', id.tradeAccess ? humanize(id.tradeAccess) : null),
    kv('Governing faction', id.anchor.governingName),
    kv('Cultural notes', id.anchor.culturalNotes),
    // FOOD-4: the food record's foodways line, through the one reader — the PDF chapter's row.
    kv('Foodways', foodwaysLineOf(settlement)),
    // ⛔ No '## Quarters' section before the plat (X-47); the view model keeps `id.quarters`.
  ) || null;
}

function servicesPage(vm) {
  const s = vm.services;
  // A category is listed only where something is on offer: every category key is present on the
  // slice, most as an empty list, so a truthiness filter printed all eleven (Magic in a world
  // without it). Each line names what is offered (W7 HOOKS, the owner's style law of 2026-11-07).
  const avail = Object.entries(s.available || {}).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : !!v));
  return md(
    lede(servicesHeadline(s)),
    avail.length ? md('', '## Available services', avail.map(([k, v]) => bullet(Array.isArray(v)
      ? `${cap(humanize(k))}: ${[...new Set(v.map((x) => x?.name).filter(Boolean))].join(', ')}`
      : cap(humanize(k))))) : null,
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
      // The institution label seam (ODQ 934.13): the VTT journal is a reader surface like
      // any other, and it printed the raw catalogue key beside a PDF that did not.
      list.map(i => `- **${esc(institutionDisplayName(i))}**${i.status && i.status !== 'healthy' ? ` *(${esc(i.status)})*` : ''}${i.description ? `: ${esc(i.description)}` : ''}`),
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
    // The resource label seam: a trade list may carry a raw RESOURCE_DATA key beside an
    // authored phrase, and the VTT journal printed both exactly as the record spells them.
    // F11 / CENSUS-3b unit 3: the journal reads the SCREEN's lists (one display reader).
    kv('Exports', displayTradeList(e.primaryExports, vm.raw, { side: 'exports' }).map(x => resourceDisplayName(x)).filter(Boolean).join(', ')),
    kv('Imports', displayTradeList(e.primaryImports, vm.raw, { side: 'imports', exports: e.primaryExports }).map(x => resourceDisplayName(x)).filter(Boolean).join(', ')),
    fb.display ? kv('Food', fb.display) : (fb.deficit ? kv('Food deficit', fb.deficit) : kv('Food surplus', fb.surplus)),
    (e.incomeSources || []).length ? md('', '## Income', e.incomeSources.map(s =>
      `- ${esc(label(s.source) || s.source)}: ${esc(Math.round(s.percentage))}%`)) : null,
    // CENSUS-3c (R-P 2): the revenues that left the trade lists, where the record holds their fact.
    revenuesOffTheLists(vm.raw).length ? kv('Also earned (no share recorded)', revenuesOffTheLists(vm.raw).map((r) => r.text).join(', ')) : null,
    (e.chains || []).length ? md('', '## Supply chains', e.chains.map(c =>
      `- **${esc(c.name)}** *(${esc(c.status)})*${c.description ? `: ${esc(c.description)}` : ''}`)) : null,
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
      bullet(typeof f === 'string' ? f : `${f.name || ''}${f.desc ? `: ${f.desc}` : ''}${f.source ? ` (${f.source})` : ''}`)) ) : null,
    (d.criminalOps || []).length ? md('', '## Criminal operations', d.criminalOps.map(o =>
      `- **${esc(o.name)}**${o.note ? `: ${esc(o.note)}` : ''}`)) : null,
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
      `- **${esc(e.title || humanize(e.type || 'Event'))}**${e.yearsAgo != null ? ` *(${esc(e.yearsAgo)} years ago)*` : ''}${e.description ? `: ${esc(e.description)}` : ''}`)) : null,
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
      `- **${esc(i.title || 'Issue')}**${i.severity ? ` (${esc(i.severity)})` : ''}${i.description ? `: ${esc(i.description)}` : ''}`)) : null,
  );
}

function relationshipsPage(vm) {
  const r = vm.relationships;
  const pr = r.prominentRelationship;
  // The record is an NPC-to-NPC edge, so it is read through THE shared reader
  // contract the PDF chapters use (pdf/lib/format.js) rather than the
  // never-written otherSettlement/description/summary keys this page used to
  // reach for. Emit the section only when a key actually carries something.
  const prHeading = [prominentPair(pr), prominentType(pr)].filter(Boolean).join(' — ');
  const prProse = prominentProse(pr);
  return md(
    lede(relationshipsHeadline(r)),
    (r.neighbours || []).length ? md('', '## Neighbours', r.neighbours.map(n =>
      `- **${esc(n.name)}**${n.type ? ` *(${esc(humanize(n.type))})*` : ''}${n.description ? `: ${esc(n.description)}` : ''}`)) : null,
    pr && (prHeading || prProse)
      ? md('', '## Prominent relationship', bullet(prHeading), prProse ? esc(prProse) : null)
      : null,
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
    const summary = en?.narrativeSummary ? `: ${esc(en.narrativeSummary)}` : '';
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
    lw.army ? kv('Army in the field', `marching on ${lw.army.targetName}: ${lw.army.remainingPhrase}; ${lw.army.conditionPhrase}`) : null,
    (lw.tradeWars || []).length ? md('', '## Trade wars', lw.tradeWars.map(p =>
      bullet(p.role === 'supplier'
        ? `Now the primary supplier of ${p.commodityLabel} to ${p.buyer}.`
        : p.role === 'displaced'
          ? `Displaced as supplier of ${p.commodityLabel} to ${p.buyer}.`
          : `Contesting ${p.commodityLabel} (${p.buyer}).`))) : null,
    deity ? md('', `## Patron deity: ${esc(deity.name)}`,
      kv('Rank', deity.rankAxis ? cap(deity.rankAxis) : null),
      kv('Alignment', deity.alignmentAxis ? cap(deity.alignmentAxis) : null),
      // W-FAITH F7c: the derivation's word off the liveWorld slice; neutral is
      // null there and prints no row (the retired stored mirror is gone).
      kv('Temperament', deity.temper ? cap(deity.temper) : null),
      kv('Domain', deity.domain ? humanize(deity.domain) : null),
      (deity.effects || []).length ? md('', '### Faith effects', deity.effects.map(bullet)) : null,
    ) : null,
    (lw.livePantheon || []).length > 1 ? md('', '## Living pantheon', lw.livePantheon.map(d =>
      `- **${esc(d.name)}**${d.isPatron ? ' *(patron)*' : ''}: ${esc(d.share)}% · ${esc(cap(d.standing))}`)) : null,
    (lw.cults || []).length ? kv('Cults', lw.cults.map(c => `${c.name}${c.alignmentAxis ? ` (${c.alignmentAxis})` : ''}`).join(', ')) : null,
    lw.mandate ? kv('Divine mandate', lw.mandate.phrase || lw.mandate) : null,
    (lw.pantheon || []).length ? md('', '## Realm pantheon', lw.pantheon.map(p =>
      `- **${esc(p.name)}**: ${esc(cap(p.tier))}, ${esc(p.seats)} seat${p.seats === 1 ? '' : 's'}`)) : null,
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
 * @param {{ variant?: string, faithUnlocked?: boolean, settlement?: any }} [opts]
 *   `faithUnlocked` is the premium seam result the export surface passes
 *   (tier === 'premium' || isElevated()); the default (false) is the safe one.
 *   `settlement` is the settlement the view model was built from; it defaults to `vm.raw`,
 *   which is that same object.
 * @returns {Array<{ name: string, markdown: string }>}
 */
export function buildJournalPages(vm, { variant = 'canon_dossier', faithUnlocked = false, settlement = vm.raw } = {}) {
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
  if (inc('tonightAtTheTable'))   push(TONIGHT_COPY.title, tonightPage(settlement));
  if (inc('tonightAtTheTable'))   push(CRISIS_PAGE_COPY.tab, crisisJournalPage(settlement));
  if (inc('npcQuickRef'))         push('NPC Quick Reference', npcQuickRefPage(vm));
  if (inc('notableNpcs')) {
    for (const n of notableNpcs(vm.npcs.sorted || [])) {
      push(`NPC — ${n.name}`, notableNpcPage(n));
    }
  }
  if (inc('plotHooks'))           push('Plot Hooks', plotHooksPage(vm));
  if (inc('powerStructure'))      push('Power & Factions', powerPage(vm));
  if (inc('identityDailyLife'))   push('Identity & Daily Life', identityPage(vm, settlement));
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
