/** @vitest-environment jsdom */
/**
 * launchGatedExport.test.jsx - the launch teaser an export control becomes before launch.
 *
 * THE OWNER (2026-11-03): "Actually change it. Every purple gold button should say what ot is
 * but have a pill once hovered that says available at launch. Or opens a pop up ( everything
 * outside of the pop up goes dark opaque) that in theme that says available at launch. They can
 * click an okay button or the close button to the pop up or outside if the pop up to close it
 * and continue on."
 *
 * LaunchGatedExport wraps one control; AvailableAtLaunchDialog is the one pop-up.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Button from '../../src/components/primitives/Button.jsx';
import LaunchGatedExport from '../../src/components/primitives/LaunchGatedExport.jsx';
import { AVAILABLE_AT_LAUNCH_SENTENCE } from '../../src/components/primitives/AvailableAtLaunchDialog.jsx';

afterEach(cleanup);

const PILL = 'Available at launch';

function mount(gated = true) {
  const onClick = vi.fn();
  render(
    <LaunchGatedExport gated={gated}>
      <Button variant="info" size="sm" onClick={onClick}>Export PDF</Button>
    </LaunchGatedExport>,
  );
  return { onClick, button: screen.getByRole('button', { name: 'Export PDF' }) };
}

/** The tooltip pill that describes the control, by its aria-describedby. */
function describedPill(button) {
  const id = button.getAttribute('aria-describedby');
  return id ? document.getElementById(id) : null;
}

describe('LaunchGatedExport - a gated export keeps its label and wears the launch skin', () => {
  it('keeps its own label, is not disabled, and wears the launch skin', () => {
    const { button } = mount();
    expect(button.textContent).toBe('Export PDF');
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('data-skin')).toBe('launch');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('is described by the Available-at-launch pill, shown on hover and hidden on leave', () => {
    const { button } = mount();
    const pill = describedPill(button);
    expect(pill?.querySelector('[data-launch-pill]')?.textContent).toBe(PILL);
    expect(pill.style.display).toBe('none');
    fireEvent.mouseEnter(button.parentElement);
    expect(pill.style.display).toBe('block');
    fireEvent.mouseLeave(button.parentElement);
    expect(pill.style.display).toBe('none');
  });

  it('shows the pill on keyboard focus too', () => {
    const { button } = mount();
    const pill = describedPill(button);
    fireEvent.focus(button);
    expect(pill.style.display).toBe('block');
    fireEvent.blur(button);
    expect(pill.style.display).toBe('none');
  });

  it('a click opens the dialog and the control\'s own handler never fires', () => {
    const { button, onClick } = mount();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    const dialog = screen.getByRole('dialog', { name: PILL });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.textContent).toContain(AVAILABLE_AT_LAUNCH_SENTENCE);
  });

  it('a touch press (no hover first) opens the dialog all the same', () => {
    const { button, onClick } = mount();
    fireEvent.touchStart(button);
    fireEvent.touchEnd(button);
    fireEvent.click(button);
    expect(screen.getByRole('dialog', { name: PILL })).toBeTruthy();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('AvailableAtLaunchDialog - the four ways out, and focus home', () => {
  it('OK closes it and focus returns to the control', () => {
    const { button, onClick } = mount();
    button.focus();
    fireEvent.click(button);
    const ok = screen.getByRole('button', { name: 'OK' });
    expect(document.activeElement && screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    fireEvent.click(ok);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('the close mark closes it', () => {
    const { button } = mount();
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('a press on the dimmed ground closes it; a press on the plate does not', () => {
    const { button } = mount();
    fireEvent.click(button);
    const dialog = screen.getByRole('dialog');
    fireEvent.mouseDown(dialog);
    expect(screen.getByRole('dialog')).toBeTruthy();
    const ground = dialog.parentElement;
    expect(ground.getAttribute('data-launch-dialog')).toBe('');
    fireEvent.mouseDown(ground);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Escape closes it', () => {
    const { button } = mount();
    fireEvent.click(button);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('LaunchGatedExport - an open export renders exactly as given', () => {
  it('not gated: no skin, no pill, no dialog, and the handler fires', () => {
    const { button, onClick } = mount(false);
    expect(button.getAttribute('data-skin')).toBeNull();
    expect(button.getAttribute('aria-describedby')).toBeNull();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
