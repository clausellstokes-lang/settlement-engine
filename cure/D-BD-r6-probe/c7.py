from edit import apply, DOC
R6 = '[CURED 2026-10-19 (fp-final r6) — '
lines = open(DOC, encoding='utf-8').read().split('\n')
race = [l for l in lines if l.startswith('- **The race:** the BODY must SURVIVE the clock')]
assert len(race) == 1
race_new = ("- **The race:** the BODY must SURVIVE the clock — evade the hunt (§9.3, §9.11), keep its supplies (a hostage COSTS: the captive's upkeep on `bodySupply01`, DRAFT), and hold its base — while the court answers week by week. The race's CLOSINGS, THREE WORDS FOR THREE EVENTS (RULINGS-ROUND6 A.1, on the owner's 18:54 word: \"if the gang can survive with teh NPC for long, then they will have the ransom granted, if they are defeated, then the captive goes free\"): **`ransom_granted`** — the body SURVIVED to the clock's end: the automatic resolution PAYS — the court's treasury into the body's supplies (ONE treasury writer, W-COIN; until W-COIN a band step of the court's funding as §9.9's cost) — WHETHER OR NOT the court chose to pay (requirement 24 (b) forces the hand that week; only the DM's DECISION overrides it), or the court PAID EARLY (`pay` at any week ends the race that week, dearer by trust); the captive RETURNS; a DEED on the body's ledger, its notoriety up; **`captive_freed`** — the body was DEFEATED first (a hunt's `snuffed_out` or `driven_off`, a rival body, starvation) — unpaid, the FREER's deed (the warden's, the paragon's, the party's if the DM marks it); **`captive_released`** — NEVER an automatic close: only the body's OWN early release when its supplies can no longer hold the captive (the captor's landed `release`, receipted, notoriety only), or the DM's decision. The court's engine line on the row is the landed `pay · refuse · abandon`: `pay` closes the race early; `refuse` only bargains and delays (the clock runs, and survival still pays at its end); `abandon` writes the captive off at home — the court will not pay, yet the clock's end still grants the ransom unless the DM decides otherwise, and a captive who returns abandoned carries the LANDED grievance `ABANDONMENT_GRIEVANCE_KIND = 'abandoned_to_captivity'` (its first producer for a body's captive) [CURED 2026-10-19 (fp-final r5) — B.7 · BD-r4-4] " + R6 + "A.1 · BD-r5-1 (BLOCKING): B.7's \"AND the court PAID\" made payment a second condition against the owner's word; `captive_released` as the clock's automatic end is STRUCK].")
pairs = [
(race[0], race_new),
("A body arriving at an UNHELD site** → ST's `site_taken`", "A body arriving at an UNHELD site** → ST's `site_taken`"),
]
pairs = [pairs[0]] + [
# §9.2
("plus THE SITES' at-hand keep term (A.1's split) — never `homeDefense` and never a tier rule [CURED 2026-10-19 (fp-final r5) — B.3 · BD-r4-2].",
 "plus THE SITES' at-hand keep term (`siteReadinessOf`'s readiness × `BODY_KEEP_POINTS`, BD14; A.1's split) — never `homeDefense` and never a tier rule [CURED 2026-10-19 (fp-final r5) — B.3 · BD-r4-2] " + R6 + "SEAMS-r5-7 · ST-8]; a hostile flock's `raid` lands only upon the land of a court that curbs or outlaws it (BD14, B.2 — per court) " + R6 + "BD-r5-8]."),
("A PEACEABLE conclave never raids (its prey is converts and alms, through `preach`); a HOSTILE one may",
 "A conclave never raids a court that permits or endows it (there its prey is converts and alms, through `preach`); toward a court that curbs or outlaws it, it may"),
# §9.3
("the prediction is the patrol's town's BELIEF of the body's position (`believedBodies`: its last witnessed act,",
 "the prediction is the patrol's town's BELIEF of the body's position (`believedBodyOf`, §2.4 — its last told act and its court's SIGHTINGS " + R6 + "PR-3]:"),
("a NAMED body only is predicted by name (a nameless one has no belief record, BD23 — the riders ride against the brigandage the town has heard of, its sightings on the country)]",
 "a NAMED body only is predicted by name (a nameless one has no NAMED record, BD23 — the riders ride against the brigandage the town has heard of and the SIGHTINGS its court holds of it, BD23's one exception " + R6 + "ST-2])]"),
# §9.4
("a TIED court clearing a body's den → `site_cleared` as today (the holder ref now the body's).",
 "a TIED court clearing a body's den → `site_cleared` under ST's ONE CONTEST PER SITE PER WEEK, ONE SIDE AT A TIME (ST §6.1 step 6d; RULINGS-ROUND5 A.3): the anchor court and the bodies it `harboured`s or `employed`s are one side, every other body its own challenger; when two challenger sides arrive in one week the stronger contests and the other HOLDS at the approach where it stood (the hold helper's FREEZE, RULINGS-ROUND6 B.6); after a won clearing the CLEARER NAMED holds the site " + R6 + "ST-7 · SEAMS-r5-22]."),
("A SEIZURE instead of a sale is the court's choice: it turns the flock `outlawed` (hostile, item 15) and clears it (ST §6.1 step 6). No new verb.",
 "A SEIZURE instead of a sale is ST §6.1 step 6c, open only under `outlawed`, or `curbed` after a refused `site_sale` — never by a stance flip in the same act (§7.1) " + R6 + "ST-5 · SEAMS-r5-8]. No new verb."),
# §9.5
("so a gang may try to BRIBE him (where his wages go unpaid — THE PATROLS' item-16 slot, PR) or to KILL him — the attempt is a DEED through CH's road arm and a hearing in its week (CH's kind; the body the counterparty); the warden's death is the DM's alone (no named fate).",
 "so a NAMED gang's own week may choose to BRIBE him (where his wages go unpaid — THE PATROLS' item-16 slot, PR) or to strike at him — the attempt is CH's `person_at_the_gate` ROAD-ARM card (CH §11's attempt arm: verdicts `withstood · bribed`, default `withstood`; WHERE `road (a, b)` with the way named, or `settlement`; `bribed` offered only where his wages go unpaid, its effect BD's own `bribe` row — the court's stance one step toward `tolerated` at its next `body_stance` fork), its ONE deed CH's `warden_attempted` (doer the named gang, target the warden; CH §2.2b's two rows); \"or to KILL him\" stays the gang's CHOICE, never an outcome — no verdict kills, and the warden's death is the DM's own `kill` (no named fate) " + R6 + "CH-2 · SEAMS-r5-12]."),
# §9.8 (d)
("never above `formidable` and never while held (MN's rule, M58) — the one road into a menace besides the DM's `PROMOTE_BODY` (BD16)",
 "never above `formidable` and never while held (MN's rule, M58); the absorption is REFUSED `menace_not_enlisting` unless the menace stands `raiding` in the course's country, and a counted deserter gang's people leave by the people ledger's `dm_removed` sink with cause `menace_absorbed` (`peopleLedger.js :: CONSERVATION_ENDPOINTS`: \"`SINKS: Object.freeze(['dm_removed', 'fell', 'mortality'])`\"; MN §6) " + R6 + "MN-2 · SEAMS-r5-16] — the one road into a menace besides the DM's `PROMOTE_BODY` (BD16)"),
# §9.9
("doer the claimer — the leader, the paragon or the company — target the body,",
 "doer the claimer — the leader, the paragon or the company — target the body; THE PARTY's claim is PT's ONE deed `body_ended` (PT §3.1, OD-PT-33 — B.5's one deed: no `hunt_won` beside it) " + R6 + "PT-1 · SEAMS-r5-19];"),
("(\"a standing bounty lowers the court's band one step\"; ROUTE ST — the band takes the input, BD never writes it),",
 "(\"a standing bounty lowers the court's band one step\"; ROUTE ST — the band takes the input, BD never writes it; its carrier is round 6's RESIDUE lane, RULINGS-ROUND6 B.7: \"V-ST's … bounty input (`settlementFundingBand` under `bodyEffectsEnabled`)\" " + R6 + "BD-r5-10's ST half · SEAMS-r5-23]),"),
# §9.10 choices
("[REFINED 2026-10-18 (fp-final r4) — the brief's \"`pay · hunt · wait`\": `hunt` is the court's OTHER act (its stance `hunted`, its bounty, `hunt_taken` — §9.9, §9.11) and `wait` is requirement 24's LEAVE; one vocabulary on the row, the landed one.]",
 "[REFINED 2026-10-18 (fp-final r4) — the brief's \"`pay · hunt · wait`\": `hunt` is the court's OTHER act (its stance `hunted`, its bounty, `hunt_taken` — §9.9, §9.11) and `wait` is requirement 24's LEAVE; one vocabulary on the row, the landed one.] " + R6 + "A.1: the court's CHOICES during the clock are A.1's `pay early · hunt · wait` — CH §12.4's words stand as the choices — and the row's engine line is the landed `pay · refuse · abandon` read through `homeRansomAnswer`; the two are one card: the DM's three choices and the court's own default line]"),
("open to the DM at any week (leave · tilt: pay early, order the hunt, refuse · decide); it is STANDING until its climax week, CLIMAX at the clock's end, and an EARLY act (the court's `pay`, the hunt's victory, the DM's decree) CLOSES it that week (B.6)",
 "open to the DM at any week (leave — wait · tilt: pay early, order the hunt · decide); it is STANDING until its climax week, CLIMAX at the clock's end, and an EARLY act (the court's `pay`, the hunt's victory, the DM's decision) CLOSES it that week (B.6) " + R6 + "FOLD-2 · SEAMS-r5-17 · A.1]"),
# §9.11
("(i) a person of THE WARDEN ARCHETYPE HOLDING the office (a paragon by CH's `isWardenParagon`, or a non-paragon office-holder whose roster role is `warden` — §2.3, B.13)",
 "(i) a person of THE WARDEN ARCHETYPE HOLDING the office (a paragon — the one CH's `securityOfficeOf(worldState, courtId)` returns, then `isWardenParagon` on it — or a non-paragon office-holder whose roster role is `warden` — §2.3, B.13 " + R6 + "CH-1 · SEAMS-r5-11])"),
("rides the HIDDEN WAYS of its jurisdiction — its detachment no larger than the way's capacity",
 "rides the HIDDEN WAYS of its jurisdiction BY ITS HOLDER'S KNOWLEDGE READ (`knownTrailsOf`'s office arm; never a traveller token — PR's `patrol` token is STRUCK, RULINGS-ROUND6 A.2 " + R6 + "BD-r5-7]) — its detachment no larger than the way's capacity"),
("DOER the LEADER the card named (`ledBy` — a paragon or a company through CH's `paragon_act` door; an office-holder on the person ledger by the same registered row), TARGET the body;",
 "DOER the LEADER the card named (a paragon or a company through CH's `paragon_act` door; an office-holder on the person ledger by the same registered row — the leader IS the doer, never a `ledBy` rider, RN §2.1 " + R6 + "BD-r5-22]), TARGET the body; a `beaten` close (the riders cut down) is the BODY's `fought` deed (§7.2, RN-1b);"),
("the TREASURY pays the detachment (the landed DEPLOYMENT upkeep — `UPKEEP_LEDGERS = ['deployments']`);",
 "the riders' PAY carries the detachment (a detachment is NO deployment record and pays NO deployment upkeep — PR §0.1; the riders' coin is the W-COIN `patrols` row when it lights; a menace-scale COLUMN alone pays deployment upkeep " + R6 + "PR-2 · SEAMS-r5-5]);"),
]
apply(pairs, 'c7')
