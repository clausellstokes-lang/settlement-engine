/**
 * @vitest-environment jsdom
 *
 * tests/components/whoRunsThisTownPanel.test.jsx — THE DM VIEW renders on the DM's layer only (the
 * allegiance train, car 3, ALLEGIANCE-CAR3, 2026-11-08; design §9; the W7 receipt ruling: a DM layer
 * prints on the DM's own surfaces only — never a player surface or a public page).
 *
 * On a soak city holding agents, a handler and a boost: the DM's Power tab shows the panel, its five
 * blocks and the hidden allegiance's names; the player view and the public dossier render none of it
 * (no panel, no agent's guild beside the agent, no hidden boost's sentence).
 */
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { dmPowerViewOf } from '../../src/domain/people/patronage.js';

afterEach(cleanup);

/** soak1k-785: a metropolis whose second and third answer to criminal powers, with a hidden boost. */
let s;
beforeAll(async () => { await ensureLaws(); s = birth(785).settlement; });

const tab = (props) => render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} {...props} />).container;

describe('who really runs this town — the DM layer only', () => {
  it('fixture premise: agents in the ruling three, a hidden boost, handlers', () => {
    const v = dmPowerViewOf(s);
    expect(v?.rulingThree.some((f) => f.answersTo)).toBe(true);
    expect(v?.boosts.some((b) => b.hidden)).toBe(true);
    expect(v?.answers.length).toBeGreaterThan(0);
  });

  it('the DM view renders the panel and its blocks; the hunts slot is mounted empty and hidden', () => {
    const c = tab({});
    const panel = c.querySelector('[data-testid="who-runs-this-town"]');
    expect(panel).toBeTruthy();
    const text = panel?.textContent || '';
    for (const h of ['The ruling three of', 'Who answers to whom', 'The hall', 'The boosts']) expect(text).toContain(h);
    const v = dmPowerViewOf(s);
    const hidden = v?.boosts.find((b) => b.hidden);
    expect(text).toContain(String(hidden?.line));
    const slot = panel?.querySelector('[data-slot="who-hunts-whom"]');
    expect(slot?.hasAttribute('hidden')).toBe(true);
    expect(slot?.textContent).toBe('');
  });

  it('the player view and the public dossier render none of it', () => {
    const v = dmPowerViewOf(s);
    const secrets = [
      ...v.boosts.filter((b) => b.hidden).map((b) => b.line),
      ...v.rulingThree.filter((f) => f.answersTo).map((f) => `answers to ${f.answersTo.guild}`),
      'Who really runs this town',
    ];
    for (const props of [{ playerView: true }, { publicDossier: true }, { playerView: true, publicDossier: true }]) {
      const c = tab(props);
      expect(c.querySelector('[data-testid="who-runs-this-town"]'), JSON.stringify(props)).toBeNull();
      for (const x of secrets) expect(c.textContent, `${JSON.stringify(props)}: ${x}`).not.toContain(x);
      cleanup();
    }
  });
});
