/**
 * domain/display/noForceLine.js — THE DEFENSE TAB'S LINE FOR A PLACE WITH NO ORGANIZED FORCE, FOR EVERY SURFACE
 * (TAIL-EXPORTS-PDF batch 1, the chair's ruling E1 of 2026-11-14).
 *
 * The Defense tab prints it inline (`DefenseTab.jsx`, `!hasAnyForce`); the PDF printed a line of its own, "No organized
 * defensive force. Defense relies on armed citizens." (240 of the census's 720 towns), beside a chapter headline that
 * said "no one under arms". The tab's words live here; the PDF prints them, and its headline says "no organized force".
 * The tab's switch to this leaf is the DEFECON group's (it holds DefenseTab.jsx).
 */

/** The tab's two halves: the bold lead, and the rest. */
export const NO_FORCE_LEAD = 'No organized force.';
export const NO_FORCE_REST = 'Defense relies on individual armed citizens. No command structure, no training, no coordinated response.';
