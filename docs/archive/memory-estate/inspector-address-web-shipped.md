---
name: inspector-address-web-shipped
description: "INSPECTOR-ADDRESS-WEB lane (owner 2026-07-22) — THE NEWS ADDRESS LAW applied realm-wide: every Realm Inspector subject renders as its linked address chain (settlement>power>faction>npc) with cross-settlement nav; the realm entity resolver + the record-gap census"
metadata:
  node_type: memory
  type: project
  date: 2026-07-22
  branch: claude/inspector-address-web
  base: claude/composite-r4 @ 1265a83d
  commits: d623bf26 (engine+nav+E-A) + a62c409c (surface renders) + 0d0508d2 (settlement-chronicle follow-on)
  tags: [inspector, entity-links, address-law, cross-settlement-nav, faction-key, record-gap, realm-inspector]
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T17:11:03.122Z
---

# INSPECTOR-ADDRESS-WEB lane (owner order 2026-07-22)

Owner: a Realm Inspector news item ("Abir ibn Jubayr changes ambitions") "should
have a link embedded that leads us to Abir's NPC card in his settlement's dossier.
This should be emulated for ALL things in the realm inspector." = [[news-address-law]]
applied to every inspector surface, with cross-settlement EntityLinks. SHIPPED off
1265a83d. Owner ask fully met where the record carries the subject id; the rest is a
sized RECORD-GAP (below).

## THE ENGINE (commit d623bf26)
- `src/domain/dossier/realmEntityWeb.js` — the realm-scoped resolver (pure, lazy,
  HEADLESS: F29 layer-clean). `buildRealmEntityWeb(savedSettlements)` →
  resolveNpc / resolveFaction / resolveSettlement / resolveSubject. Extends the
  per-dossier `buildDossierEntityIndex` (one settlement) to the whole realm.
  Lazily indexes a settlement only on first resolve (cached). Returns an ordered
  `ChainLevel[]` (settlement>power>faction>npc), each with the dossier-index id
  the navigator focuses.
- Render/nav layer: `RealmEntityContext.jsx` + `useRealmEntityNav.js` +
  `primitives/RealmEntityLink.jsx` + `map/AddressChain.jsx` (AddressChain +
  AffectedSettlements). Provider given ONCE at RealmInspector body (clear of the
  oracle-section region) and ONCE in OutputContainer (for the dossier Chronicle).
- `dossier/useCrossSettlementFocus.js` (OutputContainer): the destination dossier
  switches to the focused entity's tab + scrolls its anchor on mount.

## ⚠️ THE ID-JOIN (the faction-key defect class — the join hazard)
The inspector viewmodels carry SETTLEMENT-PREFIXED pulse ids; the dossier index
keys entities WITHOUT the prefix and with a DIFFERENT slugger. The join must
recompute the pulse id per entity (never strip-and-compare):
- Pulse `npcId` = `${saveId}:${npc.id || stablePart(name)}` (npcAgency.js:193).
- Pulse `factionId` = `${saveId}:${stablePart(faction.id||faction.faction||name)}`
  (factionCompetition.js:84 — MODULE-PRIVATE, so it MUST be replicated).
- Dossier index npc id = `npc.id || slugifyEntity(name)` (hyphen); faction id =
  `factionIdFromName(name)` = `faction.<snakeCase>`.
The resolver replicates both pulse formulas via the `stablePart` LEAF (dependency-
free, keeps the lazy chunk lean) and PARITY-PINS `realmNpcPulseId` == canonical
`npcId` in tests/domain/dossier/realmEntityWeb.test.js. npc→faction ALWAYS via
`npcInFaction(npc, faction, ladderFactionKey(faction))`; power via
`governingFactionOf`; names via `nameOf`. NEVER a prose/name-string scan.

## THE ADDRESS-CHAIN RENDER DECISIONS (vetoable — recorded)
- **power = governingFactionOf(settlement)** (the settlement's ruling seat, a real
  addressable faction), **faction = npcInFaction(npc)** (the npc's own). This is the
  faithful read of the owner's "Jirak's Religious-Authorities' Twin-Towers' Miraak".
- **presence-over-repetition**: power COLLAPSES when it is the same entity as the
  npc's faction; AddressChain has `omitSettlement` for feeds under a settlement heading.
- **DEGRADE, NEVER FABRICATE**: an unresolvable level is DROPPED (the no-fabrication
  invariant). Enforced by the E-A walker + sweep plant (below).
- **subjectless events** (plague/trade collapse) resolve to just the settlement level.

## ⚠️ THE RECORD-GAP CENSUS (the sized owner-gated follow-on — T4/persistence)
Which inspector records structurally carry the subject id vs only prose:
- **Settlements: id-backed EVERYWHERE** → linked on all 6 surfaces (the broad win).
- **NPCs: id-backed ONLY in WorldPulsePanel outcomes** (`npcId`, was unused) + the
  settlementWorldChronicle address block → the full subject chain works there.
- **Wizard News subject = RECORD-GAP** (the owner's exact example). The normalized
  wizardNews entry (region/wizardNews.js normalizeEntry) drops the actor id — the
  subject lives ONLY in the `headline` prose. Its settlementIds ARE linked; the
  subject is NOT (never a prose scan). FIX = thread npcId/factionId onto the
  wizardNews entry through normalizeEntry (persisted-shape change, owner-gated).
- **Chronicler's Letter = HARD record-gap** — LetterLine drops even settlementIds
  (chroniclersLetter.js). Would need the composer reshaped.
- **Faction/institution by NAME in WorldPulse** (`factionName`/`institutionName`, no
  id): faction is resolvable via (settlementId + factionName→factionIdFromName)
  scoped to the outcome's settlement (structured, NOT prose); institutions have no
  realm anchor (the dossier-web compendium half is still blocked).

## SURFACES WIRED (commit a62c409c + 0d0508d2)
WorldPulsePanel (full chain + affected), WizardNewsPanel (affected only; subject
gap), LiveWarStatus + RealmIntrigue + RealmDashboard (settlement links via a
non-invasive affordance below the prose heading — keeps authored copy off the
voice census), settlement dossier ChronicleTab (full chain + affected — the
autoresolve follow-on). ⚠️ Cross-settlement nav uses `navigate('settlements',
{params:{id}})` (the /settlements/:id route effect switches the dossier even when
one is open — the selectedSettlementId watcher's `!detail` guard would NOT).

## ⚠️ HAZARDS / how-to-apply
- **tinted-callout ratchet** (tests/design/deepCraftKillList.test.js): counts lines
  matching `/…_BG|successBg|dangerBg|infoBg|warningBg/`, ceiling 163, SHRINK-ONLY. A
  new `background: GOLD_BG` tripped it (fixed → border-only). NEVER add a tinted-wash
  background token; use the flat border/clerk-note idiom.
- Closure: the whole layer rides LAZY chunks (inspector panels + lazy OutputContainer)
  — verified NO eager consumer. First-paint closure = **1,039,859 (Δ -9 vs 1,039,868,
  141 B under the 1,040,000 ratchet)**. If a link component ever gets an eager
  importer, module-split.
- E-A: `tests/lint/realmEntityWebNoFabrication.walker.test.js` + sweep plant #36
  "address-web/fabricated faction level" (mutation-sweep.sh) + manifest entry.
  ISOLATION-PROVEN via git-checkout revert (mutated exit 1 / clean exit 0). The plant
  anchor is the literal comment `return null; // no-fabrication: …` in factionOfNpc —
  keep it stable or the perl plant misses.
- settlementWorldChronicle address block gained `affectedSettlementIds` (additive; the
  four-part pin in settlementWorldChronicle.test.js still holds).

## GATE RECEIPTS (CONFIRMED)
tsc 0 · domain-strict 0 (ceiling 0) · eslint 0 · NUL 0 · closure 1,039,859 (Δ<=0) ·
lint/copy/architecture 667 · docs/components/freshness 1027 · ui/dossier-domain 787 ·
store/domain 8351 · security/workers/hooks/integration/edge 1827 (single-threaded) ·
config/design/…/smoke 1367 · property/gen/lib/data/pdf 2396 GREEN + EXACTLY the 4
parked golden families red (goldenViewModel / beliefMapGolden / generatorGoldenMaster
/ worldpulseDeityGolden — assert GENERATION output; this lane touches ZERO generation
files, matches the documented parked baseline). aiGroundingBundle.freshness GREEN.
mutationCoverageManifest GREEN. NOT run: tests/perf (owner-placeholder budgets,
display-orthogonal). Owner not pushed/deployed.
