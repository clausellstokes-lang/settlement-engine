# FRAME-5 · brief CF12 — a hall in criminal hands with a live crime wave: the owner's sheet says so

Written 2026-11-20T11:36Z (`date -u`) by FRAME-5 on `lane/frame-5-2026-11-20`. Source: the owner's word, relayed by the chair at 11:15 UTC: "Do all of these, every last one predeploy". The chair's law follows, each point vetoable by the owner. Your prompt names this unit; build it and nothing else.

**Read whole first; it binds you.** The COMMON section of `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md`, with every results path under `frame5/`. Then:
- `frame2/B2-WEIGHT-RESULTS.md`: the definition of weight, the count and its scripts, and "After B9".
- `frame2/B3-AUDIENCE-GATE.md`.
- `src/domain/tension/troubleCast.js`, `sideArchetypes.js` and `src/domain/summary/tonightSheet.js`.
- `tests/domain/tension/troubleWeight.test.js` and `tests/security/frameShareVeil.test.jsx` (the lane's own veil test).
- `src/domain/display/governanceAccount.js`, only where it reads `captureState`.
- Every file you change.

## The ruling (CF11 amended)

The ruling applies where a calm town's record holds BOTH of these:
- a power at `captureState` `'corrupted'` or `'capture'` (the rungs of `worldPulse/factionCapture.js`'s ladder at or above corrupted; read from `powerStructure.factions[].captureState`);
- a `crime_wave` among `history.currentTensions`.

That trouble is already there. On the OWNER's Open Tonight sheet, PEOPLE TO VOICE and its hooks draw from the crime wave's own sides as the record holds them: the first of the criminal power, and the keeper of the watch or the law house. Each is a person the record already holds, and each reason is a fact of the town.

## The design to build first, and to refute by measure if wrong

The weight machinery already turns a tension into the frame: its sides, its faces, its hooks, the audience gate and the variety ladder. So build CF12 as a FOURTH STRAIN of `troubleOfWeight`:
- **W4**, "a hall in criminal hands": the grade `'hall-captured'` as its OWN LAST ROW of `WEIGHT_GRADES`, so it is the weakest.
- The matter: the tension's type is `crime_wave`.
- Because the row is weakest, a town whose sheet another strain already opens keeps that opening, and every other town's grade ranks as before.
- Add one line to `FRAME_REASONS` only if the frame prints the strain. Measure whether it does. It must be one fixed sentence that says no more than the record holds (CF9: no word of alarm).

If the measure shows that a W4 strain would print something the owner's word does not ask for, or would move any town without both facts, STOP and report. Do not build around it.

## Measure first (figures in your results file before any edit)

1. Re-born the 330-town calm pool (B2's `pool.mjs 55`). FRAME-5 measured 6 towns with both facts at `9e23a094d`; the script is below.
   - town-20 and town-80: Town Mayor corrupted.
   - city-12: Merchant Guild Council.
   - city-14 and city-49: Merchant oligarchy.
   - metropolis-51: Ducal Governorship.
   In each, the crime wave's sides are the Guard, the vigilantes and the criminal power. Five keep today's sheet. city-14 is already framed by that same crime_wave (W2).
2. For each of the 6, record the sheet's PEOPLE TO VOICE and hooks as today's composer prints them. Then record who the frame machinery would cast on the crime wave's sides, by name, side and reason.
3. **frame-calm-city-14** (the chair's ruling): it keeps its sheet byte for byte UNLESS a side of the crime wave that the record holds is missing from its people to voice. If one is, name which and STOP before committing; the chair rules on that one town.

## Proofs, beyond the common list

1. **THE OWNER'S AUDIENCE ONLY.** Capture is what the share veil hides. For the reader's audience, and on every shared, public or printed-for-players path, the sheet is today's byte for byte:
   - the gallery read and the party link, with Reveal DM off and on;
   - no options, `{}`, `'player'` and `'gallery'`.
   Prove it in `tests/security/frameShareVeil.test.jsx`, keeping every existing assertion. Also show that a record whose `captureState` the veil has deleted gives no W4, as a second lock and never the first.
2. **No new draw.** The choice follows the record and the cast's own hash.
3. **Every calm town WITHOUT both facts keeps its sheet byte for byte.** That covers the 272 and the 57 other framed towns, proven as B9's were: owner and stranger digests over the whole pool, base against tip. The same holds for `troubleWeight.test.js`'s pins (none may move) and for every town in crisis on B7's pool.
4. **The count before and after, by size.** Expected 58 to 63 under today's standing. Give each of the 6 sheets before and after as plain text for the owner, in `frame5/CF12-SHEETS.txt`.
5. **RED FIRST.** A test over a town with both facts, red on the base.
6. **Figures.** Name the stored figures you move (expected none: render and cast only, nothing stored) and the tuning row (`WEIGHT_GRADES` gains a row: `tuningRegister` is already red on FRAME_TUNING; say whether yours adds to it). Re-record nothing.

**The measuring script** (FRAME-5's `cf12.mjs`; argv: the cached pool, a tree's `src/`):
```js
// FRAME-5 pre-brief measure for CF12: calm towns whose record holds a hall at captureState corrupted|capture AND a crime_wave tension.
import fs from 'node:fs';
const R = process.argv[3];
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const CAP = new Set(['corrupted', 'capture']);
const by = {}; const rows = [];
for (const { seed, tier, s } of towns) {
  const ps = s.powerStructure || {};
  const facs = (ps.factions || []).filter((f) => CAP.has(f?.captureState)).map((f) => `${f.faction || f.name}:${f.captureState}`);
  const rels = (ps.factionRelationships || []).filter((r) => CAP.has(r?.captureState) || r?.type === 'corrupted').map((r) => `${(r.parties || [r.a, r.b]).join('/')}:${r.type}/${r.captureState}`);
  const crime = (s.history?.currentTensions || []).filter((t) => t?.type === 'crime_wave');
  if ((facs.length || rels.length) && crime.length) {
    const framed = !!troubleOfWeight(s);
    by[tier] = (by[tier] || 0) + 1;
    rows.push(`${seed} ${tier} framed=${framed} facs=[${facs}] rels=[${rels}] crimeSides=${JSON.stringify(crime.map((t) => t.factions))}`);
  }
}
console.log('both facts, by tier:', JSON.stringify(by), 'total', rows.length); rows.forEach((r) => console.log(r));
```

Unit name: `CF12`. Results: `docs/chair/2026-11-20/content/frame5/CF12-CAPTURED-HALL-RESULTS.md`.
