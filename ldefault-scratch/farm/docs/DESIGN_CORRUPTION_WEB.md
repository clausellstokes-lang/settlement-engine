# DESIGN — THE CORRUPTION WEB (the leash generalizes; the effects stay home)
## Fable 5 architecture, 2026-07-14 — owner-ratified ("corruption should no longer just be tied to criminal organizations but to other settlements or to criminal organizations/powers/factions in other settlements... though the mechanics in a single settlement tied to a criminal organization should largely remain the same"). Grounded by a 3-slice read-only recon (effect layer / covert seams / faction-org model).
### Companions: DESIGN_INFORMATION_STATECRAFT (shared covert machinery, credibility), DESIGN_SETTLEMENT_POLITICS (the swing-member target), DESIGN_PEACE_ENGINE (purge clauses, puppet seats), DESIGN_GENEROSITY_ENGINE (evil generosity as on-ramp), COHESION_WEAVE §G (ties as recruitment/leak surface) + §H (loaded dice). Builds in W-DOCTRINE.

## 0. THE RECON'S HEADLINE: the engine already half-believes this design
Corruption is ONE system with three tag surfaces — NPC flags (`corrupt` tri-state,
`corruptionVector`, `corruptTies`), institution impairments (`type:'corruption'`, covert
derived), and the faction capture ladder (none→adversarial→equilibrium→corrupted→capture) —
and the EFFECTS ARE ALREADY LEASH-AGNOSTIC: watch-drag, capture climb, guild strength, agency
boosts all key off `npc.corrupt`, never off who holds the leash. Better: **the foreign leash
already ships** — betrayal stressors seed a traitor with
`corruptTies.foreignPatron = sponsorSettlementId` and a conspiracy variant — but `foreignPatron`
is WRITE-ONLY, read nowhere. This design is, precisely: give `foreignPatron` its reads, name the
beneficiary properly, and route the consequences. The owner's constraint (local mechanics
unchanged) is simultaneously the correct engineering: nothing in the effect layer moves.

## 1. THE LEASH MODEL (one typed beneficiary, one resolver)
`corruptTies` (already an open object) gains a normalized **`leash`**:
`{ kind: 'local_org' | 'foreign_settlement' | 'foreign_faction' | 'foreign_org' | 'cutout',
   settlementId?, factionName?, viaLocalOrg?, covert: true }`.
- **Absent ⇒ derived-as-local** from the existing `criminalInstitution` name (dormancy: every
  existing world reads back byte-identically; no migration; regen/undo coverage is automatic —
  the leash rides the same NPC-subtree snapshots IMPOSE/EXPOSE already take).
- **Settlement endpoints are campaign save ids** (resolvable realm-wide today — the
  occupation/neighbourNetwork/regionalGraph id space). **Faction endpoints are name-keyed**
  (factions have no stable ids) and inherit rename/coup fragility — the pruneFactionStates
  grace-window precedent applies; a dangling faction leash degrades to its settlement.
- **THE RESOLVER CHOKEPOINT:** today the leash-holder is a raw name string fuzzy-matched in ≥4
  independent sites (nameMatches, matchByName, sustainingInstitution, severCorruptionTiesTo).
  The build's first move is ONE `resolveLeash(npc, settlement, worldState)` consumed by all
  four — the single-writer cure for the seam the recon called the generalization pressure
  point. Local behavior through the resolver is pinned byte-identical.
- **THE CUTOUT IS NEARLY FREE:** `kind:'cutout'` keeps `criminalInstitution` = the local org, so
  every existing mechanic (onset gate, impairments, capture, sever, composer UI) runs untouched
  — the beneficiary is an annotation the local machinery never reads. Exposure must surface the
  lineage TWICE (local org first; the patron only via the second-hop rumor lineage) — "we
  caught the thieves, but who paid them?" is the mechanically default outcome.

## 2. CREATION — how a foreign leash comes to exist (scarcity as LAW)
Foreign onset does NOT relax the local-infrastructure gate; it replaces it with a **channel
requirement** — a hostile/rival edge (stressorDynamics already resolves sponsors from hostile
edges), a criminal_network link / criminal_corridor channel, an active smuggle path, or a §G
named tie into the target. No channel, no leash. Then the law the owner ratified:
**rare, expensive, slow** — at most ONE live foreign asset per (patron, target) pair, a small
realm-wide cap per patron, meaningful upkeep (coin + exposure heat), E0 drama-classed
initiation (deferral-not-denial), all seeded via the loaded-dice law (the weights: interest
against the target, channel quality, target's court division per DESIGN_SETTLEMENT_POLITICS,
official-pay posture, HIDE posture). The seedBetrayalTraitor deterministic-pick pattern
(importance rank, codepoint tiebreak, covert, no news) is the template. Evil generosity is the
narrative on-ramp: the E1 obligation ledger (gifts that indebt) is a channel-quality multiplier
— the patron who has been "generous" for a decade recruits cheap.

## 3. WHAT A FOREIGN ASSET DOES (the one new effect, bounded)
Local effects stay local (the owner's constraint): the compromised captain still drags the
watch, still climbs capture pressure — the settlement rots the same way regardless of the
leash. The ONE new effect is **direction**: a foreign-leashed asset loads its settlement's
decision weights toward the patron's interest (§H weight-tampering — the covert twin of the
ruling coalition's overt loading; bounded post-sum, clamped, receipted in DM truth only).
Concretely: treaty-posture nudges, war-reluctance against the patron, trade-term softness,
peace-table information leakage (the patron reads the target's beliefs at improved fidelity —
the asset is also PAID EYES, statecraft §2.1, sight plus hand).
**Capture accounting forks by leash:** local-leashed corrupt seats feed thieves-guild strength
exactly as today (byte-identical); foreign-leashed seats instead feed a per-patron
**foreign-grip read** (derived, not persisted beyond the leash itself) that measures
puppet-seat readiness — the mechanism behind W-PEACE's puppet-seat terms and the unnamed
empire's quiet arm. A foreign court's asset strengthening the LOCAL thieves guild — today's
accidental semantics — ends with the fork.

## 4. EXPOSURE — deliberate attribution, and the fog kept honest
The recon found the bug this design retires: the exposure fallback
(`criminalInstitution || climate.criminalInstitutions[0]`) blames the innocent local guild for
a foreign conspirator. Attribution becomes DELIBERATE through the resolver:
- **Local/cutout leash:** today's path, byte-identical (impairments on the tied org + home
  institution; reform machinery unchanged).
- **Foreign leash:** the impairment no-op (currently silent) is replaced by the FOREIGN
  CONSEQUENCE LANE — the blowback triple: people-held grievance against the patron
  (casus-belli class, feeding the war-reasons catalog per the symmetry law), a legitimacy hit
  in BOTH courts (the corrupted court looks rotten; the corrupting court looks villainous), and
  a credibility charge (statecraft §4). The relationship edge takes state damage; treaties
  strain.
- **False attribution becomes a MODELED outcome, never an accident:** what the public believes
  about who paid rides the rumor lineage like everything else — a cutout's first exposure
  names the local org (truthfully, incompletely); the patron surfaces only if the second-hop
  lineage does. The DM's truth block always carries the real leash; the town's belief may be
  wrong, and the dramatic-irony brief renders the gap.
- causeLifecycle's re-adjudicate terminal ("finds a new patron") is the built-in leash
  re-pointing when a holder dies or a patron withdraws — extend its candidate set, not a new
  transition.

## 5. COUNTERPLAY (equal-and-opposite, all costed)
Official-pay posture (raising pay hardens onset/exposure resistance — Venice's policy; a coin
cost against a covert risk), purges (the EXPOSE machinery, now with honest costs: paranoia
pressure, false-accusation risk against the fog, legitimacy hit for admitting rot), the HIDE
posture (statecraft §2.2 degrades the patron's channel quality), tie-audits (§G density is the
leak surface both ways), and severance events: war declaration, a peace PURGE CLAUSE
(W-PEACE term catalog — "dismiss the compromised captain," verified through beliefs like every
term), or the patron's own retreat. severCorruptionTiesTo generalizes through the resolver to
edge/treaty triggers, not just REMOVE_INSTITUTION.

## 6. SEAMS (the recon's sharp edges, honored)
- **Covert naming is load-bearing:** every hidden flag KEEPS the literal name `covert` —
  COVERT_KEY_RE scrubs any key so named from all public world snapshots for free. No synonyms.
- **Beneficiary identity never enters player projections:** publicNpc's allowlist already drops
  every corruption field (auto-safe); the exact-field-list rumor pin stays untouched — the
  leash rides the DM truth block/causeClass channels only; never in content.partyIds (which
  players see rendered as names).
- **The one PLAUSIBLE leak the build must pin:** covert impairment DESCRIPTIONS ride
  `institutions[].impairments` through toPublicSafe (no 'covert' token in PRIVATE_KEY_RE, no
  institution reduction) — the build wave adds the adversarial fixture to runVisibilityAudit +
  a gallery round-trip pin proving covert impairment text never reaches anon surfaces, and
  scrubs/gates it if it does. (Pre-existing exposure, not created by this design — verify
  against base first per the pre-existing-red protocol.)
- **Dual-write discipline:** the leash lives beside `corrupt` on settlement.npcs (authoritative)
  and mirrors through the same ensureNpcStates/mirrorCorruptionOntoSettlement seam — never
  one-sided.
- **Modulator idiom:** every new rate influence is a bounded, centered-on-1.0, post-sum
  multiplier (the deityDisfavor pattern); any genuinely new draw forks on a stable composite
  key (§H). Prose: the capture/exposure headline vocabulary gains leash-aware variants (the
  describeCompromiseConjunction ladder extends; "tied to a foreign patron" replaces the
  hardcoded local-underworld line when the resolver says so).
- **DM verbs:** IMPOSE_CORRUPTION gains the beneficiary picker (EventComposerCorruptionFields —
  local orgs + hostile/known foreign settlements + their named factions); the
  no-op-without-local-org rule holds for local kinds and is replaced by the channel requirement
  for foreign kinds. Undo coverage is automatic (existing snapshots).

## 7. PINS + SOAK
Byte-identity with no foreign leashes present (dormancy; the resolver returns local semantics
for legacy shapes). The cutout leaves every local-path test green untouched. Foreign exposure
produces the triple + edge damage and NO local-org impairment (the innocent-guild pin —
regression-proof against the old fallback). Double-surfacing for cutouts (patron only via
second-hop lineage). Scarcity caps hold under pressure (a patron at cap cannot seed — E0
deferral visible). Foreign-grip read feeds puppet-readiness and NOT thievesGuildStrength (the
fork pin). Covert-impairment text absent from every public projection (the visibilityAudit
fixture). Soak: foreign corruption at story tempo — roughly one revealed foreign asset per
decade per realm neighborhood, not a hum.

## 8. SEQUENCING
Builds in W-DOCTRINE (shared gate + covert machinery with supply-web + information statecraft).
Hooks consumed by hosts: E1 reads §2 (evil-generosity on-ramp), W-PEACE reads §3/§5 (puppet
readiness, purge clauses), SETTLEMENT_POLITICS reads §3 (the swing-member target). The resolver
chokepoint + attribution fix land FIRST inside the wave (they repair current semantics even
before foreign leashes light).
