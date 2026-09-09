/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import PageHeader from '../../src/components/primitives/PageHeader.jsx';
import LifecycleSpine from '../../src/components/primitives/LifecycleSpine.jsx';
import Segmented from '../../src/components/primitives/Segmented.jsx';
import Stat from '../../src/components/primitives/Stat.jsx';
import Page from '../../src/components/primitives/Page.jsx';
import Disclosure from '../../src/components/primitives/Disclosure.jsx';

describe('foundation primitives', () => {
  afterEach(() => cleanup());

  test('PageHeader renders eyebrow, title, subtitle and actions', () => {
    render(
      <PageHeader
        eyebrow="Your saves"
        title="Library"
        subtitle="Every settlement you have kept."
        actions={<button>New settlement</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Library' })).toBeTruthy();
    expect(screen.getByText('Your saves')).toBeTruthy();
    expect(screen.getByText('Every settlement you have kept.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New settlement' })).toBeTruthy();
  });

  test('LifecycleSpine marks the current stage and renders all steps', () => {
    render(<LifecycleSpine stage="canon" />);
    for (const label of ['Draft', 'Saved', 'Canon', 'In the Realm', 'Shared']) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    const current = document.querySelector('[aria-current="step"]');
    expect(current).toBeTruthy();
    expect(current.textContent).toContain('Canon');
  });

  test('LifecycleSpine invokes onStep for reached steps', () => {
    const onStep = vi.fn();
    render(<LifecycleSpine stage="canon" onStep={onStep} />);
    fireEvent.click(screen.getByRole('button', { name: /Draft/i }));
    expect(onStep).toHaveBeenCalledWith('draft');
  });

  test('Segmented toggles the active option', () => {
    const onChange = vi.fn();
    render(
      <Segmented
        ariaLabel="View"
        value="raw"
        onChange={onChange}
        options={[{ id: 'raw', label: 'Raw' }, { id: 'narrated', label: 'Narrated' }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Raw' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Narrated' }));
    expect(onChange).toHaveBeenCalledWith('narrated');
  });

  test('Stat renders a label and value', () => {
    render(<Stat label="Population" value="2,400" />);
    expect(screen.getByText('Population')).toBeTruthy();
    expect(screen.getByText('2,400')).toBeTruthy();
  });

  test('Page caps its width and renders children', () => {
    render(<Page max={460}>Sign in</Page>);
    const inner = screen.getByText('Sign in');
    expect(inner.style.maxWidth).toBe('460px');
  });

  test('Disclosure fires onFirstOpen once on first reveal', () => {
    const onFirstOpen = vi.fn();
    render(<Disclosure title="Deep constraints" onFirstOpen={onFirstOpen}>Trade</Disclosure>);
    const toggle = screen.getByRole('button', { name: /Deep constraints/i });
    fireEvent.click(toggle); // open
    fireEvent.click(toggle); // close
    fireEvent.click(toggle); // open again
    expect(onFirstOpen).toHaveBeenCalledTimes(1);
  });
});
