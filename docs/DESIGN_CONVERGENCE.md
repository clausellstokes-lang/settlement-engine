# DESIGN — CONVERGENCE (many banners, one field: intervention, the multi-sided law, and the reactive art of war)
## Fable 5 architecture, 2026-07-15 — owner-commissioned across four messages (intervention in internal contests; counterforce resolves as battle with the loser retreating; the N-sided pushback "you are thinking in binary — what if a third party is there to conquer?"; reactive awareness of allied/enemy deployments + multi-army sieges and their aftermaths). Grounded by a dedicated recon of the coup kernel, the deployment/battle machinery, and six coupling substrates (report: the W-INTERVENTION grounding, 2026-07-15).
### Companions: DESIGN_PEACE_ENGINE (term catalog + reasons), DESIGN_SETTLEMENT_POLITICS (the internal contests), DESIGN_CORRUPTION_WEB (grip + sponsorship), DESIGN_NAVY (the sea half — freezes separately). Builds as W-CONVERGENCE before W-COMPOSER-2 (its verbs join the realm manifest lift).

## 0. THE THREE OWNER LAWS THIS DESIGN SERVES

1. **Foreign armies may join a settlement's INTERNAL contest on either side** — empire-retention,
   regime-change, investment-protection, kinship, denial.
2. **Counterforce resolves as battle**: "the ending results in the same as though a battle
   happened and the loser retreats" — the existing collision semantics, verbatim, then the
   survivor tilts the contest.
3. **NO BINARY THINKING**: sides are aim-groups, and three-plus genuinely rivalrous sides
   (two empires racing to conquer + one defender) must be first-class — rivals never merge.

## 1. THE MULTI-SIDED CONVERGENCE LAW (the wave's constitution)

**Sides are AIM-GROUPS**: a side = the set of forces that would accept the same outcome —
{defender + its relief}, {empire A + its compelled allies}, {empire B + co-besiegers},
{challenger-backers}, {incumbent-backers}. Membership derives from war aims + alliance/treaty
state + contest side; two mutually-hostile besiegers NEVER aggregate. Within a side, strength
aggregates by the existing coalition-share math.

**Resolution is STRATEGIC ENGAGEMENT SELECTION, sequential across ticks — never a fake
simultaneous melee.** Each tick, every present side's EV chooses engage-whom-now / hold /
screen / withdraw, §H-loaded by relative BELIEVED strengths (fog applies — `fought_blind` is
live), exhaustion, patience, siege progress, and the emergent incentive the law produces free:
**THE VULTURE DYNAMIC** — engagement costs attrition, so while two rivals grind, the strongest
third side's highest-EV move is often HOLD (growing relatively stronger), receipted as such
("Thornwall held its banners — better the rivals bleed"). The tick's chosen engagement resolves
PAIRWISE through the existing machinery (owner law 2): `resolveFieldBattle` for field meetings
(pure sigmoid, fork `battle:<a>:<b>:<tick>`), `resolveSiegeVerdict` for walls. The loser's
column takes the bounded mauling and retreats home via the standing RETREAT semantics
(`recalled:{cause:'field_battle_retreat'}` → the withdrawal homecoming — the recon-confirmed
reuse surface). Aftermath states persist per side across ticks: `besieging`, `holding`,
`screening`, `attrited` (with a re-engagement dwell — bloodied armies don't immediately
re-collide), `retreated`, and — on overstay after victory — the OCCUPATION transition
(extend `freshConquestsFrom` to read a typed intervention/conquest outcome).

**Prize rivalry is a typed war reason BETWEEN conquerors** (two empires racing for one city are
minting their next war), and a rival arriving as a city falls may CONTEST the occupation.

## 2. INTERVENTION (the flagship case)

**Definition:** a deployment with `role:'intervene'` + a SIDE (`incumbent`|`challenger`) that
may only join a LIVE internal contest. Recon truth: the only verdict-bearing contest window
today is the `coup_detat` stressor (birth → brewing → `resolveCoupVerdict` at resolution) —
**wave 1 is coup-scoped**, with two seams: rebellion (no verdict kernel exists — typed seam;
a rebellion verdict sibling is a later decision) and the occupation-uprising path (tiltable
via the same shape when its wave comes). The engine already stamps a coup's hostile-neighbor
`sponsorSettlementId` as NARRATIVE — this wave gives that sponsorship physics.

**The tilt (the recon's exact seam):** `resolveCoupVerdict` gains `interventionAdj` — a THIRD
signed bounded additive term into `pHold`, precisely the `warSentimentAdj` precedent (0 when
dark ⇒ byte-identical; the 0.1/0.9 clamp already bounds it), signed by which side the
SURVIVING foreign force backs after the convergence law resolves any counterforce.
Foreign-vs-foreign resolves FIRST (§1), then the survivor tilts.

**The motive catalog (typed, receipted, all recon-verified computable):**
`preserve_order` (foreignGripOf ≥ threshold, or a tribute/vassal/compelled-alliance treaty
with the incumbent — THE EMPIRE-RETENTION VERB); `install_friendlier_regime` (hostile edge +
challenger quadrant/lens affinity, or a corruption leash on the challenger faction — the
puppet path made kinetic; paid eyes mean the patron SEES the coup brewing); `protect_investment`
(live obligations — your debtor's regime; trade dependence; a compelled-alliance term
OBLIGING you); `kinship` (§G ties to one side's people); `denial` (counter-intervention).

**Risk integration (the frameworks, verbatim):** the §3 time-discount (arriving after the
verdict = marching to yesterday's coup — a real, priced failure); the feasibility gate against
the opposed side + potential counter-interveners; overextension (the −14 home-defense penalty
already prices an absent army; occupation burden stacks); THE INVITED/UNINVITED ASYMMETRY —
propping an incumbent at request is legitimacy-cheap; backing rebels is casus-generative and
raises the whole region's encirclement read of the intervener (interventionism makes neighbors
arm). E0-classed rarity via the ramped loaded-dice idiom (`p = BASE × pull²`, cap-held,
deferral visible); drama class = `war` (the registry walker forces the naming — JUDGMENT,
vetoable: war over succession_coup, since the ACT is a foreign military operation).

**Consequences (equal-and-opposite):** success-for-challengers → the installed regime OWES —
an obligation mint with `kind:'intervention'` and leverage-weighted magnitude (the predatory-
patron idiom; the recon confirms the kind-parameterized API needs no schema change), which the
corruption web then reads (client → puppet drift); plus losers' people-held grievance +
neighbors' fear. Success-for-incumbents → treaty/grip deepens (empire maintenance). Failure →
the winners' lasting casus + the intervener's credibility/legitimacy price. A sponsors' clash
mints `foreign_clash` BETWEEN the sponsors — **proxy stays proxy**: never an auto-declared
war; the reasons machinery decides escalation (JUDGMENT, vetoable).

## 3. THE REACTIVE ART OF WAR (the awareness upgrade)

Militaries already SEE through fog (believed strengths everywhere; covert postures; SEE/HIDE
live). What's new: **deployments become loud facts** — a marching column enters the rumor
machinery like any news (degradable, corroborable, and — via the information engine — FAKEABLE:
the phantom column becomes possible with zero new machinery), and the strategy EV gains three
typed REACTIVE moves, each consuming BELIEVED enemy/ally deployments:
- **REINFORCE** — march to a treaty-ally under siege (the relief column; compelled-alliance and
  mutual-defense terms get their kinetic teeth; the transit layer's existing REINFORCEMENT role
  + the allyDefense machinery are the seed);
- **INTERCEPT** — move against a believed column before it arrives (spatial worlds: the transit
  hostility-predicate extension; see §4);
- **COUNTER-INTERVENE** — the denial motive, §2.
Each is §H-loaded, authority-routed, and receipted with the believed fact it reacted to
("word came of banners on the north road — the muster answered a rumor," true or not).

## 4. MECHANICS DECISIONS (recon-grounded, each vetoable)

- **Dual-mode counterforce resolution:** `resolveFieldBattle` is pure and aspatial-callable —
  aspatial worlds resolve intervener-vs-intervener as a DIRECT battle (no transit); spatial
  worlds get true column collisions by extending the transit kernel's hostility predicate
  (the sanctioned M9 seam at kernel L90-101: add "opposing sides of the same contest") — the
  geometry already supports two forces meeting at a third settlement.
- **The one-army law stands:** an intervener occupies its single `deployments[homeId]` slot —
  a settlement cannot besiege AND intervene (correct physics). The wave AUDITS role readers
  (`occupierStillPresent` et al. assume `role:'siege'`) for the new `intervene` role.
- **Authority plumbing:** new candidateType `intervention_ordered` joins
  CAMPAIGN_ALTERING_CANDIDATE_TYPES + `isActorInitiatedMajorType` + a CHANGE_AUTHORITY_POLICY
  entry (contract-tested) + `pendingActorMajorFor` dedup + the deploy-residue discipline for
  suppressed proposals.
- **Reasons bijection honored:** `foreign_clash` (war) lands WITH its peace mirror
  `spheres_understanding` (sponsors settling zones of influence — the mutual-disengagement
  ground) in the same change, or the mirror walker reds.
- **The term catalog gains `non_intervention`** in a NEW family `'sovereignty'` (JUDGMENT:
  security-family would make it mutually exclusive with non_aggression under one-per-family
  stacking; historically they are distinct demands — vetoable).
- **RNG discipline:** intervention mints use stable fork keys (`intervene:<target>:<tick>`)
  and preserve existing draw order (the M9d siege pins are tripwires).
- **Dormancy:** virtual `interventionEnabled` AND the war-gate family (no
  DEFAULT_SIMULATION_RULES entry — the settlementPolitics idiom); immediate no-op when dark;
  fenced dormancy golden pre-captured; the recon's full tripwire list (statefulArmies,
  siegeTermination, warInitiateResolveSplit.m9d, actorMajorApproval, occupation, z2Homeostasis,
  the three walkers) runs after every substantive change.

## 5. LEGIBILITY
Interventions carry their typed motive in every receipt; the chronicle narrates sides and the
vulture's patience; the irony brief renders sponsor beliefs ("both patrons believe their
claimant is winning"); treaty documents render non-intervention clauses and their strain; the
war-faith dossier tab shows a contested settlement's FIELD (every side present, its aim, its
state) — the aftermath states are display-ready by construction.

## 6. PINS (the build's proof set)
Dormancy byte-identity; the warSentimentAdj-precedent pin (interventionAdj = 0 ⇒ byte-identical
verdicts); coup-tilt directionality (survivor-for-incumbent raises pHold, for-challenger lowers,
both bounded); counterforce-resolves-first ordering; loser-retreats reuse (the recalled
homecoming, no disposition delta beyond the battle's); THE VULTURE PIN (three sides, two
engaged: the third's hold-EV exceeds engage-EV while grinding continues — with the receipt);
rivals-never-merge (two hostile besiegers of one target never aggregate); relief-lifts-siege
(a reinforced defense flips a marginal siege verdict — compelled alliance honored kinetically);
invited-vs-uninvited legitimacy asymmetry; installed-regime-owes (the obligation mint with
leverage weighting); proxy-stays-proxy (foreign_clash minted, no auto-war); prize-rivalry casus
between conquerors; occupation-on-overstay; phantom-column reactivity (a FALSE believed
deployment triggers a priced reaction — the information war meets the shooting war); aftermath
dwell (attrited sides don't re-engage within the hysteresis window).

## 7. SEQUENCING
One wave, W-CONVERGENCE, before W-COMPOSER-2 (its verbs — ORDER_INTERVENTION with side +
invited dials, REINFORCE/INTERCEPT — ship registrable-shape; the realm manifest lift takes
them with the peace/doctrine verbs). W-NAVY (the sea half: convoys, sea battles, the
speed-vs-catastrophe tradeoff) freezes separately on its recon and builds immediately after —
its convoys plug into THIS design's movement layer without touching the convergence law.
Rebellion-verdict and occupation-uprising tilts are typed seams for a later owner call.
