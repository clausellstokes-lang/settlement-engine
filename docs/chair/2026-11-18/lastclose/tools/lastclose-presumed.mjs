// LASTCLOSE-DOORS (2026-11-18): the presumed-things walker's six fresh lines (proof (iii), the brief BRIEF-LASTCLOSE.md)
// and FR16's one strip, banked BY HAND with the register's own functions (the door's row form). REFUSES unless the
// fresh hits and fresh strips are EXACTLY the seven expected. Run from the tree root.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = process.cwd();
const S = await import(join(ROOT, 'tests/lint/presumedThings.shared.mjs'));
const REL = S.WIDENED_REGISTER_REL;
const reg = JSON.parse(readFileSync(join(ROOT, REL), 'utf8'));
const main = JSON.parse(readFileSync(join(ROOT, S.REGISTER_REL), 'utf8'));
const banked = new Set([...S.bankedKeys(main), ...S.bankedKeys(reg)]);
const hits = S.scanTree(ROOT);
const fresh = hits.filter((h) => !banked.has(S.hitKey(h.file, h.thing, h.text)));
const want = new Set([
  'src/data/dossierStateProse/defense.generated.js\tprison\tcdfd7209ff905ccc',
  'src/data/dossierStateProse/defense.generated.js\tprison\t0f84b6bcdfe54ade',
  'src/data/dossierStateProse/defense.generated.js\tprison\t214b6eabc4403e1c',
  'src/data/institutionDescVariants.js\tmarket\t7d046b6c7ec09d67',
  'src/data/institutionDescVariants.js\tmarket\t28300d5213e42c56',
  'src/data/institutionDescVariants.js\tmarket\td4df2c2a78573206',
]);
const got = new Set(fresh.map((h) => S.hitKey(h.file, h.thing, h.text)));
const strips = S.stripTree(ROOT);
const stripBanked = new Set(reg.strips.map((r) => S.stripKey(r[0], r[1])));
const stripFresh = strips.filter((x) => !stripBanked.has(S.stripKey(x.file, x.receiver)));
const okStrip = stripFresh.length === 1 && stripFresh[0].file === 'src/domain/facts/needNotBroughtIn.js' && stripFresh[0].receiver.startsWith("filterDeclared(declared, { facts: () => ({ tier }), poolId: 'trade-list:imports'");
if (got.size !== want.size || [...want].some((k) => !got.has(k)) || !okStrip) {
  console.error('REFUSED: the fresh hits are not exactly the seven'); for (const k of got) console.error(`  fresh ${k}`); for (const x of stripFresh) console.error(`  strip ${S.stripKey(x.file, x.receiver)}`);
  process.exit(3);
}
const REASON = 'after-base: lastclose-true';
reg.reasons[REASON] = "a line written after the instrument's base by the faults round or the last small round (FAULTS-DESKS point 64, FAULTS-ROWS point 65, LAST-VARIETY point 70) that is TRUE BY CONSTRUCTION wherever it prints, by a guarantee quoted here (CL21's proof (iii): every flagged thing guaranteed where the line prints, by its pool's key or by a declaration): (1) \"court or gaol\" in defense.generated.js is the ATOM'S OWN NAME in a line's `marks` (a declaration, not a printed sentence: the lines that carry it print only where a court or a gaol stands); (2) DS-DEF-3 Moderate v10 \"With no gaol at {settlement}, ...\" and (3) DS-DEF-3 Unsafe v4 \"{settlement} has no court and no gaol. ...\": each names the gaol only to deny it, and each declares `no court or gaol` in its own marks, so it prints only where neither stands; (4) to (6) the village Fish market's three cards (institutionDescVariants.js, FAULTS-ROWS FR20 (2): the catalogue line re-stated as the table's key, institutionalCatalog.js:178, and its twin \"... where salted and dried fish is sold ...\"; the pool #0's twin \"An open stall or small roofed market for salted and dried fish ...\") name the market their own house IS: BY THE POOL'S KEY (the card is the Fish market's own description). Banked BY HAND at the last close by the seat LASTCLOSE-DOORS under the chair's brief BRIEF-LASTCLOSE.md (the ruled ones) and the owner's word of 2026-11-18 ~19:07 UTC \"Yes to both\" (the refresh of the stored reference files), against the letter of the door's base rule, as record 405's rows, PT1's and the owner's four; owed after the release: each line declares through a door what guarantees it, and the row leaves";
const once = new Set();
for (const h of fresh) {
  const k = S.hitKey(h.file, h.thing, h.text); if (once.has(k)) continue; once.add(k);
  (reg.arm1[h.file] ||= []).push(S.bankRow(h, REASON));
}
// FR16 (the chair's ruling, 2026-11-18): the one strip of needNotBroughtIn.js :: filterDeclared(...) banked as the page's same
// site is (tradeListDisplay.js :: filterDeclared(declared, ... `trade-list:${...}` ...): `not-a-draw`)
reg.strips.push([stripFresh[0].file, stripFresh[0].receiver, 'not-a-draw']);
reg.strips.sort((p, q) => S.stripKey(p[0], p[1]).localeCompare(S.stripKey(q[0], q[1])));
const arm1 = {}; for (const f of Object.keys(reg.arm1).sort()) if (reg.arm1[f].length) arm1[f] = reg.arm1[f]; reg.arm1 = arm1;
writeFileSync(join(ROOT, REL), `${JSON.stringify(reg, null, 1)}\n`);
console.log(`banked ${once.size} rows under '${REASON}' and 1 strip site 'not-a-draw' (hits ${hits.length}, fresh ${fresh.length})`);
