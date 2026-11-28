# THE WF-0 CASE UNDER K1b: TWO SEATINGS, KEPT FOR THE OWNER (the chair's ruling K1b-4; neither is applied)

Under K1b's id-keyed founding draw, the soak's planned patron host soak-a founds no rite that draws pilgrims. So `tests/domain/faithObservationFloorWf0.test.js` is TRUE red, 2 of 15:
- (e) `plan.preconditionsMet` is false;
- (f) the minted set holds no `drawsPilgrims` rite.

The measure is in `../K1b-REKEYS.md` (the K1b-2 table). The owner chooses the seating at the soak redo. Both patches apply to the fixture `scripts/audit/whole-world-soak-deity-fixture.mjs` (and test line 390), and each was run in a scratch copy:

| patch | what it changes | faithObservationFloorWf0 | statecraftExposureBand (the fixture's other consumer) |
|---|---|---|---|
| `k1b3-V1.patch` | the host choice only (`patronHostId: 'soak-b'`, `rivalHostId: 'soak-a'`) | 14 of 15: (e) and (f) green; (c) RED (it pins the patron host's deity as the Dawn Warden; soak-b's patron is the Ash Tyrant) | 2 of 2 |
| `k1b3-V2.patch` | V1 plus the deities mirrored (soak-a the Ash Tyrant; soak-b the Dawn Warden plus an Ash Tyrant cult; soak-c a Dawn Warden cult) | 15 of 15 | 1 RED: STATECRAFT-BAND U1, `expect.soft(scandals).toBeLessThanOrEqual(57)` reads 95 |
