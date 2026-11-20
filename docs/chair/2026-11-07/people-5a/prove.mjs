// PEOPLE-5A DISPLAY — the surfaces' proof (2026-11-07). Measure-only: births settlements and builds
// every re-wired surface over each, one JSON line per settlement.
//   node docs/chair/2026-11-07/people-5a/prove.mjs soak <out.jsonl> [from] [to]
//   node docs/chair/2026-11-07/people-5a/prove.mjs golden <out.jsonl>
// Per settlement: (1) the surfaces build without a throw — the dossier view model (every exported
// derive*), the entity index, the search, the plot hooks, the faction and NPC profiles, the PDF view
// model, the Foundry journal pages, the gallery payload and its veil; (2) every card's power line
// names powers that exist; (3) the Power tab's member counts equal the memberships; (4) the NPC tab
// groups every card exactly once; (5) the veil: the per-card key sets of the veiled full share, the
// people car's fields aside, as a digest (compared base → tip by aggregate.mjs).
import { appendFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as dvm from '../../../../src/domain/display/dossierViewModel.js';
import { buildDossierEntityIndex } from '../../../../src/domain/dossier/entityLinks.js';
import { collectPlotHooks } from '../../../../src/domain/dossier/plotHooks.js';
import { deriveAllFactionProfiles } from '../../../../src/domain/factionProfile.js';
import { deriveNpcProfile } from '../../../../src/domain/npcProfile.js';
import { buildViewModel } from '../../../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../../../src/foundry/journalPages.js';
import { galleryPayloadFor, applyVeil, resolveVeil, defaultVeilFor } from '../../../../src/domain/display/galleryVeil.js';
import { toPublicSafe } from '../../../../src/domain/display/publicSafe.js';

let cp = null;
try { cp = await import('../../../../src/domain/people/cardPowers.js'); } catch { cp = null; } // absent at the base
let search = null;
try { search = await import('../../../../src/domain/dossier/dossierSearch.js'); } catch { search = null; }

const PEOPLE_KEYS = new Set(['memberships', 'factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal']);
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16);

function attempt(errors, label, fn) {
  try { return fn(); } catch (e) { errors.push(`${label}: ${String(e?.message || e).slice(0, 160)}`); return null; }
}

export function prove(s, label) {
  const errors = [];
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  for (const [k, fn] of Object.entries(dvm)) if (k.startsWith('derive') && typeof fn === 'function') attempt(errors, `dvm.${k}`, () => fn(s));
  attempt(errors, 'entityIndex', () => buildDossierEntityIndex(s));
  if (search) {
    attempt(errors, 'search.dm', () => search.enumerateDossierObjects(s, {}));
    attempt(errors, 'search.player', () => search.enumerateDossierObjects(s, { playerView: true }));
  }
  attempt(errors, 'plotHooks', () => collectPlotHooks(s));
  attempt(errors, 'factionProfiles', () => deriveAllFactionProfiles(s));
  for (const n of npcs) attempt(errors, 'npcProfile', () => deriveNpcProfile(n, s));
  const vm = attempt(errors, 'pdfViewModel', () => buildViewModel({ settlement: s }));
  if (vm) attempt(errors, 'foundryPages', () => buildJournalPages(vm, { settlement: s }));

  const powers = (s.powerStructure?.factions || []).map((f) => String(f?.faction || f?.name || '')).filter(Boolean);
  const powerSet = new Set(powers);
  let cardsWithLine = 0; let strayLines = 0; let groupsOk = true; let countsOk = true; let pdfLines = 0; let pdfStray = 0;
  if (cp) {
    for (const n of npcs) {
      const parts = cp.cardPowerParts(n, cp.powerOrderOf(s));
      if (parts.length) cardsWithLine += 1;
      if (parts.some((p) => !powerSet.has(p.power))) strayLines += 1;
    }
    const groups = cp.groupCardsByFirstPower(npcs, s);
    const placed = groups.reduce((a, g) => a + g.cards.length, 0);
    groupsOk = placed === npcs.length && groups.every((g) => g.power === null || powerSet.has(g.power));
    const memberships = npcs.reduce((a, n) => a + cp.membershipsOf(n).filter((m) => powerSet.has(m.power)).length, 0);
    const tabCounts = powers.reduce((a, p) => a + cp.facesInPower(npcs, p).length, 0);
    countsOk = memberships === tabCounts;
    for (const row of vm?.npcs?.all || []) {
      if (row.powerLine) pdfLines += 1;
      if ((row.powers || []).some((p) => p.power && !powerSet.has(p.power))) pdfStray += 1;
    }
  }

  // The veil: the default eyes over the owner's full share; per-card key sets, the people car's aside.
  const veilDigest = attempt(errors, 'veil', () => {
    const full = galleryPayloadFor(s, { shareDm: true });
    const veiled = applyVeil(full, resolveVeil(defaultVeilFor(full), []));
    const cardKeys = (veiled.npcs || []).map((n) => Object.keys(n).filter((k) => !PEOPLE_KEYS.has(k) && k !== 'institution').sort());
    const instKept = (veiled.npcs || []).filter((n) => n.institution !== undefined).length;
    const pub = toPublicSafe(s);
    const pubKeys = [...new Set((pub.npcs || []).flatMap((n) => Object.keys(n)))].sort();
    return { cards: sha(cardKeys), instKept, pubKeys, hidden: sha(veiled._veil || veiled.veiled || null) };
  });

  return {
    label, tier: s.tier, npcs: npcs.length, powers: powers.length, errors,
    cardsWithLine, strayLines, groupsOk, countsOk, pdfLines, pdfStray, veil: veilDigest,
  };
}

const [mode, out, from = '0', to = '300'] = process.argv.slice(2);
if (mode) {
  writeFileSync(out, '');
  if (mode === 'golden') {
    const { goldenCorpus, keyOf } = await import('../../../../tests/helpers/goldenMasterCorpus.js');
    const { generateSettlementPipeline } = await import('../../../../src/generators/generateSettlementPipeline.js');
    for (const cfg of goldenCorpus()) {
      const { _seed, ...rest } = cfg;
      appendFileSync(out, JSON.stringify(prove(generateSettlementPipeline(rest, null, { seed: _seed, customContent: {} }), keyOf(cfg))) + '\n');
    }
  } else {
    const { birth, ensureLaws } = await import('../../../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    for (let i = Number(from); i < Number(to); i += 1) appendFileSync(out, JSON.stringify(prove(birth(i).settlement, `soak1k-${i}`)) + '\n');
  }
}
