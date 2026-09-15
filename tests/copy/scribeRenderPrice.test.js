/**
 * tests/copy/scribeRenderPrice.test.js — THE PRICE THE SCRIBE QUOTES NAMES ITS UNIT (W5b car 2).
 *
 * WHAT THIS CLOSES, and it is a COPY defect before it is a code one. A render of a settlement's
 * dossier is one edge invocation per firing tab. Migration 202's header said "one render of a
 * settlement's dossier costs five credits whatever it draws" and `ScribeRedrawButton` said
 * "5 credits"; the code charged `spend_credits('dossierProse')` on EVERY tab, so a seven-to-ten-tab
 * render cost 35 to 50. Both sentences were true of a tab and false of a render, and neither named
 * which — a price with no unit is exactly the shape a per-tab charge hides in.
 *
 * Car 1 made the number true (migration 203's render session). This file holds the WORDS to it, on
 * the three surfaces that quote a Scribe price, so the next reader of any one of them alone is told
 * what the number buys:
 *   - the redraw button, the only control that spends this SKU;
 *   - migration 202's header, which is where an operator reads the price;
 *   - migration 202's `spend_credits` comment, which is what `\df+` prints.
 *
 * AND THE NEGATIVE CONTROL IS THE POINT. No Scribe surface may say "per tab", and none may quote a
 * bare credit figure for a render without its unit beside it.
 *
 * @enforced-by npx vitest run tests/copy/scribeRenderPrice.test.js
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const BUTTON = 'src/components/dossier/ScribeRedrawButton.jsx';
const MIG202 = 'supabase/migrations/202_scribe_claim.sql';
const MIG203 = 'supabase/migrations/203_scribe_render_session.sql';

describe('the Scribe quotes a price PER RENDER, and says so', () => {
  it('the redraw button label carries the unit beside the number', () => {
    const src = read(BUTTON);
    expect(src).toMatch(/Redraw the survey \(\$\{cost\} credits per render\)/);
    // The number itself is still the live resolver's, never a second copy of the table.
    expect(src).toMatch(/getCost\('dossierProse'\)/);
    // anchored: the two positive label pins above are the liveness proof that this file has a label at all.
    expect(src).not.toMatch(/credits per tab/i);
  });

  it('the redraw tooltip says what one render covers and that it is charged once', () => {
    const src = read(BUTTON);
    expect(src).toMatch(/One render covers every tab of the dossier/);
    expect(src).toMatch(/charged once/);
  });

  it('migration 202 says one render, one spend, however many tabs it draws', () => {
    const sql = read(MIG202);
    expect(sql).toMatch(/ONE RENDER, ONE SPEND, HOWEVER MANY TABS IT DRAWS/);
    // …and it names the file that makes it so, so the claim is checkable and not a hope.
    expect(sql).toMatch(/migration 203/);
    // ⛔ THE FALSE SENTENCE IS GONE, not merely contradicted further down.
    // anchored: the two positive header pins above prove the header is present and readable.
    expect(sql).not.toMatch(/one render of a\s+-- settlement's dossier costs five credits/);
    // anchored: as the line above — the corrected header is asserted present before its predecessor is asserted absent.
    expect(sql).not.toMatch(/no per-tab charge: one render/);
  });

  it("the spend_credits comment an operator reads with \\df+ carries the unit too", () => {
    const sql = read(MIG202);
    const comment = sql.slice(sql.lastIndexOf('comment on function public.spend_credits'));
    expect(comment).toMatch(/ONE PRICE PER RENDER/);
    expect(comment).toMatch(/one render, one spend, however many tabs it draws/);
  });

  it('⛔ NO SCRIBE SURFACE CLAIMS A PER-TAB PRICE', () => {
    for (const path of [BUTTON, MIG202, MIG203, 'src/store/scribeTransport.js']) {
      const src = read(path);
      // "per-tab charge" as a CLAIM about today. The files are allowed to describe the defect in
      // the past tense, which is why this looks for the present-tense claim shape only.
      expect(src.length, `${path} must be readable for this scan to mean anything`).toBeGreaterThan(200);
      // anchored: the length assertion on the line above is the liveness proof that the file was actually read.
      expect(src, `${path} must not price a render by the tab`).not.toMatch(/costs? .{0,20}per tab/i);
      // anchored: as the line above — the file is proven non-empty before either absence is claimed.
      expect(src, `${path} must not price a render by the tab`).not.toMatch(/charged per tab/i);
    }
  });

  it('⛔ AND THE PRICE ITSELF DID NOT MOVE: pricing.js is the owner\'s file and is untouched', () => {
    // W5b fixes how MANY times the SKU is charged, never what it costs. Repricing is decision 4 of
    // docs/DESIGN_SCRIBE_TIER_PROPOSAL.md and carries the owner's signature, not the chair's.
    const pricing = read('src/config/pricing.js');
    const block = pricing.match(/NEW_AI_COSTS\s*=\s*Object\.freeze\(\{[\s\S]*?\}\)/)?.[0];
    expect(block).toBeTruthy();
    expect(block).toMatch(/dossierProse:\s*5,/);
    expect(read(MIG202)).toMatch(/when 'dossierProse' then 5/);
  });
});
