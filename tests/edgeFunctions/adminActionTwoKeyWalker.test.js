/**
 * adminActionTwoKeyWalker.test.js — the STRUCTURAL walker for the admin-actions
 * two-key rule (E-D family: manifest + source-scan, owner-ordered 2026-07-21).
 *
 * The account-level destructive-action gate is only as safe as its COVERAGE: a
 * new switch case that nobody classifies could quietly ship an
 * account-mutating action with no two-key confirm. This walker removes that
 * habitat. It parses the edge function's switch and asserts EVERY case label is
 * classified into exactly ONE of the three frozen sets in _shared/twoKey.ts —
 * PROTECTED (two-key: retype id + fresh password amr), MODERATION (typed-item-id
 * confirm, staff-only), or UNGATED (reads + non-destructive staff writes). A new,
 * unclassified action FAILS here with a message telling the author how to comply.
 *
 * It also pins the CLIENT half: no protected action in AdminUsersPanel may reach
 * the edge through a bare runAction/callAdmin — it must route through the
 * openTwoKey confirm helper.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = process.cwd();
const twoKeySrc = readFileSync(resolve(repo, 'supabase/functions/_shared/twoKey.ts'), 'utf8');
const edgeSrc = readFileSync(resolve(repo, 'supabase/functions/admin-actions/index.ts'), 'utf8');
const panelSrc = readFileSync(resolve(repo, 'src/components/admin/AdminUsersPanel.jsx'), 'utf8');

/** Extract the string members of an `export const NAME ... = new Set([ ... ])`. */
function extractSet(name) {
  const m = twoKeySrc.match(new RegExp(`export const ${name}[^=]*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`));
  if (!m) throw new Error(`twoKey.ts is missing the ${name} manifest`);
  return [...m[1].matchAll(/"([a-z_]+)"/g)].map((x) => x[1]);
}

const PROTECTED = extractSet('PROTECTED_ACTION_SET');
const MODERATION = extractSet('MODERATION_ACTION_SET');
const UNGATED = extractSet('UNGATED_ACTION_SET');

/** Every `case "X":` label in the edge function's action switch. */
const caseLabels = [...edgeSrc.matchAll(/case\s+"([a-z_]+)"\s*:/g)].map((m) => m[1]);

describe('admin-actions two-key walker — manifest covers the switch exactly', () => {
  it('the switch has case labels to classify (non-vacuous)', () => {
    expect(caseLabels.length).toBeGreaterThan(40);
    // no duplicate case labels (a duplicate would silently shadow)
    expect(new Set(caseLabels).size).toBe(caseLabels.length);
  });

  it('the three manifest sets are pairwise DISJOINT', () => {
    const all = [...PROTECTED, ...MODERATION, ...UNGATED];
    expect(new Set(all).size, 'an action is classified into more than one set').toBe(all.length);
  });

  it('EVERY switch case is classified into exactly one set (new actions must be classified)', () => {
    const classified = new Set([...PROTECTED, ...MODERATION, ...UNGATED]);
    const unclassified = caseLabels.filter((c) => !classified.has(c));
    expect(
      unclassified,
      `admin-actions switch case(s) not classified in _shared/twoKey.ts:\n  ${unclassified.join('\n  ')}\n` +
        'Add each to PROTECTED_ACTION_SET (account premium/tier/entitlement change, ' +
        'ban/disable, role change → two-key), MODERATION_ACTION_SET (reversible ' +
        'staff content moderation → typed-item-id confirm), or UNGATED_ACTION_SET ' +
        '(reads + non-destructive staff writes). Fail closed: if unsure, PROTECTED.',
    ).toEqual([]);
  });

  it('NO manifest entry is a phantom (every classified action is a real switch case)', () => {
    const labels = new Set(caseLabels);
    const phantom = [...PROTECTED, ...MODERATION, ...UNGATED].filter((a) => !labels.has(a));
    expect(
      phantom,
      `twoKey.ts classifies action(s) that are not switch cases:\n  ${phantom.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the guard is invoked at the top of the switch dispatch (isProtectedAction before switch)', () => {
    const guardAt = edgeSrc.indexOf('isProtectedAction(action)');
    const switchAt = edgeSrc.indexOf('switch (action)');
    expect(guardAt, 'index.ts must call isProtectedAction(action)').toBeGreaterThan(0);
    expect(guardAt, 'the two-key guard must run BEFORE the switch dispatch').toBeLessThan(switchAt);
    // checkTwoKey is what enforces the retype-id + fresh-amr rule.
    expect(edgeSrc).toMatch(/checkTwoKey\(/);
  });
});

describe('admin-actions two-key walker — client routes protected actions through the modal', () => {
  it('AdminUsersPanel wires the two-key confirm helper', () => {
    expect(panelSrc).toMatch(/openTwoKey\(/);
    expect(panelSrc).toMatch(/reauthenticateWithPassword/);
  });

  it('no protected action reaches the edge via a bare runAction/callAdmin (must go through openTwoKey)', () => {
    for (const a of PROTECTED) {
      const bare = new RegExp(`(?:runAction|callAdmin)\\(\\s*\\{[^}]*action:\\s*'${a}'`);
      expect(
        panelSrc.match(bare),
        `AdminUsersPanel invokes protected action '${a}' via a bare runAction/callAdmin — ` +
          'route it through openTwoKey (retype id + password) instead.',
      ).toBeNull();
    }
  });

  it('every protected action literal in the panel lives inside an openTwoKey buildBody', () => {
    for (const a of PROTECTED) {
      const litRe = new RegExp(`action:\\s*'${a}'`);
      if (!litRe.test(panelSrc)) continue; // this action isn't exposed in the panel
      const inBuildBody = new RegExp(`buildBody:[\\s\\S]{0,80}?=>\\s*\\(\\{[^}]*action:\\s*'${a}'`);
      expect(
        panelSrc,
        `protected action '${a}' must be constructed inside an openTwoKey buildBody`,
      ).toMatch(inBuildBody);
    }
  });
});
