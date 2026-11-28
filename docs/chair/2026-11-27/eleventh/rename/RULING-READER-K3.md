# RULING READER K3: AMEND (K3-1's owner-only `kindName` withdrawn; the builder's stored KIND taken, with five amendments)

Written 14:11 to 14:3x UTC on 2026-11-28 (hours from `date -u`), by the ruling reader of K3-1, on Opus at max effort (V38).
The code read and run: `lane/stack-124-rename-wip-2026-11-28` at **842bff96a** (K1, K1b, K2 in; no K3 commit). The record
read: `lane/chair-2026-11-08` at **ceffec463** (RULINGS-RENAME-BUILD.md, K3-1 and its 13:24 and 13:48 notes). The measure
read: `rename/build/K3-MEASURE.md` at 842bff96a. CONFIRMED = executed here; PLAUSIBLE = read here.

## The verdict, in one paragraph

The fault is real. K3-1's cure is right in direction: at the first rename, write down what the kind was read from, put one
leaf in front of it, and have the classifiers read the leaf. Its shape is wrong. An owner-only old name splits the owner's
page from the reader's, because the classifiers run live on the served record. Making it owner-only also needs a server
migration the ruling never names. The builder's shape is the right one: store the KIND (the verdicts), let it travel, and
leave the door id on the name. It needs five amendments (A1 to A5 below). Without A3, a coup freezes the old kind onto the
new government. Without A5, a rename lifts a DM's veil.

## The shape I recommend (the builder's, amended)

- **A1. Store the kind, never the name. It travels.**
  - The field is `kind: { ruler, families, face, archetype? }`, written once, only where absent.
  - **Is it a hidden thing for a power a reader can see? No.**
    - Each verdict is one the reader's born page already derives from public fields and prints: `category` is on the
      veil's identity floor (`galleryVeil.js:192`); `government` and the roster names travel; the role labels, the rule
      clause and the families lines show the verdicts.
    - A hidden power's row leaves the served record whole, its kind with it, and its name is masked server-side (migration
      210's header; PLAUSIBLE, by reading).
  - The old name never travels.
  - `kind` matches no token of `PRIVATE_KEY_RE` (`publicSafe.js:121`). It needs no migration: the client keeps it,
    CONFIRMED 60/60; the server twin is pinned character-identical to the client (PLAUSIBLE).
- **A2. Write it in the DM's action, not in the cascade writer.**
  - The site is `store/settlementRenameHelpers.js :: renameFactionImpl`, or the writer behind an explicit option.
  - The ruling's site, `applyFactionRenameToSettlement`, is also called by the BIRTH: `generators/power/factionLabelClose.js:45`
    renames the refused `Military/Guard` label to `Military Party` at close (`assembleSettlement.js:446`).
  - CONFIRMED: 1 of my 30 C births carries the twin. So the ruling's site would move births ("Births 0" false), and it would
    write down a label the facts refused.
- **A3. The coup must drop the stored kind on the re-formed seat.**
  - `transferRulingPower` reshapes the governing row by spreading it (`rulingPower.js:552-560`, `{ ...f, faction: toGovernment, category }`),
    so any stored kind or `kindName` survives onto the new government.
  - CONFIRMED on 40 coups of renamed towns, each with a planted kind:
    - the seat kept it 40 of 40;
    - read through it, the ruler kind is wrong on 22 of 40 (C dp-village-0: the seat becomes "Church Council", category
      religious; by `government` it is priest; by the stored name, elder);
    - the stored archetype contradicts the coup's own category stamp on 39 of 40. That is the "category-forever"
      alternative the code records as superseded (W-COIN taxes by it).
  - THE CURE, ONE LINE: the non-kept branch drops `kind`. The demoted house row (`houseFacts`) and the kept form (U5) keep it.
  - It is the one writer that reshapes a roster row in place. PLAUSIBLE by grep: the occupier (`applyWorldPulseOccupationAuthority.js:162`)
    and ADD_FACTION (`mutateEntities.js:409-412`) mint NEW rows.
- **A4. "Every classifier takes the kind FIRST" is the wrong rule. The kind is read where the NAME was read.**
  - It never comes before a field a later writer owns:
    - `factionArchetype`: `category`, then `kind.archetype`, then the name;
    - `rulerKindOf`: the governing row's `kind.ruler`, else `government` (after A3 a coup leaves no kind, so `government`
      decides);
    - `familiesHeldOf`: it is a RECORD-level test over names AND prose (`guardLineUnderTheLaw.js:223-236`), and the
      cascade rewrites the old name inside that prose, so each power's `kind.families` is OR'd in.
  - **HELD FOR A CLASSIFIER ADDED LATER** by two things:
    - one leaf (`facts/powerKind.js`: `powerKindOf(p)` and the writer's `kindFromName(name)`);
    - a `tests/architecture` walker. Any regex or name-table read of a power's `.faction` or `.name` outside the leaf goes
      red, unless it is listed EXEMPT with a reason. The identity reads (the door id, the name shields, the cascade) are
      EXEMPT. This is the repo's own idiom (K2-2's `name-lookup` row).
  - **ITS LIMIT, TO NAME (the cost of not carrying the name):** a classifier added later has no stored verdict on a town
    renamed before it landed, so it re-classes there by the new name. Only a private copy of the old name could back-fill
    it. I do not recommend a second field for that.
- **A5. The door id stays on the name, but name BOTH stored references it re-deals, and hold the second.**
  - (i) `simulationTrace[].targetId`: owner-only (`publicSafe.js:58` strips it); `explainFaction` loses the trace's causes
    (`explanation.js:410-418`).
  - (ii) **THE SHARE VEIL's STORED DELTAS.**
    - What they are: `card:faction:faction.<slug>` and `field:faction:faction.<slug>:<field>` (`galleryVeil.js:191`).
    - Where they live: in the save row's `gallery_member_overrides`, outside the record, so the measure's walk of the
      record could not see them.
    - CONFIRMED on today's code: a DM's hide of the ruling power's description stops hiding after the rename on **59 of 60**
      towns (the description is back on the shared page).
    - THE RULE: a security row. The rename must carry those addresses to the new slug, or the share lane rules it, before
      K3's proof can claim "veil verdicts 0".
    - Keying the door id on the old name does not cure it: the veil runs after `toPublicSafe`, on the served shape
      (`gallery.js:865`, `curateModelFor` over `galleryPayloadFor`).

## (1) Is the fault real as measured? CONFIRMED in kind; the rate is a small-place rate

**The run** (my harness, appendix; product writer `applyFactionRenameToSettlement` on the GOVERNING power, as `renameFactionImpl`
calls it):
- the sample: 30 C and 30 V births, every 30th row of each plan, so all six sizes;
- what moved: the ruler kind on **16 of 30 and 19 of 30**, identically on the owner's record and the served record
  (`projectShareVeil(toPublicSafe(t))`). The moves: elder to council 26, lord to council 6, mayor to council 3.
- The rename rewrote `powerStructure.government` on 60 of 60. `government` equals the governing name at birth on 60 of 60.

**By size** (C and V together, 10 towns each):

| thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|
| 10 of 10 | 10 of 10 | 10 of 10 | 3 of 10 | 1 of 10 | 1 of 10 |

**Three printed lines that move** (Daily Life, beyond the name):

| town | before | after |
|---|---|---|
| C dp-thorp-30 | "Matters of any weight are talked over at the elder's door, where people gather of an evening." | "Where the water is drawn is where people meet and pass on their news." |
| V dp-village-0 | "People stop at the elder's door at first light, and the day's work is talked over there." | "The first grain of the day is carried to the mill at first light." |
| V dp-hamlet-90 | "People bring their complaints to the Headman's Authority and expect little to come of them." | "People say the council is slow to listen and quick to decide without them." |

**The count (279 and 288 of 300) is right in kind, wrong as a rate:**
- the plans are sorted by size, so "the first 300" of each is 150 thorps and 150 hamlets, not "every size" as the measure
  says;
- the 40-of-60 shared-page count is thorps only.

**The measure's "0 archetype changes" is a sampling artifact.** A village "Elected Reeve" holds `category: 'other'`, which
`CATEGORY_MAP` does not map (`factionArchetypes.js:54`). So `factionArchetype` falls to the name and moves government to
other on the rename: 1 of 30 per corpus (C dp-village-90, V dp-village-120). The name fallback IS reached by born powers.

## (2) Is `kindName` the right shape? No. The stored kind is (A1 to A5)

**(a) Not rewriting `government`.** It came in with b89a2025b (2026-07-28, faction-rename #14): the converged cascade's
whole-blob census listed `government` as a key surface, "the government TYPE, which at generation equals the governing
name"; `transferRulingPower` keeps the two in step.
- **For:** it is the smallest cure of the ruler kind alone, and coup-correct by construction (the coup rewrites `government`).
- **Against:**
  - it carries the old name to every reader: `government` travels and prints (the gallery tile `lib/gallery.js:703`, the
    share image `lib/shareImage.js:73`);
  - it cures neither `familiesHeldOf` nor the archetype fallback.
- Not recommended.

**(b) Storing the verdicts.** The smallest that holds both pages equal, and the safest under the veil, as amended.

**(c) A stable id.**
- Born powers hold none: CONFIRMED 0 of 220 powers on the 60 towns, every size.
- A DM's ADD_FACTION power holds `faction.<slug of its first name>` (`mutateEntities.js:409-412`), which already carries a DM
  power's first name to readers.
- An id is an identity, not a kind, and minting one at birth moves every record.

**Which survives a classifier added next month:**
- only a carried NAME does fully;
- the stored kind survives it through the A4 leaf and walker, with the named limit (a town renamed before the classifier
  re-classes on that classifier alone).

## (3) The served record and the shared page

**If the name never travels** (CONFIRMED for the ruler kind):
- `rulerKindOf` on the served record moves exactly as on the owner's;
- under K3-1 the owner reads elder and the reader council, on the same 35 of 60 towns.
- The builder's other live readers (`factionArchetype`, `familiesHeldOf`, `stressPowerRowOf`, the door-id mint) are
  PLAUSIBLE here, by their instrumented run.

**If it traveled:** a reader learns the power's first name. That can be the hidden thing: a DM's rename made before the
first share is often the concealment.

**Which is right, under the bar "not inferable":** the kind travels, the name does not.

**Also unnamed by K3-1's condition (2):** an owner-only field needs a new token in `PRIVATE_KEY_RE` AND its SQL twin
`_gallery_sanitize_public_json` (pinned character-identical to the client). That twin is a migration, the owner's hand.
Until it lands, the server sends the field on every public read and every gallery import.

## (4) Persistence: CONFIRMED, no owner path drops a new field on a power

**Executed, both `kindName` and `kind` survive:**
- `normalizeSettlement`, `migrateSettlementToLatest`, `admitSavedSettlementEntries` (the cache), a JSON round trip: 60 of 60;
- `lib/saves.js :: admitSupabaseSavedSettlementRows` (the cloud's admit): 1 of 1;
- `toPublicSafe` plus the veil: 60 of 60 (so an owner-only field leaks today).

**PLAUSIBLE, by reading:**
- `persistProjection.js :: partializeStoreState` carries the settlement whole.
- The owner's gallery import, `import_gallery_dossier` (migration 131), returns the SANITIZED copy. So a denylisted
  `kindName` is dropped on the owner's own import, a path condition (5) misses; `kind` survives it.
- Not executed: the account JSON import (`accountImport.js`).

## (5) Interactions

| case | how it comes out |
|---|---|
| A coup | Wrong without A3 (CONFIRMED, above). |
| A merge or a split | No product action exists (only ADD_FACTION, by grep): nothing to rule. |
| A second and a third rename | "Only where absent" keeps the first, by construction. |
| A rename back | The page is as before. The record keeps the field. |
| The DM's edits ledger | The snapshot undo restores the whole record, the field with it (PLAUSIBLE). |
| An old town (renamed before K3) | No kind, so it reads as today: already re-classed, and it stays so. Nothing recovers the born name except the birth's trace slugs and the version history. Name it; build nothing. |
| Stored door references | A5. |

## (6) What the ruling misses or gets wrong

- A2: the birth calls the writer.
- A3: the coup's spread.
- A4: "first" is the wrong order.
- A5: the veil's stored addresses. A rename lifts a DM's hide today, and the measure's walk could not see it.
- The measure's samples are the smallest sizes only.
- The archetype fallback is reached by born powers.
- An owner-only field needs a server migration.
- Condition (3)'s "veil verdicts 0" cannot hold until A5 is ruled.

## Notes: how it was run (scratch, not pushed)

**The build and the run:**
- The harness is bundled with a copy of the builder's `build-k3m.mjs`, with its two log plugins off and the entry made
  absolute, against 842bff96a.
- It runs in plain node with no DOM, on the rmeasure plans `plan-C.json` and `plan-V.json` (every 30th row, 30 each).

**Per town:**
- the governing power is renamed "The Ashen Compact" by `applyFactionRenameToSettlement`;
- `rulerKindOf` is read on the owner's record and on `projectShareVeil(toPublicSafe(t, { full: false }), writeShareVeil(null, []))`;
- the Daily Life slots are compared after the old name is put to the new;
- for the coup, `kindName` and `kind` are planted on the renamed seat, then `transferRulingPower(t, <first visible rival of
  another archetype>, { cause: 'coup' })`;
- for the veil, the delta `field:faction:<factionIdFromName(old)>:description` is hidden through `writeShareVeil`, and the
  served copy is projected before and after the rename;
- the persistence paths are as in (4).

## Appendix: the harness (`k3r.jsx`; bundle: the builder's `build-k3m.mjs` with `entryPoints: [resolve(argv[4])]`, `plugins: [plugin]`)

```js
// RULING READER K3: plain-node measure, no DOM. One line per birth (jsonl).
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { applyFactionRenameToSettlement } from 'TREE/src/domain/factionRename.js';
import { rulerKindOf } from 'TREE/src/domain/facts/rulerKind.js';
import { governingFactionOf, transferRulingPower, nameOf } from 'TREE/src/domain/rulingPower.js';
import { factionArchetype } from 'TREE/src/domain/factionArchetypes.js';
import { toPublicSafe } from 'TREE/src/domain/display/publicSafe.js';
import { projectShareVeil, writeShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { normalizeSettlement } from 'TREE/src/domain/normalizeSettlement.js';
import { migrateSettlementToLatest } from 'TREE/src/domain/settlementMigrations.js';
import { admitSavedSettlementEntries } from 'TREE/src/lib/saveAdmission.js';
import { buildPrintProse } from 'TREE/src/domain/display/stateProse/printProse.js';
import { deriveDailyLifeSlot, DAILY_LIFE_PAGE_SLOTS } from 'TREE/src/domain/dailyLife.js';
import { factionIdFromName } from 'TREE/src/lib/entities.js';
import { appendFileSync } from 'node:fs';

const NEU = 'The Ashen Compact';
const clone = (v) => JSON.parse(JSON.stringify(v));
const split = (s) => String(s || '').split(/\n+/).map((l) => l.trim()).filter(Boolean);
function lines(t) {
  const out = [];
  const nz = normalizeSettlement(t);
  try { const walk = (v) => { if (typeof v === 'string') out.push(...split(v)); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }; walk(buildPrintProse(nz, {})); } catch (e) { out.push(`[ERR print ${String(e).slice(0, 80)}]`); }
  try { for (const k of DAILY_LIFE_PAGE_SLOTS) out.push(`DL ${k}: ${deriveDailyLifeSlot(k, nz)?.text || ''}`); } catch (e) { out.push(`[ERR dl ${String(e).slice(0, 80)}]`); }
  return out;
}
const served = (t, ov) => projectShareVeil(toPublicSafe(t, { full: false, memberOverrides: null }), ov ?? writeShareVeil(null, []));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const g = governingFactionOf(born);
      const old = g ? nameOf(g) : null;
      const facs = born.powerStructure?.factions || [];
      line = { seed: row.seed, old, gov: born.powerStructure?.government ?? null, powers: facs.length, ids: facs.filter((f) => f && f.id != null).length,
        militaryParty: facs.some((f) => (f?.faction || f?.name) === 'Military Party') };
      if (!old) { appendFileSync(out, `${JSON.stringify({ ...line, skip: 'no governing' })}\n`); continue; }
      // (1) the product's writer, as renameFactionImpl calls it inside its producer
      const r = clone(born); const res = applyFactionRenameToSettlement(r, old, NEU);
      line.touchedGov = res.touched.includes('powerStructure.government');
      line.kind = [rulerKindOf(born), rulerKindOf(r)];
      line.kindServed = [rulerKindOf(served(born)), rulerKindOf(served(r))];
      line.arch = [factionArchetype(g), factionArchetype(governingFactionOf(r))];
      const A = lines(born); const B = new Set(lines(r));
      const re = new RegExp(`\\b(the )?${esc(old)}\\b`, 'gi');
      const sub = (l) => l.replace(re, NEU).replace(/\bthe The\b/g, 'The');
      const mapped = new Set(A.map(sub));
      line.moved = [...B].filter((l) => !mapped.has(l) && !mapped.has(l.replace(/\bThe Ashen/g, 'the Ashen')));
      line.gone = A.filter((l) => !B.has(sub(l)) && !B.has(sub(l).replace(/\bThe Ashen/g, 'the Ashen'))).slice(0, 8);
      const nb = normalizeSettlement(born); const nr = normalizeSettlement(r); line.dl = [];
      for (const s of DAILY_LIFE_PAGE_SLOTS) { const a = String(deriveDailyLifeSlot(s, nb)?.text || ''); const b = String(deriveDailyLifeSlot(s, nr)?.text || ''); const as = sub(a); if (as !== b && as.replace(/\bThe Ashen/g, 'the Ashen') !== b) line.dl.push({ slot: s, before: a, after: b }); }
      // (5) a coup on the renamed town, with the ruling's kindName and the builder's kind planted on the renamed row
      const k = clone(r); const kg = governingFactionOf(k);
      kg.kindName = old; kg.kind = { ruler: rulerKindOf(born), archetype: factionArchetype(g) };
      const rivals = (k.powerStructure.factions || []).filter((f) => f && f !== kg && factionArchetype(f) !== factionArchetype(g) && !f.hidden);
      if (rivals.length) {
        const winner = rivals[0];
        const co = transferRulingPower(k, nameOf(winner), { cause: 'coup' });
        const seat = governingFactionOf(co.settlement);
        line.coup = co.error ? { error: co.error } : { winner: nameOf(winner), winnerArch: factionArchetype(winner), seatName: nameOf(seat), seatCategory: seat.category,
          seatKeepsKindName: seat.kindName ?? null, seatKeepsKind: seat.kind ?? null,
          rulerByGovernment: rulerKindOf(co.settlement), rulerByKindName: rulerKindOf({ powerStructure: { government: seat.kindName ?? nameOf(seat) } }),
          archByCategory: factionArchetype(seat), archByStoredKind: seat.kind?.archetype ?? null };
      }
      // (5) the veil's stored address: hide the ruling power's description by the door id minted from its name
      const desc0 = g.desc || g.description;
      if (desc0) {
        const addr = `field:faction:${factionIdFromName(old)}:description`;
        const ov = writeShareVeil(null, [{ address: addr, hidden: true }]);
        const gp = (t) => (served(t, ov).powerStructure?.factions || []).find((f) => f?.isGoverning);
        const before = gp(born); const after = gp(r);
        line.veil = { addr, hiddenBeforeRename: !(before?.desc || before?.description), hiddenAfterRename: !(after?.desc || after?.description) };
      }
      // (4) a new field on a power through the owner paths
      const p = clone(r); const pg = governingFactionOf(p); pg.kindName = old; pg.kind = { ruler: 'elder' };
      const keep = (t) => { const f = governingFactionOf(t) || (t?.powerStructure?.factions || []).find((x) => nameOf(x) === NEU); return [f?.kindName ?? null, f?.kind ?? null]; };
      const ad = admitSavedSettlementEntries([{ id: 's1', name: p.name, settlement: clone(p) }], { source: 'saved-settlement-cache' });
      line.persist = { normalize: keep(normalizeSettlement(clone(p))), migrate: keep(migrateSettlementToLatest(clone(p))?.settlement ?? migrateSettlementToLatest(clone(p))),
        admit: keep(ad.entries?.[0]?.settlement), json: keep(JSON.parse(JSON.stringify(p))), publicSafe: keep(served(p)) };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 900) }; }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
```
